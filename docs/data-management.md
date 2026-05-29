# 사주/운세 데이터 관리 문서

## 1. 문서 목적

이 문서는 사주팔자, 궁합, 오늘의 운세, 작명 기능을 만들 때 필요한 데이터를 정의하고, 각 데이터를 어디서 구할지, 어떻게 저장/검증/관리할지 정리한다.

실제 DB 테이블 설계, 업데이트 정책, 사용자 데이터가 품질에 미치는 영향은 `docs/database-strategy.md`를 기준으로 관리한다. 전체 DB 스키마는 `db/schema.sql`, 데이터 커버리지 기준은 `docs/saju-data-coverage.md`를 따른다.

핵심 원칙은 다음과 같다.

- 계산 가능한 기초 데이터는 코드와 검증 데이터로 관리한다.
- 풀이 문장은 AI가 생성하되, AI가 참고할 해석 규칙과 금지 표현은 별도 데이터로 관리한다.
- 음력/윤달/절기처럼 정확도가 중요한 데이터는 검증 가능한 공식 데이터 또는 검증된 라이브러리를 사용한다.
- 작명용 한자, 뜻, 발음, 획수는 출처와 라이선스를 확인한 뒤 내부 데이터셋으로 정제한다.
- 모든 결과는 엔터테인먼트/참고용 콘텐츠로 제한한다.

## 2. 데이터 분류

| 분류 | 예시 | 관리 방식 | 우선순위 |
| --- | --- | --- | --- |
| 역법 데이터 | 양력/음력 변환, 윤달, 24절기, 일진 | 공식 API 또는 검증된 라이브러리 | 매우 높음 |
| 명리 기본 데이터 | 천간, 지지, 오행, 음양, 십성, 지장간, 합충형파해 | 내부 정적 데이터 | 매우 높음 |
| 사주 계산 결과 | 연주, 월주, 일주, 시주, 오행 분포 | 코드 계산 + 테스트 | 매우 높음 |
| 해석 규칙 데이터 | 오행 과다/부족 해석, 십성 해석, 일간별 성향 | 내부 콘텐츠 데이터 | 높음 |
| 궁합 규칙 데이터 | 일간 관계, 오행 상생/상극, 지지 합충 | 내부 콘텐츠 데이터 | 높음 |
| 작명 데이터 | 한글 이름 후보, 한자, 뜻, 획수, 발음 | 외부 공개 데이터 + 내부 큐레이션 | 높음 |
| 오늘의 운세 데이터 | 날짜별 운세 seed, 절기/일진 기반 키워드 | 계산 + AI 생성 | 중간 |
| 안전 정책 데이터 | 금지 주제, 금지 표현, 대체 표현 | 내부 정책 데이터 | 매우 높음 |
| 사용자 데이터 | 생년월일시, 프로필, 저장 결과 | DB 저장, 삭제 가능 | 매우 높음 |

## 3. 사주팔자에 필요한 데이터

### 3.1 입력 데이터

사용자에게 받는 데이터:

- 이름 또는 별명
- 성별 또는 선택 안 함
- 생년월일
- 출생 시간
- 출생 시간 모름 여부
- 양력/음력
- 윤달 여부
- 출생지 또는 시간대

관리 기준:

- 이름은 실명이 아니어도 되도록 한다.
- 출생 시간 모름이면 시주를 계산하지 않고 결과 신뢰도 문구를 낮춘다.
- 한국 서비스 1차 버전은 기본 시간대를 `Asia/Seoul`로 둔다.
- 해외 출생지 지원은 2차 기능으로 미룬다.

### 3.2 역법 데이터

필요한 데이터:

- 양력 날짜
- 음력 날짜
- 윤달 여부
- 월의 일수
- 요일
- 일진
- 세차
- 월건
- 율리우스 적일
- 24절기 날짜/시간

구하는 방법:

