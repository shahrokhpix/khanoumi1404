import type { ReportSeo } from "./reports";
import { absoluteUrl, SITE } from "./site";

export function buildReportJsonLd(seo: ReportSeo, canonical: string, image: string) {
  const siteRoot = absoluteUrl("/");
  const logoUrl = absoluteUrl(SITE.logo);

  const publisher = {
    "@type": "Organization",
    name: SITE.name,
    alternateName: SITE.nameEn,
    url: siteRoot,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
    },
  };

  const report: Record<string, unknown> = {
    "@type": "Report",
    "@id": `${canonical}#report`,
    name: seo.reportName,
    alternateName: seo.reportAlternateName,
    description: seo.description,
    inLanguage: "fa-IR",
    url: canonical,
    image,
    publisher,
    isAccessibleForFree: true,
    about: {
      "@type": "Thing",
      name: seo.path === "/war" ? "رفتار مصرف‌کننده در بحران" : "گزارش سالانه کسب‌وکار",
    },
  };

  if (seo.pdfPath) {
    report.encoding = {
      "@type": "MediaObject",
      contentUrl: absoluteUrl(seo.pdfPath),
      encodingFormat: "application/pdf",
    };
  }

  const webPage = {
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: seo.title,
    description: seo.description,
    inLanguage: "fa-IR",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteRoot}#website`,
      name: SITE.name,
      url: siteRoot,
      inLanguage: "fa-IR",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: image,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE.name,
          item: siteRoot,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: seo.reportName,
          item: canonical,
        },
      ],
    },
  };

  const sections = seo.sectionAnchors.map((section, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: section.name,
    url: `${canonical}#${section.id}`,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [publisher, webPage, report, {
      "@type": "ItemList",
      "@id": `${canonical}#sections`,
      name: "فصل‌های گزارش",
      itemListElement: sections,
    }],
  };
}
