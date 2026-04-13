export type SupportedLocale = {
  code: string;
  label: string;
};

export const SUPPORTED_LOCALES: SupportedLocale[] = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "ru", label: "Русский" },
];

const displayNamesCache = new Map<string, Intl.DisplayNames>();

function getDisplayNames(locale: string): Intl.DisplayNames | null {
  if (displayNamesCache.has(locale)) {
    return displayNamesCache.get(locale)!;
  }

  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    displayNamesCache.set(locale, dn);
    return dn;
  } catch {
    return null;
  }
}

export function getLocalizedCountryName(
  iso2: string | null,
  locale: string,
  fallback: string,
): string {
  if (!iso2) {
    return fallback;
  }

  const dn = getDisplayNames(locale);

  if (!dn) {
    return fallback;
  }

  try {
    return dn.of(iso2.toUpperCase()) ?? fallback;
  } catch {
    return fallback;
  }
}

const GROUP_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "동아시아": "East Asia",
    "동남아시아": "Southeast Asia",
    "남아시아": "South Asia",
    "중앙아시아": "Central Asia",
    "서아시아 (중동)": "Western Asia (Middle East)",
    "동유럽": "Eastern Europe",
    "서유럽": "Western Europe",
    "남유럽": "Southern Europe",
    "북유럽": "Northern Europe",
    "북아메리카": "North America",
    "남아메리카": "South America",
    "중앙아메리카": "Central America",
    "카리브 (아메리카)": "Caribbean (Americas)",
    "동아프리카": "East Africa",
    "서아프리카": "West Africa",
    "북아프리카": "North Africa",
    "남아프리카": "Southern Africa",
    "중앙아프리카": "Central Africa",
    "오세아니아": "Oceania",
    "오스트레일리아": "Australia",
    "멜라네시아 (오세아니아)": "Melanesia (Oceania)",
    "미크로네시아 (오세아니아)": "Micronesia (Oceania)",
    "폴리네시아 (오세아니아)": "Polynesia (Oceania)",
    "남극": "Antarctica",
    "대양": "Ocean",
  },
  ja: {
    "동아시아": "東アジア",
    "동남아시아": "東南アジア",
    "남아시아": "南アジア",
    "중앙아시아": "中央アジア",
    "서아시아 (중동)": "西アジア（中東）",
    "동유럽": "東ヨーロッパ",
    "서유럽": "西ヨーロッパ",
    "남유럽": "南ヨーロッパ",
    "북유럽": "北ヨーロッパ",
    "북아메리카": "北アメリカ",
    "남아메리카": "南アメリカ",
    "중앙아메리카": "中央アメリカ",
    "카리브 (아메리카)": "カリブ（アメリカ）",
    "동아프리카": "東アフリカ",
    "서아프리카": "西アフリカ",
    "북아프리카": "北アフリカ",
    "남아프리카": "南アフリカ",
    "중앙아프리카": "中央アフリカ",
    "오세아니아": "オセアニア",
    "오스트레일리아": "オーストラリア",
    "남극": "南極",
    "대양": "大洋",
  },
  zh: {
    "동아시아": "东亚",
    "동남아시아": "东南亚",
    "남아시아": "南亚",
    "중앙아시아": "中亚",
    "서아시아 (중동)": "西亚（中东）",
    "동유럽": "东欧",
    "서유럽": "西欧",
    "남유럽": "南欧",
    "북유럽": "北欧",
    "북아메리카": "北美",
    "남아메리카": "南美",
    "중앙아메리카": "中美",
    "카리브 (아메리카)": "加勒比（美洲）",
    "동아프리카": "东非",
    "서아프리카": "西非",
    "북아프리카": "北非",
    "남아프리카": "南非",
    "중앙아프리카": "中非",
    "오세아니아": "大洋洲",
    "오스트레일리아": "澳大利亚",
    "남극": "南极",
    "대양": "大洋",
  },
};

export function getLocalizedGroup(
  groupKo: string,
  groupEn: string,
  locale: string,
): string {
  if (locale === "ko") {
    return groupKo;
  }

  const translations = GROUP_TRANSLATIONS[locale];

  if (translations && translations[groupKo]) {
    return translations[groupKo];
  }

  return groupEn;
}

export function getSearchPlaceholder(locale: string): string {
  const placeholders: Record<string, string> = {
    ko: "국가 검색...",
    en: "Search country...",
    ja: "国を検索...",
    zh: "搜索国家...",
    es: "Buscar país...",
    fr: "Rechercher un pays...",
    de: "Land suchen...",
    pt: "Pesquisar país...",
    ar: "...البحث عن دولة",
    hi: "देश खोजें...",
    ru: "Поиск страны...",
  };

  return placeholders[locale] ?? placeholders.en;
}
