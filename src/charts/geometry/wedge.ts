export type Point = { x: number; y: number };

export type Petal = {
  axisX: number;
  cy: number;
  rx: number;
  ry: number;
  tipX: number;
  tipY: number;
};

export type Sector = {
  cx: number;
  cy: number;
  r: number;
  startDeg: number;
  endDeg: number;
  tipX: number;
  tipY: number;
};

/** 0° = east, CCW, SVG y-down (sin flipped). */
export function polar(cx: number, cy: number, r: number, deg: number): Point {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}

/**
 * Circular sector (pie slice): vertex at (cx, cy), two radii, circular arc.
 * Matches InDesign Polygon_u1ecf (≈60° wedge).
 */
export function sectorPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const a = polar(cx, cy, r, startDeg);
  const b = polar(cx, cy, r, endDeg);
  let delta = endDeg - startDeg;
  while (delta < 0) delta += 360;
  while (delta >= 360) delta -= 360;
  const large = delta > 180 ? 1 : 0;
  const ax = round(a.x);
  const ay = round(a.y);
  const bx = round(b.x);
  const by = round(b.y);
  return `M${round(cx)} ${round(cy)}L${ax} ${ay}A${round(r)} ${round(r)} 0 ${large} 0 ${bx} ${by}Z`;
}

/** Rightmost point on the sector — connector origin. */
export function sectorTip(cx: number, cy: number, r: number, startDeg: number, endDeg: number): Point {
  const a = polar(cx, cy, r, startDeg);
  const b = polar(cx, cy, r, endDeg);
  let best = a.x >= b.x ? a : b;
  const lo = Math.min(startDeg, endDeg);
  const hi = Math.max(startDeg, endDeg);
  if (lo <= 0 && 0 <= hi) {
    const east = polar(cx, cy, r, 0);
    if (east.x > best.x) best = east;
  }
  return best;
}

export function stackSectors(
  radii: readonly number[],
  vertexX: number,
  startY: number,
  vertexGap: number,
  startDeg: number,
  endDeg: number,
): Sector[] {
  return radii.map((r, i) => {
    const cy = startY + i * vertexGap;
    const tip = sectorTip(vertexX, cy, r, startDeg, endDeg);
    return {
      cx: vertexX,
      cy,
      r,
      startDeg,
      endDeg,
      tipX: tip.x,
      tipY: tip.y,
    };
  });
}

/** Right-facing semi-ellipse (optional variant). */
export function petalPath(axisX: number, cy: number, rx: number, ry: number): string {
  const top = cy - ry;
  const bottom = cy + ry;
  return `M${axisX} ${top}A${rx} ${ry} 0 0 1 ${axisX} ${bottom}Z`;
}

export function stackPetals(
  radii: readonly { rx: number; ry: number }[],
  axisX: number,
  startY: number,
  rowGap: number,
): Petal[] {
  let y = startY;
  return radii.map((item) => {
    const cy = y + item.ry;
    const petal: Petal = {
      axisX,
      cy,
      rx: item.rx,
      ry: item.ry,
      tipX: axisX + item.rx,
      tipY: cy,
    };
    y += item.ry * 2 + rowGap;
    return petal;
  });
}

export function scaleFanRadii(
  values: readonly number[],
  minRx: number,
  maxRx: number,
  minRy: number,
  maxRy: number,
  mode: "linear" | "sqrt" | "area" | "rank",
): { rx: number; ry: number }[] {
  const n = values.length;
  const maxV = Math.max(...values, 1);
  return values.map((value, index) => {
    let t: number;
    if (mode === "rank") {
      t = n === 1 ? 1 : 1 - index / Math.max(1, n - 1);
    } else {
      const unit = value / maxV;
      t = mode === "sqrt" || mode === "area" ? Math.sqrt(unit) : unit;
      t = 0.45 + 0.55 * t;
    }
    return { rx: minRx + t * (maxRx - minRx), ry: minRy + t * (maxRy - minRy) };
  });
}

export function scaleSectorRadii(
  values: readonly number[],
  minR: number,
  maxR: number,
  mode: "linear" | "sqrt" | "area" | "rank",
): number[] {
  return scaleFanRadii(values, minR, maxR, minR, maxR, mode).map((item) => item.rx);
}

/**
 * Annular sector. `startDeg` → `endDeg` is clockwise in polar space
 * (0° east, 90° = 12 o'clock). Matches IDML donut wedges.
 */
export function donutSlice(
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  startDeg: number,
  endDeg: number,
): string {
  let sweep = startDeg - endDeg;
  while (sweep < 0) sweep += 360;
  while (sweep >= 360) sweep -= 360;
  const large = sweep > 180 ? 1 : 0;
  const outerA = polar(cx, cy, rOut, startDeg);
  const outerB = polar(cx, cy, rOut, endDeg);
  const innerB = polar(cx, cy, rIn, endDeg);
  const innerA = polar(cx, cy, rIn, startDeg);
  const ro = round(rOut);
  const ri = round(rIn);
  return [
    `M${round(outerA.x)} ${round(outerA.y)}`,
    `A${ro} ${ro} 0 ${large} 1 ${round(outerB.x)} ${round(outerB.y)}`,
    `L${round(innerB.x)} ${round(innerB.y)}`,
    `A${ri} ${ri} 0 ${large} 0 ${round(innerA.x)} ${round(innerA.y)}`,
    "Z",
  ].join("");
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
