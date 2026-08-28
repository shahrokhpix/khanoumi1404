import { useEffect, useRef, useState } from "react";
import { CHAPTER2 } from "../content/war-report";
import {
  ukraineTrendEvent,
  ukraineTrendSeries,
  ukraineTrendTicks,
  ukraineTrends,
} from "../data/charts";

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
      ([e]) => {
        if (e?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

function UkraineLines() {
  const { ref, on } = useInView<HTMLDivElement>();
  const w = 960;
  const h = 400;
  const padL = 74;
  const padR = 24;
  const padTop = 36;
  const padBot = 62;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;
  const plotBottom = padTop + plotH;
  const xAt = (index: number) =>
    padL + (index / Math.max(ukraineTrends.length - 1, 1)) * plotW;
  const yAt = (value: number) => padTop + (1 - value / 100) * plotH;

  const pts = ukraineTrends.map((d, i) => {
    return {
      ...d,
      x: xAt(i),
      yNews: yAt(d.news),
      yPerfume: yAt(d.perfume),
      yLipstick: yAt(d.lipstick),
    };
  });

  const line = (key: "yNews" | "yPerfume" | "yLipstick") =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p[key].toFixed(1)}`).join(" ");
  const eventX = xAt(ukraineTrendEvent.index);

  return (
    <div ref={ref} className="mx-auto mt-8 w-full max-w-[1000px]" dir="ltr">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-5 sm:justify-end sm:gap-7" dir="rtl">
        {ukraineTrendSeries.map((series) => (
          <span key={series.key} className="font-fanum inline-flex items-center gap-2 text-[12px] font-bold text-black sm:text-[14px]">
            <span className="inline-block h-0.5 w-7 rounded-full" style={{ backgroundColor: series.color }} aria-hidden="true" />
            {series.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full overflow-visible" role="img" aria-label={CHAPTER2.ukraineTitle}>
        <text
          x={19}
          y={padTop + plotH / 2}
          textAnchor="middle"
          className="font-fanum fill-black text-[12px] font-bold"
          transform={`rotate(-90 19 ${padTop + plotH / 2})`}
        >
          شاخص جست‌وجوی Google Trends
        </text>

        {[0, 25, 50, 75, 100].map((v) => {
          const y = yAt(v);
          return (
            <g key={v}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#A9A9A9" strokeWidth={1} opacity={v === 0 ? 1 : 0.55} />
              <text x={padL - 10} y={y + 4} textAnchor="end" className="font-fanum fill-black/65 text-[12px] font-bold">
                {v.toLocaleString("fa-IR")}
              </text>
            </g>
          );
        })}

        <line x1={padL} x2={padL} y1={padTop} y2={plotBottom} stroke="#A9A9A9" />
        <line x1={eventX} x2={eventX} y1={padTop} y2={plotBottom} stroke={ukraineTrendEvent.color} strokeWidth={2} strokeDasharray="7 7" />
        <text x={eventX + 7} y={padTop + 16} textAnchor="start" className="font-fanum fill-[#A50163] text-[13px] font-black">
          {ukraineTrendEvent.label}
        </text>

        {ukraineTrendSeries.map((series) => {
          const key = series.key === "lipstick"
            ? "yLipstick"
            : series.key === "perfume"
              ? "yPerfume"
              : "yNews";
          return (
            <path
              key={series.key}
              d={line(key)}
              fill="none"
              stroke={series.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={on ? "war-chart-draw" : "opacity-0"}
              pathLength={1}
            />
          );
        })}

        {ukraineTrendTicks.map((tick) => (
          <g key={tick.label}>
            <line x1={xAt(tick.index)} x2={xAt(tick.index)} y1={plotBottom} y2={plotBottom + 6} stroke="#A9A9A9" />
            <text x={xAt(tick.index)} y={h - 20} textAnchor="middle" className="font-fanum fill-black text-[12px] font-bold">
              {tick.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function WarUkraineSection() {
  return (
    <section
      id="ukraine"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum m-0 text-center text-[clamp(1.15rem,2.3vw,1.65rem)] font-bold text-black">
          {CHAPTER2.ukraineTitle}
        </h2>
        <div className="font-fanum mx-auto mt-5 max-w-[48rem] space-y-4 text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          <p className="m-0">{CHAPTER2.ukraineP1}</p>
          <p className="m-0">{CHAPTER2.ukraineP2}</p>
          <p className="m-0">{CHAPTER2.ukraineP3}</p>
        </div>

        <UkraineLines />

        <blockquote className="relative mx-auto mt-12 max-w-[46rem] overflow-hidden rounded-[2rem] border border-pink/20 bg-pink-mist/60 px-6 py-8 text-center shadow-[0_18px_50px_rgba(236,7,141,0.10)] sm:px-10 sm:py-10">
          <p className="font-fanum relative m-0 text-[clamp(1rem,2.2vw,1.4rem)] font-black leading-9 text-pink">
            «{CHAPTER2.ukraineQuote}»
          </p>
          <cite className="font-fanum relative mt-5 block text-[12px] font-bold not-italic text-black/60 sm:text-[13px]">
            {CHAPTER2.ukraineCite}
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
