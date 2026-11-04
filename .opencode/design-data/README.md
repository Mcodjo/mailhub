# design-data — Ressources de design

Référentiel complet de design pour les agents DRX.

## Structure

```
design-data/
├── csv/                          # Données CSV de design
│   ├── colors.csv                # 161 palettes par type de produit
│   ├── typography.csv            # 57 paires de polices
│   ├── styles.csv                # 50+ styles avec checklists
│   ├── products.csv              # 161 types de produits
│   ├── ux-guidelines.csv         # 99 règles UX
│   ├── ui-reasoning.csv          # Logique décision UI
│   ├── icons.csv                 # Styles d'icônes
│   ├── landing.csv               # 30 patterns landing pages
│   ├── charts.csv                # 25 types de graphiques
│   ├── react-performance.csv     # Budgets performance React
│   ├── stacks/                   # Règles par stack (16 stacks)
│   └── README.md
├── vignelli/
│   └── vignelli_system.py        # Tokens Vignelli Canon
├── grid/
│   └── grid_tokens.py            # Grille Müller-Brockmann
├── nyt-dataviz/
│   ├── chart_selector.py         # Sélecteur graphique NYT
│   ├── palette.py                # Palettes accessibles
│   ├── typography.py             # Mapping typo NYT
│   └── render.py                 # Rendu HTML graphiques
├── motion/
│   ├── README.md                 # Contrat motion et frontière des agents
│   ├── motion-tokens.json        # Durées, easings et budgets de mouvement
│   ├── storyboard.schema.json    # Schéma des storyboards Remotion
│   ├── copy-timing.schema.json   # Schéma des textes/captions synchronisables
│   ├── accessibility-motion.yml  # Fallback reduced-motion et version statique
│   └── scripts/                  # Contrôles légers sans code produit
├── code-standards.md             # Standards de code
└── README.md
```

## Contrat motion

Le sous-répertoire `motion/` est un référentiel partagé, pas un agent autonome. `drx-design` y lit les tokens, le schéma storyboard et les règles de reduced motion ; `drx-copy` y produit des données rédactionnelles compatibles avec le schéma de timing ; `drx-mockup` y prépare des aperçus ; `drx-code` y lit les contrats pour créer les compositions Remotion finales ; `drx-test` vérifie les contraintes.

Les scripts de `motion/scripts/` doivent rester déterministes, courts et indépendants du code produit. Ils peuvent contrôler une longueur, une durée de lecture, un YAML ou une structure de captions ; ils ne doivent pas contenir de logique métier ni de pipeline de déploiement.

## Agents utilisateurs

| Agent | Fichiers utilisés |
|-------|-------------------|
| drx-design | csv/colors, csv/typography, csv/styles, csv/products, csv/ux-guidelines, csv/ui-reasoning, csv/icons, vignelli/, grid/, nyt-dataviz/, motion/ |
| drx-mockup | csv/landing, csv/charts, csv/styles, grid/, motion/ |
| drx-copy | motion/copy-timing.schema.json, motion/accessibility-motion.yml — lecture et production rédactionnelle uniquement |
| drx-code | csv/react-performance, csv/stacks/, motion/ — intégration Remotion et code de production |
| drx-test | motion/ — validation des contrats et rendus |
| drx-design-doc | csv/colors, csv/typography |
