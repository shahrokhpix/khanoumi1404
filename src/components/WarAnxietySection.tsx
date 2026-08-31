import { useId } from "react";
import { CHAPTER2 } from "../content/war-report";
import { keywordGrowth, pillSearchSeries, warVsAcneSeries } from "../data/charts";
import { useRevealOnce } from "../lib/useRevealOnce";

const BRAND = "#EC078D";
const BRAND_SOFT = "#ff9ad4";

function useInView<T extends HTMLElement>() {
  const { ref, visible } = useRevealOnce<T>({ threshold: 0.2 });
  return { ref, on: visible };
}

function PillChart() {
  const gid = useId().replace(/:/g, "");
  const { ref: inRef, on } = useInView<HTMLDivElement>();
  const w = 720;
  const h = 240;
  const padX = 36;
  const padTop = 20;
  const padBot = 40;
  const plotW = w - padX * 2;
  const plotH = h - padTop - padBot;
  const pts = pillSearchSeries.map((d, i) => {
    const x = padX + (i / Math.max(pillSearchSeries.length - 1, 1)) * plotW;
    const y = padTop + (1 - d.value / 100) * plotH;
    return { ...d, x, y };
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <div ref={inRef} className="war-chart-wrap mx-auto mt-6 w-full max-w-[720px]" dir="ltr">
      <svg viewBox={`0 0 ${w} ${h}`} className="war-chart-svg-tall h-auto w-full" role="img" aria-label={CHAPTER2.pillChart}>
        <defs>
          <linearGradient id={`pill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 20, 40, 60, 80, 100].map((v) => {
          const y = padTop + (1 - v / 100) * plotH;
          return (
            <g key={v}>
              <line x1={padX} x2={w - padX} y1={y} y2={y} stroke="#ece7e3" strokeWidth={1} />
              <text x={padX - 8} y={y + 3} textAnchor="end" className="font-fanum war-chart-axis-y fill-black/40 font-bold">
                {v}
              </text>
            </g>
          );
        })}
        <path
          d={`${line} L${pts[pts.length - 1]!.x},${padTop + plotH} L${pts[0]!.x},${padTop + plotH} Z`}
          fill={`url(#pill-${gid})`}
          className={on ? "war-chart-draw" : "opacity-0"}
        />
        <path
          d={line}
          fill="none"
          stroke={BRAND}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
          className={on ? "war-chart-draw" : "opacity-0"}
          pathLength={1}
        />
        {pts
          .filter((p): p is typeof p & { yearLabel: string } => p.yearLabel != null)
          .map((p) => (
            <text
              key={p.yearLabel}
              x={p.x}
              y={h - 12}
              textAnchor="middle"
              className="font-fanum war-chart-axis-x"
            >
              {p.yearLabel}
            </text>
          ))}
      </svg>
    </div>
  );
}

function WarAcneLines() {
  const { ref: inRef, on } = useInView<HTMLDivElement>();
  const w = 720;
  const h = 240;
  const padX = 36;
  const padTop = 20;
  const padBot = 40;
  const plotW = w - padX * 2;
  const plotH = h - padTop - padBot;
  const pts = warVsAcneSeries.map((d, i) => {
    const x = padX + (i / Math.max(warVsAcneSeries.length - 1, 1)) * plotW;
    return {
      ...d,
      x,
      yWar: padTop + (1 - d.war / 100) * plotH,
      yAcne: padTop + (1 - d.acne / 100) * plotH,
    };
  });
  const warLine = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.yWar.toFixed(1)}`).join(" ");
  const acneLine = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.yAcne.toFixed(1)}`).join(" ");

  return (
    <div ref={inRef} className="war-chart-wrap mx-auto mt-6 w-full max-w-[720px]" dir="ltr">
      <div className="mb-3 flex flex-wrap items-center justify-end gap-5" dir="rtl">
        <span className="font-fanum inline-flex items-center gap-2 text-[12px] font-bold text-black">
          <span className="inline-block h-0.5 w-6 rounded-full bg-pink" />
          اخبار جنگ
        </span>
        <span className="font-fanum inline-flex items-center gap-2 text-[12px] font-bold text-black">
          <span className="inline-block h-0.5 w-6 rounded-full bg-[#ff9ad4]" />
          جوش
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="war-chart-svg-tall h-auto w-full" role="img" aria-label={CHAPTER2.acneChart}>
        {[0, 20, 40, 60, 80, 100].map((v) => {
          const y = padTop + (1 - v / 100) * plotH;
          return <line key={v} x1={padX} x2={w - padX} y1={y} y2={y} stroke="#ece7e3" strokeWidth={1} />;
        })}
        <path
          d={warLine}
          fill="none"
          stroke={BRAND}
          strokeWidth={3}
          strokeLinejoin="round"
          className={on ? "war-chart-draw" : "opacity-0"}
          pathLength={1}
        />
        <path
          d={acneLine}
          fill="none"
          stroke={BRAND_SOFT}
          strokeWidth={3}
          strokeLinejoin="round"
          className={on ? "war-chart-draw" : "opacity-0"}
          pathLength={1}
        />
        {pts
          .filter((p): p is typeof p & { xLabel: string } => p.xLabel != null)
          .map((p) => (
            <text
              key={p.xLabel}
              x={p.x}
              y={h - 12}
              textAnchor="middle"
              className={`font-fanum war-chart-axis-x ${p.x > w - 100 ? "war-anxiety-last-label" : ""}`}
            >
              {p.xLabel}
            </text>
          ))}
      </svg>
    </div>
  );
}

function KeywordBars() {
  const { ref, on } = useInView<HTMLDivElement>();
  const max = Math.max(...keywordGrowth.map((k) => k.growth));

  return (
    <div ref={ref} className="mx-auto mt-6 w-full max-w-[640px]" dir="ltr">
      <ul className="m-0 grid list-none gap-3 p-0">
        {keywordGrowth.map((row) => (
          <li key={row.name} className="grid grid-cols-[7.5rem_1fr_4.5rem] items-center gap-3 sm:grid-cols-[8.5rem_1fr_5rem]">
            <span className="font-fanum text-right text-[13px] font-bold text-black sm:text-[14px]" dir="rtl">
              {row.name}
            </span>
            <div className="h-3 overflow-hidden rounded-full bg-pink-mist/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ec078d] to-[#ff4fb8] transition-[width] duration-1000 ease-out"
                style={{ width: on ? `${(row.growth / max) * 100}%` : "0%" }}
              />
            </div>
            <span className="font-fanum text-left text-[13px] font-black text-pink sm:text-[14px]">
              +{row.growth}٪
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WarAnxietySection() {
  return (
    <section
      id="anxiety"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHAPTER2.anxietyTitle}
        </h2>
        <p className="font-fanum mx-auto mt-5 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHAPTER2.anxietyP1}
        </p>

        <p className="font-fanum mx-auto mt-10 max-w-[40rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHAPTER2.pillChart}
        </p>
        <PillChart />

        <p className="font-fanum mx-auto mt-12 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHAPTER2.anxietyP2}
        </p>

        <h3 className="font-fanum m-0 mt-10 text-center text-[clamp(1.15rem,2.3vw,1.65rem)] font-bold text-black">
          {CHAPTER2.acneTitle}
        </h3>
        <p className="font-fanum mx-auto mt-2 max-w-[40rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHAPTER2.acneChart}
        </p>
        <WarAcneLines />

        <h3 className="font-fanum m-0 mt-14 text-center text-[clamp(1.15rem,2.3vw,1.65rem)] font-bold text-black">
          {CHAPTER2.reliefTitle}
        </h3>
        <p className="font-fanum mx-auto mt-4 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHAPTER2.reliefP}
        </p>
        <p className="font-fanum mx-auto mt-8 max-w-[40rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHAPTER2.reliefChart}
        </p>
        <KeywordBars />
      </div>
    </section>
  );
}
