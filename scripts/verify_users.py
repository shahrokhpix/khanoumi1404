import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "pixel" / "annual"
URLS = ["http://127.0.0.1:5173/#users", "http://127.0.0.1:5174/#users"]


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
                if await page.locator("#users h2").count():
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
            (1920, 1080, "users-1920"),
            (1440, 900, "users-1440"),
            (645, 900, "users-645"),
            (375, 812, "users-375"),
        ):
            pg = await browser.new_page(viewport={"width": width, "height": height})
            await pg.goto(url, wait_until="networkidle")
            await pg.wait_for_timeout(500)
            el = pg.locator("#users")
            await el.scroll_into_view_if_needed()
            await pg.wait_for_timeout(400)
            circles = await pg.locator("#users svg circle").count()
            paths = await pg.locator("#users svg path").count()
            wire = await pg.locator("#users").evaluate("(n) => n.textContent?.includes('فاز') ?? false")
            print(width, "circles", circles, "paths", paths, "wire", wire)
            if wire or circles < 3:
                raise SystemExit(f"users charts missing at {width}")
            dest = OUT / f"{name}.png"
            await el.screenshot(path=str(dest))
            print("saved", dest)
            golden = pg.locator("#users article")
            gtxt = (await golden.inner_text()).replace("\n", " ")
            if "روز طلایی ۱۴۰۴" not in gtxt or "۱٫۵" not in gtxt or "۱۲۰" not in gtxt:
                raise SystemExit(f"golden copy missing at {width}: {gtxt[:80]}")
            gdest = OUT / f"users-golden-{width}.png"
            await golden.screenshot(path=str(gdest))
            print("saved", gdest)
            time_el = pg.locator("#users-time")
            ttxt = (await time_el.inner_text()).replace("\n", " ")
            if "توسعه زمانی بازار" not in ttxt or "دوشنبه‌ها" not in ttxt or "۱۰ اسفند" not in ttxt:
                raise SystemExit(f"time copy missing at {width}: {ttxt[:80]}")
            if "تمرکز تقاضا" in ttxt:
                raise SystemExit(f"geo leaked into time band at {width}")
            tdest = OUT / f"users-time-{width}.png"
            await time_el.screenshot(path=str(tdest))
            print("saved", tdest)
            geo_el = pg.locator("#users-geo")
            await geo_el.scroll_into_view_if_needed()
            await pg.wait_for_timeout(700)
            gtxt = (await geo_el.inner_text()).replace("\n", " ")
            if "تمرکز تقاضا" not in gtxt or "۶۰۰" not in gtxt or "سهم تهران" not in gtxt:
                raise SystemExit(f"geo copy missing at {width}: {gtxt[:80]}")
            if "محصولات" in gtxt or "در مسیر انتخاب" in gtxt:
                raise SystemExit(f"products leaked into geo band at {width}")
            if await geo_el.locator("canvas").count():
                raise SystemExit(f"geo used Chart.js canvas at {width}")
            donut_paths = await geo_el.locator("svg path").count()
            if donut_paths < 4:
                raise SystemExit(f"geo donuts missing at {width}: paths={donut_paths}")
            gdest = OUT / f"users-geo-{width}.png"
            await geo_el.screenshot(path=str(gdest))
            print("saved", gdest)
            await pg.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
