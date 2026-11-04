# Méthode vidéo DRX

Méthode de production d'un film (lancement, démonstration, explicatif) sous la gouvernance de `drx-design`, conçue par `drx-motion`, implémentée par `drx-code`. Chaque étape finit sur une validation explicite ; une étape non validée ne se poursuit pas.

## Les 5 étapes

| # | Étape | Responsable | Livrable | Gate |
|---|---|---|---|---|
| 1 | Script | drx-copy | Scènes : texte écran, voix off, captions, durée cible | Validation du texte |
| 2 | Voix | Utilisateur | Fichier audio ; durées réelles mesurées ; script recalé | Validation à l'écoute |
| 3 | Storyboard | drx-motion, validé par drx-design | `STORYBOARD` + jetons de design + choix du moteur | Validation L8 |
| 4 | Animation | drx-code (workers par frame) | Frames puis film assemblé | Validation du pilote |
| 5 | Musique et bruitages | Utilisateur + drx-motion | Mix final ; rendu | Choix à l'oreille |

## Avant l'étape 1

- Vérifier l'environnement (version du moteur, FFmpeg, polices locales, droits d'écriture).
- Créer un dossier de projet dédié, à profondeur fixe.
- Déclarer format, fps, durée cible, public, ton, langue.

## Storyboard

Un bloc par frame :

```yaml
id: 01-accroche
duree_ms: 4000
objectif: faire comprendre le problème en une phrase
script: "Texte exact cité du script de drx-copy"
pattern: kinetic-type-beats   # voir patterns.md
actions:
  - "0.0 s : le titre entre par mots, un mot par battement"
handoff_in:  { camera: neutre, lumiere: sombre, texte: aucun }
handoff_out: { camera: neutre, lumiere: sombre, texte: "Accroche" }
```

Règles :
- le texte visible est cité mot pour mot du script ; aucun texte inventé par un worker ;
- les handoffs sont contraignants des deux côtés de la jonction ;
- la dernière frame avant un pivot se termine sur un point précis, où la transition forte démarre ;
- 2 ou 3 transitions spectaculaires par film au maximum.

## Grille de contrôle (storyboard puis rendu)

1. Chaque frame a un objectif unique.
2. Le texte visible est cité du script.
3. Les durées totales correspondent à la voix mesurée.
4. Les handoffs sont cohérents à chaque jonction.
5. Un seul objet porte le regard à la fois.
6. Pas plus de 2 ou 3 transitions fortes.
7. Aucun flash plein écran, pas plus de 3 flashs par seconde.
8. Contraste de texte conforme au niveau cible.
9. Captions synchronisées avec la voix.
10. Version sans mouvement fournie.
11. Aucune police ni aucun script chargé depuis le réseau.
12. Versions de moteur épinglées.

## Paquets de worker

Chaque worker `drx-code` reçoit uniquement son paquet de moins de 48 Ko : bloc du storyboard, pattern, règles de motion, jetons de design. Il n'a accès ni à la conversation, ni au storyboard complet, ni aux autres frames.

## Pilote puis vague parallèle

1. Frame 1 seule. Assembler, produire des snapshots à 3 ou 4 instants, montrer la planche de contact.
2. Corriger le style dans les jetons de design si nécessaire, puis relancer le pilote.
3. Toutes les autres frames en parallèle, un worker chacune, par vagues si DRX plafonne le parallélisme.
4. Assemblage idempotent, contrôle automatique, puis relance ciblée des frames fautives avec le message d'erreur verbatim.

## Pièges connus

- Un fondu entre deux frames claires qui passe par un gris : poser un fond commun continu.
- Frame sous une transition qui se termine trop tôt : prolonger ses éléments internes jusqu'à la fin de la transition.
- Texte débordant dans une scène : le signaler à drx-copy avec la contrainte exacte.
- Mélange CSS et GSAP sur la même propriété : interdit.
- Durée du film calée sur la timeline au lieu de l'attribut de durée : vérifier à l'assemblage.

## Après l'étape 5

Contrôles de `drx-test` (durée, dimensions, captions, synchro voix/texte, version statique), rendu, livraison en local. Aucune publication ni envoi sans demande explicite de L8.
