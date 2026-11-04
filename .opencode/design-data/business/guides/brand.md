# Mode `brand` : nom, voix et brief d'identité

Une marque est la promesse dont le client se souvient. Ce mode la rend précise pour le positionnement déjà trouvé, pas un moodboard de jolies couleurs.

Exécution : `drx-copy` pour nom, promesse, accroche et voix ; `drx-design` pour l'identité visuelle (couleurs, typographie, brief de logo). `drx-business` fournit le brief (positionnement, audience, concurrents à éviter) et valide la cohérence avec le marketing.

## Étape 1 : lire le brief

`business/idea.md`, `business/marketing.md` (ligne de positionnement et première audience), `business/competitors.md` (noms et looks à éviter), raisons d'achat du panel (`business/panel/results.md`). Positionnement absent : le demander ou lancer `marketing` d'abord.

## Étape 2 : candidats de noms

Dix candidats de styles différents (descriptif, évocateur, inventé, nom du fondateur, un lieu). Pour chacun : ce qu'il dit, comment il sonne à voix haute, comment il se lit sur une enseigne ou une icône d'appli, le risque. Retenir trois noms puis les vérifications que l'utilisateur doit terminer lui-même :
- **Marque** : chercher dans le registre officiel de chaque marché (INPI, OAPI, USPTO, EUIPO, etc.) le nom dans la même classe de produits et services. Donner liens et classes.
- **Domaine** : .com et domaine local libres ? (vérifier, ne pas supposer) ; alternatives sinon.
- **Pseudos** : Instagram, TikTok, X, YouTube.
- **Confusion** : aucun nom proche d'un concurrent de `business/competitors.md`.

Dire clairement qu'on ne fait que des recherches publiques, qu'un conseil en propriété industrielle confirme, et que rien n'est enregistré tant que l'utilisateur ne l'a pas fait.

## Étape 3 : voix et promesse

- La promesse en une ligne (ce sur quoi le client peut compter, à chaque fois).
- Une accroche, trois options.
- La voix en trois adjectifs, chacun avec un « faire » et un « ne pas faire », et une réécriture avant/après d'une ligne de `business/pitch.md`.

## Étape 4 : le look, en brief

- **Couleur** : 2 à 3 couleurs avec valeurs hex et rôle de chacune, plus la vérification de contraste du texte (WCAG AA au moins).
- **Typographie** : une police d'affichage et une de texte, libres ou sous licence, avec où les obtenir. Aucune police dont l'utilisateur n'a pas la licence.
- **Brief de logo** : ce qu'il doit dire, où il doit fonctionner (enseigne, gobelet, icône 32 px), ce qu'il faut éviter. Les concepts générés sont des concepts, pas un logo fini.
- **Les cinq premiers points de contact** : enseigne ou page d'accueil, emballage, reçu ou confirmation, premier post, réponse à la première réclamation.

## Règles

- Ne jamais copier nom, logo, couleurs ou accroche d'un concurrent.
- Aucune police, image ou icône sans droit d'usage.
- Pas un conseil juridique sur les marques.

## Sortie

`business/brand.md`. Suite : `ops` et `launch`.
