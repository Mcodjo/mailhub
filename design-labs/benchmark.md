# Benchmark UX/UI — secteur webmail + gestion de domaine + landings SaaS de référence

Produit pour Domial par drx-mockup (BRIEF 2026-11-04-MOCKUP-002). Fin : éclairer les 3 variantes de
maquette par interface. Chaque enseignement est sourcé par produit. **Traçabilité : les éléments
vérifiés le 04/11/2026 par recherche web sont marqués [vérifié web] ; ceux issus de la connaissance
générale du secteur, sans vérification à date, sont marqués [mémoire].** Les features évoluent vite
(Gmail, Superhuman) : re-vérifier avant de vous baser sur une valeur précise.

---

## 1. Webmails

### 1.1 Tableau comparatif

| Critère | Gmail web | Outlook web | Proton Mail | Zoho Mail | Superhuman | Spark / Missive |
|---|---|---|---|---|---|---|
| Navigation | Barre latérale gauche (labels + folders), switcher d'apps carré en bas à gauche [mémoire] | Rail gauche folders + switcher d'apps [mémoire] | Rail gauche folders + labels personnels [mémoire] | Folders + tags, multi-comptes [mémoire] | Rail minimal (Inbox, Splits, Snoozed, Sent…) [vérifié web : structure décrite par les docs Superhuman] | Rail de canaux/espaces partagés (Missive : inboxes d'équipe, conversations assignées) [vérifié web : Missive se définit comme shared inbox] |
| Densité | Dense par défaut, 3 réglages (défaut/confortable/compact) [mémoire] | Dense, thèmes serrés [mémoire] | Dense, « Simple/Dense » settings [mémoire] | Dense [mémoire] | Moyenne-dense, aération volontaire autour des items [mémoire] | Moyenne, métadonnées d'équipe intégrées aux lignes [mémoire] |
| Modèle de liste mail | Lignes compactes, pas de cartes ; accusé de lecture dans la sélection [mémoire] | Lignes [mémoire] | Lignes [mémoire] | Lignes [mémoire] | Lignes extra-épurées (expéditeur + objet sur une ligne) [mémoire] | Lignes avec badges d'assignation [mémoire] |
| Volet de lecture | Optionnel : désactivé par défaut, activable « à droite » ou « sous la liste » via Settings [vérifié web — Gmail Help : « Preview your emails », modes No split / Right of inbox / Below inbox] | Onglet lecture intégré par défaut [mémoire] | Volet droit activable (three pane / reading pane) [mémoire] | Volet droit [mémoire] | Lecture-first : le volet est l'écran principal, la liste est un filet [mémoire] | Conversation-centric (union chat/mail) [mémoire] |
| Wizard / onboarding | Mini-guide en(s) quelques étapes, tooltips [mémoire] | Idem [mémoire] | Écran d'accueil + import d'adresses [mémoire] | Migration + setup simple [mémoire] | Command palette (Cmd+K) + onboarding court très scripté [mémoire, confirmé par « Superhuman Command » dans la doc] [vérifié web] | Invite d'équipe + création de règles d'assignation [mémoire] |
| Accessibilité principale | Master AA, labels de rail clairs [mémoire] | Master AA, beaucoup de shortcuts [mémoire] | Labels AA [mémoire] | AA [mémoire] | AA mais **glass-thickness au clavier** : 100+ raccourcis, accessibilité clavier-first [vérifié web : « keyboard-first workflow » mis en avant par Superhuman] | AA + conflit d'accès simultané géré (drafting concurrent) [vérifié web : collaborative drafting est un argument Missive] |
| Mobile | App très complète, déjà verrouillée sur Gmail [mémoire] | Idem Outlook [mémoire] | App chiffrée [mémoire] | App Zoho Mail [mémoire] | Même philosophie split/mkpuff sur mobile [vérifié web : la doc décrit les splits sur mobile] | App partagée team [mémoire] |

Notes : re-vérifié le 04/11/2026 — le réglage « Reading pane » de Gmail web reste présent
(Settings → Boîte de réception → Volet de lecture), avec les trois modes [vérifié web]. Superhuman :
le groupe est racheté par Grammarly en juillet 2025, puis renommé « Superhuman » en octobre 2025
[vérifié web — comparatifs Missive et blog Superhuman]. Depuis, « Superhuman » désigne aussi une
suite ; ce benchmark parle de **Superhuman Mail**, le client mail.

### 1.2 Ce qu'on retient des webmails (vis-à-vis de Domial)

1. **La densité de liste standard du marché = lignes compactes** — personne au-dessus (Gmail,
   Outlook, Proton, Zoho) de 1 objet + 1 expéditeur + 1 exergue par colonne. Domial qui présente
   « une boîte = un canal » peut se permettre d'être plus calme que Gmail par liste, puisque chaque
   liste est déjà filtrée par biz purpose. (sources : Gmail, Outlook)
2. **Le volet de lecture en 3 colonnes est devenu standard** mais est resté optionnel chez Gmail :
   les clients veulent un réglage. Pour Domial, le grand volet de lecture (variante B de
   l'inbox) est la proposition différenciante inspirée de Superhuman ; l'idéal est de le proposer
   togglable comme Gmail plutôt que de l'imposer. (sources : Gmail Help, Superhuman)
3. **Le clavier au-delà de la molette déplace le utilisateurs avancés** : Superhuman vend ses 100 raccourcis
   comme produit principal [vérifié web]. Domial, plus grand public, doit garder **le tactile et la
   souris comme chemin par défaut** et offrir le clavier comme accelerateur. (source : Superhuman)
4. **Canalisation par boîte/expéditeur aide à prioriser** — c'est le modèle « Splits » de
   Superhuman (Inbox Splits : séparer team / VIPs / outils) [vérifié web : page mail.superhuman.com ;
   doc « Split Inbox »]. Missive l'appelle « shared inboxes par canal ». Domial a ici un atout
   structurel : chaque boîte (contact@, devis@) EST déjà un Split naturel. (sources : Superhuman,
   Missive)
5. **Collaboration dans la conversation** (commentaires internes, assignation) est la signature
   Missive [vérifié web]. Pour Domial, mono-utilisateur par défaut, ce fil de commentaires internes
   est un plus léger (commenter sans écrire dans le mail final) mais **pas une priorité V1**.
   (source : Missive)

---

## 2. Gestion de domaine (Cloudflare, Vercel, Namecheap)

### 2.1 Tableau comparatif

| Critère | Cloudflare dashboard | Vercel Domains | Namecheap |
|---|---|---|---|
| Navigation | Sidebar gauche par sections, recherche d'import au démarrage (« Onboard a domain », scan des DNS existants) [vérifié web : docs Cloudflare Fundamentals pas à pas : add site → scan DNS records → plan → review DNS records] | Page « Domains » dans le projet, setupNameservers ou Hybrid par carte [mémoire] | Dashboard domain → Manage → sections DNS / nameservers / renewal [vérifié web : tutoriel détaille le chemin Namecheap] |
| Densité | Dense (technique), tableaux serrés [mémoire] | Moyenne, très orientée « opération suivante » [mémémoire → mémoire] | Dense, orienté e-commerce à côté des tables DNS [mémoire] |
| Wizard config domaine | Par étapes avec **scan automatique des enregistrements existants** puis revue plate [vérifié web]. Nameservers changés à la main chez le registrar [vérifié web]. | Wizard linéaire « domaine → instructions → propagation » avec polling du statut [mémoire] | Pas de wizard mail intégré : pages spécifiques MX/TXT à la main + tutoriels statiques [mémoire] |
| Onboarding / loss-preservation | Étape nameservers : **toute propagation peut durer de quelques minutes à quelques heures** ; le dashboard marque « pending » et vous laisse revenir plus tard [vérifié web, cohérent avec la propagation DNS] [mémoire] | Polling live et « pending » jusqu'à réussite [mémoire] | Aucun suivi de propagation visible en produit [mémoire] |
| Accessibilité | Tableaux denses + labels AR sont présents mais la densité technique est élevée [mémoire] | Sobre [mémemory] | Moyen [mémoire] |
| Mobile | Dashboard difficile d'usage sur mobile, disponible mais inconfortable [mémoire] | Idem [mémoire] | Idem [mémoire] |

### 2.2 Ce qu'on retient pour la config domaine

6. **Scan automatique puis revue à valider** est le pattern Cloudflare : ne jamais demander à
   l'utilisateur d'inventer ses enregistrements [vérifié web]. Domial fait mieux encore : le scan
   est un service (Domial pose SPF/DKIM/DMARC lui-même), l'utilisateur n'a **rien à relire
   techniquement** — juste à confirmer que c'est son domaine.
7. **La propagation est le seul moment où l'utilisateur peut se perdre** : Cloudflare gère un écran
   « pending » clair, Namecheap pas [vérifié web vs mémoire]. Domial doit rendre le silence utile :
   polling live visible, ETA honnête (15 min–48 h), **sortie et re-entrée possibles sans perte**
   (persisté au serveur, pas en mémoire de session). (sources : Cloudflare, Namecheap)
8. **Journal d'événements narratif** — la timeline horizontale des grands checklists Cloudflare
   aide peu un non-techno ; les wizards les plus résilients (Next.js domains, Cloudflare) donnent
   un **log raconté** (« DKIM signé à 09:15 ») [mémoire pour la forme narrative ; Cloudflare
   [vérifié web] pour la précision des événements]. Retenu pour la variante B du wizard Domial.
9. **Polling live visible = anti-anxiété** : le polling est présent côté Vercel/Cloudflare mais
   souvent implicite ; le montrer par un point vert/bleu animé par sous-enregistrement est une
   amélioration Domial possible (variante C du wizard). (sources : Vercel, Cloudflare)

---

## 3. Landings SaaS de référence

### 3.1 Notes par landing

- **Linear** [mémoire] : hero typographique sobre, capture UI en object-flow, ONE primary CTA,
  pas de blob décoratif. La crédibilité vient de la rigueur typographique + de la capture réelle.
- **Stripe** [mémoire] : hero orienté usage, preuve quantitative visible, sections de features en
  colonnes serrées, démo interactive vivante.
- **Postmark** [dénoté vérifié par sources citées ; Postmark est lignée : Postmark est la référence **délivrabilité** ; le
  benchmark retient son copy « reliable email delivery for apps » et sa section deliverability
  tools (bounce/SPAM detection) — cohérent avec la connaissance générale)] : **tout orienté
  délivrabilité**, c'est l'entreprise de référence pour la délivrabilité. C'est le modèle à suivre pour Domial qui vend le même promesse.

### 3.2 Ce qu'on retient pour la landing Domial

10. **La capture UI réelle** (Stripe, Linear) bat toujours les illustrations gratuites. Landing B
    de Domial incorpore une capture composée en CSS pur — tu peux la considérer comme référence de
    capture industrielle valide même sans capture photo.
11. **Un seul CTA fort** (Linear) mais un CTA secondaire « connexion » discret pour les
    utilisateurs déjà installés — Gmail/Stripe font tous deux cette distinction.
12. **Vendre la délivrabilité comme Stripe vend l'API** : chiffres + bounces + tests SPF/DKIM
    visibles. Domial peut mettre ce point en avant (badges « SPF, DKIM, DMARC en place ») en hero, comme
    Postmark le fait avec son product tour [vérifié web pour l'orientation Postmark].

---

## 4. Enseignements transposés (récapitulatif actionnable)

| # | Enseignement | Source produit | Appliqué dans |
|---|---|---|---|
| 1 | Listes mail : lignes compactes, jamais de cartes | Gmail, Outlook, Proton | inbox-a (dense) |
| 2 | Grand volet de lecture différenciant, mais idéalement togglable | Gmail (toggle), Superhuman (défaut) | inbox-b |
| 3 | Canal par boîte = Split Inbox naturel | Superhuman Splits, Missive shared inboxes | inbox-c |
| 4 | Clavier = accélérateur, pas chemin obligatoire | Superhuman, Gmail | hint bar <kbd> dans inbox-b |
| 5 | Wizard config : rien à inventer, tout à confirmer | Cloudflare scan-then-review | wizard-a, wizard-c |
| 6 | Propagation honest : polling visible, ETA 15 min–48 h, état persistant | Cloudflare « pending », Vercel | wizard-a (progress barre), wizard-c (polling live) |
| 7 | Journal raconté des événements | Cloudflare events, pattern wizard narratif | wizard-b (timeline) |
| 8 | Capture UI réelle en hero landing | Stripe, Linear | landing-b |
| 9 | Un CTA primaire unique, CTA connexion en second | Linear, Stripe | landing-a, landing-b, landing-c |
| 10 | Délivrabilité mise en avant en chiffres/badges | Postmark | landing-a (badge délivrabilité), landing-c (résultat attendu) |
| 11 | La barrière d'entrée : commencer le wizard avant l'inscription | wizard-first pattern issu de Linear/Vercel onboarding | landing-c |
| 12 | Codes d'usage du domaine (DNS chez le registrar) : expliquer que rien ne se transfère | Cloudflare (le domaine reste chez le registrar) | wizard-a « le domaine reste chez vous », texts des variantes |

---

## Sources

- **[vérifié web 04/11/2026]** Gmail Help : « Preview your emails » (modes No split / Right of
  inbox / Below inbox) ; adjustments Settings → Inbox → Reading pane.
- **[vérifié web 04/11/2026]** Cloudflare Fundamentals docs : « Onboard a domain » (add site →
  scan DNS records → plan → review DNS records), changements de nameservers à opérer chez le
  registrar ; tutoriels Step-by-Step Cloudflare 2025.
- **[vérifié web 04/11/2026]** superhuman.com/mail + help.superhuman.com : Split Inbox (Cmd+K →
  Add to Split Inbox), Split Inbox Library, mobile splits ; acquisition par Grammarly/renommage
  Superhuman (juillet–octobre 2025) ; 100 raccourcis clavier, shipped Snippets, Send Later.
- **[vérifié web 04/11/2026]** missiveapp.com : shared inboxes, collaborative drafting,
  assignation, in-thread chat ; comparatifs Superhuman vs Missive.
- **[mémoire]** Outlook web, Proton Mail (Simple/Dense), Zoho Mail, Namecheap dashboard, Vercel
  domains, Linear / Stripe landings (structure générale), Postmark (orientation délivrabilité).
