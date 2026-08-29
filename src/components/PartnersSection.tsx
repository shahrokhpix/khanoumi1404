import { useEffect, useRef, useState } from "react";
import { PARTNERS } from "../content/annual-report";
import { toFaDigits } from "../charts/typography/rtl";
import { ChapterHero } from "./ChapterHero";

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
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
        } else {
          setOn(false);
        }
      },
      { threshold: 0.18, rootMargin: "40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, on };
}

function BrandsGrowthChart({
  brands,
  active,
}: {
  brands: readonly { year: string; count: number }[];
  active: boolean;
}) {
  const W = 520;
  const H = 220;
  const pad = { t: 28, r: 24, b: 36, l: 24 };
  const max = Math.max(...brands.map((b) => b.count), 1);
  const min = Math.min(...brands.map((b) => b.count));
  const floor = Math.max(0, min * 0.82);
  const span = max - floor || 1;
  const xs = brands.map((_, i) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(1, brands.length - 1));
  const ys = brands.map((b) => pad.t + (1 - (b.count - floor) / span) * (H - pad.t - pad.b));
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x} ${ys[i]}`).join(" ");
  const area = `${line} L${xs[xs.length - 1]} ${H - pad.b} L${xs[0]} ${H - pad.b} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`partners-brands-chart mx-auto block h-auto w-full max-w-[34rem] ${active ? "partners-in" : ""}`}
      role="img"
      aria-label="رشد تعداد برندهای فعال"
    >
      <defs>
        <linearGradient id="partners-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EC078D" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#EC078D" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path className="partners-area" d={area} fill="url(#partners-area)" />
      <path
        className="partners-line"
        d={line}
        fill="none"
        stroke="#EC078D"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      {brands.map((b, i) => (
        <g key={b.year} className="partners-point" style={{ ["--d" as string]: `${0.2 + i * 0.12}s` }}>
          <circle cx={xs[i]} cy={ys[i]} r="7" fill="#fff" stroke="#EC078D" strokeWidth="3" />
          <text
            x={xs[i]}
            y={ys[i] - 14}
            textAnchor="middle"
            fill="#EC078D"
            fontSize="15"
            fontWeight="800"
            fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
            style={{ direction: "ltr", unicodeBidi: "isolate" }}
          >
            {toFaDigits(b.count.toLocaleString("en-US"))}
          </text>
          <text
            x={xs[i]}
            y={H - 10}
            textAnchor="middle"
            fill="#1a0612"
            fontSize="13"
            fontWeight="700"
            fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
            style={{ direction: "ltr", unicodeBidi: "isolate" }}
          >
            {b.year}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BrandRankList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <article className="min-w-0 rounded-[1.25rem] border border-pink/12 bg-white/90 px-2 py-4 shadow-[0_12px_32px_rgba(26,6,18,0.07)] backdrop-blur-md sm:rounded-[1.35rem] sm:px-5 sm:py-5">
      <h4 className="font-fanum m-0 text-center text-[11px] font-extrabold leading-snug text-pink sm:text-[15px]">
        {title}
      </h4>
      <ul className="m-0 mt-3 grid list-none grid-cols-5 gap-[clamp(4px,1.2vw,10px)] p-0 sm:mt-4">
        {items.map((name) => (
          <li key={name} className="min-w-0">
            <div className="mx-auto flex aspect-square w-full max-w-[4.75rem] items-center justify-center rounded-full border-[2.5px] border-pink bg-gradient-to-b from-[#fff7fb] to-white p-[0.2rem] text-center shadow-[0_8px_20px_rgba(236,7,141,0.12)] sm:max-w-[5.5rem] sm:p-1">
              <span className="font-fanum text-[clamp(7px,2.1vw,12px)] font-extrabold leading-[1.15] text-pink">
                {name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function PartnersSection() {
  const p = PARTNERS;
  const { ref, on } = useInView<HTMLDivElement>();

  return (
    <section
      id="partners"
      data-reveal
      dir="rtl"
      className="relative scroll-mt-annual overflow-hidden bg-white px-4 py-16 sm:px-10 lg:px-[80px] lg:py-20"
    >
      <div
        className="pointer-events-none absolute start-0 top-24 size-[22rem] rounded-full bg-pink/10 blur-[100px]"
        aria-hidden="true"
      />

      <ChapterHero
        chapter={p.chapter}
        title={p.title}
        image={p.heroImage}
        imageAlt={p.title}
        icon="/assets/annual/partners/fasl-tolid-konandegan.svg"
        iconClassName="size-[clamp(1.75rem,5vw,2.65rem)] shrink-0 object-contain brightness-0 invert drop-shadow-[0_4px_12px_rgba(255,255,255,0.35)]"
      />

      <p className="font-fanum m-0 mt-6 flex items-center justify-center gap-2 text-center text-[clamp(15px,2vw,19px)] font-bold text-black">
        <img
          src="/assets/annual/partners/brand.svg"
          alt=""
          width={28}
          height={28}
          className="size-6 shrink-0 object-contain sm:size-7"
          decoding="async"
        />
        <span>
          {p.brandsNote.before}
          <span className="text-pink">{p.brandsNote.highlight}</span>
          {p.brandsNote.after}
        </span>
      </p>

      <div ref={ref} className="mx-auto mt-8 max-w-[40rem] sm:mt-10" dir="ltr">
        <BrandsGrowthChart brands={p.brands} active={on} />
      </div>

      <ul dir="ltr" className="mx-auto mt-6 grid max-w-[40rem] list-none grid-cols-3 gap-2 p-0 sm:gap-4">
        {p.brands.map((b) => (
          <li
            key={b.year}
            className="rounded-2xl border border-pink/12 bg-gradient-to-b from-[#fff7fb] to-white px-2 py-3 text-center shadow-[0_8px_22px_rgba(166,0,98,0.06)] sm:px-3 sm:py-4"
          >
            <p
              className="font-fanum m-0 text-[11px] font-bold text-black/55 sm:text-[13px]"
              style={{ direction: "ltr", unicodeBidi: "isolate" }}
            >
              {b.year}
            </p>
            <p className="font-fanum m-0 mt-1 text-[clamp(16px,3vw,24px)] font-extrabold text-pink">
              {toFaDigits(b.count.toLocaleString("en-US"))}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="font-fanum mx-auto m-0 mt-14 max-w-[44rem] text-center text-[clamp(15px,2.2vw,22px)] font-extrabold leading-snug text-black sm:mt-16">
        {p.local.title}
      </h3>
      <div className="mx-auto mt-6 grid max-w-[68rem] grid-cols-1 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-2">
        <BrandRankList title={p.local.careTitle} items={p.local.care} />
        <BrandRankList title={p.local.makeupTitle} items={p.local.makeup} />
      </div>

      <article className="glass-panel relative mx-auto mt-14 max-w-[68rem] overflow-hidden rounded-[1.75rem] p-5 sm:mt-16 sm:rounded-[2rem] sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-pink/20 blur-[80px]"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-5 sm:text-right">
          <img
            src="/assets/annual/partners/beauty-ads-logo.svg"
            alt=""
            width={88}
            height={88}
            className="size-16 shrink-0 object-contain sm:size-20"
            decoding="async"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-fanum m-0 text-[clamp(18px,2.4vw,26px)] font-extrabold text-pink">
              {p.ads.title}
            </h3>
            <p className="font-fanum m-0 mt-3 text-[clamp(13px,1.7vw,16px)] font-medium leading-8 text-black/80">
              {p.ads.body}
            </p>
            <p className="font-fanum m-0 mt-4 text-[clamp(14px,1.9vw,18px)] font-extrabold text-black">
              {p.ads.engine}
            </p>
          </div>
        </div>

        <div className="relative mt-8 grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:gap-5">
          <div className="rounded-[1.35rem] bg-gradient-to-br from-[#ff4fb8] via-[#ec078d] to-[#7a0048] px-5 py-6 text-white shadow-[0_18px_44px_rgba(236,7,141,0.35)] sm:px-7 sm:py-7">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <img
                src="/assets/annual/partners/roi.svg"
                alt=""
                width={48}
                height={48}
                className="size-10 brightness-0 invert sm:size-12"
                decoding="async"
              />
              <p className="font-fanum m-0 text-[clamp(14px,1.9vw,18px)] font-extrabold leading-snug sm:leading-7">
                {p.ads.roi}
              </p>
            </div>
            <p className="font-fanum m-0 mt-4 text-center text-[clamp(12px,1.6vw,15px)] font-medium leading-7 text-white/90 sm:text-right">
              {p.ads.spend}
            </p>
          </div>

          <div className="grid gap-3">
            {p.ads.stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col rounded-[1.25rem] border border-pink/12 bg-white/90 px-4 py-4 text-center shadow-[0_10px_28px_rgba(166,0,98,0.08)] sm:px-5 sm:py-5 sm:text-right"
              >
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                  <img
                    src={s.icon}
                    alt=""
                    width={44}
                    height={44}
                    className="size-10 shrink-0 object-contain sm:size-11"
                    decoding="async"
                  />
                  <div className="min-w-0">
                    <p className="font-fanum m-0 text-[clamp(20px,2.8vw,26px)] font-extrabold leading-none text-pink">
                      {s.value}
                    </p>
                    <p className="font-fanum m-0 mt-1.5 text-[11px] font-bold text-black/75 sm:text-[13px]">
                      {s.label}
                    </p>
                  </div>
                </div>
                <p className="font-fanum m-0 mt-3 text-[clamp(11px,1.45vw,13px)] font-medium leading-6 text-black/80 sm:mt-4 sm:leading-7">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
