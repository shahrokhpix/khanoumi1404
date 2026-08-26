"""Build product category badge SVGs from Figma MCP asset URLs (already fetched)."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "annual" / "products"
FIGMA = Path(__file__).resolve().parents[1] / "public" / "assets" / "figma-annual" / "products"
OUT.mkdir(parents=True, exist_ok=True)
FIGMA.mkdir(parents=True, exist_ok=True)

PINK = "#EC078D"
SIZE = 70.109

# circle group origin in card: (64.139, 0)
CX0 = 64.139

# name -> (label, oval_url, glyph_url, glyph_x_card, glyph_y_card, glyph_w, glyph_h)
BADGES = {
    "electric": (
        "برقی",
        "https://www.figma.com/api/mcp/asset/b7ea2d29-f4f9-45e1-beae-c4d328da980e.svg",
        "https://www.figma.com/api/mcp/asset/2b9ec5fa-1615-4019-857f-7d360f827ad8.svg",
        92.147,
        8.916,
        14.0,
        36.0,
    ),
    "makeup": (
        "آرایشی",
        "https://www.figma.com/api/mcp/asset/7a67789a-3d6d-4730-9db5-bbd73326c7cd.svg",
        "https://www.figma.com/api/mcp/asset/bec92a6c-1b08-4327-98f6-73ad13117520.svg",
        88.073,
        9.778,
        22.0,
        33.0,
    ),
    "hygiene": (
        "بهداشتی",
        "https://www.figma.com/api/mcp/asset/47477d31-b323-48ac-a425-0ee25cead917.svg",
        "https://www.figma.com/api/mcp/asset/f2e0d3ec-dc88-40b3-9ce2-ff132b2b90da.svg",
        # glyph is already relative to circle group in Figma
        64.139 + 26.32,
        9.3,
        17.0,
        32.0,
    ),
    "health": (
        "سلامت",
        "https://www.figma.com/api/mcp/asset/17495bba-f314-4f59-86ef-01ce9c24c8d6.svg",
        "https://www.figma.com/api/mcp/asset/9a909ad6-7bdb-4192-b75f-7b6c4051f81b.svg",
        83.619,
        11.034,
        33.0,
        28.0,
    ),
    "perfume": (
        "عطر",
        "https://www.figma.com/api/mcp/asset/bf1f2e4e-656a-48a9-8129-9cc277eb9785.svg",
        "https://www.figma.com/api/mcp/asset/d42d3e5e-e7f8-42bf-9d28-4bd6bc6728b4.svg",
        88.169,
        9.051,
        30.0,
        34.0,
    ),
    "gold": (
        "طلا",
        "https://www.figma.com/api/mcp/asset/aa612e27-360e-4da0-aceb-21bc22310bb4.svg",
        "https://www.figma.com/api/mcp/asset/6875e99a-34ac-4110-a58e-20ed7f616685.svg",
        77.467,
        11.832,
        41.098,
        30.782,
    ),
}


def curl(url: str, dest: Path) -> None:
    subprocess.run(["curl", "-sL", "-o", str(dest), url], check=True)
    if dest.stat().st_size < 50:
        raise RuntimeError(f"download failed or empty: {dest} from {url}")


def strip_svg_shell(svg: str) -> str:
    """Keep inner content; drop outer <svg> wrapper."""
    svg = re.sub(r"<\?xml[^>]*\?>", "", svg)
    m = re.search(r"<svg[^>]*>(.*)</svg>\s*$", svg, re.S | re.I)
    if not m:
        return svg
    return m.group(1).strip()


def recolor(svg: str) -> str:
    return (
        svg.replace("#FF03FF", PINK)
        .replace("#ff03ff", PINK)
        .replace("rgb(255,3,255)", PINK)
        .replace("rgb(255, 3, 255)", PINK)
    )


def build_badge(name: str, label: str, oval_path: Path, glyph_path: Path, gx: float, gy: float, gw: float, gh: float) -> str:
    oval_inner = recolor(strip_svg_shell(oval_path.read_text(encoding="utf-8")))
    glyph_inner = recolor(strip_svg_shell(glyph_path.read_text(encoding="utf-8")))
    # If oval is just a tiny path, prefer solid circle
    if len(oval_inner) < 400 and "<circle" not in oval_inner and "ellipse" not in oval_inner.lower():
        oval_block = f'<circle cx="{SIZE/2:.3f}" cy="{SIZE/2:.3f}" r="{SIZE/2:.3f}" fill="{PINK}"/>'
    else:
        # scale oval to fill badge (assume viewBox ~70 or unit square)
        oval_block = f'<g>{oval_inner}</g>'
        # Many Figma ovals are already sized to the node; wrap with scale if needed
        oval_src = oval_path.read_text(encoding="utf-8")
        vb = re.search(r'viewBox="([^"]+)"', oval_src)
        if vb:
            parts = [float(x) for x in vb.group(1).split()]
            if len(parts) == 4 and parts[2] > 0:
                sx = SIZE / parts[2]
                sy = SIZE / parts[3]
                oval_block = f'<g transform="translate({-parts[0]*sx:.3f},{-parts[1]*sy:.3f}) scale({sx:.5f},{sy:.5f})">{oval_inner}</g>'

    glyph_src = glyph_path.read_text(encoding="utf-8")
    gvb = re.search(r'viewBox="([^"]+)"', glyph_src)
    gx_local = gx - CX0
    gy_local = gy
    if gvb:
        parts = [float(x) for x in gvb.group(1).split()]
        if len(parts) == 4 and parts[2] > 0:
            sx = gw / parts[2]
            sy = gh / parts[3]
            glyph_block = (
                f'<g transform="translate({gx_local - parts[0]*sx:.3f},{gy_local - parts[1]*sy:.3f}) '
                f'scale({sx:.5f},{sy:.5f})">{glyph_inner}</g>'
            )
        else:
            glyph_block = f'<g transform="translate({gx_local},{gy_local})">{glyph_inner}</g>'
    else:
        glyph_block = f'<g transform="translate({gx_local},{gy_local})">{glyph_inner}</g>'

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE:.3f} {SIZE:.3f}" fill="none">
{oval_block}
{glyph_block}
<text x="{SIZE/2:.3f}" y="54.5" text-anchor="middle" fill="#fff" font-family="IRANSans, IRANSansXFaNum, Tahoma, sans-serif" font-weight="700" font-size="11.68" direction="rtl">{label}</text>
</svg>
'''


def main() -> None:
    for name, (label, oval_url, glyph_url, gx, gy, gw, gh) in BADGES.items():
        oval_path = FIGMA / f"{name}-oval.svg"
        glyph_path = FIGMA / f"{name}-glyph.svg"
        print("download", name)
        curl(oval_url, oval_path)
        curl(glyph_url, glyph_path)
        print(" ", name, "oval", oval_path.stat().st_size, "glyph", glyph_path.stat().st_size)
        svg = build_badge(name, label, oval_path, glyph_path, gx, gy, gw, gh)
        dest = OUT / f"{name}.svg"
        dest.write_text(svg, encoding="utf-8")
        print(" ", "wrote", dest, dest.stat().st_size)


if __name__ == "__main__":
    main()
