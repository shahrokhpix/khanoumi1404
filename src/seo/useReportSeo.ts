import { useEffect } from "react";
import { buildReportJsonLd } from "./jsonld";
import { applyDocumentSeo } from "./meta";
import { seoForPath, type ReportRoute } from "./reports";
import { absoluteUrl, SITE } from "./site";

export function useReportSeo(path: ReportRoute) {
  useEffect(() => {
    window.scrollTo(0, 0);

    const seo = seoForPath(path);
    const canonical = absoluteUrl(seo.path);
    const image = absoluteUrl(seo.image);

    applyDocumentSeo({
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      canonical,
      image,
      imageAlt: seo.imageAlt,
      locale: SITE.locale,
      siteName: SITE.name,
      ogType: "article",
      alternate: seo.alternatePath
        ? {
            href: absoluteUrl(seo.alternatePath),
            hreflang: "fa",
            title: seo.alternateTitle ?? "",
          }
        : undefined,
      jsonLd: buildReportJsonLd(seo, canonical, image),
    });
  }, [path]);
}
