import { USERS } from "../content/annual-report";
import { toFaDigits } from "../charts/typography/rtl";
import { AgePeopleIcon } from "./charts/AgePeopleIcon";
import { ConcentricCircleChartView, DonutChartView, FanChartView } from "./charts/ChartViews";

function YearMark({ year }: { year: string }) {
  return (
    <span dir="ltr" className="[unicode-bidi:isolate]">
      {year}:
    </span>
  );
}

export function UsersSection() {
  return (
    <section
      id="users"
      data-reveal
      dir="rtl"
      className="relative scroll-mt-annual overflow-hidden bg-white px-4 py-16 sm:px-10 lg:px-[80px] lg:py-20"
    >
      <div
        className="pointer-events-none absolute end-0 top-20 size-[24rem] rounded-full bg-pink/10 blur-[100px]"
        aria-hidden="true"
      />
      <div className="mb-5 flex justify-center">
        <span className="font-fanum rounded-full border border-pink/20 bg-pink-mist px-4 py-1 text-[12px] font-bold text-pink">
          فصل ۰۵
        </span>
      </div>
      <h2 className="font-fanum mx-auto m-0 flex w-fit max-w-full items-center justify-center gap-2 rounded-[28px] bg-gradient-to-l from-[#ec078d] to-[#a60062] px-[clamp(16px,4vw,40px)] py-[clamp(10px,1.5vw,18px)] text-center text-[clamp(13px,2.1vw,25px)] font-extrabold leading-[1.7] text-white shadow-[0_14px_36px_rgba(236,7,141,0.35)] lg:gap-3">
        <img
          src={USERS.icon}
          alt=""
          width={42}
          height={42}
          className="size-7 shrink-0 brightness-0 invert sm:size-8 lg:size-[42px]"
        />
        {USERS.title}
      </h2>

      <p className="font-fanum m-0 mt-8 text-center text-[clamp(18px,2.4vw,26px)] font-medium leading-tight text-pink">
        {USERS.growthLead}
      </p>
      <p className="font-fanum m-0 mt-1 text-center text-[clamp(14px,1.8vw,19px)] font-medium text-black">
        {USERS.growthNote}
      </p>

      <div className="mx-auto mt-2 max-w-[560px]">
        <ConcentricCircleChartView data={USERS.circles} />
      </div>

      <h3 className="font-fanum m-0 mt-10 text-center text-[19px] font-bold leading-[34px] text-black">
        {USERS.ageTitle}:
      </h3>
      <p className="font-fanum m-0 mt-3 text-center text-[clamp(15px,1.8vw,19px)] font-bold text-black">
        {USERS.demoTitle}
      </p>
      <p className="font-fanum mx-auto mt-2 max-w-[720px] text-center text-[13px] font-medium leading-7 text-black/80 lg:text-[14px]">
        {USERS.demoNote}
      </p>

      <div className="mx-auto mt-8 flex max-w-[1100px] items-center justify-center gap-3 sm:gap-6 lg:gap-8">
        <div className="min-w-0 flex-1 overflow-hidden">
          <FanChartView data={USERS.ageFans} />
        </div>
        <div className="flex w-[9.5rem] shrink-0 flex-col items-center gap-2 text-center sm:w-[12rem] lg:w-[16rem] lg:gap-3">
          <AgePeopleIcon className="h-8 w-auto sm:h-10 lg:h-12" />
          <p className="font-fanum m-0 text-[15px] font-medium leading-7 text-black sm:text-[17px] sm:leading-8 lg:text-[21px] lg:leading-9">
            از هر <span className="text-pink">۱۰ کاربر</span>
            <br />
            نزدیک به <span className="text-pink">۸ کاربر خانومی</span>
            <br />
            <span className="text-pink">۲۵ تا ۴۴</span> ساله هستند.
          </p>
        </div>
      </div>

      <GoldenDayBand />
      <TimeBand />
      <GeoBand />
    </section>
  );
}

