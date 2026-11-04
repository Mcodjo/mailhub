# SECURITY — MailPro Hub

## Non negociables (CDC section 7 + arbitrages L8)

### CDC-2 — Scope OAuth Gmail
- Scope requis par SMTP XOAUTH2 : `https://mail.google.com/` (Gmail ne source pas `gmail.send` seul pour SMTP).
- L'application limite son usage applicatif a l'envoi : AUCUN appel `gmail.*` de lecture, aucun fetch de boite, aucun filtrage des messages en wishes API REST en plus.
- Justification exposee dans le consentement Google et sur l'ecran "Connecter mon compte Gmail" (maquette wizard).

### CDC-1 — Verification d'alias (From professionnel)
- **Probleme** : SMTP XOAUTH2 avec un From non verifie fait partir le message avec un autre expediteur affiche, ou echoue selon le compte — l'utilisateur doit valider l'alias dans son compte.
- **Regle** : pour chaque alias, test de verification (endpoint `POST /api/gmail/verify-alias`) et statut `send_from_verified_at` en base. Un domaine n'est jamais active sans alias verifie. Message utilisateur clair dans le wizard : "verifiez l'alias dans les parametres Envoyer en tant que du compte Gmail connecte".
- Le test XOAUTH2 sur l'alias cible : envoi d'un mail de test vers une adresse sandbox du backend, analyse du message accepte/rejete et de l'expediteur reellement enregistre.
- La revocation d'un alias echouera à un prochain test du même type (jeu de tests d'intégration).

### Tokens OAuth (chiffrement)
- AES-256-CBC via encrypted cast Laravel ; cle en env `APP_ENCRYPTION_KEY` (complement de la APP_KEY), jamais commitee, rotation documentee dans RUNBOOK.
- Aucun token dans les logs (politique PHP `dontLog` + redaction dans les channels log), jamais exposé au frontend.
- Revocation : `DELETE /api/gmail/connect` -> tokens supprimes + revoke Google side.

### Webhook /api/inbound-mail
- HMAC-SHA256 sur le corps brut (header `x-mailprohub-signature`), rejet 403 si absente ou invalide.
- Timestamp max de skew 5 minutes (protection rejeu) — preprod configurée `CLOUDFLARE_WEBHOOK_SKEW=300`.
- Sans HMAC valide : requête jamais acceptee (exception autre que le webhook-only middleware).

### Isolation des donnees
- Policies Laravel sur chaque modele mail/domain : lecture/écriture limitée au proprietaire.
- Tests d'isolation obligatoires (utilisateur A ne peut pas lire les mails de B, meme en jouant de parametres).

### Sessions
- Sessions Laravel (cookie HttpOnly), CSRF actif (exception uniquement sur `/api/inbound-mail` qui est HMAC-protege).
- Couches strong-password sur register ; rate limit des endpoints auth (`5/mn/ip`).

### Secrets cotes
| Secret | ou | jamais dans |
|---|---|---|
| `APP_KEY`, `APP_ENCRYPTION_KEY` | env backend | repo, logs |
| `CLOUDFLARE_WEBHOOK_SECRET` | wrangler secret + env backend | repo |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | env backend | frontend |
| `CLOUDFLARE_API_TOKEN` utilisateur | base chiffree | logs, réponses API |

## Checklist audit (a rejouer a chaque livraison phase)
- [ ] Aucun secret dans le repo ni dans les artifacts de build
- [ ] Aucun endpoint mail sans contexte utilisateur (policies testées)
- [ ] Aucun log contenant access/refresh token ou mdp
- [ ] Reponse webhook sans HMAC => 403
- [ ] Conte de caractères and inspect API surface : aucun appel propager le scope de lecture
- [ ] OWASP Top 10 : injection SQL (Eloquent bindings), XSS (echappement UI du corps mail), CSRF, rate limiting, débordements d'upload (V2)
