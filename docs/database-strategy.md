# 사주/운세 DB 구축 전략

## 1. 결론

관련 데이터를 DB로 구축할 수 있다. 전체 기준 스키마는 `db/schema.sql`, 초기 seed 데이터는 `db/seed.sql`로 관리한다. 다만 모든 데이터를 무조건 같은 방식으로 운영하는 것은 권장하지 않는다.

권장 방향은 다음과 같다.

- 변하지 않는 명리 기본표는 코드 seed와 DB seed를 함께 관리한다.
- 음양력, 윤달, 24절기 같은 역법 데이터는 DB에 캐시한다.
- 해석 규칙, 궁합 규칙, 작명 후보, 안전 문구는 DB로 관리해 운영 중 수정 가능하게 한다.
- 사용자 입력값과 생성 결과는 DB에 저장하되, 삭제/비식별화 정책을 둔다.
- 사용자 데이터가 많이 쌓인다고 해서 사주풀이의 객관적 정확도가 자동으로 높아지는 것은 아니다.
- 다만 사용자 피드백과 품질 평가 데이터가 쌓이면 표현 품질, 만족도, 일관성, 개인화 신뢰도는 개선할 수 있다.

## 2. DB에 넣을 데이터와 넣지 않을 데이터

| 데이터 | DB 구축 여부 | 이유 |
| --- | --- | --- |
| 천간/지지/오행/음양 | 가능, seed 권장 | 거의 변하지 않는 기준표 |
| 십성 계산 규칙 | 코드 우선, DB 보조 | 계산 규칙은 코드 테스트가 중요 |
| 지장간/합충형파해 | DB seed 권장 | 해석/궁합에서 자주 조회 |
| 양력/음력/윤달 | DB 캐시 필수 | 외부 API 장애와 속도 문제 방지 |
| 24절기 | DB 캐시 필수 | 월주/오늘 운세 기준에 중요 |
| 일간별 해석 | DB 권장 | 운영 중 문구 개선 필요 |
| 오행 과다/부족 해석 | DB 권장 | 콘텐츠 품질 개선 필요 |
| 궁합 규칙 | DB 권장 | 점수/문구 조정 필요 |
| 대운/세운 해석 규칙 | DB 권장 | 몇 살 전후 전환기, 이직운, 재물운 해석에 필요 |
| 계절감 비유 문구 | DB 권장 | "겨울에 핀 꽃" 같은 풀이 스타일에 필요 |
| 작명 한글 음절 | DB 권장 | 후보 관리와 필터링 필요 |
| 한자/뜻/획수 | DB 권장 | 작명 후보 검색에 필요 |
| AI 프롬프트 템플릿 | DB 또는 파일 | 버전 관리 필요 |
| 안전 정책/금지 표현 | DB 권장 | 빠른 수정 필요 |
| 사용자 생년월일시 | DB 가능, 민감 관리 | 저장 동의/삭제 필요 |
| AI 결과 리포트 | DB 권장 | 보관함/즐겨찾기 기능 |
| 원본 외부 API 전체 응답 | 선택 | 디버깅/검증용, 보관 기간 제한 |

## 3. 계속 업데이트가 필요한 데이터

### 3.1 거의 업데이트하지 않는 데이터

- 천간
- 지지
- 오행
- 음양
- 십성 기본 개념
- 지지 시간대
- 오행 상생/상극

이 데이터는 전통 규칙에 가까워 자주 바뀌지 않는다. 초기 seed를 만들고 테스트로 보호하면 된다.

### 3.2 가끔 업데이트해야 하는 데이터

- 해석 문구
- 궁합 조언 문구
- 작명 후보 태그
- 한자 뜻풀이
- 안전 문구
- 금지 표현
- AI 프롬프트 템플릿

이 데이터는 사용자 반응, 법적 리스크, 서비스 톤앤매너에 따라 개선할 수 있다.

권장 업데이트 주기:

