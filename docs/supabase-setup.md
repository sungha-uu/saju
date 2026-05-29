# Supabase 연결 가이드

## 1. 왜 지금 바로 연결하지 않았나

Supabase 연결에는 프로젝트별 정보가 필요하다.

- Supabase Project URL
- Supabase anon public key
- DB 비밀번호 또는 SQL 실행 권한

이 값이 없으면 GitHub Pages에서 어떤 Supabase 프로젝트를 조회해야 하는지 알 수 없다. 그래서 코드에는 연결 지점을 만들어두고, 실제 값만 넣으면 동작하도록 구성한다.

## 2. 실행 순서

Supabase SQL Editor 또는 `psql`에서 아래 순서로 실행한다.

```txt
db/schema.sql
db/seed.sql
db/calendar-cache.sql
db/solar-terms-cache.sql
```

주의:

- `calendar-cache.sql`은 약 45MB라 Supabase SQL Editor에서 너무 클 수 있다.
- SQL Editor가 실패하면 `psql` 또는 Supabase CLI로 넣는 것이 좋다.

## 3. 공개 읽기 정책

GitHub Pages에서 직접 조회하려면 `calendar_days`, `solar_terms`를 읽기 전용으로 열어야 한다.

```sql
ALTER TABLE calendar_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE solar_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read calendar days"
ON calendar_days
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public read solar terms"
ON solar_terms
FOR SELECT
TO anon
USING (true);
```

쓰기/수정/삭제 정책은 만들지 않는다.

## 4. GitHub Pages 설정

`data/supabase-config.js`에 값을 넣는다.

```js
window.SUPABASE_CONFIG = {
  url: "https://프로젝트아이디.supabase.co",
  anonKey: "Supabase anon public key",
};
```

이 파일은 GitHub Pages에서 브라우저가 읽는다. `anonKey`는 공개될 수 있는 키지만, 반드시 RLS 정책으로 읽기만 허용해야 한다.

## 5. 현재 프론트 동작

사주팔자에서 생년월일을 입력하고 결과 보기를 누르면:

1. 먼저 `data/calendar/{year}.json`에서 입력 날짜의 만세력 데이터를 조회한다.
2. 정적 JSON에서 못 찾고 Supabase 설정이 있으면 `calendar_days`에서 입력 날짜를 조회한다.
3. 조회 성공 시 음력, 세차, 월건, 일진을 바탕으로 시주, 오행 점수, 십성, 지장간, 격국 후보, 용신/희신/기신 후보, 대운/세운 신호를 계산한다.
4. 계산 결과를 화면에 표시하고, 웹 GPT에 붙여넣을 수 있는 장문 풀이 프롬프트를 생성한다.
5. 조회 실패 또는 설정 없음이면 만세력 데이터가 없다고 표시한다. 정적 해석 문구로 대체하지 않는다.
