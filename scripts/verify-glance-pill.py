import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "verify"
URL = "http://127.0.0.1:5174/"


async def check(page, name: str) -> None:
    el = page.locator("#glance p").first
    await el.scroll_into_view_if_needed()
    box = await el.bounding_box()
    metrics = await el.evaluate(
        """el => ({
          h: el.getBoundingClientRect().height,
          w: el.getBoundingClientRect().width,
          wrap: getComputedStyle(el).whiteSpace,
          lines: el.getClientRects().length,
        })"""
    )
    print(name, metrics)
    await page.locator("#glance").screenshot(path=str(OUT / name))


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for w, h, name in (
            (375, 812, "glance-pill-375.png"),
            (725, 900, "glance-pill-725.png"),
            (1440, 900, "glance-pill-1440.png"),
            (1920, 1100, "glance-pill-1920.png"),
        ):
            page = await browser.new_page(viewport={"width": w, "height": h})
            await page.goto(URL, wait_until="networkidle")
            await page.evaluate("() => document.fonts.ready")
            await check(page, name)
            await page.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
