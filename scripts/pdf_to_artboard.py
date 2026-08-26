"""Convert Khanoumi InDesign PDFs to HTML artboards: SVG vectors, live text, photo imgs."""

from __future__ import annotations

import html
import shutil
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
CODED = PUBLIC / "coded"
FONTS_OUT = PUBLIC / "fonts"

FONT_MAP = {
    "IRANSans": ("IRANSans", 400),
    "IRANSans-UltraLight": ("IRANSans", 200),
    "IRANSans-Light": ("IRANSans", 300),
    "IRANSans-Medium": ("IRANSans", 500),
    "IRANSans-Bold": ("IRANSans", 700),
    "IRANSansXFaNum": ("IRANSansXFaNum", 400),
    "IRANSansXFaNum-Regular": ("IRANSansXFaNum", 400),
    "IRANSansXFaNum-Bold": ("IRANSansXFaNum", 700),
    "IRANSansXFaNum-ExtraBold": ("IRANSansXFaNum", 800),
    "IRANSansXFaNum-Black": ("IRANSansXFaNum", 900),
    "IRANSansXFaNum-Medium": ("IRANSansXFaNum", 500),
}

CSS = """
@font-face{font-family:IRANSans;src:url(/fonts/IRANSans.ttf) format('truetype');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:IRANSans;src:url(/fonts/IRANSans_Light.ttf) format('truetype');font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:IRANSans;src:url(/fonts/IRANSans_UltraLight.ttf) format('truetype');font-weight:200;font-style:normal;font-display:swap}
@font-face{font-family:IRANSans;src:url(/fonts/IRANSans_Medium.ttf) format('truetype');font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:IRANSans;src:url(/fonts/IRANSans_Bold.ttf) format('truetype');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:IRANSansXFaNum;src:url(/fonts/IRANSansXFaNum-Regular.ttf) format('truetype');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:IRANSansXFaNum;src:url(/fonts/IRANSansXFaNum-Medium.ttf) format('truetype');font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:IRANSansXFaNum;src:url(/fonts/IRANSansXFaNum-Bold.ttf) format('truetype');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:IRANSansXFaNum;src:url(/fonts/IRANSansXFaNum-ExtraBold.ttf) format('truetype');font-weight:800;font-style:normal;font-display:swap}
@font-face{font-family:IRANSansXFaNum;src:url(/fonts/IRANSansXFaNum-Black.ttf) format('truetype');font-weight:900;font-style:normal;font-display:swap}
#artboard{position:relative;width:1920px;height:14400px;background:#fff;overflow:hidden;font-family:IRANSans,Tahoma,sans-serif}
#artboard svg.vectors{position:absolute;inset:0;width:1920px;height:14400px;pointer-events:none;z-index:2}
#artboard svg.vectors-back{z-index:0}
#artboard img.photo{position:absolute;max-width:none;z-index:1}
#artboard .g{position:absolute;white-space:pre;line-height:1;letter-spacing:0;transform-origin:top left;z-index:3}
"""


def rgb_tuple_to_hex(color) -> str | None:
    if not color:
        return None
    if isinstance(color, (int, float)) and not isinstance(color, tuple):
        return None
    if len(color) < 3:
        return None
    r, g, b = color[0], color[1], color[2]
    return f"#{int(round(r * 255)):02x}{int(round(g * 255)):02x}{int(round(b * 255)):02x}"


def int_color_to_hex(n: int) -> str:
    return f"#{n:06x}"


