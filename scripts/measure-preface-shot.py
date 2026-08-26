from pathlib import Path
from PIL import Image
import numpy as np

p = Path(__file__).resolve().parents[1] / "public" / "assets" / "verify" / "preface-1920.png"
im = Image.open(p).convert("L")
a = np.array(im)
ink = a < 240
print("shot", im.size)
rows = np.where(ink.any(axis=1))[0]
cols = np.where(ink.any(axis=0))[0]
print("ink y", int(rows[0]), int(rows[-1]), "h", int(rows[-1]-rows[0]+1))
print("ink x", int(cols[0]), int(cols[-1]), "w", int(cols[-1]-cols[0]+1))
print("pad top", int(rows[0]), "bottom", int(im.size[1]-1-rows[-1]))
occ = ink.any(axis=1)
runs = []
i = 0
n = len(occ)
while i < n:
    v = bool(occ[i])
    j = i
    while j < n and bool(occ[j]) == v:
        j += 1
    kind = "ink" if v else "gap"
    h = j - i
    if h >= 2:
        print(f"{kind:4} {i:4}-{j-1:4} h={h}")
    i = j
