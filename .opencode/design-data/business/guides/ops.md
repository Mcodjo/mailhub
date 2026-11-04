# Mode `ops` : comment l'entreprise tourne le premier jour

Un plan qui marche sur le papier échoue à 7 h un lundi. Ce mode vérifie que le premier jour, la première semaine et le premier mois peuvent être tenus, et que les chiffres du CFO incluent le vrai coût d'exploitation.

Exécution : `drx-business` mène ; `drx-infra` et `drx-sec` apportent les risques techniques et de conformité (hébergement, paiement, données personnelles) via `drx` quand l'activité est numérique.

## Étape 1 : le cycle quotidien

À partir de `business/idea.md`, `business/offer.md`, `business/numbers.json`, écrire le cycle de la journée, de la première à la dernière étape (café : livraisons, préparation, ouverture, service, nettoyage, caisse, commande ; boutique en ligne : commandes, préparation, emballage, expédition, retours, support). Marquer les étapes que le client voit.

## Étape 2 : fournisseurs

Pour chaque intrant des coûts variables du CFO et chaque équipement : deux ou trois vrais fournisseurs joignables, leurs prix publics ou comment obtenir un devis, minimums, délais, conditions de paiement. Lier les sources. Quand seul un devis tranche, le dire et l'ajouter aux questions ouvertes. Si un vrai prix diffère de `business/numbers.json`, le mettre à jour et signaler que le CFO doit relancer.

## Étape 3 : les personnes

Qui fait quoi, quand : planning hebdomadaire au volume prévu et pour le premier mois lent. Rôles, horaires, hypothèse de salaire (de l'utilisateur ou source publique du minimum local et des pratiques, liée). Les charges au-delà du salaire varient selon le pays : les signaler au comptable.

## Étape 4 : routines (procédures)

Routines numérotées et courtes pour les moments décisifs : ouverture, service ou exécution principale, traitement d'une réclamation, fermeture, réassort hebdomadaire. Chacune tient sur une page suivable dès le premier jour.

## Étape 5 : outils

La plus petite pile qui fait tourner l'activité : paiements, caisse ou boutique, planning, comptabilité, stock. Produits réels avec prix publiés et raison du choix.

## Étape 6 : licences, autorisations, assurances

Liste de ce que ce type d'activité exige généralement dans la ville ou le pays de l'utilisateur (immatriculation, numéros fiscaux, autorisations sanitaires, enseigne, assurance), chacune avec la page officielle pour confirmer. Dire que les règles changent selon le lieu et dans le temps, et que l'utilisateur confirme chacune auprès de l'autorité ou d'un professionnel. Pas un conseil juridique.

## Étape 7 : registre des risques

Les dix choses les plus probables qui tournent mal (fournisseur en rupture, personne clé malade, terminal de carte en panne, mauvais avis, mois creux), chacune avec probabilité, gravité et plan.

## Sortie

`business/ops.md`, plus `business/numbers.json` mis à jour si les coûts réels ont changé. Suite : `launch`.
