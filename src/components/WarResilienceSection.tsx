import type { ReactNode } from "react";
import { CHAPTER1 } from "../content/war-report";

const BRAND = "#EC078D";
const PURPLE = "#7A2FA8";
const TRACK_START = 8;
const TRACK_SPAN = 84;

type DayRef = { y: number; m: number; d: number };

type TimelineBlock = {
  title: string;
  event: { date: string; pos: number };
  internetOff: { date: string; pos: number };
  internetOn: { date: string; pos: number };
  salesDrop: { date: string; pos: number };
  salesReturn: { date: string; pos: number };
};

const PERSIAN_MONTH_DAYS = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

function isLeapPersian(year: number): boolean {
  const rem = ((year % 33) + 33) % 33;
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(rem);
}

function monthLength(year: number, month: number): number {
  if (month === 12) return isLeapPersian(year) ? 30 : 29;
  return PERSIAN_MONTH_DAYS[month - 1]!;
}

function toDayIndex({ y, m, d }: DayRef): number {
  let total = y * 372;
  for (let month = 1; month < m; month++) total += monthLength(y, month);
  return total + d;
}

function posInWindow(day: DayRef, start: DayRef, end: DayRef): number {
  const span = toDayIndex(end) - toDayIndex(start);
  if (span <= 0) return 0;
  return ((toDayIndex(day) - toDayIndex(start)) / span) * 100;
}

function buildTimeline(
  title: string,
  window: { start: DayRef; end: DayRef },
  points: {
    event: { date: string; day: DayRef };
    internetOff: { date: string; day: DayRef };
    internetOn: { date: string; day: DayRef };
    salesDrop: { date: string; day: DayRef };
    salesReturn: { date: string; day: DayRef };
  },
): TimelineBlock {
  const pos = (day: DayRef) => posInWindow(day, window.start, window.end);
  return {
    title,
    event: { date: points.event.date, pos: pos(points.event.day) },
    internetOff: { date: points.internetOff.date, pos: pos(points.internetOff.day) },
    internetOn: { date: points.internetOn.date, pos: pos(points.internetOn.day) },
    salesDrop: { date: points.salesDrop.date, pos: pos(points.salesDrop.day) },
    salesReturn: { date: points.salesReturn.date, pos: pos(points.salesReturn.day) },
  };
}

const CRISIS_TIMELINES: TimelineBlock[] = [
  buildTimeline(
    "جنگ اول — ۱۲ روزه (خرداد–تیر ۱۴۰۴)",
    { start: { y: 1404, m: 3, d: 23 }, end: { y: 1404, m: 4, d: 9 } },
    {
      event: { date: "۲۳ خرداد ۱۴۰۴", day: { y: 1404, m: 3, d: 23 } },
      internetOff: { date: "۲۷ خرداد ۱۴۰۴", day: { y: 1404, m: 3, d: 27 } },
      internetOn: { date: "۴ تیر ۱۴۰۴", day: { y: 1404, m: 4, d: 4 } },
      salesDrop: { date: "۲۷ خرداد ۱۴۰۴", day: { y: 1404, m: 3, d: 27 } },
      salesReturn: { date: "۹ تیر ۱۴۰۴", day: { y: 1404, m: 4, d: 9 } },
    },
  ),
  buildTimeline(
    "موج دی — اعتراضات (دی–بهمن ۱۴۰۴)",
    { start: { y: 1404, m: 10, d: 18 }, end: { y: 1404, m: 11, d: 7 } },
    {
      event: { date: "۱۸–۱۹ دی ۱۴۰۴", day: { y: 1404, m: 10, d: 18 } },
      internetOff: { date: "۱۸ دی ۱۴۰۴", day: { y: 1404, m: 10, d: 18 } },
      internetOn: { date: "۷ بهمن ۱۴۰۴", day: { y: 1404, m: 11, d: 7 } },
      salesDrop: { date: "۱۹ دی ۱۴۰۴", day: { y: 1404, m: 10, d: 19 } },
      salesReturn: { date: "۲۹ دی ۱۴۰۴", day: { y: 1404, m: 10, d: 29 } },
    },
  ),
  buildTimeline(
    "جنگ دوم (اسفند ۱۴۰۴ — خرداد ۱۴۰۵)",
    { start: { y: 1404, m: 12, d: 9 }, end: { y: 1405, m: 3, d: 5 } },
    {
      event: { date: "۹ اسفند ۱۴۰۴", day: { y: 1404, m: 12, d: 9 } },
      internetOff: { date: "۹ اسفند ۱۴۰۴", day: { y: 1404, m: 12, d: 9 } },
      internetOn: { date: "۵ خرداد ۱۴۰۵", day: { y: 1405, m: 3, d: 5 } },
      salesDrop: { date: "۱۰ اسفند ۱۴۰۴", day: { y: 1404, m: 12, d: 10 } },
      salesReturn: { date: "۸ فروردین ۱۴۰۵", day: { y: 1405, m: 1, d: 8 } },
    },
  ),
];

