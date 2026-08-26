import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "pixel" / "annual"
URLS = ["http://127.0.0.1:5173/#csr", "http://127.0.0.1:5174/#csr"]


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
                if await page.locator("#csr h2").count():
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
            (1920, 1080, "csr-1920"),
            (1440, 900, "csr-1440"),
            (645, 900, "csr-645"),
            (375, 812, "csr-375"),
        ):
            pg = await browser.new_page(viewport={"width": width, "height": height})
            await pg.goto(url, wait_until="networkidle")
            await pg.wait_for_timeout(400)
            el = pg.locator("#csr")
            await el.scroll_into_view_if_needed()
            await pg.wait_for_timeout(400)
            title = (await pg.locator("#csr h2").inner_text()).strip()
            articles = await pg.locator("#csr article").count()
            posts = await pg.locator("#csr ul").first.locator("li").count()
            grid = await pg.locator("#csr > div").evaluate(
                """(node) => {
                  const s = getComputedStyle(node);
                  const r = node.getBoundingClientRect();
                  return {
                    cols: s.gridTemplateColumns,
                    w: Math.round(r.width),
                    h: Math.round(r.height),
                  };
                }"""
            )
            wire = await pg.locator("#csr").evaluate("(n) => n.textContent?.includes('فاز') ?? false")
            print(width, "title", title[:40], "articles", articles, "posts", posts, "grid", grid, "wire", wire)
            if articles != 2 or posts != 3 or wire:
                raise SystemExit(f"csr layout mismatch at {width}")
            dest = OUT / f"{name}.png"
            await el.screenshot(path=str(dest))
            print("saved", dest)
            await pg.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
