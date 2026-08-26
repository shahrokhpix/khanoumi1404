"""Extract war-report PDF images and preview slices."""
from __future__ import annotations

import os
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)

pdf_path = ROOT / "گزارش جنگ.pdf"
doc = pymupdf.open(pdf_path)
page = doc[0]

out_img = ROOT / "public" / "assets" / "photos"
out_img.mkdir(parents=True, exist_ok=True)
slices = ROOT / "extract" / "slices"
slices.mkdir(parents=True, exist_ok=True)

seen: set[int] = set()
for i, img in enumerate(page.get_images(full=True)):
    xref = img[0]
    if xref in seen:
        continue
    seen.add(xref)
    info = doc.extract_image(xref)
    ext = info["ext"]
    w, h = info["width"], info["height"]
    dest = out_img / f"img_{i:02d}_{w}x{h}.{ext}"
    dest.write_bytes(info["image"])
    print(f"img {i}: xref={xref} {w}x{h} {ext} {len(info['image'])} bytes -> {dest.name}")

# RGB slices for layout reference (not shipped)
step = 1600
h = int(page.rect.height)
for y in range(0, h, step):
    clip = pymupdf.Rect(0, y, page.rect.width, min(y + step, h))
    pix = page.get_pixmap(matrix=pymupdf.Matrix(0.35, 0.35), clip=clip, alpha=False)
    dest = slices / f"slice_{y:05d}.jpg"
    pix.save(dest.as_posix())
    print("slice", dest.name, pix.width, pix.height)

print("done")
