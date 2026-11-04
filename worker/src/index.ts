/**
 * MailPro Hub — Cloudflare Worker de reception (CDC module 4).
 *
 * Evenement `email` de Cloudflare Email Routing :
 * 1. extraction des metadonnees du message (from, to, headers, annonces MIME)
 * 2. POST JSON signe HMAC-SHA256 vers POST /api/inbound-mail du backend
 * 3. rejet explicite du message si le backend refuse (Cloudflare renvoye une rebond SMTP)
 *
 * Le parsing complet du corps (text/html) est fait cote backend sur l'email brut
 * presse par le Worker : eviter un double parsing MIME en memoire dans l'edge.
 */

interface Env {
  API_BASE_URL: string;
  WEBHOOK_SECRET: string; // secret wrangler (shared HMAC secret)
}

export default {
  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    if (!env.WEBHOOK_SECRET || !env.API_BASE_URL) {
      message.setReject("Worker misconfigured: missing WEBHOOK_SECRET or API_BASE_URL");
      return;
    }

    const body = JSON.stringify({
      from: message.from,
      recipient: message.to,
      subject: message.headers.get("subject") ?? "",
      raw_size: (message.rawSize ?? 0),
      headers: Object.fromEntries(message.headers),
      has_attachments: message.rawSize > 1024 * 1024 ? undefined : (message.headers.get("content-type")?.includes("multipart/mixed") ?? false),
      received_at: new Date().toISOString(),
    });

    const signature = await hmacSha256(env.WEBHOOK_SECRET, body);

    const resp = await fetch(`${env.API_BASE_URL}/api/inbound-mail`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-mailprohub-signature": `sha256=${signature}`,
      },
      body,
    });

    if (!resp.ok) {
      message.setReject(`Backend rejected inbound mail: HTTP ${resp.status}`);
    }
  },
};

async function hmacSha256(secret: string, body: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
