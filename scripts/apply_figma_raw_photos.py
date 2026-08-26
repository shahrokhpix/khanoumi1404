"""Replace live photos with higher-quality Figma raw dumps we already have."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "public" / "assets" / "figma-annual" / "raw"
ANNUAL = ROOT / "public" / "assets" / "annual"


def save_jpeg(im: Image.Image, dest: Path, quality: int = 88) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGB")
    rgb.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"{dest.relative_to(ROOT)} {dest.stat().st_size}")


def save_png(im: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "PNG", optimize=True)
    print(f"{dest.relative_to(ROOT)} {dest.stat().st_size}")


def crop_ink(im: Image.Image, bg=(0, 0, 0), tol: int = 18) -> Image.Image:
    """Trim near-black padding so 3D بیوتی fills the frame."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    pix = rgb.load()
    xs, ys = [], []
    for y in range(h):
        for x in range(w):
            r, g, b = pix[x, y]
            if r + g + b > tol * 3:
                xs.append(x)
                ys.append(y)
    if not xs:
        return im
    pad = 12
    x0, x1 = max(0, min(xs) - pad), min(w, max(xs) + pad + 1)
    y0, y1 = max(0, min(ys) - pad), min(h, max(ys) + pad + 1)
    return im.crop((x0, y0, x1, y1))


def main() -> None:
    # Hero mural
    mural = Image.open(RAW / "03.jpeg")
    save_jpeg(mural, ANNUAL / "wall.jpg", 90)
    save_jpeg(mural, ANNUAL / "hero-mural.jpg", 88)

    # Golden day balloon
    balloon = Image.open(RAW / "13.jpeg")
    save_jpeg(balloon, ANNUAL / "users" / "golden-photo.jpg", 88)

    # Black Beauty 3D type
    beauty = crop_ink(Image.open(RAW / "11.png"))
    save_png(beauty, ANNUAL / "users" / "black-beauty.png")
    save_png(beauty, ANNUAL / "black-beauty.png")

    # CSR business book mockup
    save_jpeg(Image.open(RAW / "02.jpeg"), ANNUAL / "csr" / "biz-book.jpg", 88)

    # IG posts (same shots, higher res from Figma)
    save_jpeg(Image.open(RAW / "06.png"), ANNUAL / "csr" / "post-1.jpg", 86)
    save_jpeg(Image.open(RAW / "12.jpeg"), ANNUAL / "csr" / "post-2.jpg", 86)
    save_jpeg(Image.open(RAW / "15.jpeg"), ANNUAL / "csr" / "post-3.jpg", 86)


if __name__ == "__main__":
    main()