def items_to_d(items, close_path: bool) -> str:
    parts: list[str] = []
    started = False
    for it in items:
        op = it[0]
        if op == "l":
            a, b = it[1], it[2]
            if not started:
                parts.append(f"M{a.x:.2f} {a.y:.2f}")
                started = True
            parts.append(f"L{b.x:.2f} {b.y:.2f}")
        elif op == "c":
            a, c1, c2, b = it[1], it[2], it[3], it[4]
            if not started:
                parts.append(f"M{a.x:.2f} {a.y:.2f}")
                started = True
            parts.append(f"C{c1.x:.2f} {c1.y:.2f} {c2.x:.2f} {c2.y:.2f} {b.x:.2f} {b.y:.2f}")
        elif op == "re":
            r = it[1]
            parts.append(f"M{r.x0:.2f} {r.y0:.2f}H{r.x1:.2f}V{r.y1:.2f}H{r.x0:.2f}Z")
            started = True
        elif op == "qu":
            q = it[1]
            pts = [q.ul, q.ur, q.lr, q.ll]
            parts.append(f"M{pts[0].x:.2f} {pts[0].y:.2f}")
            for p in pts[1:]:
                parts.append(f"L{p.x:.2f} {p.y:.2f}")
            parts.append("Z")
            started = True
    if close_path:
        parts.append("Z")
    return " ".join(parts)


def copy_fonts() -> None:
    FONTS_OUT.mkdir(parents=True, exist_ok=True)
    src = ROOT / "گزارش_سال_خانومی" / "لندینگ گزارش سال Folder" / "Document fonts"
    names = [
        "IRANSans.ttf",
        "IRANSans_Light.ttf",
        "IRANSans_Medium.ttf",
        "IRANSans_Bold.ttf",
        "IRANSansXFaNum-Bold.ttf",
        "IRANSansXFaNum-ExtraBold.ttf",
        "IRANSansXFaNum-Black.ttf",
    ]
    for name in names:
        p = src / name
        if p.exists():
            shutil.copy2(p, FONTS_OUT / name)


def extract_images(page: pymupdf.Page, dest: Path, prefix: str) -> list[str]:
    dest.mkdir(parents=True, exist_ok=True)
    tags: list[str] = []
    seen: set[int] = set()
    for i, info in enumerate(page.get_image_info(xrefs=True)):
        xref = info.get("xref") or 0
        bbox = info["bbox"]
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
        if w < 8 or h < 8:
            continue
        if xref in seen or xref == 0:
            continue
        seen.add(xref)
        extracted = page.parent.extract_image(xref)
        if not extracted:
            continue
        raw = extracted["image"]
        ext = extracted.get("ext", "png")
        src_path = dest / f"{prefix}-{i}.{ext}"
        src_path.write_bytes(raw)
        out_name = f"{prefix}-{i}.jpg"
        out_path = dest / out_name
        try:
            im = Image.open(src_path)
            im = im.convert("RGB")
            max_side = 1920
            iw, ih = im.size
            scale = min(1.0, max_side / max(iw, ih))
            if scale < 1:
                im = im.resize((int(iw * scale), int(ih * scale)), Image.Resampling.LANCZOS)
            im.save(out_path, "JPEG", quality=85, optimize=True, progressive=True)
            if src_path != out_path:
                src_path.unlink(missing_ok=True)
            href = f"/coded/img/{out_name}"
        except Exception:
            href = f"/coded/img/{src_path.name}"
        tags.append(
            f'<img class="photo" src="{href}" alt="" '
            f'style="left:{bbox[0]:.2f}px;top:{bbox[1]:.2f}px;width:{w:.2f}px;height:{h:.2f}px"/>'
        )
    return tags


def is_photo_backdrop(rect, image_boxes: list[tuple[float, float, float, float]]) -> bool:
    fx0, fy0, fx1, fy1 = rect
    fa = max(1.0, (fx1 - fx0) * (fy1 - fy0))
    if fa < 80_000:
        return False
    for ix0, iy0, ix1, iy1 in image_boxes:
        ia = max(1.0, (ix1 - ix0) * (iy1 - iy0))
        ox0, oy0 = max(fx0, ix0), max(fy0, iy0)
        ox1, oy1 = min(fx1, ix1), min(fy1, iy1)
        if ox1 <= ox0 or oy1 <= oy0:
            continue
        inter = (ox1 - ox0) * (oy1 - oy0)
        if inter / ia > 0.45:
            return True
    return False


