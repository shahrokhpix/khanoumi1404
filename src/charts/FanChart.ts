import type { ChartConfig, FanDatum, FanOptions, SvgChart } from "./types";
import {
  petalPath,
  scaleFanRadii,
  scaleSectorRadii,
  sectorPath,
  stackPetals,
  stackSectors,
} from "./geometry/wedge";
import { escapeXml, formatPercent } from "./typography/rtl";
import { downloadSvg, mountSvg, node, parseSvg, svgDoc } from "./svg";

const DEFAULTS: FanOptions = {
  rtl: true,
  direction: "rtl",
  fontFamily: "IRANSansXFaNum, IRANSans, Tahoma, sans-serif",
  numerals: "fa",
  padding: { top: 20, right: 176, bottom: 16, left: 28 },
  typography: {},
  scale: "rank",
  rowGap: 8,
  connectorLength: 48,
  connectorDash: "3 5",
  connectorWidth: 1.25,
  dotRadius: 4.5,
  labelGap: 12,
  fillOpacity: 1,
  percentSuffix: "درصد",
  percentFill: "#EC078D",
  labelAnchor: "start",
  variant: "sector",
  angle: 60,
  bisector: 72,
  clipLeft: true,
  clipRatio: 0.3,
};

let fanSeq = 0;

export class FanChart implements SvgChart<FanDatum, FanOptions> {
  private width: number;
  private height: number;
  private data: FanDatum[];
  private options: FanOptions;
  private container?: string | Element;
  private lastSvg: SVGSVGElement | null = null;
  private clipId: string;

  constructor(config: ChartConfig<FanDatum, FanOptions>) {
    this.width = config.width;
    this.height = config.height;
    this.data = [...config.data];
    this.options = { ...DEFAULTS, ...config.options, padding: { ...DEFAULTS.padding, ...config.options?.padding } };
    this.container = config.container;
    this.clipId = `fan-clip-${++fanSeq}`;
  }

  update(data: readonly FanDatum[], options?: Partial<FanOptions>) {
    this.data = [...data];
    if (options) this.options = { ...this.options, ...options, padding: { ...this.options.padding, ...options.padding } };
    if (this.container) this.mount(this.container);
  }

  toSVGString(): string {
    return this.options.variant === "petal" ? this.renderPetals() : this.renderSectors();
  }

  private labelNodes(x: number, y: number, row: FanDatum): string {
    const o = this.options;
    const font = o.typography.fontFamily ?? o.fontFamily;
    const labelSize = o.typography.labelSize ?? 13;
    const percentSize = o.typography.percentSize ?? 19;
    const labelFill = o.typography.fill ?? "#111111";
    const style = `direction:${o.direction};unicode-bidi:isolate`;
    return [
      node(
        "text",
        {
          x,
          y: y - 6,
          "text-anchor": o.labelAnchor,
          "font-family": font,
          "font-size": labelSize,
          "font-weight": 700,
          fill: labelFill,
          class: "users-fan-label",
          style,
        },
        escapeXml(row.label),
      ),
      node(
        "text",
        {
          x,
          y: y + percentSize * 0.85,
          "text-anchor": o.labelAnchor,
          "font-family": font,
          "font-size": percentSize,
          "font-weight": 800,
          fill: o.percentFill,
          class: "users-fan-label",
          style,
        },
        escapeXml(formatPercent(row.percentage, o.numerals, o.percentSuffix)),
      ),
    ].join("");
  }

  private connector(x1: number, y1: number, x2: number, y2: number, color: string): string {
    const o = this.options;
    const stroke = o.connectorColor ?? color;
    return [
      node("line", {
        class: "users-fan-line",
        x1,
        y1,
        x2,
        y2,
        stroke,
        "stroke-width": o.connectorWidth,
        "stroke-dasharray": o.connectorDash,
        "stroke-linecap": "round",
      }),
      node("circle", { class: "users-fan-dot", cx: x2, cy: y2, r: o.dotRadius, fill: color }),
    ].join("");
  }

