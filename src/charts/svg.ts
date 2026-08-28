import { escapeXml } from "./typography/rtl";

type Attrs = Record<string, string | number | boolean | undefined>;

export function attrString(attrs: Attrs): string {
  return Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== false)
    .map(([k, v]) => `${k}="${escapeXml(String(v === true ? k : v))}"`)
    .join(" ");
}

export function node(tag: string, attrs: Attrs, inner = ""): string {
  const a = attrString(attrs);
  if (!inner) return `<${tag}${a ? ` ${a}` : ""}/>`;
  return `<${tag}${a ? ` ${a}` : ""}>${inner}</${tag}>`;
}

export function svgDoc(width: number, height: number, inner: string, extra: Attrs = {}): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    node(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width,
        height,
        viewBox: `0 0 ${width} ${height}`,
        fill: "none",
        overflow: "hidden",
        role: "img",
        lang: "fa",
        ...extra,
      },
      inner,
    ),
  ].join("");
}

export function parseSvg(markup: string): SVGSVGElement {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg = doc.documentElement;
  if (!(svg instanceof SVGSVGElement)) {
    throw new Error("chart render did not produce an SVG element");
  }
  return svg;
}

export function mountSvg(container: string | Element, svg: SVGSVGElement): void {
  const el = typeof container === "string" ? document.querySelector(container) : container;
  if (!el) throw new Error("chart container not found");
  const node = document.importNode(svg, true);
  el.replaceChildren(node);
}

export function downloadSvg(markup: string, filename: string): void {
  const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function peopleMark(x: number, y: number, size: number, color: string): string {
  const s = size / 24;
  return node(
    "g",
    { transform: `translate(${x} ${y}) scale(${s})`, fill: color, "aria-hidden": true },
    [
      node("circle", { cx: 0, cy: -10, r: 3.2 }),
      node("path", { d: "M-5.2-5.2c0-2.4 2.3-4 5.2-4s5.2 1.6 5.2 4v1.2H-5.2z" }),
      node("circle", { cx: -7.5, cy: -8.2, r: 2.6 }),
      node("path", { d: "M-12.2-4.4c0-2 1.9-3.3 4.4-3.3 1.1 0 2.1.3 2.8.8-1.9 1-3.1 2.6-3.1 4.4v.7h-4.1z" }),
      node("circle", { cx: 7.5, cy: -8.2, r: 2.6 }),
      node("path", { d: "M4.9-2.5c0-1.8 1.2-3.4 3.1-4.4.7.5 1.7.8 2.8.8 2.5 0 4.4 1.3 4.4 3.3v.7H4.9z" }),
      node("path", { d: "M0-16.2 2.1-13.4h-4.2z", fill: color }),
    ].join(""),
  );
}

/** Embed a square SVG/PNG asset centered at (x, y). */
export function svgImageMark(x: number, y: number, size: number, href: string): string {
  return node("image", {
    href,
    x: x - size / 2,
    y: y - size / 2,
    width: size,
    height: size,
    "aria-hidden": true,
  });
}

/** IDML Group_u1e60 — outline people + crown, drawn around (x, y) as the visual center. */
export function crownPeopleMark(x: number, y: number, size: number, color: string): string {
  const s = size / 64;
  return node(
    "g",
    {
      transform: `translate(${x} ${y}) scale(${s}) translate(-32 -30)`,
      fill: "none",
      stroke: color,
      "stroke-width": 2.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": true,
    },
    [
      node("circle", { cx: 18, cy: 36, r: 6.2 }),
      node("path", { d: "M10 52c0-6.2 3.6-10 8-10s8 3.8 8 10" }),
      node("circle", { cx: 46, cy: 36, r: 6.2 }),
      node("path", { d: "M38 52c0-6.2 3.6-10 8-10s8 3.8 8 10" }),
      node("circle", { cx: 32, cy: 32, r: 7.4 }),
      node("path", { d: "M21 54c0-7.4 4.8-12 11-12s11 4.6 11 12" }),
      node("path", { d: "M22 18.5 32 11l10 7.5v4.2H22z" }),
      node("circle", { cx: 22, cy: 9.2, r: 1.7, fill: color, stroke: "none" }),
      node("circle", { cx: 32, cy: 6.4, r: 1.7, fill: color, stroke: "none" }),
      node("circle", { cx: 42, cy: 9.2, r: 1.7, fill: color, stroke: "none" }),
    ].join(""),
  );
}
