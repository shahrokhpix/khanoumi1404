import type { NumeralSystem } from "../types";

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toFaDigits(input: string): string {
  return input.replace(/\d/g, (d) => FA_DIGITS[Number(d)] ?? d);
}

export function formatNumber(value: number, numerals: NumeralSystem, fractionDigits = 0): string {
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  if (numerals !== "fa") return formatted;
  return toFaDigits(formatted).replace(/,/g, "٬").replace(/\./g, "٫");
}

export function formatPercent(value: number, numerals: NumeralSystem, suffix: string): string {
  const n = formatNumber(value, numerals, value % 1 === 0 ? 0 : 1);
  return `${n} ${suffix}`.trim();
}

/** Year or clock label. Forces LTR so `۱۴۰۴:` does not bidi-flip to `۱۴:۰۴`. */
export function formatTimeLabel(time: string): string {
  if (/[:٫]/.test(time)) return time;
  return `${time.replace(/:$/, "")}\u200e:`;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
