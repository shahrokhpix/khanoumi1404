"""Crop annual preface band for layout reference."""
from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
page = pymupdf.open(ROOT / "public" / "annual-report.pdf")[0]
clip = pymupdf.Rect(0, 1044, 1920, 1381)
pix = page.get_pixmap(matrix=pymupdf.Matrix(1, 1), clip=clip, alpha=False)
out = ROOT / "public" / "assets" / "pixel" / "annual" / "preface-crop.png"
pix.save(out.as_posix())
print("saved", out, pix.width, pix.height)
for w in page.get_text("dict", clip=clip)["blocks"]:
    if w.get("type") != 0:
        continue
    for line in w.get("lines", []):
        t = "".join(s["text"] for s in line["spans"])
        if t.strip():
            s0 = line["spans"][0]
            print(round(s0["size"], 1), s0["font"], [round(x, 1) for x in line["bbox"]], t[:80])
