import { ANNUAL_HERO } from "../content/annual-report";
import { HERO as WAR_HERO } from "../content/war-report";

export type ReportRoute = "/" | "/war";

export type ReportSeo = {
  path: ReportRoute;
  title: string;
  description: string;
  keywords: string;
  image: string;
  imageAlt: string;
  reportName: string;
  reportAlternateName?: string;
  pdfPath?: string;
  alternatePath?: ReportRoute;
  alternateTitle?: string;
  sectionAnchors: readonly { id: string; name: string }[];
};

export const ANNUAL_SEO: ReportSeo = {
  path: "/",
  title: "گزارش سال ۱۴۰۴ خانومی — سال حرکت در مسیر پایداری",
  description:
    "گزارش سال ۱۴۰۴ خانومی؛ روایت حرکت در مسیر پایداری به روایت داده‌ها. رشد فروش، کاربران، محصولات، CSR و عملیات در یک گزارش تعاملی.",
  keywords:
    "گزارش سال ۱۴۰۴, گزارش سالانه خانومی, خانومی, گزارش تعاملی, رشد فروش, پایداری, CSR, زیبایی و سلامت",
  image: "/assets/annual/wall.jpg",
  imageAlt: "گزارش سال ۱۴۰۴ خانومی — سال حرکت در مسیر پایداری",
  reportName: ANNUAL_HERO.title,
  reportAlternateName: ANNUAL_HERO.kicker,
  pdfPath: "/annual-report.pdf",
  alternatePath: "/war",
  alternateTitle: "گزارش جنگ خانومی — ۲ جنگ و یک اینترنت خاموش",
  sectionAnchors: [
    { id: "start", name: "آغاز" },
    { id: "preface", name: "پیش‌گفتار" },
    { id: "glance", name: "خانومی ۱۴۰۴ در یک نگاه" },
    { id: "path", name: "از رشد تا پایداری" },
    { id: "csr", name: "زنان پیشگام ایران" },
    { id: "users", name: "کاربران" },
    { id: "products", name: "محصولات" },
    { id: "partners", name: "برندها" },
    { id: "ops", name: "عملیات" },
  ],
};

export const WAR_SEO: ReportSeo = {
  path: "/war",
  title: "گزارش جنگ خانومی — در ۱۴۰۴ چگونه از زندگی مراقبت کردیم؟",
  description:
    "گزارش ۲ جنگ و یک اینترنت خاموش خانومی؛ به روایت داده‌ها. توقف زندگی، تاب‌آوری، مراقبت، لذت کوچک و جابه‌جایی استان‌ها در سال ۱۴۰۴.",
  keywords:
    "گزارش جنگ, خانومی, ۱۴۰۴, اینترنت خاموش, رفتار مصرف‌کننده, مراقبت, اضطراب, گزارش داده‌محور",
  image: "/assets/photos/A03I7482.jpg",
  imageAlt: WAR_HERO.title,
  reportName: WAR_HERO.kicker,
  reportAlternateName: WAR_HERO.title,
  pdfPath: "/war-report.pdf",
  alternatePath: "/",
  alternateTitle: "گزارش سال ۱۴۰۴ خانومی",
  sectionAnchors: [
    { id: "start", name: "آغاز" },
    { id: "crisis", name: "توقف زندگی" },
    { id: "zero", name: "ساعت صفر" },
    { id: "tehran", name: "تهران" },
    { id: "return", name: "بازگشت" },
    { id: "resilience", name: "تاب‌آوری" },
    { id: "channel", name: "مسیر ارتباط" },
    { id: "anxiety", name: "شاخص اضطراب" },
    { id: "care", name: "شاخص مراقبت" },
    { id: "joy", name: "شاخص لذت کوچک" },
    { id: "rupture", name: "شاخص گسست" },
    { id: "ukraine", name: "اوکراین و اثر رژ لب" },
    { id: "hold", name: "شاخص نگهداری" },
    { id: "provinces", name: "شاخص جابه‌جایی" },
  ],
};

export function seoForPath(path: string): ReportSeo {
  return path === "/war" ? WAR_SEO : ANNUAL_SEO;
}
