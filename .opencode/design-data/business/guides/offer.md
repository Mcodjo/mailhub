# Mode `offer` : une offre trop bonne pour être refusée

La plupart des entreprises vendent un produit. Les bonnes vendent une offre : le produit plus tout ce qui rend l'achat facile. Méthode : lentille Offres de `../lenses.md` (résumé du cadre de *$100M Offers* ; jamais présenté comme ses mots).

Exécution : `drx-copy` rédige les bonus, la garantie, l'urgence et le nom de l'offre selon le contrat de `drx-business`. `drx-business` garde les chiffres (coût de chaque ajout, garantie supportable, marge).

## Étape 1 : lire ce qui est connu

`business/idea.md`, `business/pitch.md` (ce qui est vendu), `business/panel/results.md` (pourquoi on passe, dans leurs mots : chaque objection principale doit trouver une réponse dans l'offre), `business/numbers.json` (coût de chaque ajout), `business/board.md` (conditions).

## Étape 2 : la liste des problèmes

Tous les obstacles entre l'acheteur et son résultat, dans ses mots : avant l'achat (doute, prix, effort de changement), pendant (attente, apprentissage, gêne), après (durée, et si ça échoue). Viser 15 à 30, en partant des objections du panel et des plaintes sur les concurrents.

## Étape 3 : solutions, élaguées, empilées

Transformer chaque problème en solution. Noter valeur pour l'acheteur (1-5) et coût de livraison (1-5, depuis les chiffres du CFO). Garder valeur haute, coût bas. Empiler :
- **Le cœur** : la chose, décrite par le résultat, pas les ingrédients.
- **Bonus** : deux ou trois, chacun tue une objection précise.
- **La garantie** : ce qui se passe si ça ne tient pas. Modéliser son coût à un taux de réclamation réaliste avec l'outil CFO avant de la promettre.
- **Urgence et rareté** : seulement si vraies (semaine de lancement, premier lot limité). Jamais de faux compte à rebours ni de « plus que 3 ».
- **Le nom** : clair, précis, celui de l'offre, pas de l'entreprise.

## Étape 4 : la noter

Sur l'équation de valeur, avant et après, 1 à 10 : résultat rêvé, probabilité perçue, délai, effort et sacrifice. Dire quel élément de l'empilement fait bouger quel score.

## Étape 5 : la re-tester

Écrire la nouvelle offre dans `business/pitch.md` (ancienne dans `business/pitch-v1.md`), puis demander à `drx` de relancer `consumer --quick` avec la même graine. Rapporter le taux d'achat avant/après et les objections qui ont baissé. Rien n'a bougé : le dire, le problème est peut-être le marché ou le prix.

## Règles

- Chaque promesse doit être tenable et abordable ; vérifier les coûts avec le CFO.
- Pas de faux avis, témoignages, rareté, remises ou « vu dans ».
- Respecter les règles de publicité et de protection du consommateur du marché de l'utilisateur (allégations de santé surtout). Pas un conseil juridique.

## Sortie

`business/offer.md` (liste de problèmes, empilement, coûts, scores, résultat du re-test) et `business/pitch.md` mis à jour. Suite : `cfo` (relancer avec l'empilement), puis `marketing`.
