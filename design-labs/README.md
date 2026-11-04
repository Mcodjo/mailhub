# Design Labs — Domial

Laboratoire de conception UI/UX produit par drx-mockup, gouverne par drx-design.
Les maquettes validees ici servent de contrat visuel pour l'implementation frontend.

## Sources de verite

- `MailPro Hub — CDC.html` — CDC v2.0 (module 5 pour la structure d'ecrans)
- `doc/ARCHITECTURE.md` — flux reception/envoit, contraintes techniques

## Exigences transverses (non negociables)

- Aucun emoji dans l'interface ; icones professionnelles coherentes (librairie
  dediee, exemple Lucide).
- Responsive : single-column < 768px, 3 colonnes >= 1024px.
- Accessibilite WCAG 2.2 AA minimum : contrastes, focus visible, navigation clavier.
- Etats obligatoires pour chaque ecran : initial, chargement, vide, partiel,
  succes, erreur, hors-ligne, permission declinee (OAuth refuse), conflit.

## Ecrans du perimetre V1 (F01-F11)

1. Auth : inscription / connexion / reset mot de passe
2. Dashboard : domaines configures, boites associees, badge mails non lus
3. Wizard configuration domaine (5 etapes, voir CDC module 2 — etape alias
   "Envoyer en tant que" ajoutee lors de la connexion Gmail)
4. Boite de reception : 3 colonnes (sidebar / liste / lecture)
5. Redaction : modal ou panneau (De adresse pro, A, CC, Objet, editeur riche, Envoyer)
6. Lecture thread : conversation groupee, Repondre / Transferer / Supprimer
7. Envoyes + Brouillons
8. Profil : comptes Gmail connectes, deconnexion OAuth, domaines, alias (F11)
9. Snippets d'integration (F10) : onglets Laravel / Node.js / WordPress

## Decisions L8 — choix de variantes (2026-11-04)
Validées explicitement par L8 dans la session :

| Interface | Variante retenue | Statut | Condition / note |
|---|---|---|---|
| Landing | `landing-c.html` | **VALIDEE L8** | Hero "installer la boite pro en 10 min" wizard-first |
| Auth | `auth-b.html` | **VALIDEE L8** | |
| Boite de reception | `inbox-c.html` | **VALIDEE L8 SOUS CONDITION** | Faisabilité verifiée par DRX le 2026-11-04 : rail de canaux par alias + conversations = OK (emails.alias_id + index, API ?alias=, F11 dans perimetre V1). CONDITION : commentaires internes equipe EXCLUS de V1 (F17 multi-utilisateurs = V2) |
| Rédaction | `compose-c.html` | **VALIDEE L8** | Page dédiée avec barre latérale de contexte thread |
| Wizard | `wizard-c.html` | **VALIDEE L8** | Checklist progressive + polling live par enregistrement (CDC-1 alias + propagation 15min-48h) |

Dashboard : non tranché explicitement par L8 — suite logique proposée : aligner sur le modele
canaux d'inbox-c pour la coherence (dashboard-c), a confirmer.

Arbitrages design-system actés : CTA primaire = encre pleine (contraste 15,7:1) ;
bleu acier uniquement graphisme ; logo a partir des fichiers kit uniquement, jamais retape.

## Statuts de maquette

| Fichier | Statut | Date | Notes |
|---|---|---|---|
| `mockups/assets/design-system.css` | Termine | 2026-11-04 | Tokens palette, typo, composants, responsive de base |
| `mockups/auth.html` | Termine | 2026-11-04 | Onglets connexion / inscription / reset ; etats erreur + succes demontres |
| `mockups/dashboard.html` | Termine | 2026-11-04 | Synthese, 2 domaines, badges non lus ; etat vide demontre |
| `mockups/wizard.html` | Termine | 2026-11-04 | Stepper 5 etapes ; etapes 1-3 repliees, propagation + Gmail detaillees |
| `mockups/inbox.html` | Termine | 2026-11-04 | 3 colonnes >=1024, 1 col <768 ; etats vide / chargement / erreur / hors-ligne visibles |
| `mockups/thread.html` | Termine | 2026-11-04 | Conversation groupee, actions Repondre / Transferer / Supprimer ; etat conflit
| `mockups/compose.html` | Termine | 2026-11-04 | De adresse pro, chips destinataires, editeur riche ; brouillon auto + etats erreur / succes
| `mockups/sent.html` | Termine | 2026-11-04 | Liste envoyes ; etats chargement / erreur / vide demontres
| `mockups/profile.html` | Termine | 2026-11-04 | Gmail OAuth (jeton, deconnexion), domaines, alias ; etats deconnecte / declinede / conflit
| `mockups/snippets.html` | Termine | 2026-11-04 | Onglets Laravel / Node.js / WordPress + webhook ; identifiants factices uniquement
| `design-system.md` | Termine | 2026-11-04 | Palette hex, typo, espacements, composants, regles d'etats, responsive, iconographie |

