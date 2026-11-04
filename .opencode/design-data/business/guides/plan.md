# Mode `plan` : le plan d'affaires et le verdict calculé

Dernière étape. Un document sur lequel un fondateur peut agir, ou qu'il peut remettre à un associé, un prêteur ou un investisseur, construit uniquement à partir de ce que le pack a trouvé.

Exécution : `drx-business` calcule le verdict et rédige la synthèse ; `drx-doc` peut mettre en forme le plan final (Word, PDF, présentation) depuis le Markdown, qui reste la source de vérité.

```bash
python .github/agents/design-data/business/scripts/compile.py --dir business
```

## Étape 1 : voir ce qui existe

```bash
python .github/agents/design-data/business/scripts/compile.py --dir business --check
```

Affiche le verdict et chaque contrôle, tous calculés :
1. Chaque unité gagne de l'argent avant coûts fixes (`business/numbers.json`).
2. L'année 1 dégage un profit d'exploitation.
3. Le seuil de rentabilité tient dans la capacité, si elle est donnée.
4. Assez d'acheteurs simulés achètent (`business/panel/results.json` ; seuil 25 % par défaut, modifiable avec `--min-buy-rate`, en disant pourquoi).

L'outil affiche le verdict en anglais (`Profitable` = Rentable, `Not yet` = Pas encore, `Incomplete` = Incomplet) ; le restituer en français sans le modifier.

Pas de chiffres : verdict **Incomplet**, proposer `cfo`. Lister les autres sections manquantes avec le mode qui remplit chacune. Ne jamais remplir une section manquante avec des suppositions.

## Étape 2 : la synthèse

Écrire `business/summary.md`, une demi-page en mots simples :
- Ce qu'est l'entreprise et pour qui, en deux phrases.
- Le verdict et les trois chiffres derrière (marge, seuil de rentabilité, année 1).
- Ce sur quoi le conseil et le panel étaient d'accord, et où ils divergeaient.
- Le plus gros risque et ce qui sera fait.
- Ce dont le fondateur a besoin pour démarrer (trésorerie du CFO, premier test de `launch`).
- La seule chose à faire cette semaine.

Si le verdict est **Pas encore**, la synthèse commence par ce qui doit changer et quel mode le change. Ne jamais adoucir un contrôle en échec.

## Étape 3 : compiler

La commande sans `--check` écrit `business/business-plan.md` : titre, verdict et contrôles, tableau des chiffres clés, l'idée, puis chaque section produite (synthèse, conseil, concurrence, panel, prix, offre, chiffres, marketing, marque, opérations, lancement) et ce qui reste à faire.

## Étape 4 : la page unique

Écrire `business/one-pager.md` pour quelqu'un qui décide en deux minutes : problème, client, offre et prix, tableau de chiffres, preuves (résultat du panel, vide concurrentiel, test réel éventuel), à quoi sert l'argent, la demande. Mêmes chiffres que le plan, mot pour mot.

## Règles

- Le verdict vient de `compile.py`. Jamais « Rentable » écrit à la main, jamais un chiffre en échec arrondi en réussite.
- Dire clairement une fois : le panel est un ensemble d'acheteurs simulés et les chiffres sont des projections ; de vrais clients et de vrais devis les confirment. Pas un conseil financier, juridique ou fiscal.

## Sortie

`business/summary.md`, `business/business-plan.md`, `business/one-pager.md`. Donner le verdict en une ligne et la seule chose à faire cette semaine.
