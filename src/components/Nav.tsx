export type NavItem = { id: string; label: string };

type ExtraLink = { href: string; label: string };

type Props = {
  brandHref?: string;
  items: readonly NavItem[];
  active: string;
  progress: number;
  menuOpen: boolean;
  onToggle: () => void;
  onNavigate: (id: string) => void;
  pdfHref: string;
  extra?: ExtraLink;
};

export function Nav({
  brandHref = "/",
  items,
  active,
  progress,
  menuOpen,
  onToggle,
  onNavigate,
  pdfHref,
  extra,
}: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div
        className="h-1 bg-pink-soft"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="پیشرفت مطالعه"
      >
        <div className="h-full bg-pink transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href={brandHref} className="text-[28px] font-extrabold leading-none text-pink">
          خانومی
        </a>
        <nav className="hidden flex-wrap items-center gap-1 text-[13px] lg:flex" aria-label="فصول گزارش">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`rounded-full px-3 py-1.5 transition-colors duration-200 ${
                active === item.id ? "bg-pink text-white" : "text-muted hover:bg-pink-mist hover:text-pink"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {extra ? (
            <a
              href={extra.href}
              className="hidden rounded-lg border border-pink px-3 py-2 text-sm font-semibold text-pink transition-colors duration-200 hover:bg-pink-mist sm:inline-flex"
            >
              {extra.label}
            </a>
          ) : null}
          <a
            href={pdfHref}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-pink px-3 py-2 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
          >
            دانلود PDF
          </a>
          <button
            type="button"
            className="rounded-lg border border-pink px-3 py-2 text-sm text-pink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={onToggle}
          >
            فهرست
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav id="mobile-nav" className="grid gap-1 border-t border-line bg-white px-4 py-3 lg:hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`rounded-lg px-3 py-2 ${active === item.id ? "bg-pink text-white" : "hover:bg-pink-mist"}`}
            >
              {item.label}
            </a>
          ))}
          {extra ? (
            <a href={extra.href} className="rounded-lg px-3 py-2 font-semibold text-pink">
              {extra.label}
            </a>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