  private renderSectors(): string {
    const o = this.options;
    const pad = o.padding;
    const innerW = this.width - pad.left - pad.right;
    const innerH = this.height - pad.top - pad.bottom;
    const n = Math.max(1, this.data.length);
    const startDeg = o.bisector - o.angle / 2;
    const endDeg = o.bisector + o.angle / 2;
    const topFactor = Math.sin((endDeg * Math.PI) / 180);
    const rightFactor = Math.cos((startDeg * Math.PI) / 180);
    const vertexGap = o.vertexGap ?? Math.max(28, innerH * 0.05);
    const maxRFromH = (innerH - vertexGap * (n - 1)) / Math.max(0.55, topFactor);
    const maxRFromW = (innerW * 0.9) / Math.max(0.5, 0.18 + Math.max(0, rightFactor));
    const maxR = o.maxRadiusX ?? Math.min(maxRFromH, maxRFromW);
    const minR = o.minRadiusX ?? maxR * 0.58;
    const radii = scaleSectorRadii(
      this.data.map((d) => d.value),
      minR,
      maxR,
      o.scale,
    );
    const maxR0 = Math.max(...radii);
    const vertexX = pad.left + maxR0 * 0.18;
    const startY = pad.top + maxR0 * topFactor;
    const sectors = stackSectors(radii, vertexX, startY, vertexGap, startDeg, endDeg);
    const clipX = vertexX + Math.max(...radii) * o.clipRatio;
    const dotX = this.width - pad.right;
    const labelX = this.width - 8;
    const clip = o.clipLeft
      ? node(
          "defs",
          {},
          node(
            "clipPath",
            { id: this.clipId },
            node("rect", {
              x: clipX,
              y: 0,
              width: this.width - clipX,
              height: this.height,
            }),
          ),
        )
      : "";
    const clipAttr = o.clipLeft ? { "clip-path": `url(#${this.clipId})` } : {};

    const body = sectors
      .map((sector, i) => {
        const row = this.data[i];
        const tipX = o.clipLeft ? Math.max(sector.tipX, clipX) : sector.tipX;
        return node(
          "g",
          {
            class: "users-fan-row",
            style: `--d:${i * 0.16}s`,
            "aria-label": `${row.label} ${row.percentage}`,
          },
          [
            node("path", {
              class: "users-fan-shape",
              d: sectorPath(sector.cx, sector.cy, sector.r, sector.startDeg, sector.endDeg),
              fill: row.color,
              opacity: o.fillOpacity,
              ...clipAttr,
            }),
            this.connector(tipX, sector.tipY, dotX, sector.tipY, row.color),
            this.labelNodes(labelX, sector.tipY, row),
          ].join(""),
        );
      })
      .join("");

    return svgDoc(this.width, this.height, `${clip}${body}`, {
      "aria-label": "نمودار ترکیب سنی",
      overflow: "hidden",
    });
  }

  private renderPetals(): string {
    const o = this.options;
    const pad = o.padding;
    const innerW = this.width - pad.left - pad.right;
    const innerH = this.height - pad.top - pad.bottom;
    const n = Math.max(1, this.data.length);
    const availH = innerH - o.rowGap * (n - 1);
    const maxRy = o.maxRadiusY ?? (availH / (2 * n)) * 0.92;
    const minRy = o.minRadiusY ?? maxRy * 0.55;
    const maxRx = o.maxRadiusX ?? innerW * 0.38;
    const minRx = o.minRadiusX ?? maxRx * 0.55;
    const radii = scaleFanRadii(
      this.data.map((d) => d.value),
      minRx,
      maxRx,
      minRy,
      maxRy,
      o.scale,
    );
    const axisX = pad.left + Math.max(...radii.map((r) => r.ry)) * 0.15;
    const usedH = radii.reduce((s, r) => s + r.ry * 2, 0) + o.rowGap * (n - 1);
    const startY = pad.top + Math.max(0, (innerH - usedH) / 2);
    const petals = stackPetals(radii, axisX, startY, o.rowGap);
    const dotX = this.width - pad.right;
    const labelX = this.width - 8;

    const body = petals
      .map((petal, i) => {
        const row = this.data[i];
        return node(
          "g",
          {
            class: "users-fan-row",
            style: `--d:${i * 0.16}s`,
            "aria-label": `${row.label} ${row.percentage}`,
          },
          [
            node("path", { class: "users-fan-shape", d: petalPath(petal.axisX, petal.cy, petal.rx, petal.ry), fill: row.color, opacity: o.fillOpacity }),
            this.connector(petal.tipX, petal.tipY, dotX, petal.tipY, row.color),
            this.labelNodes(labelX, petal.tipY, row),
          ].join(""),
        );
      })
      .join("");

    return svgDoc(this.width, this.height, body, { "aria-label": "نمودار ترکیب سنی" });
  }

  render(): SVGSVGElement {
    this.lastSvg = parseSvg(this.toSVGString());
    return this.lastSvg;
  }

  mount(container?: string | Element): SVGSVGElement {
    const target = container ?? this.container;
    if (!target) throw new Error("FanChart: no container");
    this.container = target;
    const svg = this.render();
    mountSvg(target, svg);
    return svg;
  }

  download(filename = "fan-chart.svg") {
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
