import { useEffect } from "react";
import { Artboard } from "./Artboard";
import { WarChrome } from "./WarChrome";
import { WarFooter } from "./WarFooter";
import { WarHeroLock } from "./WarHeroLock";
import { WarCh1Opener } from "./WarCh1Opener";
import { WarCrisisSection } from "./WarCrisisSection";
import { WarZeroSection } from "./WarZeroSection";
import { WarTehranSection } from "./WarTehranSection";
import { WarReturnSection } from "./WarReturnSection";
import { WarResilienceSection } from "./WarResilienceSection";
import { WarChannelSection } from "./WarChannelSection";
import { WarCh2Opener } from "./WarCh2Opener";
import { WarAnxietySection } from "./WarAnxietySection";
import { WarCareSection } from "./WarCareSection";
import { WarJoySection } from "./WarJoySection";
import { WarUkraineSection } from "./WarUkraineSection";
import { WarRuptureSection } from "./WarRuptureSection";
import { WarHoldSection } from "./WarHoldSection";
import { WarProvincesSection } from "./WarProvincesSection";
import { WarShockIntro } from "./WarShockIntro";
import { WireframeSlot } from "./WireframeSlot";
import { WAR_FRAMES } from "../data/war-section-frames";

function useChapterReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".war-spa > section[data-reveal]"));
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
          } else {
            entry.target.classList.remove("is-in");
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function WarLockedPage() {
  useChapterReveal();

  return (
    <div className="war-page war-report-only annual-page relative min-h-dvh overflow-x-hidden">
      <WarShockIntro />
      <div className="page-aurora pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
      <div className="noise-overlay pointer-events-none fixed inset-0 -z-10 opacity-[0.07]" aria-hidden="true" />

      <div className="war-report-scale">
        <WarChrome />
        <Artboard>
          <div className="war-spa annual-spa">
            {WAR_FRAMES.map((frame) => {
              if (frame.id === "start" && frame.filled) return <WarHeroLock key={frame.id} />;
              if (frame.id === "ch1" && frame.filled) return <WarCh1Opener key={frame.id} />;
              if (frame.id === "crisis" && frame.filled) return <WarCrisisSection key={frame.id} />;
              if (frame.id === "zero" && frame.filled) return <WarZeroSection key={frame.id} />;
              if (frame.id === "tehran" && frame.filled) return <WarTehranSection key={frame.id} />;
              if (frame.id === "return" && frame.filled) return <WarReturnSection key={frame.id} />;
              if (frame.id === "resilience" && frame.filled) return <WarResilienceSection key={frame.id} />;
              if (frame.id === "channel" && frame.filled) return <WarChannelSection key={frame.id} />;
              if (frame.id === "ch2" && frame.filled) return <WarCh2Opener key={frame.id} />;
              if (frame.id === "anxiety" && frame.filled) return <WarAnxietySection key={frame.id} />;
              if (frame.id === "care" && frame.filled) return <WarCareSection key={frame.id} />;
              if (frame.id === "joy" && frame.filled) return <WarJoySection key={frame.id} />;
              if (frame.id === "ukraine" && frame.filled) return <WarUkraineSection key={frame.id} />;
              if (frame.id === "rupture" && frame.filled) return <WarRuptureSection key={frame.id} />;
              if (frame.id === "hold" && frame.filled) return <WarHoldSection key={frame.id} />;
              if (frame.id === "provinces" && frame.filled) return <WarProvincesSection key={frame.id} />;
              return <WireframeSlot key={frame.id} frame={frame} />;
            })}
          </div>
        </Artboard>
        <WarFooter />
      </div>
    </div>
  );
}
