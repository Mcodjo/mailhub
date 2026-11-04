# MailPro Hub — Architecture

Source de verite produit : `MailPro Hub — CDC.html` (CDC v2.0, novembre 2026).

## Vision systeme

Webmail SaaS multi-domaines : l'utilisateur configure son domaine, recoit ses mails
dans l'outil (Cloudflare Email Routing -> Worker -> API), et envoie via Gmail SMTP
OAuth 2.0 avec l'adresse professionnelle comme expediteur affiche.

## Composants

| Composant | Role | Stack |
|---|---|---|
| `backend/` | API REST, auth, stockage mails, queues, WebSocket | Laravel (PHP 8.4), MySQL |
| `frontend/` | Webmail 3 colonnes (sidebar / liste / lecture-redaction) | React, TailwindCSS, TipTap, React Query |
| `worker/` | Reception mails Cloudflare + POST signe vers API | Cloudflare Worker (TypeScript) |

## Flux majeurs

### Reception
1. Mail vers `contact@domain.com` -> MX Cloudflare (Email Routing).
2. Worker (evenement `email`) extrait expediteur, destinataire, objet, corps, en-tetes.
3. POST signe HMAC-SHA256 vers `POST /api/inbound-mail`.
4. Backend verifie la signature, resolution destinataire -> alias, utilisateur proprietaire.
5. Enregistrement en base + notification temps reel (WebSocket Reverb, fallback polling 30s).

### Envoi
1. Redaction dans le frontend, choix de l'adresse pro (From).
2. Backend recupere le token Gmail chiffre, le renouvelle si expire.
3. Appel Gmail SMTP (XOAUTH2) avec `From: contact@domain.com`.
4. Archivage en table `sent_mails` + rattachement au thread si reponse (`In-Reply-To`).

### Contrainte From / alias Gmail (tranche dans le CDC)
Gmail ne garantit un From personnalisé que si l'adresse pro est declarer "Envoyer en tant que"
(alias verifie) dans le compte Google connecte. Le wizard de configuration doit :
- proposer l'ajout de l'alias "Envoyer en tant que" dans le compte Gmail (etape 3 du wizard),
- tester avant activation que Gmail accepte le From de l'adresse pro,
- bloquer l'activation du domaine si le test echoue.

## Modeles de donnees (core — detail dans doc/DATA.md)

- `users` — compte outil (email, mdp bcrypt, nom, photo).
- `domains` — domaine, utilisateur, statut de verification, token API Cloudflare (chiffre).
- `aliases` — prefixe (contact@...), domaine, boite associee (support F11).
- `emails` — mails recus : headers JSON, texte, html, lu/non-lu, alias, thread_id.
- `sent_emails` — mails envoyes : corps, From, To/Cc, thread_id, in_reply_to.
- `threads` — regroupement conversations.
- `gmail_tokens` — access/refresh tokens chiffres par utilisateur.

## Decisions ouvertes

- DEC-001 : choix Laravel vs alternatives -> valide L8 le 2026-11-04 (voir ADR-0001).
- DEC-002 : WebSocket Reverb vs SSE -> ADR-0002 a produire phase 2.