- 1순위: 공공데이터포털 `한국천문연구원_음양력 정보`
- 2순위: 공공데이터포털 `한국천문연구원_특일 정보`의 24절기 정보
- 3순위: 검증된 오픈소스 역법 라이브러리
- 4순위: 내부 테이블 구축

비고:

- 공공데이터포털의 한국천문연구원 음양력 정보 API는 음력일정보, 양력일정보, 특정음력일정보, 율리우스적일정보를 제공한다.
- 한국천문연구원 특일 정보 API는 국경일, 공휴일, 기념일, 24절기, 잡절 정보를 제공한다.
- API 의존성을 줄이기 위해 운영 DB에는 연도별 캐시 테이블을 두는 것을 권장한다.

권장 캐시 범위:

- MVP: 1900년~2100년
- 확장: 1800년~2200년

예상 테이블:

```ts
type CalendarDay = {
  date: string;
  solarYear: number;
  solarMonth: number;
  solarDay: number;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  dayGanji?: string;
  monthGanji?: string;
  yearGanji?: string;
  julianDay?: number;
  weekday: number;
};
```

```ts
type SolarTerm = {
  id: string;
  year: number;
  name: string;
  date: string;
  time?: string;
  order: number;
};
```

### 3.3 천간/지지 데이터

필요한 데이터:

- 천간 10개: 갑, 을, 병, 정, 무, 기, 경, 신, 임, 계
- 지지 12개: 자, 축, 인, 묘, 진, 사, 오, 미, 신, 유, 술, 해
- 음양
- 오행
- 방향, 계절, 시간대
- 지장간

구하는 방법:

- 기본 표는 공개 지식에 해당하므로 내부 정적 데이터로 작성한다.
- 단, 해석 문장은 직접 작성하거나 라이선스가 명확한 자료만 참고한다.

예상 데이터:

```ts
type HeavenlyStem = {
  key: string;
  label: string;
  element: "wood" | "fire" | "earth" | "metal" | "water";
  yinYang: "yang" | "yin";
  descriptionSeed: string;
};

type EarthlyBranch = {
  key: string;
  label: string;
  animal: string;
  element: "wood" | "fire" | "earth" | "metal" | "water";
  yinYang: "yang" | "yin";
  month?: number;
  timeRange?: string;
  hiddenStems: string[];
};
```

### 3.4 십성 데이터

필요한 데이터:

- 비견
- 겁재
- 식신
- 상관
- 편재
- 정재
- 편관
- 정관
- 편인
- 정인

구하는 방법:

- 일간과 다른 천간의 오행/음양 관계를 코드로 계산한다.
- 각 십성의 설명은 내부 콘텐츠 데이터로 관리한다.

관리 예시:

```ts
type TenGodInterpretation = {
  key: string;
  label: string;
  shortMeaning: string;
  strengths: string[];
  cautions: string[];
  careerHints: string[];
  relationshipHints: string[];
  safePromptHints: string[];
};
```

### 3.5 합충형파해 데이터

필요한 데이터:

- 천간합
- 지지육합
- 삼합
- 방합
- 충
- 형
- 파
- 해

구하는 방법:

- 관계 표는 내부 정적 데이터로 관리한다.
- MVP에서는 합/충 중심으로 시작하고, 형/파/해는 2차로 확장한다.

주의:

- 충, 형, 파, 해를 불길한 사건 예측으로 표현하지 않는다.
- "긴장", "속도 차이", "관점 차이" 같은 심리적/관계적 언어로 변환한다.

### 3.6 사주 풀이용 해석 데이터

AI에게 모든 해석을 자유 생성시키면 결과 품질이 흔들리므로, 아래 해석 seed 데이터를 내부에서 관리한다.

필요한 데이터:

