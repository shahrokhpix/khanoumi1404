import { useEffect, useRef, useState } from "react";
import { OPS } from "../content/annual-report";
import { toFaDigits } from "../charts/typography/rtl";

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

function ReturnsSpark({ active }: { active: boolean }) {
  const rows = [
    { year: "۱۴۰۲", rate: 0.15 },
    { year: "۱۴۰۳", rate: 0.092 },
    { year: "۱۴۰۴", rate: 0.072 },
  ];
  const W = 420;
  const H = 160;
  const pad = { t: 24, r: 20, b: 32, l: 20 };
  const max = 0.18;
  const xs = rows.map((_, i) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(1, rows.length - 1));
  const ys = rows.map((r) => pad.t + (1 - r.rate / max) * (H - pad.t - pad.b));
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x} ${ys[i]}`).join(" ");
  const axisY = H - pad.b;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`ops-chart mx-auto block h-auto w-full max-w-[26rem] ${active ? "ops-in" : ""}`}
      role="img"
      aria-label="نرخ مرجوعی کالا"
    >
      <line
        x1={pad.l}
        y1={axisY}
        x2={W - pad.r}
        y2={axisY}
        stroke="#d1d3d4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="ops-line"
        d={line}
        fill="none"
        stroke="#EC078D"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      {rows.map((r, i) => (
        <g key={r.year} className="ops-point" style={{ ["--d" as string]: `${0.18 + i * 0.12}s` }}>
          <circle cx={xs[i]} cy={ys[i]} r="6.5" fill="#fff" stroke="#EC078D" strokeWidth="2.8" />
          <text
            x={xs[i]}
            y={ys[i] - 12}
            textAnchor="middle"
            fill="#EC078D"
            fontSize="13"
            fontWeight="800"
            fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
            style={{ direction: "ltr", unicodeBidi: "isolate" }}
          >
            {toFaDigits(String(r.rate))}٪
          </text>
          <text
            x={xs[i]}
            y={H - 8}
            textAnchor="middle"
            fill="#1a0612"
            fontSize="12"
            fontWeight="700"
            fontFamily="IRANSansXFaNum, IRANSans, Tahoma, sans-serif"
            style={{ direction: "ltr", unicodeBidi: "isolate" }}
          >
            {r.year}
          </text>
        </g>
      ))}
    </svg>
  );
}

function OtdCompare({ active }: { active: boolean }) {
  const rows = [
    { year: "۱۴۰۳", value: 92 },
    { year: "۱۴۰۴", value: 95 },
  ];
  const max = 100;

  return (
    <div className={`mx-auto mt-6 grid max-w-[28rem] grid-cols-2 gap-4 ${active ? "ops-in" : ""}`} dir="ltr">
      {rows.map((r, i) => {
        const h = Math.max(12, Math.round((r.value / max) * 120));
        return (
          <div key={r.year} className="flex flex-col items-center gap-2">
            <span className="font-fanum text-[18px] font-extrabold text-pink sm:text-[22px]">
              {toFaDigits(String(r.value))}٪
            </span>
            <div className="flex h-[7.5rem] w-full items-end justify-center">
              <div
                className="ops-bar w-12 rounded-t-lg sm:w-14"
                style={{
                  height: h,
                  background: i === 1 ? "#EC078D" : "#f6a8d0",
                  ["--d" as string]: `${0.1 + i * 0.12}s`,
                }}
              />
            </div>
            <span
              className="font-fanum text-[13px] font-bold text-black"
              style={{ direction: "ltr", unicodeBidi: "isolate" }}
            >
              {r.year}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function OpsSection() {
  const o = OPS;
  const returns = useInView<HTMLDivElement>();
  const otd = useInView<HTMLDivElement>();

  return (
    <section
      id="ops"
      data-reveal
      dir="rtl"
      className="section-band-mist relative scroll-mt-annual overflow-hidden px-4 py-16 sm:px-10 lg:px-[80px] lg:py-20"
    >
      <div className="mb-5 flex justify-center">
        <span className="font-fanum rounded-full border border-pink/20 bg-white/70 px-4 py-1 text-[12px] font-bold text-pink shadow-sm backdrop-blur">
          فصل ۵
        </span>
      </div>
      <h2 className="font-fanum mx-auto m-0 flex w-fit max-w-full items-center justify-center gap-2 rounded-[28px] bg-gradient-to-l from-[#ec078d] to-[#a60062] px-[clamp(16px,4vw,40px)] py-[clamp(10px,1.5vw,18px)] text-center text-[clamp(13px,2.1vw,25px)] font-extrabold leading-[1.7] text-white shadow-[0_14px_36px_rgba(236,7,141,0.35)] lg:gap-3">
        <img
          src="/assets/annual/ops/amaliat-poshtibani.svg"
          alt=""
          width={42}
          height={42}
          className="size-7 shrink-0 brightness-0 invert sm:size-8 lg:size-[42px]"
        />
        {o.title}
      </h2>

      {/* Waiting / processing */}
      <div className="mx-auto mt-10 max-w-[64rem] sm:mt-12">
        <h3 className="font-fanum m-0 text-center text-[clamp(16px,2.2vw,22px)] font-extrabold text-pink">
          {o.waiting.title}
        </h3>
        <p className="font-fanum m-0 mt-3 text-center text-[clamp(14px,1.8vw,18px)] font-bold text-black">
          {o.waiting.lead}
        </p>

        <div className="relative mx-auto mt-8 w-full max-w-[22rem] sm:mt-10 sm:max-w-[28rem]" aria-label={`${o.waiting.stats[0].label}: ${o.waiting.stats[0].value}`}>
          <img
            src="/assets/annual/misc/processing-center.svg"
            alt=""
            width={1080}
            height={1080}
            className="mx-auto block h-auto w-full drop-shadow-[0_18px_40px_rgba(236,7,141,0.2)]"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-x-[18%] top-[48%] flex flex-col items-center text-center sm:top-[50%]">
            <p className="font-fanum m-0 text-[11px] font-medium text-black/60 sm:text-[13px]">
              {o.waiting.stats[0].label}
            </p>
            <p className="font-fanum m-0 mt-1.5 text-[clamp(22px,6vw,36px)] font-black leading-none text-pink">
              {o.waiting.stats[0].value}
            </p>
          </div>
        </div>

        <p className="font-fanum mx-auto mt-8 max-w-[40rem] rounded-2xl border border-pink/20 bg-white/80 px-4 py-4 text-center text-[clamp(13px,1.7vw,16px)] font-bold leading-7 text-black sm:mt-10">
          {o.waiting.minute}
        </p>
        <p className="font-fanum mx-auto mt-4 flex max-w-[44rem] items-center justify-center gap-2 rounded-2xl border border-pink bg-gradient-to-l from-[#fff7fb] to-white px-4 py-4 text-center text-[clamp(12px,1.6vw,15px)] font-bold leading-7 text-pink sm:gap-3 sm:px-6">
          <img
            src="/assets/annual/ops/location.svg"
            alt=""
            width={28}
            height={28}
            className="size-6 shrink-0 object-contain sm:size-7"
            decoding="async"
          />
          <span>{o.waiting.far}</span>
        </p>
      </div>

      {/* Shipping */}
      <div className="mx-auto mt-14 max-w-[64rem] sm:mt-16">
        <h3 className="font-fanum m-0 text-center text-[clamp(16px,2.2vw,22px)] font-extrabold text-pink">
          {o.shipping.title}
        </h3>

        <div ref={returns.ref} className="mt-8 rounded-[1.5rem] border border-pink/12 bg-white/90 px-4 py-6 shadow-[0_12px_32px_rgba(26,6,18,0.06)] sm:px-8 sm:py-8">
          <p className="font-fanum m-0 text-center text-[15px] font-extrabold text-black sm:text-[17px]">
            {o.shipping.returnsTitle}
          </p>
          <p className="font-fanum m-0 mt-2 text-center text-[13px] font-medium text-black/60 sm:text-[14px]">
            {o.shipping.returnsNote}
          </p>
          <div className="mt-5">
            <ReturnsSpark active={returns.on} />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 rounded-[1.5rem] bg-gradient-to-br from-[#ff4fb8] via-[#ec078d] to-[#7a0048] px-5 py-7 text-center text-white shadow-[0_20px_48px_rgba(236,7,141,0.35)] sm:mt-8 sm:px-8">
          <img
            src="/assets/annual/ops/ganje.svg"
            alt=""
            width={96}
            height={96}
            className="size-[4.5rem] object-contain drop-shadow-md sm:size-20"
            decoding="async"
          />
          <p className="font-fanum m-0 text-[clamp(14px,2vw,18px)] font-extrabold leading-snug">
            {o.shipping.locker}
          </p>
          <div className="font-fanum flex flex-col gap-1 text-[clamp(12px,1.6vw,15px)] font-medium leading-snug text-white/90">
            {o.shipping.lockerStats.map((line) => (
              <p key={line} className="m-0">
                {line}
              </p>
            ))}
          </div>
        </div>

        <div
          ref={otd.ref}
          className="mt-6 rounded-[1.5rem] border border-pink/12 bg-white/90 px-4 py-6 shadow-[0_12px_32px_rgba(26,6,18,0.06)] sm:mt-8 sm:px-8 sm:py-8"
        >
          <p className="font-fanum m-0 text-center text-[15px] font-extrabold text-black sm:text-[17px]">
            {o.shipping.otdTitle}
          </p>
          <p className="font-fanum m-0 mt-2 text-center text-[13px] font-medium text-black/60 sm:text-[14px]">
            {o.shipping.otdNote}
          </p>
          <OtdCompare active={otd.on} />
        </div>
      </div>

      {/* War CTA */}
      <div className="mx-auto mt-14 max-w-[52rem] overflow-hidden rounded-[1.75rem] border-2 border-pink bg-gradient-to-b from-[#fff7fb] to-white px-5 py-8 text-center shadow-[0_18px_44px_rgba(236,7,141,0.14)] sm:mt-16 sm:rounded-[2rem] sm:px-10 sm:py-10">
        <p className="font-fanum m-0 text-[clamp(15px,2.2vw,22px)] font-extrabold leading-snug text-black">
          {o.special.title}
        </p>
        <a
          href={o.special.href}
          className="font-fanum mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-l from-[#ec078d] to-[#a60062] px-6 py-3 text-[14px] font-bold text-white shadow-[0_12px_28px_rgba(236,7,141,0.35)] transition-transform duration-200 hover:-translate-y-0.5 sm:text-[15px]"
        >
          {o.special.cta}
        </a>
      </div>
    </section>
  );
}
