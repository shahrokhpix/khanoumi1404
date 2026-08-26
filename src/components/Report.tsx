import type { ReactNode } from "react";
import { CHAPTER1, CHAPTER2, CHANNEL, HERO, TIMELINES } from "../content/war-report";
import { FigmaAsset, PhotoFigure } from "./Media";
import {
  CategoryJumpChart,
  CategoryPies,
  ContactChart,
  DailyOrdersChart,
  HourlyOrdersChart,
  InstagramChart,
  KeywordChart,
  LipstickChart,
  MakeupShiftChart,
  PillSearchChart,
  ProvinceDropChart,
  ProvinceShareChart,
  TehranChart,
  UkraineChart,
  WarAcneChart,
} from "./Charts";

function Section({
  id,
  children,
  className = "",
  bleed = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-16 md:py-24 ${bleed ? "px-0" : "mx-auto max-w-5xl px-4"} ${className}`}
    >
      {children}
    </section>
  );
}

export function HeroSection() {
  return (
    <div id="start" className="scroll-mt-24">
      <PhotoFigure
        src="/assets/photos/img_01_3000x1305.jpeg"
        alt="تخلیه پس از حمله در تهران؛ زنی قالیچه بر سر دارد و ساختمانی ویران در پس‌زمینه دیده می‌شود"
        className="max-h-[72vh]"
      />
      <Section>
        <p className="text-pink font-semibold mb-3">{HERO.kicker}</p>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-8">{HERO.title}</h1>
        <p className="font-bold text-lg md:text-xl leading-9 mb-8 text-ink">{HERO.dedication}</p>
        <div className="prose-report">
          <p>{HERO.p1}</p>
          <p>{HERO.p2}</p>
          <p>{HERO.p3}</p>
          <p>{HERO.p4}</p>
          <p>{HERO.p5}</p>
          <p>{HERO.p6}</p>
        </div>
      </Section>
    </div>
  );
}

export function Chapter1Section() {
  return (
    <>
      <div className="relative">
        <PhotoFigure
          src="/assets/photos/img_02_2733x1401.jpeg"
          alt={CHAPTER1.caption}
          caption={CHAPTER1.caption}
        />
        <div className="absolute inset-x-4 bottom-16 md:inset-x-10 flex flex-wrap justify-between gap-4 pointer-events-none">
          <div className="bg-black/70 text-white rounded-2xl px-5 py-4 max-w-sm">
            <p className="text-4xl font-extrabold mb-1">{CHAPTER1.num}</p>
            <p className="text-xl font-bold">{CHAPTER1.title}</p>
          </div>
          <div className="bg-black/70 text-white rounded-2xl px-5 py-4 self-end">
            <p className="text-lg font-semibold">{CHAPTER1.subtitle}</p>
          </div>
        </div>
      </div>

      <Section id="crisis">
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-6">{CHAPTER1.crisisTitle}</h2>
        <p className="prose-report">{CHAPTER1.crisisBody}</p>
        <h3 className="text-xl md:text-2xl font-bold mt-12 mb-3">{CHAPTER1.threeDaysTitle}</h3>
        <p className="text-muted mb-8">{CHAPTER1.threeDaysChart}</p>
        <DailyOrdersChart />
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {CHAPTER1.dips.map((dip) => (
            <li key={dip.date} className="rounded-2xl border border-pink/30 bg-pink-mist p-4">
              <p className="font-bold text-pink mb-2">{dip.date}</p>
              <p className="text-sm leading-7 text-ink">{dip.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-6">{CHAPTER1.zeroTitle}</h2>
        <div className="prose-report">
          <p>{CHAPTER1.zeroP1}</p>
          <p>{CHAPTER1.zeroP2}</p>
        </div>
        <p className="font-bold text-lg mt-10 mb-2">{CHAPTER1.zeroChartTitle}</p>
        <p className="text-muted mb-6">{CHAPTER1.zeroChartSub}</p>
        <HourlyOrdersChart />
        <p className="mt-4 text-sm text-muted">
          {CHAPTER1.hourLabels.join(" — ")}
        </p>
      </Section>

      <Section id="tehran">
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-4">{CHAPTER1.tehranTitle}</h2>
        <p className="text-xl font-semibold mb-6">{CHAPTER1.tehranLead}</p>
        <div className="prose-report">
          <p>{CHAPTER1.tehranP1}</p>
          <p>{CHAPTER1.tehranP2}</p>
        </div>
        <p className="my-8 rounded-2xl bg-pink text-white text-center font-bold text-lg md:text-2xl px-4 py-5">
          {CHAPTER1.tehranCallout}
        </p>
        <TehranChart />
      </Section>

      <Section id="resilience" bleed className="bg-black text-white">
        <div className="mx-auto max-w-5xl px-4">
          <PhotoFigure
            src="/assets/photos/img_03_1949x1959.jpeg"
            alt={CHAPTER1.gishaCaption}
            caption={CHAPTER1.gishaCaption}
            className="rounded-3xl overflow-hidden mb-10"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-pink mb-6">{CHAPTER1.returnTitle}</h2>
          <p className="leading-9 mb-4 text-white/90">{CHAPTER1.returnP1}</p>
          <p className="leading-9 text-white/90">{CHAPTER1.returnP2}</p>
          <p className="mt-8 font-bold">{CHAPTER1.returnChartTitle}</p>
        </div>
      </Section>

      <Section>
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-6">{CHAPTER1.silentTitle}</h2>
        <div className="prose-report">
          <p>{CHAPTER1.silentP1}</p>
          <p>{CHAPTER1.silentP2}</p>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-pink mt-12 mb-8">{CHAPTER1.reconnectTitle}</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {TIMELINES.map((block) => (
            <article key={block.title} className="rounded-3xl border border-line p-5">
              <h4 className="font-bold mb-4 text-pink">{block.title}</h4>
              <dl className="grid gap-3 text-sm">
                {block.rows.map((row) => (
                  <div key={row.label} className="flex justify-between gap-3 border-b border-line pb-2">
                    <dt className="text-muted">{row.label}</dt>
                    <dd className="font-semibold">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-pink mt-14 mb-4">{CHAPTER1.dropTitle}</h3>
        <p className="prose-report">{CHAPTER1.dropP}</p>
      </Section>
    </>
  );
}

export function ChannelSection() {
  return (
    <Section id="channel">
      <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-8">{CHANNEL.title}</h2>
      <InstagramChart />
      <p className="prose-report mt-8">{CHANNEL.alt}</p>
      <div className="my-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-pink px-6 py-6 text-white">
        <p className="text-3xl font-extrabold">{CHANNEL.aparatFrom}</p>
        <FigmaAsset src="/assets/figma-war/imgVector246.svg" alt="" width={120} height={52} />
        <p className="text-3xl font-extrabold">{CHANNEL.aparatTo}</p>
        <p className="w-full text-center font-semibold">{CHANNEL.aparatBanner}</p>
      </div>
      <p className="mb-4">{CHANNEL.instaReturn}</p>
      <blockquote className="text-center my-10">
        <span className="quote-marks">«</span>
        <p className="text-2xl md:text-3xl font-bold text-pink my-4">{CHANNEL.quote}</p>
        <span className="quote-marks">»</span>
      </blockquote>
      <p className="prose-report">{CHANNEL.magicBox}</p>
      <PhotoFigure
        src="/assets/photos/img_04_1953x932.jpeg"
        alt="بازدید از ویدئوهای جعبه جادویی سایت خانومی شاپ"
        className="rounded-3xl overflow-hidden my-10 border border-line"
      />
      <h3 className="text-2xl font-extrabold mb-4">{CHANNEL.callTitle}</h3>
      <p className="prose-report">{CHANNEL.callP}</p>
      <p className="rounded-2xl bg-pink text-white px-5 py-4 my-8 leading-8">{CHANNEL.callCallout}</p>
      <ContactChart />
    </Section>
  );
}

export function Chapter2Section() {
  return (
    <>
      <div className="relative">
        <PhotoFigure
          src="/assets/photos/img_05_4014x2060.jpeg"
          alt={CHAPTER2.nazmabad}
          caption={CHAPTER2.nazmabad}
        />
        <div className="absolute inset-x-4 bottom-16 md:inset-x-10 flex flex-wrap justify-between gap-4 pointer-events-none">
          <div className="bg-black/70 text-white rounded-2xl px-5 py-4">
            <p className="text-4xl font-extrabold mb-1">{CHAPTER2.num}</p>
            <p className="text-xl font-bold">{CHAPTER2.title}</p>
          </div>
          <div className="bg-black/70 text-white rounded-2xl px-5 py-4 self-end">
            <p className="text-lg font-semibold">{CHAPTER2.subtitle}</p>
          </div>
        </div>
      </div>

      <Section id="anxiety">
        <p className="prose-report">{CHAPTER2.intro}</p>
        <p className="font-semibold mt-6 mb-10">{CHAPTER2.seven}</p>
        <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
          {CHAPTER2.indices.map((item) => (
            <li key={item.title} className="text-center">
              <div className="mx-auto mb-3 flex size-24 items-center justify-center rounded-full bg-pink px-2 text-white text-sm font-bold leading-5">
                {item.title}
              </div>
              <p className="text-xs leading-5 text-muted">{item.caption}</p>
            </li>
          ))}
        </ul>
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-6">{CHAPTER2.anxietyTitle}</h2>
        <div className="prose-report">
          <p>{CHAPTER2.anxietyP1}</p>
          <p>{CHAPTER2.anxietyP2}</p>
        </div>
        <div className="grid gap-8 mt-10">
          <PillSearchChart />
          <h3 className="text-xl md:text-2xl font-bold">{CHAPTER2.acneTitle}</h3>
          <WarAcneChart />
          <h3 className="text-xl md:text-2xl font-bold text-pink">{CHAPTER2.reliefTitle}</h3>
          <p className="prose-report">{CHAPTER2.reliefP}</p>
          <KeywordChart />
        </div>
      </Section>

      <Section id="joy">
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-6">{CHAPTER2.joyTitle}</h2>
        <div className="prose-report">
          <p>{CHAPTER2.joyP1}</p>
          <p>{CHAPTER2.joyP2}</p>
        </div>
        <LipstickChart />
        <p className="prose-report mt-8">{CHAPTER2.joyP3}</p>
        <h3 className="text-xl font-bold mt-10 mb-4">{CHAPTER2.smallerJoy}</h3>
        <p className="mb-6">{CHAPTER2.makeupQ}</p>
        <MakeupShiftChart />
        <h3 className="text-xl md:text-2xl font-bold text-pink mt-14 mb-4">{CHAPTER2.ukraineTitle}</h3>
        <div className="prose-report">
          <p>{CHAPTER2.ukraineP1}</p>
          <p>{CHAPTER2.ukraineP2}</p>
          <p>{CHAPTER2.ukraineP3}</p>
        </div>
        <blockquote className="text-center my-10">
          <span className="quote-marks">«</span>
          <p className="text-xl md:text-2xl font-bold text-pink my-4 leading-10">{CHAPTER2.ukraineQuote}</p>
          <cite className="text-sm text-muted not-italic">{CHAPTER2.ukraineCite}</cite>
        </blockquote>
        <UkraineChart />
      </Section>

      <Section id="care">
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-6">{CHAPTER2.careTitle}</h2>
        <p className="prose-report">{CHAPTER2.careP}</p>
        <p className="font-bold my-8">{CHAPTER2.carePie}</p>
        <CategoryPies />
        <div className="mt-10">
          <CategoryJumpChart />
        </div>
        <h3 className="text-xl md:text-2xl font-bold mt-14 mb-4">{CHAPTER2.spendQ}</h3>
        <p className="font-semibold mb-4">{CHAPTER2.spendLead}</p>
        <p className="prose-report">{CHAPTER2.spendP}</p>
        <div className="grid md:grid-cols-2 gap-6 my-10">
          <article className="rounded-3xl border-2 border-pink p-6">
            <h4 className="font-bold mb-4">محصولات مراقبتی (بهداشتی + سلامت)</h4>
            <p className="text-sm text-muted">سرانه هزینه به ازای هر مشتری خانومی در روزهای جنگ دوم</p>
            <p className="text-4xl font-extrabold text-pink my-3">۱٬۳۲۴</p>
            <p className="text-sm">هزار تومان به ازای هر مشتری</p>
            <p className="mt-4 text-muted">همان بازه، سال قبل: ۷۱۵ هزار تومان</p>
            <p className="mt-2 font-bold">رشد ۸۵٪ هزینه — رشد ۴٫۹٪ تعداد</p>
          </article>
          <article className="rounded-3xl border-2 border-pink p-6">
            <h4 className="font-bold mb-4">محصولات آرایشی</h4>
            <p className="text-sm text-muted">سرانه هزینه به ازای هر مشتری خانومی در روزهای جنگ دوم</p>
            <p className="text-4xl font-extrabold text-pink my-3">۲۵۲</p>
            <p className="text-sm">هزار تومان به ازای هر مشتری</p>
            <p className="mt-4 text-muted">همان بازه، سال قبل: ۱۴۷ هزار تومان</p>
            <p className="mt-2 font-bold">رشد ۷۲٪ هزینه — رشد ۲۱٫۵٪ تعداد</p>
          </article>
        </div>
        <p className="prose-report">{CHAPTER2.credit}</p>
        <div className="mt-8 flex flex-wrap items-center gap-6 rounded-3xl bg-pink-mist p-6">
          <FigmaAsset src="/assets/figma-war/imgVector102.svg" alt="" width={40} height={27} />
          <p className="text-xl font-extrabold text-pink">۱۱ واحد درصد رشد</p>
          <p className="text-sm md:text-base">{CHAPTER2.creditStat}</p>
        </div>
      </Section>

      <Section id="hold">
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-6">{CHAPTER2.ruptureTitle}</h2>
        <div className="prose-report">
          <p>{CHAPTER2.ruptureP1}</p>
          <p>{CHAPTER2.ruptureP2}</p>
        </div>
        <div className="my-10 overflow-hidden rounded-full bg-cream flex text-center font-bold">
          <div className="w-[32%] bg-[#3a3a3a] text-white py-6">۳۲٪ انصراف از خرید</div>
          <div className="w-[68%] bg-pink text-white py-6">۶۸٪ مشکل در تحویل گرفتن کالا</div>
        </div>
        <p className="text-sm text-muted mb-10">جنگ دوم — ۱ اسفند تا ۳۱ فروردین ۱۴۰۴ / ۱۴۰۵</p>
        <PhotoFigure
          src="/assets/photos/img_06_1949x818.jpeg"
          alt={CHAPTER2.palizi}
          caption={CHAPTER2.palizi}
          className="rounded-3xl overflow-hidden mb-12"
        />
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-6">{CHAPTER2.holdTitle}</h2>
        <p className="prose-report">{CHAPTER2.holdP}</p>
      </Section>

      <Section id="provinces">
        <h2 className="text-2xl md:text-4xl font-extrabold text-pink mb-6">{CHAPTER2.moveTitle}</h2>
        <p className="prose-report">{CHAPTER2.moveP1}</p>
        <div className="my-8">
          <ProvinceDropChart />
        </div>
        <p className="prose-report">{CHAPTER2.moveP2}</p>
        <div className="my-8">
          <ProvinceShareChart />
        </div>
        <PhotoFigure
          src="/assets/photos/img_08_4502x2309.jpeg"
          alt="پایان گزارش؛ زندگی در جریان شهر"
          className="rounded-3xl overflow-hidden mt-8"
        />
      </Section>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink py-12 text-center text-white">
      <img src="/assets/logo-white.svg" alt="" className="mx-auto mb-4 h-10 w-auto" />
      <p className="mb-2 text-2xl font-extrabold text-pink">خانومی</p>
      <p className="text-sm text-white/70">گزارش ۲ جنگ و یک اینترنت خاموش — به روایت داده‌ها</p>
      <a href="/" className="mt-4 inline-flex text-sm font-semibold text-pink-soft hover:text-white">
        بازگشت به گزارش سال ۱۴۰۴
      </a>
    </footer>
  );
}
