"""Copy root SVG/PNG materials into public/assets with stable ASCII names + brand recolor."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "assets"

# Magenta variants → brand
RECOLOR = (
    (re.compile(r"#FF03FF", re.I), "#EC078D"),
    (re.compile(r"#ff03ff"), "#EC078D"),
    (re.compile(r"rgb\(\s*255\s*,\s*3\s*,\s*255\s*\)", re.I), "#EC078D"),
)

COPIES: list[tuple[str, str]] = [
    # Logo
    ("Khanoumi-logo.svg", "khanoumi-logo.svg"),
    # Glance
    ("hr-resources.svg", "annual/glance/hr-resources.svg"),
    ("females-managers.svg", "annual/glance/females-managers.svg"),
    ("uniqe-employees.svg", "annual/glance/uniqe-employees.svg"),
    ("increased-sales.svg", "annual/glance/increased-sales.svg"),
    ("product-variations.svg", "annual/glance/product-variations.svg"),
    ("brands.svg", "annual/glance/brands.svg"),
    ("brand.svg", "annual/glance/brand.svg"),
    # Path
    ("arrow.svg", "annual/path/arrow.svg"),
    ("circle.svg", "annual/path/circle.svg"),
    ("basket.svg", "annual/path/basket.svg"),
    ("bascket.svg", "annual/path/basket-alt.svg"),
    ("loyal.svg", "annual/path/loyal.svg"),
    ("money.svg", "annual/path/money.svg"),
    ("chart.svg", "annual/path/chart.svg"),
    ("inway.svg", "annual/path/inway.svg"),
    ("female.svg", "annual/path/female.svg"),
    # CSR / reports
    ("mckinsey.svg", "annual/csr/mckinsey.svg"),
    ("2024-report.png", "annual/csr/2024-report.png"),
    ("report.svg", "annual/csr/report-vector.svg"),
    # Users
    ("calander.svg", "annual/users/calendar.svg"),
    ("woman.svg", "annual/users/woman.svg"),
    ("Newspaper-Mockup-copy.png", "annual/users/newspaper-mockup.png"),
    ("location.svg", "annual/users/location.svg"),
    ("costumer.svg", "annual/users/customer.svg"),
    ("goneh.svg", "annual/users/goneh.svg"),
    # Product category marks (Illustrator white marks for pink discs)
    ("arayeshi.svg", "annual/products/marks/makeup.svg"),
    ("arayeshiiiii.svg", "annual/products/marks/makeup-alt.svg"),
    ("cosmetics.svg", "annual/products/marks/cosmetics.svg"),
    ("behdashti.svg", "annual/products/marks/hygiene.svg"),
    ("barghii.svg", "annual/products/marks/electric.svg"),
    ("braghi.svg", "annual/products/marks/electric-alt.svg"),
    ("salamat.svg", "annual/products/marks/health.svg"),
    ("salamatiiiiiii.svg", "annual/products/marks/health-alt.svg"),
    ("perfume.svg", "annual/products/marks/perfume.svg"),
    ("atrrrr.svg", "annual/products/marks/perfume-alt.svg"),
    ("gold.svg", "annual/products/marks/gold.svg"),
    ("gollld.svg", "annual/products/marks/gold-alt.svg"),
    ("behdasht va salamt.svg", "annual/products/marks/care-combo.svg"),
    ("moraghebat.svg", "annual/products/marks/care.svg"),
    ("moraghebati.svg", "annual/products/marks/care-alt.svg"),
    # Spend / skin priorities
    ("mohafezat.svg", "annual/products/spend/protect.svg"),
    ("moraghebat.svg", "annual/products/spend/care.svg"),
    ("taghviat.svg", "annual/products/spend/boost.svg"),
    ("tarmim.svg", "annual/products/spend/repair.svg"),
    ("sun skin.svg", "annual/products/spend/sunscreen.svg"),
    ("arayeshi.svg", "annual/products/spend/makeup.svg"),
    # Makeup ranks
    ("rimel.svg", "annual/products/makeup-icons/mascara.svg"),
    ("riiimel.svg", "annual/products/makeup-icons/mascara-alt.svg"),
    ("rouge.svg", "annual/products/makeup-icons/lipstick.svg"),
    ("rouge lab.svg", "annual/products/makeup-icons/lipstick-lab.svg"),
    ("khat cheshm.svg", "annual/products/makeup-icons/eyeliner.svg"),
    ("kerem podr.svg", "annual/products/makeup-icons/foundation.svg"),
    ("foundation.svg", "annual/products/makeup-icons/foundation-alt.svg"),
    ("eye brows.svg", "annual/products/makeup-icons/brows.svg"),
    ("tint.svg", "annual/products/makeup-icons/tint.svg"),
    # Misc / partners
    ("adv.svg", "annual/partners/adv.svg"),
    ("bazgasht.svg", "annual/partners/roi.svg"),
    ("wallet.svg", "annual/products/pay/wallet.svg"),
    ("kif.svg", "annual/products/pay/bag.svg"),
    ("mahsol.svg", "annual/products/misc/product.svg"),
    ("ganje.svg", "annual/products/misc/ganje.svg"),
    ("abro.svg", "annual/products/misc/abro.svg"),
    ("markaz pardazesh.svg", "annual/misc/processing-center.svg"),
]


def recolor_bytes(data: bytes) -> bytes:
    if not data.lstrip().startswith((b"<", b"\xef\xbb\xbf<")):
        return data
    text = data.decode("utf-8", errors="ignore")
    for pat, repl in RECOLOR:
        text = pat.sub(repl, text)
    return text.encode("utf-8")


def main() -> None:
    done = 0
    missing: list[str] = []
    for src_name, dest_rel in COPIES:
        src = ROOT / src_name
        if not src.exists():
            missing.append(src_name)
            continue
        dest = PUBLIC / dest_rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        raw = src.read_bytes()
        if src.suffix.lower() == ".svg":
            dest.write_bytes(recolor_bytes(raw))
        else:
            shutil.copy2(src, dest)
        done += 1
        print(f"OK  {src_name} → {dest_rel}")

    print(f"\nCopied {done}/{len(COPIES)}")
    if missing:
        print("Missing:")
        for m in missing:
            print(f"  - {m}")


if __name__ == "__main__":
    main()
