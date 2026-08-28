import { SITE } from "./site";

function upsertMeta(selector: string, create: () => HTMLMetaElement, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const parts = [`link[rel="${rel}"]`];
  if (extra?.hreflang) parts.push(`[hreflang="${extra.hreflang}"]`);
  let el = document.head.querySelector<HTMLLinkElement>(parts.join(""));
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (extra?.hreflang) el.hreflang = extra.hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export type AppliedSeo = {
  title: string;
  description: string;
  canonical: string;
  image: string;
};

export function applyDocumentSeo(input: {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  image: string;
  imageAlt: string;
  locale: string;
  siteName: string;
  ogType: string;
  alternate?: { href: string; hreflang: string; title: string };
  jsonLd: object;
}): AppliedSeo {
  document.title = input.title;
  document.documentElement.lang = "fa";
  document.documentElement.dir = "rtl";

  upsertMeta('meta[name="description"]', () => {
    const m = document.createElement("meta");
    m.name = "description";
    return m;
  }, input.description);

  upsertMeta('meta[name="keywords"]', () => {
    const m = document.createElement("meta");
    m.name = "keywords";
    return m;
  }, input.keywords);

  upsertMeta('meta[name="robots"]', () => {
    const m = document.createElement("meta");
    m.name = "robots";
    return m;
  }, "index, follow, max-image-preview:large");

  upsertMeta('meta[name="author"]', () => {
    const m = document.createElement("meta");
    m.name = "author";
    return m;
  }, input.siteName);

  upsertMeta('meta[name="theme-color"]', () => {
    const m = document.createElement("meta");
    m.name = "theme-color";
    return m;
  }, "#EC078D");

  upsertLink("canonical", input.canonical);

  const ogPairs: [string, string][] = [
    ["og:title", input.title],
    ["og:description", input.description],
    ["og:type", input.ogType],
    ["og:url", input.canonical],
    ["og:image", input.image],
    ["og:image:alt", input.imageAlt],
    ["og:locale", input.locale],
    ["og:site_name", input.siteName],
  ];
  for (const [property, content] of ogPairs) {
    upsertMeta(`meta[property="${property}"]`, () => {
      const m = document.createElement("meta");
      m.setAttribute("property", property);
      return m;
    }, content);
  }

  const twitterPairs: [string, string][] = [
    ["twitter:card", "summary_large_image"],
    ["twitter:site", SITE.twitterSite],
    ["twitter:title", input.title],
    ["twitter:description", input.description],
    ["twitter:image", input.image],
    ["twitter:image:alt", input.imageAlt],
  ];
  for (const [name, content] of twitterPairs) {
    upsertMeta(`meta[name="${name}"]`, () => {
      const m = document.createElement("meta");
      m.name = name;
      return m;
    }, content);
  }

  if (input.alternate) {
    upsertLink("alternate", input.alternate.href, { hreflang: input.alternate.hreflang });
  }

  upsertJsonLd("report-jsonld", input.jsonLd);

  return {
    title: input.title,
    description: input.description,
    canonical: input.canonical,
    image: input.image,
  };
}
