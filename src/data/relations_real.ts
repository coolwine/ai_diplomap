import { NationRelation } from "./relations";

export const RELATIONS: NationRelation[] = [
  // =========================
  // 🇺🇸 미국 (US)
  // =========================
  {
    nationKey: "KR_US",
    opinions: [
      { ai: "claude", level: "allied", comment: "트럼프발 분담금 폭풍 中", date: "2026-04-15" },
      { ai: "gpt", level: "allied", comment: "동맹 유지, 비용 갈등 지속", date: "2026-04-15" },
      { ai: "grok", level: "allied", comment: "철통 한미동맹. 돈값은 해야지.", date: "2026-04-15" },
      { ai: "gemini", level: "allied", comment: "굳건한 한미동맹, 렛츠고! 🇰🇷🇺🇸", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "JP_US",
    opinions: [
      { ai: "claude", level: "allied", comment: "방위비 올리며 더 친해짐", date: "2026-04-15" },
      { ai: "gpt", level: "allied", comment: "대중 견제 핵심 축", date: "2026-04-15" },
      { ai: "grok", level: "allied", comment: "태평양 최강 콤비.", date: "2026-04-15" },
      { ai: "gemini", level: "allied", comment: "인태 전략의 핵심 파트너", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "GB_US",
    opinions: [
      { ai: "claude", level: "allied", comment: "특별한 관계, 여전히 유효", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "특별한 관계 균열남", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "특별한 관계? 아직은.", date: "2026-04-15" },
      { ai: "gemini", level: "allied", comment: "영원한 '특별한 관계' 🇬🇧🇺🇸", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "IL_US",
    opinions: [
      { ai: "claude", level: "allied", comment: "가자 전쟁으로 동맹 공고화", date: "2026-04-15" },
      { ai: "gpt", level: "allied", comment: "중동 군사 공조 지속", date: "2026-04-15" },
      { ai: "grok", level: "allied", comment: "중동 최강 태그팀.", date: "2026-04-15" },
      { ai: "gemini", level: "allied", comment: "중동 안보의 가장 강력한 축", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "PH_US",
    opinions: [
      { ai: "claude", level: "allied", comment: "남중국해서 군사결속 강화", date: "2026-04-15" },
      { ai: "gpt", level: "allied", comment: "남중국해 전진기지", date: "2026-04-15" },
      { ai: "grok", level: "allied", comment: "남중국해 전초기지.", date: "2026-04-15" },
      { ai: "gemini", level: "allied", comment: "남중국해 수호의 핵심 고리", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "CA_US",
    opinions: [
      { ai: "claude", level: "allied", comment: "51번째 주 드립에 뿔남", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "동맹인데 거리감 생김", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "이웃인데 좀 비싸게 군다.", date: "2026-04-15" },
      { ai: "gemini", level: "allied", comment: "이웃 그 이상의 방위 동맹", date: "2026-04-15" },
    ],
  },

  {
    nationKey: "MX_US",
    opinions: [
      { ai: "claude", level: "friendly", comment: "관세 협박에 국경도 막힘", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "국경 문제 계속 터짐", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "국경이 문제의 핵심.", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "가깝고도 먼 이웃", date: "2026-04-15" },
    ],
  },

  {
    nationKey: "IN_US",
    opinions: [
      { ai: "claude", level: "friendly", comment: "쿼드 협력, 독자 노선 병행", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "반중 실용 협력 강화", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "중국 견제용 실용 동반자.", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "민주주의로 맺어진 전략적 협력", date: "2026-04-15" },
    ],
  },

  {
    nationKey: "IR_US",
    opinions: [
      { ai: "claude", level: "hostile", comment: "최대압박 2.0 재가동", date: "2026-04-15" },
      { ai: "gpt", level: "hostile", comment: "전쟁 직후 긴장 최고", date: "2026-04-15" },
      { ai: "grok", level: "hostile", comment: "핵 문제 해결 전엔 불가.", date: "2026-04-15" },
      { ai: "gemini", level: "hostile", comment: "평행선만 달리는 중 🛤️", date: "2026-04-15" },
    ],
  },

  {
    nationKey: "CN_US",
    opinions: [
      { ai: "claude", level: "hostile", comment: "관세 전쟁 현재진행형", date: "2026-04-15" },
      { ai: "gpt", level: "hostile", comment: "패권 경쟁 정면충돌", date: "2026-04-15" },
      { ai: "grok", level: "hostile", comment: "패권 경쟁은 피할 수 없음.", date: "2026-04-15" },
      { ai: "gemini", level: "hostile", comment: "피할 수 없는 패권 경쟁", date: "2026-04-15" },
    ],
  },

  // =========================
  // 🇰🇷 한국
  // =========================
  {
    nationKey: "KP_KR",
    opinions: [
      { ai: "claude", level: "hostile", comment: "오물 풍선에 핵 위협까지", date: "2026-04-15" },
      { ai: "gpt", level: "hostile", comment: "군사 긴장 상시 유지", date: "2026-04-15" },
      { ai: "grok", level: "hostile", comment: "적대국 확정.", date: "2026-04-15" },
      { ai: "gemini", level: "hostile", comment: "전화 좀 받아라.. 📞❌", date: "2026-04-15" },
    ],
  },

  {
    nationKey: "JP_KR",
    opinions: [
      { ai: "claude", level: "friendly", comment: "탄핵 이후에도 협력 지속", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "안보 협력 빠르게 강화", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "실용적 협력 확대 중.", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "가깝고도 가까워지는 중", date: "2026-04-15" },
    ],
  },

  {
    nationKey: "KR_RU",
    opinions: [
      { ai: "claude", level: "neutral", comment: "북러 밀착에 외교 냉각", date: "2026-04-15" },
      { ai: "gpt", level: "hostile", comment: "북러 협력으로 급냉각", date: "2026-04-15" },
      { ai: "grok", level: "hostile", comment: "북러 군사협력 때문에.", date: "2026-04-15" },
      { ai: "gemini", level: "hostile", comment: "선 제대로 넘으셨네요.. ⚠️", date: "2026-04-15" },
    ],
  },

  // =========================
  // 🇷🇺 러시아
  // =========================
  {
    nationKey: "RU_UA",
    opinions: [
      { ai: "claude", level: "war", comment: "트럼프 중재에도 포성 계속", date: "2026-04-15" },
      { ai: "gpt", level: "war", comment: "전쟁 장기화 고착", date: "2026-04-15" },
      { ai: "grok", level: "war", comment: "전쟁 지속 중. 끝날 기미 없음.", date: "2026-04-15" },
      { ai: "gemini", level: "war", comment: "하루빨리 평화가 오길.. 🕊️", date: "2026-04-15" },
    ],
  },

  // =========================
  // 🇹🇼 대만
  // =========================
  {
    nationKey: "CN_TW",
    opinions: [
      { ai: "claude", level: "war", comment: "통일 압박, 군사 도발 일상화", date: "2026-04-15" },
      { ai: "gpt", level: "war", comment: "군사 긴장 최고조 달함", date: "2026-04-15" },
      { ai: "grok", level: "war", comment: "시진핑의 타이완 집착.", date: "2026-04-15" },
      { ai: "gemini", level: "war", comment: "평화의 해협이 위기의 해협으로", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "JP_TW",
    opinions: [
      { ai: "claude", level: "friendly", comment: "대만 유사시 일본도 긴장", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "비공식 우호 관계 강화", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "지리적 운명 공동체.", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "역사와 지리가 만든 유대감", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "TW_US",
    opinions: [
      { ai: "claude", level: "allied", comment: "법 아닌 동맹, 무기는 팔아줌", date: "2026-04-15" },
      { ai: "gpt", level: "allied", comment: "대만관계법으로 실질 동맹", date: "2026-04-15" },
      { ai: "grok", level: "allied", comment: "중국 견제 핵심 카드.", date: "2026-04-15" },
      { ai: "gemini", level: "allied", comment: "비공식이지만 사실상 동맹", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "KR_TW",
    opinions: [
      { ai: "claude", level: "friendly", comment: "단교 후에도 반도체 라이벌", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "공식 없어도 경제는 돌아감", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "1992 단교, 지금은 실용 협력.", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "외교 없어도 경제는 연결", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "PH_TW",
    opinions: [
      { ai: "claude", level: "friendly", comment: "해상 갈등에도 인력 교류 활발", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "OFW 연결, 해양 긴장 공유", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "필리핀 노동자가 잇는 두 나라.", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "바다 건너 이웃, 협력과 갈등 공존", date: "2026-04-15" },
    ],
  },

  // =========================
  // 🇮🇷 이란
  // =========================
  {
    nationKey: "IR_SA",
    opinions: [
      { ai: "claude", level: "hostile", comment: "재개 시도, 불신은 여전", date: "2026-04-15" },
      { ai: "gpt", level: "neutral", comment: "겉화해 속경쟁 상태", date: "2026-04-15" },
      { ai: "grok", level: "neutral", comment: "전쟁 후에도 긴장 지속.", date: "2026-04-15" },
      { ai: "gemini", level: "neutral", comment: "일단은 악수, 속은 글쎄?", date: "2026-04-15" },
    ],
  },
  {
    "nationKey": "BR_US",
    "opinions": [
      { "ai": "claude", "level": "friendly", "comment": "경제 협력 중심 관계 유지", "date": "2026-04-15" },
      { "ai": "gpt", "level": "friendly", "comment": "거리두기 속 실용 협력 유지", "date": "2026-04-15" },
      { "ai": "grok", "level": "friendly", "comment": "전략보다 경제 중심 파트너", "date": "2026-04-15" },
      { "ai": "gemini", "level": "friendly", "comment": "글로벌 남반구 핵심 협력국", "date": "2026-04-15" }
    ]
  },
  {
    nationKey: "BR_KR",
    opinions: [
      { ai: "claude", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "중남미 최대 경제 파트너십", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
  {
    "nationKey": "CA_KR",
    "opinions": [
      { "ai": "claude", "level": "friendly", "comment": "경제·인적 교류 지속 확대", "date": "2026-04-15" },
      { "ai": "gpt", "level": "friendly", "comment": "안정적 교역·이민 협력 유지", "date": "2026-04-15" },
      { "ai": "grok", "level": "friendly", "comment": "유학생·교민 기반 관계 탄탄", "date": "2026-04-15" },
      { "ai": "gemini", "level": "friendly", "comment": "가치 공유하는 우호 파트너", "date": "2026-04-15" }
    ]
  },
  {
    "nationKey": "EG_US",
    "opinions": [
      { "ai": "claude", "level": "friendly", "comment": "중동 안보 협력 유지", "date": "2026-04-15" },
      { "ai": "gpt", "level": "friendly", "comment": "군사 원조 기반 협력 지속", "date": "2026-04-15" },
      { "ai": "grok", "level": "friendly", "comment": "지역 안정 위한 협력 관계", "date": "2026-04-15" },
      { "ai": "gemini", "level": "friendly", "comment": "중동 질서 유지 핵심 파트너", "date": "2026-04-15" }
    ]
  },
  {
    nationKey: "EG_KR",
    opinions: [
      { ai: "claude", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "방산 및 인프라 구축 협력 지속", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
  {
    "nationKey": "ID_US",
    "opinions": [
      { "ai": "claude", "level": "friendly", "comment": "동남아 전략 협력 확대", "date": "2026-04-15" },
      { "ai": "gpt", "level": "friendly", "comment": "대중 견제 협력 강화 중", "date": "2026-04-15" },
      { "ai": "grok", "level": "friendly", "comment": "경제·안보 협력 균형 유지", "date": "2026-04-15" },
      { "ai": "gemini", "level": "friendly", "comment": "인도태평양 핵심 파트너", "date": "2026-04-15" }
    ]
  },
  {
    nationKey: "ID_KR",
    opinions: [
      { ai: "claude", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "방산 및 신수도 건설 파트너십", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "IN_KR",
    opinions: [
      { ai: "claude", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "공급망 및 포괄적 경제 협력 강화", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
  {
    "nationKey": "KP_US",
    "opinions": [
      { "ai": "claude", "level": "hostile", "comment": "핵 갈등 여전히 평행선", "date": "2026-04-15" },
      { "ai": "gpt", "level": "hostile", "comment": "핵 협상 교착 상태 지속", "date": "2026-04-15" },
      { "ai": "grok", "level": "hostile", "comment": "대화 없고 긴장만 유지", "date": "2026-04-15" },
      { "ai": "gemini", "level": "hostile", "comment": "비핵화 협상 답보 상태", "date": "2026-04-15" }
    ]
  },
  {
    nationKey: "KR_PH",
    opinions: [
      { ai: "claude", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "방산 및 인프라 파트너십 강화", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
  {
    "nationKey": "PL_US",
    "opinions": [
      { "ai": "claude", "level": "allied", "comment": "동유럽 핵심 군사 동맹", "date": "2026-04-15" },
      { "ai": "gpt", "level": "allied", "comment": "대러 전선 최전방 동맹", "date": "2026-04-15" },
      { "ai": "grok", "level": "allied", "comment": "러시아 견제 최전선 파트너", "date": "2026-04-15" },
      { "ai": "gemini", "level": "allied", "comment": "NATO 동부 방어 핵심축", "date": "2026-04-15" }
    ]
  },
  {
    "nationKey": "RU_US",
    "opinions": [
      { "ai": "claude", "level": "hostile", "comment": "미러링 냉전 구도 재현", "date": "2026-04-15" },
      { "ai": "gpt", "level": "hostile", "comment": "신냉전 구도 여전히 지속", "date": "2026-04-15" },
      { "ai": "grok", "level": "hostile", "comment": "힘겨루기 끝날 기미 없음", "date": "2026-04-15" },
      { "ai": "gemini", "level": "hostile", "comment": "갈등 장기화, 출구 안 보임", "date": "2026-04-15" }
    ]
  },
  {
    nationKey: "KR_SA",
    opinions: [
      { ai: "claude", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "네옴시티 및 에너지 전략 파트너", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "KR_TR",
    opinions: [
      { ai: "claude", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "형제의 나라, 인프라 협력 강화", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "US_VN",
    opinions: [
      { ai: "claude", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "포괄적 전략적 동반자 관계 강화", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
  {
    nationKey: "KR_VN",
    opinions: [
      { ai: "claude", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gpt", level: "friendly", comment: "최대 투자국 및 핵심 경제 파트너", date: "2026-04-15" },
      { ai: "grok", level: "friendly", comment: "", date: "2026-04-15" },
      { ai: "gemini", level: "friendly", comment: "", date: "2026-04-15" },
    ],
  },
];
