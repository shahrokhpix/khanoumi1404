import { useEffect } from "react";
import { observeRevealOnce } from "../lib/useRevealOnce";
import { Artboard } from "./Artboard";
import { AnnualChrome } from "./AnnualChrome";
import { AnnualFooter } from "./AnnualFooter";
import { AnnualHeroLock } from "./AnnualHeroLock";
import { PrefaceSection } from "./PrefaceSection";
import { GlanceSection } from "./GlanceSection";
import { PathSection } from "./PathSection";
import { CsrSection } from "./CsrSection";
import { UsersSection } from "./UsersSection";
import { ProductsSection } from "./ProductsSection";
import { PartnersSection } from "./PartnersSection";
import { OpsSection } from "./OpsSection";
import { WireframeSlot } from "./WireframeSlot";
import { ANNUAL_FRAMES } from "../data/section-frames";

function useChapterReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".annual-spa > section[data-reveal]"));
    const cleanup = observeRevealOnce(nodes, "is-in", { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

    const chapterImages = [
      "/assets/annual/chapters/csr.jpg",
      "/assets/annual/chapters/users.jpg",
      "/assets/annual/chapters/products.jpg",
      "/assets/annual/chapters/partners.jpg",
      "/assets/annual/chapters/ops.jpg",
    ];
    const prefetch = () => {
      for (const src of chapterImages) {
        const img = new Image();
        img.src = src;
      }
    };
    const idle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 1200));
    const idleId = idle(prefetch);

    return () => {
      cleanup();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId as number);
    };
  }, []);
}

export function AnnualLockedPage() {
  useChapterReveal();

  return (
    <div className="annual-page annual-report-only relative min-h-dvh overflow-x-hidden">
      <div className="page-aurora pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
      <div className="noise-overlay pointer-events-none fixed inset-0 -z-10 opacity-[0.07]" aria-hidden="true" />

      <div className="annual-report-scale">
        <AnnualChrome />
        <Artboard>
          <div className="annual-spa">
            {ANNUAL_FRAMES.map((frame) => {
              if (frame.id === "start") return <AnnualHeroLock key={frame.id} />;
              if (frame.id === "preface") return <PrefaceSection key={frame.id} />;
              if (frame.id === "glance") return <GlanceSection key={frame.id} />;
              if (frame.id === "path") return <PathSection key={frame.id} />;
              if (frame.id === "csr") return <CsrSection key={frame.id} />;
              if (frame.id === "users") return <UsersSection key={frame.id} />;
              if (frame.id === "products") return <ProductsSection key={frame.id} />;
              if (frame.id === "partners") return <PartnersSection key={frame.id} />;
              if (frame.id === "ops") return <OpsSection key={frame.id} />;
              return <WireframeSlot key={frame.id} frame={frame} />;
            })}
          </div>
        </Artboard>
        <AnnualFooter />
      </div>
    </div>
  );
}