function trackX(pos: number): string {
  const normalized = Math.min(100, Math.max(0, pos));
  return `${(TRACK_START + (normalized / 100) * TRACK_SPAN).toFixed(4)}%`;
}

function IconEvent() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.125rem] shrink-0 sm:size-5" aria-hidden="true">
      <path fill={PURPLE} d="M12 3 2 21h20L12 3zm0 5.5a1.25 1.25 0 0 1 1.25 1.25v4.5a1.25 1.25 0 1 1-2.5 0v-4.5A1.25 1.25 0 0 1 12 8.5zm0 9.25a1.35 1.35 0 1 1 0-2.7 1.35 1.35 0 0 1 0 2.7z" />
    </svg>
  );
}

function IconWifi() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.125rem] shrink-0 sm:size-5" aria-hidden="true">
      <path
        fill="none"
        stroke={PURPLE}
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M2.5 9.5a16 16 0 0 1 19 0M6.5 13.2a10.5 10.5 0 0 1 11 0M10.5 16.8a5 5 0 0 1 3 0M12 20h.01"
      />
    </svg>
  );
}

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.125rem] shrink-0 sm:size-5" aria-hidden="true">
      <path
        fill="none"
        stroke={BRAND}
        strokeWidth="1.75"
        strokeLinejoin="round"
        d="M4 5h1.5l2.2 10.2a1.5 1.5 0 0 0 1.47 1.2h7.66a1.5 1.5 0 0 0 1.47-1.2L20.5 9H7"
      />
      <circle cx="10" cy="19.5" r="1.25" fill={BRAND} />
      <circle cx="16.5" cy="19.5" r="1.25" fill={BRAND} />
    </svg>
  );
}

function MarkerEvent({ small }: { small?: boolean }) {
  const r = small ? 5 : 6.5;
  return (
    <svg width={r * 2} height={r * 2} aria-hidden="true">
      <circle cx={r} cy={r} r={r} fill={PURPLE} />
    </svg>
  );
}

