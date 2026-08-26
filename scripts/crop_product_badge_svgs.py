"""Crop Figma-exported category card SVGs to circular badge only."""
from __future__ import annotations

import re
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "annual" / "products"
PINK = "#EC078D"

# Card local coords: circle group at ~64.14,0 size 70.11
BADGE_VB = "64.14 0 70.11 70.11"

CARDS = {
    "makeup": "makeup-card.svg",
    "hygiene": "hygiene-card.svg",
    "electric": "electric-card.svg",
    "health": "health-card.svg",
    "perfume": "perfume-card.svg",
    "gold": "gold-card.svg",
}


def crop_badge(src: Path, dest: Path) -> None:
    raw = src.read_text(encoding="utf-8")
    if len(raw) < 100:
        raise RuntimeError(f"empty/short card svg: {src}")

    # Drop artboard chrome
    raw = re.sub(r'<rect[^>]*fill="#1E1E1E"[^/]*/>', "", raw)
    raw = re.sub(
        r'<rect[^>]*width="1920"[^>]*height="15000"[^/]*/>',
        "",
        raw,
    )
    # Brand pink
    raw = (
        raw.replace("#FF03FF", PINK)
        .replace("#ff03ff", PINK)
        .replace("rgb(255,3,255)", PINK)
        .replace("rgb(255, 3, 255)", PINK)
    )
    # Replace outer svg open tag viewBox/width/height
    raw = re.sub(
        r"<svg\b[^>]*>",
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{BADGE_VB}" fill="none">',
        raw,
        count=1,
    )
    dest.write_text(raw, encoding="utf-8")
    print(dest.name, dest.stat().st_size)


def main() -> None:
    for name, card in CARDS.items():
        src = OUT / card
        if not src.exists() or src.stat().st_size < 100:
            print("MISSING", name, src)
            continue
        crop_badge(src, OUT / f"{name}.svg")


if __name__ == "__main__":
    main()
