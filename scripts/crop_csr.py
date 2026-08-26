"""Crop CSR band from the annual PDF and extract the hands icon + books."""
import shutil
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "public" / "annual-report.pdf"
OUT = ROOT / "public" / "assets" / "pixel" / "annual"
CSR = ROOT / "public" / "assets" / "annual" / "csr"
OUT.mkdir(parents=True, exist_ok=True)
CSR.mkdir(parents=True, exist_ok=True)

page = pymupdf.open(PDF)[0]
clip = pymupdf.Rect(0, 3088, 1920, 3916)
pix = page.get_pixmap(matrix=pymupdf.Matrix(1, 1), clip=clip, alpha=False)
band = OUT / "csr-crop.png"
pix.save(band.as_posix())
print("saved", band, pix.width, pix.height)

print("\n--- text ---")
for w in page.get_text("dict", clip=clip)["blocks"]:
    if w.get("type") != 0:
        continue
    for line in w.get("lines", []):
        t = "".join(s["text"] for s in line["spans"])
        if t.strip():
            s0 = line["spans"][0]
            print(round(s0["size"], 1), [round(x, 1) for x in line["bbox"]], t[:100])

print("\n--- images ---")
for i, info in enumerate(page.get_images(full=True)):
    xref = info[0]
    rects = page.get_image_rects(xref)
    for r in rects:
        if r.y1 < clip.y0 or r.y0 > clip.y1:
            continue
        print(
            "img",
            i,
            "xref",
            xref,
            "xy",
            [round(r.x0, 1), round(r.y0, 1)],
            "wh",
            [round(r.width, 1), round(r.height, 1)],
        )

print("\n--- drawings (icon-sized) ---")
for d in page.get_drawings():
    r = d.get("rect")
    if r is None:
        continue
    if r.y1 < clip.y0 or r.y0 > clip.y1:
        continue
    if r.width < 8 or r.height < 8:
        continue
    if r.width > 80 and r.height > 80:
        continue
    print(
        "fill",
        d.get("fill"),
        "color",
        d.get("color"),
        "w",
        round(r.width, 1),
        "h",
        round(r.height, 1),
        "xy",
        [round(r.x0, 1), round(r.y0, 1)],
        "items",
        len(d.get("items", [])),
    )

# Hands icon as SVG (same vector as the 41.6×42.3 pink drawing)
PINK = "#EC078D"


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
            parts.append(f"M{r.x0-ox:.2f} {r.y0-oy:.2f}H{r.x1-ox:.2f}V{r.y1-oy:.2f}H{r.x0-ox:.2f}Z")
    return "".join(parts)


icon_clip = pymupdf.Rect(1124.8, 3103.0, 1166.4, 3145.3)
for d in page.get_drawings():
    r = d.get("rect")
    if r is None:
        continue
    if abs(r.x0 - 1124.8) > 1 or abs(r.y0 - 3103.0) > 1:
        continue
    d_attr = path_d(d["items"], icon_clip.x0, icon_clip.y0)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {icon_clip.width:.2f} {icon_clip.height:.2f}" fill="none">\n'
        f'<path d="{d_attr}" fill="{PINK}" fill-rule="evenodd"/>\n'
        f"</svg>\n"
    )
    dest = CSR / "hands.svg"
    dest.write_text(svg, encoding="utf-8")
    print("saved", dest, dest.stat().st_size, "bytes")
    break

png = CSR / "hands.png"
if png.exists():
    png.unlink()

# 2x crops of the two book mockups (exclude captions below)
biz_clip = pymupdf.Rect(575, 3200, 850, 3505)
life_clip = pymupdf.Rect(1005, 3228, 1395, 3510)
for name, rect in (("biz-book", biz_clip), ("life-book", life_clip)):
    crop = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=rect, alpha=False)
    tmp = CSR / f"{name}-raw.png"
    dest = CSR / f"{name}.jpg"
    crop.save(tmp.as_posix())
    img = Image.open(tmp).convert("RGB")
    img.save(dest, "JPEG", quality=82, optimize=True)
    tmp.unlink()
    print("saved", dest, img.size)

# Higher-quality packaged JPGs for Instagram posts + industry reports
ANNUAL = ROOT / "public" / "assets" / "annual"
shutil.copy2(ANNUAL / "img-3246.jpg", CSR / "post-1.jpg")
shutil.copy2(ANNUAL / "img-3276.jpg", CSR / "post-2.jpg")
shutil.copy2(ANNUAL / "img-3277.jpg", CSR / "post-3.jpg")
shutil.copy2(ROOT / "2024-report.png", CSR / "2024-report.png")
shutil.copy2(ROOT / "mckinsey.svg", CSR / "mckinsey.svg")
me = Image.open(CSR / "2024-report.png")
if me.mode == "RGBA":
    box = me.getchannel("A").getbbox()
    if box:
        pad = 4
        me.crop(
            (
                max(0, box[0] - pad),
                max(0, box[1] - pad),
                min(me.width, box[2] + pad),
                min(me.height, box[3] + pad),
            )
        ).save(CSR / "2024-report.png", "PNG", optimize=True)
print("copied posts + reports")
