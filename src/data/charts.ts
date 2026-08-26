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

/** Daily order index through 1404 — three crisis troughs at Khordad, Dey, Esfand. */
export const dailyOrders = MONTHS.map((month, i) => {
  const base = [88, 92, 40, 78, 84, 90, 86, 82, 80, 28, 74, 18][i];
  return { month, orders: base };
});

export const hourlyOrders = Array.from({ length: 24 }, (_, hour) => {
  const curve = [
    1.2, 0.8, 0.6, 0.5, 0.4, 0.5, 0.9, 1.8, 2.6, 3.2, 3.8, 4.6, 5.4, 5.1, 4.8,
    5.2, 5.8, 6.6, 7.4, 6.9, 6.2, 5.4, 3.6, 2.1,
  ];
  return { hour: String(hour), share: curve[hour] };
});

export const tehranRhythm = MONTHS.map((month, i) => ({
  month,
  index: [110, 118, 22, 95, 102, 108, 100, 98, 96, 70, 88, 12][i],
}));

export const instagramVisits = [
  { period: "۸۸ روز پیش از اختلال", visits: 100 },
  { period: "۸۸ روز اختلال", visits: 22 },
];

export const contactTopics = [
  { topic: "ویرایش سفارش", war1: 18.4, war2: 7.4 },
  { topic: "تأخیر پست", war1: 13.1, war2: 15 },
  { topic: "سؤال زمان دریافت", war1: 12.2, war2: 10.7 },
  { topic: "درخواست مرجوعی", war1: 7.4, war2: 9.7 },
  { topic: "لغو سفارش", war1: 8.8, war2: 10.7 },
];

export const pillSearch = [
  { year: "۲۰۲۲", value: 8 },
  { year: "۲۰۲۳", value: 18 },
  { year: "۲۰۲۴", value: 34 },
  { year: "۲۰۲۵", value: 62 },
  { year: "۲۰۲۶", value: 100 },
];

export const warVsAcne = [
  { month: "تیر ۱۴۰۴", war: 100, acne: 28 },
  { month: "مهر ۱۴۰۴", war: 42, acne: 36 },
  { month: "دی ۱۴۰۴", war: 38, acne: 48 },
  { month: "فروردین ۱۴۰۵", war: 22, acne: 72 },
];

export const keywordGrowth = [
  { name: "آرام‌بخش", growth: 956 },
  { name: "استرس", growth: 555 },
  { name: "جوش", growth: 243 },
  { name: "ریزش مو", growth: 132 },
  { name: "خواب", growth: 117 },
  { name: "اقتصادی", growth: 114 },
  { name: "پوست حساس", growth: 113 },
];

export const lipstickVsAcne = [
  { period: "جنگ اول", lipstick: 6.2, acne: 8.4 },
  { period: "جنگ دوم", lipstick: 6.4, acne: 14.8 },
];

export const makeupShift = [
  { name: "مداد و خط لب", change: 50.5 },
  { name: "تیغ ابرو", change: 22.1 },
  { name: "ریمل", change: 19.4 },
  { name: "پنکک", change: -25.2 },
  { name: "موچین و قیچی ابرو", change: -30.6 },
  { name: "کرم پودر", change: -32.1 },
];

export const ukraineTrends = [
  { year: "۲۰۲۲ فوریه", news: 18, perfume: 22, lipstick: 20 },
  { year: "آغاز جنگ", news: 100, perfume: 24, lipstick: 78 },
  { year: "۲۰۲۳", news: 46, perfume: 38, lipstick: 32 },
  { year: "۲۰۲۴", news: 34, perfume: 55, lipstick: 28 },
  { year: "۲۰۲۵", news: 30, perfume: 72, lipstick: 26 },
  { year: "۲۰۲۶", news: 28, perfume: 88, lipstick: 24 },
];

export const categoryShare = [
  {
    war: "جنگ اول\n۵ خرداد تا ۱۵ تیر ۱۴۰۴",
    care: 52,
    beauty: 14.6,
    other: 33.4,
  },
  {
    war: "جنگ دوم\n۱ اسفند تا ۳۱ فروردین ۱۴۰۵",
    care: 67,
    beauty: 16.5,
    other: 16.5,
  },
];

export const categoryJump = [
  { name: "محصولات سلامت‌محور", war1: 42, war2: 280 },
  { name: "لوازم برقی", war1: 38, war2: 160 },
  { name: "بهداشت شخصی", war1: 55, war2: 190 },
];

export const provinceDrop = [
  { name: "اصفهان", war1: 7.3, war2: 20.2 },
  { name: "تهران", war1: 8, war2: 28.8 },
];

export const provinceShare = [
  { name: "تهران", change: -28.8 },
  { name: "اصفهان", change: -20.2 },
  { name: "قم", change: -8 },
  { name: "مازندران", change: 24 },
  { name: "گیلان", change: 27 },
  { name: "لرستان", change: 21 },
];

export const PINK = "#EC078D";
export const PINK_DEEP = "#A60062";
export const PINK_SOFT = "#F7A0CC";
export const INK = "#1A1A1A";