- 일간별 기본 성향
- 오행 과다/부족 해석
- 십성 분포 해석
- 계절별 일간 해석
- 사주 구조별 키워드
- 격국/용신/희신/기신 후보 해석
- 관운, 재물운, 식상운, 인성운, 비겁운 해석
- 대운/세운 흐름 해석
- 나이별 전환기 해석
- 계절감 기반 비유 문구: 예를 들어 겨울에 핀 꽃, 마른 땅의 물길 같은 표현
- 출생 시간 모름일 때 제한 문구
- 분야별 해석 템플릿: 성향, 강점, 일, 관계, 오늘 팁

예상 데이터:

```ts
type InterpretationRule = {
  id: string;
  domain: "saju" | "compatibility" | "daily" | "naming";
  condition: Record<string, unknown>;
  title: string;
  keywords: string[];
  positiveHints: string[];
  cautionHints: string[];
  forbiddenClaims: string[];
};
```

구하는 방법:

- 명리학 공개 개념을 바탕으로 직접 작성한다.
- 특정 책/사이트 문장을 복사하지 않는다.
- 전문가 감수를 받으면 버전과 감수자를 기록한다.

고급 풀이에 필요한 추가 데이터:

```ts
type AdvancedSajuRule = {
  id: string;
  domain:
    | "season_metaphor"
    | "career_luck"
    | "wealth_luck"
    | "official_luck"
    | "relationship_luck"
    | "children_luck"
    | "health_condition"
    | "daewoon"
    | "yearly_luck";
  condition: Record<string, unknown>;
  metaphor?: string;
  interpretation: string[];
  caution: string[];
  timingHints?: {
    ageRange: string;
    theme: string;
    body: string;
  }[];
  confidence: "low" | "medium" | "high";
};
```

예시:

- 겨울 출생 + 목 일간: 추운 계절의 나무/꽃 비유
- 수 기운 과다 + 금 기운 약함: 생각은 깊으나 구조화가 필요한 해석
- 관성 약함: 조직/직장/규칙과의 관계 해석
- 재성 흐름이 대운에서 들어오는 시기: 금전운이 열리는 구간 해석
- 세운에서 관성이 강해지는 해: 이직, 직책, 평가, 시험, 계약 관련 해석

주의:

- "관운이 없다"처럼 단정하기보다 "관성의 힘이 약해 조직 규칙보다 자율성이 맞는 편"처럼 표현한다.
- "28세에 반드시 이직한다"보다 "28세 전후 이직/역할 변화 가능성이 커지는 흐름"처럼 표현한다.
- 출생 시간이 없으면 시주, 자식운, 말년운, 세부 대운 시작점의 신뢰도를 낮게 표시한다.

## 4. 궁합에 필요한 데이터

### 4.1 입력 데이터

사람 A/B 각각:

- 이름 또는 별명
- 생년월일시
- 양력/음력
- 윤달 여부
- 출생 시간 모름 여부
- 관계 유형

### 4.2 계산 데이터

필요한 데이터:

- 두 사람의 일간 관계
- 두 사람의 일지 관계
- 오행 분포 차이
- 십성 관계
- 지지 합/충
- 관계 유형별 가중치

관리 방식:

- 궁합 점수는 AI가 임의로 만들지 않고 코드에서 산출한다.
- AI는 코드가 계산한 점수/키워드를 바탕으로 설명만 작성한다.

예상 점수 구성:

| 항목 | 비중 | 설명 |
| --- | --- | --- |
| 일간 관계 | 25 | 기본 기질 조합 |
| 일지 관계 | 25 | 친밀한 관계의 생활 리듬 |
| 오행 보완성 | 20 | 부족한 오행을 보완하는지 |
| 충돌 요소 | 15 | 합/충/형 등 긴장 요소 |
| 관계 유형 보정 | 15 | 연인/친구/동료 등 맥락 |

### 4.3 궁합 해석 데이터

필요한 데이터:

- 일간 조합별 설명
- 오행 상생/상극 설명
- 지지 합/충별 관계 언어
- 관계 유형별 조언 템플릿
- 갈등 완화 문장

예상 데이터:

