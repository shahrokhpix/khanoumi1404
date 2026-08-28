/** Public site origin for canonical URLs and sitemap (set at deploy time). */
export function getSiteOrigin(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL as string | undefined;
  if (fromEnv?.trim()) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function absoluteUrl(path: string): string {
  const origin = getSiteOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${normalized}` : normalized;
}

export const SITE = {
  name: "خانومی",
  nameEn: "Khanoumi",
  locale: "fa_IR",
  language: "fa",
  themeColor: "#EC078D",
  logo: "/assets/khanoumi-logo.svg",
  twitterSite: "@khanoumi",
} as const;
