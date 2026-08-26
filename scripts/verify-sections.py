import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "verify"
OUT.mkdir(parents=True, exist_ok=True)
URL = "http://127.0.0.1:5173/"


async def shot(page, name: str) -> None:
    await page.screenshot(path=str(OUT / name), full_page=False)


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto(URL, wait_until="networkidle")

        h1 = await page.locator("h1").inner_text()
        sections = await page.locator("section[id], #start").all()
        ids = [await el.get_attribute("id") for el in sections]
        iframe = await page.locator("iframe").count()
        coded = await page.locator('[src*="/coded/"]').count()
        print("H1:", h1)
        print("SECTION_IDS:", ids)
        print("IFRAMES:", iframe, "CODED:", coded)

        await shot(page, "annual-hero-1440.png")
        await page.locator("#preface").scroll_into_view_if_needed()
        await shot(page, "annual-preface-1440.png")
        await page.locator("#glance").scroll_into_view_if_needed()
        await shot(page, "annual-glance-1440.png")
        await page.locator("#path").scroll_into_view_if_needed()
        await shot(page, "annual-path-1440.png")
        await page.locator("#csr").scroll_into_view_if_needed()
        await shot(page, "annual-csr-1440.png")
        await page.locator("#ops").scroll_into_view_if_needed()
        await shot(page, "annual-ops-1440.png")

        await page.locator('a[href="/war"]').first.click()
        await page.wait_for_url("**/war")
        await page.wait_for_load_state("networkidle")
        war_h1 = await page.locator("h1").inner_text()
        print("WAR_H1:", war_h1)
        await shot(page, "war-hero-1440.png")

        mobile = await browser.new_page(viewport={"width": 375, "height": 812})
        await mobile.goto(URL, wait_until="networkidle")
        await shot(mobile, "annual-hero-375.png")
        await mobile.locator("#glance").scroll_into_view_if_needed()
        await shot(mobile, "annual-glance-375.png")
        await mobile.get_by_role("button", name="فهرست").click()
        await shot(mobile, "annual-menu-375.png")
        await mobile.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
