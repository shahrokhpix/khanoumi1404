export type NumeralSystem = "fa" | "latn";
export type RadiusScale = "linear" | "sqrt" | "area" | "rank";

export type CircleDatum = {
  value: number;
  label?: string;
  time?: string;
  color: string;
  radius?: number;
  opacity?: number;
  icon?: string;
};

export type FanDatum = {
  value: number;
  label: string;
  percentage: number;
  color: string;
  icon?: string;
};

export type ChartTypography = {
  fontFamily: string;
  fontWeight: number | string;
  numerals: NumeralSystem;
  timeSize: number;
  valueSize: number;
  unitSize: number;
  labelSize: number;
  percentSize: number;
  fill: string;
};

export type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type CircleShape = "full" | "semi";

export type ConcentricOptions = {
  rtl: boolean;
  direction: "rtl" | "ltr";
  fontFamily: string;
  numerals: NumeralSystem;
  padding: ChartPadding;
  typography: Partial<ChartTypography>;
  scale: RadiusScale;
  shape: CircleShape;
  maxRadius?: number;
  minRadius?: number;
  fillOpacity: number;
  labelFill: string;
  showUnit: boolean;
  showTime: boolean;
  showValue: boolean;
  sort: "desc" | "asc" | "none";
  bottomIcon: boolean;
  bottomIconColor: string;
  bottomIconSize: number;
  innerDisc: boolean;
  innerDiscColor: string;
  innerDiscRatio: number;
};

export type FanOptions = {
  rtl: boolean;
  direction: "rtl" | "ltr";
  fontFamily: string;
  numerals: NumeralSystem;
  padding: ChartPadding;
  typography: Partial<ChartTypography>;
  scale: RadiusScale;
  maxRadiusX?: number;
  maxRadiusY?: number;
  minRadiusX?: number;
  minRadiusY?: number;
  rowGap: number;
  connectorLength: number;
  connectorDash: string;
  connectorWidth: number;
  connectorColor?: string;
  dotRadius: number;
  labelGap: number;
  fillOpacity: number;
  percentSuffix: string;
  percentFill: string;
  labelAnchor: "start" | "end" | "middle";
  /** `sector` = circular pie slice (IDML Polygon_u1ecf). `petal` = right semi-ellipse. */
  variant: "sector" | "petal";
  /** Sweep of the pie slice in degrees (IDML ≈ 60). */
  angle: number;
  /** Bisector direction: 0 = east, 90 = up (SVG y-down, CCW). IDML ≈ 72. */
  bisector: number;
  /** Hide the vertex side with a vertical clip, like the InDesign Paper mask. */
  clipLeft: boolean;
  /** Extra shift of the clip line as a fraction of max radius. */
  clipRatio: number;
  vertexGap?: number;
};

export type DonutDatum = {
  value: number;
  label: string;
  color: string;
  labelColor: string;
  side: "left" | "right";
};

export type DonutOptions = {
  rtl: boolean;
  direction: "rtl" | "ltr";
  fontFamily: string;
  numerals: NumeralSystem;
  padding: ChartPadding;
  typography: Partial<ChartTypography>;
  year: string;
  /** Polar degrees: 90 = 12 o'clock. First slice starts here, then clockwise. */
  startDeg: number;
  innerRatio: number;
  connectorLength: number;
  connectorWidth: number;
  connectorColor: string;
  percentSuffix: string;
  showLabels: boolean;
};

export type ChartConfig<TData, TOptions> = {
  container?: string | Element;
  width: number;
  height: number;
  data: readonly TData[];
  options?: Partial<TOptions>;
};

export type SvgChart<TData = never, TOptions = never> = {
  render: () => SVGSVGElement;
  toSVGString: () => string;
  mount: (container?: string | Element) => SVGSVGElement;
  download: (filename?: string) => void;
  destroy: () => void;
  update: (data: readonly TData[], options?: Partial<TOptions>) => void;
};
