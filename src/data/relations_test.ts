import {CountryRelation} from "./relations";

export const RELATIONS: CountryRelation[] = [
  { level: "war", source: "US", target: "IR" },
  { level: "allied", source: "KR", target: "US" },
  { level: "neutral", source: "KR", target: "JP" },
  { level: "hostile", source: "KR", target: "KP" },
];