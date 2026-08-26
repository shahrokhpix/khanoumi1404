import type { ChartConfig, CircleDatum, ConcentricOptions, SvgChart } from "./types";
import { bottomStackedCircles, scaleRadii } from "./geometry/circle";
import { escapeXml, formatNumber, formatTimeLabel } from "./typography/rtl";
import { circleElementPath } from "./geometry/circle";
import { crownPeopleMark, downloadSvg, mountSvg, node, parseSvg, svgDoc } from "./svg";

const DEFAULTS: ConcentricOptions = {
  rtl: true,
  direction: "rtl",
  fontFamily: "IRANSansXFaNum, IRANSans, Tahoma, sans-serif",
  numerals: "fa",
  padding: { top: 16, right: 16, bottom: 28, left: 16 },
  typography: {},
  scale: "linear",
  shape: "full",
  fillOpacity: 1,
  labelFill: "#ffffff",
  showUnit: true,
  showTime: true,
  showValue: true,
  sort: "desc",
  bottomIcon: true,
  bottomIconColor: "#EC078D",
  bottomIconSize: 36,
  innerDisc: true,
  innerDiscColor: "#FDE8F2",
  innerDiscRatio: 0.52,
};

export class ConcentricCircleChart implements SvgChart<CircleDatum, ConcentricOptions> {
  private width: number;
  private height: number;
  private data: CircleDatum[];
  private options: ConcentricOptions;
  private container?: string | Element;
  private lastSvg: SVGSVGElement | null = null;

  constructor(config: ChartConfig<CircleDatum, ConcentricOptions>) {
    this.width = config.width;
    this.height = config.height;
    this.data = [...config.data];
    this.options = { ...DEFAULTS, ...config.options, padding: { ...DEFAULTS.padding, ...config.options?.padding } };
    this.container = config.container;
  }

  update(data: readonly CircleDatum[], options?: Partial<ConcentricOptions>) {
    this.data = [...data];
    if (options) this.options = { ...this.options, ...options, padding: { ...this.options.padding, ...options.padding } };
    if (this.container) this.mount(this.container);
  }

  toSVGString(): string {
    const o = this.options;
    const pad = o.padding;
    const innerW = this.width - pad.left - pad.right;
    const innerH = this.height - pad.top - pad.bottom;
    const cx = pad.left + innerW / 2;
    const anchorY = pad.top + innerH;
    const maxR = o.maxRadius ?? innerH * 0.48;
    const minR = o.minRadius ?? maxR * 0.36;

    const rows = o.sort === "none" ? this.data : [...this.data].sort((a, b) => (o.sort === "desc" ? b.value - a.value : a.value - b.value));
    const auto = scaleRadii(
      rows.map((r) => r.value),
      minR,
      maxR,
      o.scale,
    );
    const radii = rows.map((row, i) => row.radius ?? auto[i]);
    const circles = bottomStackedCircles(radii, cx, anchorY);
    const type = o.typography;
    const font = type.fontFamily ?? o.fontFamily;
    const fill = type.fill ?? o.labelFill;

    const smallest = circles[circles.length - 1];
    const discR = smallest ? smallest.r * o.innerDiscRatio : 0;
    const discCy = anchorY - discR;
    const discTop = o.innerDisc ? discCy - discR : 0;

    const layers = circles
      .map((c, i) => {
        const next = circles[i + 1];
        const bandTop = c.top + c.r * 0.06;
        const bandBottom = next ? next.top - 8 : o.innerDisc ? discTop - 2 : c.cy - c.r * 0.12;
        const bandH = Math.max(18, bandBottom - bandTop);
        const showTime = o.showTime && Boolean(rows[i].time);
        const showValue = o.showValue;
        const showUnit = o.showUnit && Boolean(rows[i].label) && bandH > 42;
        const lineCount = Number(showTime) + Number(showValue) + Number(showUnit);
        const lineGap = Math.max(5, Math.min(9, bandH * 0.09));
        const cap = (bandH - lineGap * Math.max(0, lineCount - 1)) / Math.max(1, lineCount * 1.15);
        const timeSize = Math.min(12, type.timeSize ?? Math.max(9, c.r * 0.08), cap * 0.62);
        const valueSize = Math.min(15, type.valueSize ?? Math.max(11, c.r * 0.11), cap * 0.78);
        const unitSize = Math.min(11, type.unitSize ?? Math.max(8, c.r * 0.07), cap * 0.55);
        const block =
          (showTime ? timeSize : 0) +
          (showValue ? valueSize : 0) +
          (showUnit ? unitSize : 0) +
          lineGap * Math.max(0, lineCount - 1);
        let y = (bandTop + bandBottom) / 2 - block / 2 + timeSize * 0.85;
        const shape =
          o.shape === "full"
            ? node("circle", {
                cx: c.cx,
                cy: c.cy,
                r: c.r,
                fill: rows[i].color,
                opacity: rows[i].opacity ?? o.fillOpacity,
              })
            : node("path", {
                d: circleElementPath(c.cx, c.cy, c.r, o.shape, anchorY),
                fill: rows[i].color,
                opacity: rows[i].opacity ?? o.fillOpacity,
              });
        const parts: string[] = [shape];
        if (showTime && rows[i].time) {
          parts.push(
            node("text", {
              x: c.cx,
              y,
              "text-anchor": "middle",
              "font-family": font,
              "font-size": timeSize,
              "font-weight": type.fontWeight ?? 700,
              fill,
              style: "direction:ltr;unicode-bidi:isolate",
            }, escapeXml(formatTimeLabel(rows[i].time))),
          );
          y += timeSize + lineGap;
        }
        if (showValue) {
          parts.push(
            node("text", {
              x: c.cx,
              y,
              "text-anchor": "middle",
              "font-family": font,
              "font-size": valueSize,
              "font-weight": type.fontWeight ?? 800,
              fill,
              style: "direction:ltr;unicode-bidi:isolate",
            }, escapeXml(formatNumber(rows[i].value, o.numerals))),
          );
          y += valueSize + lineGap;
        }
        if (showUnit && rows[i].label) {
          parts.push(
            node("text", {
              x: c.cx,
              y,
              "text-anchor": "middle",
              "font-family": font,
              "font-size": unitSize,
              "font-weight": 600,
              fill,
              direction: o.direction,
            }, escapeXml(rows[i].label)),
          );
        }
        return node(
          "g",
          {
            class: "users-ring",
            style: `--d:${i * 0.22}s`,
            "aria-label": `${rows[i].time ?? ""} ${rows[i].value}`,
          },
          parts.join(""),
        );
      })
      .join("");

    const core = node(
      "g",
      { class: "users-ring-core", style: `--d:${circles.length * 0.22}s` },
      [
        o.innerDisc && smallest ? node("circle", { cx, cy: discCy, r: discR, fill: o.innerDiscColor }) : "",
        o.bottomIcon
          ? crownPeopleMark(cx, discCy, Math.max(o.bottomIconSize, discR * 1.15), o.bottomIconColor)
          : "",
      ].join(""),
    );

    return svgDoc(this.width, this.height, `${layers}${core}`, {
      "aria-label": "نمودار کاربران",
      overflow: "visible",
    });
  }

  render(): SVGSVGElement {
    this.lastSvg = parseSvg(this.toSVGString());
    return this.lastSvg;
  }

  mount(container?: string | Element): SVGSVGElement {
    const target = container ?? this.container;
    if (!target) throw new Error("ConcentricCircleChart: no container");
    this.container = target;
    const svg = this.render();
    mountSvg(target, svg);
    return svg;
  }

  download(filename = "concentric-circles.svg") {
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
