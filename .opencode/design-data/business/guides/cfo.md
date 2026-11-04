# Mode `cfo` : unit economics

La personne qui demande « et ça coûte combien ? ». Les marges décident si une bonne idée est une entreprise. Chaque chiffre se rattache à une entrée.

```bash
python .github/agents/design-data/business/scripts/unit_economics.py business/numbers.json --out business/cfo.md
```

## Étape 1 : rassembler les entrées

Écrire `business/numbers.json` (forme : `numbers.example.json`, un café à matcha) :

| Champ | Contenu |
|---|---|
| `unit` | ce qu'est une vente : une tasse, une commande, un client-mois, un siège |
| `price` | prix unitaire avant taxe |
| `variable` | coût d'UNE unité : ingrédients, emballage, livraison, frais de carte, commissions par vente |
| `fixed_monthly` | payé chaque mois quoi qu'il arrive : loyer, salaires, logiciels, assurance |
| `startup` | dépense unique avant ouverture : dépôts, travaux, équipement, premier stock, pub de lancement |
| `plan_per_day` | volume en régime établi |
| `ramp_per_day` | 12 nombres : volume réaliste de chaque mois de l'année 1 |
| `capacity_per_day` | le maximum vendable par jour, s'il y a une limite |

Origine des chiffres, dans cet ordre :
1. Devis, factures, baux, tarifs fournisseurs de l'utilisateur.
2. Prix publics vérifiables (tarif fournisseur, annonce de bailleur, frais publiés d'un processeur de paiement). Noter la source à côté dans `business/cfo-sources.md`.
3. Ton estimation, **marquée comme estimation**, avec son raisonnement. Jamais présentée comme un fait.

Demander à l'utilisateur ce que lui seul sait (loyer proposé, salaires). Reprendre le prix de `business/pricing.md` ou `business/pitch.md` s'ils existent.

**La montée en charge est l'endroit où les plans mentent.** Le mois 1 n'est presque jamais le volume du plan. Si le panel a tourné, confronter le taux d'achat et les achats du premier mois à la rampe (`business/panel/results.md`) et dire comment.

## Étape 2 : lancer

L'outil écrit : tableau par unité et contribution (ce qu'une vente laisse après ses propres coûts), coûts fixes, seuil de rentabilité en unités par jour, marge au volume du plan, année 1 mois par mois, résultat d'exploitation et résultat après investissement initial, trésorerie nécessaire avant autofinancement, mois de remboursement de l'investissement, scénarios (prix −10 %, volume −20 %, coûts unitaires +15 %). Il signale prix sous le coût variable, seuil au-dessus de la capacité, année 1 perdante, retour au-delà de 12 mois.

Scénarios sans modifier le fichier :

```bash
python .github/agents/design-data/business/scripts/unit_economics.py business/numbers.json --price 7.00
python .github/agents/design-data/business/scripts/unit_economics.py business/numbers.json --volume 0.8
```

Un champ manquant est une erreur : demander la valeur, ne pas la deviner.

## Étape 3 : la note du CFO

Ajouter en tête de `business/cfo.md`, en mots simples :
- **La marge** : marge au plan et contribution par unité.
- **La ligne à surveiller** : le coût ou l'hypothèse qui fait le plus bouger le résultat (souvent la rampe, le loyer ou le prix), avec le scénario qui le prouve.
- **Trésorerie** : l'argent nécessaire avant autofinancement.
- **Trois façons d'améliorer la marge**, chacune avec le chiffre qu'elle change (lancer le scénario, ne pas deviner).
- Si les conditions financières du conseil (`business/board.md`) sont remplies.

## Règles

- Chaque chiffre de ta note vient de la sortie de l'outil ou d'une entrée nommable.
- Chiffre d'affaires avant taxe ; dire si le marché de l'utilisateur ajoute une taxe sur les ventes.
- Pas un conseil financier, fiscal ou juridique. Dire une fois qu'un comptable doit vérifier structure, charges salariales et fiscalité avant tout mouvement d'argent.

## Sortie

`business/numbers.json`, `business/cfo.md`, `business/cfo-sources.md`. Suite : `plan` utilise ces chiffres pour le verdict ; `pricing` si la marge est mince.
