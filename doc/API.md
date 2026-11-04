# API — MailPro Hub

Contrat d'API REST (version OpenAPI a produire a la phase 1). Conventions communes.

## Conventions d'erreurs (toutes reponses)

```json
{
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Description actionnable pour le client",
    "field": "champ optionnel si erreur de validation"
  }
}
```

Codes : `INVALID_SIGNATURE` (403), `UNAUTHORIZED` (401), `VALIDATION_FAILED` (422),
`NOT_FOUND` (404), `DOMAIN_DNS_NOT_PROPAGATED` (409), `GMAIL_OAUTH_REQUIRED` (409),
`GMAIL_ALIAS_NOT_VERIFIED` (409 — CDC-1), `RATE_LIMITED` (429), `PROVIDER_LIMIT_EXCEEDED` (429).

## Endpoints — Auth (F01)

| Methode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | inscription email+mdp (bcrypt) |
| POST | `/api/auth/login` | connexion, session + CSRF |
| POST | `/api/auth/logout` | invalidation session |
| POST | `/api/auth/reset-password` | demande de reinitialisation par email |
| POST | `/api/auth/reset-password/{token}` | definition nouveau mot de passe |
| GET  | `/api/auth/google/redirect` | connexion via Google (optionnelle, scope authentification) |

## Endpoints — Domaines et wizard (F02)

| Methode | Route | Description |
|---|---|---|
| POST | `/api/domains` | enregistre le domaine + prefixe(s), initialise le wizard |
| POST | `/api/domains/{id}/cloudflare/connect` | stocke token API CF chiffre, teste les permissions |
| POST | `/api/domains/{id}/cloudflare/enable-email-routing` | active Email Routing + MX |
| GET  | `/api/domains/{id}/dns` | tableau DNS attendu (MX, SPF, DKIM, DMARC) |
| POST | `/api/domains/{id}/dns/verify` | relance manuelle de verification de propagation (CDC : 15 min a 48 h, jamais bloquant sans message explicite) |
| POST | `/api/domains/{id}/worker/deploy` | deploie le Worker sur le domaine |
| POST | `/api/domains/{id}/activate` | activation finale uniquement si tous les tests passent |

## Endpoint — Reception (F03, F05)

| Methode | Route | Description |
|---|---|---|
| POST | `/api/inbound-mail` | webhook Worker -> backend. Verification HMAC-SHA256 (header `x-mailprohub-signature`), rejet si signature invalide. `idempotence : mail-id derive des headers` |

## Endpoints — Mails (F05, F07, F08)

| Methode | Route | Description |
|---|---|---|
| GET | `/api/aliases` | liste des boites connectees (reception/envoi) |
| GET | `/api/emails?alias=&status=unread&page=1` | liste paginee (20 par page, tri `created_at` descend) — filtre strict `user_id` |
| GET | `/api/emails/{id}` | lecture complete + marquer lu |
| PATCH | `/api/emails/{id}/read` | bascule lu/non-lu |
| DELETE | `/api/emails/{id}` | suppression (soft) |
| GET | `/api/threads/{id}` | conversation groupee |
| POST | `/api/emails/send` | envoyer via Gmail SMTP (erreur `GMAIL_ALIAS_NOT_VERIFIED` si alias refuse par le compte connecte — CDC-1) |
| POST | `/api/emails/{mailable_id}/reply` | reponse au thread (`In-Reply-To` maintenu) |
| GET | `/api/sent` | boite Envoyes paginee |

## Endpoints — Temps reel (F09)

| Methode | Route | Description |
|---|---|---|
| GET | `/api/broadcast/auth` (Reverb) | auth WebSocket (canal `private-user.{id}`) |
| Fallback | polling `GET /api/emails/unread-count` | 30 s |

## Endpoints — OAuth Gmail (F04)

| Methode | Route | Description |
|---|---|---|
| GET | `/api/gmail/connect/redirect` | redirect vers Google OAuth, scope `https://mail.google.com/` (usage limité à l'envoi côté applicatif) |
| GET | `/api/gmail/callback` | échange code -> tokens, chiffrement AES-256 + stockage |
| POST | `/api/gmail/verify-alias` | **CDC-1** : test SMTP XOAUTH2 avec From = adresse pro ; échoue si l'adresse n'est pas "Envoyer en tant que" verifiee dans le compte Google |
| DELETE | `/api/gmail/connect` | revocation des tokens + deconnexion côté Google |

## Endpoints — Alias F11

| Methode | Route | Description |
|---|---|---|
| POST | `/api/domains/{id}/aliases` | ajouter un alias (contact/, info/, support/, historique) |
| DELETE | `/api/aliases/{id}` | désactiver l'alias (les mails restent archivés) |
