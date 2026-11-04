# DRX — Système Multi-Agents

> Autorité absolue : LAGOYE Hans (L8)

## Architecture du système

DRX est un système multi-agents d'ingénierie logicielle à orchestration hiérarchique.
L'agent principal `drx` orchestre tous les sous-agents ci-dessous.

| Agent | Rôle | Fichier |
|---|---|---|
| `drx-api` | Contrats API REST/GraphQL | `drx-api.md` |
| `drx-arch` | Architecture & patterns | `drx-arch.md` |
| `drx-business` | Viabilité business, chiffres & plan d'affaires (gouverne les étapes business) | `drx-business.md` |
| `drx-code` | Production de code | `drx-code.md` |
| `drx-copy` | Copywriting & UX writing | `drx-copy.md` |
| `drx-data` | Modélisation & migrations data | `drx-data.md` |
| `drx-deploy` | CI/CD & déploiement | `drx-deploy.md` |
| `drx-design-doc` | Documentation design system | `drx-design-doc.md` |
| `drx-design` | UI/UX & direction artistique | `drx-design.md` |
| `drx-doc` | Documentation technique | `drx-doc.md` |
| `drx-drawio-merise` | Diagrammes MERISE Draw.io | `drx-drawio-merise.md` |
| `drx-drawio-uml` | Diagrammes UML Draw.io | `drx-drawio-uml.md` |
| `drx-infra` | Infrastructure & IaC | `drx-infra.md` |
| `drx-mobile` | Mobile React Native / PWA | `drx-mobile.md` |
| `drx-mockup` | Maquettes wireframe & UI haute fidélité | `drx-mockup.md` |
| `drx-monitor` | Observabilité & alerting | `drx-monitor.md` |
| `drx-motion` | Motion & vidéo (gouverné par drx-design) | `drx-motion.md` |
| `drx-perf` | Performance & profiling | `drx-perf.md` |
| `drx-product` | Produit, spécifications & trajectoire | `drx-product.md` |
| `drx-referencement` | Référencement SEO/AEO/GEO & découvrabilité | `drx-referencement.md` |
| `drx-sec` | Sécurité offensive & audit | `drx-sec.md` |
| `drx-test` | Tests & couverture qualité | `drx-test.md` |
| `drx` | Orchestrateur principal | `drx.md` |

---

## Routage rapide par tags

Consulter d'abord `.opencode/agent-index.yml`.
Comparer la demande aux tags, déclencheurs et exclusions, puis charger au maximum trois prompts complets.
Ne pas lire les prompts des agents non sélectionnés.

## Workflows DRX 4.0

Le registre neutre est dans `.drx/workflows/`.
Pour un cycle complexe, l'orchestrateur `drx` exécute lui-même `drx --workflows`, `drx --workflow-plan ID` puis les commandes de suivi dans la session.
L'utilisateur ne doit pas être obligé d'exécuter ces commandes hors session.
Les workflows structurent les étapes et les preuves ; `drx` conserve le routage, l'arbitrage et l'autorité L8.

## Utilisation dans OpenCode CLI

```bash
# Activer l'orchestrateur principal
/agent drx

# Activer un sous-agent directement
/agent drx-code
/agent drx-design
/agent drx-sec
```

## Données partagées (design-data)

Le dossier `.opencode/design-data/` contient les données CSV et scripts partagés par les agents.
Synchronisés automatiquement par `drx.py --update`.

