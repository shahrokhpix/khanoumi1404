/** Shared SEO constants for build-time HTML + sitemap generation. */
export const SITE = {
  name: "خانومی",
  nameEn: "Khanoumi",
  themeColor: "#EC078D",
  twitterSite: "@khanoumi",
};

export const ANNUAL_SEO = {
  path: "/",
  title: "گزارش سال ۱۴۰۴ خانومی — سال حرکت در مسیر پایداری",
  description:
    "گزارش سال ۱۴۰۴ خانومی؛ روایت حرکت در مسیر پایداری به روایت داده‌ها. رشد فروش، کاربران، محصولات، CSR و عملیات در یک گزارش تعاملی.",
  keywords:
    "گزارش سال ۱۴۰۴, گزارش سالانه خانومی, خانومی, گزارش تعاملی, رشد فروش, پایداری, CSR, زیبایی و سلامت",
  image: "/assets/annual/wall.jpg",
  imageAlt: "گزارش سال ۱۴۰۴ خانومی — سال حرکت در مسیر پایداری",
  alternatePath: "/war",
  alternateTitle: "گزارش جنگ خانومی — در ۱۴۰۴ چگونه از زندگی مراقبت کردیم؟",
};

export const WAR_SEO = {
  path: "/war",
  title: "گزارش جنگ خانومی — در ۱۴۰۴ چگونه از زندگی مراقبت کردیم؟",
  description:
    "گزارش ۲ جنگ و یک اینترنت خاموش خانومی؛ به روایت داده‌ها. توقف زندگی، تاب‌آوری، مراقبت، لذت کوچک و جابه‌جایی استان‌ها در سال ۱۴۰۴.",
  keywords:
    "گزارش جنگ, خانومی, ۱۴۰۴, اینترنت خاموش, رفتار مصرف‌کننده, مراقبت, اضطراب, گزارش داده‌محور",
  image: "/assets/photos/A03I7482.jpg",
  imageAlt: "گزارش ۲ جنگ و یک اینترنت خاموش خانومی",
  alternatePath: "/",
  alternateTitle: "گزارش سال ۱۴۰۴ خانومی — سال حرکت در مسیر پایداری",
};

export function absUrl(origin, path) {
  const base = (origin || "").replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}

export function patchSeoHtml(html, seo, origin) {
  const canonical = absUrl(origin, seo.path);
  const image = absUrl(origin, seo.image);
  const alternate = seo.alternatePath
    ? `<link rel="alternate" hreflang="fa" href="${absUrl(origin, seo.alternatePath)}" title="${seo.alternateTitle}" />`
    : "";

  const headBlock = `
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
    <meta name="keywords" content="${seo.keywords}" />
    <meta name="author" content="${SITE.name}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="${SITE.themeColor}" />
    <link rel="canonical" href="${canonical}" />
    ${alternate}
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${SITE.name}" />
    <meta property="og:locale" content="fa_IR" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${seo.imageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${SITE.twitterSite}" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${seo.imageAlt}" />
  `.trim();

  return html.replace(/<!-- SEO:HEAD -->[\s\S]*?<!-- \/SEO:HEAD -->/, headBlock);
}
