# Design Labs — MailPro Hub

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
