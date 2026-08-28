import { useEffect, useState } from "react";
import { AnnualLockedPage } from "./components/AnnualLockedPage";
import { WarLockedPage } from "./components/WarLockedPage";
import { useReportSeo } from "./seo/useReportSeo";
import type { ReportRoute } from "./seo/reports";

function usePath(): ReportRoute {
  const [path, setPath] = useState<ReportRoute>(() => {
    const normalized = window.location.pathname.replace(/\/$/, "") || "/";
    return normalized === "/war" ? "/war" : "/";
  });
  useEffect(() => {
    const onPop = () => {
      const normalized = window.location.pathname.replace(/\/$/, "") || "/";
      setPath(normalized === "/war" ? "/war" : "/");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return path;
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

export default function App() {
  const path = usePath();
  useSpaLinks();
  useReportSeo(path);

  return path === "/war" ? <WarLockedPage /> : <AnnualLockedPage />;
}
