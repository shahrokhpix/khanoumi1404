import { useState } from "react";
import { faBookOpen, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HERO } from "../content/war-report";
import { appPath } from "../lib/paths";

const PARAS = [HERO.p1, HERO.p2, HERO.p3, HERO.p4, HERO.p5, HERO.p6] as const;

export function WarHeroLock() {
  const [open, setOpen] = useState(false);
  const visible = open ? PARAS : PARAS.slice(0, 1);

  return (
    <section id="start" data-reveal className="relative overflow-hidden">
      <div className="relative isolate flex min-h-[min(100dvh,920px)] flex-col justify-end overflow-hidden">
        <img
          src="/assets/photos/img_01_3000x1305.jpeg"
          alt="تخلیه پس از حمله در تهران؛ زنی قالیچه بر سر دارد و ساختمانی ویران در پس‌زمینه دیده می‌شود"
          width={3000}
          height={1305}
          className="absolute inset-0 -z-30 size-full object-cover object-[center_35%]"
        />
        <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-t from-[#050104] via-[#0a0208]/88 to-[#12030c]/40" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-l from-[#0a0208]/75 via-[#050104]/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 -z-[8] bg-black/35" aria-hidden="true" />
        <div className="noise-overlay pointer-events-none absolute inset-0 -z-[5] opacity-[0.18]" aria-hidden="true" />

        <div
          dir="rtl"
          className="hero-entrance relative z-10 mx-auto w-full max-w-[1100px] px-4 pb-10 pt-[5.5rem] text-right sm:px-10 sm:pb-14 sm:pt-[6rem] lg:px-[100px] lg:pb-16"
        >
          <p className="font-fanum m-0 text-[clamp(12px,1.6vw,16px)] font-bold leading-7 text-[#ff9ad4]">
            {HERO.kicker}
          </p>
          <h1
            className="font-fanum hero-title-glow m-0 mt-3 overflow-visible font-black leading-[1.35] text-white"
            style={{ fontSize: "clamp(1.55rem, 3.8vw, 3.35rem)" }}
          >
            <span className="block overflow-visible bg-gradient-to-l from-white via-[#ffe4f2] to-[#ff9ad4] bg-clip-text py-1 text-transparent">
              {HERO.title}
            </span>
          </h1>
          <p className="font-fanum m-0 mt-5 max-w-[46ch] text-[clamp(14px,1.8vw,18px)] font-bold leading-8 text-white/90">
            {HERO.dedication}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#ch1"
              className="font-fanum group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 text-base font-black text-white no-underline sm:min-h-14 sm:px-10 sm:text-xl"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-[#ff4fb8] via-[#ec078d] to-[#7a0048]" />
              <span className="absolute inset-[1.5px] rounded-[inherit] bg-gradient-to-br from-white/25 via-transparent to-black/20" />
              <span className="relative z-10">شروع مطالعه</span>
              <span
                aria-hidden="true"
                className="relative z-10 inline-flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:size-9"
              >
                <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
              </span>
            </a>
            <a
              href={appPath("/")}
              className="font-fanum inline-flex min-h-12 items-center rounded-full border border-white/35 bg-white/10 px-5 text-sm font-bold text-white no-underline backdrop-blur-md transition-colors hover:bg-white/20 sm:min-h-14 sm:px-6"
            >
              گزارش سال ۱۴۰۴
            </a>
          </div>
        </div>
      </div>

      <div dir="rtl" className="relative bg-white px-4 py-10 sm:px-10 sm:py-12 lg:px-[100px] lg:py-14">
        <div className="mx-auto max-w-[920px]">
          <div
            id="war-hero-copy"
            className="font-fanum space-y-5 text-center text-[clamp(15px,1.7vw,19px)] leading-[1.85] text-black"
          >
            {visible.map((p) => (
              <p key={p.slice(0, 24)} className="m-0">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="war-hero-copy"
              onClick={() => setOpen((value) => !value)}
              className="font-fanum inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-l from-[#ec078d] to-[#a60062] px-7 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(236,7,141,0.35)] transition-transform duration-300 hover:-translate-y-0.5 sm:min-h-13 sm:px-9 sm:text-[17px]"
            >
              {open ? "نمایش کمتر" : "خواندن بیشتر"}
              <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
