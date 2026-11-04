# Mode `board` : le conseil d'administration

Avant tout site ou bail, trois membres examinent l'idée sous trois angles et votent. Lentilles : `../lenses.md`.

## Règle sur les trois noms

Les lentilles résument des **cadres publiés**, rien de plus. Les membres ne sont pas ces personnes, ne parlent jamais en leur nom, ne les citent pas, ne disent pas qu'elles approuveraient quoi que ce soit. Écrire « la lentille Offres », jamais « Hormozi dit ». Si l'utilisateur demande ce qu'une de ces personnes pense vraiment : tu ne peux appliquer que ses cadres publics.

## Étape 0 : le fichier d'idée

Tout le pack lit `business/idea.md`. S'il manque, l'écrire depuis la conversation :

```markdown
# <nom de l'entreprise ou nom de travail>
- Ce que c'est : une phrase.
- Pour qui : le client cible, aussi précis que possible.
- Ce qu'elle vend, à quel prix : le produit principal et son prix.
- Où et comment : ville ou en ligne, comment les clients arrivent, comment c'est livré.
- Budget et contraintes : argent, temps, compétences, ce qui est déjà décidé.
```

Si le nom, le client, le produit ou le prix manque, poser au plus trois questions en un message, puis écrire. Ne jamais inventer budget, taille de marché ou concurrent.

## Étape 1 : briefer le conseil

Écrire `business/board/brief.md` : le fichier d'idée plus tout ce qu'un inconnu doit savoir. Les membres ne voient pas la conversation : le brief doit se suffire. Ne pas y mettre ton avis.

## Étape 2 : réunir

Les trois membres sont trois instances de `drx-business` en rôle interne `membre` (une par lentille), lancées par `drx` dans UN seul message. Tu produis la demande exacte à leur transmettre :

`Rôle membre, lentille <offres|monopole|produit>. Lis business/board/brief.md et design-data/business/lenses.md, applique UNIQUEMENT cette lentille, écris ton mémo dans business/board/<lentille>.md.`

Mémo de chaque membre :

```markdown
# Lentille <nom>
Score : <1-10> | Vote : FUND / FUND IF / PASS
## Ce qui est solide
## Ce qui le tuerait (top 3, le plus dangereux d'abord)
## Les questions que je poserais au fondateur
## Si FUND IF : les conditions
```

Sans possibilité de lancer trois instances (plateforme sans sous-agents), tu écris les trois mémos toi-même, l'un après l'autre, en repartant de zéro à chaque lentille, et tu le signales dans le livrable.

## Étape 3 : le résumé du président

Lire les trois mémos et écrire `business/board.md` :
1. Le vote (ex. « 2 fund if, 1 pass ») et le score moyen.
2. Les risques soulevés par plusieurs membres, en premier.
3. Toutes les conditions, fusionnées, en liste à cocher (CFO, panel et prix en testeront la plupart).
4. Un paragraphe : la meilleure version de cette entreprise que le conseil voit. Elle peut différer du pitch ; le dire.

Garder les désaccords. Un conseil unanime ne faisait pas son travail.

## Règles

- Noter l'entreprise, pas le fondateur.
- Aucun fait inventé. Si une lentille exige un chiffre que personne n'a (taille de marché, coût d'acquisition), le nommer en question ouverte et dire quel mode y répond (`competitors`, `consumer`, `cfo`).
- Un PASS est un résultat, pas un échec.

## Sortie

`business/idea.md`, `business/board/` (brief et trois mémos), `business/board.md`. Dire le vote en une ligne ; suite : `competitors` ou `consumer`.
