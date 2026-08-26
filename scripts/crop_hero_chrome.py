"""Crop annual hero chrome: header strip and icon bar."""
from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "public" / "annual-report.pdf"
OUT = ROOT / "public" / "assets" / "annual"
OUT.mkdir(parents=True, exist_ok=True)

page = pymupdf.open(PDF)[0]
# 2x for overlay sharpness
mat = pymupdf.Matrix(2, 2)

header = page.get_pixmap(matrix=mat, clip=pymupdf.Rect(0, 0, 1920, 103), alpha=False)
header.save((OUT / "hero-header.png").as_posix())

icons = page.get_pixmap(matrix=mat, clip=pymupdf.Rect(0, 944, 1920, 1044), alpha=False)
icons.save((OUT / "hero-icons.png").as_posix())

# 1x mural already extracted; copy-friendly jpeg at exact box
mural = page.get_pixmap(matrix=pymupdf.Matrix(1, 1), clip=pymupdf.Rect(0, 101.78, 1920, 945.28), alpha=False)
mural.save((OUT / "hero-mural.jpg").as_posix())

print("header", header.width, header.height)
print("icons", icons.width, icons.height)
print("mural", mural.width, mural.height)
