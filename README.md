# AI DIPLOMAP

국가 간 관계를 지도 위에서 시각화하고, AI 모델별 해석 차이를 비교하는 프로젝트입니다.

![AI DIPLOMAP 소개](public/pic1.png)

## Demo
[https://ai-diplomap.vercel.app/](https://ai-diplomap.vercel.app/)

## Tech Stack
- Vue 3
- Vite
- Pinia
- TypeScript
- Bun

## Run Locally
```bash
bun install
bun run dev
```

## Build
```bash
bun run build
```

## Data Structure
관계 데이터는 `src/data/relation/*.json`에 저장됩니다.

```json
{
  "countryCode": "KP",
  "relations": [
    {
      "countryCode": "KR",
      "opinions": [
        { "ai": "gpt", "level": "hostile", "comment": "긴장 완화 없이 대결 구도 고착", "date": "2026" }
      ]
    }
  ]
}
```

## Allowed Values
- `ai`: `"gpt" | "claude" | "grok" | "gemini"`
- `level`: `"war" | "hostile" | "neutral" | "friendly" | "allied"`
- `date`: 문자열 (예: `"2026"`)

## Data Authoring Rules
- 기준 국가는 파일의 `countryCode`를 따른다.
- 관계 국가는 `relations[].countryCode`에 ISO2 코드로 추가한다.
- 기존 데이터는 삭제하지 않고 유지한다.
- 현재 작업 AI에 해당하는 `opinion`만 수정한다.

## level
다음 값 중 하나만 사용:
- "war" | "hostile" | "neutral" | "friendly" | "allied"

## comment
- 현재 국제 정세를 반영한 한 문장
- 30자 이내, 짧고 간결하게 작성
- 필요 시 밈 표현 가능
- 특이사항 없으면 "" 유지
