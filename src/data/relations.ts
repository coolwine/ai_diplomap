// import { RELATIONS } from "./relations_test"
const RELATION_FILES = import.meta.glob("./relation/*.json", { eager: true });
const RELATIONS: NationRelation[] = Object.entries(RELATION_FILES).map(([path, content]: [string, any]) => {
  const countryCode = path.split("/").pop()?.split(".")[0] || "";
  return {
    countryCode,
    relations: content.relations || content.default?.relations || [],
  };
});

export type RelationLevel = "war" | "hostile" | "neutral" | "friendly" | "allied";

export type AiName = "gpt" | "claude" | "grok" | "gemini";

export type AiOpinion = {
  ai: AiName;
  level: RelationLevel;
  comment: string;
  date: string;
};

export type NationRelation = {
  countryCode: string; // ISO2 code of the source country
  relations: {
    countryCode: string; // ISO2 code of the target country
    opinions: AiOpinion[];
  }[];
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
  const valid = opinions.filter((o) => o.level);
  if (valid.length === 0) return "neutral";

  const counts = new Map<RelationLevel, number>();
  for (const o of valid) {
    counts.set(o.level, (counts.get(o.level) ?? 0) + 1);
  }
  let maxLevel = valid[0].level;
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
  const flatRelations: CountryRelation[] = [];
  const processedKeys = new Set<string>();

  for (const countryEntry of RELATIONS) {
    for (const relation of countryEntry.relations) {
      const key = [countryEntry.countryCode, relation.countryCode].sort().join("_");
      if (!processedKeys.has(key)) {
        flatRelations.push({
          level: getRepresentativeLevel(relation.opinions),
          source: countryEntry.countryCode,
          target: relation.countryCode,
        });
        processedKeys.add(key);
      }
    }
  }
  return flatRelations;
}

/** Get raw NationRelation[] with all AI opinions */
export function getAllNationRelations(): NationRelation[] {
  return RELATIONS;
}

/** Get flat relations for a specific country */
export function getRelationsForCountry(countryIso2: string): CountryRelation[] {
  const countryEntry = RELATIONS.find((r) => r.countryCode === countryIso2);
  if (!countryEntry) {
    // Also check if this country is a target in other entries
    return getAllRelations().filter((r) => r.source === countryIso2 || r.target === countryIso2);
  }

  return countryEntry.relations.map((rel) => ({
    level: getRepresentativeLevel(rel.opinions),
    source: countryIso2,
    target: rel.countryCode,
  }));
}

/** Get NationRelation-like entries involving a specific country */
export function getNationRelationsForCountry(countryIso2: string): { nationKey: string; opinions: AiOpinion[] }[] {
  const countryEntry = RELATIONS.find((r) => r.countryCode === countryIso2);
  if (!countryEntry) return [];

  return countryEntry.relations.map((rel) => ({
    nationKey: buildNationKey(countryIso2, rel.countryCode),
    opinions: rel.opinions,
  }));
}
