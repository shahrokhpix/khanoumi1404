import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "verify"
URL = "http://127.0.0.1:5174/"


async def shot(page, name: str) -> None:
    el = page.locator("#preface")
    await el.scroll_into_view_if_needed()
    await page.wait_for_timeout(120)
    text = await el.inner_text()
    print(name, "btn", "خواندن بیشتر" in text or "نمایش کمتر" in text, "full", "یازده سالگی" in text)
    await el.screenshot(path=str(OUT / name))


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1920, "height": 1100})
        await page.goto(URL, wait_until="networkidle")
        await page.evaluate("() => document.fonts.ready")

        await shot(page, "preface-more-1920.png")
        await page.locator("#preface button").click()
        await page.wait_for_timeout(200)
        await shot(page, "preface-open-1920.png")

        page2 = await browser.new_page(viewport={"width": 375, "height": 812})
        await page2.goto(URL, wait_until="networkidle")
        await page2.evaluate("() => document.fonts.ready")
        await shot(page2, "preface-more-375.png")
        await page2.locator("#preface button").click()
        await page2.wait_for_timeout(200)
        await shot(page2, "preface-open-375.png")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
