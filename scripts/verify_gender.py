import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "pixel" / "annual"


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for width, height, name in ((1920, 1080, "path-gender-1920"), (645, 900, "path-gender-645")):
            page = await browser.new_page(viewport={"width": width, "height": height})
            await page.goto("http://127.0.0.1:5173/#path", wait_until="networkidle")
            canvas = page.locator("#path canvas")
            await canvas.scroll_into_view_if_needed()
            await page.wait_for_timeout(1500)
            wrap = canvas.locator("xpath=ancestor::div[contains(@class,'flex-1')][1]")
            dest = OUT / f"{name}.png"
            await wrap.screenshot(path=str(dest))
            size = await canvas.evaluate("el => ({ w: el.clientWidth, h: el.clientHeight })")
            print("saved", dest.name, size)
            await page.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
