/**
 * Chart series derived from war-report-charts.json (source of truth for re-render).
 * visual_only curves stay synthetic; published numbers come from JSON.
 */
import warChartsJson from "./war-report-charts.json";

type WarChart = (typeof warChartsJson.charts)[number];

function chart(id: string): WarChart {
  const c = warChartsJson.charts.find((x) => x.id === id);
  if (!c) throw new Error(`Missing war chart: ${id}`);
  return c;
}

export const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/** ch01 — visual curve digitized from report PDF (visual_only; troughs at خرداد، دی، اسفند) */
export const dailyOrders = MONTHS.map((month, i) => ({
  month,
  orders: [70, 74, 0, 68, 72, 74, 73, 75, 96, 0, 54, 0][i]!,
}));

/** ch01 crisis markers — dates/events from JSON annotations */
export const dailyOrderDips = (() => {
  const ch = chart("ch01_daily_orders_1404") as {
    annotations?: {
      date: string;
      event: string;
      internet_access_percent?: { operator: string; value: number };
    }[];
  };
  const monthByDate: Record<string, string> = {
    "۱۴۰۴/۰۳/۲۷": "خرداد",
    "۱۴۰۴/۱۰/۱۹": "دی",
    "۱۴۰۴/۱۲/۱۰": "اسفند",
  };
  const dateLabel: Record<string, string> = {
    "۱۴۰۴/۰۳/۲۷": "۲۷ خرداد ماه",
    "۱۴۰۴/۱۰/۱۹": "۱۹ دی ماه",
    "۱۴۰۴/۱۲/۱۰": "۱۰ اسفند",
  };
  return (ch.annotations ?? []).map((a) => {
    const month = monthByDate[a.date] ?? "";
    const monthIndex = MONTHS.indexOf(month);
    const access = a.internet_access_percent;
    let accessNote = "";
    if (access) {
      if (access.value === 0) accessNote = " (دسترسی صفر درصد)";
      else if (access.operator === "<") accessNote = ` (دسترسی زیر ${access.value.toLocaleString("fa-IR")}٪)`;
    }
    return {
      month,
      monthIndex,
      date: dateLabel[a.date] ?? a.date,
      text: `${a.event}${accessNote}`,
    };
  });
})();

/** ch02 — digitized_approx hourly share (normalized to ~100%) */
export const hourlyOrders = (() => {
  const ch = chart("ch02_hourly_order_share") as {
    series?: { values?: number[] }[];
  };
  const values = ch.series?.[0]?.values;
  if (!values) throw new Error("ch02 missing hourly values");
  return values.map((share, hour) => ({ hour: String(hour), share }));
})();

/** ch03 — visual_only; index digitized from PDF curve (۰–۲۵۰٪) */
export const tehranRhythm = MONTHS.map((month, i) => ({
  month,
  index: [85, 140, 0, 100, 105, 106, 108, 104, 240, 88, 92, 0][i]!,
}));

/** ch04 — visual_only; recovery rhythm digitized from report PDF */
export const RETURN_YEAR_MEAN = 62;
export const RETURN_DIP_MONTHS = new Set(["خرداد", "دی", "اسفند"]);
export const RETURN_RECOVERY_MONTHS = new Set(["تیر", "بهمن"]);
/** Sparse x-axis labels matching PDF */
export const RETURN_X_LABELS = new Set([0, 2, 5, 8, 9, 11]);

export const returnRhythm = MONTHS.map((month, i) => ({
  month,
  orders: [52, 58, 0, 62, 64, 65, 63, 64, 92, 0, 62, 0][i]!,
}));

/** ch06 — digitized_approx Instagram visit index (bar heights visual, not labeled on chart) */
export const instagramVisits = (() => {
  const ch = chart("ch06_instagram_visits") as {
    x_axis?: { categories?: string[] };
    series?: { values?: number[] }[];
  };
  const cats = ch.x_axis?.categories ?? [];
  const vals = ch.series?.[0]?.values ?? [];
  const visualHeights = [96, 10];
  return cats.map((period, i) => ({
    period,
    visits: visualHeights[i] ?? vals[i]!,
  }));
})();

