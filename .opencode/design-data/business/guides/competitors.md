# Mode `competitors` : carte des concurrents et du vide

Chaque acheteur résout déjà ce problème. Ce mode trouve comment, à quel prix, et ce qu'il déteste, pour démarrer avec un vide à occuper plutôt qu'une intuition.

Exécution : `drx-product` mène la carte du marché ; `drx-referencement` ajoute la concurrence en recherche (SERP, requêtes, visibilité). `drx-business` fixe les questions, impose le format et valide chaque fait.

## Règles

- **Sources publiques seulement, chaque fait lié.** Sites, pages de prix, menus, fiches d'appli et de carte, sites d'avis, forums, presse. Source inaccessible : le dire. Jamais de concurrent, prix, note ou avis inventé.
- **Lire, pas aspirer.** Lire comme une personne, respecter les conditions de chaque site.
- **Citations mot pour mot**, courtes, avec le lien. Ce sont des éléments de recherche, jamais des témoignages.

## Étape 1 : qui est là

À partir de `business/idea.md` :

| Type | Sens | Exemple (bar à matcha) |
|---|---|---|
| Direct | même produit, même acheteur | autres bars à matcha à pied |
| Indirect | autre produit, même besoin | cafés de la même rue |
| Substitut | résoudre sans entreprise | matcha en poudre à la maison |

Viser 5 à 10 directs et indirects plus les substituts principaux. Commerce local : chercher la zone exacte sur la carte ; en ligne : chercher comme un acheteur (« meilleur <chose> pour <qui> », « alternative à <chose> »).

## Étape 2 : les faits

Une ligne par concurrent dans `business/competitors.csv` :

`name,type,url,location_or_channel,price_of_comparable_item,what_it_sells,positioning_line,rating,review_count,source_date`

`positioning_line` est leur propre accroche, copiée. Le prix est celui de l'article le plus proche, avec ce qu'il inclut.

## Étape 3 : ce que disent leurs clients

Pour les 3 à 5 premiers : lire les avis (1 à 3 étoiles d'abord, puis les 4 étoiles « j'adore, mais… »). Noter les plaintes récurrentes en thèmes avec effectifs et une ou deux citations liées. Un thème de moins de trois avis est « mince ».

## Étape 4 : la carte et le vide

Écrire `business/competitors.md` :
1. Le tableau (depuis le CSV), trié par intensité de concurrence.
2. Fourchette de prix : bas, médian, haut.
3. Carte de positionnement textuelle sur deux axes qui comptent pour cet acheteur.
4. Les plaintes classées, avec liens.
5. **Le vide** : ce que personne ne fait bien et que cette entreprise pourrait, lié aux preuves. Pas de vide : le dire clairement, c'est le résultat le plus utile.
6. La menace : qui pourrait copier le plus vite, et comment.

## Sortie

`business/competitors.csv`, `business/competitors.md`. Suite : `consumer` (plaintes → vraies objections) et `pricing` (fourchette de prix).
