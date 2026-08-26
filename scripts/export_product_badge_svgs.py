"""Compact product category badge SVGs from PDF vector drawings + label text."""
from __future__ import annotations

from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "annual" / "products"
OUT.mkdir(parents=True, exist_ok=True)
PINK = "#EC078D"

# Pink 70×70 hub badges (ترکیب انتخاب‌ها)
ICONS = [
    ("makeup", pymupdf.Rect(743, 7025, 813, 7095), "آرایشی"),
    ("hygiene", pymupdf.Rect(1116, 7025, 1186, 7095), "بهداشتی"),
    ("electric", pymupdf.Rect(509, 7156, 579, 7226), "برقی"),
    ("health", pymupdf.Rect(1358, 7156, 1428, 7226), "سلامت"),
    ("perfume", pymupdf.Rect(743, 7303, 813, 7373), "عطر"),
    ("gold", pymupdf.Rect(1116, 7303, 1186, 7373), "طلا"),
]


def path_d(items, ox: float, oy: float) -> str:
    parts: list[str] = []
    for it in items:
        kind = it[0]
        if kind == "l":
            a, b = it[1], it[2]
            parts.append(f"M{a.x-ox:.2f} {a.y-oy:.2f}L{b.x-ox:.2f} {b.y-oy:.2f}")
        elif kind == "c":
            a, c1, c2, b = it[1], it[2], it[3], it[4]
            parts.append(
                f"M{a.x-ox:.2f} {a.y-oy:.2f}"
                f"C{c1.x-ox:.2f} {c1.y-oy:.2f} {c2.x-ox:.2f} {c2.y-oy:.2f} {b.x-ox:.2f} {b.y-oy:.2f}"
            )
        elif kind == "re":
            r = it[1]
            parts.append(
                f"M{r.x0-ox:.2f} {r.y0-oy:.2f}H{r.x1-ox:.2f}V{r.y1-oy:.2f}H{r.x0-ox:.2f}Z"
            )
    return "".join(parts)


def is_pink_circle(d, clip: pymupdf.Rect) -> bool:
    fill = d.get("fill")
    if not fill:
        return False
    r, g, b = fill
    if not (r > 0.7 and g < 0.35 and b > 0.3):
        return False
    rect = d["rect"]
    return abs(rect.width - clip.width) < 8 and abs(rect.height - clip.height) < 8


def glyph_paths(drawings, clip: pymupdf.Rect) -> list[str]:
    ox, oy = clip.x0, clip.y0
    out: list[str] = []
    for d in drawings:
        if is_pink_circle(d, clip):
            continue
        r = d["rect"]
        cx = (r.x0 + r.x1) / 2
        cy = (r.y0 + r.y1) / 2
        if not (clip.x0 <= cx <= clip.x1 and clip.y0 <= cy <= clip.y1):
            continue
        fill = d.get("fill")
        # white / near-white glyphs only
        if not fill or fill[0] < 0.85 or fill[1] < 0.85 or fill[2] < 0.85:
            continue
        d_attr = path_d(d["items"], ox, oy)
        if not d_attr:
            continue
        rule = ' fill-rule="evenodd"' if d.get("even_odd") else ""
        out.append(f'<path fill="#fff"{rule} d="{d_attr}"/>')
    return out


def badge_svg(drawings, clip: pymupdf.Rect, label: str) -> str:
    w, h = clip.width, clip.height
    cx, cy = w / 2, h / 2
    r = min(w, h) / 2
    glyphs = "\n".join(glyph_paths(drawings, clip))
    # Label sits in lower third (matches PDF preview)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" fill="none">
<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{PINK}"/>
{glyphs}
<text x="{cx:.2f}" y="{h * 0.78:.2f}" text-anchor="middle" fill="#fff" font-family="IRANSans, IRANSansXFaNum, Tahoma, sans-serif" font-weight="700" font-size="11.5" direction="rtl">{label}</text>
</svg>
"""


def main() -> None:
    page = pymupdf.open(ROOT / "public" / "annual-report.pdf")[0]
    drawings = page.get_drawings()
    for name, rect, label in ICONS:
        clip = pymupdf.Rect(rect)
        svg = badge_svg(drawings, clip, label)
        dest = OUT / f"{name}.svg"
        dest.write_text(svg, encoding="utf-8")
        print(name, dest.stat().st_size, "bytes", "glyphs", svg.count("<path"))
        # remove oversized native dumps / previews if present
        for extra in (f"{name}-pdf-preview.png",):
            p = OUT / extra
            if p.exists():
                p.unlink()


if __name__ == "__main__":
    main()
