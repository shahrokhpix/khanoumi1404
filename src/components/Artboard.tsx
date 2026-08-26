import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Artboard({ children }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-[1920px] overflow-hidden bg-white shadow-[0_0_160px_rgba(236,7,141,0.28),0_0_1px_rgba(255,255,255,0.4)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-l from-transparent via-[#ff6bcb] to-transparent"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
