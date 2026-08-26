import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBookOpen,
  faBoxOpen,
  faChartLine,
  faEye,
  faHandshake,
  faHeart,
  faHouse,
  faTruck,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ANNUAL_NAV } from "../content/annual-report";

const NAV_ICONS: Record<string, IconDefinition> = {
  start: faHouse,
  preface: faBookOpen,
  glance: faEye,
  path: faChartLine,
  csr: faHeart,
  users: faUsers,
  products: faBoxOpen,
  partners: faHandshake,
  ops: faTruck,
};

export function HeroNavWireframe() {
  return (
    <nav
      aria-label="فصول گزارش — وایر‌فریم"
      dir="rtl"
      className="relative z-10 border-t-2 border-dashed border-[#DA1984] bg-[repeating-linear-gradient(-45deg,#fff_0_12px,#f7f2f5_12px_24px)]"
    >
      <p className="font-fanum pointer-events-none absolute start-3 top-1 m-0 text-[11px] font-bold text-[#DA1984]">
        ناو — وایر‌فریم
      </p>
      <div className="flex gap-2 overflow-x-auto px-4 py-4 sm:justify-between sm:gap-3 sm:px-10 lg:px-[70px]">
        {ANNUAL_NAV.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={item.label}
            title={item.label}
            className="box-border flex size-12 shrink-0 items-center justify-center rounded-xl no-underline sm:size-14"
            style={{
              border: i === 0 ? "none" : "2px dashed #DA1984",
              background: i === 0 ? "#DA1984" : "rgba(255,255,255,0.7)",
              color: i === 0 ? "#fff" : "#DA1984",
            }}
          >
            <FontAwesomeIcon icon={NAV_ICONS[item.id] ?? faHouse} className="text-base sm:text-xl" />
          </a>
        ))}
      </div>
    </nav>
  );
}
