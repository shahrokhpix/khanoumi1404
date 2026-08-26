export type Point = { x: number; y: number };

export type BottomCircle = {
  cx: number;
  cy: number;
  r: number;
  top: number;
  bottom: number;
};

/** Full circle, or upward semicircle sitting on the shared bottom line. */
export function circleElementPath(
  cx: number,
  cy: number,
  r: number,
  shape: "full" | "semi",
  anchorY: number,
): string {
  if (shape === "semi") {
    return `M${cx - r} ${anchorY}A${r} ${r} 0 0 1 ${cx + r} ${anchorY}Z`;
  }
  return `M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}Z`;
}

/** Circles that share one bottom tangent (same cx, cy = anchorY - r). */
export function bottomStackedCircles(
  radii: readonly number[],
  cx: number,
  anchorY: number,
): BottomCircle[] {
  return radii.map((r) => ({
    cx,
    cy: anchorY - r,
    r,
    top: anchorY - 2 * r,
    bottom: anchorY,
  }));
}

export function scaleRadii(
  values: readonly number[],
  minR: number,
  maxR: number,
  mode: "linear" | "sqrt" | "area" | "rank",
): number[] {
  if (!values.length) return [];
  const maxV = Math.max(...values);
  const minV = Math.min(...values);
  const n = values.length;

  return values.map((value, index) => {
    if (mode === "rank") {
      const t = n === 1 ? 1 : 1 - index / (n - 1);
      return minR + t * (maxR - minR);
    }
    const unit = maxV === minV ? 1 : (value - minV) / (maxV - minV);
    const t = mode === "sqrt" || mode === "area" ? Math.sqrt(Math.max(0, unit)) : unit;
    return minR + t * (maxR - minR);
  });
}
