import { CHAPTER2 } from "../content/war-report";
import {
  categoryJumpByPeriod,
  categoryShare,
  creditPurchaseGrowth,
  perCustomerSpend,
  type CategoryJumpBar,
} from "../data/charts";
import { useRevealOnce } from "../lib/useRevealOnce";

const BRAND = "#EC078D";
const COLORS = {
  care: BRAND,
  beauty: "#ff9ad4",
  other: "#c4b5b0",
};

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const { ref, visible } = useRevealOnce<T>({ threshold });
  return { ref, on: visible };
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, start: number, end: number) {
  const a = polar(cx, cy, r, start);
  const b = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M${cx} ${cy} L${a.x.toFixed(2)} ${a.y.toFixed(2)} A${r} ${r} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)} Z`;
}

function faSharePct(val: number): string {
  return `${val.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}٪`;
}

function CarePies() {
  const { ref, on } = useInView<HTMLDivElement>();
  const labels = [
    { key: "care" as const, name: "مراقبتی" },
    { key: "beauty" as const, name: "آرایشی" },
    { key: "other" as const, name: "سایر" },
  ];
  const cx = 100;
  const cy = 100;
  const r = 90;

  return (
    <div ref={ref} className="mt-8 grid gap-8 sm:grid-cols-2">
      {categoryShare.map((row) => {
        const parts = [
          { key: "care" as const, value: row.care },
          { key: "beauty" as const, value: row.beauty },
          { key: "other" as const, value: row.other },
        ];
        let angle = 0;
        const slices = parts.map((p) => {
          const start = angle;
          const end = angle + (p.value / 100) * 360;
          angle = end;
          return { ...p, start, end };
        });
        return (
          <article key={row.war} className="flex flex-col items-center text-center">
            <p className="font-fanum m-0 mb-4 whitespace-pre-line text-[13px] font-bold leading-7 text-black/70">
              {row.war}
            </p>
            <svg viewBox="0 0 200 200" className="size-[11rem] sm:size-[13rem]" role="img" aria-label={row.war}>
              <g className={on ? "war-care-pie-in" : "opacity-0"}>
                {slices.map((s, i) => (
                  <path
                    key={s.key}
                    d={slicePath(cx, cy, r, s.start, s.end)}
                    fill={COLORS[s.key]}
                    stroke="#fff"
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </g>
            </svg>
            <ul className="mt-4 flex list-none flex-wrap justify-center gap-3 p-0" dir="rtl">
              {labels.map((l) => (
                <li key={l.key} className="font-fanum inline-flex items-center gap-1.5 text-[12px] font-bold text-black">
                  <span className="size-2.5 rounded-full" style={{ background: COLORS[l.key] }} />
                  {l.name} {faSharePct(row[l.key])}
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
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

const JUMP_LEGEND = [
  { key: "health", name: "محصولات سلامت‌محور", color: "#EC078D" },
  { key: "electric", name: "لوازم برقی", color: "#a60062" },
  { key: "hygiene", name: "بهداشت شخصی", color: "#ff9ad4" },
] as const;

const JUMP_Y_MAX = 300;
const JUMP_Y_TICKS = [0, 50, 100, 150, 200, 250, 300] as const;

function JumpBars() {
  const { ref: inRef, on } = useInView<HTMLDivElement>();
  const w = 960;
  const h = 380;
  const padL = 58;
  const padR = 24;
  const padTop = 28;
  const padBot = 72;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;
  const plotBottom = padTop + plotH;
  const periodW = plotW / categoryJumpByPeriod.length;
  const barW = 52;
  const barGap = 18;

  return (
    <div ref={inRef} className="war-jump-chart war-chart-wrap mx-auto mt-6 w-full max-w-[1000px]" dir="ltr">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-5 sm:justify-end sm:gap-6" dir="rtl">
        {JUMP_LEGEND.map((item) => (
          <span key={item.key} className="font-fanum inline-flex items-center gap-2.5 text-[13px] font-bold text-black sm:text-[14px]">
            <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: item.color }} aria-hidden="true" />
            {item.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto min-h-[320px] w-full overflow-visible sm:min-h-[360px]" role="img" aria-label={CHAPTER2.careBar}>
        <line x1={padL} x2={padL} y1={padTop} y2={plotBottom} stroke="#d4d4d4" strokeWidth={1} />
        <line x1={padL} x2={w - padR} y1={plotBottom} y2={plotBottom} stroke="#d4d4d4" strokeWidth={1} />
        <line
          x1={padL + periodW}
          x2={padL + periodW}
          y1={padTop}
          y2={plotBottom}
          stroke="#d4d4d4"
          strokeWidth={1}
        />

        {JUMP_Y_TICKS.map((val) => {
          const y = padTop + (1 - val / JUMP_Y_MAX) * plotH;
          return (
            <text
              key={val}
              x={padL - 8}
              y={y + 4}
              textAnchor="end"
              className="font-fanum war-jump-axis-y"
            >
              {faPct(val)}
            </text>
          );
        })}

        {categoryJumpByPeriod.map((period, periodIndex) => {
          const activeBars = period.bars.filter((bar): bar is CategoryJumpBar & { value: number } => bar.value != null);
          const totalBarsW = activeBars.length * barW + Math.max(activeBars.length - 1, 0) * barGap;
          const periodStart = padL + periodIndex * periodW;
          const startX = periodStart + (periodW - totalBarsW) / 2;
          const labelX = periodStart + periodW / 2;

          return (
            <g key={period.label}>
              {activeBars.map((bar, barIndex) => {
                const x = startX + barIndex * (barW + barGap);
                const barH = (bar.value / JUMP_Y_MAX) * plotH;
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
              <text x={labelX} y={h - 18} textAnchor="middle" className="font-fanum war-jump-axis-x">
                {period.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

type SpendRow = (typeof perCustomerSpend)[number];

type SpendInfographicCardProps = {
  row: SpendRow;
  iconSrc: string;
  itemCount: string;
  itemLabel: string;
};

function GrowthArrow() {
  return (
    <svg viewBox="0 0 52 42" className="h-7 w-9 shrink-0 sm:h-9 sm:w-11" aria-hidden="true">
      <path
        d="M5 34 20 20l9 8 17-19M34 9h12v12"
        fill="none"
        stroke="#ED088D"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GrowthDonut({ value, active }: { value: number; active: boolean }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <div className="relative size-[5.75rem] shrink-0 sm:size-[7rem]">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#CCCCCC" strokeWidth="16" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#ED088D"
          strokeWidth="16"
          strokeLinecap="butt"
          strokeDasharray={`${dash} ${circumference}`}
          strokeDashoffset={active ? 0 : dash}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <span
        className="font-fanum absolute inset-0 grid place-items-center text-[clamp(0.8rem,2vw,1.15rem)] font-black text-[#ED088D]"
        dir="ltr"
      >
        ٪{value.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}
      </span>
    </div>
  );
}

function SpendInfographicCard({ row, iconSrc, itemCount, itemLabel }: SpendInfographicCardProps) {
  const { ref, on } = useInView<HTMLElement>();
  const warSpend = row.spend_thousand_toman_during_second_war.toLocaleString("fa-IR");
  const previousSpend = row.spend_thousand_toman_same_period_last_year.toLocaleString("fa-IR");
  const spendGrowth = row.spend_growth_percent.toLocaleString("fa-IR");
  const itemsGrowth = row.average_items_growth_percent;

  return (
    <article ref={ref} className="relative mt-7 rounded-[clamp(1.75rem,5vw,2.75rem)] border border-[#ED088D] bg-white px-3 pt-12 pb-5 sm:px-7 sm:pt-16 sm:pb-7">
      <div className="absolute top-0 right-1/2 flex h-12 w-[min(72%,34rem)] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ED088D] pr-10 pl-4 text-center sm:h-14 sm:pr-14">
        <h4 className="font-fanum m-0 text-[clamp(0.72rem,2vw,1.2rem)] font-black text-white">
          {row.category}
        </h4>
        <span className="absolute -right-1 grid size-14 place-items-center rounded-full bg-[#ED088D] sm:-right-2 sm:size-[4.75rem]">
          <img
            src={iconSrc}
            alt=""
            aria-hidden
            className="size-10 object-contain brightness-0 invert sm:size-14"
          />
        </span>
      </div>

      <p className="font-fanum m-0 rounded-md bg-[#333333] px-3 py-1.5 text-center text-[clamp(0.68rem,1.7vw,0.95rem)] font-bold text-white">
        جنگ دوم نسبت به بازه مشابه سال قبل
      </p>

      <div className="mt-4 grid grid-cols-[0.82fr_1.35fr] gap-3 sm:mt-6 sm:gap-8">
        <section className="flex min-w-0 flex-col items-center justify-between text-center">
          <p className="font-fanum m-0 text-[clamp(0.62rem,1.6vw,0.95rem)] font-bold leading-5 text-[#111] sm:leading-7">
            {itemLabel}
          </p>
          <div className="mt-2 flex items-end justify-center gap-1">
            <strong className="font-fanum text-[clamp(1.65rem,5vw,2.75rem)] leading-none text-[#ED088D]">
              {itemCount}
            </strong>
            <span className="font-fanum text-[clamp(0.65rem,1.6vw,0.9rem)] text-[#111]">عدد</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <GrowthDonut value={itemsGrowth} active={on} />
            <span className="font-fanum text-[clamp(0.75rem,1.7vw,1rem)] font-bold text-[#111]">رشد</span>
          </div>
        </section>

        <section className="min-w-0 border-r border-black/10 pr-3 text-center sm:pr-8">
          <p className="font-fanum m-0 text-[clamp(0.66rem,1.7vw,1rem)] font-bold text-[#111]">
            سرانه هزینه به‌ازای هر مشتری خانومی:
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-4">
            <div className="min-w-0">
              <p className="font-fanum m-0 rounded-lg bg-[#A50163] px-1 py-2 text-[clamp(0.57rem,1.45vw,0.88rem)] font-black text-white">
                در روزهای جنگ دوم:
              </p>
              <strong className="font-fanum mt-2 block text-[clamp(1.4rem,4.4vw,2.65rem)] leading-none text-[#A50163]">
                {warSpend}
              </strong>
              <span className="font-fanum mt-2 block text-[clamp(0.55rem,1.35vw,0.82rem)] leading-5 text-[#111]">
                هزار تومان به‌ازای هر مشتری
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-fanum m-0 rounded-lg bg-[#ED088D] px-1 py-2 text-[clamp(0.57rem,1.45vw,0.88rem)] font-black text-white">
                همان بازه، سال قبل:
              </p>
              <strong className="font-fanum mt-2 block text-[clamp(1.4rem,4.4vw,2.65rem)] leading-none text-[#ED088D]">
                {previousSpend}
              </strong>
              <span className="font-fanum mt-2 block text-[clamp(0.55rem,1.35vw,0.82rem)] leading-5 text-[#111]">
                هزار تومان به‌ازای هر مشتری
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 sm:mt-5">
            <GrowthArrow />
            <p className="font-fanum m-0 text-[clamp(0.9rem,2.6vw,1.5rem)] font-black text-[#111]">
              رشد <span className="text-[#ED088D]">٪{spendGrowth}</span>
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}

function CareCreditPrelude() {
  return (
    <>
      <p className="font-fanum mx-auto mt-0 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
        {CHAPTER2.credit}
      </p>

      <div className="mx-auto mt-8 flex max-w-[40rem] flex-wrap items-center justify-center gap-4 rounded-[1.5rem] bg-pink-mist/80 px-5 py-5 sm:gap-6">
        <img src="/assets/figma-war/imgVector102.svg" alt="" width={40} height={27} className="h-7 w-auto" />
        <p className="font-fanum m-0 text-[clamp(1.25rem,2.5vw,1.75rem)] font-black text-pink">
          {creditPurchaseGrowth.toLocaleString("fa-IR")} واحد درصد رشد
        </p>
        <p className="font-fanum m-0 max-w-[22rem] text-center text-[13px] leading-7 text-black/75 sm:text-[14px]">
          {CHAPTER2.creditStat}
        </p>
      </div>

      <figure className="mx-auto m-0 mt-12 max-w-[920px] overflow-hidden rounded-[1.5rem] shadow-[0_22px_48px_rgba(0,0,0,0.22),0_8px_18px_rgba(0,0,0,0.12)] sm:mt-14 sm:rounded-[1.75rem]">
        <img
          src="/assets/photos/img_06_1949x818.jpeg"
          alt={CHAPTER2.nazmabad}
          width={1949}
          height={818}
          className="block h-auto w-full object-cover"
        />
        <figcaption className="font-fanum bg-[#1a0612] px-4 py-3 text-center text-[12px] font-bold leading-7 text-white/85 sm:px-5 sm:text-[13px]">
          {CHAPTER2.nazmabad}
        </figcaption>
      </figure>
    </>
  );
}

export function WarCareSection() {
  const careSpend = perCustomerSpend[0]!;
  const cosmeticSpend = perCustomerSpend[1]!;

  return (
    <section
      id="care"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <CareCreditPrelude />

        <h2 className="font-fanum war-section-title m-0 mt-14 text-center text-pink sm:mt-16">
          {CHAPTER2.careTitle}
        </h2>
        <p className="font-fanum mx-auto mt-5 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHAPTER2.careP}
        </p>

        <p className="font-fanum mx-auto mt-10 max-w-[40rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHAPTER2.carePie}
        </p>
        <CarePies />

        <p className="font-fanum mx-auto mt-12 max-w-[40rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHAPTER2.careBar}
        </p>
        <JumpBars />

        <p className="font-fanum mx-auto mt-14 max-w-[40rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHAPTER2.spendLead}
        </p>
        <p className="font-fanum mx-auto mt-6 max-w-[48rem] text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          {CHAPTER2.spendP}
        </p>
        <h3 className="font-fanum m-0 mt-8 text-center text-[clamp(1.15rem,2.3vw,1.65rem)] font-bold text-black">
          {CHAPTER2.spendQ}
        </h3>

        <div className="mt-10 grid gap-8 sm:mt-12 sm:gap-12">
          <SpendInfographicCard
            row={careSpend}
            iconSrc="/assets/war/goneh.svg"
            itemCount="۳"
            itemLabel="سرانه تعداد محصولات مراقبتی (بهداشتی + سلامت)، به‌ازای هر مشتری خانومی:"
          />
          <SpendInfographicCard
            row={cosmeticSpend}
            iconSrc="/assets/war/mahsoulat-fasl.svg"
            itemCount="یک"
            itemLabel="سرانه تعداد محصولات آرایشی به‌ازای هر مشتری خانومی:"
          />
        </div>

      </div>
    </section>
  );
}
