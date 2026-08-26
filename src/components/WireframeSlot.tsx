import type { SectionFrame } from "../data/section-frames";

type Props = {
  frame: SectionFrame;
};

export function WireframeSlot({ frame }: Props) {
  return (
    <section
      id={frame.id}
      data-reveal
      dir="rtl"
      className="relative scroll-mt-annual overflow-hidden px-6 py-20 sm:px-12 sm:py-28"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0612] via-[#3d0a28] to-[#1a0612]" />
      <div className="pointer-events-none absolute start-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink/25 blur-[120px]" aria-hidden="true" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <span className="font-fanum inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold text-white/85 backdrop-blur-md">
          <span className="size-1.5 animate-pulse rounded-full bg-[#ff6bcb]" />
          فصل {frame.phase} · به‌زودی روی صحنه
        </span>
        <h2
          className="font-fanum m-0 font-black leading-tight text-transparent"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            backgroundImage: "linear-gradient(120deg,#fff 10%,#ffb6de 45%,#ec078d 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          {frame.label}
        </h2>
        <p className="font-fanum m-0 max-w-lg text-[14px] leading-8 text-white/65 sm:text-[15px]">
          این فصل هنوز قفل است. بعد از تأیید فصل‌های فعلی، با همان دقت ادیتوریال و دارایی‌های فیگما باز می‌شود.
        </p>
        <div className="mt-2 h-px w-40 bg-gradient-to-l from-transparent via-[#ff6bcb] to-transparent" />
      </div>
    </section>
  );
}
