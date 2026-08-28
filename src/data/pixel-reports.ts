export const DESIGN_W = 1920;
export const DESIGN_H = 14400;
export const SLICE_H = 1200;

export type Hotspot =
  | { type: "link"; href: string; label: string; x: number; y: number; w: number; h: number; download?: boolean }
  | { type: "scroll"; target: string; label: string; x: number; y: number; w: number; h: number };

function slices(folder: "annual" | "war") {
  return Array.from({ length: 12 }, (_, i) => ({
    src: `/assets/pixel/${folder}/slice-${String(i).padStart(2, "0")}.jpg`,
    top: i * SLICE_H,
    height: SLICE_H,
  }));
}

/** 10 icon slots, RTL: index 0 is the pink button on the right. */
function iconBar(targets: string[], y = 948): Hotspot[] {
  const count = targets.length;
  const barLeft = 70;
  const barRight = 1850;
  const slot = (barRight - barLeft) / count;
  return targets.map((target, i) => {
    const rtlIndex = count - 1 - i;
    return {
      type: "scroll" as const,
      target,
      label: target,
      x: barLeft + rtlIndex * slot,
      y,
      w: slot,
      h: 78,
    };
  });
}

export const ANNUAL_PIXEL = {
  title: "گزارش سال ۱۴۰۴ خانومی — سال حرکت در مسیر پایداری",
  description: "گزارش سال ۱۴۰۴ خانومی؛ روایت حرکت در مسیر پایداری",
  pdf: "/annual-report.pdf",
  slices: slices("annual"),
  sentinels: [
    { id: "start", y: 0 },
    { id: "preface", y: 1044 },
    { id: "glance", y: 1381 },
    { id: "path", y: 1994 },
    { id: "csr", y: 3111 },
    { id: "users", y: 3916 },
    { id: "products", y: 6880 },
    { id: "partners", y: 11367 },
    { id: "ops", y: 12801 },
  ],
  hotspots: [
    { type: "link", href: "/annual-report.pdf", download: true, label: "دانلود PDF", x: 196, y: 28, w: 160, h: 68 },
    { type: "link", href: "/war", label: "گزارش ویژه ۲ جنگ و یک اینترنت خاموش", x: 100, y: 172, w: 910, h: 70 },
    { type: "scroll", target: "preface", label: "شروع مطالعه", x: 100, y: 796, w: 390, h: 107 },
    ...iconBar(["start", "glance", "path", "csr", "users", "products", "partners", "ops", "partners", "start"]),
  ] satisfies Hotspot[],
};

export const WAR_PIXEL = {
  title: "گزارش جنگ خانومی — در ۱۴۰۴ چگونه از زندگی مراقبت کردیم؟",
  description: "گزارش ۲ جنگ و یک اینترنت خاموش خانومی؛ به روایت داده‌ها",
  pdf: "/war-report.pdf",
  slices: slices("war"),
  sentinels: [
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
  ],
  hotspots: [
    { type: "link", href: "/war-report.pdf", download: true, label: "دانلود PDF", x: 196, y: 22, w: 160, h: 68 },
    { type: "link", href: "/", label: "گزارش سال ۱۴۰۴", x: 1640, y: 18, w: 250, h: 70 },
    ...iconBar(["start", "crisis", "tehran", "resilience", "channel", "anxiety", "care", "joy", "hold", "provinces"], 938),
  ] satisfies Hotspot[],
};
