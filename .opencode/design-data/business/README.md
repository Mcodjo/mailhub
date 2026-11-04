# Données de drx-business

Ressources de `drx-business`, adaptées du pack **founder-skill** (Jake Schincariol, licence MIT, voir `NOTICE.md`).
Aucune ressource externe n'est requise à l'exécution : tout est local et sans dépendance (Python standard).

## Contenu

| Chemin | Rôle |
|---|---|
| `guides/<mode>.md` | Méthode d'un mode (11 modes). Charger seulement le guide du mode demandé. |
| `lenses.md` | Les trois lentilles du conseil (offres, monopole, produit). |
| `scripts/unit_economics.py` | Unit economics : marge, seuil de rentabilité, année 1, trésorerie, scénarios. |
| `scripts/panel.py` | Panel d'acheteurs simulés : `init`, `check`, `save`, `tally`. Ne répond jamais à la place d'un acheteur. |
| `scripts/van_westendorp.py` | Fourchette de prix acceptable à partir de 4 réponses de prix par acheteur. |
| `scripts/compile.py` | Assemble le plan ; le verdict (Rentable / Pas encore / Incomplet) est calculé, jamais écrit à la main. |
| `numbers.example.json`, `customer.example.json`, `pitch.example.md` | Gabarits d'entrée. |

Tests des outils : `python -m unittest discover -s tests/business -t tests/business` (depuis la racine du dépôt DRX).

## Dossier de sortie : `business/`

Chaque mode lit et écrit dans `business/` à la racine du projet de l'utilisateur :

`idea.md`, `board/`, `board.md`, `competitors.csv`, `competitors.md`, `customer.json`, `pitch.md`, `panel/`, `pricing-curve.md`, `pricing.md`, `offer.md`, `numbers.json`, `cfo.md`, `cfo-sources.md`, `marketing.md`, `brand.md`, `ops.md`, `launch.md`, `summary.md`, `business-plan.md`, `one-pager.md`.

## Ordre des modes

`board → competitors → consumer → pricing → offer → cfo → marketing → brand → ops → launch → plan`

Un mode peut être lancé seul ; s'il manque une entrée, `drx-business` dit laquelle et quel mode la produit. Il ne la devine jamais.

## Appel des scripts

```bash
python .github/agents/design-data/business/scripts/unit_economics.py business/numbers.json --out business/cfo.md
python .github/agents/design-data/business/scripts/van_westendorp.py business/panel/answers --price 6.50 --out business/pricing-curve.md
python .github/agents/design-data/business/scripts/panel.py init --customer business/customer.json --pitch business/pitch.md --n 100 --seed 7
python .github/agents/design-data/business/scripts/compile.py --dir business --check
```

Remplacer `.github/agents/` par le dossier d'agents de la plateforme (`.claude/agents/`, `.opencode/design-data/`, etc.). Sous Windows, `python`.

## Règles d'honnêteté (non négociables)

- Aucun chiffre inventé : chaque nombre vient d'une entrée vérifiable ou est marqué « estimation » avec son raisonnement.
- Les acheteurs du panel sont **simulés** : le taux d'achat est une borne haute, jamais une preuve. Un test réel (pré-vente, liste d'attente) le confirme.
- Le conseil applique des **cadres publiés** ; il ne parle jamais « au nom » des auteurs et ne leur attribue aucune parole.
- Faits de marché : sources publiques, un lien par fait. Source inaccessible : le dire.
- Pas de faux avis, faux témoignages, fausse rareté, faux « avant/après ». Pas un conseil juridique, fiscal ou financier.
