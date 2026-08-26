"""Dump annual hero (Y 0–1044) images, words, and drawings to JSON."""
from __future__ import annotations

import json
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "public" / "annual-report.pdf"
OUT_DIR = ROOT / "public" / "assets" / "annual"
JSON_OUT = ROOT / ".tmp-hero-extract.json"

doc = pymupdf.open(PDF)
page = doc[0]

info_rows = []
for info in page.get_image_info(xrefs=True):
    bbox = info.get("bbox")
    if bbox[1] > 1100:
        continue
    info_rows.append(
        {
            "xref": info.get("xref"),
            "width": info.get("width"),
            "height": info.get("height"),
            "cs": info.get("cs-name"),
            "bbox": [round(x, 2) for x in bbox],
        }
    )

OUT_DIR.mkdir(parents=True, exist_ok=True)
seen: set[int] = set()
written = []
for i, img in enumerate(page.get_images(full=True)):
    xref = img[0]
    if xref in seen:
        continue
    seen.add(xref)
    meta = doc.extract_image(xref)
    used = any(r["xref"] == xref for r in info_rows)
    rec = {
        "i": i,
        "xref": xref,
        "w": meta["width"],
        "h": meta["height"],
        "ext": meta["ext"],
        "bytes": len(meta["image"]),
        "used_in_hero": used,
    }
    if used and i < 12:
        dest = OUT_DIR / f"hero-pdf-{i}-{meta['width']}x{meta['height']}.{meta['ext']}"
        dest.write_bytes(meta["image"])
        rec["file"] = dest.name
    written.append(rec)

words = []
for w in page.get_text("words", clip=pymupdf.Rect(0, 0, 1920, 1044)):
    words.append(
        {
            "x0": round(w[0], 2),
            "y0": round(w[1], 2),
            "x1": round(w[2], 2),
            "y1": round(w[3], 2),
            "text": w[4],
        }
    )

top_words = []
for w in page.get_text("words", clip=pymupdf.Rect(0, 0, 1920, 120)):
    top_words.append(
        {
            "x0": round(w[0], 2),
            "y0": round(w[1], 2),
            "x1": round(w[2], 2),
            "y1": round(w[3], 2),
            "text": w[4],
        }
    )

payload = {
    "images_on_hero": info_rows,
    "extracted": written,
    "words": words,
    "top_words": top_words,
}
JSON_OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"wrote {JSON_OUT} images={len(info_rows)} words={len(words)} top={len(top_words)}")
