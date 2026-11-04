# Familles de transitions

Familles disponibles pour relier deux frames. Une transition forte (pivot) est rare ; les autres restent discrètes.

| Famille | Effet | Usage conseillé |
|---|---|---|
| coupe | Changement net | Défaut ; ritme rapide |
| fondu | Dissolution entre deux images | Liaison douce |
| fondu-flou | Dissolution avec flou | Changement de contexte |
| poussée | Glissement latéral ou vertical | Avancer dans une séquence |
| couverture | Un plan couvre l'autre | Hiérarchie claire entre deux idées |
| échelle / zoom | Zoom traversant | Entrer dans un détail |
| radiale / iris | Cercle qui s'ouvre depuis un objet | Pivot vers une conclusion |
| lumière | Balayage lumineux progressif | Passage d'un monde sombre à un monde clair |
| distorsion | Déformation de l'image | Changement de ton marqué, à utiliser une seule fois |
| mécanique | Volets, mécanismes | Univers industriel |
| grille | Cellules qui se remplacent | Univers de données |
| 3D | Rotation de plan | Présentations produit |

## Règles

- Maximum 2 ou 3 transitions fortes par film.
- Aucun flash plein écran, pas plus de 3 flashs par seconde. Les passages lumineux sont progressifs et limitent l'écart de luminance.
- Une transition forte démarre depuis un point précis, déclaré dans le `handoff_out` de la frame précédente.
- Le fond commun d'un monde clair est un aplat continu, pour éviter un gris au milieu d'un fondu.
- Toute transition a une durée en frames et une version sans mouvement (coupe).
