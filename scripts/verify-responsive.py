import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "verify"
OUT.mkdir(parents=True, exist_ok=True)
URL = "http://127.0.0.1:5174/"


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for w, h, name in (
            (1920, 1100, "resp-1920.png"),
            (768, 900, "resp-768.png"),
            (375, 812, "resp-375.png"),
        ):
            page = await browser.new_page(viewport={"width": w, "height": h})
            await page.goto(URL, wait_until="networkidle")
            await page.evaluate("() => document.fonts.ready")
            await page.wait_for_timeout(300)
            await page.screenshot(path=str(OUT / name))
            overflow = await page.evaluate(
                "() => document.documentElement.scrollWidth - document.documentElement.clientWidth"
            )
            await page.locator('a[href="#preface"]').last.click()
            await page.wait_for_timeout(400)
            y = await page.evaluate("() => window.scrollY")
            print(name, "overflowX", overflow, "scrollY", round(y))
            await page.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
