import { useEffect, useMemo, useState } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { appPath } from "../lib/paths";
import {
  faBookOpen,
  faCity,
  faDownload,
  faFaceSmile,
  faHandHoldingHeart,
  faHeartPulse,
  faHouse,
  faLink,
  faMapLocationDot,
  faPhoneSlash,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NAV as WAR_NAV } from "../content/war-report";
import { WAR_FRAMES } from "../data/war-section-frames";

const NAV_ICONS: Record<string, IconDefinition> = {
  start: faHouse,
  crisis: faPhoneSlash,
  tehran: faCity,
  resilience: faShieldHalved,
  channel: faLink,
  anxiety: faHeartPulse,
  care: faHandHoldingHeart,
  joy: faFaceSmile,
  hold: faBookOpen,
  provinces: faMapLocationDot,
};

const filledIds = new Set(WAR_FRAMES.filter((f) => f.filled).map((f) => f.id));

export function WarChrome() {
  const ids = useMemo(() => WAR_NAV.map((item) => item.id), []);
  const [active, setActive] = useState(ids[0] ?? "start");
  const [progress, setProgress] = useState(0);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      setElevated(window.scrollY > 24);
      let current = ids[0] ?? "start";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const glass = elevated
    ? "border-white/55 bg-white/80 shadow-[0_16px_50px_rgba(236,7,141,0.16),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl"
    : "border-white/40 bg-white/70 shadow-[0_10px_36px_rgba(26,6,18,0.12),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl";

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-black/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="پیشرفت مطالعه گزارش جنگ"
      >
        <div
          className="h-full bg-gradient-to-l from-[#ff6bcb] via-[#ec078d] to-[#a60062] shadow-[0_0_16px_rgba(236,7,141,0.75)] transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header
        dir="rtl"
        className="pointer-events-none absolute inset-x-0 top-0 z-50 px-3 pt-[max(0.65rem,env(safe-area-inset-top))] sm:px-6 lg:px-10"
      >
        <div
          className={`pointer-events-auto mx-auto flex max-w-[1480px] items-center justify-between gap-3 rounded-[1.5rem] border px-3 py-2 transition-all duration-500 sm:px-4 sm:py-2.5 ${glass}`}
        >
          <a href="#start" className="inline-flex shrink-0 items-center" aria-label="خانومی — آغاز گزارش جنگ">
            <img
              src="/assets/khanoumi-logo.svg"
              alt="خانومی"
              width={123}
              height={52}
              className="h-7 w-auto drop-shadow-sm sm:h-8 lg:h-9"
            />
          </a>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <a
              href={appPath("/")}
              className="font-fanum hidden rounded-full border border-pink/25 bg-white/60 px-3 py-2 text-[11px] font-bold text-pink no-underline backdrop-blur-md transition-all duration-300 hover:bg-pink hover:text-white sm:inline-flex"
            >
              گزارش سال
            </a>
            <a
              href={appPath("/war-report.pdf")}
              download
              className="font-fanum inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-[#ec078d] to-[#a60062] px-3 py-2 text-[11px] font-bold text-white no-underline shadow-[0_8px_20px_rgba(236,7,141,0.35)] transition-transform duration-300 hover:-translate-y-0.5 sm:px-3.5 sm:text-[12px]"
            >
              <FontAwesomeIcon icon={faDownload} className="text-[10px]" />
              PDF
            </a>
          </div>
        </div>
      </header>

      <nav
        dir="rtl"
        aria-label="فصول گزارش جنگ"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 lg:px-10"
      >
        <div
          className={`pointer-events-auto mx-auto flex max-w-[1480px] items-center overflow-hidden rounded-[1.75rem] border px-2 py-2 transition-all duration-500 sm:px-3 sm:py-2.5 ${
            elevated
              ? "border-white/55 bg-white/80 shadow-[0_-16px_50px_rgba(236,7,141,0.18),0_12px_40px_rgba(26,6,18,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl"
              : "border-white/40 bg-white/70 shadow-[0_-10px_36px_rgba(26,6,18,0.12),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl"
          }`}
        >
          <div className="grid w-full grid-cols-10 items-center gap-0.5 sm:gap-1">
            {WAR_NAV.map((item) => {
              const isActive = active === item.id;
              const isFilled = filledIds.has(item.id);
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? "true" : undefined}
                  className={`font-fanum inline-flex aspect-square w-full min-w-0 items-center justify-center gap-1 rounded-xl no-underline transition-all duration-300 sm:rounded-2xl xl:aspect-auto xl:h-10 xl:rounded-full xl:px-1.5 ${
                    isActive
                      ? "bg-gradient-to-br from-[#ff4fb8] to-[#a60062] text-white shadow-[0_8px_20px_rgba(236,7,141,0.45)]"
                      : isFilled
                        ? "bg-white/75 text-pink hover:bg-pink-mist"
                        : "bg-white/40 text-muted/55"
                  }`}
                >
                  <FontAwesomeIcon icon={NAV_ICONS[item.id] ?? faHouse} className="text-[10px] sm:text-sm" />
                  <span className="hidden text-[10px] font-bold 2xl:inline">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
