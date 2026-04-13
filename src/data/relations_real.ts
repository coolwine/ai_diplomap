import { CountryRelation } from "./relations";

export const RELATIONS: CountryRelation[] = [
  // =========================
  // 🇺🇸 미국 (US)
  // =========================
  { level: "allied", source: "US", target: "KR" },
  { level: "allied", source: "US", target: "JP" },
  { level: "allied", source: "US", target: "GB" },
  { level: "allied", source: "US", target: "IL" },
  { level: "allied", source: "US", target: "PH" },
  { level: "allied", source: "US", target: "CA" }, // 인접국
  { level: "friendly", source: "US", target: "MX" }, // 인접국
  { level: "friendly", source: "US", target: "IN" },
  { level: "friendly", source: "US", target: "SA" },
  { level: "friendly", source: "US", target: "DE" },
  { level: "friendly", source: "US", target: "FR" },
  { level: "friendly", source: "US", target: "AU" },
  { level: "friendly", source: "US", target: "VN" },
  { level: "hostile", source: "US", target: "IR" },
  { level: "hostile", source: "US", target: "KP" },
  { level: "hostile", source: "US", target: "RU" },
  { level: "hostile", source: "US", target: "CN" },
  { level: "hostile", source: "US", target: "CU" },

  // =========================
  // 🇰🇷 한국 (KR)
  // =========================
  { level: "hostile", source: "KR", target: "KP" },
  { level: "friendly", source: "KR", target: "JP" },
  { level: "neutral", source: "KR", target: "CN" },
  { level: "friendly", source: "KR", target: "VN" },
  { level: "friendly", source: "KR", target: "PH" },
  { level: "neutral", source: "KR", target: "RU" },

  // =========================
  // 🇨🇳 중국 (CN)
  // =========================
  { level: "hostile", source: "CN", target: "TW" },
  { level: "neutral", source: "CN", target: "IN" },
  { level: "hostile", source: "CN", target: "JP" },
  { level: "friendly", source: "CN", target: "RU" },
  { level: "neutral", source: "CN", target: "VN" },
  { level: "friendly", source: "CN", target: "KP" },
  { level: "neutral", source: "CN", target: "MN" }, // 인접국
  { level: "neutral", source: "CN", target: "KZ" }, // 인접국
  { level: "neutral", source: "CN", target: "MM" }, // 인접국 (미얀마)
  { level: "neutral", source: "CN", target: "LA" }, // 인접국 (라오스)

  // =========================
  // 🇷🇺 러시아 (RU)
  // =========================
  { level: "war", source: "RU", target: "UA" },
  { level: "friendly", source: "RU", target: "IR" },
  { level: "neutral", source: "RU", target: "KZ" }, // 인접국
  { level: "neutral", source: "RU", target: "MN" }, // 인접국
  { level: "friendly", source: "RU", target: "BY" }, // 인접국 (벨라루스)
  { level: "neutral", source: "RU", target: "GE" }, // 인접국 (조지아)
  { level: "neutral", source: "RU", target: "AZ" }, // 인접국 (아제르바이잔)
  { level: "hostile", source: "RU", target: "PL" },
  { level: "hostile", source: "RU", target: "EE" },
  { level: "hostile", source: "RU", target: "LV" },
  { level: "hostile", source: "RU", target: "LT" },

  // =========================
  // 🇯🇵 일본 (JP)
  // =========================
  { level: "hostile", source: "JP", target: "KP" },
  { level: "hostile", source: "JP", target: "RU" },

  // =========================
  // 🇮🇷 이란 (IR)
  // =========================
  { level: "hostile", source: "IR", target: "IL" },
  { level: "hostile", source: "IR", target: "SA" },
  { level: "neutral", source: "IR", target: "PK" }, // 인접국
  { level: "neutral", source: "IR", target: "IQ" }, // 인접국
  { level: "neutral", source: "IR", target: "AF" }, // 인접국
  { level: "neutral", source: "IR", target: "TR" }, // 인접국 (튀르키예)

  // =========================
  // 🇮🇱 이스라엘 (IL)
  // =========================
  { level: "hostile", source: "IL", target: "PS" },
  { level: "hostile", source: "IL", target: "LB" },
  { level: "hostile", source: "IL", target: "SY" }, // 인접국
  { level: "neutral", source: "IL", target: "EG" }, // 인접국
  { level: "neutral", source: "IL", target: "JO" }, // 인접국 (요르단)

  // =========================
  // 🇸🇦 사우디 (SA)
  // =========================
  { level: "neutral", source: "SA", target: "AE" }, // 인접국
  { level: "neutral", source: "SA", target: "YE" }, // 인접국
  { level: "neutral", source: "SA", target: "OM" }, // 인접국
  { level: "neutral", source: "SA", target: "KW" }, // 인접국
  { level: "neutral", source: "SA", target: "IQ" }, // 인접국
  { level: "neutral", source: "SA", target: "JO" }, // 인접국

  // =========================
  // 🇮🇳 인도 (IN)
  // =========================
  { level: "hostile", source: "IN", target: "PK" }, // 인접국
  { level: "neutral", source: "IN", target: "NP" }, // 인접국
  { level: "neutral", source: "IN", target: "BD" }, // 인접국
  { level: "neutral", source: "IN", target: "LK" }, // 인접국

  // =========================
  // 🇪🇺 유럽 및 기타
  // =========================
  { level: "allied", source: "GB", target: "FR" },
  { level: "allied", source: "DE", target: "FR" },
  { level: "friendly", source: "DE", target: "PL" },
  { level: "neutral", source: "UA", target: "PL" },
  { level: "neutral", source: "UA", target: "BY" },
  { level: "neutral", source: "TH", target: "MM" },
  { level: "neutral", source: "TH", target: "KH" },
  { level: "neutral", source: "TH", target: "LA" },
  { level: "neutral", source: "TH", target: "MY" },
  { level: "neutral", source: "VN", target: "KH" },
  { level: "neutral", source: "VN", target: "LA" },
  { level: "neutral", source: "MY", target: "ID" },
  { level: "neutral", source: "MY", target: "SG" },
];
