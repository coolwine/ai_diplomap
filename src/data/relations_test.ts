import { NationRelation } from "./relations";

export const RELATIONS: NationRelation[] = [
  {
    // Iran_USA
    nationKey: "IR_US",
    opinions: [
      { ai: "gpt", level: "war", comment: "", date: "2026-04-15" },
      { ai: "claude", level: "hostile", comment: "", date: "2026-04-15" },
      { ai: "grok", level: "hostile", comment: "", date: "2026-04-15" },
    ],
  },
  {
    // Korea_USA
    nationKey: "KR_US",
    opinions: [
      { ai: "gpt", level: "allied", comment: "", date: "2026-04-15" },
      { ai: "claude", level: "allied", comment: "", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
  {
    // Japan_Korea
    nationKey: "JP_KR",
    opinions: [
      { ai: "gpt", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "claude", level: "neutral", comment: "", date: "2026-04-15" },
      { ai: "grok", level: "neutral", comment: "", date: "2026-04-15" },
    ],
  },
  {
    // NorthKorea_Korea
    nationKey: "KP_KR",
    opinions: [
      { ai: "gpt", level: "hostile", comment: "", date: "2026-04-15" },
      { ai: "claude", level: "hostile", comment: "", date: "2026-04-15" },
      { ai: "grok", level: "war", comment: "", date: "2026-04-15" },
    ],
  },
  {
    // China_Korea
    nationKey: "CN_KR",
    opinions: [
      { ai: "gpt", level: "neutral", comment: "", date: "2026-04-15" },
      { ai: "claude", level: "neutral", comment: "", date: "2026-04-15" },
      { ai: "grok", level: "neutral", comment: "", date: "2026-04-15" },
    ],
  },
];
