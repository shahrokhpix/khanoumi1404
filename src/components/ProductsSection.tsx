import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PRODUCTS } from "../content/annual-report";
import { donutSlice } from "../charts/geometry/wedge";
import { toFaDigits } from "../charts/typography/rtl";
import { ChapterHero } from "./ChapterHero";

const BAR = {
  y1402: "#D8D4D0",
  y1403: "#5A5754",
  y1404: "#EC078D",
};

function formatPct(value: number): string {
  const text =
    value === 1.28
      ? "1.28"
      : Number.isInteger(value)
        ? String(value)
        : String(Math.round(value * 10) / 10);
  return `${toFaDigits(text)}٪`;
}

function MiniBars({ values }: { values: readonly number[] }) {
  const max = Math.max(...values, 1);
  const years = ["۱۴۰۲", "۱۴۰۳", "۱۴۰۴"] as const;
  const fills = [BAR.y1402, BAR.y1403, BAR.y1404];

  return (
    <div dir="ltr" className="flex h-full items-end justify-center gap-2.5 pt-1 sm:gap-3">
      {values.map((value, i) => {
        const barH = Math.max(10, Math.round((value / max) * 72));
        return (
          <div key={years[i]} className="flex w-9 flex-col items-center gap-1 sm:w-10">
            <span className="font-fanum whitespace-nowrap text-[10px] font-bold leading-none text-black sm:text-[11px]">
              {formatPct(value)}
            </span>
            <div className="flex h-[4.5rem] w-full items-end">
              <div
                className="product-mini-bar w-full rounded-t-[4px]"
                style={{ height: barH, background: fills[i], ["--d" as string]: `${i * 0.1}s` }}
              />
            </div>
            <span className="font-fanum text-[10px] font-medium text-black/70">{years[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

function CareTrend({ points }: { points: readonly { year: string; value: number }[] }) {
  const w = 220;
  const h = 88;
  const padX = 18;
  const padY = 14;
  const axisY = h - 16;
  const xs = points.map((_, i) => padX + (i * (w - padX * 2)) / Math.max(1, points.length - 1));
  const ys = points.map((p) => {
    const t = (p.value - 72) / 6;
    return axisY - 12 - t * (axisY - padY - 12);
  });
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x} ${ys[i]}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto mt-1 h-auto w-[min(100%,14rem)]" aria-hidden="true">
      <line
        x1={padX - 4}
        y1={axisY}
        x2={w - padX + 4}
        y2={axisY}
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        className="care-trend-line"
        d={d}
        pathLength="1"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {xs.map((x, i) => (
        <g key={points[i].year} className="care-trend-point" style={{ ["--d" as string]: `${0.25 + i * 0.12}s` }}>
          <circle cx={x} cy={ys[i]} r="4.2" fill="#fff" />
          <text
            x={x}
            y={ys[i] - 12}
            textAnchor="middle"
            fill="#fff"
            fontSize="11"
            fontWeight="700"
            fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
          >
            {formatPct(points[i].value)}
          </text>
          <text
            x={x}
            y={axisY + 13}
            textAnchor="middle"
            fill="#fff"
            fontSize="10"
            fontWeight="600"
            fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
            style={{ direction: "ltr", unicodeBidi: "isolate" }}
          >
            {points[i].year}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MarkDisc({
  src,
  label,
  showLabel = false,
  size = "md",
  tone = "#EC078D",
  className = "",
}: {
  src: string;
  label?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg" | "title";
  tone?: string;
  className?: string;
}) {
  const box =
    size === "sm"
      ? "size-11"
      : size === "lg"
        ? "size-[4.75rem] sm:size-[5.25rem]"
        : size === "title"
          ? "size-9 sm:size-11 lg:size-12"
          : "size-[4.5rem] sm:size-[5.25rem]";
  const mark =
    showLabel && label
      ? size === "lg"
        ? "size-[1.65rem] sm:size-[1.85rem]"
        : size === "sm"
          ? "size-[1.2rem]"
          : size === "title"
            ? "size-4 sm:size-5 lg:size-6"
            : "size-[1.85rem] sm:size-[2rem]"
      : size === "sm"
        ? "size-[1.55rem]"
        : size === "lg"
          ? "size-[2.75rem] sm:size-[3rem]"
          : size === "title"
            ? "size-5 sm:size-6 lg:size-7"
            : "size-[2.55rem] sm:size-[3rem]";

  return (
    <span
      className={`inline-flex shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-full shadow-[0_10px_24px_rgba(236,7,141,0.28)] ${box} ${className}`}
      style={{ background: tone }}
      aria-hidden={label && !showLabel ? undefined : label ? undefined : true}
      title={label && !showLabel ? label : undefined}
    >
      <img
        src={src}
        alt=""
        width={64}
        height={64}
        className={`${mark} object-contain brightness-0 invert`}
        decoding="async"
      />
      {showLabel && label ? (
        <span className="font-fanum px-0.5 text-center text-[9px] font-bold leading-none text-white sm:text-[10px]">
          {label}
        </span>
      ) : null}
    </span>
  );
}

function CategoryCard({
  label,
  icon,
  values,
  single,
}: {
  label: string;
  icon: string;
  values?: readonly number[];
  single?: { year: string; value: number };
}) {
  return (
    <article className="group relative flex w-full min-w-0 max-w-[10.75rem] flex-col items-center pt-[2.375rem] sm:max-w-[12.5rem] sm:pt-[2.625rem] xl:max-w-[11.5rem]">
      <div
        className="pointer-events-none absolute top-1 size-20 rounded-full bg-pink/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:size-24"
        aria-hidden="true"
      />
      <MarkDisc
        src={icon}
        label={label}
        showLabel
        size="lg"
        className="absolute top-0 z-[2] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.03]"
      />
      <div className="relative z-0 flex h-[11rem] w-full min-w-0 flex-col overflow-hidden rounded-[1.15rem] border border-pink/12 bg-white/90 px-2.5 pb-3 pt-12 shadow-[0_10px_28px_rgba(26,6,18,0.07)] backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1 group-hover:border-pink/30 group-hover:shadow-[0_16px_36px_rgba(236,7,141,0.14)] sm:h-[12rem] sm:rounded-[1.3rem] sm:px-3.5 sm:pt-14">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-pink/50 to-transparent"
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          {single ? (
            <>
              <p className="font-fanum m-0 text-[clamp(22px,3vw,28px)] font-black leading-none text-pink">
                {formatPct(single.value)}
              </p>
              <p
                className="font-fanum m-0 mt-2 text-[13px] font-bold text-black/70"
                style={{ direction: "ltr", unicodeBidi: "isolate" }}
              >
                {single.year}
              </p>
            </>
          ) : values ? (
            <MiniBars values={values} />
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProductsSection() {
  const p = PRODUCTS;
  const mix = p.mix;

  return (
    <section
      id="products"
      data-reveal
      dir="rtl"
      className="section-band-mist relative scroll-mt-annual overflow-hidden px-4 py-16 sm:px-10 lg:px-[80px] lg:py-20"
    >
      <ChapterHero
        chapter={p.chapter}
        title={p.title}
        image={p.heroImage}
        imageAlt={p.title}
        icon={p.icon}
      />

      <h3 className="font-fanum m-0 mt-5 text-center text-[19px] font-bold leading-[34px] text-black">
        {mix.lead}
      </h3>
      <p className="font-fanum m-0 mt-1 text-center text-[clamp(12px,1.5vw,15px)] font-medium text-black/65">
        {mix.caption}
      </p>

      <div
        dir="ltr"
        className="mx-auto mt-9 grid w-full max-w-[960px] grid-cols-2 items-start gap-x-3 gap-y-7 sm:mt-11 sm:gap-x-5 sm:gap-y-8 xl:grid-cols-[minmax(0,1fr)_15rem_minmax(0,1fr)] xl:grid-rows-[auto_auto_auto] xl:gap-x-8 xl:gap-y-6"
      >
        <div className="flex w-full justify-center xl:col-start-1 xl:row-start-1 xl:justify-end">
          <CategoryCard label={mix.categories.makeup.label} icon={mix.categories.makeup.icon} values={mix.categories.makeup.values} />
        </div>
        <div className="flex w-full justify-center xl:col-start-3 xl:row-start-1 xl:justify-start">
          <CategoryCard label={mix.categories.hygiene.label} icon={mix.categories.hygiene.icon} values={mix.categories.hygiene.values} />
        </div>

        <div className="col-span-2 flex min-w-0 justify-center xl:col-span-1 xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:self-center">
          <div className="relative flex aspect-square w-full max-w-[15.5rem] items-center justify-center sm:max-w-[17rem] xl:max-w-[14rem]">
            <div
              className="care-orbit pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ec078d,#ff6bcb,#a60062,#ec078d)] opacity-70 blur-[2px] sm:inset-[-12%] xl:inset-[-6%]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-[-4%] rounded-full bg-pink/40 blur-3xl sm:inset-[-18%] xl:inset-[-10%]"
              aria-hidden="true"
            />
            <div className="relative z-[1] flex size-full flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#ff4fb8] via-[#ec078d] to-[#7a0048] px-5 py-6 text-center text-white shadow-[0_24px_60px_rgba(236,7,141,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] sm:px-7">
              <div
                className="pointer-events-none absolute inset-[3px] rounded-full border border-white/25"
                aria-hidden="true"
              />
              <p className="font-fanum relative m-0 text-[clamp(12px,1.7vw,16px)] font-bold leading-snug">
                {mix.careNote}
              </p>
              <CareTrend points={mix.careTrend} />
              <img
                src={mix.careIcon}
                alt=""
                width={42}
                height={42}
                className="relative mt-3 size-8 object-contain drop-shadow-md sm:size-10"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center xl:col-start-1 xl:row-start-2 xl:justify-end">
          <CategoryCard label={mix.categories.electric.label} icon={mix.categories.electric.icon} values={mix.categories.electric.values} />
        </div>
        <div className="flex w-full justify-center xl:col-start-3 xl:row-start-2 xl:justify-start">
          <CategoryCard label={mix.categories.health.label} icon={mix.categories.health.icon} values={mix.categories.health.values} />
        </div>

        <div className="flex w-full justify-center xl:col-start-1 xl:row-start-3 xl:justify-end">
          <CategoryCard label={mix.categories.perfume.label} icon={mix.categories.perfume.icon} values={mix.categories.perfume.values} />
        </div>
        <div className="flex w-full justify-center xl:col-start-3 xl:row-start-3 xl:justify-start">
          <CategoryCard
            label={mix.categories.gold.label}
            icon={mix.categories.gold.icon}
            single={mix.categories.gold.single}
          />
        </div>
      </div>

      <WeightMarketBand
        title={mix.weightTitle}
        year={mix.weightYear}
        highlight={mix.weightHighlight}
        mid={mix.weightMid}
        care={mix.weightCare}
        tail={mix.weightTail}
      />

      <SkinBand skin={p.skin} />
      <SpendBand spend={p.spend} />
      <MakeupBand makeup={p.makeup} />
      <PayBand pay={p.pay} />
      <BasketBand basket={p.basket} />
    </section>
  );
}

function WeightMarketBand({
  title,
  year,
  highlight,
  mid,
  care,
  tail,
}: {
  title: string;
  year: string;
  highlight: string;
  mid: string;
  care: string;
  tail: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
        } else {
          setActive(false);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div id="products-weight" ref={rootRef} className="mx-auto mt-14 w-full max-w-[1400px] lg:mt-16">
      <h3 className="font-fanum m-0 text-center text-[19px] font-bold leading-[34px] text-black">{title}</h3>
      <p className="font-fanum m-0 mt-2 text-center text-[clamp(13px,1.7vw,15px)] font-bold leading-7 text-black">
        <span className="text-pink">{highlight}</span>
        {mid}
        <span className="text-pink">{care}</span>
        {tail}
      </p>

      <div className={`mx-auto mt-8 w-full max-w-[48rem] sm:mt-10 ${active ? "weight-in" : ""}`}>
        <WeightRing year={year} />
      </div>
    </div>
  );
}

function WeightRing({ year }: { year: string }) {
  return (
    <div className="relative mx-auto w-full">
      <img
        src="/assets/annual/products/weight-chart-dayere.svg"
        alt={`وزن بازار ${year}`}
        className="weight-chart-art mx-auto block h-auto w-full max-w-[48rem]"
        width={1080}
        height={1080}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/* ─── پوست / هزینه‌کرد / آرایشی — skill-guided polish ─── */

function BandTitle({
  title,
  lead,
  accentTitle,
  nowrapTitle,
}: {
  title: string;
  lead?: string;
  accentTitle?: boolean;
  nowrapTitle?: boolean;
}) {
  return (
    <header
      className={`mx-auto w-full text-center ${nowrapTitle ? "max-w-[68rem] sm:overflow-x-auto sm:[-ms-overflow-style:none] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden" : "max-w-[40rem]"}`}
    >
      <h3
        className={`font-fanum m-0 text-[clamp(15px,2.2vw,19px)] font-bold leading-8 ${accentTitle ? "text-pink" : "text-black"} ${nowrapTitle ? "whitespace-normal sm:whitespace-nowrap" : ""}`}
      >
        {title}
      </h3>
      {lead ? (
        <p className="font-fanum m-0 mt-2 text-[clamp(12px,1.5vw,14px)] font-medium leading-7 text-black/60">
          {lead}
        </p>
      ) : null}
    </header>
  );
}

function SkinSharePie({
  share,
  market,
  rank,
  index,
}: {
  share: number;
  market: string;
  rank: string;
  index: number;
}) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const rOut = 82;
  const rIn = 48;
  const skinSweep = (share / 100) * 360;
  const start = 90;
  const midEnd = start - skinSweep;
  const skinPath = donutSlice(cx, cy, rOut, rIn, start, midEnd);
  const restPath = donutSlice(cx, cy, rOut, rIn, midEnd, start - 360);

  return (
    <figure
      className="skin-pie-item m-0 flex min-w-0 flex-col items-center text-center"
      style={{ ["--d" as string]: `${index * 0.14}s` }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full max-w-[11.75rem] drop-shadow-[0_10px_24px_rgba(236,7,141,0.16)]"
        role="img"
        aria-label={`${market}: ${formatPct(share)}`}
      >
        <path className="skin-pie-rest" d={restPath} fill="#efe4ea" stroke="#fff" strokeWidth="2.5" />
        <path className="skin-pie-slice" d={skinPath} fill="#EC078D" stroke="#fff" strokeWidth="2.5" />
        <circle cx={cx} cy={cy} r={rIn - 1.5} fill="#ffffff" className="skin-pie-core" />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#a60062"
          fontSize="24"
          fontWeight="800"
          fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
          className="skin-pie-value"
          style={{ direction: "ltr", unicodeBidi: "isolate" }}
        >
          {formatPct(share)}
        </text>
      </svg>
      <figcaption className="skin-pie-copy mt-2 max-w-[14rem] sm:mt-3">
        <p className="font-fanum m-0 text-[9px] font-bold leading-snug text-black min-[430px]:text-[10px] sm:text-[14px]">{market}</p>
        <p className="font-fanum m-0 mt-1 text-[9px] font-medium leading-snug text-pink sm:text-[12px]">{rank}</p>
      </figcaption>
    </figure>
  );
}

function SkinBand({
  skin,
}: {
  skin: {
    title: string;
    insight: string;
    rows: readonly { market: string; share: number; rank: string }[];
  };
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
        } else {
          setActive(false);
        }
      },
      { threshold: 0.2, rootMargin: "40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      id="products-skin"
      ref={rootRef}
      className={`mx-auto mt-14 w-full max-w-[58rem] lg:mt-20 ${active ? "skin-in" : ""}`}
    >
      <BandTitle title={skin.title} lead={skin.insight} accentTitle />

      <ul className="m-0 mt-8 grid list-none grid-cols-3 items-start gap-2 p-0 sm:mt-10 sm:gap-5 lg:gap-8">
        {skin.rows.map((row, index) => (
          <li key={row.market} className="flex min-w-0 justify-center">
            <SkinSharePie share={row.share} market={row.market} rank={row.rank} index={index} />
          </li>
        ))}
      </ul>

      <p className="font-fanum m-0 mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-medium text-black/45 sm:mt-8 sm:text-[12px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-pink" aria-hidden="true" />
          پوست
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#efe4ea]" aria-hidden="true" />
          سایر
        </span>
      </p>
    </div>
  );
}

function SpendBand({
  spend,
}: {
  spend: {
    title: string;
    lead: string;
    items: readonly { rank: string; title: string; text: string; icon: string }[];
    footnote: string;
    sunIcon: string;
    sunTitle: string;
    sunStats: readonly { label: string; value: string }[];
    sunNote: string;
  };
}) {
  return (
    <div id="products-spend" className="mx-auto mt-14 w-full max-w-[68rem] lg:mt-20">
      <BandTitle title={spend.title} lead={spend.lead} accentTitle />

      {/* Mobile: compact horizontal rows · Desktop: 5 equal columns */}
      <ol className="m-0 mt-8 list-none space-y-2.5 p-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0 lg:grid-cols-5 lg:gap-3">
        {spend.items.map((item) => (
          <li
            key={item.rank}
            className="flex items-center gap-3 rounded-2xl border border-pink/10 bg-white/70 px-3 py-3 shadow-[0_8px_22px_rgba(166,0,98,0.05)] backdrop-blur-sm sm:flex-col sm:items-center sm:px-3.5 sm:py-5 sm:text-center"
          >
            <span className="font-fanum inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-pink text-[11px] font-extrabold text-white sm:mb-1 sm:size-7 sm:text-[12px]">
              {item.rank}
            </span>
            <MarkDisc src={item.icon} label={item.title} size="sm" className="sm:!size-14" />
            <div className="min-w-0 flex-1 sm:mt-2.5 sm:flex-none">
              <p className="font-fanum m-0 text-[14px] font-extrabold text-pink sm:text-[15px]">{item.title}</p>
              <p className="font-fanum m-0 mt-0.5 text-[11px] font-medium leading-5 text-black/65 sm:mt-1.5 sm:text-[12px] sm:leading-6">
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="font-fanum m-0 mt-4 px-2 text-center text-[10px] font-medium leading-5 text-black/45 sm:mt-5 sm:text-[11px] sm:leading-6">
        {spend.footnote}
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 rounded-[1.35rem] border border-pink/15 bg-gradient-to-br from-[#fff7fb] via-white to-[#fceaf4] px-4 py-5 shadow-[0_12px_36px_rgba(236,7,141,0.1)] sm:mt-10 sm:flex-row sm:items-start sm:gap-6 sm:px-6 sm:py-6 lg:items-center lg:gap-8 lg:px-8">
        <MarkDisc src={spend.sunIcon} label="ضدآفتاب" size="md" className="shrink-0 sm:!size-[4.75rem]" />
        <div className="min-w-0 flex-1 text-center sm:text-right">
          <h4 className="font-fanum m-0 text-[clamp(15px,2vw,18px)] font-bold leading-8 text-black">
            {spend.sunTitle}
          </h4>
          <ul className="m-0 mt-2 list-none space-y-1.5 p-0">
            {spend.sunStats.map((row) => (
              <li
                key={row.label}
                className="font-fanum text-[clamp(13px,1.7vw,16px)] font-bold leading-7 sm:leading-8"
              >
                <span className="text-pink">{row.label}:</span>{" "}
                <span className="text-black">{row.value}</span>
              </li>
            ))}
          </ul>
          <p className="font-fanum m-0 mt-2 text-[clamp(12px,1.5vw,14px)] font-medium leading-6 text-black/65 sm:mt-2.5 sm:leading-7">
            {spend.sunNote}
          </p>
        </div>
      </div>
    </div>
  );
}

function MakeupBand({
  makeup,
}: {
  makeup: {
    title: string;
    subtitle: string;
    iran: readonly { label: string; icon: string }[];
    koreaTitle: string;
    korea: readonly string[];
    menaTitle: string;
    mena: readonly string[];
    compare: string;
  };
}) {
  return (
    <div id="products-makeup" className="mx-auto mt-14 w-full max-w-[68rem] lg:mt-20">
      <BandTitle title={makeup.title} lead={makeup.subtitle} accentTitle nowrapTitle />

      {/* Keep one neat row on all widths */}
      <ul className="m-0 mx-auto mt-8 grid max-w-[40rem] list-none grid-cols-5 gap-1.5 p-0 sm:mt-10 sm:max-w-[48rem] sm:gap-3">
        {makeup.iran.map((item, i) => (
          <li key={item.label} className="flex flex-col items-center text-center">
            <span className="font-fanum mb-1.5 text-[10px] font-extrabold text-pink sm:mb-2 sm:text-[12px]">
              {toFaDigits(String(i + 1))}
            </span>
            <MarkDisc src={item.icon} label={item.label} size="sm" className="sm:!size-[4.5rem]" />
            <p className="font-fanum m-0 mt-1.5 max-w-[4.75rem] text-[10px] font-bold leading-4 text-black sm:mt-2.5 sm:max-w-none sm:text-[12px] sm:leading-5">
              {item.label}
            </p>
          </li>
        ))}
      </ul>

      <p className="font-fanum mx-auto mt-8 max-w-[44rem] text-center text-[clamp(12px,1.5vw,14px)] font-medium leading-7 text-black/65 sm:mt-10">
        {makeup.compare}
      </p>

      <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-2">
        <MarketRankChart title={makeup.koreaTitle} items={makeup.korea} />
        <MarketRankChart title={makeup.menaTitle} items={makeup.mena} />
      </div>
    </div>
  );
}

function useInView<T extends HTMLElement>(threshold = 0.22) {
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
      ([entry]) => setOn(Boolean(entry?.isIntersecting)),
      { threshold, rootMargin: "40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, on };
}

function rankBarWidth(index: number, total: number): number {
  if (total <= 1) return 100;
  const floor = 38;
  const span = 100 - floor;
  return Math.round(floor + span * (1 - index / (total - 1)));
}

function MarketRankChart({ title, items }: { title: string; items: readonly string[] }) {
  const { ref, on } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`makeup-market-chart rounded-2xl border border-pink/10 bg-white/70 px-4 py-4 shadow-[0_8px_22px_rgba(166,0,98,0.05)] backdrop-blur-sm sm:px-5 sm:py-5 ${on ? "is-in" : ""}`}
      role="img"
      aria-label={title}
    >
      <h4 className="font-fanum m-0 text-[13px] font-extrabold leading-6 text-pink sm:text-[15px] sm:leading-7">
        {title}
      </h4>
      <ul className="m-0 mt-4 list-none space-y-3 p-0 sm:mt-5 sm:space-y-3.5" dir="rtl">
        {items.map((item, i) => {
          const width = rankBarWidth(i, items.length);
          return (
            <li
              key={item}
              className="makeup-market-row"
              style={{ ["--d" as string]: `${i * 0.08}s`, ["--w" as string]: `${width}%` }}
            >
              <div className="mb-1.5 flex items-start gap-2 sm:mb-2">
                <span className="font-fanum inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-pink/12 text-[10px] font-extrabold text-pink sm:size-6 sm:text-[11px]">
                  {toFaDigits(String(i + 1))}
                </span>
                <span className="font-fanum min-w-0 flex-1 text-[12px] font-bold leading-5 text-black/88 sm:text-[13px] sm:leading-6">
                  {item}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-pink/10 sm:h-2.5" aria-hidden="true">
                <div className="makeup-market-bar h-full rounded-full bg-gradient-to-l from-[#ec078d] to-[#ff6bcb]" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PayBand({ pay }: { pay: { title: string; note: string; icon: string; noteIcon: string } }) {
  return (
    <div id="products-pay" className="mx-auto mt-14 w-full max-w-[58rem] lg:mt-20">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#ff4fb8] via-[#ec078d] to-[#7a0048] px-5 py-8 text-center text-white shadow-[0_24px_60px_rgba(236,7,141,0.4)] sm:rounded-[2rem] sm:px-10 sm:py-10">
        <div
          className="pointer-events-none absolute -end-10 -top-10 size-48 rounded-full bg-white/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -start-8 bottom-0 size-40 rounded-full bg-[#a60062]/50 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-[40rem] flex-col items-center gap-4">
          <img
            src={pay.icon}
            alt=""
            width={96}
            height={96}
            className="size-16 object-contain drop-shadow-lg sm:size-20"
            decoding="async"
          />
          <h3 className="font-fanum m-0 text-[clamp(16px,2.4vw,24px)] font-extrabold leading-snug">
            {pay.title}
          </h3>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 rounded-[1.35rem] border border-pink/15 bg-gradient-to-br from-[#fff7fb] via-white to-[#fceaf4] px-4 py-5 shadow-[0_12px_36px_rgba(236,7,141,0.1)] sm:mt-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-6">
        <img
          src={pay.noteIcon}
          alt=""
          width={80}
          height={80}
          className="size-14 shrink-0 object-contain sm:size-16"
          decoding="async"
        />
        <p className="font-fanum m-0 flex-1 text-center text-[clamp(13px,1.7vw,16px)] font-medium leading-7 text-black/85 sm:text-right">
          {pay.note}
        </p>
      </div>
    </div>
  );
}

type BasketRow = {
  label: string;
  icon: "order" | "item" | "count";
  bars: { y1403: number; y1404: number };
  growthValue: string;
  growthKind: "percent" | "text";
};

const BASKET_ICONS = {
  order: "/assets/annual/products/basket/wallet.svg",
  item: "/assets/annual/products/basket/kif.svg",
  count: "/assets/annual/products/basket/bascket.svg",
} as const;

function BasketIcon({ type }: { type: BasketRow["icon"] }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff0f8] to-white shadow-[inset_0_0_0_1px_rgba(236,7,141,0.12)] sm:size-[3.25rem]">
      <img
        src={BASKET_ICONS[type]}
        alt=""
        width={48}
        height={48}
        className="size-9 object-contain sm:size-10"
        decoding="async"
      />
    </div>
  );
}

function BasketBar({
  year,
  widthPct,
  tone,
  delay,
}: {
  year: string;
  widthPct: number;
  tone: "gray" | "pink";
  delay: string;
}) {
  const isPink = tone === "pink";

  return (
    <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-3">
      <span
        className="font-fanum text-[12px] font-semibold text-black/75 sm:text-[13px]"
        style={{ direction: "ltr", unicodeBidi: "isolate" }}
      >
        {year}
      </span>
      <div className="relative h-4 overflow-hidden rounded-full bg-[#efefef] sm:h-[0.92rem]">
        <div
          className={`basket-bar absolute inset-y-0 end-0 rounded-full ${
            isPink
              ? "bg-gradient-to-l from-[#ff4fb8] to-pink shadow-[0_2px_10px_rgba(236,7,141,0.35)]"
              : "bg-[#BFBFBF]"
          }`}
          style={{ width: `${widthPct}%`, animationDelay: delay }}
        />
      </div>
    </div>
  );
}

function BasketGrowthBadge({
  value,
  kind,
  delay,
}: {
  value: string;
  kind: BasketRow["growthKind"];
  delay: string;
}) {
  return (
    <div
      className="basket-growth mx-auto flex w-full max-w-[15rem] shrink-0 flex-col items-center justify-center rounded-[1.15rem] border-2 border-pink/80 bg-white/80 px-4 py-3 text-center shadow-[0_10px_28px_rgba(236,7,141,0.12)] backdrop-blur-sm sm:max-w-[11.5rem] sm:rounded-[1.35rem] sm:px-4 sm:py-3.5 lg:mx-0 lg:w-auto"
      style={{ animationDelay: delay }}
    >
      <p className="font-fanum m-0 flex items-center gap-1.5 text-[13px] font-bold leading-6 text-black sm:text-[14px]">
        <span>رشد</span>
        <svg viewBox="0 0 24 24" className="size-4 text-pink" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 18h16v2H4v-2Zm14.5-8.5-3 3-4-4-5 5-1.5-1.5 6.5-6.5 4 4 3-3 3.5 3.5Z"
          />
        </svg>
      </p>
      {kind === "percent" ? (
        <p
          className="font-fanum m-0 mt-1 text-[clamp(30px,5vw,40px)] font-extrabold leading-none text-pink"
          style={{ direction: "ltr", unicodeBidi: "isolate" }}
        >
          {value}
        </p>
      ) : (
        <p className="font-fanum m-0 mt-1 text-[clamp(11px,1.55vw,13px)] font-bold leading-6 text-pink sm:leading-7">
          {value}
        </p>
      )}
    </div>
  );
}

function BasketDepthRow({ row, index }: { row: BasketRow; index: number }) {
  const baseDelay = `${0.12 + index * 0.14}s`;

  return (
    <article
      className="basket-row overflow-hidden rounded-[1.35rem] border border-pink/12 bg-gradient-to-br from-white via-[#fffafd] to-[#fff0f8] p-4 shadow-[0_12px_36px_rgba(236,7,141,0.08)] sm:rounded-[1.5rem] sm:p-5 lg:p-6"
      style={{ "--d": baseDelay } as CSSProperties}
    >
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] lg:items-center lg:gap-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <BasketIcon type={row.icon} />
          <h4 className="font-fanum m-0 min-w-0 text-[13px] font-bold leading-7 text-black sm:text-[15px] sm:leading-8">
            {row.label}
          </h4>
        </div>

        <div className="relative min-w-0 rounded-xl border border-[#d1d3d4]/70 bg-white/70 px-3 py-3 sm:px-4 sm:py-3.5 lg:border-s-[3px] lg:border-y-0 lg:border-e-0 lg:bg-transparent lg:px-0 lg:py-0 lg:ps-5">
          <div
            className="pointer-events-none absolute inset-y-3 start-0 hidden w-[3px] rounded-full bg-[#d1d3d4] lg:block"
            aria-hidden="true"
          />
          <div className="flex flex-col justify-center gap-3 sm:gap-3.5">
            <BasketBar year="۱۴۰۳" widthPct={row.bars.y1403} tone="gray" delay={`calc(${baseDelay} + 0.08s)`} />
            <BasketBar year="۱۴۰۴" widthPct={row.bars.y1404} tone="pink" delay={`calc(${baseDelay} + 0.16s)`} />
          </div>
        </div>

        <BasketGrowthBadge
          value={row.growthValue}
          kind={row.growthKind}
          delay={`calc(${baseDelay} + 0.22s)`}
        />
      </div>
    </article>
  );
}

function BasketBand({
  basket,
}: {
  basket: {
    title: string;
    lead: string;
    rows: readonly BasketRow[];
  };
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
        } else {
          setActive(false);
        }
      },
      { threshold: 0.15, rootMargin: "40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div id="products-basket" ref={rootRef} className="mx-auto mt-14 w-full max-w-[64rem] lg:mt-20">
      <div className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8">
        <img
          src="/assets/annual/products/pay/bag.svg"
          alt=""
          width={72}
          height={72}
          className="size-12 object-contain sm:size-14"
          decoding="async"
        />
        <BandTitle title={basket.title} lead={basket.lead} />
      </div>

      <div className={`mx-auto w-full max-w-[68rem] space-y-4 sm:space-y-5 ${active ? "basket-in" : ""}`}>
        {basket.rows.map((row, i) => (
          <BasketDepthRow key={row.label} row={row} index={i} />
        ))}
      </div>
    </div>
  );
}
