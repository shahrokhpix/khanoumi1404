type ChapterHeroProps = {
  chapter: string;
  title: string;
  image: string;
  imageAlt?: string;
  icon?: string;
  iconClassName?: string;
};

function splitChapterTitle(title: string): { main: string; subtitle: string | null } {
  const idx = title.indexOf(" / ");
  if (idx === -1) return { main: title, subtitle: null };
  return {
    main: title.slice(0, idx),
    subtitle: title.slice(idx + 3),
  };
}

function chapterDigit(chapter: string): string {
  return chapter.replace(/^فصل\s*/u, "").trim();
}

export function ChapterHero({
  chapter,
  title,
  image,
  imageAlt = "",
  icon,
  iconClassName = "size-[clamp(2rem,5.5vw,2.75rem)] shrink-0 object-contain brightness-0 invert drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)]",
}: ChapterHeroProps) {
  const { main, subtitle } = splitChapterTitle(title);
  const digit = chapterDigit(chapter);

  return (
    <div className="chapter-hero relative -mx-4 mb-8 sm:-mx-10 sm:mb-10 lg:-mx-[80px]">
      <div className="relative isolate min-h-[min(52dvh,28rem)] w-full sm:min-h-[min(58dvh,32rem)] lg:min-h-[min(62dvh,36rem)]">
        <img
          src={image}
          alt={imageAlt}
          width={1920}
          height={640}
          className="absolute inset-0 size-full object-cover object-center"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"
          aria-hidden="true"
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.1]" aria-hidden="true" />

        <div
          dir="rtl"
          className="absolute inset-0 z-10 flex flex-col justify-start px-4 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12"
        >
          <div className="chapter-hero-card font-fanum max-w-[min(100%,32rem)] rounded-2xl px-5 py-4 text-white sm:px-6 sm:py-5">
            <div className="chapter-hero-text flex items-center gap-3">
              {icon ? (
                <img src={icon} alt="" width={44} height={44} className={iconClassName} decoding="async" />
              ) : null}
              <p className="m-0 text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-none">{digit}</p>
            </div>
            <p className="chapter-hero-text m-0 mt-2 text-[clamp(1.1rem,2.4vw,1.75rem)] font-bold leading-snug">
              {main}
            </p>
            {subtitle ? (
              <p className="chapter-hero-text m-0 mt-3 border-t border-white/35 pt-3 text-[clamp(1rem,2vw,1.35rem)] font-semibold leading-snug">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
