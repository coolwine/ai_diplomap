import { NationRelation } from "./relations";

export const RELATIONS: NationRelation[] = [
  {
    "countryCode": "KR", // 한국
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "트럼프발 분담금 폭풍 中", "date": "2026" },
          { "ai": "gpt", "level": "allied", "comment": "동맹 유지, 비용 갈등 지속", "date": "2026" },
          { "ai": "grok", "level": "allied", "comment": "철통 한미동맹. 돈값은 해야지.", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "굳건한 한미동맹, 렛츠고! 🇰🇷🇺🇸", "date": "2026" }
        ]
      },
      {
        "countryCode": "RU", // 러시아
        "opinions": [
          { "ai": "claude", "level": "neutral", "comment": "북러 밀착에 외교 냉각", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "북러 협력으로 급냉각", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "북러 군사협력 때문에.", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "선 제대로 넘으셨네요.. ⚠️", "date": "2026" }
        ]
      },
      {
        "countryCode": "TW", // 대만
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "단교 후에도 반도체 라이벌", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "공식 없어도 경제는 돌아감", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "1992 단교, 지금은 실용 협력.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "외교 없어도 경제는 연결", "date": "2026" }
        ]
      },
      {
        "countryCode": "PH", // 필리핀
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "방산 및 인프라 파트너십 강화", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "방산·인프라 파트너십.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "70년 우정, 방산 협력으로 결실", "date": "2026" }
        ]
      },
      {
        "countryCode": "SA", // 사우디
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "네옴시티 및 에너지 전략 파트너", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "네옴·에너지 전략 파트너.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "네옴시티와 에너지로 여는 미래", "date": "2026" }
        ]
      },
      {
        "countryCode": "TR", // 튀르키예
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "형제의 나라, 인프라 협력 강화", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "형제 나라 인프라 협력.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "피로 맺은 형제, 인프라로 연결", "date": "2026" }
        ]
      },
      {
        "countryCode": "VN", // 베트남
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "최대 투자국 및 핵심 경제 파트너", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "최대 투자 경제 파트너.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "최대 투자국, 핵심 경제 공동체", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "JP", // 일본
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "방위비 올리며 더 친해짐", "date": "2026" },
          { "ai": "gpt", "level": "allied", "comment": "대중 견제 핵심 축", "date": "2026" },
          { "ai": "grok", "level": "allied", "comment": "태평양 최강 콤비.", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "인태 전략의 핵심 파트너", "date": "2026" }
        ]
      },
      {
        "countryCode": "KR", // 한국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "탄핵 이후에도 협력 지속", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "안보 협력 빠르게 강화", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "실용적 협력 확대 중.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "가깝고도 가까워지는 중", "date": "2026" }
        ]
      },
      {
        "countryCode": "TW", // 대만
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "대만 유사시 일본도 긴장", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "비공식 우호 관계 강화", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "지리적 운명 공동체.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "역사와 지리가 만든 유대감", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "GB", // 영국
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "특별한 관계, 여전히 유효", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "특별한 관계 균열남", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "특별한 관계? 아직은.", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "영원한 '특별한 관계' 🇬🇧🇺🇸", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "IL", // 이스라엘
    "relations": [
      {
        "countryCode": "US",
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "가자 전쟁으로 동맹 공고화", "date": "2026" },
          { "ai": "gpt", "level": "allied", "comment": "중동 군사 공조 지속", "date": "2026" },
          { "ai": "grok", "level": "allied", "comment": "중동 최강 태그팀.", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "중동 안보의 가장 강력한 축", "date": "2026" }
        ]
      },
      {
        "countryCode": "IR",
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "직접 충돌 직전 긴장", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "사실상 그림자 전쟁 지속", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "서로 핵심 적대 세력.", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "중동 최대 라이벌 구도", "date": "2026" }
        ]
      },
      {
        "countryCode": "PS",
        "opinions": [
          { "ai": "claude", "level": "war", "comment": "가자 전쟁 지속 중", "date": "2026" },
          { "ai": "gpt", "level": "war", "comment": "가자 전쟁 장기화 상태", "date": "2026" },
          { "ai": "grok", "level": "war", "comment": "휴전 없이 충돌 계속.", "date": "2026" },
          { "ai": "gemini", "level": "war", "comment": "끝 보이지 않는 전쟁", "date": "2026" }
        ]
      },
      {
        "countryCode": "LB",
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "헤즈볼라와 교전 반복", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "북부 전선 충돌 지속", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "헤즈볼라 변수 계속.", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "국경 긴장 상시 유지", "date": "2026" }
        ]
      },
      {
        "countryCode": "SY",
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "시리아 내 공습 지속", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "이란 견제 공습 계속", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "시리아는 공습 타겟.", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "간접 충돌 전장 유지", "date": "2026" }
        ]
      },
      {
        "countryCode": "SA",
        "opinions": [
          { "ai": "claude", "level": "neutral", "comment": "관계 정상화 논의 중단", "date": "2026" },
          { "ai": "gpt", "level": "neutral", "comment": "수교 논의 사실상 정지", "date": "2026" },
          { "ai": "grok", "level": "neutral", "comment": "정상화 아직 멀었다.", "date": "2026" },
          { "ai": "gemini", "level": "neutral", "comment": "이해관계 속 거리 유지", "date": "2026" }
        ]
      },
      {
        "countryCode": "EG",
        "opinions": [
          { "ai": "claude", "level": "neutral", "comment": "휴전 중재 역할 유지", "date": "2026" },
          { "ai": "gpt", "level": "neutral", "comment": "가자 문제 중재 지속", "date": "2026" },
          { "ai": "grok", "level": "neutral", "comment": "중재자 포지션 유지.", "date": "2026" },
          { "ai": "gemini", "level": "neutral", "comment": "현실적 협력과 긴장 공존", "date": "2026" }
        ]
      },
      {
        "countryCode": "JO",
        "opinions": [
          { "ai": "claude", "level": "neutral", "comment": "평화협정 유지, 긴장 존재", "date": "2026" },
          { "ai": "gpt", "level": "neutral", "comment": "공식 평화지만 민심 악화", "date": "2026" },
          { "ai": "grok", "level": "neutral", "comment": "협정 있지만 불편함.", "date": "2026" },
          { "ai": "gemini", "level": "neutral", "comment": "안정 속 불안한 균형", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "PH", // 필리핀
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "남중국해서 군사결속 강화", "date": "2026" },
          { "ai": "gpt", "level": "allied", "comment": "남중국해 전진기지", "date": "2026" },
          { "ai": "grok", "level": "allied", "comment": "남중국해 전초기지.", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "남중국해 수호의 핵심 고리", "date": "2026" }
        ]
      },
      {
        "countryCode": "TW", // 대만
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "해상 갈등에도 인력 교류 활발", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "OFW 연결, 해양 긴장 공유", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "필리핀 노동자가 잇는 두 나라.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "바다 건너 이웃, 협력과 갈등 공존", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "CA", // 캐나다
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "51번째 주 드립에 뿔남", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "동맹인데 거리감 생김", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "이웃인데 좀 비싸게 군다.", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "이웃 그 이상의 방위 동맹", "date": "2026" }
        ]
      },
      {
        "countryCode": "KR", // 한국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "경제·인적 교류 지속 확대", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "안정적 교역·이민 협력 유지", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "유학생·교민 기반 관계 탄탄", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "가치 공유하는 우호 파트너", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "MX", // 멕시코
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "관세 협박에 국경도 막힘", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "국경 문제 계속 터짐", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "국경이 문제의 핵심.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "가깝고도 먼 이웃", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "IN", // 인도
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "쿼드 협력, 독자 노선 병행", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "반중 실용 협력 강화", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "중국 견제용 실용 동반자.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "민주주의로 맺어진 전략적 협력", "date": "2026" }
        ]
      },
      {
        "countryCode": "KR", // 한국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "공급망 및 포괄적 경제 협력 강화", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "공급망 경제 협력 강화.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "포괄적 경제 파트너십 강화 중", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "IR", // 이란
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "최대압박 2.0 재가동", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "전쟁 직후 긴장 최고", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "핵 문제 해결 전엔 불가.", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "평행선만 달리는 중 🛤️", "date": "2026" }
        ]
      },
      {
        "countryCode": "SA", // 사우디
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "재개 시도, 불신은 여전", "date": "2026" },
          { "ai": "gpt", "level": "neutral", "comment": "겉화해 속경쟁 상태", "date": "2026" },
          { "ai": "grok", "level": "neutral", "comment": "전쟁 후에도 긴장 지속.", "date": "2026" },
          { "ai": "gemini", "level": "neutral", "comment": "일단은 악수, 속은 글쎄?", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "CN", // 중국
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "관세 전쟁 현재진행형", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "패권 경쟁 정면충돌", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "패권 경쟁은 피할 수 없음.", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "피할 수 없는 패권 경쟁", "date": "2026" }
        ]
      },
      {
        "countryCode": "TW", // 대만
        "opinions": [
          { "ai": "claude", "level": "war", "comment": "통일 압박, 군사 도발 일상화", "date": "2026" },
          { "ai": "gpt", "level": "war", "comment": "군사 긴장 최고조 달함", "date": "2026" },
          { "ai": "grok", "level": "war", "comment": "시진핑의 타이완 집착.", "date": "2026" },
          { "ai": "gemini", "level": "war", "comment": "평화의 해협이 위기의 해협으로", "date": "2026" }
        ]
      },
      {
        "countryCode": "KR", // 한국
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "안보 갈등 경제 의존.", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "안보 갈등 속 경제 협력 줄타기", "date": "2026" }
        ]
      },
      {
        "countryCode": "KP", // 북한
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "allied", "comment": "혈맹 복원, 전략 협력 강화", "date": "2026" },
          { "ai": "grok", "level": "allied", "comment": "북중 혈맹 철통.", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "전략적 가치로 묶인 순망치한", "date": "2026" }
        ]
      },
      {
        "countryCode": "RU", // 러시아
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "allied", "comment": "반서방 전략 공조 지속", "date": "2026" },
          { "ai": "grok", "level": "allied", "comment": "중러 반미 밀착.", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "반서방 전선의 전략적 밀착 🤝", "date": "2026" }
        ]
      },
      {
        "countryCode": "IN",
        "opinions": [
          { "ai": "claude", "level": "war", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "war", "comment": "국경 긴장 상시 고조", "date": "2026" },
          { "ai": "grok", "level": "war", "comment": "국경 분쟁 대치 중.", "date": "2026" },
          { "ai": "gemini", "level": "war", "comment": "국경 분쟁으로 인한 긴장 지속", "date": "2026" }
        ]
      },
      {
        "countryCode": "NP", // 네팔
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "인프라 외교 영향력 확대", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "인프라 협력 실크로드.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "일대일로 중심의 인프라 협력", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "KP", // 북한
    "relations": [
      {
        "countryCode": "KR", // 한국
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "오물 풍선에 핵 위협까지", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "군사 긴장 상시 유지", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "적대국 확정.", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "전화 좀 받아라.. 📞❌", "date": "2026" }
        ]
      },
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "핵 갈등 여전히 평행선", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "핵 협상 교착 상태 지속", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "대화 없고 긴장만 유지", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "비핵화 협상 답보 상태", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "US", // 미국
    "relations": [
      {
        "countryCode": "KR", // 한국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "안보 협력 강화", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "안보 협력 강화", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "안보 협력 확대 중.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "안보로 연결", "date": "2026" }
        ]
      },
      {
        "countryCode": "VN", // 베트남
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "포괄적 전략적 동반자 관계 강화", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "전략적 동반자 강화.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "과거를 넘은 전략적 공조 확대", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "UA", // 우크라이나
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "인프라 협력 강화", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "인프라 협력 강화", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "인프라 협력 강화.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "인프라로 연결", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "RU", // 러시아
    "relations": [
      {
        "countryCode": "UA", // 우크라이나
        "opinions": [
          { "ai": "claude", "level": "war", "comment": "트럼프 중재에도 포성 계속", "date": "2026" },
          { "ai": "gpt", "level": "war", "comment": "전쟁 장기화 고착", "date": "2026" },
          { "ai": "grok", "level": "war", "comment": "전쟁 지속 중. 끝날 기미 없음.", "date": "2026" },
          { "ai": "gemini", "level": "war", "comment": "하루빨리 평화가 오길.. 🕊️", "date": "2026" }
        ]
      },
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "hostile", "comment": "미러링 냉전 구도 재현", "date": "2026" },
          { "ai": "gpt", "level": "hostile", "comment": "신냉전 구도 여전히 지속", "date": "2026" },
          { "ai": "grok", "level": "hostile", "comment": "힘겨루기 끝날 기미 없음", "date": "2026" },
          { "ai": "gemini", "level": "hostile", "comment": "갈등 장기화, 출구 안 보임", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "TW", // 대만
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "법 아닌 동맹, 무기는 팔아줌", "date": "2026" },
          { "ai": "gpt", "level": "allied", "comment": "대만관계법으로 실질 동맹", "date": "2026" },
          { "ai": "grok", "level": "allied", "comment": "중국 견제 핵심 카드.", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "비공식이지만 사실상 동맹", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "BR", // 브라질
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "경제 협력 중심 관계 유지", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "거리두기 속 실용 협력 유지", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "전략보다 경제 중심 파트너", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "글로벌 남반구 핵심 협력국", "date": "2026" }
        ]
      },
      {
        "countryCode": "KR", // 한국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "중남미 최대 경제 파트너십", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "경제 중심 실용 파트너.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "지구 반대편 핵심 경제 동반자", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "EG", // 이집트
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "중동 안보 협력 유지", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "군사 원조 기반 협력 지속", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "지역 안정 위한 협력 관계", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "중동 질서 유지 핵심 파트너", "date": "2026" }
        ]
      },
      {
        "countryCode": "KR", // 한국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "방산 및 인프라 구축 협력 지속", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "방산·인프라 든든 파트너.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "방산·인프라의 피라미드 동행", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "ID", // 인도네시아
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "동남아 전략 협력 확대", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "대중 견제 협력 강화 중", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "경제·안보 협력 균형 유지", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "인도태평양 핵심 파트너", "date": "2026" }
        ]
      },
      {
        "countryCode": "KR", // 한국
        "opinions": [
          { "ai": "claude", "level": "friendly", "comment": "", "date": "2026" },
          { "ai": "gpt", "level": "friendly", "comment": "방산 및 신수도 건설 파트너십", "date": "2026" },
          { "ai": "grok", "level": "friendly", "comment": "방산·신수도 건설 파트너.", "date": "2026" },
          { "ai": "gemini", "level": "friendly", "comment": "전투기부터 신도시까지 함께!", "date": "2026" }
        ]
      }
    ]
  },
  {
    "countryCode": "PL", // 폴란드
    "relations": [
      {
        "countryCode": "US", // 미국
        "opinions": [
          { "ai": "claude", "level": "allied", "comment": "동유럽 핵심 군사 동맹", "date": "2026" },
          { "ai": "gpt", "level": "allied", "comment": "대러 전선 최전방 동맹", "date": "2026" },
          { "ai": "grok", "level": "allied", "comment": "러시아 견제 최전선 파트너", "date": "2026" },
          { "ai": "gemini", "level": "allied", "comment": "NATO 동부 방어 핵심축", "date": "2026" }
        ]
      }
    ]
  }
];
