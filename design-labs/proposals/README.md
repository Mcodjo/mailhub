# Domial — Proposals : 3 variantes par interface (18 maquettes)

Produit par drx-mockup (BRIEF 2026-11-04-MOCKUP-002). Design system partagé : `design-system.css`
(tokens primitives/sémantiques/composants, palette imposée du guide logo). Toutes les maquettes
sont autonomes en `file://` : CSS/HTML only, SVG inline ou fichiers du kit copiés dans
`assets/logo/` (le wordmark n'est jamais retapé dans une police). Inter non embeddable hors ligne :
police système fallback déclarée (`--font-sans`). Responsive < 768px garanti. Zéro emoji, zéro
« MailPro » dans l'UI.

**Arbitrages de direction (tracés pour drx-design)** :
1. **CTA primaire = encre pleine** (`color.primary` = #16233B, contraste blanc/encre ≈ 15,7:1) ;
   le bleu acier reste graphique (barres de progression, états d'attention, `.pulse`). Le bleu acier
   en texte courant serait à 3,8:1 sur blanc — insuffisant AA, le guide l'interdit d'ailleurs.
2. **Couleurs d'état dérivées et harmonisées à l'encre** (succès `#2E6B52`, erreur `#A6423A`,
   avertissement `#8A6414`) : teintes désaturées volontairement pour que l'encre domine l'UI ;
   fonds d'alerte en nuances très claires pour garder le contraste du texte.
3. **Logo toujours via fichier du kit** (jamais retapé) : horizontal sur fond clair, `-reversed`
   sur encre, symbole seul (24px) dans les app bars denses ; zone de protection assurée par
   `.logo-zone`.

## Tableau des variantes

| Interface | Variante | Pitch | Recommandation |
|---|---|---|---|
| Landing | `landing-a.html` | Hero produit sobre : titre typographique, 3 features, CTA double. | **Recommandée** — la plus fidèle au référentiel Linear/Stripe (benchmark §3, enseignements 8–9) : un seul message, capture légère, différentiation par la sobriété. |
| Landing | `landing-b.html` | Hero bénéfice : chiffre d'enjeu (réponses clients) + capture UI 3 colonnes en CSS pur. | Complete la A : bonne candidate A/B test (temps de réponse / capture en hero, benchmark §3.1). |
| Landing | `landing-c.html` | Wizard-first : « boîte pro en 10 min », mini-wizard inline sur fond encre. | La plus transformatrice (enseignement 11) : idéal si l'objectif est l'activation immédiate, à valider côté drx-design (risque : promesse trop forte avant inscription). |
| Auth | `auth-a.html` | Carte centrée à onglets (connexion/inscription/reset) + états erreur et succès. | **Recommandée** : établit le pattern le plus familier (Gmail/Outlook mémoires) ; tous les états démontrés. |
| Auth | `auth-b.html` | Split-screen : panneau encre argumentaire à gauche, formulaire à droite, Google OAuth. | Variante conversion : met la promesse produit pendant le remplissage (pattern SaaS classique). |
| Auth | `auth-c.html` | Minimal pleine page : champs « ligne », deux modes secondaires décrits, plus sobre que tout. | Alternative en absolue orientée PWA ; garde le focus état-erreur AA avec bord latéral. |
| Dashboard | `dashboard-a.html` | Cartes domaines + synthèse (boîtes, non lus, délivrabilité) + carte « ajouter ». | **Recommandée** : lisible par un non-technicien, badges statut clairs, état vide démontré (enseignement 5). |
| Dashboard | `dashboard-b.html` | Tableau dense administrable : filtres, bandeau d'erreur polling, ligne skeleton. | Recommandée comme vue expert « expert » (dense, 3 domaines+ visible sans scroll vertical) ; utile en second niveau. |
| Dashboard | `dashboard-c.html` | Liste groupée par boîte (canal d'usage), accordéons, état vide dans un groupe. | Différenciante (enseignement 3, Missive) : pertinente dès que les users ont >1 domaine mais un ordre du jour unique. |
| Inbox | `inbox-a.html` | Familiar dense type Gmail : nav labels, liste serrée, volet lecture à droite, hors-ligne. | **Recommandée** : densité et familiarité (enseignement 1), à droite le volet lecture optionnel comme Gmail ; état hors-ligne + skeleton démontrés. |
| Inbox | `inbox-b.html` | Lecture-first type Superhuman : volet lecture XXL, typographie 16,5px, filet de conversation, hints clavier. | Réserve : accélérateur pour utilisation « lecture lourde » (enseignement 2, 4) ; à activer comme mode ou variante d'usage. |
| Inbox | `inbox-c.html` | Canaux par boîte type Missive : rail de canaux, conversations en bulles, commentaires internes | À réserver pour : multi-boîtes actives ou usage équipe (enseignement 3, 5). |
| Compose | `compose-a.html` | Modal compacte : overlay, alias en erreur CDC-1 démontré, autosave, échec d'envoi. | **Recommandée** : modal = retour rapide à la liste (Gmail/Outlook standard), états CDC-1 démontrés. |
| Compose | `compose-b.html` | Panneau pleine hauteur glissant : alias check, champs espacés, états succès + erreur. | Pour rédactions longues avec média et réponses détaillées (pièces jointes, réponses détaillées). |
| Compose | `compose-c.html` | Page dédiée avec barre latérale de contexte thread (citations, historique). | Pour le mode « rédiger depuis l'inbox de boîte » ; consommation du contexte maximale. |
| Wizard | `wizard-a.html` | Stepper horizontal classique, 5 étapes CDC, propagation + code Gmail (CDC-1). | **Recommandée** : pattern confirmé (Cloudflare scan-then-review, enseignement 5), progress simple, états erreur documentés. |
| Wizard | `wizard-b.html` | Timeline vertical narrative : journal horodaté, non-techno friendly, la « story » du DNS. | Différenciante et rassurante (enseignement 7) : idéal pour un public non technique ; à tester en A/B. |
| Wizard | `wizard-c.html` | Checklist progressive avec polling live (spinner par sous-point, ETA, relance manuelle). | La plus « anti-anxiété » (enseignement 6) ; privilégier quand l'attente propagation est longue. |

## Mapping variantes vs enseignements du benchmark

| Enseignement (benchmark.md §4) | Implémenté dans |
|---|---|
| 1 — liste lignes compactes | inbox-a |
| 2 — grand volet lecture, idéalement togglable | inbox-b |
| 3 — canal par boîte (Splits) | inbox-c, dashboard-c |
| 4 — clavier accélérateur | inbox-b (hints `<kbd>`) |
| 5 — wizard confirmatif (scan-then-validate) | wizard-a, wizard-c |
| 6 — propagation honnête + polling | wizard-a (barre), wizard-c (spinner par résolveur) |
| 7 — journal narratif | wizard-b |
| 8–9 — hero sobre + CTA unique | landing-a, landing-b |
| 10 — délivrabilité en avant | landing-a/b/c (badges SPF/DKIM/DMARC) |
| 11 — wizard-first | landing-c, auth-c |
| 12 — le domaine reste chez le registrar | wizard-a/b (copie explicite) |

## Organisation des fichiers

```
design-system.css          tokens + composants partagés
landing-a|b|c.html         3 landings
auth-a|b|c.html            3 auth (connexion / inscription / reset)
dashboard-a|b|c.html       3 dashboards domaines
inbox-a|b|c.html           3 boîtes de réception 3 colonnes
compose-a|b|c.html         3 rédactions
wizard-a|b|c.html          3 wizards de configuration domaine
assets/logo/               10 SVG du kit (couleur + inversés, incl. symbole small)
```

## Notes d'états (obligatoire par interface)

| Interface | États démontrés | Restent à maquetter |
|---|---|---|
| Landing | — | — |
| Auth | erreur login, échec d'identification, succès reset, loading | blocage tentatives |
| Dashboard | erreur polling, skeleton ligne, vide statique (A vide localement, C vide de groupe) | 0 domaine réel (A le montre) |
| Inbox | hors-ligne (A), skeleton (A/B), premier lancement | état « 0 conversation » complet |
| Compose | alias non vérifié CDC-1, échec d'envoi, succès, autosave | envoi programmé |
| Wizard | code Gmail invalide (A), propagation 15 min–48 h (toutes), échec puis relance (C), continuitive aérien (B) | succès complet étape 5 |

## Limites

- Inter non embarquée : rendu en police système hors ligne (la maquette porte quand même les
  métriques Inter en variables). Si le produit embarque Inter via Google Fonts, l'esthétique
  convergera au build.
- Les captures UI de `landing-b` sont des mocks CSS, pas des captures GPU exactes de l'application.
- Le polling dans `wizard-c` est simulé statiquement (point + spinner), pas de JavaScript executé
  (maquette pure). Un prototype interactif est à produire séparément si nécessaire.
- Les variantes auth-a/b/c partagent la même trame de champs ; elles diffèrent par disposition et
  par ordre de parcours (tabs vs split vs champs ligne) — c'est le point structurel contractuel.
