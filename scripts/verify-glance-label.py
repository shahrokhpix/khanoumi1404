import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "verify"
URL = "http://127.0.0.1:5174/"
LABEL = "نرخ رشد تعداد کالاهای فروخته‌شده:"


async def check(page, name: str) -> None:
    await page.locator("#glance").scroll_into_view_if_needed()
    el = page.locator("#glance li p").filter(has_text=LABEL).first
    metrics = await el.evaluate(
        """el => ({
          h: Math.round(el.getBoundingClientRect().height),
          w: Math.round(el.getBoundingClientRect().width),
          wrap: getComputedStyle(el).whiteSpace,
          lines: el.getClientRects().length,
          overflow: el.scrollWidth > el.clientWidth + 1,
          fs: getComputedStyle(el).fontSize,
        })"""
    )
    print(name, metrics)
    await page.locator("#glance").screenshot(path=str(OUT / name))


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for w, h, name in (
            (375, 812, "glance-label-375.png"),
            (725, 900, "glance-label-725.png"),
            (1920, 1100, "glance-label-1920.png"),
        ):
            page = await browser.new_page(viewport={"width": w, "height": h})
            await page.goto(URL, wait_until="networkidle")
            await page.evaluate("() => document.fonts.ready")
            await check(page, name)
            await page.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
