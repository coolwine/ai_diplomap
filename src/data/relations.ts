// import { RELATIONS } from "./relations_test"
import { RELATIONS } from "./relations_real"

export type RelationLevel = "war" | "hostile" | "neutral" | "friendly" | "allied";

export type CountryRelation = {
  level: RelationLevel;
  source: string; // ISO2 code or ID
  target: string; // ISO2 code or ID
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

export function getRelationsForCountry(countryName: string) {
  return RELATIONS.filter((relation) => relation.source === countryName);
}

export function getAllRelations() {
  return RELATIONS;
}
