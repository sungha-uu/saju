# 배포와 데이터 적용 방식

## 1. 핵심 정리

GitHub Pages는 정적 호스팅이다. 그래서 아래 파일은 GitHub Pages에서 자동 실행되지 않는다.

- `db/schema.sql`
- `db/seed.sql`
- `db/calendar-cache.sql`

즉 SQL을 만들어도 GitHub Pages 화면이 바로 달라지지 않는 것은 정상이다.

GitHub Pages에서 바로 반영되는 파일은 브라우저가 읽는 정적 파일이다.

- `index.html`
- `styles.css`
- `app.js`
- `data/fortune-seed.js`

## 2. 현재 구조

현재 앱은 두 종류의 데이터를 가진다.

### 2.1 정적 화면용 데이터

파일:

```txt
data/fortune-seed.js
```

용도:

- GitHub Pages 화면에서 바로 사용
- 계절 비유, 관운, 재물운, 이직운 문구를 프론트에서 표시
- 예: 1985-12-02 입력 시 유성하 예시 풀이가 더 구체적으로 표시됨

### 2.2 실제 DB용 데이터

파일:

```txt
db/schema.sql
db/seed.sql
```

용도:

- Supabase/PostgreSQL 같은 실제 DB에 실행
- 사주 계산 엔진과 AI 백엔드가 참조
- GitHub Pages만으로는 실행되지 않음

## 3. 만세력 캐시 생성

만세력 날짜 캐시는 공공데이터포털 API 키가 필요하다.

파일:

```txt
scripts/generate-calendar-cache.mjs
```

실행 예:

```bash
DATA_GO_KR_SERVICE_KEY="발급받은_서비스키" node scripts/generate-calendar-cache.mjs --from 1900 --to 2050 --out db/calendar-cache.sql --skip-solar-terms true
```

생성 결과:

```txt
db/calendar-cache.sql
```

이 파일은 `calendar_days`, `solar_terms`를 채우는 SQL이다.

현재 생성된 `db/calendar-cache.sql`은 공공데이터포털 `한국천문연구원_음양력 정보` API로 만든 1900~2050년 `calendar_days` 캐시다. `한국천문연구원_특일 정보`의 24절기 API는 현재 403 응답이어서 `solar_terms`는 아직 포함하지 않았다.

## 4. 실제 운영 구조

정적 GitHub Pages만 사용할 경우:

```txt
GitHub Pages
  -> index.html
  -> app.js
  -> data/fortune-seed.js
```

AI/DB까지 붙일 경우:

```txt
GitHub Pages
  -> API 서버 또는 Supabase Edge Function
    -> PostgreSQL/Supabase
      -> schema.sql
      -> seed.sql
      -> calendar-cache.sql
```

## 5. 왜 이전과 이후 결과가 같았나

SQL 파일은 브라우저에서 읽지 않는다. 그래서 `db/seed.sql`을 추가해도 `app.js`가 그 데이터를 읽지 않으면 화면 결과는 바뀌지 않는다.

이 문제를 줄이기 위해 현재는 `data/fortune-seed.js`를 추가했고, `app.js`가 이 데이터를 읽어 결과에 반영하도록 연결했다.
