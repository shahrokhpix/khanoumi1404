import { useEffect, useState } from "react";
import { AnnualLockedPage } from "./components/AnnualLockedPage";
import { WarLockedPage } from "./components/WarLockedPage";

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

function AnnualPage() {
  useEffect(() => {
    document.title = "گزارش سال ۱۴۰۴ خانومی — سال حرکت در مسیر پایداری";
    window.scrollTo(0, 0);
  }, []);

  return <AnnualLockedPage />;
}

function WarPage() {
  useEffect(() => {
    document.title = "گزارش جنگ خانومی — در ۱۴۰۴ چگونه از زندگی مراقبت کردیم؟";
    window.scrollTo(0, 0);
  }, []);

  return <WarLockedPage />;
}

export default function App() {
  const path = usePath();
  useSpaLinks();
  return path === "/war" ? <WarPage /> : <AnnualPage />;
}
