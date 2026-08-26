import { ANNUAL_NAV } from "../content/annual-report";
import { ANNUAL_PIXEL, DESIGN_H } from "./pixel-reports";

export type SectionFrame = {
  id: string;
  label: string;
  y: number;
  h: number;
  phase: number;
  filled: boolean;
};

export function framesFromSentinels(
  sentinels: readonly { id: string; y: number }[],
  labels: readonly { id: string; label: string }[],
  pageH: number,
  filledIds: ReadonlySet<string>,
): SectionFrame[] {
  const labelOf = new Map(labels.map((item) => [item.id, item.label]));
  return sentinels.map((s, i) => {
    const next = sentinels[i + 1];
    const y = s.y;
    const h = (next ? next.y : pageH) - y;
    return {
      id: s.id,
      label: labelOf.get(s.id) ?? s.id,
      y,
      h,
      phase: i + 1,
      filled: filledIds.has(s.id),
    };
  });
}

export const ANNUAL_FRAMES = framesFromSentinels(
  ANNUAL_PIXEL.sentinels,
  ANNUAL_NAV,
  DESIGN_H,
  new Set(["start", "preface", "glance", "path", "csr", "users", "products", "partners", "ops"]),
);
