import { useEffect, useRef } from "react";
import type { SvgChart } from "../../charts/types";
import { observeRevealOnce } from "../../lib/useRevealOnce";

type Props = {
  className?: string;
  aspect?: number | ((width: number) => number);
  minWidth?: number;
  minHeight?: number;
  overflow?: "hidden" | "visible";
  build: (width: number, height: number) => SvgChart;
};

export function ChartHost({
  className = "",
  aspect = 1,
  minWidth = 220,
  minHeight = 220,
  overflow = "hidden",
  build,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SvgChart | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastW = 0;

    const draw = () => {
      const w = Math.max(minWidth, Math.round(el.clientWidth || minWidth));
      if (Math.abs(w - lastW) < 2 && chartRef.current) return;
      lastW = w;
      const ratio = typeof aspect === "function" ? aspect(w) : aspect;
      const h = Math.max(minHeight, Math.round(w * ratio));
      chartRef.current?.destroy();
      const chart = build(w, h);
      chart.mount(el);
      chartRef.current = chart;
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    return () => {
      ro.disconnect();
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [aspect, minWidth, minHeight, build]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    return observeRevealOnce([wrap], "users-in", { threshold: 0.15, rootMargin: "40px 0px" });
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <div ref={ref} className={`w-full ${overflow === "visible" ? "overflow-visible" : "overflow-hidden"}`} />
    </div>
  );
}
