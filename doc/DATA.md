# DATA — MailPro Hub

Modeles de donnees et regles d'integrite. Localisation : `backend/database/migrations`.

## Modeles

### users
| Champ | Type | Regles |
|---|---|---|
| id | PK | |
| name | string | requis |
| email | string unique | requis, indexe, validation RFC |
| password | string nullable | hash bcrypt (12 rounds) — null si connexion Google uniquement |
| google_id | string nullable unique | connexion Google (auth app, pas pour l'envoie) |
| created_at / updated_at | timestamps | |

### domains
| Champ | Type | Regles |
|---|---|---|
| id | PK | |
| user_id | FK users | cascade, indexe |
| domain | string unique | FQDN, lowercase, validation |
| status | enum | `pending`, `dns_pending`, `verified`, `active`, `failed` |
| cloudflare_token | text | **chiffre AES-256 (Laravel encrypted cast)** |
| cloudflare_zone_id | string nullable | |
| worker_status | enum | `not_deployed`, `deployed`, `failed` |
| dns_verified_at | timestamp nullable | |
| created_at / updated_at | timestamps | |

### aliases (F11)
| Champ | Type | Regles |
|---|---|---|
| id | PK | |
| domain_id | FK domains | cascade |
| local_part | string | prefixe avant @ (ex `contact`), regex `^[a-z0-9._-]{1,64}$`, unique par domaine |
| is_primary | boolean | 1 seul par domaine |
| send_from_verified_at | timestamp nullable | **CDC-1 : epoque du test alias "Envoyer en tant que" OK** |
| created_at / updated_at | timestamps | |

### gmail_tokens
| Champ | Type | Regles |
|---|---|---|
| id | PK | |
| user_id | FK users | unique, cascade |
| access_token | text | **chiffre AES-256 (encrypted cast)** |
| refresh_token | text | **chiffre AES-256 (encrypted cast)** |
| expires_at | timestamp | renouvellement avant chaque envoi |
| scope | string | auditoire : doit contenir `https://mail.google.com/` (CDC-2) |
| revoked_at | timestamp nullable | revocation logique |
| created_at / updated_at | timestamps | |

### threads
| id | PK | |
| domain_id | FK domains nullable | |
| subject | string | objet normalized (Re:/Fw: epurés) |
| created_at / updated_at | timestamps | |

### emails (recus)
| Champ | Type | Regles |
|---|---|---|
| id | PK | |
| user_id | FK users | indexe composite (`user_id, alias_id`), isolation stricte |
| alias_id | FK aliases | indexe |
| thread_id | FK threads | indexe, nullable |
| message_id | string | engine `Message-ID` (indexe unique par user pour l'idempotente webhook) |
| from_email / from_name | string | |
| subject | string | |
| body_text / body_html | longtext | |
| headers | json | headers complets |
| attachments_count | int | indicateur UI (F12-V2 payload plus tard) |
| is_read | boolean | indexe |
| received_at | timestamp | indexe composite (`alias_id, received_at`) pour pagination <1s |
| raw_email_path | string nullable | chemin stockage brut (conforme RFC, réassi pour parsing différé / délits de sécurité) |

### sent_emails
| id | PK | |
| user_id / alias_id | FK | indexe |
| thread_id | FK threads nullable | |
| in_reply_to | string nullable | `Message-ID` du mail repondu — maintien de conversation |
| from_email / to_emails / cc_emails | json | |
| subject / body_text / body_html | text | |
| sent_at | timestamp | indexe |

## Regles d'integrite

- Isolation : toute requete sur `emails`, `sent_emails`, `domains`, `aliases` passe par une policy ou un scope `forUser(auth()->id())` — plus jamais de lecture globale.
- Idempotent webhook : un `message_id` deja present est ignore (rejet = 202 sans double insertion).
- Les tokens OAuth et le token Cloudflare ne sortent jamais du backend non chiffré : encrypted cast + logging interdit (voir doc/SECURITY.md).
- Index requis pour le critere "chargement < 1s" : `emails(alias_id, received_at)` et `emails(user_id, is_read, received_at)`.
- Migrations idempotentes, reversibles (`down` complet).
