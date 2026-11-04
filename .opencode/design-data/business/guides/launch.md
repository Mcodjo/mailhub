# Mode `launch` : test réel puis compte à rebours

Lancer est un projet avec une date. Ce mode transforme le reste du pack en plan daté, et commence par le moyen le moins cher de savoir si de vraies personnes paieront avant les grosses dépenses.

Exécution : `drx-deploy` pour la mise en ligne (site, paiements, déploiement) ; `drx-test` pour le test réel et les contrôles avant ouverture ; `drx-referencement` pour la veille de découvrabilité. `drx-business` tient le calendrier, les seuils de succès et les revues.

## Étape 1 : tester avant de dépenser

Choisir le test réel le moins cher adapté, et le faire avant de signer les gros coûts de `business/numbers.json` :

| Activité | Le test |
|---|---|
| boutique physique ou café | pop-up, stand de marché ou liste de précommande avec prix et date |
| produit en ligne | page avec le prix et un bouton « précommander » ou « liste d'attente » |
| service ou agence | trois clients pilotes payants au prix prévu |
| abonnement | offre « membre fondateur » payée d'avance |

Écrire la ligne de succès avant (ex. : 50 précommandes en deux semaines à 6,50). Comparer le résultat au taux d'achat du panel. Si les vrais acheteurs sont très en dessous, croire les vrais acheteurs et retourner à `offer` ou `pricing`.

## Étape 2 : le compte à rebours

D'aujourd'hui au jour J, avec de vraies dates (demander la date cible ; sinon la plus proche réaliste selon les délais de `business/ops.md`). Blocs hebdomadaires, chaque tâche avec un responsable et une échéance :
- Juridique et argent : immatriculation, compte bancaire, autorisations de `business/ops.md`.
- Construction : aménagement ou site, fournisseurs commandés selon leurs délais.
- Marque : enseigne, emballage, profils de `business/brand.md`.
- Marketing : le calendrier de `business/marketing.md` à partir de J−14.
- Équipe : recrutement et formation aux procédures.
- Une ouverture douce (amis et proches) avant le lancement public.

Marquer le chemin critique : les tâches qui décalent le lancement si elles glissent.

## Étape 3 : le jour J

Feuille de route heure par heure : qui est où, ce qui sort sur quel canal, l'offre d'ouverture, quoi faire si quelque chose casse (registre des risques).

## Étape 4 : les 30 premiers jours

Les chiffres hebdomadaires (CFO : unités par jour contre seuil de rentabilité ; marketing : chiffres par canal), le niveau qui déclenche un changement, et des revues aux jours 7, 14 et 30 avec les questions à trancher.

## Sortie

`business/launch.md` : le test, le compte à rebours, la feuille de route et la revue à 30 jours. Suite : `plan` compile le tout.
