import { framesFromSentinels, type SectionFrame } from "./section-frames";
import { DESIGN_H } from "./pixel-reports";

/** Visual bands for war wireframe (finer than dock NAV). Y from PDF/IDML scan. */
export const WAR_FRAME_LABELS: readonly { id: string; label: string }[] = [
  { id: "start", label: "آغاز" },
  { id: "ch1", label: "فصل ۱ · توقف و بازگشت" },
  { id: "crisis", label: "شروع بحران" },
  { id: "zero", label: "ساعت صفر" },
  { id: "tehran", label: "تهران خاموش" },
  { id: "return", label: "بازگشت به مدار" },
  { id: "resilience", label: "تاب‌آوری خاموش" },
  { id: "channel", label: "مسیر ارتباط" },
  { id: "ch2", label: "فصل ۲ · رفتار مصرف‌کننده" },
  { id: "anxiety", label: "شاخص اضطراب" },
  { id: "care", label: "شاخص مراقبت" },
  { id: "joy", label: "لذت کوچک" },
  { id: "ukraine", label: "مقایسه اوکراین" },
  { id: "rupture", label: "شاخص گسست" },
  { id: "hold", label: "نگهداری" },
  { id: "provinces", label: "استان‌ها" },
] as const;

export const WAR_SENTINELS: readonly { id: string; y: number }[] = [
  { id: "start", y: 0 },
  { id: "ch1", y: 2225 },
  { id: "crisis", y: 2514 },
  { id: "zero", y: 3358 },
  { id: "tehran", y: 4016 },
  { id: "return", y: 4756 },
  { id: "resilience", y: 5001 },
  { id: "channel", y: 5702 },
  { id: "ch2", y: 7412 },
  { id: "anxiety", y: 8209 },
  { id: "care", y: 9429 },
  { id: "joy", y: 10479 },
  { id: "ukraine", y: 11315 },
  { id: "rupture", y: 11847 },
  { id: "hold", y: 12349 },
  { id: "provinces", y: 12601 },
] as const;

/** Filled chapters — unlock one band at a time after accept. */
const WAR_FILLED = new Set<string>([
  "start",
  "ch1",
  "crisis",
  "zero",
  "tehran",
  "return",
  "resilience",
  "channel",
  "ch2",
  "anxiety",
  "care",
  "joy",
  "ukraine",
  "rupture",
  "hold",
  "provinces",
]);

export const WAR_FRAMES: SectionFrame[] = framesFromSentinels(
  WAR_SENTINELS,
  WAR_FRAME_LABELS,
  DESIGN_H,
  WAR_FILLED,
);