/** ch08 — exact call-topic shares; null = unpublished (not zero) */
export const contactTopics = (() => {
  const ch = chart("ch08_customer_service_call_topics") as {
    series?: { name: string; values: Record<string, number | null> }[];
  };
  const war1 = ch.series?.find((s) => s.name === "جنگ اول")?.values;
  const war2 = ch.series?.find((s) => s.name === "جنگ دوم")?.values;
  if (!war1 || !war2) throw new Error("ch08 missing series");
  const labels: Record<string, string> = {
    "ویرایش سفارش": "ویرایش سفارش",
    "تاخیر پست": "تأخیر پست",
    "زمان دریافت سوال": "زمان دریافت سؤال",
    "درخواست مرجوعی": "درخواست مرجوعی",
    "لغو سفارش": "لغو سفارش",
  };
  return Object.keys(labels).map((key) => ({
    topic: labels[key]!,
    war1: war1[key] ?? null,
    war2: war2[key] ?? null,
  }));
})();

/** ch09 — Google Trends pill search (monthly index, digitized from report chart) */
const PILL_SEARCH_RAW = {
  "2022": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "2023": [1, 24, 6, 4, 48, 61, 40, 51, 33, 45, 68, 9],
  "2024": [48, 8, 72, 81, 61, 78, 54, 59, 100, 75, 46, 41],
  "2025": [61, 9, 52, 47, 61, 6, 54, 69, 42, 4, 39, 59],
  "2026": [7, 0, 0, 3, 33, 50, 60],
} as const;

const PILL_YEAR_LABELS: Record<keyof typeof PILL_SEARCH_RAW, string> = {
  "2022": "۲۰۲۲",
  "2023": "۲۰۲۳",
  "2024": "۲۰۲۴",
  "2025": "۲۰۲۵",
  "2026": "۲۰۲۶",
};

export type PillSearchPoint = {
  value: number;
  yearLabel?: string;
};

export const pillSearchSeries: PillSearchPoint[] = (() => {
  const out: PillSearchPoint[] = [];
  for (const year of Object.keys(PILL_SEARCH_RAW) as (keyof typeof PILL_SEARCH_RAW)[]) {
    PILL_SEARCH_RAW[year].forEach((value, monthIndex) => {
      out.push({
        value,
        yearLabel: monthIndex === 0 ? PILL_YEAR_LABELS[year] : undefined,
      });
    });
  }
  return out;
})();

/** Year-end peak per calendar year — legacy Recharts summary */
export const pillSearch = (Object.keys(PILL_SEARCH_RAW) as (keyof typeof PILL_SEARCH_RAW)[]).map(
  (year) => ({
    year: PILL_YEAR_LABELS[year],
    value: Math.max(...PILL_SEARCH_RAW[year]),
  }),
);

/** ch10 — Google Trends war news vs acne (approximate monthly index from report chart) */
const WAR_NEWS_SERIES = [
  69, 92, 29, 20, 18, 14, 10, 9, 8, 9, 8, 8, 9, 9, 8, 10, 7, 7, 5, 7, 7, 6, 6, 6, 5, 5, 5, 7, 3,
  5, 18, 15, 8, 8, 19, 35, 32, 25, 25, 17, 9, 9, 9, 12, 8, 8, 11,
] as const;

const ACNE_SERIES = [
  53, 52, 58, 63, 63, 62, 62, 65, 65, 64, 59, 59, 58, 58, 55, 54, 55, 53, 54, 53, 53, 53, 54, 50, 47,
  47, 49, 48, 20, 44, 56, 52, 55, 52, 50, 22, 39, 70, 77, 46, 43, 63, 64, 70, 68, 65, 56,
] as const;

const WAR_VS_ACNE_X_TICKS = [
  { index: 0, label: "تیر" },
  { index: 15, label: "مهر" },
  { index: 31, label: "۱۴۰۴" },
  { index: 46, label: "فروردین ۱۴۰۵" },
] as const;

export type WarVsAcnePoint = {
  war: number;
  acne: number;
  xLabel?: string;
};

export const warVsAcneSeries: WarVsAcnePoint[] = WAR_NEWS_SERIES.map((war, index) => ({
  war,
  acne: ACNE_SERIES[index]!,
  xLabel: WAR_VS_ACNE_X_TICKS.find((tick) => tick.index === index)?.label,
}));

/** Legacy Recharts summary at published axis ticks */
export const warVsAcne = WAR_VS_ACNE_X_TICKS.map(({ index, label }) => ({
  month:
    label === "تیر"
      ? "تیر ۱۴۰۴"
      : label === "مهر"
        ? "مهر ۱۴۰۴"
        : label === "۱۴۰۴"
          ? "دی ۱۴۰۴"
          : "فروردین ۱۴۰۵",
  war: WAR_NEWS_SERIES[index]!,
  acne: ACNE_SERIES[index]!,
}));

