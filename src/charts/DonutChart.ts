import type { ChartConfig, DonutDatum, DonutOptions, SvgChart } from "./types";
import { donutSlice } from "./geometry/wedge";
import { escapeXml, formatNumber, toFaDigits } from "./typography/rtl";
import { downloadSvg, mountSvg, node, parseSvg, svgDoc } from "./svg";

const DEFAULTS: DonutOptions = {
  rtl: true,
  direction: "rtl",
  fontFamily: "IRANSansXFaNum, IRANSans, Tahoma, sans-serif",
  numerals: "fa",
  padding: { top: 12, right: 108, bottom: 12, left: 168 },
  typography: {},
  year: "",
  startDeg: 90,
  innerRatio: 0.62,
  connectorLength: 28,
  connectorWidth: 1.2,
  connectorColor: "#9A9590",
  percentSuffix: "٪",
  showLabels: true,
};

export class DonutChart implements SvgChart<DonutDatum, DonutOptions> {
  private width: number;
  private height: number;
  private data: DonutDatum[];
  private options: DonutOptions;
  private container?: string | Element;
  private lastSvg: SVGSVGElement | null = null;

  constructor(config: ChartConfig<DonutDatum, DonutOptions>) {
    this.width = config.width;
    this.height = config.height;
    this.data = [...config.data];
    this.options = { ...DEFAULTS, ...config.options, padding: { ...DEFAULTS.padding, ...config.options?.padding } };
    this.container = config.container;
  }

  update(data: readonly DonutDatum[], options?: Partial<DonutOptions>) {
    this.data = [...data];
    if (options) this.options = { ...this.options, ...options, padding: { ...this.options.padding, ...options.padding } };
    if (this.container) this.mount(this.container);
  }

  toSVGString(): string {
    const o = this.options;
    const padL = o.showLabels ? Math.max(72, Math.min(o.padding.left, this.width * 0.42)) : 8;
    const padR = o.showLabels ? Math.max(52, Math.min(o.padding.right, this.width * 0.3)) : 8;
    const padT = o.showLabels ? o.padding.top : 8;
    const padB = o.showLabels ? o.padding.bottom : 8;
    const innerW = Math.max(48, this.width - padL - padR);
    const innerH = Math.max(48, this.height - padT - padB);
    const rOut = Math.min(innerW, innerH) / 2;
    const rIn = rOut * o.innerRatio;
    const cx = padL + innerW / 2;
    const cy = padT + innerH / 2;
    const total = this.data.reduce((sum, row) => sum + row.value, 0) || 1;
    const compact = this.width < 280;
    const font = o.typography.fontFamily ?? o.fontFamily;
    const labelSize = o.typography.labelSize ?? (compact ? 10 : 13);
    const percentSize = o.typography.percentSize ?? (compact ? 14 : 19);
    const yearSize = Math.max(14, Math.min(24, rIn * 0.48));
    const connector = Math.max(8, Math.min(o.connectorLength, rOut * 0.2));
    const style = `direction:${o.direction};unicode-bidi:isolate`;

    let cursor = o.startDeg;
    const slices = this.data.map((row, i) => {
      const sweep = (row.value / total) * 360;
      const endDeg = cursor - sweep;
      const d = donutSlice(cx, cy, rOut, rIn, cursor, endDeg);
      cursor = endDeg;
      return { row, d, delay: `${0.08 + i * 0.12}s` };
    });

    const ring = node(
      "g",
      { class: "users-donut-ring", style: "--d:0.05s" },
      slices
        .map(({ row, d, delay }) =>
          node("path", {
            class: "users-donut-slice",
            d,
            fill: row.color,
            style: `--d:${delay}`,
          }),
        )
        .join(""),
    );

    const year = node(
      "text",
      {
        x: cx,
        y: cy,
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        "font-family": font,
        "font-size": yearSize,
        "font-weight": 700,
        fill: "#111111",
        class: "users-donut-year",
        style: "direction:ltr;unicode-bidi:isolate",
      },
      escapeXml(toFaDigits(o.year)),
    );

    const labels = o.showLabels
      ? this.data
          .map((row) => {
            const outward = row.side === "left" ? -1 : 1;
            const x1 = cx + outward * rOut;
            const x2 = cx + outward * (rOut + connector);
            const labelX = x2 + outward * 6;
            const percent = `${formatNumber(row.value, o.numerals)}${o.percentSuffix}`;
            return [
              node("line", {
                class: "users-donut-line",
                x1,
                y1: cy,
                x2,
                y2: cy,
                stroke: o.connectorColor,
                "stroke-width": o.connectorWidth,
              }),
              node(
                "text",
                {
                  x: labelX,
                  y: cy - 6,
                  "text-anchor": row.side === "left" ? "end" : "start",
                  "font-family": font,
                  "font-size": labelSize,
                  "font-weight": 700,
                  fill: row.labelColor,
                  class: "users-donut-label",
                  style,
                },
                escapeXml(row.label),
              ),
              node(
                "text",
                {
                  x: labelX,
                  y: cy + percentSize * 0.85,
                  "text-anchor": row.side === "left" ? "end" : "start",
                  "font-family": font,
                  "font-size": percentSize,
                  "font-weight": 800,
                  fill: row.labelColor,
                  class: "users-donut-label",
                  style,
                },
                escapeXml(percent),
              ),
            ].join("");
          })
          .join("")
      : "";

    return svgDoc(this.width, this.height, `${ring}${year}${labels}`, {
      "aria-label": `نمودار تمرکز تقاضا ${o.year}`,
      overflow: "visible",
    });
  }

  render(): SVGSVGElement {
    this.lastSvg = parseSvg(this.toSVGString());
    return this.lastSvg;
  }

  mount(container?: string | Element): SVGSVGElement {
    const target = container ?? this.container;
    if (!target) throw new Error("DonutChart: no container");
    this.container = target;
    const svg = this.render();
    mountSvg(target, svg);
    return svg;
  }

  download(filename = "donut-chart.svg") {
    downloadSvg(this.toSVGString(), filename);
  }

  destroy() {
    this.lastSvg?.remove();
    this.lastSvg = null;
    if (this.container && typeof this.container !== "string") {
      this.container.replaceChildren();
    }
  }
}
