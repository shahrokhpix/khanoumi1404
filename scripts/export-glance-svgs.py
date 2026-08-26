"""Export glance KPI icons as compact SVG from PDF vector drawings."""
from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "annual" / "glance"
OUT.mkdir(parents=True, exist_ok=True)

PINK = "#EC078D"

ICONS = [
    ("human-capital", pymupdf.Rect(1522, 1658, 1614, 1750)),
    ("women-mgmt", pymupdf.Rect(1317, 1658, 1409, 1750)),
    ("unique-users", pymupdf.Rect(1076, 1658, 1168, 1750)),
    ("goods-sold", pymupdf.Rect(809, 1665, 901, 1757)),
    ("product-variety", pymupdf.Rect(538, 1673, 630, 1765)),
    ("brands", pymupdf.Rect(309, 1673, 401, 1765)),
]


def rgb(c) -> str | None:
    if not c:
        return None
    return f"rgb({round(c[0]*255)},{round(c[1]*255)},{round(c[2]*255)})"


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
                f"M{a.x-ox:.2f} {a.y-oy:.2f}C{c1.x-ox:.2f} {c1.y-oy:.2f} {c2.x-ox:.2f} {c2.y-oy:.2f} {b.x-ox:.2f} {b.y-oy:.2f}"
            )
        elif kind == "re":
            r = it[1]
            parts.append(
                f"M{r.x0-ox:.2f} {r.y0-oy:.2f}H{r.x1-ox:.2f}V{r.y1-oy:.2f}H{r.x0-ox:.2f}Z"
            )
    return "".join(parts)


def to_svg(drawings, clip: pymupdf.Rect) -> str:
    ox, oy = clip.x0, clip.y0
    chunks = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {clip.width:.2f} {clip.height:.2f}" fill="none">'
    ]
    for d in drawings:
        r = d["rect"]
        if r.x1 < clip.x0 or r.x0 > clip.x1 or r.y1 < clip.y0 or r.y0 > clip.y1:
            continue
        d_attr = path_d(d["items"], ox, oy)
        if not d_attr:
            continue
        fill = rgb(d.get("fill"))
        stroke = rgb(d.get("color"))
        attrs = [f'd="{d_attr}"']
        kind = d.get("type")
        if kind == "f" or (fill and kind != "s"):
            attrs.append(f'fill="{fill or PINK}"')
            if d.get("even_odd"):
                attrs.append('fill-rule="evenodd"')
        else:
            attrs.append('fill="none"')
        if kind in {"s", "fs"} or (stroke and not fill):
            w = d.get("width") or 1.87
            attrs.append(f'stroke="{stroke or PINK}"')
            attrs.append(f'stroke-width="{w:.2f}"')
        if d.get("closePath"):
            attrs[0] = f'd="{d_attr}Z"'
        chunks.append(f"<path {' '.join(attrs)}/>")
    chunks.append("</svg>")
    return "\n".join(chunks)


page = pymupdf.open(ROOT / "public" / "annual-report.pdf")[0]
drawings = page.get_drawings()
for name, rect in ICONS:
    svg = to_svg(drawings, rect)
    dest = OUT / f"{name}.svg"
    dest.write_text(svg, encoding="utf-8")
    print(name, dest.stat().st_size, "bytes")