```ts
type CompatibilityRule = {
  id: string;
  relationType?: "couple" | "friend" | "coworker" | "family";
  condition: Record<string, unknown>;
  scoreDelta: number;
  keywords: string[];
  attractionHints: string[];
  cautionHints: string[];
  conversationTips: string[];
};
```

주의:

- "절대 만나면 안 된다", "결혼하면 불행하다" 같은 표현을 금지한다.
- 점수는 재미 요소이며 관계 판단의 근거가 아니라고 안내한다.

## 5. 오늘의 운세에 필요한 데이터

필요한 데이터:

- 오늘 날짜
- 오늘의 일진
- 오늘의 월/절기
- 사용자 사주 요약
- 분야별 운세 템플릿
- 행운 색상/숫자/키워드 후보

구하는 방법:

- 날짜/일진/절기는 역법 데이터에서 계산한다.
- 색상/숫자/키워드는 내부 후보 테이블에서 선택한다.
- AI는 선택된 seed를 바탕으로 문장을 생성한다.

예상 데이터:

```ts
type DailyFortuneSeed = {
  date: string;
  dayGanji: string;
  solarTerm?: string;
  globalKeywords: string[];
  luckyColors: string[];
  luckyNumbers: number[];
  cautionPatterns: string[];
};
```

주의:

- 건강운은 질병 예측이 아니라 컨디션 관리 문장으로 제한한다.
- 금전운은 투자 종목, 매수/매도, 대출 판단을 제공하지 않는다.

## 6. 작명에 필요한 데이터

### 6.1 한글 이름 데이터

필요한 데이터:

- 성씨 목록
- 이름에 자주 쓰이는 음절
- 피해야 할 발음 조합
- 성씨와 이름의 발음 리듬
- 시대감/성별감/중성적 느낌 태그

구하는 방법:

- 공개 통계 자료가 있으면 출처/라이선스를 확인해 사용한다.
- 초기 버전은 내부 큐레이션 목록으로 시작한다.
- 실제 개인 이름 목록을 크롤링하거나 무단 수집하지 않는다.

예상 데이터:

```ts
type HangulNameSyllable = {
  syllable: string;
  tags: string[];
  genderTone: "masculine" | "feminine" | "neutral";
  mood: string[];
  avoidReason?: string;
};
```

### 6.2 한자 데이터

필요한 데이터:

- 한자
- 한국어 음
- 뜻
- 총획수
- 부수
- 이름에 적합한지 여부
- 대법원 인명용 한자 여부
- 부정적 의미/난해한 글자 제외 여부

구하는 방법:

- Unicode Unihan Database: 한자 코드, 한국어 독음, 획수, 영문 뜻 등 기초 메타데이터 확인
- 대법원 인명용 한자표: 실제 출생 신고/개명에 쓸 수 있는 한자 여부 확인
- 자체 큐레이션: 이름에 적합한 긍정 의미, 사용 빈도, 발음 자연스러움 태그 추가

비고:

- Unicode Unihan은 CJK 통합 한자의 다양한 속성을 제공하며, `kKorean`, `kHangul`, `kDefinition`, `kTotalStrokes` 같은 필드를 검토할 수 있다.
- Unihan의 뜻은 영어 중심이므로 서비스용 한국어 뜻풀이는 직접 작성하거나 검수해야 한다.
- 대법원 인명용 한자 데이터는 사용 가능 조건과 최신성을 별도로 확인해야 한다.

예상 데이터:

```ts
type HanjaCharacter = {
  char: string;
  koreanReadings: string[];
  meaningKo: string;
  meaningEn?: string;
  totalStrokes?: number;
  radical?: string;
  nameUsable: boolean;
  source: string;
  tags: string[];
};
```

### 6.3 작명 해석 데이터

필요한 데이터:

- 오행 보완 관점의 음/한자 추천 규칙
- 발음 리듬 규칙
- 이름 느낌 태그
- 피해야 할 뜻/발음/조합
- 용도별 템플릿: 아기 이름, 개명, 예명, 닉네임, 브랜드명

관리 방식:

