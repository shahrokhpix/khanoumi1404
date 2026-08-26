import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "pixel" / "annual"
URLS = ["http://127.0.0.1:5173/#path", "http://127.0.0.1:5174/#path"]


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        url = URLS[0]
        page = await browser.new_page(viewport={"width": 1280, "height": 720})
        last_err = None
        for candidate in URLS:
            try:
                await page.goto(candidate, wait_until="networkidle", timeout=8000)
                if await page.locator("#path h2").count():
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
            (1920, 1080, "path-1920"),
            (1440, 900, "path-1440"),
            (645, 900, "path-645"),
            (375, 812, "path-375"),
        ):
            pg = await browser.new_page(viewport={"width": width, "height": height})
            await pg.goto(url, wait_until="networkidle")
            await pg.wait_for_timeout(400)
            ol = pg.locator("#path ol")
            el = pg.locator("#path")
            await ol.scroll_into_view_if_needed()
            await pg.wait_for_timeout(1100)
            box = await ol.evaluate(
                """(node) => {
                  const s = getComputedStyle(node);
                  const r = node.getBoundingClientRect();
                  return { flex: s.flexDirection, w: Math.round(r.width), h: Math.round(r.height) };
                }"""
            )
            print(width, "ol", box)
            dest = OUT / f"{name}.png"
            await el.screenshot(path=str(dest))
            print("saved", dest)
            if width == 1920:
                await pg.locator("#path button").first.hover()
                await pg.wait_for_timeout(250)
                hover = OUT / "path-1920-hover.png"
                await el.screenshot(path=str(hover))
                print("saved", hover)
            await pg.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
