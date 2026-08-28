import { useEffect, useRef, useState } from "react";
import { CHAPTER2 } from "../content/war-report";
import { provinceDrop, provinceShare } from "../data/charts";

const WAR_ONE = "#ED088D";
const WAR_TWO = "#F49AC2";
const SHARE_DROP = "#B0016A";
const SHARE_GROWTH = "#ED088D";
const AXIS = "#A9A9A9";

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

function topRoundedBarPath(x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height);
  const bottom = y + height;
  return [
    `M${x},${bottom}`,
    `L${x + width},${bottom}`,
    `L${x + width},${y + r}`,
    `Q${x + width},${y} ${x + width - r},${y}`,
    `L${x + r},${y}`,
    `Q${x},${y} ${x},${y + r}`,
    "Z",
  ].join(" ");
}

function ProvinceDropBars() {
  const { ref, on } = useInView<HTMLDivElement>();
  const max = 30;
  const w = 800;
  const h = 360;
  const padL = 72;
  const padR = 24;
  const padTop = 24;
  const padBot = 72;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;
  const plotBottom = padTop + plotH;
  const groupW = plotW / provinceDrop.length;
  const barW = 72;
  const barGap = 18;
  const faValue = (value: number) =>
    value.toLocaleString("fa-IR", { maximumFractionDigits: 1 });

  return (
    <div ref={ref} className="mx-auto mt-6 w-full max-w-[820px]" dir="ltr">
      <div className="mb-4 flex flex-wrap items-center justify-end gap-6" dir="rtl">
        <span className="font-fanum inline-flex items-center gap-2 text-[13px] font-bold text-black sm:text-[14px]">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: WAR_ONE }} />
          جنگ اول
        </span>
        <span className="font-fanum inline-flex items-center gap-2 text-[13px] font-bold text-black sm:text-[14px]">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: WAR_TWO }} />
          جنگ دوم
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={CHAPTER2.moveChart}>
        <line x1={padL} x2={padL} y1={padTop} y2={plotBottom} stroke={AXIS} />
        <line x1={padL} x2={w - padR} y1={plotBottom} y2={plotBottom} stroke={AXIS} />
        <text
          x={18}
          y={padTop + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 18 ${padTop + plotH / 2})`}
          className="font-fanum fill-black text-[12px] font-bold"
        >
          درصد افت فروش نسبت به سال قبل
        </text>
        {[0, 5, 10, 15, 20, 25, 30].map((v) => {
          const y = padTop + (1 - v / max) * plotH;
          return (
            <g key={v}>
              <line x1={padL - 5} x2={padL} y1={y} y2={y} stroke={AXIS} />
              <text x={padL - 10} y={y + 4} textAnchor="end" className="font-fanum fill-black/65 text-[12px] font-bold">
                ٪{v.toLocaleString("fa-IR")}
              </text>
            </g>
          );
        })}
        {provinceDrop.map((row, i) => {
          const cx = padL + i * groupW + groupW / 2;
          const h1 = (row.war1 / max) * plotH;
          const h2 = (row.war2 / max) * plotH;
          const totalBarsW = barW * 2 + barGap;
          const firstX = cx - totalBarsW / 2;
          return (
            <g key={row.name}>
              <path
                d={topRoundedBarPath(firstX, plotBottom - h1, barW, h1, 20)}
                fill={WAR_ONE}
                className="transition-transform duration-700 ease-out"
                style={{
                  transform: on ? "scaleY(1)" : "scaleY(0)",
                  transformBox: "fill-box",
                  transformOrigin: "center bottom",
                }}
              />
              <path
                d={topRoundedBarPath(firstX + barW + barGap, plotBottom - h2, barW, h2, 20)}
                fill={WAR_TWO}
                className="transition-transform duration-700 ease-out"
                style={{
                  transform: on ? "scaleY(1)" : "scaleY(0)",
                  transformBox: "fill-box",
                  transformOrigin: "center bottom",
                  transitionDelay: "80ms",
                }}
              />
              {on && (
                <>
                  <text x={firstX + barW / 2} y={plotBottom - h1 - 8} textAnchor="middle" className="font-fanum fill-black text-[13px] font-bold">
                    ٪{faValue(row.war1)}
                  </text>
                  <text x={firstX + barW + barGap + barW / 2} y={plotBottom - h2 - 8} textAnchor="middle" className="font-fanum fill-black text-[13px] font-bold">
                    ٪{faValue(row.war2)}
                  </text>
                </>
              )}
              <text x={cx} y={h - 30} textAnchor="middle" className="font-fanum fill-black text-[15px] font-bold">
                {row.name}
              </text>
            </g>
          );
        })}
        <text x={padL + plotW / 2} y={h - 7} textAnchor="middle" className="font-fanum fill-black/70 text-[12px] font-bold">
          استان
        </text>
      </svg>
    </div>
  );
}

function ProvinceShareBars() {
  const { ref, on } = useInView<HTMLDivElement>();
  const w = 960;
  const h = 390;
  const mid = w / 2;
  const maxHalf = 361;
  const rowH = 48;
  const barH = 30;
  const top = 58;

  return (
    <div ref={ref} className="mx-auto mt-8 w-full max-w-[1000px]" dir="ltr">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={CHAPTER2.moveBars}>
        <text x={mid - 180} y={24} textAnchor="middle" className="font-fanum fill-[#B0016A] text-[15px] font-bold">افت سهم</text>
        <text x={mid + 180} y={24} textAnchor="middle" className="font-fanum fill-[#ED088D] text-[15px] font-bold">رشد سهم</text>
        <line x1={mid} x2={mid} y1={40} y2={h - 22} stroke={AXIS} strokeWidth={1.5} />
        {provinceShare.map((row, i) => {
          const y = top + i * rowH;
          const len = (Math.abs(row.change) / 100) * maxHalf;
          const isPos = row.change >= 0;
          const x = isPos ? mid : mid - (on ? len : 0);
          const width = on ? len : 0;
          return (
            <g key={row.name}>
              <text
                x={isPos ? mid + len + 14 : mid - len - 14}
                y={y + barH / 2 + 5}
                textAnchor={isPos ? "start" : "end"}
                className="font-fanum fill-black text-[15px] font-bold"
              >
                {row.name}
              </text>
              <rect
                x={x}
                y={y}
                width={width}
                height={barH}
                fill={isPos ? SHARE_GROWTH : SHARE_DROP}
                className="transition-all duration-900 ease-out"
                style={{ transitionDelay: `${i * 70}ms` }}
              />
            </g>
          );
        })}
        <text x={mid} y={h - 4} textAnchor="middle" className="font-fanum fill-black/70 text-[12px] font-bold">
          تغییر سهم ارزش در فروش
        </text>
      </svg>
    </div>
  );
}

export function WarProvincesSection() {
  return (
    <section
      id="provinces"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHAPTER2.moveTitle}
        </h2>
        <p className="font-fanum mx-auto mt-5 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHAPTER2.moveP1}
        </p>

        <h3 className="font-fanum m-0 mt-12 text-center text-[clamp(1.15rem,2.3vw,1.75rem)] font-bold leading-snug text-black sm:mt-14">
          {CHAPTER2.moveChart}
        </h3>
        <ProvinceDropBars />

        <p className="font-fanum mx-auto mt-12 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHAPTER2.moveP2}
        </p>

        <h3 className="font-fanum m-0 mt-12 text-center text-[clamp(1.15rem,2.3vw,1.75rem)] font-bold leading-snug text-black sm:mt-14">
          {CHAPTER2.moveBars}
        </h3>
        <ProvinceShareBars />

        <figure className="mx-auto m-0 mt-14 max-w-[920px] overflow-hidden rounded-[1.5rem] shadow-[0_22px_48px_rgba(0,0,0,0.18)] sm:mt-16 sm:rounded-[1.75rem]">
          <img
            src="/assets/photos/img_08_4502x2309.jpeg"
            alt={CHAPTER2.moveClosing}
            width={4502}
            height={2309}
            className="block h-auto w-full object-cover"
          />
          <figcaption className="font-fanum bg-[#1a0612] px-4 py-3 text-center text-[12px] font-bold leading-7 text-white/85 sm:px-5 sm:text-[13px]">
            {CHAPTER2.moveClosing}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
