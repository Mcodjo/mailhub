# Mémoire opérationnelle DRX

Ce fichier trace les patterns détectés et les décisions contextuelles apprises par DRX au fil des projets.

## Règles d'usage

- Ajouts append-only (pas de suppression sans validation L8)
- Max 50 patterns actifs (au-delà, archiver les plus anciens)
- Format : `### [PATTERN-XXX] [Date] Titre`
- Chaque pattern inclut : occurrences, contexte, impact, action
- Seuil de detection : ≥3 occurrences sur des **projets differents** (pas 3
  fois dans la meme session). Spec complete : `drx.agent.md` § Apprentissage
  supervise. Consequence attendue : ce fichier reste vide tant que DRX n'a pas
  travaille sur plusieurs projets distincts — ce n'est pas un signe de panne
  tant que ce seuil n'est pas atteint.

---

## Patterns détectés

_Aucun pattern détecté pour le moment._

<!--
EXEMPLE DE GABARIT — a dupliquer pour une vraie entree, ne pas laisser tel quel :

### [PATTERN-001] [2026-07-13] Titre court et descriptif
**Occurrences** : 3 projets sur 4 semaines
**Contexte** : description du contexte recurrent observe
**Impact** : consequence concrete (bug, friction, incoherence...)
**Action** : → PROP-001
-->

---

## Décisions contextuelles apprises

_Aucune décision contextuelle apprise pour le moment._

---

## Patterns archivés

_Aucun pattern archivé pour le moment._
