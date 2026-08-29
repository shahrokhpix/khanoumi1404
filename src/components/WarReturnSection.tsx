import { useEffect, useId, useRef, useState } from "react";
import { CHAPTER1 } from "../content/war-report";
import {
  PINK_DEEP,
  RETURN_DIP_MONTHS,
  RETURN_RECOVERY_MONTHS,
  RETURN_X_LABELS,
  RETURN_YEAR_MEAN,
  returnRhythm,
} from "../data/charts";

const BRAND = "#EC078D";

type ReturnPt = {
  month: string;
  orders: number;
  x: number;
  y: number;
  isDip: boolean;
  isRecovery: boolean;
};

function smoothLine(points: ReturnPt[]): string {
  if (points.length < 2) return "";
  let d = `M${points[0]!.x.toFixed(1)},${points[0]!.y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

function WarReturnRhythmChart() {
  const gid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const w = 920;
  const h = 340;
  const padX = 32;
  const padTop = 28;
  const padBot = 52;
  const plotW = w - padX * 2;
  const plotH = h - padTop - padBot;
  const plotBottom = padTop + plotH;
  const yMax = 100;

  const yOf = (v: number) => padTop + (1 - v / yMax) * plotH;
  const meanY = yOf(RETURN_YEAR_MEAN);

  const pts: ReturnPt[] = returnRhythm.map((d, i) => {
    const x = padX + (i / Math.max(returnRhythm.length - 1, 1)) * plotW;
    const isDip = RETURN_DIP_MONTHS.has(d.month);
    const orders = isDip ? 0 : d.orders;
    const y = yOf(orders);
    return {
      ...d,
      orders,
      x,
      y,
      isDip,
      isRecovery: RETURN_RECOVERY_MONTHS.has(d.month),
    };
  });

  const line = smoothLine(pts);
  const area = `${line} L${pts[pts.length - 1]!.x},${plotBottom} L${pts[0]!.x},${plotBottom} Z`;
  const last = pts[pts.length - 1]!;

  return (
    <div ref={wrapRef} className="war-return-chart mx-auto w-full max-w-[920px] overflow-visible" dir="ltr">
      <div className="mb-4 flex flex-col items-end gap-2.5 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-x-5 sm:gap-y-2" dir="rtl">
        <span className="font-fanum inline-flex items-center gap-2 text-[11px] font-bold text-white/90 sm:text-[12px]">
          <span className="inline-block h-0.5 w-6 shrink-0 rounded-full bg-pink" aria-hidden="true" />
          روند سفارش روزانه
        </span>
        <span className="font-fanum inline-flex items-center gap-2 text-[11px] font-bold text-white/90 sm:text-[12px]">
          <span className="inline-block h-px w-6 shrink-0 border-t border-dashed border-pink/80" aria-hidden="true" />
          حداقل میانگین روزانه سال
        </span>
        <span className="font-fanum inline-flex items-center gap-2 text-[11px] font-bold text-white/90 sm:text-[12px]">
          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: PINK_DEEP }} aria-hidden="true" />
          کم‌فروش‌ترین روزهای سال
        </span>
        <span className="font-fanum inline-flex items-center gap-2 text-[11px] font-bold text-white/90 sm:text-[12px]">
          <span className="size-2.5 shrink-0 rounded-full bg-pink" aria-hidden="true" />
          بازگشت به میانگین
        </span>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto min-h-[220px] w-full overflow-visible sm:min-h-[280px]"
        role="img"
        aria-label={CHAPTER1.returnChartTitle}
      >
        <defs>
          <linearGradient id={`ret-fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity="0.2" />
            <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
          </linearGradient>
          <clipPath id={`ret-plot-${gid}`}>
            <rect x={padX} y={padTop} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        {Array.from({ length: 5 }, (_, i) => {
          const y = padTop + (i / 4) * plotH;
          return (
            <line key={i} x1={padX} x2={w - padX} y1={y} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          );
        })}

        <line
          x1={padX}
          x2={w - padX}
          y1={meanY}
          y2={meanY}
          stroke={BRAND}
          strokeOpacity={0.6}
          strokeWidth={1.5}
          strokeDasharray="7 5"
        />

        <path
          d={area}
          fill={`url(#ret-fill-${gid})`}
          clipPath={`url(#ret-plot-${gid})`}
          className={inView ? "war-chart-draw" : "opacity-0"}
        />
        <path
          d={line}
          fill="none"
          stroke={BRAND}
          strokeWidth={3.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          clipPath={`url(#ret-plot-${gid})`}
          className={inView ? "war-chart-draw" : "opacity-0"}
          pathLength={1}
        />

        {last.isDip && (
          <line
            x1={last.x}
            x2={last.x}
            y1={plotBottom}
            y2={yOf(38)}
            stroke={BRAND}
            strokeWidth={2.5}
            strokeLinecap="round"
            className={inView ? "war-chart-draw" : "opacity-0"}
          />
        )}

        {pts.map((p) => {
          if (p.isDip) {
            return (
              <g key={`dip-${p.month}`}>
                <circle cx={p.x} cy={plotBottom} r={9} fill={PINK_DEEP} fillOpacity={0.25} />
                <circle
                  cx={p.x}
                  cy={plotBottom}
                  r={6.5}
                  fill={PINK_DEEP}
                  stroke="#fff"
                  strokeWidth={1.25}
                  className={inView ? "war-chart-dot" : "opacity-0"}
                />
              </g>
            );
          }
          if (p.isRecovery) {
            return (
              <g key={`rec-${p.month}`}>
                <circle cx={p.x} cy={meanY} r={9} fill={BRAND} fillOpacity={0.2} />
                <circle
                  cx={p.x}
                  cy={meanY}
                  r={6}
                  fill={BRAND}
                  stroke="#fff"
                  strokeWidth={1.5}
                  className={inView ? "war-chart-dot" : "opacity-0"}
                />
              </g>
            );
          }
          return null;
        })}

        {pts.map((p, i) =>
          RETURN_X_LABELS.has(i) ? (
            <text
              key={`lbl-${p.month}`}
              x={p.x}
              y={h - 14}
              textAnchor="middle"
              className="font-fanum war-return-axis-x"
            >
              {p.month}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

export function WarReturnSection() {
  return (
    <section id="return" data-reveal className="scroll-mt-annual relative overflow-hidden bg-[#0d0308] text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a0612] via-[#0d0308] to-[#12030c]" aria-hidden="true" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

      <figure className="relative z-[1] m-0 w-full">
        <img
          src="/assets/war/gisha.jpg"
          alt={CHAPTER1.gishaCaption}
          width={1949}
          height={1178}
          className="block h-auto w-full object-cover"
        />
        <figcaption className="font-fanum bg-black/85 px-4 py-3 text-center text-[12px] font-bold leading-7 text-white/85 sm:px-5 sm:text-[13px]">
          {CHAPTER1.gishaCaption}
        </figcaption>
      </figure>

      <div className="relative mx-auto max-w-[1100px] px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20">
        <div dir="rtl">
          <h2 className="font-fanum war-section-title m-0 text-center text-pink">
            {CHAPTER1.returnTitle}
          </h2>
          <div className="font-fanum mx-auto mt-5 max-w-[48rem] space-y-4 text-center text-[clamp(14px,1.7vw,17px)] leading-8 text-white/85">
            <p className="m-0">{CHAPTER1.returnP1}</p>
            <p className="m-0">{CHAPTER1.returnP2}</p>
          </div>

          <h3 className="font-fanum m-0 mt-12 text-center text-[clamp(1.1rem,2.2vw,1.65rem)] font-bold leading-snug text-white">
            {CHAPTER1.returnChartTitle}
          </h3>
          <p className="font-fanum mt-2 mb-8 text-center text-[clamp(12px,1.4vw,15px)] text-white/50">
            روند ثبت سفارش از خانومی در سال ۱۴۰۴
          </p>

          <WarReturnRhythmChart />
        </div>
      </div>
    </section>
  );
}
