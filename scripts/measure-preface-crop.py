"""Measure preface crop: ink bbox and row gaps."""
from pathlib import Path
from PIL import Image
import numpy as np

p = Path(__file__).resolve().parents[1] / "public" / "assets" / "pixel" / "annual" / "preface-crop.png"
im = Image.open(p).convert("L")
a = np.array(im)
ink = a < 240
rows = np.where(ink.any(axis=1))[0]
cols = np.where(ink.any(axis=0))[0]
print("crop", im.size)
print("ink y", int(rows[0]), int(rows[-1]), "h", int(rows[-1] - rows[0] + 1))
print("ink x", int(cols[0]), int(cols[-1]), "w", int(cols[-1] - cols[0] + 1))
print("pad top", int(rows[0]), "bottom", int(im.size[1] - 1 - rows[-1]))
print("pad left", int(cols[0]), "right", int(im.size[0] - 1 - cols[-1]))

# row occupancy runs
occ = ink.any(axis=1)
runs = []
i = 0
n = len(occ)
while i < n:
    if occ[i]:
        j = i
        while j < n and occ[j]:
            j += 1
        runs.append(("ink", i, j - 1, j - i))
        i = j
    else:
        j = i
        while j < n and not occ[j]:
            j += 1
        runs.append(("gap", i, j - 1, j - i))
        i = j
for kind, a0, a1, h in runs:
    if h >= 2:
        print(f"{kind:4} {a0:4}-{a1:4} h={h}")
