import { CHAPTER1 } from "../content/war-report";

export function WarCh1Opener() {
  return (
    <section id="ch1" data-reveal className="relative overflow-hidden bg-[#12030c]">
      <div className="relative isolate min-h-[min(72dvh,40rem)] w-full lg:min-h-[min(78dvh,48rem)]">
        <img
          src="/assets/photos/img_02_2733x1401.jpeg"
          alt={CHAPTER1.caption}
          width={2733}
          height={1401}
          className="absolute inset-0 size-full object-cover object-[center_40%]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25"
          aria-hidden="true"
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true" />

        <div
          dir="rtl"
          className="absolute inset-0 z-10 flex flex-col justify-between px-4 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12"
        >
          <div className="max-w-[min(100%,32rem)] rounded-2xl bg-black/70 px-5 py-4 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-6 sm:py-5">
            <p className="font-fanum m-0 text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-none text-white">
              {CHAPTER1.num}
            </p>
            <p className="font-fanum m-0 mt-2 text-[clamp(1.1rem,2.4vw,1.75rem)] font-bold leading-snug">
              {CHAPTER1.title}
            </p>
            <p className="font-fanum m-0 mt-3 border-t border-white/20 pt-3 text-[clamp(1rem,2vw,1.35rem)] font-semibold leading-snug">
              {CHAPTER1.subtitle}
            </p>
          </div>

          <p className="font-fanum m-0 max-w-[min(100%,36rem)] rounded-xl border border-white/20 bg-white/92 px-4 py-3 text-[clamp(12px,1.5vw,15px)] font-bold leading-7 text-black shadow-[0_10px_28px_rgba(0,0,0,0.25)] sm:px-5">
            {CHAPTER1.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
