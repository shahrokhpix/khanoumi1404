import { useEffect, useRef, useState } from "react";
import { CHAPTER2 } from "../content/war-report";
import { lipstickVsAcneByPeriod, lipstickVsAcneSeries, makeupShift } from "../data/charts";

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
        } else {
          setOn(false);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

function faPct(val: number): string {
  return `٪${val.toLocaleString("fa-IR")}`;
}

function barPathTopRound(x: number, y: number, w: number, h: number, r: number): string {
  if (h <= 0) return "";
  const radius = Math.min(r, w / 2, h);
  const bottom = y + h;
  if (h <= radius) {
    return `M${x},${bottom} L${x + w},${bottom} L${x + w},${y} L${x},${y} Z`;
  }
  return [
    `M${x},${bottom}`,
    `L${x + w},${bottom}`,
    `L${x + w},${y + radius}`,
    `Q${x + w},${y} ${x + w - radius},${y}`,
    `L${x + radius},${y}`,
    `Q${x},${y} ${x},${y + radius}`,
    "Z",
  ].join(" ");
}

const LIP_Y_MAX = 16;
const LIP_Y_TICKS = [0, 2, 4, 6, 8, 10, 12, 14, 16] as const;
const LIP_AXIS = "#B5B5B5";

function LipAcneBars() {
  const { ref, on } = useInView<HTMLDivElement>();
  const w = 960;
  const h = 400;
  const padL = 58;
  const padR = 24;
  const padTop = 28;
  const padBot = 96;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;
  const plotBottom = padTop + plotH;
  const periodW = plotW / lipstickVsAcneByPeriod.length;
  const barW = 52;
  const barGap = 18;

  return (
    <div ref={ref} className="war-lip-acne-chart mx-auto mt-6 w-full max-w-[1000px]" dir="ltr">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-5 sm:justify-end sm:gap-6" dir="rtl">
        {lipstickVsAcneSeries.map((item) => (
          <span key={item.key} className="font-fanum inline-flex items-center gap-2.5 text-[13px] font-bold text-[#111111] sm:text-[14px]">
            <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: item.color }} aria-hidden="true" />
            {item.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto min-h-[320px] w-full overflow-visible sm:min-h-[360px]" role="img" aria-label={CHAPTER2.acneVsLip}>
        <line x1={padL} x2={padL} y1={padTop} y2={plotBottom} stroke={LIP_AXIS} strokeWidth={1} />
        <line x1={padL} x2={w - padR} y1={plotBottom} y2={plotBottom} stroke={LIP_AXIS} strokeWidth={1} />
        <line x1={padL + periodW} x2={padL + periodW} y1={padTop} y2={plotBottom} stroke={LIP_AXIS} strokeWidth={1} />

        {LIP_Y_TICKS.map((val) => {
          const y = padTop + (1 - val / LIP_Y_MAX) * plotH;
          return (
            <g key={val}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke={LIP_AXIS} strokeWidth={val === 0 ? 1 : 0.75} opacity={val === 0 ? 1 : 0.45} />
              <text x={padL - 8} y={y + 4} textAnchor="end" className="font-fanum war-lip-acne-axis-y">
                {faPct(val)}
              </text>
            </g>
          );
        })}

        {lipstickVsAcneByPeriod.map((period, periodIndex) => {
          const bars = lipstickVsAcneSeries.map((series) => ({
            ...series,
            value: period[series.key],
          }));
          const totalBarsW = bars.length * barW + (bars.length - 1) * barGap;
          const periodStart = padL + periodIndex * periodW;
          const startX = periodStart + (periodW - totalBarsW) / 2;
          const labelX = periodStart + periodW / 2;

          return (
            <g key={period.label}>
              {bars.map((bar, barIndex) => {
                const x = startX + barIndex * (barW + barGap);
                const barH = (bar.value / LIP_Y_MAX) * plotH;
                const y = on ? plotBottom - barH : plotBottom;
                return (
                  <path
                    key={`${period.label}-${bar.key}`}
                    d={barPathTopRound(x, y, barW, on ? barH : 0, 12)}
                    fill={bar.color}
                    className="transition-all duration-700 ease-out"
                    style={{ transitionDelay: `${barIndex * 80}ms` }}
                  />
                );
              })}
              <text x={labelX} y={h - 52} textAnchor="middle" className="font-fanum war-lip-acne-axis-x">
                {period.label}
              </text>
              <text x={labelX} y={h - 32} textAnchor="middle" className="font-fanum war-lip-acne-axis-caption">
                {period.caption}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MakeupShiftBars() {
  const { ref, on } = useInView<HTMLDivElement>();
  const up = makeupShift.filter((r) => r.change > 0);
  const down = makeupShift.filter((r) => r.change < 0);
  const scaleMax = 60;
  const rows = up.map((growth, index) => ({
    growth,
    decline: down[index],
  }));

  const percent = (value: number) =>
    Math.min(100, (Math.abs(value) / scaleMax) * 100);

  const faValue = (value: number) =>
    Math.abs(value).toLocaleString("fa-IR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  return (
    <div
      ref={ref}
      className="mx-auto mt-8 w-full max-w-[1100px]"
      dir="ltr"
    >
      <div className="mb-7 flex items-center justify-center gap-7 sm:gap-10" dir="rtl">
        <span className="font-fanum inline-flex items-center gap-2 text-[12px] font-bold text-black sm:text-[14px]">
          <span className="h-2.5 w-2.5 bg-[#ED088D] sm:h-3 sm:w-3" aria-hidden="true" />
          رشد تعداد فروش
        </span>
        <span className="font-fanum inline-flex items-center gap-2 text-[12px] font-bold text-black sm:text-[14px]">
          <span className="h-2.5 w-2.5 bg-[#A50163] sm:h-3 sm:w-3" aria-hidden="true" />
          کاهش تعداد فروش
        </span>
      </div>

      <ul className="m-0 grid list-none gap-7 p-0 sm:gap-10">
        {rows.map(({ growth, decline }, index) => (
          <li
            key={growth.name}
            className="grid grid-cols-[minmax(42px,80px)_42px_minmax(44px,1fr)_8px_minmax(44px,1fr)_42px_minmax(48px,92px)] items-center sm:grid-cols-[110px_62px_minmax(100px,1fr)_10px_minmax(100px,1fr)_62px_130px]"
          >
            <span className="font-fanum text-right text-[10px] font-bold leading-4 text-[#111111] sm:text-[14px]">
              {decline?.name}
            </span>
            <bdi className="font-fanum text-center text-[10px] font-black text-[#A50163] sm:text-[14px]" dir="rtl">
              ٪−{decline ? faValue(decline.change) : "۰"}
            </bdi>

            <span className="relative h-[18px] overflow-hidden rounded-l-full bg-[#d5d5d5] sm:h-7">
              <span
                className="absolute inset-y-0 right-0 bg-[#A50163] transition-[width] duration-1000 ease-out"
                style={{
                  width: on && decline ? `${percent(decline.change)}%` : "0%",
                  transitionDelay: `${index * 100}ms`,
                }}
              />
            </span>

            <span aria-hidden="true" />

            <span className="relative h-[18px] overflow-hidden rounded-r-full bg-[#d5d5d5] sm:h-7">
              <span
                className="absolute inset-y-0 left-0 bg-[#ED088D] transition-[width] duration-1000 ease-out"
                style={{
                  width: on ? `${percent(growth.change)}%` : "0%",
                  transitionDelay: `${index * 100}ms`,
                }}
              />
            </span>

            <bdi className="font-fanum text-center text-[10px] font-black text-[#ED088D] sm:text-[14px]" dir="rtl">
              ٪{faValue(growth.change)}
            </bdi>
            <span className="font-fanum text-left text-[10px] font-bold leading-4 text-[#111111] sm:text-[14px]">
              {growth.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WarJoySection() {
  return (
    <section
      id="joy"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHAPTER2.joyTitle}
        </h2>
        <div className="font-fanum mx-auto mt-5 max-w-[48rem] space-y-4 text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          <p className="m-0">{CHAPTER2.joyP1}</p>
          <p className="m-0">{CHAPTER2.joyP2}</p>
        </div>

        <p className="font-fanum mx-auto mt-10 max-w-[40rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHAPTER2.acneVsLip}
        </p>
        <LipAcneBars />

        <h3 className="font-fanum m-0 mt-12 text-center text-[clamp(1.15rem,2.3vw,1.65rem)] font-bold text-black">
          {CHAPTER2.smallerJoy}
        </h3>
        <p className="font-fanum mx-auto mt-5 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHAPTER2.joyP3}
        </p>

        <h3 className="font-fanum m-0 mt-12 text-center text-[clamp(1.15rem,2.3vw,1.65rem)] font-bold text-black">
          {CHAPTER2.makeupQ}
        </h3>
        <p className="font-fanum mx-auto mt-6 max-w-[40rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHAPTER2.makeupChart}
        </p>
        <MakeupShiftBars />
      </div>
    </section>
  );
}
