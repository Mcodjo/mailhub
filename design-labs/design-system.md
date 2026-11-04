# Design System — MailPro Hub

Contrat visuel produit par drx-mockup (nov. 2026), applicable à l'implémentation frontend.
Tokens : `mockups/assets/design-system.css` (variables CSS standard).

## 1. Justification d'identité (5 lignes)

Pourquoi bleu nuit + ambre + menthe : le bleu nuit inspire la rigueur d'un outil de
courrier professionnel (banque, cabinet) sans tomber dans le bleu générique des webmails
grand public ; l'ambre est un accent chaud réservé à l'action, il signale inbox/CTA avec
une lisibilité AA pleine sur fonds clairs ; le vert menthe code les statuts de vérification
(DNS, OAuth) pour distinguer « succès » de « action ». Enfin, aucune couleur violette ni
dégradé : l'identité repose sur une palette plate, imprimable, et le rouge reste réservé
strictement aux erreurs.

## 2. Palette (tokens)

| Token | Hex | Usage |
|---|---|---|
| `--navy-900` | `#0E172B` | Sidebar, bandeau de marque |
| `--navy-800` | `#14213D` | Hover primary |
| `--navy-700` | `#1C2E52` | **Primary** : CTA principaux, liens |
| `--navy-500` | `#34497F` | Focus ring |
| `--navy-100` | `#E2E8F4` | Avatars, fonds soulignés |
| `--amber-500` | `#D97706` | **Accent** : CTA action (Nouveau mail, Envoyer) |
| `--amber-600` | `#B45309` | Hover accent, texte warning |
| `--amber-100` | `#FEF3DE` | Badge « non lu » en fond, chips |
| `--mint-600` | `#0E9F6E` | **Succès** : statuts propagé / vérifié |
| `--mint-100` | `#DCFAEE` | fonds d'état succès |
| `--red-600` | `#DC2626` | **Erreur** / bouton danger |
| `--gray-900 … 50` | `#111827 → #F9FAFB` | Texte séparateurs, surfaces alternatives |

Mapping W3C : primitives (`--navy-*`, `--amber-*`…) → sémantiques (`--color-primary`,
`--color-accent`, `--color-success`, `--color-error`, `--color-surface`,
`--color-outline`) → composants (`.btn-primary` etc.). Aucune valeur brute dans les composants.

## 3. Typographie

Pile système : `Inter, SF Pro Text, Segoe UI, system-ui, Roboto` (pas de webfont requise —
les maquettes fonctionnent en `file://`). Monospace pour DNS / tokens / snippets.

| Rôle | Taille | Poids |
|---|---|---|
| Display | 32 px | 700 |
| Headline | 24 px | 600 |
| Title | 18 px | 600 |
| Body | 15 px | 400 |
| Body S | 14 px | 400 |
| Label | 13 px | 500–600 |
| Overline | 11 px | 600 + majuscules +0.08em |

## 4. Échelle d'espacement (4 pt)

`--space-1…9` : 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 px.
Marges écran : 16 px mobile, 24 px desktop. Rayons : 6 / 10 / 14 / pill.

## 5. Composants

Bibliothèque dans `design-system.css` : `btn` (primary / accent / secondary / danger /
ghost + `is-loading`), `badge` (unread / success / error / warning / neutral / primary),
`input` / `select` / `textarea` (+ état error via `aria-invalid`), `card`, `alert`
(info / success / error / warning), `skeleton` + `spinner`, `tabs`, `stepper` (wizard),
`table`, `icon` (SVG inline Lucide-style, strokes 2 px, tailles 14 / 16 / 20 / 24 px).

## 6. Règles d'états

Chaque écran de liste couvre : défaut, **chargement** (skeleton, jamais spinner seul),
**vide** (message + CTA), **erreur** (cause + remédiation + action), **hors-ligne**
(données locales datées), **conflit** (gestion multi-appareil / alias dupliqué),
**succès** (confirmations passées). Les states démo sont rendus visibles dans les
maquettes (sections marquées « démonstration ») et devront être togglables en prod.

## 7. Responsive

- `< 768 px` : une colonne, sidebar repliée en barre horizontale, volet lecture plein écran (push).
- `768–1023 px` : liste + sidebar, lecture masquée (navigation « retour »).
- `>= 1024 px` : 3 colonnes (sidebar 260 px / liste 340 px / lecture fluide).
- Breakpoints : 375 / 390 / 430 / 768 / 1024 / 1280.
- Touch targets ≥ 44 px partout (boutons, icon-btn).

## 8. Iconographie

SVG inline (style Lucide, stroke 2 px) : aucune dépendance externe, aucun emoji.
Seules formes autorisées : envelope, send, inbox tray, globe (domaines), settings,
user, link (snippets), paperclip, trash, archive, search, check, warning, cloud-off,
refresh, printer. Tailles : 14 (inline), 16 (boutons secondaires), 20 (nav), 24 (brand).

## 9. Accessibilité

Contraste AA vérifié (navy-700 sur blanc : 11.2:1 ; amber-600 sur blanc : 4.8:1 ; texte
sur amber-500 blanc : 4.6:1). `:focus-visible` toujours ambre ou navy, contenu des
icônes décoratives `aria-hidden="true"`, formulaires avec `<label>`, états annoncés via
`role="alert"` / `role="status"`, `prefers-reduced-motion` respecté.