/** ch11 — exact keyword growth */
export const keywordGrowth = (() => {
  const ch = chart("ch11_khanoumi_concern_keyword_growth");
  return (ch.data as { keyword: string; growth_percent: number }[]).map((row) => ({
    name: row.keyword,
    growth: row.growth_percent,
  }));
})();

/** ch16 — digitized_approx lipstick vs anti-acne growth */
export type LipstickVsAcnePeriod = {
  label: string;
  caption: string;
  lipstick: number;
  acne: number;
};

export const lipstickVsAcneByPeriod: LipstickVsAcnePeriod[] = [
  {
    label: "بازه جنگ اول",
    caption: "۱۵ خرداد تا ۱۵ تیر ۱۴۰۴ / نسبت به سال ۱۴۰۳",
    lipstick: 2.4,
    acne: 7.4,
  },
  {
    label: "بازه جنگ دوم",
    caption: "۱ اسفند ۱۴۰۴ تا ۳۱ فروردین ۱۴۰۵ / نسبت به سال قبل",
    lipstick: 5.4,
    acne: 14.3,
  },
];

export const lipstickVsAcneSeries = [
  { key: "lipstick" as const, name: "رژ لب", color: "#ED088D" },
  { key: "acne" as const, name: "ضد جوش", color: "#A50163" },
] as const;

/** Legacy Recharts shape */
export const lipstickVsAcne = lipstickVsAcneByPeriod.map((row) => ({
  period: row.label.replace("بازه ", ""),
  lipstick: row.lipstick,
  acne: row.acne,
}));

/** ch17 — exact cosmetic basket shift */
export const makeupShift = (() => {
  const ch = chart("ch17_cosmetic_basket_change");
  const d = ch.data as {
    growth: { category: string; change_percent: number }[];
    decline: { category: string; change_percent: number }[];
  };
  return [
    ...d.growth.map((r) => ({ name: r.category, change: r.change_percent })),
    ...d.decline.map((r) => ({ name: r.category, change: r.change_percent })),
  ];
})();

/** ch18 — approximate Google Trends curves digitized from the report */
const UKRAINE_NEWS = [
  6, 89, 21, 12, 9, 6, 8, 12, 13, 8, 7, 9, 14, 11, 7, 6, 11, 17, 7, 7, 11, 14, 6, 7, 8, 8,
];
const UKRAINE_PERFUME = [
  18, 18, 19, 21, 22, 25, 27, 30, 33, 36, 38, 40, 43, 45, 45, 49, 51, 52, 55, 57, 60, 63, 65, 71, 76, 82,
];
const UKRAINE_LIPSTICK = [
  20, 88, 41, 48, 57, 65, 61, 71, 63, 77, 65, 55, 69, 61, 72, 60, 59, 74, 76, 60, 63, 67, 71, 72, 59, 87,
];

export const ukraineTrendTicks = [
  { index: 0, label: "فوریه ۲۰۲۲" },
  { index: 7, label: "۲۰۲۳" },
  { index: 13, label: "۲۰۲۴" },
  { index: 19, label: "۲۰۲۵" },
  { index: 25, label: "۲۰۲۶" },
] as const;

export const ukraineTrendEvent = {
  index: 1,
  label: "آغاز جنگ",
  color: "#A50163",
} as const;

export const ukraineTrendSeries = [
  { key: "news" as const, name: "اخبار جنگ / تهاجم", color: "#A50163" },
  { key: "perfume" as const, name: "عطر", color: "#ED088D" },
  { key: "lipstick" as const, name: "رژ لب", color: "#F49AC2" },
] as const;

export const ukraineTrends = UKRAINE_NEWS.map((news, index) => ({
  year: ukraineTrendTicks.find((tick) => tick.index === index)?.label ?? "",
  news,
  perfume: UKRAINE_PERFUME[index]!,
  lipstick: UKRAINE_LIPSTICK[index]!,
}));

/** ch13 — exact category share pies */
export const categoryShare = (() => {
  const ch = chart("ch13_sales_category_share");
  const labels = [
    "جنگ اول\n۵ خرداد تا ۱۵ تیر ۱۴۰۴",
    "جنگ دوم\n۱ اسفند تا ۳۱ فروردین ۱۴۰۵",
  ];
  return (ch.data as { period: string; categories: Record<string, number> }[]).map((row, i) => ({
    war: labels[i] ?? row.period,
    care: row.categories["مراقبتی"]!,
    beauty: row.categories["آرایشی"]!,
    other: row.categories["سایر"]!,
  }));
})();

