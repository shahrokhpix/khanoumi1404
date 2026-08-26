import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "pixel" / "annual"
URLS = ["http://127.0.0.1:5173/#products", "http://127.0.0.1:5174/#products"]


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 720})
        last_err = None
        url = URLS[0]
        for candidate in URLS:
            try:
                await page.goto(candidate, wait_until="networkidle", timeout=8000)
                if await page.locator("#products h2").count():
                    url = candidate
                    break
            except Exception as exc:  # noqa: BLE001
                last_err = exc
        else:
            await browser.close()
            raise SystemExit(f"dev server not ready: {last_err}")
        await page.close()
        print("using", url)

        for width, height, name in (
            (1920, 1080, "products-1920"),
            (1440, 900, "products-1440"),
            (645, 900, "products-645"),
            (375, 812, "products-375"),
        ):
            pg = await browser.new_page(viewport={"width": width, "height": height})
            await pg.goto(url, wait_until="networkidle")
            await pg.wait_for_timeout(500)
            el = pg.locator("#products")
            await el.scroll_into_view_if_needed()
            await pg.wait_for_timeout(400)
            txt = (await el.inner_text()).replace("\n", " ")
            if "ترکیب انتخاب‌ها" not in txt or "مراقبتی" not in txt or "۷۷ درصد" not in txt:
                raise SystemExit(f"products mix copy missing at {width}: {txt[:100]}")
            if "سهم مراقبت پوست" in txt or "اولویت هزینه‌کردها" in txt:
                raise SystemExit(f"later products bands leaked at {width}")
            if await el.locator("canvas").count():
                raise SystemExit(f"products used Chart.js canvas at {width}")
            dest = OUT / f"{name}.png"
            await el.screenshot(path=str(dest))
            print("saved", dest)
            await pg.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
