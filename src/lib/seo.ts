const SITE_NAME = "AI DIPLOMAP";
const SITE_URL = "https://ai-diplomap.vercel.app/";
const SITE_IMAGE_URL = "https://ai-diplomap.vercel.app/pic1.png";
const DEFAULT_TITLE = `${SITE_NAME} | Interactive world diplomacy map`;
const DEFAULT_DESCRIPTION =
  "AI DIPLOMAP is an interactive web app that visualizes global diplomatic relations and compares how GPT, Claude, Gemini, and Grok interpret them.";

type SeoCountry = {
  iso2: string | null;
  localizedGroup: string;
  localizedName: string;
  name: string;
};

function upsertMeta(attributeName: "name" | "property", attributeValue: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(
    `meta[${attributeName}="${attributeValue}"]`,
  );

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attributeName, attributeValue);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

function getCountrySeo(country: SeoCountry) {
  const title = `${country.name} diplomacy map | ${SITE_NAME}`;
  const description = `Explore ${country.name}'s diplomatic relationships on the interactive world map and compare how multiple AI models interpret them.`;
  const keywords = [
    country.name,
    country.localizedName,
    country.localizedGroup,
    country.iso2,
    "diplomacy map",
    "international relations",
    "geopolitics",
    SITE_NAME,
  ]
    .filter(Boolean)
    .join(", ");

  return { description, keywords, title };
}

export function syncSeoMetadata(locale: string, country: SeoCountry | null = null) {
  if (typeof document === "undefined") {
    return;
  }

  const seo = country
    ? getCountrySeo(country)
    : {
        description: DEFAULT_DESCRIPTION,
        keywords:
          "AI DIPLOMAP, diplomacy map, geopolitics, foreign relations, world map, international relations, GPT, Claude, Gemini, Grok",
        title: DEFAULT_TITLE,
      };

  document.documentElement.lang = locale || "ko";
  document.title = seo.title;

  upsertMeta("name", "description", seo.description);
  upsertMeta("name", "keywords", seo.keywords);
  upsertMeta("property", "og:locale", "en_US");
  upsertMeta("property", "og:title", seo.title);
  upsertMeta("property", "og:description", seo.description);
  upsertMeta("property", "og:url", SITE_URL);
  upsertMeta("property", "og:image", SITE_IMAGE_URL);
  upsertMeta("name", "twitter:title", seo.title);
  upsertMeta("name", "twitter:description", seo.description);
  upsertMeta("name", "twitter:image", SITE_IMAGE_URL);
  upsertLink("canonical", SITE_URL);
}
