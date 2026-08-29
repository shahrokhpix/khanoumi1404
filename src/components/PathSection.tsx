import { Fragment, useEffect, useRef, useState } from "react";
import { PATH } from "../content/annual-report";
import { PathGenderChart } from "./PathGenderChart";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
        } else {
          setOn(false);
        }
      },
      { threshold: 0, rootMargin: "80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, on };
}

function CountValue({ to, active, plus }: { to: number; active: boolean; plus?: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - t) ** 3;
      setN(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to]);

  return (
    <>
      {Math.round(n).toLocaleString("fa-IR")}
      {plus ? "+" : ""}٪
    </>
  );
}

function YearCircle({ year, label, delay }: { year: string; label: string; delay: string }) {
  return (
    <li
      className="path-year-node flex w-[4.6rem] min-w-0 flex-col items-center text-center sm:w-[7rem] lg:w-[9.5rem]"
      style={{ animationDelay: delay }}
    >
      <button
        type="button"
        className="group relative size-[48px] shrink-0 transition-transform duration-200 hover:scale-110 focus-visible:scale-110 sm:size-[64px] lg:size-[83px]"
        aria-label={`${year}، ${label}`}
      >
        <svg viewBox="0 0 83 83" className="size-full" aria-hidden="true">
          <circle cx="41.4075" cy="41.4075" r="37.9925" className="fill-pink" />
          <circle
            cx="41.4075"
            cy="41.4076"
            r="40.8273"
            fill="none"
            stroke="#EC078D"
            strokeWidth="1.16043"
            className="transition-all duration-200 group-hover:stroke-[2.2] group-focus-visible:stroke-[2.2]"
          />
          <circle
            cx="41.4075"
            cy="41.4076"
            r="33.3874"
            className="fill-white transition-colors duration-200 group-hover:fill-pink group-focus-visible:fill-pink"
          />
        </svg>
        <span className="font-fanum pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-bold text-pink transition-colors duration-200 group-hover:text-white group-focus-visible:text-white sm:text-[13px] lg:text-[15px]">
          {year}
        </span>
      </button>
      <p className="font-fanum m-0 mt-1.5 text-[11px] font-bold leading-[18px] text-pink sm:mt-2 sm:text-[13px] sm:leading-[22px] lg:text-[15px] lg:leading-[24px]">
        {label}
      </p>
    </li>
  );
}

function YearArrow({ delay }: { delay: string }) {
  return (
    <li
      aria-hidden="true"
      className="path-year-arrow flex h-[48px] shrink-0 items-center px-0.5 sm:h-[64px] sm:px-1 lg:h-[83px] lg:px-3"
      style={{ animationDelay: delay }}
    >
      <span className="path-arrow-drift inline-flex">
        <img
          src="/assets/annual/path/arrow.svg"
          alt=""
          width={88}
          height={33}
          className="h-auto w-[28px] -scale-x-100 sm:w-[52px] lg:w-[88px]"
        />
      </span>
    </li>
  );
}

