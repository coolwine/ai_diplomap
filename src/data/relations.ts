// import { RELATIONS } from "./relations_test"
import { RELATIONS } from "./relations_real";

export type RelationLevel = "war" | "hostile" | "neutral" | "friendly" | "allied";

export type AiName = "gpt" | "claude" | "grok" | "gemini";

export type AiOpinion = {
  ai: AiName;
  level: RelationLevel;
  comment: string;
  date: string;
};

export type NationRelation = {
  nationKey: string; // "KR_US" — alphabetically ordered ISO2 codes
  opinions: AiOpinion[];
};

/** Flat relation derived from NationRelation for backward compatibility */
export type CountryRelation = {
  level: RelationLevel;
  source: string;
  target: string;
};

export type RelationLevelMeta = {
  color: string;
  label: string;
  rank: number;
};

export const RELATION_LEVELS: Record<RelationLevel, RelationLevelMeta> = {
  allied: {
    color: "#7ef0b8",
    label: "동맹",
    rank: 5,
  },
  friendly: {
    color: "#7dd3fc",
    label: "우호",
    rank: 4,
  },
  hostile: {
    color: "#fb923c",
    label: "적대",
    rank: 2,
  },
  neutral: {
    color: "#96999f",
    label: "중립",
    rank: 3,
  },
  war: {
    color: "#ff5d5d",
    label: "전쟁",
    rank: 1,
  },
};

/** Get the most common level among opinions (majority vote) */
export function getRepresentativeLevel(opinions: AiOpinion[]): RelationLevel {
  const counts = new Map<RelationLevel, number>();
  for (const o of opinions) {
    counts.set(o.level, (counts.get(o.level) ?? 0) + 1);
  }
  let maxLevel = opinions[0].level;
  let maxCount = 0;
  for (const [level, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      maxLevel = level;
    }
  }
  return maxLevel;
}

/** Parse nationKey "AB_CD" into [source, target] */
export function parseNationKey(nationKey: string): [string, string] {
  const [a, b] = nationKey.split("_");
  return [a, b];
}

/** Build nationKey from two ISO2 codes (alphabetically sorted) */
export function buildNationKey(iso2A: string, iso2B: string): string {
  return [iso2A, iso2B].sort().join("_");
}

/** Get all relations as flat CountryRelation[] (uses representative level) */
export function getAllRelations(): CountryRelation[] {
  return RELATIONS.map((r) => {
    const [source, target] = parseNationKey(r.nationKey);
    return {
      level: getRepresentativeLevel(r.opinions),
      source,
      target,
    };
  });
}

/** Get raw NationRelation[] with all AI opinions */
export function getAllNationRelations(): NationRelation[] {
  return RELATIONS;
}

/** Get flat relations for a specific country */
export function getRelationsForCountry(countryIso2: string): CountryRelation[] {
  return getAllRelations().filter((r) => r.source === countryIso2 || r.target === countryIso2);
}

/** Get NationRelation entries involving a specific country */
export function getNationRelationsForCountry(countryIso2: string): NationRelation[] {
  return RELATIONS.filter((r) => r.nationKey.includes(countryIso2));
}