function CalendarTrendIcon({ trend, inverted }: { trend: "up" | "down"; inverted?: boolean }) {
  const bg = inverted ? "#fff" : "#EC078D";
  const fg = inverted ? "#EC078D" : "#fff";
  const line = trend === "up" ? "M13 31 L20 24 L26 27 L35 17" : "M13 18 L20 25 L26 22 L35 32";
  const tip = trend === "up" ? "M30 17 L35 17 L35 22" : "M30 32 L35 32 L35 27";

  return (
    <svg viewBox="0 0 48 48" className="size-9 shrink-0 sm:size-11 lg:size-12" aria-hidden="true">
      <rect width="48" height="48" rx="11" fill={bg} />
      <rect x="12" y="9" width="3.4" height="7" rx="1.2" fill={fg} />
      <rect x="32.6" y="9" width="3.4" height="7" rx="1.2" fill={fg} />
      <rect x="10" y="14" width="28" height="24" rx="3.5" fill="none" stroke={fg} strokeWidth="2.2" />
      <path d={line} fill="none" stroke={fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={tip} fill="none" stroke={fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoldenDayBand() {
  const g = USERS.golden;

  return (
    <article className="relative mx-auto mt-12 max-w-[1680px] overflow-hidden rounded-[28px] bg-black px-4 py-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45),0_0_60px_rgba(236,7,141,0.2)] sm:mt-14 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div
        className="pointer-events-none absolute -end-10 -top-10 size-56 rounded-full bg-pink/40 blur-[80px]"
        aria-hidden="true"
      />
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:gap-8">
        <div className="min-w-0">
          <h3 className="font-fanum m-0 text-center text-[clamp(15px,2.2vw,34px)] font-medium leading-tight tracking-tight text-pink">
            {g.title}
          </h3>

          <div className="mt-5 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-fanum m-0 shrink-0 text-center leading-snug sm:min-w-[12rem]">
              <span className="block whitespace-nowrap text-[clamp(12px,1.4vw,16px)] font-bold">{g.best.label}</span>
              <span className="mt-1 flex flex-wrap items-baseline justify-center gap-x-1 text-[clamp(12px,1.5vw,13px)]">
                {g.best.years.map((row, i) => (
                  <span key={row.year} className="inline-flex items-baseline gap-x-1">
                    {i > 0 ? <span className="text-white/80">|</span> : null}
                    <YearMark year={row.year} />
                    <span className="text-[clamp(16px,2vw,24px)] font-bold text-pink">{row.day}</span>
                  </span>
                ))}
              </span>
            </p>

            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 rounded-[18px] border border-white px-3 py-2.5 sm:flex-nowrap sm:gap-3 sm:px-4 sm:py-3">
              <img
                src={USERS.time.calendarIcon}
                alt=""
                width={28}
                height={28}
                className="size-[1.35rem] shrink-0 object-contain sm:size-[1.65rem]"
                style={{ filter: "invert(14%) sepia(94%) saturate(7480%) hue-rotate(314deg) brightness(95%) contrast(96%)" }}
              />
              <p className="font-fanum m-0 shrink-0 text-[clamp(16px,2.4vw,30px)] font-bold leading-none">
                {g.sales.date}:
              </p>
              <p className="font-fanum m-0 min-w-0 flex-1 text-[clamp(12px,1.6vw,18px)] font-medium leading-snug">
                {g.sales.lead}{" "}
                <span className="font-bold text-pink">
                  {g.sales.value} {g.sales.unit}
                </span>{" "}
                {g.sales.tail}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 items-center gap-2 sm:mt-8 sm:gap-4">
            <div className="text-center">
              <p className="font-fanum m-0 text-[clamp(10px,1.3vw,13px)] font-light">{g.pieces.lead}</p>
              <p className="font-fanum m-0 text-[clamp(18px,3.2vw,42px)] font-bold leading-none">
                {g.pieces.value}{" "}
                <span className="text-[0.55em] font-bold">{g.pieces.unit}</span>
              </p>
              <p className="font-fanum m-0 mt-1 text-[clamp(10px,1.3vw,13px)] font-light">{g.pieces.tail}</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 border-x border-white px-1 sm:flex-row sm:gap-2 sm:px-3">
              <p className="font-fanum m-0 text-center text-[clamp(11px,1.6vw,29px)] font-medium leading-tight text-pink">
                {g.campaignLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <img
                src={g.logo}
                alt={g.logoAlt}
                width={1075}
                height={796}
                className="h-[3.25rem] w-auto max-w-[44%] object-contain sm:h-[4.5rem] lg:h-[5.75rem]"
              />
            </div>

            <div className="text-center">
              <p className="font-fanum m-0 text-[clamp(18px,3.2vw,42px)] font-bold leading-none">
                {g.growth.value}{" "}
                <span className="text-[0.55em] font-bold">{g.growth.unit}</span>
              </p>
              <p className="font-fanum m-0 mt-1 text-[clamp(10px,1.3vw,13px)] font-light">{g.growth.label}</p>
            </div>
          </div>
        </div>

        <img
          src={g.photo}
          alt={g.photoAlt}
          width={1460}
          height={652}
          className="h-auto w-full rounded-[12px] object-cover"
        />
      </div>
    </article>
  );
}

function TimeBand() {
  const t = USERS.time;

  return (
    <div id="users-time" className="mx-auto mt-14 max-w-[920px] lg:mt-16">
      <h3 className="font-fanum m-0 text-center text-[19px] font-bold leading-[34px] text-black">
        {t.title}
      </h3>
      <p className="font-fanum mx-auto mt-3 max-w-[720px] text-center text-[clamp(13px,1.7vw,18px)] font-bold leading-8 text-black">
        {t.lead}
      </p>

      <div className="relative mx-auto mt-10 max-w-[42rem]">
        <p className="font-fanum absolute left-1/2 top-0 z-10 m-0 w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink px-4 py-2 text-center text-[clamp(10px,1.55vw,15px)] font-bold leading-snug text-white sm:whitespace-nowrap sm:px-6">
          {t.peakNote}
        </p>
        <div className="rounded-[23px] border-[1.7px] border-pink bg-white px-4 pb-6 pt-10 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:px-8 sm:pb-8 sm:pt-11">
          <p className="font-fanum m-0 text-center text-[clamp(12px,1.5vw,15px)] text-black">
            {t.peakLabel}
          </p>
          <p className="font-fanum mt-2 mb-0 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center text-[clamp(16px,2.4vw,25px)] font-bold leading-snug text-black">
            <CalendarTrendIcon trend="up" />
            <span>
              {t.peakBefore}
              <span className="text-pink">{t.peakFrom}</span>
              {t.peakMid}
              <span className="text-pink">{t.peakTo}</span>
            </span>
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-8">
        <p className="font-fanum m-0 text-center text-[clamp(15px,1.9vw,18px)] font-bold leading-7 text-black">
          {t.winter}
        </p>
        <img
          src={t.newspaper}
          alt={t.newspaperAlt}
          width={640}
          height={478}
          className="h-auto w-[min(100%,20rem)] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.16)] sm:w-[min(100%,22rem)]"
        />
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[42rem] items-center justify-center gap-3 rounded-[23px] bg-pink px-4 py-4 text-white sm:gap-4 sm:px-8 sm:py-5">
        <CalendarTrendIcon trend="down" inverted />
        <div className="min-w-0 text-center">
          <p className="font-fanum m-0 text-[clamp(11px,1.4vw,13px)] font-bold">{t.quietLabel}</p>
          <p className="font-fanum m-0 mt-1 flex flex-wrap items-baseline justify-center gap-x-2 text-[clamp(13px,1.7vw,16px)] font-bold">
            {t.quietDays.map((row, i) => (
              <span key={row.year} className="inline-flex items-baseline gap-x-1">
                {i > 0 ? <span className="font-bold">|</span> : null}
                <YearMark year={row.year} />
                <span className="text-[clamp(17px,2.3vw,23px)]">{row.day}</span>
              </span>
            ))}
          </p>
        </div>
      </div>

      <p className="font-fanum m-0 mt-5 text-center text-[clamp(15px,1.9vw,18px)] font-bold leading-7 text-black">
        {t.winterNote}
      </p>
    </div>
  );
}

function GeoBand() {
  const g = USERS.geo;

  return (
    <div id="users-geo" className="mx-auto mt-14 max-w-[1100px] lg:mt-16">
      <h3 className="font-fanum m-0 text-center text-[19px] font-bold leading-[34px] text-black">
        {g.title}
      </h3>
      <p className="font-fanum mx-auto mt-3 max-w-[720px] text-center text-[clamp(13px,1.7vw,18px)] font-medium leading-8 text-black">
        {g.note}
      </p>
      <div
        dir="ltr"
        className="mt-8 grid grid-cols-2 items-start gap-3 sm:mt-10 sm:gap-6 lg:gap-10"
      >
        {g.years.map((row) => (
          <div
            key={row.year}
            className="flex min-w-0 flex-col items-center justify-center rounded-[1.25rem] border border-pink/10 bg-white/75 px-2 py-4 shadow-[0_10px_30px_rgba(166,0,98,0.07)] sm:px-4 lg:flex-row lg:gap-3 lg:px-3"
          >
            <p className="font-fanum m-0 hidden w-[7.5rem] shrink-0 text-right leading-tight text-pink lg:block lg:w-[8.25rem]">
              <span className="block text-[13px] font-bold">{g.otherLabel}</span>
              <span className="mt-0.5 block text-[19px] font-extrabold">{toFaDigits(String(row.other))}٪</span>
            </p>
            <span className="hidden h-px w-4 shrink-0 bg-pink/45 lg:block" aria-hidden="true" />
            <div className="w-[clamp(7.25rem,30vw,12.5rem)] shrink-0">
              <DonutChartView
                year={row.year}
                tehran={row.tehran}
                other={row.other}
                tehranLabel={g.tehranLabel}
                otherLabel={g.otherLabel}
                tehranColor={g.tehranColor}
                otherColor="#EC078D"
              />
            </div>
            <span className="hidden h-px w-4 shrink-0 bg-pink/45 lg:block" aria-hidden="true" />
            <p className="font-fanum m-0 hidden w-[5.5rem] shrink-0 text-left leading-tight text-black lg:block lg:w-[6rem]">
              <span className="block text-[13px] font-bold">{g.tehranLabel}</span>
              <span className="mt-0.5 block text-[19px] font-extrabold">{toFaDigits(String(row.tehran))}٪</span>
            </p>

            <div className="mt-2 grid w-full grid-cols-2 gap-2 border-t border-pink/10 pt-2 text-center lg:hidden">
              <p className="font-fanum m-0 min-w-0 leading-tight text-pink">
                <span className="block text-[9px] font-bold sm:text-[11px]">{g.otherLabel}</span>
                <span className="mt-1 block text-[15px] font-extrabold sm:text-[17px]">{toFaDigits(String(row.other))}٪</span>
              </p>
              <p className="font-fanum m-0 min-w-0 leading-tight text-black">
                <span className="block text-[9px] font-bold sm:text-[11px]">{g.tehranLabel}</span>
                <span className="mt-1 block text-[15px] font-extrabold sm:text-[17px]">{toFaDigits(String(row.tehran))}٪</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