export function PathSection() {
  const years = useInView<HTMLOListElement>();
  const metrics = useInView<HTMLUListElement>();
  const gender = useInView<HTMLDivElement>();

  return (
    <section
      id="path"
      data-reveal
      dir="rtl"
      className="relative scroll-mt-annual overflow-hidden bg-white px-4 py-16 sm:px-10 lg:px-[80px] lg:py-20"
    >
      <div
        className="pointer-events-none absolute -start-16 top-24 size-[20rem] rounded-full bg-pink/10 blur-[90px]"
        aria-hidden="true"
      />
      <h2 className="font-fanum mx-auto m-0 w-fit max-w-full rounded-[28px] bg-gradient-to-l from-[#ec078d] to-[#a60062] px-[clamp(16px,4vw,40px)] py-[clamp(10px,1.5vw,18px)] text-center text-[clamp(13px,2.1vw,19px)] font-bold leading-[1.7] text-white shadow-[0_14px_36px_rgba(236,7,141,0.35)]">
        {PATH.title}
      </h2>

      <ol
        ref={years.ref}
        dir="ltr"
        className={`mx-auto mt-8 flex w-full max-w-[860px] flex-row flex-nowrap items-start justify-center ${years.on ? "path-in" : ""}`}
      >
        {PATH.years.map((item, index) => (
          <Fragment key={item.year}>
            {index > 0 ? <YearArrow delay={`${0.18 + (index - 1) * 0.28}s`} /> : null}
            <YearCircle year={item.year} label={item.title} delay={`${index * 0.28}s`} />
          </Fragment>
        ))}
      </ol>

      <ul
        ref={metrics.ref}
        className={`mx-auto mt-12 grid max-w-[1680px] grid-cols-2 gap-3 sm:gap-6 lg:mt-16 lg:grid-cols-4 lg:gap-8 ${metrics.on ? "path-in" : ""}`}
      >
        {PATH.metrics.map((metric, index) => (
          <li
            key={metric.label}
            className="glass-panel group flex min-w-0 flex-col items-center rounded-[1.25rem] px-2.5 py-4 text-center transition-transform duration-500 hover:-translate-y-1 sm:rounded-[1.75rem] sm:px-4 sm:py-6"
          >
            <img
              src={metric.icon}
              alt=""
              width={65}
              height={63}
              className="path-metric-icon mx-auto h-[36px] w-auto transition-transform duration-500 group-hover:scale-110 sm:h-[48px] lg:h-[54px]"
              style={{ animationDelay: `${index * 0.12}s` }}
            />
            <p className="font-fanum m-0 mt-2 text-[11px] font-extrabold leading-snug text-black sm:mt-3 sm:text-[14px] sm:leading-[22px]">
              {metric.label}
            </p>
            <p className="font-fanum m-0 text-[10px] font-extrabold leading-snug text-black sm:text-[14px] sm:leading-[22px]">
              {metric.cagrLabel}
            </p>
            <p
              className="font-fanum m-0 mt-2.5 bg-gradient-to-l from-[#a60062] via-[#ec078d] to-[#ff6bcb] bg-clip-text text-[clamp(26px,7vw,40px)] font-black leading-none text-transparent sm:mt-3 lg:text-[52px]"
              dir="ltr"
            >
              <CountValue to={metric.value} active={metrics.on} plus={metric.plus} />
            </p>
            <p className="font-fanum m-0 mt-2 text-[10px] font-bold leading-4 text-pink sm:mt-3 sm:text-[13px] sm:leading-[22px] lg:text-[14px]">
              {metric.note}
            </p>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-14 max-w-[1100px] lg:mt-16">
        <p className="font-fanum m-0 flex items-center justify-center gap-2 text-center text-[20px] font-extrabold leading-[41px] text-pink lg:gap-3 lg:text-[25px]">
          <img src={PATH.gender.kickerIcon} alt="" width={46} height={46} className="size-8 lg:size-[46px]" />
          {PATH.gender.kicker}
        </p>
        <h3 className="font-fanum m-0 mt-3 text-center text-[22px] font-bold leading-[1.55] text-black lg:text-[34px] lg:leading-[53px]">
          {PATH.gender.title}
        </h3>
        <p className="font-fanum m-0 mt-2 text-center text-[15px] font-light leading-7 text-black/70 lg:text-[22px] lg:leading-8">
          {PATH.gender.source}
        </p>
        <div
          ref={gender.ref}
          dir="ltr"
          className="glass-panel mx-auto mt-8 flex max-w-[820px] items-stretch gap-3 rounded-[1.75rem] px-4 py-5 sm:mt-10 sm:gap-6 sm:px-6 sm:py-6"
        >
          <div dir="rtl" className="grid w-[7.5rem] shrink-0 grid-rows-2 sm:w-[10rem]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <img
                src={PATH.gender.femaleIcon}
                alt=""
                width={39}
                height={72}
                className="h-[36px] w-auto sm:h-[48px]"
              />
              <p className="font-fanum m-0 flex items-baseline gap-1 font-light leading-none">
                <span className="text-[clamp(18px,3.2vw,36px)]">
                  <CountValue to={PATH.gender.womenPct} active={gender.on} />
                </span>
                <span className="text-[clamp(12px,1.5vw,18px)]">{PATH.gender.womenWord}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <img
                src={PATH.gender.maleIcon}
                alt=""
                width={39}
                height={72}
                className="h-[36px] w-auto sm:h-[48px]"
              />
              <p className="font-fanum m-0 flex items-baseline gap-1 font-light leading-none">
                <span className="text-[clamp(18px,3.2vw,36px)]">
                  <CountValue to={PATH.gender.menPct} active={gender.on} />
                </span>
                <span className="text-[clamp(12px,1.5vw,18px)]">{PATH.gender.menWord}</span>
              </p>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-fanum m-0 mb-2 w-full text-center text-[13px] font-bold leading-none text-pink sm:mb-2.5 sm:text-[15px]">
              {PATH.gender.year}
            </p>
            <div className="h-[72px] w-full overflow-hidden sm:h-[80px]">
              <PathGenderChart active={gender.on} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
