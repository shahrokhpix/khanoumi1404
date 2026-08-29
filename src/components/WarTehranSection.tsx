import { useEffect, useId, useRef, useState } from "react";
import { CHAPTER1 } from "../content/war-report";
import { tehranRhythm } from "../data/charts";

const BRAND = "#EC078D";

type RhythmPt = {
  month: string;
  index: number;
  x: number;
  y: number;
  isDip: boolean;
  dipLabel?: string;
};

const TEHRAN_DIPS = new Set(["خرداد", "اسفند"]);

const TEHRAN_DIP_LABELS: Record<string, string> = {
  خرداد: "۲۸ خرداد",
  اسفند: "۱۰ اسفند",
};

function smoothLine(points: RhythmPt[]): string {
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

function WarTehranRhythmChart() {
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
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const w = 920;
  const h = 410;
  const padL = 68;
  const padR = 16;
  const padTop = 28;
  const padBot = 92;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;
  const plotBottom = padTop + plotH;
  const yMax = 250;
  const monthLabelY = plotBottom + 26;
  const dipConnectorEnd = plotBottom + 54;
  const dipLabelY = plotBottom + 72;

  const pts: RhythmPt[] = tehranRhythm.map((d, i) => {
    const x = padL + (i / Math.max(tehranRhythm.length - 1, 1)) * plotW;
    const isDip = TEHRAN_DIPS.has(d.month);
    const index = isDip ? 0 : d.index;
    const y = padTop + (1 - Math.min(index, yMax) / yMax) * plotH;
    const dipLabel = TEHRAN_DIP_LABELS[d.month];
    return {
      ...d,
      index,
      x,
      y,
      isDip,
      dipLabel,
    };
  });

  const line = smoothLine(pts);
  const area = `${line} L${pts[pts.length - 1]!.x},${plotBottom} L${pts[0]!.x},${plotBottom} Z`;

  return (
    <div ref={wrapRef} className="war-tehran-chart mx-auto w-full max-w-[920px] overflow-visible" dir="ltr">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto min-h-[260px] w-full overflow-visible sm:min-h-[320px]"
        role="img"
        aria-label={CHAPTER1.tehranChart}
      >
        <defs>
          <linearGradient id={`thr-fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity="0.14" />
            <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
          </linearGradient>
          <clipPath id={`thr-plot-${gid}`}>
            <rect x={padL} y={padTop} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        {[0, 50, 100, 150, 200, 250].map((val) => {
          const y = padTop + (1 - val / yMax) * plotH;
          return (
            <g key={val}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#ece7e3" strokeWidth={1} />
              <text x={padL - 12} y={y + 5} textAnchor="end" className="font-fanum war-tehran-axis-y">
                {faPct(val)}
              </text>
            </g>
          );
        })}

        <path
          d={area}
          fill={`url(#thr-fill-${gid})`}
          clipPath={`url(#thr-plot-${gid})`}
          className={inView ? "war-chart-draw" : "opacity-0"}
        />
        <path
          d={line}
          fill="none"
          stroke={BRAND}
          strokeWidth={3.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          clipPath={`url(#thr-plot-${gid})`}
          className={inView ? "war-chart-draw" : "opacity-0"}
          pathLength={1}
        />

        {pts.map((p) =>
          p.isDip ? (
            <g key={`dip-${p.month}`}>
              <line
                x1={p.x}
                x2={p.x}
                y1={plotBottom}
                y2={dipConnectorEnd}
                stroke={BRAND}
                strokeOpacity={0.55}
                strokeWidth={1.75}
              />
              <circle cx={p.x} cy={plotBottom} r={10} fill={BRAND} fillOpacity={0.14} />
              <circle
                cx={p.x}
                cy={plotBottom}
                r={7}
                fill={BRAND}
                stroke="#fff"
                strokeWidth={1.5}
                className={inView ? "war-chart-dot" : "opacity-0"}
              />
              <text x={p.x} y={dipLabelY} textAnchor="middle" className="font-fanum war-tehran-dip-label">
                {p.dipLabel}
              </text>
            </g>
          ) : null,
        )}

        {pts.map((p) => (
          <text
            key={`lbl-${p.month}`}
            x={p.x}
            y={monthLabelY}
            textAnchor="middle"
            className="font-fanum war-tehran-axis-x"
          >
            {p.month}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function WarTehranSection() {
  return (
    <section
      id="tehran"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHAPTER1.tehranTitle}
        </h2>
        <p className="font-fanum mx-auto mt-4 max-w-[40rem] text-center text-[clamp(15px,1.9vw,20px)] font-bold leading-8 text-black">
          {CHAPTER1.tehranLead}
        </p>
        <div className="font-fanum mx-auto mt-5 max-w-[48rem] space-y-3 text-center text-[clamp(14px,1.7vw,17px)] leading-8 text-black/80">
          <p className="m-0">{CHAPTER1.tehranP1}</p>
          <p className="m-0">{CHAPTER1.tehranP2}</p>
        </div>

        <p className="font-fanum mx-auto mt-5 max-w-[40rem] text-center text-[clamp(15px,1.9vw,20px)] font-bold leading-8 text-black">
          {CHAPTER1.tehranCallout}
        </p>

        <p className="font-fanum mt-10 mb-6 text-center text-[clamp(13px,1.5vw,16px)] text-black/55">
          {CHAPTER1.tehranChart}
        </p>

        <WarTehranRhythmChart />
      </div>
    </section>
  );
}
