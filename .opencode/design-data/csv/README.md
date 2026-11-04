# drx-data — Données de référence pour les sous-agents DRX

Ce dossier contient les données CSV extraites de `ui-ux-pro-max` et organisées par agent DRX.
Chaque agent DRX référence ces fichiers pour ses décisions de design, d'implémentation ou de maquettage.

---

## Mapping Agent → Fichiers

### drx-design

| Fichier | Usage | Contenu clé |
|---|---|---|
| `colors.csv` | Sélection de palette par type de produit | 161 palettes (SaaS, E-commerce, Healthcare, Gaming…) avec tokens W3C complets (Primary, Secondary, Accent, Background, Surface, Muted, Destructive) — WCAG ajusté |
| `typography.csv` | Choix de paires de polices justifié | 57 pairings avec Google Fonts URLs, imports CSS, config Tailwind, contextes d'usage (luxury, tech, editorial…) |
| `ux-guidelines.csv` | Audit UX structuré | 99 règles avec sévérité (Critical/High/Medium/Low), catégories (Navigation, Animation, Layout, Touch, Interaction, Forms, Charts), code examples Good/Bad |
| `styles.csv` | Direction stylistique | 50+ styles (Minimalism, Glassmorphism, Brutalism, Dark Mode OLED…) avec checklists CSS, design tokens, framework compatibility |
| `products.csv` | Contexte produit | 161 types de produits avec règles de raisonnement (quand utiliser chaque style, palette, pattern) |
| `ui-reasoning.csv` | Logique de décision UI | Raisonnement par composant et par contexte |
| `icons.csv` | Grille d'icônes | Styles (Outlined, Filled, Duotone, Rounded), tailles, padding de sécurité |

### drx-mockup

| Fichier | Usage | Contenu clé |
|---|---|---|
| `landing.csv` | Templates de landing pages | 30 patterns (Hero-Centric, Conversion-Optimized, Storytelling, Social Proof…) avec specs CSS et design tokens |
| `charts.csv` | Data visualization | 25 types de graphiques (bar, line, pie, heatmap, treemap…) avec guidance d'usage |
| `styles.csv` | Direction stylistique | Même fichier que drx-design — styles avec checklists et tokens |

### drx-code

| Fichier | Usage | Contenu clé |
|---|---|---|
| `react-performance.csv` | Budgets performance React | Métriques, goulots d'étranglement, optimisations |
| `stacks/*.csv` | Règles par stack | 16 fichiers (react, vue, svelte, nextjs, nuxtjs, angular, flutter, swiftui, jetpack-compose, shadcn, html-tailwind, laravel, nuxt-ui, threejs, react-native, astro) — conventions, patterns, anti-patterns |

---

## Utilisation

Les agents DRX consultent ces fichiers en lecture seule. Pas de modification directe — les sources originales sont dans `ui-ux-pro-max/data/`.
