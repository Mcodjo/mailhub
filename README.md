# MailPro Hub

Webmail SaaS multi-domaines : reception via Cloudflare Email Routing + Worker,
envoi via Gmail SMTP OAuth 2.0, interface webmail unifiee.
Source de verite produit : `MailPro Hub — CDC.html` (v2.0).

##好听 debut rapide

```bash
# Backend (Laravel)
cd backend
cp .env.example .env       # renseigner DB, APP_ENCRYPTION_KEY, CLOUDFLARE_WEBHOOK_SECRET
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Frontend (React)
cd frontend
npm install
npm run dev

# Worker Cloudflare (reception mails)
cd worker
npm install
npx wrangler deploy
```

Cadre d'exécution local : outils installes en espace utilisateur.
```bash
export PATH="$HOME/tools:$HOME/tools/node-v22.20.0-linux-x64/bin:$PATH"   # composer + node/npm
```

## Structure

```
backend/    API Laravel : auth, wizards, webhook inbound, queues, WebSocket
frontend/   Webmail React : 3 colonnes, redaction TipTap
worker/     Cloudflare Worker : evenement email -> POST signe HMAC vers l'API
doc/        ARCHITECTURE, BACKLOG, DECISIONS (ADR), API, DATA, RUNBOOK, SECURITY, TESTS
```

## Documents cles

- [CDC v2.0](MailPro%20Hub%20—%20CDC.html) — source de verite produit
- [Architecture](doc/ARCHITECTURE.md)
- [Backlog](doc/BACKLOG.md)
- [ADR](doc/DECISIONS/ADR-0001.md) — stack Laravel + MySQL

## Securite (non negociable)

- Tokens OAuth Gmail chiffres au niveau du champ — jamais exposes client ni en logs.
- Webhook `/api/inbound-mail` : verification HMAC-SHA256, rejet si signature invalide.
- Isolation stricte des mails par utilisateur (filtre `user_id` sur chaque requete).
- Scope OAuth configure au strict minimum l'envoi.
