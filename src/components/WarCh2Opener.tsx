import { CHAPTER2 } from "../content/war-report";

export function WarCh2Opener() {
  return (
    <section id="ch2" data-reveal className="relative overflow-hidden bg-white">
      <div className="relative isolate min-h-[min(72dvh,40rem)] w-full lg:min-h-[min(78dvh,48rem)]">
        <img
          src="/assets/war/ch2-opener.jpg"
          alt={CHAPTER2.nazmabad}
          width={4014}
          height={2060}
          className="absolute inset-0 size-full object-cover object-[center_45%]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"
          aria-hidden="true"
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true" />

        <div
          dir="rtl"
          className="absolute inset-0 z-10 flex flex-col px-4 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12"
        >
          <div className="max-w-[min(100%,32rem)] rounded-2xl bg-black/70 px-5 py-4 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-6 sm:py-5">
            <p className="font-fanum m-0 text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-none">{CHAPTER2.num}</p>
            <p className="font-fanum m-0 mt-2 text-[clamp(1.1rem,2.4vw,1.75rem)] font-bold leading-snug">
              {CHAPTER2.title}
            </p>
            <p className="font-fanum m-0 mt-3 border-t border-white/20 pt-3 text-[clamp(1rem,2vw,1.35rem)] font-semibold leading-snug">
              {CHAPTER2.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div dir="rtl" className="mx-auto max-w-[1100px] px-4 py-12 sm:px-10 sm:py-14 lg:px-[100px] lg:py-16">
        <p className="font-fanum mx-auto max-w-[48rem] text-center text-[clamp(14px,1.7vw,18px)] leading-8 text-black/80">
          {CHAPTER2.intro}
        </p>
        <p className="font-fanum mx-auto mt-6 max-w-[40rem] text-center text-[clamp(14px,1.6vw,17px)] font-bold leading-8 text-black">
          {CHAPTER2.seven}
        </p>

        <ul className="mt-10 grid list-none grid-cols-2 gap-4 p-0 sm:mt-12 sm:grid-cols-3 lg:grid-cols-7 lg:gap-3">
          {CHAPTER2.indices.map((item) => (
            <li key={item.title} className="flex flex-col items-center text-center">
              <div className="flex size-[5.5rem] items-center justify-center rounded-full bg-gradient-to-br from-[#ff4fb8] to-[#a60062] px-2 shadow-[0_10px_24px_rgba(236,7,141,0.3)] sm:size-24">
                <span className="font-fanum text-[12px] font-bold leading-5 text-white sm:text-[13px]">{item.title}</span>
              </div>
              <p className="font-fanum m-0 mt-3 max-w-[11rem] text-[11px] leading-6 text-black/60 sm:text-[12px]">
                {item.caption}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
