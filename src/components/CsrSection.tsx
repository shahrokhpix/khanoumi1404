import { CSR } from "../content/annual-report";
import { ChapterHero } from "./ChapterHero";

const externalLinkProps = {
  target: "_blank" as const,
  rel: "noopener noreferrer",
};

function BookVisual({ src, alt, href }: { src: string; alt: string; href?: string }) {
  const frame = (
    <div className="mx-auto aspect-[4/3] w-full max-w-[34rem] overflow-hidden rounded-[1.35rem] border border-white/80 bg-[#f7e8f0] shadow-[0_18px_46px_rgba(166,0,98,0.14)] transition-transform duration-300 sm:rounded-[1.6rem] group-hover:-translate-y-0.5 group-hover:shadow-[0_22px_52px_rgba(166,0,98,0.2)]">
      <img
        src={src}
        alt={alt}
        className="block size-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  if (!href) return frame;

  return (
    <a href={href} className="group mx-auto block w-full max-w-[34rem] no-underline" {...externalLinkProps}>
      {frame}
    </a>
  );
}

const panelClass =
  "glass-panel flex min-w-0 flex-col rounded-[1.5rem] p-4 text-center sm:rounded-[1.75rem] sm:p-6 xl:p-8";

export function CsrSection() {
  return (
    <section
      id="csr"
      data-reveal
      dir="rtl"
      className="section-band-mist relative scroll-mt-annual overflow-hidden px-4 py-16 sm:px-10 lg:px-[80px] lg:py-20"
    >
      <ChapterHero
        chapter={CSR.chapter}
        title={CSR.title}
        image={CSR.heroImage}
        imageAlt={CSR.title}
        icon={CSR.icon}
      />
      <p className="font-fanum mx-auto mt-6 max-w-[58rem] text-center text-[clamp(14px,1.7vw,18px)] font-medium leading-[2] text-black/75">
        {CSR.lead}
      </p>

      <div className="mx-auto mt-10 grid w-full max-w-[1440px] grid-cols-1 items-stretch gap-5 lg:mt-14 lg:grid-cols-2 lg:gap-6 xl:gap-8">
        <article className={panelClass}>
          <h3 className="font-fanum m-0 mb-4 text-[15px] font-bold leading-7 text-black sm:mb-5 sm:text-[16px] lg:text-[17px]">
            {CSR.life.title}
          </h3>
          <BookVisual src={CSR.life.book} alt={CSR.life.bookAlt} href={CSR.life.bookHref} />
        </article>

        <article className={panelClass}>
          <h3 className="font-fanum m-0 mb-4 text-[15px] font-bold leading-7 text-black sm:mb-5 sm:text-[16px] lg:text-[17px]">
            {CSR.business.bookTitle}
          </h3>
          <BookVisual src={CSR.business.book} alt={CSR.business.bookAlt} href={CSR.business.bookHref} />
        </article>

        <article className={panelClass}>
          <h3 className="font-fanum m-0 text-[15px] font-bold leading-7 text-black sm:text-[16px] lg:text-[17px]">
            {CSR.life.careTitle}
          </h3>
          <a
            href={CSR.life.careHref}
            className="group mx-auto mt-4 block w-fit max-w-full no-underline transition-transform duration-300 hover:-translate-y-0.5"
            {...externalLinkProps}
          >
            <p className="font-fanum relative z-0 mx-3 m-0 flex items-baseline justify-center gap-x-2 whitespace-nowrap rounded-t-[28px] bg-gradient-to-l from-[#ec078d] to-[#a60062] px-3 pb-8 pt-2.5 text-white shadow-[0_8px_24px_rgba(236,7,141,0.25)] transition-shadow duration-300 group-hover:shadow-[0_12px_28px_rgba(236,7,141,0.35)] sm:mx-5">
              <span className="text-[clamp(10px,2.8vw,15px)] font-bold leading-none">{CSR.life.careLabel}</span>
              <span className="text-[clamp(10px,2.8vw,15px)] font-bold leading-none opacity-80" aria-hidden="true">
                |
              </span>
              <span className="text-[clamp(9px,2.4vw,12px)] font-bold leading-none">{CSR.life.careNote}</span>
            </p>
            <ul dir="ltr" className="relative z-10 -mt-6 flex items-stretch justify-center gap-2 sm:gap-3">
              {CSR.life.posts.map((post) => (
                <li
                  key={post.src}
                  className="min-w-0 w-[28vw] max-w-[168px] transition-transform duration-500 group-hover:-translate-y-1 lg:w-[168px]"
                >
                  <img
                    src={post.src}
                    alt={post.alt}
                    className="aspect-[9/16] h-auto w-full rounded-[18px] object-cover shadow-[0_16px_36px_rgba(0,0,0,0.28)] ring-1 ring-white/60"
                  />
                </li>
              ))}
            </ul>
          </a>
        </article>

        <article className={panelClass}>
          <h3 className="font-fanum m-0 text-[15px] font-bold leading-7 text-black sm:text-[16px] lg:text-[17px]">
            {CSR.business.title}
          </h3>
          <ul dir="ltr" className="mt-6 flex items-start justify-center gap-4 sm:gap-6">
            {CSR.business.reports.map((report) => (
              <li
                key={report.alt}
                className="flex min-w-0 w-[42%] max-w-[240px] flex-col items-center"
              >
                <a
                  href={CSR.business.reportsHref}
                  className="group flex w-full flex-col items-center no-underline transition-transform duration-500 hover:-translate-y-1"
                  {...externalLinkProps}
                >
                  <p className="font-fanum relative z-0 m-0 flex h-[8.5rem] w-[5.75rem] shrink-0 flex-col items-center rounded-t-[20px] bg-gradient-to-b from-[#ff4fb8] to-[#a60062] px-1.5 pt-2.5 text-center text-[11px] font-bold leading-[1.25] text-white shadow-[0_8px_20px_rgba(236,7,141,0.3)] transition-shadow duration-300 group-hover:shadow-[0_12px_26px_rgba(236,7,141,0.38)] sm:h-[9.5rem] sm:w-[6.5rem] sm:text-[12px] lg:h-[10.5rem] lg:w-[7rem] lg:text-[13px]">
                    {report.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  <img
                    src={report.image}
                    alt={report.alt}
                    className="relative z-10 -mt-[5.25rem] block h-[140px] w-auto max-w-full object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.28)] sm:-mt-[6rem] sm:h-[168px] lg:-mt-[6.75rem]"
                  />
                </a>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
