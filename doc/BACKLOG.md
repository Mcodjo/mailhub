# Backlog — MailPro Hub

## Statut projet
Fondations validees par L8 le 2026-11-04 : stack Laravel + MySQL, perimetre F01-F11.

## En cours
| ID | Item | Owner | Statut | Notes |
|---|---|---|---|---|
| FOND-01 | git init + copilot-instructions canonique | DRX | OK 2026-11-04 | Validation L8 du socle en attente |
| FOND-02 | Squelette Laravel backend | DRX | INSTALL | composer create-project |
| FOND-03 | Squelette React frontend | DRX | TODO | apres FOND-02 |
| FOND-04 | Squelette Cloudflare Worker | DRX | TODO | TypeScript + wrangler |
| FOND-05 | doc/API.md + doc/DATA.md + doc/SECURITY.md | DRX | TODO | contrats avant implementation |

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
