"""Tight circular badge PNGs from clean crops + optional skimage SVG vectorize."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "annual" / "products"
LABELS = {
    "makeup": "آرایشی",
    "hygiene": "بهداشتی",
    "electric": "برقی",
    "health": "سلامت",
    "perfume": "عطر",
    "gold": "طلا",
}


def tight_badge(name: str) -> None:
    src = OUT / f"{name}-clean.png"
    if not src.exists():
        src = OUT / f"{name}.png"
    im = Image.open(src).convert("RGBA")
    s = min(im.size)
    im = im.crop(((im.width - s) // 2, (im.height - s) // 2, (im.width + s) // 2, (im.height + s) // 2))
    im = im.resize((256, 256), Image.Resampling.LANCZOS)
    arr = np.array(im)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    # find pink centroid and radius
    pink = (r > 150) & (g < 120) & (b > 70) & (r > g + 40)
    ys, xs = np.where(pink)
    if len(xs) < 50:
        print(name, "no pink")
        return
    cx, cy = float(xs.mean()), float(ys.mean())
    rad = float(np.percentile(np.sqrt((xs - cx) ** 2 + (ys - cy) ** 2), 92))
    # crop square around circle
    pad = 4
    x0, y0 = int(cx - rad - pad), int(cy - rad - pad)
    x1, y1 = int(cx + rad + pad), int(cy + rad + pad)
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(256, x1), min(256, y1)
    crop = im.crop((x0, y0, x1, y1)).resize((200, 200), Image.Resampling.LANCZOS)
    badge = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
    mask = Image.new("L", (200, 200), 0)
    ImageDraw.Draw(mask).ellipse((1, 1, 198, 198), fill=255)
    badge.paste(crop, mask=mask)
    badge.save(OUT / f"{name}.png")
    print(name, "badge png", badge.size)

    # try contour SVG of white glyph inside circle
    try:
        from skimage import measure  # type: ignore
    except ImportError:
        print(name, "skimage missing — keep hand SVG")
        return

    arr2 = np.array(badge)
    rr, gg, bb, aa = arr2[:, :, 0], arr2[:, :, 1], arr2[:, :, 2], arr2[:, :, 3]
    yy, xx = np.ogrid[:200, :200]
    disk = (xx - 100) ** 2 + (yy - 100) ** 2 <= 94**2
    white = disk & (aa > 200) & (rr > 190) & (gg > 190) & (bb > 190)
    contours = measure.find_contours(white.astype(float), 0.5)
    scale = 120 / 200
    paths: list[str] = []
    for c in contours:
        if len(c) < 10:
            continue
        pts = c[:: max(1, len(c) // 100)]
        d = "M " + " L ".join(f"{p[1] * scale:.2f} {p[0] * scale:.2f}" for p in pts) + " Z"
        paths.append(d)
    if not paths:
        print(name, "no contours")
        return
    body = "\n".join(f'<path fill="#fff" d="{d}"/>' for d in paths)
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">\n'
        '<circle cx="60" cy="60" r="60" fill="#EC078D"/>\n'
        f"{body}\n"
        "</svg>\n"
    )
    (OUT / f"{name}.svg").write_text(svg, encoding="utf-8")
    print(name, "svg paths", len(paths))


def main() -> None:
    for name in LABELS:
        tight_badge(name)


if __name__ == "__main__":
    main()
