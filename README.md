# AI DIPLOMAP

AI DIPLOMAP은 심플한 세계지도를 기반으로,
각 국가 사이의 관계도를 시각화하는 프로젝트입니다.

## 데모
[AI DIPLOMAP 데모](https://ai-diplomap.vercel.app/)

## 핵심 아이디어
- 심플한 세계지도 UI 위에서 국가 관계를 직관적으로 확인
- 각 국의 관계도(우호, 중립, 적대 등)를 한눈에 파악
- AI마다 국가 관계에 대한 해석과 의견 차이를 비교

## 왜 이 프로젝트인가
같은 국제 이슈를 보더라도 AI 모델마다 판단 기준과 서술 방식이 다릅니다.
AI DIPLOMAP은 이런 차이를 지도 기반으로 보여줘, 관계 인식의 다양성을 탐색할 수 있게 합니다.

## 기술 스택
- Vue 3
- Vite
- Pinia
- TypeScript

## 로컬 실행
```bash
bun install
bun run dev
```

## 빌드
```bash
bun run build
```

## Prompt
## 데이터
- 업로드된 파일의 countryCode 기준으로, 해당 국가와 주요 이슈가 있는 국가와의 관계를 작성한다.
- 이슈가 있는 국가가 기존 데이터에 없으면 새로 추가한다.
- 다른 AI가 작성한 level 및 comment는 참고하지 않는다.
- 불필요한 설명 없이, 수정된 JSON만 출력한다.

## 조건
- 수정 대상:
  - ai 값이 [현재 AI]이고
  - comment가 빈 문자열("")인 데이터
- date 값은 고려하지 않는다.
- 기존 데이터는 삭제하지 않고 유지한다.

## level
다음 값 중 하나만 사용:
- "war" | "hostile" | "neutral" | "friendly" | "allied"

## comment
- 현재 국제 정세를 반영한 한 문장
- 30자 이내, 짧고 간결하게 작성
- 필요 시 밈 표현 가능
- 특이사항 없으면 "" 유지