## maquettes à 3 variantes (brief 2026-11-04-MOCKUP-002)

3 propositions DISTINCTES par interface (structure et densité differentes, pas que la couleur),
conformes au guide logo Domial (brand renomme, palette imposee, wordmark jamais retape).

| Fichier | Statut | Date | Notes |
|---|---|---|---|
| `benchmark.md` | Termine | 2026-11-04 | Benchmark secteur webmail + config domaine + landings SaaS ; elements verifies web marques [vérifié web], le reste [mémoire] ; 12 enseignements sources |
| `proposals/design-system.css` | Termine | 2026-11-04 | Tokens primitives/sémantiques/composants ; CTA encre, acier reserve au graphisme ; actions d'etats derivees de l'encre |
| `proposals/landing-a.html` | Termine | 2026-11-04 | Hero produit sobre, 3 features, CTA double |
| `proposals/landing-b.html` | Termine | 2026-11-04 | Hero benefice + capture UI 3 colonnes en CSS pur |
| `proposals/landing-c.html` | Termine | 2026-11-04 | Wizard-first « boîte pro en 10 min », fond encre, mini-wizard inline |
| `proposals/auth-a.html` | Termine | 2026-11-04 | Carte centree à onglets (connexion/inscription/reset) ; etats erreur + succes + chargement |
| `proposals/auth-b.html` | Termine | 2026-11-04 | Split-screen encre/formulaire, Google OAuth, regles mot de passe |
| `proposals/auth-c.html` | Termine | 2026-11-04 | Minimal pleine page, champs lignes, modes secondaires documentes |
| `proposals/dashboard-a.html` | Termine | 2026-11-04 | Cartes domaines + synthese + badges non lus ; etat vide demontre |
| `proposals/dashboard-b.html` | Termine | 2026-11-04 | Tableau dense + filtres ; bandeau erreur polling + ligne skeleton |
| `proposals/dashboard-c.html` | Termine | 2026-11-04 | Liste groupee par boîte (canal), accordeons ; etat vide dans un groupe |
| `proposals/inbox-a.html` | Termine | 2026-11-04 | Familiar dense type Gmail ; hors-ligne + skeleton demontres |
| `proposals/inbox-b.html` | Termine | 2026-11-04 | Lecture-first type Superhuman ; hints clavier ; skeleton lecture |
| `proposals/inbox-c.html` | Termine | 2026-11-04 | Canaux par boîte type Missive ; bulles conventions + commentaire interne |
| `proposals/compose-a.html` | Termine | 2026-11-04 | Modal compacte; alias « Envoyer en tant que » en erreur (CDC-1) ; autosave + echec envoi |
| `proposals/compose-b.html` | Termine | 2026-11-04 | Panneau pleine hauteur ; alias verifie ; etats succes/erreur references |
| `proposals/compose-c.html` | Termine | 2026-11-04 | Page dediee + barre laterale de contexte thread (citations) |
| `proposals/wizard-a.html` | Termine | 2026-11-04 | Stepper horizontal 5 etapes ; propagation DNS 15 min-48 h ; code Gmail (CDC-1) |
| `proposals/wizard-b.html` | Termine | 2026-11-04 | Timeline verticale narrative + journal horodate |
| `proposals/wizard-c.html` | Termine | 2026-11-04 | Checklist progressive, polling live par sous-point, relance manuelle |
| `proposals/README.md` | Termine | 2026-11-04 | Tableau pitch des 18 variantes + recommandation drx-mockup par interface + mapping benchmark |

Recommandation rapide et justifications detaillees : voir `proposals/README.md`.
