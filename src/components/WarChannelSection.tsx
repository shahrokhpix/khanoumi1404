import { useEffect, useRef, useState } from "react";
import { CHANNEL } from "../content/war-report";
import { contactTopics, instagramVisits } from "../data/charts";

const BRAND = "#EC078D";
const WAR1_BAR = "#a60062";
const WAR2_BAR = "#EC078D";
const CONTACT_Y_MAX = 20;
const CONTACT_Y_TICKS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20] as const;

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

function faPctDecimal(val: number): string {
  return `٪${val.toLocaleString("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
}

function ContactTopicLabel({ x, y, topic }: { x: number; y: number; topic: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="start"
      dominantBaseline="hanging"
      transform={`rotate(-40 ${x} ${y})`}
      className="font-fanum war-contact-axis-x"
    >
      {topic}
    </text>
  );
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

function AparatBanner() {
  return (
    <div
      className="mx-auto mt-6 flex w-full max-w-[720px] items-center justify-between gap-[clamp(0.3rem,1.5vw,1.25rem)] rounded-[clamp(1rem,3vw,1.75rem)] bg-[#EC078D] px-[clamp(0.55rem,2.4vw,1.5rem)] py-[clamp(0.6rem,2vw,1.25rem)] text-white shadow-[0_16px_40px_rgba(236,7,141,0.28)]"
      dir="ltr"
    >
      <div className="flex shrink-0 items-center gap-[clamp(0.25rem,1vw,0.8rem)] whitespace-nowrap">
        <span className="font-fanum text-[clamp(0.875rem,3vw,1.75rem)] font-black tabular-nums">
          {CHANNEL.aparatFrom}
        </span>
        <img
          src="/assets/figma-war/arrow-w.svg"
          alt=""
          aria-hidden
          className="h-auto w-[clamp(2.35rem,8vw,5.5rem)]"
        />
        <span className="font-fanum text-[clamp(0.875rem,3vw,1.75rem)] font-black tabular-nums">
          {CHANNEL.aparatTo}
        </span>
      </div>

      <p
        className="font-fanum min-w-0 flex-1 text-right text-[clamp(0.48rem,1.35vw,0.9rem)] font-bold leading-[1.55]"
        dir="rtl"
      >
        {CHANNEL.aparatBannerLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <img
        src="/assets/war/aparat-logo-white.svg"
        alt="آپارات"
        className="h-auto w-[clamp(4rem,16vw,9rem)] shrink-0 brightness-0 invert"
      />
    </div>
  );
}

function InstagramBars() {
  const { ref, on } = useInView<HTMLDivElement>();
  const w = 480;
  const h = 300;
  const padL = 44;
  const padR = 24;
  const padTop = 16;
  const padBot = 56;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;
  const plotBottom = padTop + plotH;
  const yTicks = [0, 10, 20, 40, 60, 80, 100];
  const barW = 56;
  const gap = plotW * 0.28;
  const totalBarsW = instagramVisits.length * barW + gap;
  const startX = padL + (plotW - totalBarsW) / 2;

  return (
    <div ref={ref} className="war-ig-chart mx-auto mt-8 w-full max-w-[520px] overflow-visible" dir="ltr">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto min-h-[220px] w-full overflow-visible" role="img">
        <line x1={padL} x2={w - padR} y1={plotBottom} y2={plotBottom} stroke="#b8b8b8" strokeWidth={1} />
        <line x1={padL} x2={padL} y1={padTop} y2={plotBottom} stroke="#b8b8b8" strokeWidth={1} />

        {yTicks.map((val) => {
          const y = padTop + (1 - val / 100) * plotH;
          return (
            <g key={val}>
              <line x1={padL - 4} x2={padL} y1={y} y2={y} stroke="#b8b8b8" strokeWidth={1} />
              <text
                x={padL - 8}
                y={y + 4}
                textAnchor="end"
                className="font-fanum war-ig-axis-y"
              >
                {faPct(val)}
              </text>
            </g>
          );
        })}

        {instagramVisits.map((row, i) => {
          const x = startX + i * (barW + gap);
          const barH = (row.visits / 100) * plotH;
          const y = on ? plotBottom - barH : plotBottom;
          return (
            <g key={row.period}>
              <path
                d={barPathTopRound(x, y, barW, on ? barH : 0, 10)}
                fill={BRAND}
                className="transition-all duration-1000 ease-out"
              />
              <text
                x={x + barW / 2}
                y={h - 18}
                textAnchor="middle"
                className="font-fanum war-ig-axis-x"
              >
                {row.period}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ContactBars() {
  const { ref, on } = useInView<HTMLDivElement>();
  const w = 660;
  const h = 440;
  const padL = 52;
  const padR = 16;
  const padTop = 28;
  const padBot = 120;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;
  const plotBottom = padTop + plotH;
  const groupW = plotW / contactTopics.length;
  const barW = 42;
  const barGap = 8;

  return (
    <div ref={ref} className="war-contact-chart mx-auto mt-6 w-full max-w-[820px]" dir="ltr">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-6 sm:gap-8" dir="rtl">
        <span className="font-fanum inline-flex items-center gap-2 text-[13px] font-bold text-black sm:text-sm">
          <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-[#a60062]" aria-hidden="true" />
          جنگ اول
        </span>
        <span className="font-fanum inline-flex items-center gap-2 text-[13px] font-bold text-black sm:text-sm">
          <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-[#EC078D]" aria-hidden="true" />
          جنگ دوم
        </span>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={CHANNEL.callChart}
      >
        <line x1={padL} x2={padL} y1={padTop} y2={plotBottom} stroke="#d4d4d4" strokeWidth={1} />
        <line x1={padL} x2={w - padR} y1={plotBottom} y2={plotBottom} stroke="#d4d4d4" strokeWidth={1} />

        {CONTACT_Y_TICKS.map((val) => {
          const y = padTop + (1 - val / CONTACT_Y_MAX) * plotH;
          return (
            <text
              key={val}
              x={padL - 8}
              y={y + 4}
              textAnchor="end"
              className="font-fanum war-contact-axis-y"
            >
              {faPct(val)}
            </text>
          );
        })}

        {contactTopics.map((row, i) => {
          const groupCenter = padL + i * groupW + groupW / 2;
          const totalBarsW = barW * 2 + barGap;
          const xWar1 = groupCenter - totalBarsW / 2;
          const xWar2 = xWar1 + barW + barGap;
          const h1 = row.war1 != null ? (row.war1 / CONTACT_Y_MAX) * plotH : 0;
          const h2 = row.war2 != null ? (row.war2 / CONTACT_Y_MAX) * plotH : 0;
          const y1 = on ? plotBottom - h1 : plotBottom;
          const y2 = on ? plotBottom - h2 : plotBottom;

          return (
            <g key={row.topic}>
              {row.war1 != null && (
                <>
                  <path
                    d={barPathTopRound(xWar1, y1, barW, on ? h1 : 0, 10)}
                    fill={WAR1_BAR}
                    className="transition-all duration-700 ease-out"
                  />
                  <text
                    x={xWar1 + barW / 2}
                    y={y1 - 6}
                    textAnchor="middle"
                    className="font-fanum war-contact-value"
                  >
                    {faPctDecimal(row.war1)}
                  </text>
                </>
              )}
              {row.war2 != null && (
                <>
                  <path
                    d={barPathTopRound(xWar2, y2, barW, on ? h2 : 0, 10)}
                    fill={WAR2_BAR}
                    className="transition-all duration-700 ease-out"
                    style={{ transitionDelay: "80ms" }}
                  />
                  <text
                    x={xWar2 + barW / 2}
                    y={y2 - 6}
                    textAnchor="middle"
                    className="font-fanum war-contact-value"
                  >
                    {faPctDecimal(row.war2)}
                  </text>
                </>
              )}
              <ContactTopicLabel x={groupCenter} y={plotBottom + 32} topic={row.topic} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function WarChannelSection() {
  return (
    <section
      id="channel"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHANNEL.title}
        </h2>

        <p className="font-fanum mx-auto mt-8 max-w-[40rem] text-center text-[clamp(14px,1.7vw,17px)] font-bold leading-8 text-black">
          {CHANNEL.igTitle}
        </p>
        <InstagramBars />

        <p className="font-fanum mx-auto mt-10 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHANNEL.alt}
        </p>

        <img
          src="/assets/photos/img_04_1953x932.jpeg"
          alt="بازدید از ویدئوهای جعبه جادویی سایت خانومی شاپ"
          width={1953}
          height={932}
          className="mx-auto mt-6 block h-auto w-full max-w-[720px] rounded-[1.35rem] object-cover shadow-[0_16px_40px_rgba(26,6,18,0.12)]"
        />

        <AparatBanner />

        <p className="font-fanum mx-auto mt-10 max-w-[36rem] text-center text-[clamp(14px,1.6vw,16px)] leading-8 text-black/80">
          {CHANNEL.instaReturn}
        </p>
        <blockquote className="mx-auto mt-6 max-w-[32rem] text-center">
          <p className="font-fanum m-0 text-[clamp(1.35rem,3vw,2rem)] font-black leading-snug text-pink">
            <span className="quote-marks-inline" aria-hidden="true">
              «
            </span>
            {CHANNEL.quote}
            <span className="quote-marks-inline" aria-hidden="true">
              »
            </span>
          </p>
        </blockquote>

        <p className="font-fanum mx-auto mt-10 max-w-[42rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHANNEL.magicBox}
        </p>

        <h3 className="font-fanum m-0 mt-14 text-center text-[clamp(1.25rem,2.5vw,1.85rem)] font-extrabold text-black">
          {CHANNEL.callTitle}
        </h3>
        <p className="font-fanum mx-auto mt-4 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHANNEL.callP}
        </p>
        <p className="font-fanum mx-auto mt-8 max-w-[40rem] rounded-2xl bg-gradient-to-l from-[#ec078d] to-[#a60062] px-5 py-4 text-center text-[clamp(13px,1.5vw,16px)] font-bold leading-7 text-white shadow-[0_12px_32px_rgba(236,7,141,0.25)]">
          {CHANNEL.callCallout}
        </p>
        <p className="font-fanum mt-10 mb-2 text-center text-[clamp(13px,1.5vw,15px)] text-black/55">
          {CHANNEL.callChart}
        </p>
        <ContactBars />
      </div>
    </section>
  );
}