/** ch14 — category jump bars by war period (approximate from report chart) */
const CATEGORY_JUMP_COLORS = {
  health: "#EC078D",
  electric: "#a60062",
  hygiene: "#ff9ad4",
} as const;

export type CategoryJumpBar = {
  key: keyof typeof CATEGORY_JUMP_COLORS;
  name: string;
  value: number | null;
  color: string;
};

export type CategoryJumpPeriod = {
  label: string;
  bars: CategoryJumpBar[];
};

export const categoryJumpByPeriod: CategoryJumpPeriod[] = [
  {
    label: "بازه جنگ اول",
    bars: [
      { key: "health", name: "محصولات سلامت‌محور", value: 265, color: CATEGORY_JUMP_COLORS.health },
      { key: "electric", name: "لوازم برقی", value: 220, color: CATEGORY_JUMP_COLORS.electric },
      { key: "hygiene", name: "بهداشت شخصی", value: null, color: CATEGORY_JUMP_COLORS.hygiene },
    ],
  },
  {
    label: "بازه جنگ دوم",
    bars: [
      { key: "health", name: "محصولات سلامت‌محور", value: 130, color: CATEGORY_JUMP_COLORS.health },
      { key: "electric", name: "لوازم برقی", value: null, color: CATEGORY_JUMP_COLORS.electric },
      { key: "hygiene", name: "بهداشت شخصی", value: 70, color: CATEGORY_JUMP_COLORS.hygiene },
    ],
  },
];

/** Legacy Recharts shape */
export const categoryJump = [
  { name: "محصولات سلامت‌محور", war1: 265, war2: 130 },
  { name: "لوازم برقی", war1: 220, war2: null },
  { name: "بهداشت شخصی", war1: null, war2: 70 },
];

/** ch21 — exact province decline bars */
export const provinceDrop = (() => {
  const ch = chart("ch21_tehran_isfahan_sales_decline");
  return (ch.data as { province: string; "جنگ اول": number; "جنگ دوم": number }[]).map((row) => ({
    name: row.province,
    war1: row["جنگ اول"],
    war2: row["جنگ دوم"],
  }));
})();

/** ch22 — relative indices reconstructed from the report's unlabeled bar lengths */
export const provinceShare = [
  { name: "تهران", change: -100 },
  { name: "اصفهان", change: -18 },
  { name: "قم", change: -7.5 },
  { name: "مازندران", change: 45.4 },
  { name: "لرستان", change: 28 },
  { name: "گیلان", change: 21.1 },
];

/** ch20 — proportions reconstructed from the report graphic */
export const userMix = [
  { war: "جنگ اول", returning: 74, newUsers: 26 },
  { war: "جنگ دوم", returning: 63, newUsers: 37 },
];

/** ch15 — exact per-customer spend KPIs */
export const perCustomerSpend = (() => {
  const ch = chart("ch15_per_customer_care_vs_cosmetics");
  return ch.data as {
    category: string;
    average_items_per_customer_during_war: number;
    average_items_growth_percent: number;
    spend_thousand_toman_same_period_last_year: number;
    spend_thousand_toman_during_second_war: number;
    spend_growth_percent: number;
  }[];
})();

/** ch12 — exact credit purchase share growth */
export const creditPurchaseGrowth = (() => {
  const ch = chart("ch12_credit_purchase_share");
  return ch.value as number;
})();

/** ch19 — exact cancellation split */
export const cancellationSplit = (() => {
  const ch = chart("ch19_cancellation_reasons");
  const rows = ch.data as { reason: string; value: number }[];
  const cancel = rows.find((r) => r.reason.includes("انصراف"));
  const delivery = rows.find((r) => r.reason.includes("تحویل"));
  return { cancel: cancel?.value ?? 32, delivery: delivery?.value ?? 68 };
})();

/** ch07 — exact alternative channel KPIs */
export const alternativeChannels = (() => {
  const ch = chart("ch07_alternative_channel_growth");
  const data = ch.data as {
    metric: string;
    multiplier?: number;
    before?: number;
    after?: number;
  }[];
  const magic = data.find((d) => d.metric.includes("جعبه جادویی"));
  const aparat = data.find((d) => d.metric.includes("آپارات"));
  return {
    magicBoxMultiplier: magic?.multiplier ?? 14,
    aparatBefore: aparat?.before ?? 1700,
    aparatAfter: aparat?.after ?? 2500,
  };
})();

export const PINK = "#EC078D";
export const PINK_DEEP = "#A60062";
export const PINK_SOFT = "#F7A0CC";
export const INK = "#1A1A1A";
