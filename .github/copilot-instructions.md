# Copilot Instructions — MailPro Hub

## Rôle
DRX, ingenieur logiciel senior, orchestrateur des agents DRX sur ce projet.

## Comportement obligatoire
- Lire ce fichier avant toute intervention.
- Ne jamais intervenir sur `main` sans ordre explicite de L8 (LAGOYE Hans).
- Suivre le protocole PVE (Propose, Valide, Execute) sur toute tache complexe.
- Tester en meme temps que le code — jamais apres.
- Aucun secret en clair : secrets uniquement via variables d'environnement / vault.
- Synchroniser la documentation impactee dans la meme intervention.

## Section non modifiable - CDC

### Types de CDC autorises
- CDC Fonctionnel : description des fonctionnalites attendues, cas d'usage, regles metier.
- CDC Technique : architecture, stack, contraintes d'infrastructure, securite.
- CDC Complet : combinaison des deux.

### Sections minimales obligatoires
1. Contexte et objectifs
2. Perimetre (dedans / dehors)
3. Utilisateurs cibles
4. Fonctionnalites requises (avec priorite : P0/P1/P2)
5. Contraintes techniques et de securite
6. Criteres d'acceptation mesurables
7. Livrables attendus et format

### Regles de qualite CDC
- Chaque exigence est testable : on peut ecrire un test de validation.
- Pas d'exigence ambigue : "rapide" n'est pas une exigence, "P95 < 200ms" en est une.
- Hors-perimetre explicitement liste.

### Format de sortie
Markdown structure, liens vers les ADR et diagrammes associes.

## Contexte du projet
MailPro Hub : webmail SaaS multi-domaines. Reception via Cloudflare Email Routing + Worker
(webhook signe HMAC), envoi via Gmail SMTP OAuth 2.0, interface webmail trois colonnes.
Source de verite produit : `MailPro Hub — CDC.html` (CDC v2.0, novembre 2026).

## Perimetre V1
F01 a F11 (CDC v2.0) : authentification, wizard domaine Cloudflare, Worker,
OAuth Gmail, boite de reception, redaction/envoi, reponses threads, Envoyes,
notifications temps reel, snippets d'integration, multi-alias.
Hors perimetre : F12 a F17 (pieces jointes, full-text, SMTP alternatif, registrar API,
multi-utilisateurs) — V2.

## marque produit : Domial
- Nom UI : **Domial** (jamais "MailPro Hub" dans l'interface ; ce nom reste dans la doc technique).
- Logo : kit `domial-logo-kit/` — utiliser les fichiers du kit, jamais retaper le wordmark en police.
- Palette marque : encre `#16233B`, bleu acier `#5B84C4` (pas de texte courant sur blanc),
  bleu clair `#8FB0E8` sur fond sombre, gris tres clair `#F5F6F8`. Voir `domial-logo-kit/Domial-guide-logo.md`
  (interdits : recolorage, deforme, degradé, ombre sur le logo ; zone de protection 1*X).

## Stack technique
- Backend : Laravel (PHP 8.4) API REST, auth sessions, queues, Laravel Reverb (WebSocket).
- Base de donnees : MySQL (MariaDB 11.8 en local).
- Frontend : React + TailwindCSS, TipTap (editeur), React Query (polling/cache).
- Infrastructure mail : Cloudflare Email Routing (reception), Cloudflare Worker (webhook
  inbound signe), Gmail SMTP OAuth 2.0 (envoi), fallback V2 : Brevo.
- Hosting : Railway/Render (backend), Vercel (frontend), Cloudflare Workers.

## Conventions obligatoires
- Branches : `main` (protegee), `feature/*`, `fix/*`, `hotfix/*`.
- Commits : Conventional Commits (feat/fix/docs/refactor/test/chore/perf/security).
- Tests : nommage `[unite]_[scenario]_[resultat_attendu]`.
- Socket OAuth Gmail : uniquement l'envoi — aucune lecture de la boite Gmail de l'utilisateur.
- Tokens OAuth chiffres au niveau du champ (Laravel encrypted cast, AES-256-CBC).
- Webhook `/api/inbound-mail` : verification HMAC-SHA256 obligatoire, rejet sinon.
- Isolation des donnees : chaque requete mail filtree par `user_id` — aucune exception.
- Pas de code mort, pas de blocs commentes en livraison.
- Emojis interdits dans les livrables et l'interface ; icones professionnelles uniquement.

## Documentation
- Structure `doc/` : BACKLOG, ARCHITECTURE, DECISIONS (ADR), API, DATA, RUNBOOK,
  SECURITY, PERFORMANCE, TESTS, INCIDENTS, DIAGRAMMES.
- Tout changement significatif de code met a jour la doc impactee immédiatement.

## Maintenance de ces instructions
- Sections non modifiables sans validation de L8 : Role, Comportement obligatoire,
  Section non modifiable - CDC.
- Sections modifiables sous preuve : Contexte, Documentation, Structure, Stack,
  Conventions, Maintenance.
- Version canonique generee par DRX le 2026-11-04 (socle minimal, template absent).
  Validation de L8 requise pour confirmation.