- 초기 3개월: 1~2주마다 점검
- 안정화 후: 월 1회 점검
- 안전 정책: 이슈 발생 시 즉시 수정

### 3.3 주기적 확인이 필요한 데이터

- 공공 API 스펙
- 대법원 인명용 한자표
- 외부 한자 데이터 라이선스
- 24절기/음양력 캐시 범위

권장 업데이트 주기:

- API 스펙: 분기 1회 확인
- 인명용 한자표: 분기 또는 반기 1회 확인
- 캘린더 캐시: 연 1회, 필요 시 미래 연도 추가

## 4. 데이터가 쌓이면 정확도나 신뢰도가 높아지는가?

### 4.1 자동으로 높아지지 않는다

사주팔자는 과학적 예측 모델이라기보다 전통 해석 체계와 엔터테인먼트 콘텐츠에 가깝다. 사용자의 생년월일시와 결과 리포트가 많이 쌓인다고 해서 "미래 예측 정확도"가 자동으로 좋아지는 것은 아니다.

특히 아래 항목은 사용자 데이터가 많아져도 객관적으로 검증하기 어렵다.

- 미래 운세 적중률
- 연애/결혼 성공 여부
- 재물운 적중 여부
- 직업 성공 예측
- 건강/사고 예측

이런 영역은 서비스에서 예측 정확도처럼 표현하지 않는 것이 좋다.

### 4.2 개선할 수 있는 것은 따로 있다

데이터가 쌓이면 아래 품질은 개선할 수 있다.

- 사용자가 이해하기 쉬운 풀이 문장
- 사용자가 공감한 키워드 패턴
- 너무 무섭거나 단정적으로 느껴지는 표현 제거
- 궁합 결과의 톤 조정
- 작명 후보의 선호도 개선
- 재방문 사용자를 위한 개인화
- AI 결과의 일관성
- 안전 정책의 정교화

즉 "운명 예측 정확도"보다 "콘텐츠 신뢰감", "사용자 만족도", "해석 일관성"이 올라간다고 보는 것이 맞다.

### 4.3 신뢰도를 높이는 현실적인 방법

서비스 내 신뢰도는 다음 방식으로 높인다.

- 사주 명식 계산 정확도를 높인다.
- 음력/윤달/절기 경계값을 공식 데이터로 검증한다.
- 계산 결과와 AI 해석을 분리한다.
- AI가 임의로 명식을 만들지 못하게 한다.
- 같은 입력에는 같은 핵심 계산값이 나오게 한다.
- 결과에 사용한 데이터 버전을 기록한다.
- 사용자 피드백을 받아 표현과 추천 품질을 개선한다.
- 전문가 감수 버전을 별도로 관리한다.

## 5. 추천 DB 구성

초기에는 PostgreSQL을 기준으로 설계한다. 로컬 MVP에서는 SQLite로 시작해도 되지만, JSON 검색, 운영 관리, 확장성을 고려하면 PostgreSQL이 더 적합하다.

### 5.1 기준 데이터

