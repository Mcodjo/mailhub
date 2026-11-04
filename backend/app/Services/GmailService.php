<?php

namespace App\Services;

use App\Models\GmailToken;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Gestion des tokens Gmail OAuth2 et des appels API associés.
 *
 * Règles de sécurité (SECURITY.md) :
 *  - Scope limité à https://mail.google.com/ — aucun appel de lecture Gmail
 *  - Tokens jamais dans les logs (Http::withoutRedirecting + no-log)
 *  - access_token / refresh_token jamais exposés en réponse API
 */
class GmailService
{
    /**
     * Retourne un access token valide pour l'utilisateur.
     * Rafraîchit automatiquement si expiré.
     *
     * @throws RuntimeException GMAIL_OAUTH_REQUIRED si absent ou révoqué
     */
    public function getValidAccessToken(User $user): string
    {
        $token = $user->gmailToken;

        if (! $token || $token->isRevoked()) {
            throw new RuntimeException('GMAIL_OAUTH_REQUIRED');
        }

        if ($token->isExpired()) {
            $token = $this->refreshAccessToken($token);
        }

        return $token->access_token; // decrypté par le cast
    }

    /**
     * Rafraîchit l'access token via refresh_token.
     * Met à jour la ligne en base. En cas d'échec, révoque logiquement.
     */
    public function refreshAccessToken(GmailToken $token): GmailToken
    {
        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id'     => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'refresh_token' => $token->refresh_token,
            'grant_type'    => 'refresh_token',
        ]);

        if ($response->failed()) {
            // Le refresh_token a été révoqué côté Google
            $token->update(['revoked_at' => now()]);
            throw new RuntimeException('GMAIL_OAUTH_REQUIRED');
        }

        $data = $response->json();

        $token->update([
            'access_token' => $data['access_token'],
            'expires_at'   => now()->addSeconds((int) $data['expires_in']),
        ]);

        return $token->fresh();
    }

    /**
     * CDC-1 — Vérifie que l'alias est configuré comme "Envoyer en tant que"
     * dans le compte Gmail connecté.
     *
     * Appelle Gmail API : GET /gmail/v1/users/me/settings/sendAs/{aliasEmail}
     * Retourne true uniquement si verificationStatus === 'accepted'.
     */
    public function verifySendAs(User $user, string $aliasEmail): bool
    {
        $accessToken = $this->getValidAccessToken($user);

        $response = Http::withToken($accessToken)
            ->get("https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs/{$aliasEmail}");

        if ($response->failed()) {
            return false;
        }

        return ($response->json('verificationStatus') ?? '') === 'accepted';
    }

    /**
     * Révoque le token côté Google puis marque la ligne comme révoquée en base.
     */
    public function revokeToken(GmailToken $token): void
    {
        // Tente la révocation Google (best-effort — on continue même en échec réseau)
        Http::asForm()->post('https://oauth2.googleapis.com/revoke', [
            'token' => $token->access_token,
        ]);

        $token->update(['revoked_at' => now()]);
    }

    /**
     * Génère la chaîne XOAUTH2 pour SMTP (base64 du format SASL).
     * Utilisée lors de l'envoi via smtp.gmail.com:587.
     */
    public function buildXoauth2String(string $userEmail, string $accessToken): string
    {
        return base64_encode("user={$userEmail}\x01auth=Bearer {$accessToken}\x01\x01");
    }

    /**
     * Envoie un email via l'API Gmail (POST /gmail/v1/users/me/messages/send).
     *
     * Construit un message RFC 2822 multipart/alternative (texte + HTML),
     * l'encode en base64url et le soumet à l'API.
     *
     * @param  array{
     *   from_email: string,
     *   from_name: string|null,
     *   to: string[],
     *   cc: string[],
     *   subject: string,
     *   body_text: string|null,
     *   body_html: string|null,
     *   in_reply_to: string|null,
     *   references: string|null,
     *   gmail_thread_id: string|null,
     * } $params
     *
     * @return array{message_id: string, gmail_id: string, gmail_thread_id: string}
     *
     * @throws RuntimeException GMAIL_OAUTH_REQUIRED | GMAIL_SEND_FAILED
     */
    public function sendViaApi(User $user, array $params): array
    {
        $accessToken = $this->getValidAccessToken($user);

        $raw = $this->buildRfc2822($params);

        // base64url sans padding (exigé par l'API Gmail)
        $encoded = rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');

        $body = ['raw' => $encoded];
        if (! empty($params['gmail_thread_id'])) {
            $body['threadId'] = $params['gmail_thread_id'];
        }

        $response = Http::withToken($accessToken)
            ->post('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', $body);

        if ($response->failed()) {
            throw new RuntimeException('GMAIL_SEND_FAILED');
        }

        $data = $response->json();

        // Extraire le Message-ID de nos headers (fourni dans le message envoyé)
        preg_match('/Message-ID:\s*(<[^>]+>)/im', $raw, $m);

        return [
            'message_id'      => $m[1] ?? "<{$data['id']}@gmail.com>",
            'gmail_id'        => $data['id'],
            'gmail_thread_id' => $data['threadId'],
        ];
    }

    // -------------------------------------------------------------------------

    /**
     * Construit un message RFC 2822 multipart/alternative complet.
     */
    private function buildRfc2822(array $p): string
    {
        $boundary = '----=_Part_' . bin2hex(random_bytes(8));
        $messageId = '<' . bin2hex(random_bytes(16)) . '@domial.local>';

        $from = $p['from_name']
            ? '"' . $this->encodeHeader($p['from_name']) . '" <' . $p['from_email'] . '>'
            : $p['from_email'];

        $to = implode(', ', (array) $p['to']);

        $lines = [
            "MIME-Version: 1.0",
            "Date: " . now()->format('r'),
            "Message-ID: {$messageId}",
            "From: {$from}",
            "To: {$to}",
        ];

        if (! empty($p['cc'])) {
            $lines[] = "Cc: " . implode(', ', (array) $p['cc']);
        }

        $lines[] = "Subject: =?UTF-8?B?" . base64_encode($p['subject']) . "?=";

        if (! empty($p['in_reply_to'])) {
            $lines[] = "In-Reply-To: {$p['in_reply_to']}";
        }
        if (! empty($p['references'])) {
            $lines[] = "References: {$p['references']}";
        }

        $lines[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
        $lines[] = "";

        // Partie texte
        $text = $p['body_text'] ?? strip_tags($p['body_html'] ?? '');
        $lines[] = "--{$boundary}";
        $lines[] = "Content-Type: text/plain; charset=UTF-8";
        $lines[] = "Content-Transfer-Encoding: quoted-printable";
        $lines[] = "";
        $lines[] = quoted_printable_encode($text);
        $lines[] = "";

        // Partie HTML
        $html = $p['body_html'] ?? nl2br(htmlspecialchars($text, ENT_QUOTES));
        $lines[] = "--{$boundary}";
        $lines[] = "Content-Type: text/html; charset=UTF-8";
        $lines[] = "Content-Transfer-Encoding: quoted-printable";
        $lines[] = "";
        $lines[] = quoted_printable_encode($html);
        $lines[] = "";
        $lines[] = "--{$boundary}--";

        return implode("\r\n", $lines);
    }

    private function encodeHeader(string $value): string
    {
        // Passe-plat si ASCII pur, sinon encoded-word UTF-8
        if (mb_detect_encoding($value, 'ASCII', true)) {
            return addcslashes($value, '"\\');
        }
        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }
}
