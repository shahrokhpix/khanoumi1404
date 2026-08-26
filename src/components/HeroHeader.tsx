import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faDownload } from "@fortawesome/free-solid-svg-icons";

export function HeroHeader() {
  return (
    <header
      dir="ltr"
      className="relative z-20 flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-8 sm:py-4 lg:h-[103px] lg:px-[72px] lg:py-0"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <a
          href="/annual-report.pdf"
          download
          dir="rtl"
          className="font-fanum inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#DA1984] px-3 text-sm font-bold text-white no-underline sm:h-[52px] sm:gap-2.5 sm:px-4 sm:text-lg"
        >
          <FontAwesomeIcon icon={faDownload} className="text-sm sm:text-lg" />
          دانلود PDF
        </a>
        <a
          href="#preface"
          aria-label="شروع مطالعه"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] border-[1.5px] border-[#DA1984] bg-white text-[#DA1984] sm:size-[52px]"
        >
          <FontAwesomeIcon icon={faBookOpen} className="text-sm sm:text-lg" />
        </a>
      </div>
      <a href="#start" aria-label="خانومی" className="inline-flex shrink-0 items-center">
        <img
          src="/assets/khanoumi-logo.svg"
          alt="خانومی"
          width={123}
          height={52}
          className="h-8 w-auto sm:h-10 lg:h-[52px]"
        />
      </a>
    </header>
  );
}