```sql
CREATE TABLE heavenly_stems (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  element TEXT NOT NULL,
  yin_yang TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  description_seed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE earthly_branches (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  animal TEXT,
  element TEXT NOT NULL,
  yin_yang TEXT NOT NULL,
  time_range TEXT,
  month_order INTEGER,
  hidden_stems JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE saju_relations (
  id TEXT PRIMARY KEY,
  relation_type TEXT NOT NULL,
  source_key TEXT NOT NULL,
  target_key TEXT NOT NULL,
  label TEXT NOT NULL,
  effect_type TEXT,
  description_seed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 5.2 역법 데이터

```sql
CREATE TABLE calendar_days (
  date DATE PRIMARY KEY,
  solar_year INTEGER NOT NULL,
  solar_month INTEGER NOT NULL,
  solar_day INTEGER NOT NULL,
  lunar_year INTEGER NOT NULL,
  lunar_month INTEGER NOT NULL,
  lunar_day INTEGER NOT NULL,
  is_leap_month BOOLEAN NOT NULL DEFAULT false,
  year_ganji TEXT,
  month_ganji TEXT,
  day_ganji TEXT,
  julian_day NUMERIC,
  weekday INTEGER NOT NULL,
  source TEXT NOT NULL,
  source_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE solar_terms (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  name TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  term_order INTEGER NOT NULL,
  source TEXT NOT NULL,
  source_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (year, name)
);
```

### 5.3 해석 데이터

```sql
CREATE TABLE interpretation_rules (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  rule_key TEXT NOT NULL,
  condition JSONB NOT NULL DEFAULT '{}',
  title TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]',
  positive_hints JSONB NOT NULL DEFAULT '[]',
  caution_hints JSONB NOT NULL DEFAULT '[]',
  forbidden_claims JSONB NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE compatibility_rules (
  id TEXT PRIMARY KEY,
  relation_type TEXT,
  condition JSONB NOT NULL DEFAULT '{}',
  score_delta INTEGER NOT NULL DEFAULT 0,
  keywords JSONB NOT NULL DEFAULT '[]',
  attraction_hints JSONB NOT NULL DEFAULT '[]',
  caution_hints JSONB NOT NULL DEFAULT '[]',
  conversation_tips JSONB NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE advanced_saju_rules (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  condition JSONB NOT NULL DEFAULT '{}',
  metaphor TEXT,
  interpretations JSONB NOT NULL DEFAULT '[]',
  cautions JSONB NOT NULL DEFAULT '[]',
  timing_hints JSONB NOT NULL DEFAULT '[]',
  confidence TEXT NOT NULL DEFAULT 'medium',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

이 테이블은 아래와 같은 고급 풀이를 만들기 위해 사용한다.

- 계절감 비유: 겨울에 핀 꽃, 큰 강물, 마른 땅의 단비 같은 표현
- 관운: 조직, 직장, 직책, 시험, 규칙, 책임과의 관계
- 재물운: 돈이 모이는 방식, 새는 패턴, 재성이 들어오는 대운/세운
- 직업/이직운: 관성/재성/식상 흐름이 강해지는 나이대
- 대운/세운: 몇 살 전후 운이 열리거나 조심해야 하는 구간

### 5.4 작명 데이터

```sql
CREATE TABLE hangul_name_syllables (
  syllable TEXT PRIMARY KEY,
  gender_tone TEXT NOT NULL DEFAULT 'neutral',
  mood_tags JSONB NOT NULL DEFAULT '[]',
  element_hint TEXT,
  avoid_reason TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE hanja_characters (
  id TEXT PRIMARY KEY,
  char TEXT NOT NULL UNIQUE,
  korean_readings JSONB NOT NULL DEFAULT '[]',
  meaning_ko TEXT,
  meaning_en TEXT,
  total_strokes INTEGER,
  radical TEXT,
  name_usable BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL,
  source_version TEXT,
  tags JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 5.5 사용자/리포트 데이터

```sql
CREATE TABLE birth_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  nickname TEXT NOT NULL,
  gender TEXT,
  calendar_type TEXT NOT NULL,
  is_leap_month BOOLEAN,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_time_unknown BOOLEAN NOT NULL DEFAULT false,
  birth_place TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Seoul',
  consent_to_store BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE fortune_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  input_snapshot JSONB NOT NULL DEFAULT '{}',
  calculated_data JSONB NOT NULL DEFAULT '{}',
  ai_result JSONB NOT NULL DEFAULT '{}',
  data_versions JSONB NOT NULL DEFAULT '{}',
  favorite BOOLEAN NOT NULL DEFAULT false,
  user_rating INTEGER,
  user_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 5.6 운영/품질 데이터

```sql
CREATE TABLE safety_policies (
  id TEXT PRIMARY KEY,
  policy_type TEXT NOT NULL,
  pattern TEXT NOT NULL,
  replacement_hint TEXT,
  severity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```sql
CREATE TABLE data_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  license TEXT,
  retrieved_at TIMESTAMPTZ,
  source_version TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 6. 데이터 구축 순서

### 6.1 1단계: 고정 기준 데이터

- 천간
- 지지
- 오행
- 음양
- 지장간
- 오행 상생/상극
- 합/충 기본표
- 십성 계산 규칙

이 단계는 외부 API 없이 바로 구축할 수 있다.

### 6.2 2단계: 역법 캐시

- 한국천문연구원 음양력 API 신청
- 한국천문연구원 특일 API 신청
- 1900~2100년 범위의 날짜 데이터를 캐시
- 24절기 데이터를 캐시
- 공식 API 결과와 내부 계산 결과 비교 테스트

### 6.3 3단계: 해석/궁합/작명 seed

- 일간별 해석 seed
- 오행 과다/부족 해석 seed
- 십성별 해석 seed
- 궁합 규칙 seed
- 작명용 한글 음절 seed
- 작명용 한자 seed
- 안전 문구 seed

### 6.4 4단계: 운영 데이터

- 사용자 프로필
- 생성 리포트
- 즐겨찾기
- 피드백
- AI 프롬프트 버전
- 결과 품질 로그

## 7. 업데이트 정책

| 데이터 | 업데이트 방식 | 주기 |
| --- | --- | --- |
| 천간/지지/오행 | 마이그레이션 또는 seed 수정 | 거의 없음 |
| 역법 캐시 | 공식 API 동기화 | 연 1회 또는 필요 시 |
| 24절기 | 공식 API 동기화 | 연 1회 또는 미래 연도 추가 시 |
| 해석 규칙 | 관리자 수정 + 버전 증가 | 월 1회 |
| 궁합 규칙 | 관리자 수정 + 버전 증가 | 월 1회 |
| 작명 한자 | 외부 자료 확인 후 반영 | 분기/반기 |
| 안전 정책 | 즉시 수정 가능 | 상시 |
| AI 프롬프트 | 테스트 후 배포 | 필요 시 |
| 사용자 피드백 | 자동 적재 | 상시 |

## 8. 업데이트 주기 운영 기준

업데이트 주기는 운영자가 매번 새로 판단하는 것이 아니라, 데이터 성격별 기본 주기를 먼저 정해두고 예외 상황이 생기면 즉시 반영하는 방식으로 관리한다.

### 8.1 업데이트가 거의 필요 없는 데이터

대상:

- 천간
- 지지
- 오행
- 음양
- 오행 상생/상극
- 기본 십성 관계
- 지장간
- 지지 시간대

권장 주기:

- 정기 업데이트 없음
- 최초 구축 후 테스트로 보호
- 오류 발견 시에만 수정

업데이트가 필요한 경우:

- 초기 seed 데이터에 오타가 발견된 경우
- 계산 로직과 기준 데이터가 맞지 않는 경우
- 전문가 감수 과정에서 기준표 오류가 확인된 경우

운영 방식:

- 코드 seed와 DB seed를 버전으로 관리한다.
- 수정 시 기존 리포트의 계산값이 달라질 수 있으므로 변경 이력을 남긴다.

### 8.2 연 1회 정도 확인할 데이터

대상:

- 음양력 캐시
- 윤달 정보
- 24절기 캐시
- 공공 API 스펙
- 외부 데이터 출처 URL

권장 주기:

- 매년 11월~12월에 다음 해와 향후 5~10년 데이터를 확인한다.
- 서비스가 장기 운영될 경우 1900~2100년처럼 넓은 범위를 미리 캐시해도 된다.

업데이트가 필요한 경우:

- DB에 없는 미래 날짜를 사용자가 조회하려는 경우
- 한국천문연구원 API 응답 형식이 바뀐 경우
- 기존 캐시와 공식 API 결과가 다른 경우
- 절기 경계 계산 테스트가 실패한 경우

운영 방식:

- API를 매 요청마다 호출하지 않고 DB에 캐시한다.
- 캐시 생성 스크립트를 만들어 필요할 때 다시 실행한다.
- 캐시에는 `source`, `source_version`, `retrieved_at`을 저장한다.

### 8.3 월 1회 개선할 데이터

대상:

- 사주 풀이 문구
- 오행 과다/부족 해석
- 일간별 성향 해석
- 궁합 문구
- 관계 조언 문구
- 오늘의 운세 문장 seed
- 작명 후보 태그

권장 주기:

- 초기 MVP 운영 1~3개월: 1~2주마다 점검
- 안정화 후: 월 1회 점검

업데이트가 필요한 경우:

- 사용자가 "너무 무섭다", "단정적이다", "이해가 어렵다"고 피드백한 경우
- 특정 결과가 반복적으로 어색하게 나오는 경우
- 궁합 점수가 과도하게 높거나 낮게 쏠리는 경우
- 작명 후보가 촌스럽거나 부자연스럽다는 반응이 많은 경우

운영 방식:

- 문구를 바로 덮어쓰지 말고 버전을 올린다.
- 변경 전/후 결과를 샘플 입력으로 비교한다.
- AI 프롬프트와 해석 seed 중 무엇이 문제인지 분리해서 수정한다.

### 8.4 즉시 업데이트해야 하는 데이터

대상:

- 안전 정책
- 금지 표현
- 법적/의학적/투자 관련 위험 문구
- 개인정보 처리 문구
- AI 프롬프트의 위험한 지시

권장 주기:

- 정기 주기 없음
- 문제가 확인되면 즉시 반영

업데이트가 필요한 경우:

- 건강, 사고, 사망, 투자, 법률 판단처럼 금지된 결과가 생성된 경우
- 사용자에게 불안감을 주는 표현이 발견된 경우
- 특정 집단, 성별, 외모, 나이에 대한 편견 표현이 발견된 경우
- 개인정보가 결과나 공유 링크에 노출되는 경우

운영 방식:

- 안전 정책은 DB에서 빠르게 비활성화/수정할 수 있게 한다.
- 심각한 문제는 AI 응답 후처리 필터에도 즉시 추가한다.
- 문제 리포트에는 입력값 원문 대신 비식별화된 요약만 저장한다.

### 8.5 분기 또는 반기마다 확인할 데이터

대상:

- 대법원 인명용 한자표
- 한자 뜻/획수 데이터
- Unihan 등 외부 한자 데이터
- 작명용 한자 후보

권장 주기:

- 분기 1회 또는 반기 1회

업데이트가 필요한 경우:

- 인명용 한자 기준이 변경된 경우
- 한자 독음/뜻/획수 오류가 발견된 경우
- 이름 후보에 부정적 의미의 한자가 포함된 경우
- 사용자들이 특정 한자를 제외해달라는 피드백을 반복적으로 남긴 경우

운영 방식:

- 외부 데이터와 내부 서비스용 뜻풀이를 분리한다.
- 실제 출생 신고 가능 여부는 최신 공식 자료 확인 안내를 함께 제공한다.

## 9. 추천 운영 캘린더

초기 운영자가 바로 쓸 수 있는 기본 캘린더는 아래와 같다.

| 시점 | 할 일 |
| --- | --- |
| 매일 | 에러 로그, AI 실패 로그, 금지 표현 발생 여부 확인 |
| 매주 | 사용자 피드백 확인, 불편한 문구/어색한 결과 5~10개 수정 |
| 매월 | 풀이 seed, 궁합 seed, 작명 후보 태그, AI 프롬프트 품질 점검 |
| 분기 | 한자 데이터, 인명용 한자 자료, 외부 데이터 출처 확인 |
| 연 1회 | 음양력/24절기 미래 캐시, 공공 API 스펙, 데이터 백업 정책 확인 |
| 즉시 | 개인정보 노출, 위험 문구, 차별/혐오 표현, 건강/투자/법률 예측 발견 시 수정 |

## 10. 업데이트 판단 기준

아래 질문 중 하나라도 "예"라면 업데이트 대상이다.

- 계산 결과가 틀렸는가?
- 공식 데이터와 DB 캐시가 다른가?
- 사용자가 불안하거나 불쾌하게 느낄 표현인가?
- 너무 단정적이거나 예측처럼 보이는가?
- 같은 입력에서 결과 톤이 지나치게 흔들리는가?
- 작명 후보가 실제 사용하기 어렵거나 뜻이 부적절한가?
- 외부 API/데이터 출처가 바뀌었는가?
- 개인정보나 민감 정보가 필요 이상으로 저장되는가?

## 11. 운영자가 직접 정해야 하는 것

운영자가 정해야 하는 것은 모든 업데이트 주기가 아니라, 서비스 성격에 맞는 민감도와 품질 기준이다.

정해야 할 항목:

- 풀이 톤: 밝고 가벼운지, 조금 더 전통적인지
- 문구 수정 빈도: 초기에는 주 1회, 안정화 후 월 1회처럼 운영할지
- 사용자 피드백 반영 기준: 몇 건 이상 반복되면 수정할지
- 작명 후보의 스타일: 현대적 이름 중심인지, 전통적 이름도 포함할지
- 안전 정책 강도: 금지 표현을 얼마나 보수적으로 막을지
- 데이터 보관 기간: 비로그인 결과와 개인정보를 얼마나 보관할지

운영자가 매번 직접 판단하지 않도록, 위 기준을 정한 뒤 관리자 화면이나 seed 파일에서 관리하는 구조를 권장한다.

## 12. 사용자 데이터 활용 기준

사용자 데이터는 무조건 많이 모으는 것보다 목적을 정해서 최소 수집해야 한다.

수집해도 되는 데이터:

- 결과 만족도
- 결과가 이해되었는지 여부
- 마음에 든 키워드
- 작명 후보 선호도
- 부적절하거나 불편했던 표현 신고

주의해야 하는 데이터:

- 실명
- 정확한 생년월일시
- 가족/상대방 개인정보
- 관계 상태
- 민감한 고민

권장:

- 분석용 데이터는 비식별화한다.
- 리포트 공유 링크에는 원본 생년월일시를 노출하지 않는다.
- 사용자가 저장하지 않겠다고 선택하면 서버 저장을 피한다.

## 13. 사주풀이 품질 지표

"정확도"보다 아래 지표를 쓰는 것이 적합하다.

- 계산 정확도: 명식, 음력 변환, 절기 경계가 맞는가
- 해석 일관성: 같은 입력에 모순 없는 결과가 나오는가
- 공감도: 사용자가 자기이해에 도움이 된다고 느끼는가
- 안전성: 불안/공포/단정 표현이 없는가
- 설명력: 왜 그런 해석이 나왔는지 이해되는가
- 재방문 가치: 다시 보고 싶은 결과인가

## 14. 개발자 작업 지시 예시

```md
docs/database-strategy.md를 기준으로 DB schema와 seed 구조를 만들어줘.

우선순위:
1. PostgreSQL 기준 Prisma schema 작성
2. 천간/지지/오행/합충/십성 seed 작성
3. calendar provider 인터페이스 작성
4. calendar_days, solar_terms 캐시 테이블 작성
5. interpretation_rules, compatibility_rules, naming 관련 테이블 작성
6. fortune_reports에 data_versions, user_feedback 필드 포함

주의:
- AI는 계산하지 않고 해석 문장화를 담당한다.
- 사용자 생년월일시는 저장 동의를 받은 경우에만 저장한다.
- 사용자 데이터가 쌓인다고 예측 정확도가 높아진다고 표현하지 않는다.
```
