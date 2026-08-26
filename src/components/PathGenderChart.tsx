import { useEffect, useMemo, useRef } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { PATH } from "../content/annual-report";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const TRACK = "#d9d7d6";
const BAR_H = 8;
const TRACK_H = 8;

const trackPlugin: Plugin<"bar"> = {
  id: "pathGenderTracks",
  beforeDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    const area = chart.chartArea;
    const ctx = chart.ctx;
    if (!meta.data.length || !area) return;
    ctx.save();
    ctx.fillStyle = TRACK;
    for (const el of meta.data) {
      const y = el.y;
      const r = TRACK_H / 2;
      const x0 = area.left;
      const x1 = area.right;
      ctx.beginPath();
      ctx.roundRect(x0, y - r, x1 - x0, TRACK_H, r);
      ctx.fill();
    }
    ctx.restore();
  },
};

type Props = {
  active: boolean;
};

export function PathGenderChart({ active }: Props) {
  const started = useRef(false);

  const data = useMemo<ChartData<"bar">>(
    () => ({
      labels: ["women", "men"],
      datasets: [
        {
          data: active || started.current ? [PATH.gender.womenPct, PATH.gender.menPct] : [0, 0],
          backgroundColor: ["#EC078D", "#1A1A1A"],
          borderRadius: BAR_H / 2,
          borderSkipped: false,
          barThickness: BAR_H,
          maxBarThickness: BAR_H,
          categoryPercentage: 0.45,
          barPercentage: 0.45,
        },
      ],
    }),
    [active],
  );

  useEffect(() => {
    if (active) started.current = true;
  }, [active]);

  const options = useMemo<ChartOptions<"bar">>(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1400,
        easing: "easeOutCubic",
      },
      layout: {
        padding: { top: 16, bottom: 16, left: 0, right: 0 },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          display: false,
          grid: { display: false, drawBorder: false },
          border: { display: false },
        },
        y: {
          display: false,
          grid: { display: false, drawBorder: false },
          border: { display: false },
        },
      },
    }),
    [],
  );

  return <Bar data={data} options={options} plugins={[trackPlugin]} />;
}
