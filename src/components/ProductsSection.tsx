import { useEffect, useRef, useState } from "react";
import { PRODUCTS } from "../content/annual-report";
import { donutSlice, polar } from "../charts/geometry/wedge";
import { toFaDigits } from "../charts/typography/rtl";

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
  const xs = points.map((_, i) => padX + (i * (w - padX * 2)) / Math.max(1, points.length - 1));
  const ys = points.map((p) => {
    const t = (p.value - 72) / 6;
    return h - padY - t * (h - padY * 2);
  });
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x} ${ys[i]}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto mt-1 h-auto w-[min(100%,14rem)]" aria-hidden="true">
      <path
        className="care-trend-line"
        d={d}
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      {xs.map((x, i) => (
        <g key={points[i].year} className="care-trend-point" style={{ ["--d" as string]: `${0.25 + i * 0.12}s` }}>
          <circle cx={x} cy={ys[i]} r="4.2" fill="#fff" />
          <text
            x={x}
            y={ys[i] - 10}
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
            y={h - 2}
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
  size = "md",
  tone = "#EC078D",
  className = "",
}: {
  src: string;
  label?: string;
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
    size === "sm"
      ? "size-[1.55rem]"
      : size === "lg"
        ? "size-[2.75rem] sm:size-[3rem]"
        : size === "title"
          ? "size-5 sm:size-6 lg:size-7"
          : "size-[2.55rem] sm:size-[3rem]";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_10px_24px_rgba(236,7,141,0.28)] ${box} ${className}`}
      style={{ background: tone }}
      aria-hidden={label ? undefined : true}
      title={label}
    >
      <img
        src={src}
        alt=""
        width={64}
        height={64}
        className={`${mark} object-contain brightness-0 invert`}
        decoding="async"
      />
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
  const isGold = Boolean(single);
  return (
    <article className="group relative flex w-full min-w-0 max-w-[10.75rem] flex-col items-center pt-[2.375rem] sm:max-w-[12.5rem] sm:pt-[2.625rem]">
      <div
        className="pointer-events-none absolute top-1 size-20 rounded-full bg-pink/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:size-24"
        aria-hidden="true"
      />
      <MarkDisc
        src={icon}
        label={label}
        size="lg"
        tone={isGold ? "#c9a227" : "#EC078D"}
        className="absolute top-0 z-[2] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.03]"
      />
      <div
        className={`relative z-0 flex h-[11rem] w-full min-w-0 flex-col overflow-hidden rounded-[1.15rem] border px-2.5 pb-3 pt-12 backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1 sm:h-[12rem] sm:rounded-[1.3rem] sm:px-3.5 sm:pt-14 ${
          isGold
            ? "border-[#e8c76a]/60 bg-gradient-to-b from-[#fff9eb] to-white shadow-[0_12px_30px_rgba(200,150,40,0.16)] group-hover:shadow-[0_18px_38px_rgba(200,150,40,0.23)]"
            : "border-pink/12 bg-white/90 shadow-[0_10px_28px_rgba(26,6,18,0.07)] group-hover:border-pink/30 group-hover:shadow-[0_16px_36px_rgba(236,7,141,0.14)]"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-pink/50 to-transparent"
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          {single ? (
            <>
              <p className="font-fanum m-0 bg-gradient-to-l from-[#b8860b] via-[#ec078d] to-[#a60062] bg-clip-text text-[clamp(22px,3vw,28px)] font-black leading-none text-transparent">
                {formatPct(single.value)}
              </p>
              <p
                className="font-fanum m-0 mt-2 text-[13px] font-bold text-black"
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
      <div className="mb-5 flex justify-center">
        <span className="font-fanum rounded-full border border-pink/20 bg-white/70 px-4 py-1 text-[12px] font-bold text-pink shadow-sm backdrop-blur">
          فصل ۰۶
        </span>
      </div>
      <h2
        className="font-fanum m-0 flex flex-wrap items-center justify-center gap-2 text-center text-[clamp(18px,2.6vw,28px)] font-black leading-[1.65] text-transparent lg:gap-3"
        style={{
          backgroundImage: "linear-gradient(120deg,#a60062,#ec078d,#ff6bcb)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
        }}
      >
        {p.title}
        <img
          src={p.icon}
          alt=""
          width={48}
          height={48}
          className="size-8 shrink-0 object-contain sm:size-10 lg:size-11"
        />
      </h2>

      <h3 className="font-fanum m-0 mt-5 text-center text-[19px] font-bold leading-[34px] text-black">
        {mix.lead}
      </h3>
      <p className="font-fanum m-0 mt-1 text-center text-[clamp(12px,1.5vw,15px)] font-medium text-black/65">
        {mix.caption}
      </p>

      <div
        dir="ltr"
        className="mx-auto mt-9 grid w-full max-w-[1040px] grid-cols-2 items-start gap-x-3 gap-y-7 sm:mt-11 sm:gap-x-5 sm:gap-y-8 xl:grid-cols-[minmax(0,1fr)_minmax(14rem,17rem)_minmax(0,1fr)] xl:grid-rows-[auto_auto_auto] xl:gap-x-6 xl:gap-y-5"
      >
        <div className="flex w-full justify-center xl:col-start-1 xl:row-start-1 xl:justify-end">
          <CategoryCard label={mix.categories.makeup.label} icon={mix.categories.makeup.icon} values={mix.categories.makeup.values} />
        </div>
        <div className="flex w-full justify-center xl:col-start-3 xl:row-start-1 xl:justify-start">
          <CategoryCard label={mix.categories.hygiene.label} icon={mix.categories.hygiene.icon} values={mix.categories.hygiene.values} />
        </div>

        <div className="col-span-2 flex min-w-0 justify-center xl:col-span-1 xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:self-center">
          <div className="relative flex aspect-square w-full max-w-[15.5rem] items-center justify-center sm:max-w-[17rem]">
            <div
              className="care-orbit pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ec078d,#ff6bcb,#a60062,#ec078d)] opacity-70 blur-[2px] sm:inset-[-12%]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-[-4%] rounded-full bg-pink/40 blur-3xl sm:inset-[-18%]"
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
        slices={mix.weightSlices}
      />

      <SkinBand skin={p.skin} />
      <SpendBand spend={p.spend} />
      <MakeupBand makeup={p.makeup} />
      <PayBand pay={p.pay} />
      <BasketBand basket={p.basket} />
    </section>
  );
}

type WeightSlice = {
  id: string;
  label: string;
  shortLabel?: string;
  value: number;
  color: string;
  rim: string;
  iconTone: "white" | "pink";
  icon: string;
};

function WeightMarketBand({
  title,
  year,
  highlight,
  mid,
  care,
  tail,
  slices,
}: {
  title: string;
  year: string;
  highlight: string;
  mid: string;
  care: string;
  tail: string;
  slices: readonly WeightSlice[];
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
          io.disconnect();
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

      <div className={`mx-auto mt-8 w-full max-w-[68rem] sm:mt-10 ${active ? "weight-in" : ""}`}>
        <WeightRing year={year} slices={slices} highlight={highlight} careWord={care} />
      </div>
    </div>
  );
}

function WeightRing({
  year,
  slices,
  highlight,
  careWord,
}: {
  year: string;
  slices: readonly WeightSlice[];
  highlight: string;
  careWord: string;
}) {
  /**
   * Non-square viewBox (1100 × 900): more horizontal room so the three top-small
   * slices (gold / electric / perfume) land at clearly different y-rows.
   * Ring is shifted slightly down so the callout text above doesn't collide.
   *
   * Leader anatomy (matches reference PNG):
   *   rim (on slice midpoint) → stub (radial out 18px) → elbow (at seat radius) → tip (further out)
   * Text block at tip: name (bold grey) → % (same style, one line below).
   */
  const W = 1100;
  const H = 900;
  const cx = W / 2;          // 550
  const cy = H / 2 + 28;    // 478 — ring center shifted down
  const rOut = 272;
  const rRim = 248;
  const rIn  = 132;
  const rIcon = (rRim + rIn) / 2;   // 190 — midpoint of pale band
  const rStub  = rOut + 20;         // 292 — exit stub (radial)
  const rElbow = rOut + 66;         // 338 — arc to seat angle
  const rTip   = rOut + 112;        // 384 — end of bar / text anchor
  const TEXT_PAD = 12;              // pixels beyond tip before text starts

  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;

  /**
   * Fixed seats — visually match reference PNG.
   * Each ~55-70° apart so leader bars never cross.
   * Angles in degrees, 0° = east (right), CCW positive (SVG y-down).
   */
  const SEAT: Record<string, number> = {
    gold:    56,   // top-right
    electric: 96,  // top-center (slightly left of 12 o'clock)
    perfume: 148,  // upper-left
    makeup:  210,  // left-center
    care:    317,  // bottom-right (largest slice)
  };

  let cursor = 90; // start at 12 o'clock going clockwise
  const built = slices.map((slice, idx) => {
    const sweep = (slice.value / total) * 360;
    const start = cursor;
    const end   = cursor - sweep;
    const mid   = start - sweep / 2;
    cursor = end;

    const seat = SEAT[slice.id] ?? mid;

    // Icon box: care gets full-sized, tiny slices get minimum readable size
    const iconBox =
      slice.id === "care" ? 60 : Math.min(50, Math.max(26, sweep * 1.05 + 14));

    const rimPt   = polar(cx, cy, rOut,   mid);
    const stubPt  = polar(cx, cy, rStub,  mid);
    const elbowPt = polar(cx, cy, rElbow, seat);
    const tipPt   = polar(cx, cy, rTip,   seat);

    // Leader stays fully outside the ring (rim→stub radial, then arc to elbow, then to tip)
    const leader =
      `M${rimPt.x.toFixed(1)} ${rimPt.y.toFixed(1)} ` +
      `L${stubPt.x.toFixed(1)} ${stubPt.y.toFixed(1)} ` +
      `L${elbowPt.x.toFixed(1)} ${elbowPt.y.toFixed(1)} ` +
      `L${tipPt.x.toFixed(1)} ${tipPt.y.toFixed(1)}`;

    return {
      slice,
      fillPath: donutSlice(cx, cy, rRim, rIn,  start, end),
      rimPath:  donutSlice(cx, cy, rOut, rRim, start, end),
      iconPt:   polar(cx, cy, rIcon, mid),
      iconBox,
      tipPt,
      leader,
      delay: `${0.06 + idx * 0.09}s`,
    };
  });

  return (
    <div className="relative mx-auto w-full">
      {/* Callout above chart — «۷۷ درصد مراقبتی» — sits above SVG in flow */}
      <div className="weight-callout mb-2 flex flex-col items-center text-center">
        <p className="font-fanum m-0 text-[clamp(28px,3.6vw,36px)] font-extrabold leading-none tracking-tight text-pink">
          {highlight}
        </p>
        <p className="font-fanum m-0 mt-1.5 text-[clamp(17px,2.3vw,22px)] font-bold leading-none text-pink">
          {careWord}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto block h-auto w-full max-w-[68rem]"
        role="img"
        aria-label={`وزن بازار ${year}`}
      >
        <defs>
          {/* Pink glow on the ring */}
          <filter id="weight-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#ec078d" floodOpacity="0.2" />
          </filter>
          {/* Recolor white Illustrator marks → brand pink (for light slices) */}
          <filter id="weight-mark-pink" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.925   0 0 0 0 0.027   0 0 0 0 0.553   0 0 0 1 0"
            />
          </filter>
        </defs>

        {/* ── Donut slices ── */}
        <g className="weight-ring" filter="url(#weight-soft)">
          {built.map(({ slice, fillPath, delay }) => (
            <path
              key={`${slice.id}-f`}
              className="weight-slice"
              d={fillPath}
              fill={slice.color}
              stroke="#fff"
              strokeWidth="2.5"
              style={{ ["--d" as string]: delay }}
            />
          ))}
          {built.map(({ slice, rimPath, delay }) => (
            <path
              key={`${slice.id}-r`}
              className="weight-slice"
              d={rimPath}
              fill={slice.rim}
              stroke="#fff"
              strokeWidth="1"
              style={{ ["--d" as string]: delay }}
            />
          ))}
        </g>

        {/* ── White center hole ── */}
        <circle cx={cx} cy={cy} r={rIn} fill="#ffffff" className="weight-core" />

        {/* ── Year ── */}
        <text
          x={cx} y={cy}
          textAnchor="middle" dominantBaseline="middle"
          className="weight-year"
          fill="#a60062" fontSize="68" fontWeight="700"
          fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
          style={{ direction: "ltr", unicodeBidi: "isolate" }}
        >
          {year}
        </text>

        {/* ── Icons + Leaders + Labels ── */}
        {built.map(({ slice, iconPt, iconBox, tipPt, leader, delay }) => {
          const isLeft   = tipPt.x < cx - 30;
          const isRight  = tipPt.x > cx + 30;
          const isTop    = tipPt.y < cy - 50;
          const isBottom = tipPt.y > cy + 50;

          const anchor = isLeft ? "end" : isRight ? "start" : "middle";
          // Push text away from tip dot
          const tx = tipPt.x + (isLeft ? -TEXT_PAD : isRight ? TEXT_PAD : 0);
          // name sits above tip baseline, % below — enough gap for two 22px lines
          const nameY = tipPt.y + (isTop ? -8 : isBottom ? -6 : -12);
          const pctY  = tipPt.y + (isTop ?  20 : isBottom ?  22 :  18);

          return (
            <g key={slice.id} className="weight-call" style={{ ["--d" as string]: delay }}>
              {/* Grey leader bar — exactly matches reference */}
              <path
                className="weight-leader"
                d={leader}
                fill="none"
                stroke="#c2b2bb"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="320"
              />
              {/* Tiny dot at tip */}
              <circle cx={tipPt.x} cy={tipPt.y} r="2.8" fill="#c2b2bb" />

              {/* Icon inside the band — white on dark, pink on light */}
              <image
                href={slice.icon}
                x={iconPt.x - iconBox / 2}
                y={iconPt.y - iconBox / 2}
                width={iconBox}
                height={iconBox}
                filter={slice.iconTone === "pink" ? "url(#weight-mark-pink)" : undefined}
                className="weight-badge"
              />

              {/* Label: name first, % below (matches reference) */}
              <text
                x={tx} y={nameY}
                textAnchor={anchor} dominantBaseline="middle"
                className="weight-label"
                fill="#4a4240" fontSize="21" fontWeight="700"
                fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
                direction="rtl"
              >
                {slice.label}
              </text>
              <text
                x={tx} y={pctY}
                textAnchor={anchor} dominantBaseline="middle"
                className="weight-pct"
                fill="#4a4240" fontSize="20" fontWeight="600"
                fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
                style={{ direction: "ltr", unicodeBidi: "isolate" }}
              >
                {formatPct(slice.value)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── پوست / هزینه‌کرد / آرایشی — skill-guided polish ─── */

function BandTitle({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mx-auto max-w-[40rem] text-center">
      <h3 className="font-fanum m-0 text-[clamp(16px,2.2vw,19px)] font-bold leading-8 text-black">
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

function pieSlice(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  let sweep = startDeg - endDeg;
  while (sweep < 0) sweep += 360;
  while (sweep >= 360) sweep -= 360;
  const large = sweep > 180 ? 1 : 0;
  const a = polar(cx, cy, r, startDeg);
  const b = polar(cx, cy, r, endDeg);
  return `M${cx} ${cy} L${a.x.toFixed(2)} ${a.y.toFixed(2)} A${r} ${r} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)} Z`;
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
  const skinSweep = (share / 100) * 360;
  const start = 90;
  const midEnd = start - skinSweep;
  const skinPath = pieSlice(cx, cy, rOut, start, midEnd);
  const restPath = pieSlice(cx, cy, rOut, midEnd, start - 360);
  const midDeg = start - skinSweep / 2;
  const pctPt = polar(cx, cy, share >= 28 ? rOut * 0.52 : rOut * 0.38, midDeg);

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
        <text
          x={pctPt.x}
          y={pctPt.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={share >= 22 ? "#ffffff" : "#a60062"}
          fontSize="22"
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
          io.disconnect();
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
      <BandTitle title={skin.title} lead={skin.insight} />

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
          مراقبت پوست
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#efe4ea]" aria-hidden="true" />
          سایر بازار زیبایی
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
    items: readonly { rank: string; title: string; text: string; icon: string }[];
    footnote: string;
    sunIcon: string;
    sun: string;
    sunNote: string;
  };
}) {
  return (
    <div id="products-spend" className="mx-auto mt-14 w-full max-w-[68rem] lg:mt-20">
      <BandTitle title={spend.title} />

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
          <p className="font-fanum m-0 text-[clamp(13px,1.7vw,16px)] font-bold leading-7 text-black sm:leading-8">
            {spend.sun}
          </p>
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
      <BandTitle title={makeup.title} lead={makeup.subtitle} />

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

      <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-2">
        <MarketList title={makeup.koreaTitle} items={makeup.korea} />
        <MarketList title={makeup.menaTitle} items={makeup.mena} />
      </div>

      <p className="font-fanum mx-auto mt-6 max-w-[44rem] border-t border-pink/15 pt-5 text-center text-[clamp(12px,1.5vw,14px)] font-medium leading-7 text-black/65 sm:mt-8">
        {makeup.compare}
      </p>
    </div>
  );
}

function MarketList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-2xl border border-pink/10 bg-white/70 px-4 py-4 shadow-[0_8px_22px_rgba(166,0,98,0.05)] backdrop-blur-sm sm:px-5 sm:py-5">
      <h4 className="font-fanum m-0 text-[13px] font-extrabold leading-6 text-pink sm:text-[15px] sm:leading-7">
        {title}
      </h4>
      <ol className="m-0 mt-3 list-none space-y-2 p-0 sm:mt-3.5 sm:space-y-2.5">
        {items.map((item, i) => (
          <li key={item} className="flex items-start gap-2">
            <span className="font-fanum mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-pink/10 text-[10px] font-extrabold text-pink sm:size-6 sm:text-[11px]">
              {toFaDigits(String(i + 1))}
            </span>
            <span className="font-fanum text-[12px] font-medium leading-5 text-black/85 sm:text-[13px] sm:leading-6">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PayBand({ pay }: { pay: { title: string; note: string } }) {
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
            src="/assets/annual/products/pay/wallet.svg"
            alt=""
            width={96}
            height={96}
            className="size-16 object-contain drop-shadow-lg brightness-0 invert sm:size-20"
            decoding="async"
          />
          <h3 className="font-fanum m-0 text-[clamp(16px,2.4vw,24px)] font-extrabold leading-snug">
            {pay.title}
          </h3>
          <p className="font-fanum m-0 text-[clamp(13px,1.7vw,16px)] font-medium leading-7 text-white/90">
            {pay.note}
          </p>
        </div>
      </div>
    </div>
  );
}

function BasketBand({
  basket,
}: {
  basket: {
    title: string;
    lead: string;
    rows: readonly { label: string; growth: string }[];
  };
}) {
  return (
    <div id="products-basket" className="mx-auto mt-14 w-full max-w-[64rem] lg:mt-20">
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

      <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0 sm:gap-4">
        {basket.rows.map((row, i) => (
          <li
            key={row.label}
            className="group relative min-w-0 overflow-hidden rounded-[1.1rem] border border-pink/12 bg-white/90 px-2 py-3.5 text-center shadow-[0_12px_32px_rgba(26,6,18,0.07)] backdrop-blur-md transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(236,7,141,0.14)] sm:rounded-[1.35rem] sm:px-5 sm:py-6"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-pink/50 to-transparent"
              aria-hidden="true"
            />
            <p className="font-fanum m-0 text-[9px] font-bold leading-4 text-black/70 sm:text-[13px] sm:leading-6">
              {row.label}
            </p>
            <p className="font-fanum m-0 mt-2 text-[clamp(11px,2.6vw,18px)] font-extrabold leading-snug text-pink sm:mt-3">
              {row.growth}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
