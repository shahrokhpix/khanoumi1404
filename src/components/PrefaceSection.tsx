import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ANNUAL_HERO } from "../content/annual-report";

export function PrefaceSection() {
  const [open, setOpen] = useState(false);
  const paragraphs = open ? ANNUAL_HERO.paragraphs : ANNUAL_HERO.paragraphs.slice(0, 1);

  return (
    <section
      id="preface"
      data-reveal
      dir="rtl"
      className="relative scroll-mt-annual overflow-hidden bg-white px-4 py-16 sm:px-10 lg:px-0 lg:py-20"
    >
      <div
        className="pointer-events-none absolute start-1/2 top-0 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink/10 blur-[100px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1342px]">
        <div className="mb-6 flex justify-center">
          <span className="font-fanum rounded-full border border-pink/20 bg-pink-mist px-4 py-1 text-[12px] font-bold text-pink">
            فصل ۰۱
          </span>
        </div>
        <h2 className="font-fanum m-0 text-center text-[clamp(22px,3vw,34px)] font-black leading-tight text-ink">
          {ANNUAL_HERO.prefaceLabel}
        </h2>
        <div
          id="preface-copy"
          className="glass-panel font-fanum mx-auto mt-8 rounded-[2rem] px-5 py-8 text-center text-[clamp(15px,1.5vw,19px)] leading-[2] text-ink/90 sm:px-10 sm:py-10"
        >
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="m-0">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="preface-copy"
            onClick={() => setOpen((value) => !value)}
            className="font-fanum inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-l from-[#ec078d] to-[#a60062] px-7 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(236,7,141,0.35)] transition-transform duration-300 hover:-translate-y-0.5 sm:min-h-13 sm:px-9 sm:text-[17px]"
          >
            {open ? "نمایش کمتر" : "خواندن بیشتر"}
            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
