# Mode `consumer` : le panel d'acheteurs simulés

Au lieu de deviner si les gens achèteront, on en interroge cent (20 en `--quick`), chacun joué par un sous-agent tiré du client cible. Tu es le modérateur : **tu ne réponds jamais à la place d'un acheteur.**

## Partage des rôles (contrainte DRX)

Un sous-agent ne peut pas en lancer d'autres. Donc :
- `drx-business` prépare (client, pitch, tirage, briefs) et analyse (vérification, bilan) ;
- `drx` lance les acheteurs, par vagues, en instances de `drx-business` au rôle interne `acheteur`.

Outil : `python .github/agents/design-data/business/scripts/panel.py <commande>` (noté `PANEL`). État dans `business/panel/`.

## Étape 1 : le client cible

Écrire `business/customer.json` (forme : `customer.example.json`) : `business`, `target` (une ligne précise), `segments` (2 à 4, avec `share` et `income` [bas, haut]), `behaviours` (4 à 8, avec `share` et `how`), `objections` (4 à 8 vrais doutes), `habits` (optionnel).

Ancrer dans du réel : ce que l'utilisateur sait de ses clients et, si `competitors` a tourné, les plaintes de `business/competitors.md`. Des données réelles (entretiens, avis, sondage) valent mieux que tes suppositions ; dire quelles parties sont des suppositions. Montrer le profil en quelques lignes et laisser corriger avant le tirage : un mauvais client rend tout le panel faux.

## Étape 2 : le pitch

Écrire `business/pitch.md` : ce qu'un acheteur verrait vraiment. Produit, prix, où et comment l'obtenir, offre d'ouverture. 3 à 6 lignes simples, sans superlatifs, rien d'infaisable. Chaque acheteur voit exactement ceci.

## Étape 3 : tirer et préparer

```bash
PANEL init --customer business/customer.json --pitch business/pitch.md --n 100
PANEL prompts
```

`init` distribue les cartes de personnage (même graine, mêmes cartes ; la graine est enregistrée). `prompts` écrit un brief par acheteur et les liste par vagues. Annoncer le coût avant un run de 100 : 100 appels de sous-agent ; proposer `--quick` d'abord.

Ta livraison à `drx` : la liste des briefs par vague et, pour chaque acheteur, la demande exacte :
`Rôle acheteur. Lis <chemin du brief> et suis-le à la lettre. C'est tout ton brief. Écris ta réponse JSON dans business/panel/answers/<id>.json.`

`drx` lance une vague à la fois, de la taille du plafond de parallélisme de la plateforme (10 par défaut ; 3 sur Codex), et attend la vague entière avant la suivante. Il peut recommander le mode « accepter les modifications » pour éviter une approbation par fichier.

## Étape 4 : vérifier et compter

Après la dernière vague :

```bash
PANEL check     # réponses manquantes ou cassées
PANEL prompts   # briefs des seuls manquants ; drx les relance une fois
PANEL tally
```

Si un acheteur a affiché son JSON dans sa réponse au lieu d'écrire le fichier, `drx` te transmet la réponse et tu la classes avec `PANEL save <id>` (réponse sur stdin) ; `save` refuse tout ce qui n'est pas une réponse valide. Un acheteur qui échoue deux fois est écarté et compté dans les résultats. Jamais de réponse écrite par toi.

## Étape 5 : restituer

`PANEL tally` écrit `business/panel/results.md` et `results.json`. Donner :
1. Le titre : « 40 achètent · 60 passent » et le taux d'achat.
2. Qui achète et qui non : segments et comportements qui diffèrent le plus.
3. Pourquoi ils passent : les trois premières raisons, une citation chacune, telle qu'écrite.
4. Ce qui ferait changer un non : les réponses les plus répétées.
5. Une phrase sur quoi changer avant de dépenser, et quel mode le fait (`pricing`, `offer`, `marketing`).

## Limites honnêtes (à dire une fois)

Ces acheteurs sont simulés. Ils révèlent bien objections, segments et formulations, et prédisent mal la conversion réelle : les modèles sont complaisants, donc le taux d'achat est une borne haute. Confirmer les gros choix avec de vraies personnes (liste d'attente, pré-vente, page avec un prix). Ne jamais présenter les citations du panel comme des témoignages.

## Rôle interne `acheteur`

Une instance reçoit un brief généré par `panel.py` (identité, revenu, comportement, habitude, doute, pitch mot pour mot) et écrit un JSON : achète ou non, achats le premier mois, code de raison, raison dans sa voix, objection principale, ce qui changerait son avis, quatre réponses de prix (trop bon marché, une affaire, devient cher, trop cher). Il ne fait que cela : pas de conseil, pas d'avis de marketing, pas de faits inventés, aucune complaisance. Jamais de brief modifié pour un acheteur.

## Sortie

`business/customer.json`, `business/pitch.md`, `business/panel/` (cartes, briefs, réponses, résultats). Suite : `pricing` lit les prix, `offer` et `marketing` lisent les objections.
