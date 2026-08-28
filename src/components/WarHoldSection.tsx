import { useEffect, useRef, useState } from "react";
import { CHAPTER2 } from "../content/war-report";
import { userMix } from "../data/charts";

const NEW_USER = "#ED008C";
const RETURNING_USER = "#EC80B5";

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

function UserMixBars() {
  const { ref, on } = useInView<HTMLDivElement>();
  const w = 960;
  const h = 220;
  const barX = 72;
  const barW = 850;
  const barH = 50;
  const radius = barH / 2;
  const rowY = [12, 88];

  return (
    <div ref={ref} className="mx-auto mt-8 w-full max-w-[1000px]" dir="ltr">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={CHAPTER2.holdChart}>
        <defs>
          {userMix.map((row, index) => {
            const y = rowY[index]!;
            return (
              <clipPath id={`user-mix-${index}`} key={row.war}>
                <path d={`M${barX},${y} H${barX + barW - radius} Q${barX + barW},${y} ${barX + barW},${y + radius} V${y + barH - radius} Q${barX + barW},${y + barH} ${barX + barW - radius},${y + barH} H${barX} Z`} />
              </clipPath>
            );
          })}
        </defs>
        {userMix.map((row, i) => {
          const y = rowY[i]!;
          const retW = (row.returning / 100) * barW;
          const newW = (row.newUsers / 100) * barW;
          return (
            <g key={row.war}>
              <text
                x={58}
                y={y + barH / 2 + 6}
                textAnchor="end"
                className="font-fanum fill-black text-[17px] font-bold"
              >
                {row.war}
              </text>
              <g clipPath={`url(#user-mix-${i})`}>
                <rect x={barX} y={y} width={on ? retW : 0} height={barH} fill={RETURNING_USER} className="transition-all duration-1000 ease-out" />
                <rect
                  x={barX + (on ? retW : 0)}
                  y={y}
                  width={on ? newW : 0}
                  height={barH}
                  fill={NEW_USER}
                  className="transition-all duration-1000 ease-out"
                  style={{ transitionDelay: "120ms" }}
                />
              </g>
            </g>
          );
        })}
        <g transform="translate(395 188)">
          <circle cx={0} cy={0} r={13} fill={RETURNING_USER} />
          <text x={-20} y={6} textAnchor="end" className="font-fanum fill-black text-[16px] font-bold">بازگشتی</text>
          <circle cx={118} cy={0} r={13} fill={NEW_USER} />
          <text x={98} y={6} textAnchor="end" className="font-fanum fill-black text-[16px] font-bold">جدید</text>
        </g>
      </svg>
    </div>
  );
}

export function WarHoldSection() {
  return (
    <section
      id="hold"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHAPTER2.holdTitle}
        </h2>
        <p className="font-fanum mx-auto mt-5 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHAPTER2.holdP}
        </p>

        <h3 className="font-fanum m-0 mt-12 text-center text-[clamp(1.15rem,2.3vw,1.75rem)] font-bold leading-snug text-black sm:mt-14">
          {CHAPTER2.holdChart}
        </h3>
        <UserMixBars />
      </div>
    </section>
  );
}
