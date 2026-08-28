import { useEffect, useId, useRef, useState } from "react";
import { CHAPTER1 } from "../content/war-report";
import { dailyOrderDips, dailyOrders, MONTHS } from "../data/charts";

const BRAND = "#EC078D";
const Y_MAX = 100;
const CRISIS_MONTHS = new Set([2, 9, 11]);

type Pt = { x: number; y: number; month: string; orders: number; monthIndex: number };

type DipCallout = {
  pt: Pt;
  boxCenterX: number;
  elbowY: number;
  date: string;
  text: string;
  monthIndex: number;
};

function smoothLine(points: Pt[]): string {
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

function connectorPath(fromX: number, fromY: number, toX: number, toY: number, elbowY: number): string {
  if (Math.abs(fromX - toX) < 2) {
    return `M${fromX.toFixed(1)},${fromY.toFixed(1)} L${toX.toFixed(1)},${toY.toFixed(1)}`;
  }
  return `M${fromX.toFixed(1)},${fromY.toFixed(1)} L${fromX.toFixed(1)},${elbowY.toFixed(1)} L${toX.toFixed(1)},${elbowY.toFixed(1)} L${toX.toFixed(1)},${toY.toFixed(1)}`;
}

function WarDailyOrdersChart() {
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
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const w = 920;
  const padX = 24;
  const padTop = 20;
  const plotBottom = 228;
  const plotH = plotBottom - padTop;
  const plotW = w - padX * 2;
  const boxGap = 10;
  const boxW = (plotW - boxGap * 2) / 3;
  const connectorEnd = plotBottom + 34;
  const elbowGap = 12;
  const svgH = connectorEnd + 4;

  const pts: Pt[] = dailyOrders.map((d, i) => {
    const x = padX + (i / Math.max(MONTHS.length - 1, 1)) * plotW;
    const orders = CRISIS_MONTHS.has(i) ? 0 : d.orders;
    const y = padTop + (1 - orders / Y_MAX) * plotH;
    return { ...d, orders, x, y, monthIndex: i };
  });

  const line = smoothLine(pts);
  const area = `${line} L${pts[pts.length - 1]!.x},${plotBottom} L${pts[0]!.x},${plotBottom} Z`;

  const dipCopyByMonth: Record<string, { date: string; text: string }> = {
    خرداد: CHAPTER1.dips[0]!,
    دی: CHAPTER1.dips[1]!,
    اسفند: CHAPTER1.dips[2]!,
  };

  const dips: DipCallout[] = dailyOrderDips
    .flatMap((dip) => {
      const pt = pts[dip.monthIndex];
      if (!pt) return [];
      const copy = dipCopyByMonth[dip.month];
      return [
        {
          pt: { ...pt, y: plotBottom },
          boxCenterX: 0,
          elbowY: plotBottom + elbowGap,
          date: copy?.date ?? dip.date,
          text: copy?.text ?? dip.text,
          monthIndex: dip.monthIndex,
        },
      ];
    })
    .sort((a, b) => a.monthIndex - b.monthIndex)
    .map((dip, i) => ({
      ...dip,
      boxCenterX: padX + i * (boxW + boxGap) + boxW / 2,
    }));

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-[920px]" dir="ltr">
      <div className="mb-4 flex flex-wrap items-center justify-end gap-5" dir="rtl">
        <span className="font-fanum inline-flex items-center gap-2 text-[12px] font-bold text-black sm:text-[13px]">
          <span className="inline-block h-0.5 w-7 rounded-full bg-pink" aria-hidden="true" />
          روند سفارش روزانه
        </span>
        <span className="font-fanum inline-flex items-center gap-2 text-[12px] font-bold text-black sm:text-[13px]">
          <span className="size-2.5 rounded-full bg-pink" aria-hidden="true" />
          کم‌فروش‌ترین روزهای سال
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${w} ${svgH}`}
          className="relative z-0 block h-auto w-full overflow-visible"
          role="img"
          aria-label={CHAPTER1.threeDaysChart}
        >
          <defs>
            <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND} stopOpacity="0.14" />
              <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
            </linearGradient>
          </defs>

          {Array.from({ length: 5 }, (_, i) => {
            const y = padTop + (i / 4) * plotH;
            return (
              <line key={i} x1={padX} x2={w - padX} y1={y} y2={y} stroke="#ece7e3" strokeWidth={1} />
            );
          })}

          <path d={area} fill={`url(#fill-${gid})`} className={inView ? "war-chart-draw" : "opacity-0"} />
          <path
            d={line}
            fill="none"
            stroke={BRAND}
            strokeWidth={3.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            className={inView ? "war-chart-draw" : "opacity-0"}
            pathLength={1}
          />

          {pts.map((p) => (
            <text
              key={`lbl-${p.month}`}
              x={p.x}
              y={plotBottom + 20}
              textAnchor="middle"
              className="font-fanum fill-black text-[10px] font-bold sm:text-[11px]"
            >
              {p.month}
            </text>
          ))}

          {dips.map((dip) => (
            <g key={dip.monthIndex}>
              <path
                d={connectorPath(dip.pt.x, plotBottom, dip.boxCenterX, connectorEnd, dip.elbowY)}
                fill="none"
                stroke={BRAND}
                strokeWidth={1.75}
                strokeOpacity={0.6}
                strokeLinejoin="round"
              />
              <circle
                cx={dip.pt.x}
                cy={plotBottom}
                r={7}
                fill={BRAND}
                className={inView ? "war-chart-dot" : "opacity-0"}
              />
              <circle cx={dip.pt.x} cy={plotBottom} r={11} fill={BRAND} fillOpacity={0.12} />
            </g>
          ))}
        </svg>

        <div
          className="grid grid-cols-3 gap-1.5 sm:gap-2.5"
          style={{ paddingInline: `${(padX / w) * 100}%` }}
          dir="ltr"
        >
          {dips.map((dip) => (
            <div key={dip.monthIndex} className="flex min-w-0 flex-col items-center">
              <div className="h-3 w-px shrink-0 bg-pink/60 sm:h-4" aria-hidden="true" />
              <div
                dir="rtl"
                className="flex w-full min-h-[7.5rem] flex-col justify-center rounded-[0.875rem] border border-pink/45 bg-white px-2 py-3 text-center shadow-[0_6px_20px_rgba(236,7,141,0.08)] sm:min-h-[8rem] sm:rounded-2xl sm:px-3 sm:py-3.5"
              >
                <p className="font-fanum m-0 text-[14px] font-extrabold leading-snug text-pink sm:text-[16px]">
                  {dip.date}
                </p>
                <p className="font-fanum m-0 mt-1.5 text-[12px] font-bold leading-[1.5] text-black/85 sm:mt-2 sm:text-[14px] sm:leading-[1.65]">
                  {dip.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WarCrisisSection() {
  return (
    <section
      id="crisis"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHAPTER1.crisisTitle}
        </h2>
        <p className="font-fanum mx-auto mt-5 max-w-[48rem] text-center text-[clamp(14px,1.7vw,18px)] leading-8 text-black/80">
          {CHAPTER1.crisisBody}
        </p>

        <h3 className="font-fanum m-0 mt-12 text-center text-[clamp(1.2rem,2.4vw,1.85rem)] font-bold leading-snug text-black sm:mt-14">
          {CHAPTER1.threeDaysTitle}
        </h3>
        <p className="font-fanum mt-2 mb-6 text-center text-[clamp(13px,1.5vw,16px)] text-black/55">
          {CHAPTER1.threeDaysChart}
        </p>

        <WarDailyOrdersChart />
      </div>
    </section>
  );
}
