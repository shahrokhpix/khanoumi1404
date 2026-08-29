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
      <h2 className="font-fanum m-0 text-center text-[clamp(22px,2.8vw,32px)] font-black leading-tight text-pink">
        {GLANCE.title}
      </h2>
      <div className="font-fanum mx-auto mt-8 flex w-[min(100%,42rem)] flex-col items-center justify-center rounded-[2rem] bg-gradient-to-l from-[#ec078d] via-[#da1984] to-[#a60062] px-[clamp(18px,4vw,44px)] py-[clamp(18px,2.8vw,30px)] text-center font-bold text-white shadow-[0_16px_40px_rgba(236,7,141,0.35)]">
        <p className="m-0 whitespace-nowrap text-[clamp(18px,2.2vw,28px)] leading-tight">
          {GLANCE.salesLead}
        </p>
        <p className="m-0 mt-2 whitespace-nowrap text-[clamp(38px,6vw,68px)] font-black leading-none tracking-tight">
          {GLANCE.salesValue}
        </p>
        <p className="m-0 mt-3 whitespace-nowrap text-[clamp(11px,1.7vw,18px)] leading-snug text-white/90">
          {GLANCE.salesComparison}
        </p>
      </div>
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
