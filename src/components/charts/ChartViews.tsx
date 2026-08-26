import { useCallback } from "react";
import {
  ConcentricCircleChart,
  DonutChart,
  FanChart,
  type CircleDatum,
  type FanDatum,
} from "../../charts";
import { ChartHost } from "./ChartHost";

const FONT = "IRANSansXFaNum, IRANSans, Tahoma, sans-serif";
const fanAspect = (width: number) => (width < 360 ? 1.18 : 0.98);

export function ConcentricCircleChartView({ data }: { data: readonly CircleDatum[] }) {
  const build = useCallback(
    (width: number, height: number) =>
      new ConcentricCircleChart({
        width,
        height,
        data,
        options: { fontFamily: FONT, numerals: "fa", scale: "linear", fillOpacity: 1 },
      }),
    [data],
  );
  return <ChartHost aspect={1.02} overflow="visible" build={build} />;
}

export function FanChartView({ data }: { data: readonly FanDatum[] }) {
  const build = useCallback(
    (width: number, height: number) => {
      const compact = width < 360;

      return new FanChart({
        width,
        height,
        data,
        options: {
          fontFamily: FONT,
          numerals: "fa",
          scale: "rank",
          variant: "sector",
          angle: 60,
          bisector: 72,
          clipLeft: true,
          clipRatio: compact ? 0.18 : 0.3,
          vertexGap: compact ? 34 : undefined,
          padding: {
            top: 12,
            right: Math.max(112, width * 0.28),
            bottom: 16,
            left: 8,
          },
          typography: {
            labelSize: compact ? 11 : 12,
            percentSize: compact ? 15 : 16,
          },
        },
      });
    },
    [data],
  );
  return (
    <ChartHost
      className="[&_svg]:h-auto [&_svg]:max-w-full"
      aspect={fanAspect}
      overflow="hidden"
      build={build}
    />
  );
}

export function DonutChartView({
  year,
  tehran,
  other,
  tehranLabel,
  otherLabel,
  tehranColor = "#EDEDED",
  otherColor = "#a60062",
}: {
  year: string;
  tehran: number;
  other: number;
  tehranLabel: string;
  otherLabel: string;
  tehranColor?: string;
  otherColor?: string;
}) {
  const build = useCallback(
    (width: number, height: number) =>
      new DonutChart({
        width,
        height,
        data: [
          { value: tehran, label: tehranLabel, color: tehranColor, labelColor: "#111111", side: "right" },
          { value: other, label: otherLabel, color: otherColor, labelColor: otherColor, side: "left" },
        ],
        options: { fontFamily: FONT, numerals: "fa", year, showLabels: false },
      }),
    [year, tehran, other, tehranLabel, otherLabel, tehranColor, otherColor],
  );
  return <ChartHost aspect={1} minWidth={96} minHeight={96} overflow="visible" build={build} />;
}
