"""Crop glance band and inspect vector drawings for SVG export."""
from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
page = pymupdf.open(ROOT / "public" / "annual-report.pdf")[0]
clip = pymupdf.Rect(0, 1381, 1920, 1994)
pix = page.get_pixmap(matrix=pymupdf.Matrix(1, 1), clip=clip, alpha=False)
out = ROOT / "public" / "assets" / "pixel" / "annual" / "glance-crop.png"
out.parent.mkdir(parents=True, exist_ok=True)
pix.save(out.as_posix())
print("saved", out, pix.width, pix.height)

print("\n--- text ---")
for w in page.get_text("dict", clip=clip)["blocks"]:
    if w.get("type") != 0:
        continue
    for line in w.get("lines", []):
        t = "".join(s["text"] for s in line["spans"])
        if t.strip():
            s0 = line["spans"][0]
            print(round(s0["size"], 1), [round(x, 1) for x in line["bbox"]], t[:90])

print("\n--- drawings ---")
ds = page.get_drawings()
in_clip = []
for d in ds:
    r = d.get("rect")
    if r is None:
        continue
    if r.y1 < clip.y0 or r.y0 > clip.y1:
        continue
    in_clip.append(d)
print("count", len(in_clip))
for d in in_clip:
    r = d["rect"]
    if r.width < 8 or r.height < 8:
        continue
    print(
        "fill", d.get("fill"),
        "color", d.get("color"),
        "w", round(r.width, 1),
        "h", round(r.height, 1),
        "xy", [round(r.x0, 1), round(r.y0, 1)],
        "items", len(d.get("items", [])),
    )
