import { useEffect, useMemo, useState } from "react";
import { AnnualLockedPage } from "./components/AnnualLockedPage";
import { Nav, type NavItem } from "./components/Nav";
import {
  ChannelSection,
  Chapter1Section,
  Chapter2Section,
  Footer,
  HeroSection,
} from "./components/Report";
import { NAV as WAR_NAV } from "./content/war-report";

function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return path.replace(/\/$/, "") || "/";
}

function useSpaLinks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.hasAttribute("download") || anchor.target === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      const next = url.pathname.replace(/\/$/, "") || "/";
      if (next !== "/" && next !== "/war") return;
      event.preventDefault();
      if ((window.location.pathname.replace(/\/$/, "") || "/") === next) return;
      window.history.pushState({}, "", next);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo(0, 0);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

function useReportNav(items: readonly NavItem[]) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const [active, setActive] = useState(ids[0] ?? "start");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setActive(ids[0] ?? "start");
    setMenuOpen(false);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      let current = ids[0] ?? "start";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  const onNavigate = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return { active, progress, menuOpen, setMenuOpen, onNavigate };
}

function AnnualPage() {
  useEffect(() => {
    document.title = "گزارش سال ۱۴۰۴ خانومی — سال حرکت در مسیر پایداری";
    window.scrollTo(0, 0);
  }, []);

  return <AnnualLockedPage />;
}

function WarPage() {
  const nav = useReportNav(WAR_NAV);
  useEffect(() => {
    document.title = "گزارش جنگ خانومی — در ۱۴۰۴ چگونه از زندگی مراقبت کردیم؟";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Nav
        brandHref="/"
        items={WAR_NAV}
        active={nav.active}
        progress={nav.progress}
        menuOpen={nav.menuOpen}
        onToggle={() => nav.setMenuOpen((open) => !open)}
        onNavigate={nav.onNavigate}
        pdfHref="/war-report.pdf"
        extra={{ href: "/", label: "گزارش سال" }}
      />
      <main>
        <HeroSection />
        <Chapter1Section />
        <ChannelSection />
        <Chapter2Section />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const path = usePath();
  useSpaLinks();
  return path === "/war" ? <WarPage /> : <AnnualPage />;
}
