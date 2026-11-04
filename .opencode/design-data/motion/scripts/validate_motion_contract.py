#!/usr/bin/env python3
"""Validation déterministe des contrats motion DRX.

Usage:
  python validate_motion_contract.py storyboard.json copy-timing.json

Le script vérifie les invariants utiles au handoff sans rendre ni modifier de code produit.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"{path}: JSON invalide: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path}: l'objet racine doit être un objet JSON")
    return value


def validate_storyboard(data: dict) -> list[str]:
    errors: list[str] = []
    required = {"composition", "support", "format", "duree_frames", "scenes", "integration", "validation"}
    errors.extend(f"storyboard: champ absent: {field}" for field in sorted(required - data.keys()))
    fmt = data.get("format", {})
    if isinstance(fmt, dict):
        for field in ("largeur", "hauteur", "fps"):
            if not isinstance(fmt.get(field), int) or fmt[field] <= 0:
                errors.append(f"storyboard.format.{field}: entier strictement positif attendu")
    scenes = data.get("scenes", [])
    if not isinstance(scenes, list) or not scenes:
        errors.append("storyboard.scenes: au moins une scène est requise")
        return errors
    ids: set[str] = set()
    end_frame = 0
    for index, scene in enumerate(scenes):
        prefix = f"storyboard.scenes[{index}]"
        if not isinstance(scene, dict):
            errors.append(f"{prefix}: objet attendu")
            continue
        scene_id = scene.get("id")
        if not isinstance(scene_id, str) or not scene_id:
            errors.append(f"{prefix}.id: identifiant requis")
        elif scene_id in ids:
            errors.append(f"{prefix}.id: identifiant dupliqué: {scene_id}")
        else:
            ids.add(scene_id)
        start = scene.get("debut_frame")
        duration = scene.get("duree_frames")
        if not isinstance(start, int) or start < 0:
            errors.append(f"{prefix}.debut_frame: entier positif ou nul attendu")
            start = 0
        if not isinstance(duration, int) or duration <= 0:
            errors.append(f"{prefix}.duree_frames: entier strictement positif attendu")
            duration = 0
        end_frame = max(end_frame, start + duration)
    total = data.get("duree_frames")
    if isinstance(total, int) and end_frame > total:
        errors.append(f"storyboard: les scènes dépassent la durée déclarée ({end_frame} > {total} frames)")
    if data.get("integration") not in {"drx-code", "design-lab"}:
        errors.append("storyboard.integration: drx-code ou design-lab attendu")
    return errors


def validate_copy(data: dict) -> list[str]:
    errors: list[str] = []
    required = {"projet", "langue", "scenes", "contraintes"}
    errors.extend(f"copy: champ absent: {field}" for field in sorted(required - data.keys()))
    scenes = data.get("scenes", [])
    if not isinstance(scenes, list) or not scenes:
        errors.append("copy.scenes: au moins une scène est requise")
        return errors
    ids: set[str] = set()
    for index, scene in enumerate(scenes):
        prefix = f"copy.scenes[{index}]"
        if not isinstance(scene, dict):
            errors.append(f"{prefix}: objet attendu")
            continue
        scene_id = scene.get("id")
        if not isinstance(scene_id, str) or not scene_id:
            errors.append(f"{prefix}.id: identifiant requis")
        elif scene_id in ids:
            errors.append(f"{prefix}.id: identifiant dupliqué: {scene_id}")
        else:
            ids.add(scene_id)
        if not isinstance(scene.get("texte_ecran"), str):
            errors.append(f"{prefix}.texte_ecran: texte requis")
        duration = scene.get("duree_cible_ms")
        if not isinstance(duration, int) or duration <= 0:
            errors.append(f"{prefix}.duree_cible_ms: entier strictement positif attendu")
        limit = scene.get("limite_caracteres_ecran")
        text = scene.get("texte_ecran", "")
        if isinstance(limit, int) and isinstance(text, str) and len(text) > limit:
            errors.append(f"{prefix}.texte_ecran: {len(text)} caractères > limite {limit}")
    constraints = data.get("contraintes", {})
    if not isinstance(constraints, dict) or constraints.get("version_sans_audio") not in {"obligatoire", "recommandee", "non-requise"}:
        errors.append("copy.contraintes.version_sans_audio: valeur valide requise")
    return errors


def main(argv: list[str]) -> int:
    if len(argv) not in {2, 3}:
        print("Usage: validate_motion_contract.py storyboard.json [copy-timing.json]", file=sys.stderr)
        return 2
    errors = validate_storyboard(load_json(Path(argv[1])))
    if len(argv) == 3:
        errors.extend(validate_copy(load_json(Path(argv[2]))))
    if errors:
        print("\n".join(f"ERREUR: {error}" for error in errors))
        return 1
    print("Contrats motion valides")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
