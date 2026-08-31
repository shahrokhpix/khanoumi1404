import { useEffect, useId, useRef, useState } from "react";
import { CHAPTER1 } from "../content/war-report";
import { hourlyOrders } from "../data/charts";

const BRAND = "#EC078D";
const MARK_LIGHT = "#F6AED5";

type HourPt = { hour: number; share: number; x: number; y: number };

type HourEvent = {
  hour: number;
  label: string;
  fill: string;
};

const HOUR_EVENTS: HourEvent[] = [
  { hour: 12, label: CHAPTER1.hourLabels[1]!, fill: MARK_LIGHT },
  { hour: 18, label: CHAPTER1.hourLabels[0]!, fill: BRAND },
];

function smoothLine(points: HourPt[]): string {
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

function faPct(val: number): string {
  return `٪${val.toLocaleString("fa-IR")}`;
}

function WarHourlyOrdersChart() {
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
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [wrapRef]);

  const w = 920;
  const h = 340;
  const padL = 68;
  const padR = 16;
  const padTop = 28;
  const padBot = 52;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;
  const plotBottom = padTop + plotH;
  const yMax = 8;

  const pts: HourPt[] = hourlyOrders.map((d, i) => {
    const hour = Number(d.hour);
    const x = padL + (i / Math.max(hourlyOrders.length - 1, 1)) * plotW;
    const y = padTop + (1 - d.share / yMax) * plotH;
    return { hour, share: d.share, x, y };
  });

  const eventByHour = new Map(HOUR_EVENTS.map((ev) => [ev.hour, ev]));

  const line = smoothLine(pts);
  const area = `${line} L${pts[pts.length - 1]!.x},${plotBottom} L${pts[0]!.x},${plotBottom} Z`;

  return (
    <div ref={wrapRef} className="war-hourly-chart war-chart-wrap mx-auto w-full max-w-[920px] overflow-visible" dir="ltr">
      <div
        className="mb-4 flex flex-col items-end gap-2.5 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-x-5 sm:gap-y-2"
        dir="rtl"
      >
        <span className="font-fanum inline-flex items-center gap-2 text-[11px] font-bold text-black sm:text-[13px]">
          <span className="inline-block h-0.5 w-7 shrink-0 rounded-full bg-pink" aria-hidden="true" />
          سهم هر ساعت از سفارش‌های یک روز عادی
        </span>
        {HOUR_EVENTS.map((ev) => (
          <span
            key={ev.hour}
            className="font-fanum inline-flex max-w-full items-center gap-2 text-[11px] font-bold text-black sm:text-[13px]"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: ev.fill }}
              aria-hidden="true"
            />
            {ev.label}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto min-h-[220px] w-full overflow-visible sm:min-h-[280px]"
        role="img"
        aria-label={CHAPTER1.zeroChartSub}
      >
        <defs>
          <linearGradient id={`hz-fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity="0.14" />
            <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: 9 }, (_, i) => {
          const val = i;
          const y = padTop + (1 - val / yMax) * plotH;
          return (
            <g key={val}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#ece7e3" strokeWidth={1} />
              <text
                x={padL - 12}
                y={y + 5}
                textAnchor="end"
                className="font-fanum war-hourly-axis-y"
              >
                {faPct(val)}
              </text>
            </g>
          );
        })}

        <path d={area} fill={`url(#hz-fill-${gid})`} className={inView ? "war-chart-draw" : "opacity-0"} />
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

        {pts.map((p) => {
          const ev = eventByHour.get(p.hour);
          if (!ev) return null;
          return (
            <g key={`mark-${p.hour}`}>
              <circle
                cx={p.x}
                cy={plotBottom}
                r={9}
                fill={ev.fill}
                fillOpacity={0.22}
                className={inView ? "war-chart-dot" : "opacity-0"}
              />
              <circle
                cx={p.x}
                cy={plotBottom}
                r={6.5}
                fill={ev.fill}
                stroke="#fff"
                strokeWidth={1.5}
                className={inView ? "war-chart-dot" : "opacity-0"}
              />
            </g>
          );
        })}

        {pts.map((p) =>
          p.hour % 2 === 0 ? (
            <text
              key={`h-${p.hour}`}
              x={p.x}
              y={h - 16}
              textAnchor="middle"
              className="font-fanum war-hourly-axis-x"
            >
              {p.hour.toLocaleString("fa-IR")}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

export function WarZeroSection() {
  return (
    <section
      id="zero"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHAPTER1.zeroTitle}
        </h2>
        <div className="font-fanum mx-auto mt-5 max-w-[48rem] space-y-4 text-center text-[clamp(14px,1.7vw,18px)] leading-8 text-black/80">
          <p className="m-0">{CHAPTER1.zeroP1}</p>
          <p className="m-0">{CHAPTER1.zeroP2}</p>
        </div>

        <h3 className="font-fanum m-0 mt-12 text-center text-[clamp(1.15rem,2.3vw,1.75rem)] font-bold leading-snug text-black sm:mt-14">
          {CHAPTER1.zeroChartTitle}
        </h3>
        <p className="font-fanum mt-2 mb-8 text-center text-[clamp(13px,1.5vw,16px)] text-black/55">
          {CHAPTER1.zeroChartSub}
        </p>

        <WarHourlyOrdersChart />
      </div>
    </section>
  );
}
