"""Screenshot annual hero HTML vs PDF overlay at 1920."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "verify"
OUT.mkdir(parents=True, exist_ok=True)
BASE = "http://127.0.0.1:5174"


async def shot(page, query: str, name: str) -> None:
    await page.goto(f"{BASE}/{query}", wait_until="networkidle")
    await page.evaluate("() => document.fonts.ready")
    await page.wait_for_timeout(400)
    await page.screenshot(path=str(OUT / name), clip={"x": 0, "y": 0, "width": 1920, "height": 1044})


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1920, "height": 1100})
        await shot(page, "?overlay=0&lab=0", "hero-html.png")
        await shot(page, "?overlay=1&lab=0", "hero-pdf.png")
        await shot(page, "?overlay=1&diff=1&lab=0", "hero-diff.png")
        await browser.close()
    print("wrote", OUT)


if __name__ == "__main__":
    asyncio.run(main())
