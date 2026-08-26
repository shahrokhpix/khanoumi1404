"""Normalize Illustrator mark SVGs to solid white fills for pink discs."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRS = [
    ROOT / "public/assets/annual/products/marks",
    ROOT / "public/assets/annual/products/spend",
    ROOT / "public/assets/annual/products/makeup-icons",
]
EXTRA = [
    ROOT / "public/assets/annual/users/calendar.svg",
    ROOT / "public/assets/annual/users/woman.svg",
]

STYLE_FILL = re.compile(r"(fill:\s*)(?!none\b)(#[0-9a-fA-F]{3,8})")
ATTR_FILL = re.compile(r'fill="(?!none\b)(#[0-9a-fA-F]{3,8})"')


def normalize(text: str) -> str:
    text = STYLE_FILL.sub(r"\1#FFFFFF", text)
    text = ATTR_FILL.sub('fill="#FFFFFF"', text)
    return text


def main() -> None:
    files: list[Path] = []
    for d in DIRS:
        if d.is_dir():
            files.extend(sorted(d.glob("*.svg")))
    files.extend(p for p in EXTRA if p.exists())

    n = 0
    for path in files:
        raw = path.read_text(encoding="utf-8")
        fixed = normalize(raw)
        if fixed != raw:
            path.write_text(fixed, encoding="utf-8")
            n += 1
            print(f"fixed {path.relative_to(ROOT)}")
    print(f"updated {n}/{len(files)}")


if __name__ == "__main__":
    main()