function MarkerInternetOff({ small }: { small?: boolean }) {
  const s = small ? 18 : 22;
  return (
    <svg width={s} height={s} viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <path d="M7 7l8 8M15 7l-8 8" stroke={PURPLE} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function MarkerInternetOn({ small }: { small?: boolean }) {
  const s = small ? 18 : 22;
  return (
    <svg width={s} height={s} viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <path
        d="M6.5 11.5 9.5 14.5 15.5 8.5"
        fill="none"
        stroke={PURPLE}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MarkerSalesDrop({ small }: { small?: boolean }) {
  const r = small ? 5 : 6.5;
  return (
    <svg width={r * 2} height={r * 2} aria-hidden="true">
      <circle cx={r} cy={r} r={r} fill="#F6AED5" stroke={BRAND} strokeWidth="1.25" />
    </svg>
  );
}

function MarkerSalesReturn({ small }: { small?: boolean }) {
  const s = small ? 18 : 22;
  return (
    <svg width={s} height={s} viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill={BRAND} />
      <path d="M7 11h8M11 7v8" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function TimelineLegend() {
  const items = [
    { label: "واقعه", node: <MarkerEvent small /> },
    { label: "قطع اینترنت", node: <MarkerInternetOff small /> },
    { label: "وصل اینترنت", node: <MarkerInternetOn small /> },
    { label: "افت فروش", node: <MarkerSalesDrop small /> },
    { label: "بازگشت فروش", node: <MarkerSalesReturn small /> },
  ];

  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-7" dir="rtl">
      {items.map((item) => (
        <span key={item.label} className="font-fanum inline-flex items-center gap-2 text-[11px] font-bold text-black sm:text-[12px]">
          <span className="inline-flex size-[18px] items-center justify-center">{item.node}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}

function SolidTrack({ to }: { to: number }) {
  return (
    <div
      className="absolute top-1/2 h-px -translate-y-1/2 bg-black/15"
      style={{ left: 0, right: `calc(100% - ${trackX(to)})` }}
      aria-hidden="true"
    />
  );
}

function DashedTrack({ from, to }: { from: number; to: number }) {
  const start = Math.min(from, to);
  const end = Math.max(from, to);
  if (end <= start) return null;
  return (
    <div
      className="absolute top-1/2 h-0 -translate-y-1/2 border-t border-dashed border-pink/55"
      style={{ left: trackX(start), right: `calc(100% - ${trackX(end)})` }}
      aria-hidden="true"
    />
  );
}

function TrackMarker({ pos, date, children }: { pos: number; date: string; children: ReactNode }) {
  return (
    <div className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: trackX(pos) }}>
      <span className="flex items-center justify-center">{children}</span>
      <span
        dir="rtl"
        className="font-fanum absolute bottom-[calc(100%+5px)] left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[9px] font-bold leading-tight text-black sm:text-[10px]"
      >
          {date}
      </span>
    </div>
  );
}

function RowLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-start gap-1.5 sm:gap-2" dir="ltr">
      {icon}
      <span dir="rtl" className="font-fanum text-[10px] font-bold text-black/70 sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

function TimelineRow({
  label,
  icon,
  first,
  second,
}: {
  label: string;
  icon: ReactNode;
  first: { date: string; pos: number; node: ReactNode };
  second?: { date: string; pos: number; node: ReactNode };
}) {
  const leadPos = second ? Math.min(first.pos, second.pos) : first.pos;

  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-2 sm:grid-cols-[6.75rem_minmax(0,1fr)] sm:gap-x-3">
      <RowLabel icon={icon} label={label} />
      <div className="relative h-[3.75rem] sm:h-[4.25rem]">
        <SolidTrack to={leadPos} />
        {second && <DashedTrack from={first.pos} to={second.pos} />}
        <TrackMarker pos={first.pos} date={first.date}>
          {first.node}
        </TrackMarker>
        {second && (
          <TrackMarker pos={second.pos} date={second.date}>
            {second.node}
          </TrackMarker>
        )}
      </div>
    </div>
  );
}

function CrisisTimelineBlock({ block }: { block: TimelineBlock }) {
  return (
    <article className="border-b border-pink/30 pb-8 last:border-b-0 last:pb-0" dir="ltr">
      <h4
        dir="rtl"
        className="font-fanum m-0 mb-5 w-full text-center text-[12px] font-bold leading-6 text-pink sm:text-[14px] sm:leading-7"
      >
        {block.title}
      </h4>

      <div className="space-y-0.5 sm:space-y-1">
        <TimelineRow
          label="واقعه"
          icon={<IconEvent />}
          first={{ date: block.event.date, pos: block.event.pos, node: <MarkerEvent /> }}
        />

        <TimelineRow
          label="اینترنت"
          icon={<IconWifi />}
          first={{ date: block.internetOff.date, pos: block.internetOff.pos, node: <MarkerInternetOff /> }}
          second={{ date: block.internetOn.date, pos: block.internetOn.pos, node: <MarkerInternetOn /> }}
        />

        <TimelineRow
          label="فروش"
          icon={<IconCart />}
          first={{ date: block.salesDrop.date, pos: block.salesDrop.pos, node: <MarkerSalesDrop /> }}
          second={{ date: block.salesReturn.date, pos: block.salesReturn.pos, node: <MarkerSalesReturn /> }}
        />
      </div>
    </article>
  );
}

export function WarResilienceSection() {
  return (
    <section
      id="resilience"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHAPTER1.silentTitle}
        </h2>
        <div className="font-fanum mx-auto mt-5 max-w-[48rem] space-y-4 text-center text-[clamp(14px,1.7vw,17px)] leading-8 text-black/80">
          <p className="m-0">{CHAPTER1.silentP1}</p>
          <p className="m-0">{CHAPTER1.silentP2}</p>
        </div>

        <p className="font-fanum mx-auto mt-12 max-w-[40rem] text-center text-[clamp(15px,1.9vw,20px)] font-bold leading-8 text-black sm:mt-14">
          {CHAPTER1.reconnectTitle}
        </p>

        <div className="war-crisis-timeline mx-auto mt-8 max-w-[920px] sm:mt-10">
          <TimelineLegend />
          <div className="space-y-8 sm:space-y-10">
            {CRISIS_TIMELINES.map((block) => (
              <CrisisTimelineBlock key={block.title} block={block} />
            ))}
          </div>
        </div>

        <h3 className="font-fanum m-0 mt-14 text-center text-[clamp(1.15rem,2.3vw,1.7rem)] font-bold leading-snug text-pink">
          {CHAPTER1.dropTitle}
        </h3>
        <p className="font-fanum mx-auto mt-5 max-w-[48rem] text-center text-[clamp(14px,1.7vw,17px)] leading-8 text-black/80">
          {CHAPTER1.dropP}
        </p>
      </div>
    </section>
  );
}
