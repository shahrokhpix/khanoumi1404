import type { ReactNode, SVGProps } from "react";
import {
  ANNUAL_FOOTER,
  ANNUAL_HERO,
  ANNUAL_NAV,
  CSR,
  GLANCE,
  OPS,
  PARTNERS,
  PATH,
  PRODUCTS,
  USERS,
} from "../content/annual-report";
import { PhotoFigure } from "./Media";
import {
  AgeChart,
  BrandsChart,
  CategoryShareChart,
  GenderChart,
  GeoChart,
  MarketWeightChart,
  OtdChart,
  ReturnsChart,
  SkinShareChart,
} from "./AnnualCharts";

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 md:py-24 mx-auto max-w-6xl px-4 ${className}`}>
      {children}
    </section>
  );
}

function Icon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex size-14 items-center justify-center rounded-full border-2 border-pink text-pink ${className}`}>
      {children}
    </span>
  );
}

function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...props} />
  );
}

export function AnnualHero() {
  return (
    <div id="start" className="scroll-mt-24">
      <div className="relative min-h-[72vh] overflow-hidden bg-[#f3e6dc]">
        <img
          src="/assets/annual/wall.jpg"
          alt="نمای شهری دیوارنوشته؛ آغاز گزارش سال خانومی"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-between px-4 py-16 md:px-8 md:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="text-right">
              <h1 className="text-3xl font-extrabold leading-tight text-pink md:text-5xl">{ANNUAL_HERO.kicker}</h1>
              <p className="mt-3 text-xl font-medium text-pink md:text-3xl">{ANNUAL_HERO.title}</p>
            </div>
            <a
              href="/war"
              className="inline-flex max-w-xl rounded-full bg-pink px-5 py-3 text-sm font-bold text-white md:text-base"
            >
              همراه با گزارش ویژه «۲ جنگ و یک اینترنت خاموش»
            </a>
          </div>
          <a
            href="#preface"
            className="mt-10 inline-flex w-fit rounded-2xl bg-pink px-10 py-4 text-xl font-extrabold text-white"
          >
            {ANNUAL_HERO.cta}
          </a>
        </div>
      </div>
      <nav
        aria-label="بخش‌های گزارش"
        className="mx-4 -mt-5 flex items-center justify-between gap-2 overflow-x-auto rounded-full border border-line bg-white px-3 py-2 shadow-md md:mx-10"
      >
        {ANNUAL_NAV.filter((item) => item.id !== "preface").map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`shrink-0 rounded-full px-3 py-2 text-xs md:text-sm ${
              i === 0 ? "bg-pink text-white" : "text-muted hover:text-pink"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export function PrefaceSection() {
  return (
    <Section id="preface" className="max-w-3xl text-center">
      <h2 className="mb-10 text-2xl font-extrabold md:text-3xl">{ANNUAL_HERO.prefaceLabel}</h2>
      <div className="prose-report text-center">
        {ANNUAL_HERO.paragraphs.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </div>
    </Section>
  );
}

const KPI_ICONS = [
  <Svg key="people">
    <circle cx="9" cy="8" r="2.2" />
    <circle cx="15" cy="8" r="2.2" />
    <path d="M5.5 18c.6-3 2.5-4.5 4.5-4.5S14 15 14.6 18" />
    <path d="M9.5 18c.6-3 2.5-4.5 4.5-4.5S18 15 18.6 18" />
  </Svg>,
  <Svg key="women">
    <circle cx="12" cy="8" r="3" />
    <path d="M12 11v8M9 16h6M10 21l2-2 2 2" />
  </Svg>,
  <Svg key="users">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="10" r="1.6" />
    <path d="M8.5 16c.8-1.6 2-2.4 3.5-2.4S15 14.4 15.5 16" />
  </Svg>,
  <Svg key="goods">
    <rect x="5" y="4" width="6" height="16" rx="2" />
    <rect x="13" y="8" width="6" height="12" rx="2" />
  </Svg>,
  <Svg key="variety">
    <rect x="4" y="10" width="6" height="8" rx="1" />
    <circle cx="16" cy="8" r="2" />
    <circle cx="19" cy="14" r="2" />
    <circle cx="14" cy="17" r="2" />
    <path d="M10 14h4M16 10v2" />
  </Svg>,
  <Svg key="brands">
    <path d="M12 3l2.2 4.6 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.8l.9-5L4.8 8.3l5-.7L12 3z" />
  </Svg>,
];

export function GlanceSection() {
  return (
    <Section id="glance" className="text-center">
      <h2 className="mb-8 text-2xl font-extrabold md:text-4xl">{GLANCE.title}</h2>
      <p className="mx-auto mb-12 max-w-4xl rounded-full bg-pink px-6 py-4 text-base font-bold text-white md:text-xl">
        {GLANCE.salesLine}
      </p>
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6 lg:gap-0">
        {GLANCE.kpis.map((kpi, i) => (
          <li
            key={kpi.label}
            className={`flex flex-col items-center gap-3 px-3 ${i < GLANCE.kpis.length - 1 ? "lg:border-l lg:border-line" : ""}`}
          >
            <Icon>{KPI_ICONS[i]}</Icon>
            <p className="text-sm text-muted">{kpi.label}</p>
            <p className="text-xl font-extrabold text-pink md:text-2xl">
              {kpi.value}
              {kpi.unit ? <span className="mr-1 text-sm font-semibold text-ink">{kpi.unit}</span> : null}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PathSection() {
  return (
    <Section id="path">
      <h2 className="mb-12 text-center text-2xl font-extrabold text-pink md:text-4xl">{PATH.title}</h2>
      <ol className="mb-16 flex flex-col items-center justify-between gap-8 md:flex-row">
        {PATH.years.map((y, i) => (
          <li key={y.year} className="flex flex-1 flex-col items-center text-center">
            <span
              className={`flex size-24 items-center justify-center rounded-full text-2xl font-extrabold ${
                i === 0 ? "bg-pink text-white" : "border-4 border-pink text-pink"
              }`}
            >
              {y.year}
            </span>
            <p className="mt-4 font-bold">{y.title}</p>
          </li>
        ))}
      </ol>
      <ul className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {PATH.metrics.map((m) => (
          <li key={m.label} className="text-center">
            <p className="font-bold">{m.label}</p>
            <p className="mt-2 text-sm text-muted">{m.cagrLabel}</p>
            <p className="my-4 text-5xl font-extrabold text-pink">{m.cagr}</p>
            <p className="leading-8 text-sm">{m.note}</p>
          </li>
        ))}
      </ul>
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-center text-sm font-bold text-pink">در مسیر ساختن</p>
        <h3 className="mb-4 text-center text-xl font-extrabold md:text-3xl">{PATH.gender.title}</h3>
        <p className="mb-8 text-center text-sm text-muted">{PATH.gender.source}</p>
        <GenderChart />
      </div>
    </Section>
  );
}

export function CsrSection() {
  return (
    <Section id="csr" className="text-center">
      <h2 className="mb-3 text-2xl font-extrabold text-pink md:text-4xl">{CSR.title}</h2>
      <p className="mb-12 text-xl font-bold">{CSR.subtitle}</p>
      <div className="mb-14 grid gap-8 md:grid-cols-2">
        <article>
          <img src={CSR.life.book} alt={CSR.life.bookAlt} className="mx-auto max-h-80 w-full object-contain" />
          <h3 className="mt-5 text-lg font-bold">{CSR.life.title}</h3>
        </article>
        <article>
          <img
            src={CSR.business.book}
            alt={CSR.business.bookAlt}
            className="mx-auto max-h-80 w-full object-contain"
          />
          <h3 className="mt-5 text-lg font-bold">{CSR.business.title}</h3>
        </article>
      </div>
      <div className="mb-14 grid gap-8 md:grid-cols-2">
        {CSR.business.reports.map((r) => (
          <figure key={r.alt}>
            <p className="mx-auto mb-4 w-fit rounded-full bg-pink px-4 py-1 text-sm font-bold text-white">
              {r.lines.join(" ")}
            </p>
            <img src={r.image} alt={r.alt} className="mx-auto max-h-80 object-contain" />
          </figure>
        ))}
      </div>
      <article>
        <h3 className="mb-4 text-xl font-bold">{CSR.life.careLabel}</h3>
        <p className="mx-auto mb-6 max-w-xl rounded-full bg-pink px-4 py-2 text-sm font-bold text-white">
          {CSR.life.careNote}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {CSR.life.posts.map((post) => (
            <img key={post.src} src={post.src} alt={post.alt} className="w-full rounded-3xl object-cover" />
          ))}
        </div>
      </article>
    </Section>
  );
}

function UsersRings() {
  const rings = [
    { year: USERS.years[2].year, value: USERS.years[2].value, size: "100%", color: "#a60062" },
    { year: USERS.years[1].year, value: USERS.years[1].value, size: "74%", color: "#ec078d" },
    { year: USERS.years[0].year, value: USERS.years[0].value, size: "48%", color: "#ffb3dc" },
  ];
  return (
    <div className="mx-auto grid max-w-3xl items-center gap-10 md:grid-cols-2">
      <ul className="grid gap-4 text-right">
        {rings.map((ring) => (
          <li key={ring.year} className="flex items-center justify-between gap-4 border-b border-line pb-3">
            <span className="text-lg font-extrabold" style={{ color: ring.color }}>
              {ring.value}
            </span>
            <span className="font-bold">{ring.year}</span>
          </li>
        ))}
      </ul>
      <div className="relative mx-auto aspect-square w-full max-w-xs">
        {rings.map((ring) => (
          <div
            key={ring.year}
            className="absolute inset-0 m-auto rounded-full"
            style={{ width: ring.size, height: ring.size, background: ring.color }}
          />
        ))}
      </div>
    </div>
  );
}

export function UsersSection() {
  return (
    <Section id="users">
      <h2 className="mb-4 text-center text-2xl font-extrabold text-pink md:text-4xl">{USERS.title}</h2>
      <p className="mb-10 text-center text-lg font-semibold text-pink">{USERS.growthNote}</p>
      <UsersRings />
      <h3 className="mt-16 mb-3 text-center text-xl font-extrabold md:text-2xl">{USERS.ageTitle}</h3>
      <p className="mb-2 text-center font-bold">{USERS.demoTitle}</p>
      <p className="prose-report mb-8 text-center">{USERS.demoNote}</p>
      <p className="mb-8 text-center font-semibold">{USERS.ageLead}</p>
      <AgeChart />

      <div className="mt-14 overflow-hidden rounded-3xl">
        <PhotoFigure src="/assets/annual/black-beauty.png" alt="کمپین بلک بیوتی خانومی" />
      </div>
      <div className="mt-8 rounded-3xl bg-ink p-6 text-white md:p-10">
        <p className="text-sm text-pink-soft">{USERS.golden.date}</p>
        <h3 className="mt-2 mb-6 text-2xl font-extrabold">{USERS.golden.title}</h3>
        <ul className="grid gap-3 md:grid-cols-3">
          {USERS.golden.stats.map((s) => (
            <li key={s} className="rounded-2xl bg-white/10 px-4 py-3 font-bold">
              {s}
            </li>
          ))}
        </ul>
        <p className="mt-6">{USERS.golden.campaign}</p>
        <p className="mt-2 text-sm text-white/70">{USERS.golden.compare}</p>
      </div>

      <h3 className="mt-14 mb-3 text-xl font-extrabold md:text-2xl">{USERS.time.title}</h3>
      <p className="prose-report">{USERS.time.lead}</p>
      <p className="mb-2 font-bold">{USERS.time.peak}</p>
      <p className="mb-8 text-muted">{USERS.time.peakNote}</p>
      <p className="font-bold text-pink">{USERS.time.winter}</p>
      <p className="mt-2">{USERS.time.quiet}</p>
      <p className="mt-2 text-muted">{USERS.time.winterNote}</p>

      <h3 className="mt-14 mb-3 text-xl font-extrabold md:text-2xl">{USERS.geo.title}</h3>
      <p className="mb-8">{USERS.geo.note}</p>
      <GeoChart />
    </Section>
  );
}

export function ProductsSection() {
  return (
    <Section id="products">
      <h2 className="mb-4 text-center text-2xl font-extrabold text-pink md:text-4xl">{PRODUCTS.title}</h2>
      <p className="mb-2 text-center font-bold">{PRODUCTS.mixTitle}</p>
      <p className="mb-8 text-center text-muted">{PRODUCTS.mixLead}</p>
      <p className="mb-8 text-center text-sm text-muted">{PRODUCTS.careNote}</p>
      <CategoryShareChart />
      <p className="mt-8 mb-8 rounded-full bg-pink px-4 py-3 text-center font-bold text-white">{PRODUCTS.careShare}</p>
      <MarketWeightChart />

      <h3 className="mt-14 mb-6 text-center text-xl font-extrabold md:text-2xl">{PRODUCTS.skin.title}</h3>
      <SkinShareChart />
      <p className="mt-6 prose-report text-center">{PRODUCTS.skin.insight}</p>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {PRODUCTS.skin.rows.map((r) => (
          <li key={r.market} className="rounded-2xl border border-line p-4 text-center">
            <p className="text-sm text-muted">{r.market}</p>
            <p className="my-2 text-2xl font-extrabold text-pink">{r.share.toLocaleString("fa-IR")}٪</p>
            <p className="text-sm font-semibold">{r.rank}</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-14 mb-6 text-xl font-extrabold md:text-2xl">{PRODUCTS.spend.title}</h3>
      <ol className="grid gap-4">
        {PRODUCTS.spend.items.map((item) => (
          <li key={item.rank} className="flex gap-4 rounded-2xl border border-line p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink font-extrabold text-white">
              {item.rank}
            </span>
            <div>
              <p className="font-bold">{item.title}</p>
              <p className="text-sm leading-7 text-muted">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted">{PRODUCTS.spend.footnote}</p>
      <div className="mt-8 rounded-3xl bg-cream p-6">
        <ul className="m-0 list-none space-y-1 p-0">
          {PRODUCTS.spend.sunStats.map((row) => (
            <li key={row.label} className="font-bold">
              {row.label}: {row.value}
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-8">{PRODUCTS.spend.sunNote}</p>
      </div>

      <h3 className="mt-14 mb-3 text-xl font-extrabold md:text-2xl">{PRODUCTS.makeup.title}</h3>
      <p className="mb-6 text-muted">{PRODUCTS.makeup.subtitle}</p>
      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-3xl border-2 border-pink p-5">
          <h4 className="mb-4 font-bold">خانومی</h4>
          <ol className="grid gap-2">
            {PRODUCTS.makeup.iran.map((item, i) => (
              <li key={item.label}>
                {i + 1}. {item.label}
              </li>
            ))}
          </ol>
        </article>
        <article className="rounded-3xl border border-line p-5">
          <h4 className="mb-4 font-bold">{PRODUCTS.makeup.koreaTitle}</h4>
          <ol className="grid gap-2 text-sm leading-7">
            {PRODUCTS.makeup.korea.map((item, i) => (
              <li key={item}>
                {i + 1}. {item}
              </li>
            ))}
          </ol>
        </article>
        <article className="rounded-3xl border border-line p-5">
          <h4 className="mb-4 font-bold">{PRODUCTS.makeup.menaTitle}</h4>
          <ol className="grid gap-2 text-sm leading-7">
            {PRODUCTS.makeup.mena.map((item, i) => (
              <li key={item}>
                {i + 1}. {item}
              </li>
            ))}
          </ol>
        </article>
      </div>
      <p className="mt-6 prose-report">{PRODUCTS.makeup.compare}</p>

      <div className="mt-12 rounded-3xl bg-pink p-6 text-white md:p-8">
        <h3 className="text-xl font-extrabold md:text-2xl">{PRODUCTS.pay.title}</h3>
        <p className="mt-3">{PRODUCTS.pay.note}</p>
      </div>
      <h3 className="mt-14 mb-3 text-xl font-extrabold md:text-2xl">{PRODUCTS.basket.title}</h3>
      <p className="mb-6 font-semibold">{PRODUCTS.basket.lead}</p>
      <ul className="grid gap-4 md:grid-cols-3">
        {PRODUCTS.basket.rows.map((row) => (
          <li key={row.label} className="rounded-3xl border border-line p-5">
            <p className="text-sm text-muted">{row.label}</p>
            <p className="mt-3 text-lg font-extrabold text-pink">رشد: {row.growthValue}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PartnersSection() {
  return (
    <Section id="partners">
      <h2 className="mb-4 text-center text-2xl font-extrabold text-pink md:text-4xl">{PARTNERS.title}</h2>
      <p className="mb-8 text-center font-semibold">
        {PARTNERS.brandsNote.before}
        <span className="text-pink">{PARTNERS.brandsNote.highlight}</span>
        {PARTNERS.brandsNote.after}
      </p>
      <BrandsChart />
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {PARTNERS.brands.map((b) => (
          <li key={b.year} className="rounded-2xl bg-pink-mist p-4 text-center">
            <p className="text-sm">{b.year}</p>
            <p className="text-2xl font-extrabold text-pink">{b.count.toLocaleString("fa-IR")}</p>
          </li>
        ))}
      </ul>
      <article className="mt-12 rounded-3xl border border-line p-6 md:p-8">
        <h3 className="mb-3 text-xl font-extrabold">{PARTNERS.ads.title}</h3>
        <p className="prose-report">{PARTNERS.ads.body}</p>
        <p className="mb-4 font-bold text-pink">{PARTNERS.ads.engine}</p>
        <p className="mb-2 text-2xl font-extrabold">{PARTNERS.ads.roi}</p>
        <p className="mb-6 leading-8">{PARTNERS.ads.spend}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {PARTNERS.ads.stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-cream p-4">
              <p className="text-3xl font-extrabold text-pink">{s.value}</p>
              <p className="font-bold">{s.label}</p>
              <p className="mt-3 leading-8">{s.detail}</p>
            </div>
          ))}
        </div>
      </article>
      <h3 className="mt-14 mb-6 text-xl font-extrabold md:text-2xl">{PARTNERS.local.title}</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-line p-6">
          <h4 className="mb-4 font-bold">{PARTNERS.local.careTitle}</h4>
          <ol className="grid gap-2">
            {PARTNERS.local.care.map((b, i) => (
              <li key={b}>
                {i + 1}. {b}
              </li>
            ))}
          </ol>
        </article>
        <article className="rounded-3xl border border-line p-6">
          <h4 className="mb-4 font-bold">{PARTNERS.local.makeupTitle}</h4>
          <ol className="grid gap-2">
            {PARTNERS.local.makeup.map((b, i) => (
              <li key={b}>
                {i + 1}. {b}
              </li>
            ))}
          </ol>
        </article>
      </div>
    </Section>
  );
}

export function OpsSection() {
  return (
    <Section id="ops">
      <h2 className="mb-10 text-center text-2xl font-extrabold text-pink md:text-4xl">{OPS.title}</h2>
      <h3 className="mb-3 text-center text-xl font-extrabold text-pink">{OPS.waiting.title}</h3>
      <p className="mb-8 text-center font-semibold">{OPS.waiting.lead}</p>
      <div className="mx-auto mb-10 max-w-xl rounded-[2.5rem] border-4 border-pink px-6 py-10 text-center">
        <p className="text-sm text-muted">{OPS.waiting.stats[0].label}</p>
        <p className="mt-3 text-4xl font-extrabold text-pink">{OPS.waiting.stats[0].value}</p>
      </div>
      <p className="mb-8 rounded-2xl border border-pink px-4 py-4 text-center">{OPS.waiting.far}</p>
      <p className="mb-10 text-center">{OPS.waiting.minute}</p>
      <ul className="mb-16 grid gap-6 sm:grid-cols-3">
        {OPS.waiting.stats.slice(1).map((s) => (
          <li key={s.label} className="flex aspect-square flex-col items-center justify-center rounded-full border-4 border-pink p-6 text-center">
            <p className="text-2xl font-extrabold text-pink">{s.value}</p>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </li>
        ))}
      </ul>

      <h3 className="mb-6 text-center text-xl font-extrabold text-pink">{OPS.shipping.title}</h3>
      <p className="mb-2 text-center font-bold">{OPS.shipping.returnsTitle}</p>
      <p className="mb-6 text-center text-muted">{OPS.shipping.returnsNote}</p>
      <ReturnsChart />
      <p className="mt-10 rounded-full bg-pink px-4 py-3 text-center font-bold text-white">{OPS.shipping.locker}</p>
      <div className="mt-4 mb-8 text-center">
        {OPS.shipping.lockerStats.map((line) => (
          <p key={line} className="m-0">
            {line}
          </p>
        ))}
      </div>
      <p className="mb-2 text-center font-bold">{OPS.shipping.otdTitle}</p>
      <p className="mb-6 text-center">{OPS.shipping.otdNote}</p>
      <OtdChart />

      <div className="mt-16 overflow-hidden rounded-3xl">
        <PhotoFigure src="/assets/annual/hero-export.jpg" alt="مرکز پردازش سفارش‌های خانومی" />
      </div>

      <div className="mt-16 overflow-hidden rounded-3xl border-2 border-pink bg-pink-mist p-6 text-center md:p-10">
        <p className="mb-4 text-xl font-extrabold md:text-2xl">{OPS.special.title}</p>
        <a
          href={OPS.special.href}
          className="inline-flex rounded-lg bg-pink px-5 py-3 font-semibold text-white transition-opacity duration-200 hover:opacity-90"
        >
          {OPS.special.cta}
        </a>
      </div>
    </Section>
  );
}

export function AnnualFooter() {
  return (
    <footer className="bg-ink py-12 text-center text-white">
      <img src="/assets/logo-white.svg" alt="" className="mx-auto mb-4 h-10 w-auto" />
      <p className="mb-2 text-2xl font-extrabold text-pink">{ANNUAL_FOOTER.brand}</p>
      <p className="text-sm text-white/70">{ANNUAL_FOOTER.line}</p>
    </footer>
  );
}
