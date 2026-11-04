# Mode `pricing` : le prix que les acheteurs paieront vraiment

Le prix est le levier le plus rapide sur la marge et celui que les fondateurs devinent le plus. Il se fixe avec trois choses vérifiables : ce que les acheteurs ont dit, ce que facturent les concurrents, ce dont l'entreprise a besoin.

```bash
python .github/agents/design-data/business/scripts/van_westendorp.py business/panel/answers --price 6.50 --out business/pricing-curve.md
```

## Étape 1 : ce que les acheteurs ont dit

Si `consumer` a tourné, chaque acheteur a donné quatre prix. Lancer l'outil sur `business/panel/answers` (ou un CSV avec `too_cheap, cheap, expensive, too_expensive` issu de vrais sondages, qui valent toujours mieux). Il donne :

| Point | Sens |
|---|---|
| PMC | en dessous, trop de gens jugent que c'est trop bon marché pour être bon |
| OPP | prix de moindre résistance |
| IPP | autant d'« affaire » que de « cher » |
| PME | au-dessus, trop de gens n'achètent plus |

PMC à PME = fourchette acceptable. Si le panel n'a pas tourné : le dire et proposer `consumer --quick`. Ne jamais inventer de fourchette.

## Étape 2 : ce que facturent les concurrents

Depuis `business/competitors.md` (ou leurs pages de prix publiques, avec liens) : prix des substituts les plus proches pour le même besoin, avec ce que chaque prix inclut. Comparer comparable.

## Étape 3 : ce dont l'entreprise a besoin

Depuis `business/numbers.json` : coût variable unitaire et seuil de rentabilité. Lancer l'outil CFO à deux ou trois prix candidats :

```bash
python .github/agents/design-data/business/scripts/unit_economics.py business/numbers.json --price 7.00
```

## Étape 4 : décider

Écrire `business/pricing.md` :
1. **Le prix** et pourquoi : sa place dans la fourchette, face aux concurrents, la marge qu'il donne (de l'outil).
2. **L'échelle** si possible : bon / meilleur / premium (taille, lot, abonnement) avec une raison de monter.
3. **L'offre d'ouverture** : prix ou bonus de lancement qui n'apprend pas à attendre les promos, avec date de fin.
4. **À tester avec de vrais acheteurs** : deux prix dans la fourchette et comment (deux pages, pré-vente à chaque prix, A/B sur l'ardoise).
5. Les trois principales objections de prix du panel, mot pour mot, pour que `marketing` y réponde.

## Règles

- Les prix de panel simulé choisissent quoi tester ; ce n'est pas une preuve.
- Jamais sous le coût variable pour « acheter » des clients sans le dire, ni sans la durée que le CFO juge supportable.
- Pas de faux ancrage : aucun « avant X » jamais pratiqué.

## Sortie

`business/pricing-curve.md`, `business/pricing.md`. Si le prix change : mettre à jour `business/numbers.json` et relancer `cfo`. Suite : `offer`.
