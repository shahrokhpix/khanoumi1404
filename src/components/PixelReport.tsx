import { useEffect, useRef, useState } from "react";
import { DESIGN_H, DESIGN_W, type Hotspot } from "../data/pixel-reports";

type Slice = { src: string; top: number; height: number };

type Props = {
  title: string;
  slices: Slice[];
  hotspots: Hotspot[];
  sentinels: { id: string; y: number }[];
};

export function PixelReport({ title, slices, hotspots, sentinels }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / DESIGN_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={wrapRef}
      dir="ltr"
      className="relative mx-auto w-full max-w-[1920px] overflow-hidden bg-white"
      style={{ height: DESIGN_H * scale }}
    >
      <h1 className="sr-only">{title}</h1>
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: DESIGN_W, height: DESIGN_H, transform: `scale(${scale})` }}
      >
        {slices.map((slice, i) => (
          <img
            key={slice.src}
            src={slice.src}
            alt=""
            width={DESIGN_W}
            height={slice.height}
            className="absolute left-0 block max-w-none"
            style={{ top: slice.top, width: DESIGN_W, height: slice.height }}
            loading={i < 2 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
        {sentinels.map((s) => (
          <div key={s.id} id={s.id} className="absolute left-0 h-px w-px" style={{ top: s.y }} />
        ))}
        {hotspots.map((h) => {
          const style = { left: h.x, top: h.y, width: h.w, height: h.h };
          const className =
            "absolute z-10 cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink";
          if (h.type === "link") {
            return (
              <a
                key={`${h.label}-${h.x}-${h.y}`}
                href={h.href}
                download={h.download || undefined}
                aria-label={h.label}
                className={className}
                style={style}
              />
            );
          }
          return (
            <button
              key={`${h.label}-${h.x}-${h.y}`}
              type="button"
              aria-label={h.label}
              className={className}
              style={style}
              onClick={() => scrollToId(h.target)}
            />
          );
        })}
      </div>
    </div>
  );
}
