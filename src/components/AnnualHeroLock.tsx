import { useEffect, useRef } from "react";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appPath } from "../lib/paths";

const TITLE = "گزارش سال ۱۴۰۴ خانومی";
const SUBTITLE = "سال حرکت در مسیر پایداری";
const WAR = "همراه با گزارش ویژه «۲ جنگ و یک اینترنت خاموش»";
const CTA = "شروع مطالعه";

export function AnnualHeroLock() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bg = stage.querySelector<HTMLElement>("[data-parallax-bg]");
    const glow = stage.querySelector<HTMLElement>("[data-parallax-glow]");
    if (!bg) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        const view = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
        bg.style.transform = `scale(${1.08 + view * 0.06}) translate3d(0, ${view * 4}%, 0)`;
        if (glow) glow.style.transform = `translate3d(0, ${view * -8}%, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="start" className="relative overflow-hidden">
      <div
        ref={stageRef}
        className="relative isolate flex min-h-[100dvh] flex-col justify-between overflow-hidden px-4 pb-10 pt-[4.75rem] sm:px-10 sm:pb-14 sm:pt-[5.25rem] lg:min-h-[min(100dvh,920px)] lg:px-[100px] lg:pb-16 lg:pt-24"
      >
        <img
          data-parallax-bg
          src="/assets/annual/wall.jpg"
          alt=""
          width={1920}
          height={844}
          className="absolute inset-0 -z-30 size-full origin-center object-cover object-[center_30%] will-change-transform"
          style={{ transform: "scale(1.08)" }}
        />

        <div className="hero-mesh pointer-events-none absolute inset-0 -z-20" aria-hidden="true" />
        <div
          data-parallax-glow
          className="pointer-events-none absolute -start-24 top-10 -z-10 size-[28rem] rounded-full bg-pink/35 blur-[110px] will-change-transform sm:size-[36rem]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -end-16 bottom-0 -z-10 size-[22rem] rounded-full bg-[#ff6bcb]/25 blur-[100px] sm:size-[30rem]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-l from-[#1a0612]/55 via-[#1a0612]/15 to-transparent mix-blend-multiply" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#12030c]/50 via-transparent to-[#fff]/10" aria-hidden="true" />
        <div className="noise-overlay pointer-events-none absolute inset-0 -z-[5] opacity-[0.18]" aria-hidden="true" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div dir="rtl" className="hero-entrance relative max-w-[820px] text-right">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <span className="size-2 animate-pulse rounded-full bg-[#ff4fb8] shadow-[0_0_12px_#ec078d]" />
              <span className="font-fanum text-[12px] font-bold tracking-wide text-white sm:text-[13px]">
                خانومی · گزارش سالانه ۱۴۰۴
              </span>
            </div>
            <h1
              className="font-fanum hero-title-glow m-0 overflow-visible font-black leading-[1.35] text-white"
              style={{ fontSize: "clamp(1.55rem, 3.8vw, 3.35rem)" }}
            >
              <span className="block overflow-visible bg-gradient-to-l from-white via-[#ffe4f2] to-[#ff9ad4] bg-clip-text py-1 text-transparent">
                {TITLE}
              </span>
            </h1>
            <p
              className="font-fanum m-0 mt-4 max-w-[34ch] font-bold leading-snug text-white/90 sm:mt-5"
              style={{ fontSize: "clamp(1.2rem, 2.6vw, 2.55rem)" }}
            >
              {SUBTITLE}
            </p>
            <p className="font-fanum mt-5 hidden max-w-xl text-[15px] leading-8 text-white/75 sm:block sm:text-[16px]">
              روایتی تصویری از پایداری، انتخاب، و حرکت خانومی در سالی که همه‌چیز به توقف فرا می‌خواند.
            </p>
          </div>

          <a
            href={appPath("/war")}
            dir="rtl"
            className="glass-cta font-fanum group relative inline-flex max-w-full items-center justify-center overflow-hidden rounded-full px-6 py-4 text-center text-sm font-bold leading-snug text-white no-underline sm:px-8 sm:py-5 sm:text-xl lg:max-w-[42rem] lg:text-[24px]"
          >
            <span className="absolute inset-0 bg-gradient-to-l from-[#ec078d] via-[#da1984] to-[#a60062] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="cta-sheen absolute inset-y-0 -start-1/3 w-1/3 bg-gradient-to-l from-transparent via-white/35 to-transparent" />
            </span>
            <span className="relative z-10">{WAR}</span>
          </a>
        </div>

        <div className="relative z-10 flex flex-col items-end gap-6 self-end">
          <a
            href="#preface"
            dir="rtl"
            className="font-fanum group relative inline-flex min-h-11 w-fit max-w-full items-center justify-center gap-2 overflow-hidden rounded-[1.35rem] px-7 text-base font-black text-white no-underline sm:min-h-[3.25rem] sm:rounded-[1.65rem] sm:px-9 sm:text-xl lg:min-h-14 lg:px-11 lg:text-2xl"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-[#ff4fb8] via-[#ec078d] to-[#7a0048]" />
            <span className="absolute inset-[1.5px] rounded-[inherit] bg-gradient-to-br from-white/25 via-transparent to-black/20" />
            <span className="absolute -inset-4 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_45%)] opacity-70 sm:-inset-5" />
            <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">{CTA}</span>
            <span
              aria-hidden="true"
              className="relative z-10 inline-flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0.5 sm:size-8"
            >
              <FontAwesomeIcon icon={faBookOpen} className="text-xs sm:text-sm" />
            </span>
          </a>

          <div className="scroll-cue font-fanum flex items-center gap-2 text-[12px] font-bold text-white/70">
            <span className="scroll-cue-line" aria-hidden="true" />
            اسکرول برای ورود به روایت
          </div>
        </div>
      </div>
    </section>
  );
}
