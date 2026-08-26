import { GLANCE } from "../content/annual-report";

export function GlanceSection() {
  return (
    <section
      id="glance"
      data-reveal
      dir="rtl"
      className="section-band-mist relative scroll-mt-annual overflow-hidden px-4 py-16 sm:px-10 lg:px-[80px] lg:py-20"
    >
      <div
        className="pointer-events-none absolute -end-20 top-10 size-[22rem] rounded-full bg-pink/15 blur-[90px]"
        aria-hidden="true"
      />
      <div className="mb-5 flex justify-center">
        <span className="font-fanum rounded-full border border-pink/20 bg-white/70 px-4 py-1 text-[12px] font-bold text-pink shadow-sm backdrop-blur">
          فصل ۰۲
        </span>
      </div>
      <h2 className="font-fanum m-0 text-center text-[clamp(22px,2.8vw,32px)] font-black leading-tight text-ink">
        {GLANCE.title}
      </h2>
      <p className="font-fanum mx-auto mt-8 flex w-fit max-w-full items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-l from-[#ec078d] via-[#da1984] to-[#a60062] px-[clamp(14px,3vw,36px)] py-[clamp(12px,1.7vw,20px)] font-bold leading-none text-white shadow-[0_16px_40px_rgba(236,7,141,0.35)] lg:min-h-[99px]">
        <span className="text-[clamp(10px,calc(1.2vw+6px),25px)]">{GLANCE.salesLead}&nbsp;</span>
        <span className="text-[clamp(11px,calc(1.8vw+6px),36px)]">{GLANCE.salesNote}</span>
      </p>
      <ul className="glass-panel mx-auto mt-12 grid max-w-[1680px] grid-cols-2 gap-y-10 rounded-[2rem] px-3 py-8 sm:grid-cols-3 sm:px-6 lg:mt-14 lg:grid-cols-6 lg:gap-y-0 lg:px-4 lg:py-10">
        {GLANCE.kpis.map((kpi) => (
          <li
            key={kpi.label}
            className="group flex min-w-0 flex-col items-center px-2 text-center transition-transform duration-300 hover:-translate-y-1 lg:border-e lg:border-pink/10 lg:px-3 lg:last:border-e-0"
          >
            <div className="size-[72px] overflow-clip rounded-full bg-pink-mist/80 p-2 shadow-[0_8px_24px_rgba(236,7,141,0.12)] transition-shadow duration-300 group-hover:shadow-[0_12px_28px_rgba(236,7,141,0.22)] lg:size-[85px]">
              <img src={kpi.icon} alt="" width={85} height={85} className="size-full" aria-hidden="true" />
            </div>
            <p className="font-fanum m-0 mt-3 max-w-full whitespace-nowrap text-[11px] font-bold leading-none text-black sm:text-[14px] lg:text-[16px]">
              {kpi.label}
            </p>
            <p className="font-fanum m-0 mt-1 bg-gradient-to-l from-ink to-pink-deep bg-clip-text text-[26px] leading-none text-transparent sm:text-[32px] lg:text-[49px]">
              {kpi.value}
              {kpi.unit ? (
                <span className="mr-1 text-[16px] text-ink sm:text-[20px] lg:text-[30px]">{kpi.unit}</span>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
