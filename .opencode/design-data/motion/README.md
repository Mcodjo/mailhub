# Référentiel motion DRX

Ce répertoire contient les contrats, tokens, moteurs, patterns et méthode nécessaires à la conception de tout le motion (interface et vidéo : Remotion, HyperFrames, Manim, CSS, GSAP, Framer Motion, WebGL). Il ne contient pas le code produit final.

## Répartition des responsabilités

| Agent | Utilisation |
|---|---|
| `drx-design` | Gouverne le motion : direction artistique, jetons de design, validation des propositions de `drx-motion`. |
| `drx-motion` | Conçoit tout le mouvement : storyboard, rythme, transitions, budgets de mouvement, choix du moteur, fallback statique ; orchestre les workers `drx-code` par frame. |
| `drx-copy` | Fournit les textes, scripts, voix off, captions, variantes et contraintes éditoriales synchronisables. |
| `drx-mockup` | Produit des planches de scènes, maquettes et aperçus de recherche à partir des prescriptions validées. |
| `drx-code` | Implémente les compositions (Remotion, HyperFrames, Manim, animations d'interface), le rendu et l’intégration produit. |
| `drx-test` | Vérifie les schémas, le build, les durées, les dimensions, les captions, le rendu et la version sans mouvement. |

## Fichiers

| Fichier | Contenu |
|---|---|
| `motion-tokens.json` | Durées, easings, budgets |
| `accessibility-motion.yml` | Règles d'accessibilité du mouvement |
| `storyboard.schema.json`, `copy-timing.schema.json` | Contrats de composition et de texte |
| `motion-engines.yml` | Moteurs autorisés, critères de choix, contraintes, repli |
| `video-method.md` | Méthode vidéo en 5 étapes, grille de contrôle, pilote puis parallèle |
| `patterns.md`, `transitions.md` | Catalogues de patterns et de transitions |
| `NOTICE.md` | Attribution et licences |

## Contrats

`storyboard.schema.json` décrit la structure d’une composition : format, fps, durée, scènes, transitions, audio, captions, fallback et intégration. `copy-timing.schema.json` décrit les textes attachés aux scènes : texte affiché, voix off, caption, durée cible et limites de longueur.

`drx-copy` peut produire des fichiers conformes à `copy-timing.schema.json` et des scripts de validation rédactionnelle. Il ne crée pas la composition Remotion finale. `drx-design` peut produire un prototype isolé dans `design-lab/`, mais toute intégration ou industrialisation est transférée à `drx-code`.

## Principes

1. Une animation doit avoir une fonction narrative, informative ou fonctionnelle clairement déclarée.
2. Toute vidéo prévoit des captions et une version compréhensible sans audio lorsque le contexte de diffusion le nécessite.
3. Toute animation d’interface déclare son comportement avec `prefers-reduced-motion`.
4. Une vidéo Remotion et une animation UI ne sont pas interchangeables : Remotion sert aux compositions vidéo rendables ; le runtime produit choisit la technologie adaptée à l’interface.
5. Les props de composition sont sérialisables et les données éditoriales sont séparées du code de rendu.
6. Les prototypes de recherche ne doivent pas être copiés dans le code produit sans revue de `drx-code` et validation de `drx-test`.

## Contrôle local

Les scripts de `scripts/` restent courts, déterministes et sans dépendance externe obligatoire. Ils vérifient uniquement les contrats de contenu ou de conception, jamais la logique métier du produit.
