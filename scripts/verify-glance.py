import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "verify"
URL = "http://127.0.0.1:5174/"


async def shot(page, name: str) -> None:
    el = page.locator("#glance")
    await el.scroll_into_view_if_needed()
    await page.wait_for_timeout(200)
    text = await el.inner_text()
    imgs = await el.locator("img").count()
    print(name, "title", "یک نگاه" in text, "icons", imgs, "kpi", "۳۰۰+" in text)
    await el.screenshot(path=str(OUT / name))


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for w, h, name in ((1920, 1100, "glance-1920.png"), (1440, 900, "glance-1440.png"), (375, 812, "glance-375.png")):
            page = await browser.new_page(viewport={"width": w, "height": h})
            await page.goto(URL, wait_until="networkidle")
            await page.evaluate("() => document.fonts.ready")
            await shot(page, name)
            await page.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