def path_markup(d) -> str | None:
    data = items_to_d(d.get("items") or [], bool(d.get("closePath")))
    if not data:
        return None
    fill = rgb_tuple_to_hex(d.get("fill")) if d.get("type") in ("f", "fs") else None
    stroke = rgb_tuple_to_hex(d.get("color")) if d.get("type") in ("s", "fs") else None
    attrs = [f'd="{data}"']
    attrs.append(f'fill="{fill}"' if fill else 'fill="none"')
    if d.get("even_odd"):
        attrs.append('fill-rule="evenodd"')
    fo = d.get("fill_opacity")
    if fill and fo is not None and fo < 0.999:
        attrs.append(f'fill-opacity="{fo:.3f}"')
    if stroke:
        width = d.get("width") or 1
        attrs.append(f'stroke="{stroke}" stroke-width="{width:.2f}"')
        so = d.get("stroke_opacity")
        if so is not None and so < 0.999:
            attrs.append(f'stroke-opacity="{so:.3f}"')
        attrs.append('stroke-linejoin="round" stroke-linecap="round"')
    else:
        attrs.append('stroke="none"')
    return f"<path {' '.join(attrs)}/>"


def drawings_svg(page: pymupdf.Page, image_boxes: list[tuple[float, float, float, float]]) -> str:
    back: list[str] = []
    rest: list[str] = []
    for d in page.get_drawings():
        r = d["rect"]
        markup = path_markup(d)
        if not markup:
            continue
        box = (float(r.x0), float(r.y0), float(r.x1), float(r.y1))
        if d.get("type") in ("f", "fs") and is_photo_backdrop(box, image_boxes):
            back.append(markup)
        else:
            rest.append(markup)
    return (
        '<svg class="vectors vectors-back" viewBox="0 0 1920 14400" xmlns="http://www.w3.org/2000/svg">'
        + "".join(back)
        + "</svg>",
        '<svg class="vectors" viewBox="0 0 1920 14400" xmlns="http://www.w3.org/2000/svg">'
        + "".join(rest)
        + "</svg>",
    )


def text_html(page: pymupdf.Page) -> str:
    bits: list[str] = []
    raw = page.get_text("rawdict")
    for block in raw["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                size = float(span.get("size") or 12)
                font = span.get("font") or "IRANSans"
                family, weight = FONT_MAP.get(font, ("IRANSans", 400))
                color = int_color_to_hex(int(span.get("color") or 0))
                for ch in span.get("chars") or []:
                    c = ch.get("c") or ""
                    if not c or c in "\n\r\t":
                        continue
                    x0, y0, x1, y1 = ch["bbox"]
                    w, h = x1 - x0, y1 - y0
                    if w <= 0 or h <= 0:
                        continue
                    bits.append(
                        f'<span class="g" style="left:{x0:.2f}px;top:{y0:.2f}px;width:{w:.2f}px;'
                        f"height:{h:.2f}px;font-size:{size:.2f}px;font-family:{family};"
                        f'font-weight:{weight};color:{color}">{html.escape(c)}</span>'
                    )
    return "".join(bits)


def convert(pdf_name: str, stem: str) -> None:
    pdf = PUBLIC / pdf_name
    doc = pymupdf.open(pdf)
    page = doc[0]
    CODED.mkdir(parents=True, exist_ok=True)
    imgs = extract_images(page, CODED / "img", stem)
    boxes: list[tuple[float, float, float, float]] = []
    for info in page.get_image_info():
        b = info["bbox"]
        boxes.append((float(b[0]), float(b[1]), float(b[2]), float(b[3])))
    svg_back, svg_front = drawings_svg(page, boxes)
    text = text_html(page)
    out = CODED / f"{stem}.html"
    out.write_text(
        f'<div id="artboard"><style>{CSS}</style>{svg_back}{"".join(imgs)}{svg_front}{text}</div>',
        encoding="utf-8",
    )
    print(stem, "chars", text.count("class=\"g\""), "imgs", len(imgs), "bytes", out.stat().st_size)
    doc.close()


if __name__ == "__main__":
    copy_fonts()
    convert("annual-report.pdf", "annual")
    convert("war-report.pdf", "war")