- MVP에서는 한자 획수 기반 작명학을 확정적 기준으로 쓰지 않는다.
- "사주 보완 관점에서 이런 이미지가 어울린다" 정도의 참고 설명으로 제한한다.
- 실제 출생 신고/개명은 전문가 및 공식 기준 확인 안내를 포함한다.

## 7. 데이터 저장 위치 제안

초기에는 정적 JSON/TS 파일로 시작하고, 양이 늘어나면 DB로 옮긴다.

```txt
src/
  data/
    calendar/
      solar-terms.json
      calendar-days.sample.json
    saju/
      heavenly-stems.ts
      earthly-branches.ts
      ten-gods.ts
      relations.ts
      interpretation-rules.ts
    compatibility/
      compatibility-rules.ts
    daily/
      daily-seeds.ts
      lucky-colors.ts
      lucky-keywords.ts
    naming/
      surnames.ts
      hangul-syllables.ts
      hanja-characters.ts
      naming-rules.ts
    safety/
      forbidden-claims.ts
      disclaimers.ts
```

DB로 옮길 데이터:

- `calendar_days`
- `solar_terms`
- `hanja_characters`
- `interpretation_rules`
- `compatibility_rules`
- `fortune_reports`
- `birth_profiles`

## 8. 데이터 수집/구축 우선순위

### Phase 1. MVP 필수

- 천간/지지/오행/음양 정적 데이터
- 지장간 기본 데이터
- 십성 계산 규칙
- 합/충 기본 관계표
- 사주 입력 검증 데이터
- 사주/궁합/오늘운세/작명 안전 문구
- 결과 화면용 목업 해석 데이터

### Phase 2. 정확도 강화

- 한국천문연구원 음양력 API 연동
- 한국천문연구원 특일 API의 24절기 데이터 연동
- 1900~2100년 캘린더 캐시 구축
- 사주 계산 테스트 케이스 구축
- 출생 시간 모름 처리 케이스 추가

### Phase 3. 콘텐츠 품질 강화

- 일간별 해석 seed 작성
- 오행 과다/부족 해석 seed 작성
- 궁합 조합별 해석 seed 작성
- 작명용 한글 음절/한자 후보 큐레이션
- AI 프롬프트 템플릿 버전 관리

### Phase 4. 운영 관리

- 관리자용 콘텐츠 수정 도구
- 해석 규칙 A/B 테스트
- 사용자 피드백 기반 품질 개선
- 금지 표현 필터 로그 관리

## 9. 데이터 검증 방법

### 9.1 역법 검증

- 공식 API 결과와 내부 계산 결과를 비교한다.
- 양력/음력 변환, 윤달, 월말 날짜, 연말/연초 경계값을 테스트한다.
- 24절기 기준으로 월주가 바뀌는 시점 테스트를 반드시 포함한다.

테스트 케이스:

- 양력 1월 1일
- 음력 1월 1일
- 윤달이 있는 해
- 2월 28일/29일
- 입춘 전후
- 자시 경계
- 출생 시간 모름

### 9.2 해석 데이터 검증

- 금지 표현이 포함되지 않았는지 검사한다.
- 너무 단정적인 문장을 필터링한다.
- 동일 입력에 대해 결과 구조가 안정적인지 확인한다.
- 해석 seed와 AI 결과가 충돌하지 않는지 확인한다.

### 9.3 작명 데이터 검증

- 한자의 음과 뜻이 맞는지 확인한다.
- 인명용 한자 여부를 확인한다.
- 부정적 의미, 지나치게 난해한 글자, 발음이 불편한 조합을 제외한다.
- 사용자가 입력한 피하고 싶은 글자/발음을 반영하는지 확인한다.

## 10. 라이선스와 출처 관리

각 데이터에는 출처를 기록한다.

```ts
type DataSource = {
  id: string;
  name: string;
  url?: string;
  license?: string;
  retrievedAt: string;
  notes?: string;
};
```

관리 원칙:

