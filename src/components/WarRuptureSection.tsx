import { CHAPTER2 } from "../content/war-report";
import { useRevealOnce } from "../lib/useRevealOnce";

const BRAND = "#EC078D";

function useInView<T extends HTMLElement>() {
  const { ref, visible } = useRevealOnce<T>({ threshold: 0.25 });
  return { ref, on: visible };
}

function RuptureSplitBar() {
  const { ref, on } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="mx-auto mt-10 w-full max-w-[1000px]">
      <h3 className="font-fanum m-0 text-center text-[clamp(1.15rem,2.3vw,1.65rem)] font-bold text-black">
        {CHAPTER2.ruptureChartTitle}
      </h3>
      <div className="mx-auto mt-8 max-w-[820px] overflow-hidden rounded-full bg-[#f6f3f1] shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]">
        <div
          className="flex min-h-[4.5rem] text-center font-bold text-white transition-transform duration-1000 ease-out sm:min-h-[5.25rem]"
          style={{ transform: on ? "scaleX(1)" : "scaleX(0)", transformOrigin: "100% 50%" }}
        >
          <div className="font-fanum flex w-[32%] items-center justify-center px-3 py-4 text-[clamp(12px,1.7vw,16px)] leading-snug sm:px-4 sm:py-5" style={{ background: "#3a3a3a" }}>
            {CHAPTER2.ruptureCancel}
          </div>
          <div className="font-fanum flex w-[68%] items-center justify-center px-3 py-4 text-[clamp(12px,1.7vw,16px)] leading-snug sm:px-4 sm:py-5" style={{ background: BRAND }}>
            {CHAPTER2.ruptureDelivery}
          </div>
        </div>
      </div>
      <figure className="m-0 mt-10 overflow-hidden rounded-[1.5rem] bg-black sm:rounded-[2rem]">
        <img
          src="/assets/photos/img_07_1949x1032.jpeg"
          alt={CHAPTER2.palizi}
          className="aspect-[1949/1032] w-full object-cover"
          loading="lazy"
        />
        <figcaption className="font-fanum px-4 py-4 text-center text-[12px] font-bold leading-6 text-white sm:px-6 sm:text-[14px]">
          {CHAPTER2.palizi}
        </figcaption>
      </figure>
    </div>
  );
}

export function WarRuptureSection() {
  return (
    <section
      id="rupture"
      data-reveal
      dir="rtl"
      className="scroll-mt-annual relative overflow-hidden bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-[100px] lg:py-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-fanum war-section-title m-0 text-center text-pink">
          {CHAPTER2.ruptureTitle}
        </h2>
        <div className="font-fanum mx-auto mt-5 max-w-[48rem] space-y-4 text-center text-[clamp(14px,1.6vw,17px)] leading-8 text-black/80">
          <p className="m-0">{CHAPTER2.ruptureP1}</p>
          <p className="m-0">{CHAPTER2.ruptureP2}</p>
        </div>

        <RuptureSplitBar />
      </div>
    </section>
  );
}
