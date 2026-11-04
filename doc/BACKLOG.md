# Backlog — MailPro Hub

## Statut projet
Fondations validees par L8 le 2026-11-04 : stack Laravel + MySQL, perimetre F01-F11.

## En cours
| ID | Item | Owner | Statut | Notes |
|---|---|---|---|---|
| FOND-01 | git init + copilot-instructions canonique | DRX | OK 2026-11-04 | Validation L8 du socle en attente |
| BRAND-01 | Intégration marque Domial in frontend (favicon, manifest, titre, desc) | DRX | OK 2026-11-04 | build Vite OK ; antériorité de marque à vérifier avant usage commercial (note guide) |
| DESIGN-02 | Benchmark sectoriel + 3 propositions de maquette par interface | drx-mockup | OK 2026-11-04 | L8 a retenu: landing-c, auth-b, inbox-c (sous condition: commentaires internes exclus = V2/F17), compose-c, wizard-c; dashboard non tranche |
| DESIGN-03 | Converger les variantes retenues vers un design system unique (tokens Tailwind 4 dans frontend/) | DRX | TODO | apres tranché dashboard |
| DESIGN-04 | Préparer inbox-c pour V1 : retirer commentaires internes de la maquette (F17 = V2) | drx-mockup | TODO | condition L8 inbox-c |
| FOND-02 | Squelette Laravel backend | DRX | OK 2026-11-04 | Laravel 13.40, commit 4da01c6 |
| FOND-03 | Squelette React frontend | DRX | OK 2026-11-04 | Vite + React + Tailwind 4 |
| FOND-04 | Squelette Cloudflare Worker | DRX | OK 2026-11-04 | TypeScript, type-check OK |
| FOND-05 | doc/API.md + doc/DATA.md + doc/SECURITY.md | DRX | OK 2026-11-04 | contrats avant implementation |
| DESIGN-01 | Maquettes design-labs (9 ecrans + design system) | drx-mockup | OK 2026-11-04 | revue L8 demandee avant implémentation frontend |

## Phase 1 — Fondations produit (CDC section 9)
| ID | Item | Priorite | Statut |
|---|---|---|---|
| F01 | Auth (email+mdp bcrypt, Google OAuth optionnel) | Haute | TODO |
| F02 | Wizard domaine (Cloudflare API, DNS, propagation) | Haute | TODO |
| F03 | Cloudflare Worker deployable + webhook signe | Haute | TODO |
| — | Endpoint `/api/inbound-mail` + HMAC | Haute | TODO |

## Phase 2 — Reception
| ID | Item | Priorite | Statut |
|---|---|---|---|
| F05 | Boite de reception (liste + lecture) | Haute | TODO |
| F09 | Notifications temps reel (Reverb + fallback polling 30s) | Haute | TODO |

## Phase 3 — Envoi
| ID | Item | Priorite | Statut |
|---|---|---|---|
| F04 | Flux OAuth Gmail (scope envoi, tokens chiffres AES-256) | Haute | TODO |
| F06 | Redaction TipTap + envoi SMTP From adresse pro | Haute | TODO |
| F07 | Reponses threadie (`In-Reply-To`) | Haute | TODO |
| F08 | Boite Envoyes | Haute | TODO |

## Phase 4 — Polish
| ID | Item | Priorite | Statut |
|---|---|---|---|
| F10 | Snippets d'integration (Laravel/Node/WordPress) | Haute | TODO |
| F14 | Score delivrabilite (SPF/DKIM/DMARC) | Moyenne | TODO |

## Phase 5 — V2
| ID | Item | Priorite | Statut |
|---|---|---|---|
| F11 | Multi-alias par domaine | Moyenne | TODO |
| F12-F17 | V2 (pieces jointes, full-text, SMTP alternatif, etc.) | Basse | NON PLANIFIE V1 |

## Conformite CDC (exigences ajoutees au plan)
| ID | Item | Statut |
|---|---|---|
| CDC-1 | Verification wizard que l'adresse pro est alias "Envoyer en tant que" verifie dans le compte Gmail connecte (correction du CDC — From pas garanti sinon) | TODO phase 3 |
| CDC-2 | Documentation du scope OAuth reel (`https://mail.google.com/` requis par SMTP XOAUTH2 ; usage applicatif limite a l'envoi) | TODO doc/SECURITY.md |
| CDC-3 | Propagation DNS 15min-48h affichee + relance manuelle de verification | TODO phase 1 |