- 공식 API/공개 데이터는 URL, 조회일, 라이선스를 기록한다.
- 책, 블로그, 유료 콘텐츠의 문장을 복사하지 않는다.
- 공개 개념을 참고하더라도 서비스 문장은 직접 작성한다.
- AI로 생성한 해석 문구는 별도 버전으로 저장하고 검수한다.

## 11. 외부 데이터 후보

| 목적 | 후보 | 용도 |
| --- | --- | --- |
| 음양력 변환 | 한국천문연구원_음양력 정보 | 양력/음력/윤달/일진/율리우스 적일 검증 |
| 24절기 | 한국천문연구원_특일 정보 | 절기, 월주 경계, 오늘 운세 seed |
| 일출/일몰 | 한국천문연구원_출몰시각 정보 | 추후 위치 기반 콘텐츠 확장 |
| 한자 메타데이터 | Unicode Unihan Database | 한자 독음, 뜻, 획수, 부수 계열 데이터 검토 |
| 인명용 한자 | 대법원 인명용 한자표 | 작명 후보의 실사용 가능성 확인 |

## 12. AI에 넘길 데이터와 넘기지 않을 데이터

AI에 넘길 데이터:

- 사주 계산 결과
- 오행 분포
- 주요 십성
- 궁합 점수와 키워드
- 작명 후보와 의미 seed
- 안전 정책

AI에 넘기지 않을 데이터:

- 불필요한 실명
- 저장용 사용자 ID
- 원본 생년월일시 전체
- API 키
- 내부 운영 로그

권장 방식:

- AI 요청에는 `nickname`, `birthTimeUnknown`, `chartSummary`, `rules`, `outputSchema` 정도만 보낸다.
- 원본 입력값은 서버에서 계산에만 사용하고, AI에는 최소화된 요약값을 전달한다.

## 13. 데이터 버전 관리

추천 버전 체계:

- `calendar-data`: 역법/절기 캐시 버전
- `saju-core`: 천간/지지/십성/관계 규칙 버전
- `interpretation-rules`: 풀이 seed 버전
- `naming-data`: 작명 후보/한자 데이터 버전
- `safety-policy`: 금지 표현/주의 문구 버전

결과 리포트에는 생성 당시의 데이터 버전을 저장한다.

```ts
type ReportDataVersion = {
  calendarDataVersion: string;
  sajuCoreVersion: string;
  interpretationRulesVersion: string;
  namingDataVersion?: string;
  safetyPolicyVersion: string;
};
```

## 14. 초기 실행 체크리스트

- [ ] 한국천문연구원 음양력 API 활용 신청
- [ ] 한국천문연구원 특일 API 활용 신청
- [ ] 천간/지지/오행 정적 데이터 작성
- [ ] 십성 계산 규칙 작성
- [ ] 합/충 기본 관계표 작성
- [ ] 사주 계산 테스트 케이스 작성
- [ ] 작명용 성씨/음절 seed 작성
- [ ] Unihan 데이터 사용 방식 검토
- [ ] 대법원 인명용 한자 최신 자료 확인
- [ ] 금지 표현/주의 문구 데이터 작성

## 15. 개발자 작업 지시 예시

```md
docs/data-management.md를 기준으로 사주 데이터 레이어를 먼저 구현해줘.

우선순위:
1. src/data/saju 아래 천간, 지지, 십성, 합충 정적 데이터 작성
2. 생년월일시 입력값을 표준 DateTime으로 정규화하는 유틸 작성
3. 한국천문연구원 음양력 API 연동을 위한 어댑터 인터페이스 작성
4. API가 없어도 테스트 가능한 mock calendar provider 작성
5. 사주 계산 결과 타입과 테스트 케이스 작성

주의:
- 해석 문장은 우선 seed 데이터로만 관리한다.
- AI는 계산을 담당하지 않고 문장화를 담당한다.
- 음력/윤달/절기 경계는 반드시 테스트한다.
```
