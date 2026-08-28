export function WarFooter() {
  return (
    <footer dir="rtl" className="relative overflow-hidden pb-[5.75rem] sm:pb-[6.5rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a0618] via-[#6b0a3f] to-[#ec078d]" />
      <div className="pointer-events-none absolute -start-20 top-0 size-[28rem] rounded-full bg-[#ff6bcb]/30 blur-[100px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -end-16 bottom-0 size-[24rem] rounded-full bg-white/10 blur-[90px]" aria-hidden="true" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-6 px-6 py-16 text-center sm:py-20">
        <div className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-md">
          <span className="font-fanum text-[12px] font-bold text-white/85">
            گزارش ۲ جنگ و یک اینترنت خاموش
          </span>
        </div>
        <img
          src="/assets/khanoumi-logo.svg"
          alt=""
          width={140}
          height={58}
          className="h-11 w-auto brightness-0 invert"
        />
        <p className="font-fanum m-0 max-w-2xl text-[clamp(18px,3vw,28px)] font-black leading-snug text-white">
          در ۱۴۰۴ چگونه از زندگی مراقبت کردیم؟
          <span className="mt-2 block text-[clamp(14px,2vw,18px)] font-bold text-white/75">
            به روایت داده‌ها
          </span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/war-report.pdf"
            download
            className="font-fanum inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-pink no-underline shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            دانلود PDF گزارش جنگ
          </a>
          <a
            href="/"
            className="font-fanum inline-flex rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline backdrop-blur-md transition-colors duration-300 hover:bg-white/20"
          >
            گزارش سال ۱۴۰۴
          </a>
          <a
            href="#start"
            className="font-fanum inline-flex rounded-full px-4 py-3 text-sm font-bold text-white/75 no-underline hover:text-white"
          >
            بازگشت به آغاز ↑
          </a>
        </div>
        <p className="font-fanum m-0 text-[12px] text-white/50">خانومی · ۱۴۰۴</p>
      </div>
    </footer>
  );
}
