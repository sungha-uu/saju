-- Initial seed data for saju fortune service
-- Run after db/schema.sql.
-- This is the first baseline dataset. It gives the app real lookup data for
-- core myeongri concepts, long-form interpretation, compatibility, daily fortune,
-- naming, prompts, and safety policies.

BEGIN;

-- ---------------------------------------------------------------------------
-- Sources and versions
-- ---------------------------------------------------------------------------

INSERT INTO data_sources (id, name, url, license, retrieved_at, source_version, notes)
VALUES
  ('internal-myeongri-v1', 'Internal myeongri seed data', NULL, 'Internal', now(), '2026.05.29', 'Core stems, branches, elements, ten gods, interpretation seeds.'),
  ('kasi-calendar-api', 'Korea Astronomy and Space Science Institute calendar APIs', 'https://www.data.go.kr/', 'Public data usage terms apply', NULL, 'pending', 'Use for lunar calendar, solar terms, and ganji validation.'),
  ('unicode-unihan', 'Unicode Unihan Database', 'https://www.unicode.org/reports/tr38/', 'Unicode License', NULL, 'pending', 'Use for hanja metadata after license review.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  license = EXCLUDED.license,
  source_version = EXCLUDED.source_version,
  notes = EXCLUDED.notes,
  updated_at = now();

INSERT INTO data_versions (id, domain, version, source_ids, notes)
VALUES
  ('saju-core-2026-05-29', 'saju-core', '2026.05.29', '["internal-myeongri-v1"]', 'Initial core saju seed.'),
  ('saju-interpretation-2026-05-29', 'interpretation-rules', '2026.05.29', '["internal-myeongri-v1"]', 'Initial long-form reading seeds.'),
  ('safety-policy-2026-05-29', 'safety-policy', '2026.05.29', '["internal-myeongri-v1"]', 'Initial safety policy.'),
  ('naming-data-2026-05-29', 'naming-data', '2026.05.29', '["internal-myeongri-v1", "unicode-unihan"]', 'Initial naming seed.')
ON CONFLICT (domain, version) DO UPDATE SET
  source_ids = EXCLUDED.source_ids,
  notes = EXCLUDED.notes,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Five elements
-- ---------------------------------------------------------------------------

INSERT INTO five_elements
  (id, label_ko, label_hanja, direction, season, color, organ_metaphor, personality_keywords, description, sort_order)
VALUES
  ('wood', '목', '木', '동쪽', '봄', '초록', '성장과 순환', '["성장", "기획", "표현", "배움", "확장"]', '자라나는 힘, 계획, 표현, 관계의 확장을 상징한다.', 1),
  ('fire', '화', '火', '남쪽', '여름', '붉은색', '열과 활력', '["열정", "표현", "명예", "활력", "속도"]', '밝히고 드러내는 힘, 열정, 명예, 표현력을 상징한다.', 2),
  ('earth', '토', '土', '중앙', '환절기', '노란색', '기반과 소화', '["안정", "중재", "신뢰", "기반", "관리"]', '받치고 품는 힘, 안정, 중재, 현실 감각을 상징한다.', 3),
  ('metal', '금', '金', '서쪽', '가을', '흰색', '정리와 경계', '["규칙", "정리", "판단", "계약", "결실"]', '다듬고 구분하는 힘, 규칙, 계약, 결실을 상징한다.', 4),
  ('water', '수', '水', '북쪽', '겨울', '검정', '흐름과 회복', '["지혜", "감정", "직관", "이동", "생각"]', '흐르고 저장하는 힘, 지혜, 감정, 회복력을 상징한다.', 5)
ON CONFLICT (id) DO UPDATE SET
  label_ko = EXCLUDED.label_ko,
  label_hanja = EXCLUDED.label_hanja,
  direction = EXCLUDED.direction,
  season = EXCLUDED.season,
  color = EXCLUDED.color,
  organ_metaphor = EXCLUDED.organ_metaphor,
  personality_keywords = EXCLUDED.personality_keywords,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- ---------------------------------------------------------------------------
-- Heavenly stems and earthly branches
-- ---------------------------------------------------------------------------

INSERT INTO heavenly_stems
  (id, label_ko, label_hanja, element_id, yin_yang, sort_order, description_seed)
VALUES
  ('gap', '갑', '甲', 'wood', 'yang', 1, '큰 나무처럼 곧고 시작하는 힘이 강하다.'),
  ('eul', '을', '乙', 'wood', 'yin', 2, '풀과 꽃처럼 유연하고 섬세하게 자라는 힘이 있다.'),
  ('byeong', '병', '丙', 'fire', 'yang', 3, '태양처럼 드러내고 밝히는 힘이 있다.'),
  ('jeong', '정', '丁', 'fire', 'yin', 4, '촛불처럼 집중된 온기와 감수성이 있다.'),
  ('mu', '무', '戊', 'earth', 'yang', 5, '산처럼 중심을 잡고 버티는 힘이 있다.'),
  ('gi', '기', '己', 'earth', 'yin', 6, '밭처럼 받아들이고 길러내는 힘이 있다.'),
  ('gyeong', '경', '庚', 'metal', 'yang', 7, '큰 쇠처럼 결단과 절단의 힘이 있다.'),
  ('sin', '신', '辛', 'metal', 'yin', 8, '보석처럼 섬세한 기준과 완성도가 있다.'),
  ('im', '임', '壬', 'water', 'yang', 9, '큰 물처럼 넓게 흐르고 받아들이는 힘이 있다.'),
  ('gye', '계', '癸', 'water', 'yin', 10, '비와 샘물처럼 조용히 스며드는 지혜가 있다.')
ON CONFLICT (id) DO UPDATE SET
  label_ko = EXCLUDED.label_ko,
  label_hanja = EXCLUDED.label_hanja,
  element_id = EXCLUDED.element_id,
  yin_yang = EXCLUDED.yin_yang,
  sort_order = EXCLUDED.sort_order,
  description_seed = EXCLUDED.description_seed,
  updated_at = now();

INSERT INTO earthly_branches
  (id, label_ko, label_hanja, animal, element_id, yin_yang, month_order, time_start, time_end, season, sort_order, description_seed)
VALUES
  ('ja', '자', '子', '쥐', 'water', 'yang', 11, '23:00', '00:59', '겨울', 1, '깊은 밤의 물기처럼 저장과 시작의 기운이다.'),
  ('chuk', '축', '丑', '소', 'earth', 'yin', 12, '01:00', '02:59', '겨울', 2, '얼어붙은 흙처럼 참고 준비하는 기운이다.'),
  ('in', '인', '寅', '호랑이', 'wood', 'yang', 1, '03:00', '04:59', '봄', 3, '봄의 문을 여는 추진과 성장의 기운이다.'),
  ('myo', '묘', '卯', '토끼', 'wood', 'yin', 2, '05:00', '06:59', '봄', 4, '부드럽게 뻗는 생장과 관계의 기운이다.'),
  ('jin', '진', '辰', '용', 'earth', 'yang', 3, '07:00', '08:59', '봄', 5, '변화를 품은 습한 흙의 기운이다.'),
  ('sa', '사', '巳', '뱀', 'fire', 'yin', 4, '09:00', '10:59', '여름', 6, '불이 올라오기 시작하는 집중의 기운이다.'),
  ('o', '오', '午', '말', 'fire', 'yang', 5, '11:00', '12:59', '여름', 7, '한낮의 불처럼 드러나고 확산하는 기운이다.'),
  ('mi', '미', '未', '양', 'earth', 'yin', 6, '13:00', '14:59', '여름', 8, '열기를 머금은 흙처럼 정리와 숙성의 기운이다.'),
  ('sin_branch', '신', '申', '원숭이', 'metal', 'yang', 7, '15:00', '16:59', '가을', 9, '금 기운이 시작되어 정리와 판단이 살아난다.'),
  ('yu', '유', '酉', '닭', 'metal', 'yin', 8, '17:00', '18:59', '가을', 10, '결실과 완성, 날카로운 기준의 기운이다.'),
  ('sul', '술', '戌', '개', 'earth', 'yang', 9, '19:00', '20:59', '가을', 11, '마른 흙처럼 지키고 마무리하는 기운이다.'),
  ('hae', '해', '亥', '돼지', 'water', 'yin', 10, '21:00', '22:59', '겨울', 12, '겨울의 물처럼 감추고 회복하는 기운이다.')
ON CONFLICT (id) DO UPDATE SET
  label_ko = EXCLUDED.label_ko,
  label_hanja = EXCLUDED.label_hanja,
  animal = EXCLUDED.animal,
  element_id = EXCLUDED.element_id,
  yin_yang = EXCLUDED.yin_yang,
  month_order = EXCLUDED.month_order,
  time_start = EXCLUDED.time_start,
  time_end = EXCLUDED.time_end,
  season = EXCLUDED.season,
  sort_order = EXCLUDED.sort_order,
  description_seed = EXCLUDED.description_seed,
  updated_at = now();

INSERT INTO branch_hidden_stems (branch_id, stem_id, role, weight, sort_order)
VALUES
  ('ja', 'gye', 'main', 10, 1),
  ('chuk', 'gi', 'main', 6, 1), ('chuk', 'gye', 'middle', 3, 2), ('chuk', 'sin', 'sub', 1, 3),
  ('in', 'gap', 'main', 6, 1), ('in', 'byeong', 'middle', 3, 2), ('in', 'mu', 'sub', 1, 3),
  ('myo', 'eul', 'main', 10, 1),
  ('jin', 'mu', 'main', 6, 1), ('jin', 'eul', 'middle', 3, 2), ('jin', 'gye', 'sub', 1, 3),
  ('sa', 'byeong', 'main', 6, 1), ('sa', 'gyeong', 'middle', 3, 2), ('sa', 'mu', 'sub', 1, 3),
  ('o', 'jeong', 'main', 7, 1), ('o', 'gi', 'middle', 3, 2),
  ('mi', 'gi', 'main', 6, 1), ('mi', 'jeong', 'middle', 3, 2), ('mi', 'eul', 'sub', 1, 3),
  ('sin_branch', 'gyeong', 'main', 6, 1), ('sin_branch', 'im', 'middle', 3, 2), ('sin_branch', 'mu', 'sub', 1, 3),
  ('yu', 'sin', 'main', 10, 1),
  ('sul', 'mu', 'main', 6, 1), ('sul', 'sin', 'middle', 3, 2), ('sul', 'jeong', 'sub', 1, 3),
  ('hae', 'im', 'main', 7, 1), ('hae', 'gap', 'middle', 3, 2)
ON CONFLICT (branch_id, stem_id, role) DO UPDATE SET
  weight = EXCLUDED.weight,
  sort_order = EXCLUDED.sort_order;

-- Generate 60 gapja labels from stem/branch orders.
INSERT INTO sixty_gapja (id, stem_id, branch_id, label_ko, element_hint, description_seed)
SELECT
  n AS id,
  stems.id AS stem_id,
  branches.id AS branch_id,
  stems.label_ko || branches.label_ko AS label_ko,
  stems.element_id AS element_hint,
  stems.label_ko || branches.label_ko || ' 기둥은 ' || stems.description_seed || ' ' || branches.description_seed
FROM generate_series(1, 60) AS n
JOIN heavenly_stems stems ON stems.sort_order = ((n - 1) % 10) + 1
JOIN earthly_branches branches ON branches.sort_order = ((n - 1) % 12) + 1
ON CONFLICT (id) DO UPDATE SET
  stem_id = EXCLUDED.stem_id,
  branch_id = EXCLUDED.branch_id,
  label_ko = EXCLUDED.label_ko,
  element_hint = EXCLUDED.element_hint,
  description_seed = EXCLUDED.description_seed;

-- ---------------------------------------------------------------------------
-- Element, stem, branch relations
-- ---------------------------------------------------------------------------

INSERT INTO element_relations (source_element_id, target_element_id, relation_type, description_seed)
VALUES
  ('wood', 'fire', 'generates', '목은 화를 생하여 표현과 확산을 돕는다.'),
  ('fire', 'earth', 'generates', '화는 토를 생하여 결과를 기반으로 굳힌다.'),
  ('earth', 'metal', 'generates', '토는 금을 생하여 기준과 결실을 만든다.'),
  ('metal', 'water', 'generates', '금은 수를 생하여 지혜와 흐름을 연다.'),
  ('water', 'wood', 'generates', '수는 목을 생하여 성장과 배움을 돕는다.'),
  ('wood', 'earth', 'controls', '목은 토를 극하여 기반을 뚫고 방향을 만든다.'),
  ('earth', 'water', 'controls', '토는 수를 극하여 흐름을 가두고 안정시킨다.'),
  ('water', 'fire', 'controls', '수는 화를 극하여 열기를 조절한다.'),
  ('fire', 'metal', 'controls', '화는 금을 극하여 단단한 것을 녹이고 변화시킨다.'),
  ('metal', 'wood', 'controls', '금은 목을 극하여 성장에 기준을 세운다.')
ON CONFLICT (source_element_id, target_element_id, relation_type) DO UPDATE SET
  description_seed = EXCLUDED.description_seed;

INSERT INTO branch_relations (source_branch_id, target_branch_id, relation_type, group_key, transformed_element_id, interpretation_seed)
VALUES
  ('ja', 'chuk', 'six_harmony', 'ja-chuk', 'earth', '차가운 기운이 현실적 기반으로 묶이는 합이다.'),
  ('in', 'hae', 'six_harmony', 'in-hae', 'wood', '숨은 가능성이 성장으로 풀리는 합이다.'),
  ('myo', 'sul', 'six_harmony', 'myo-sul', 'fire', '관계와 표현이 따뜻하게 살아나는 합이다.'),
  ('jin', 'yu', 'six_harmony', 'jin-yu', 'metal', '정리와 결실로 이어지는 합이다.'),
  ('sa', 'sin_branch', 'six_harmony', 'sa-sin', 'water', '열기와 판단이 만나 변화를 만든다.'),
  ('o', 'mi', 'six_harmony', 'o-mi', 'fire', '열기와 숙성이 이어지는 합이다.'),
  ('ja', 'o', 'clash', 'ja-o', NULL, '감정과 표현, 내면과 외부 활동의 충돌을 뜻한다.'),
  ('chuk', 'mi', 'clash', 'chuk-mi', NULL, '기반과 책임의 방향이 흔들리는 충이다.'),
  ('in', 'sin_branch', 'clash', 'in-sin', NULL, '시작과 정리, 추진과 판단이 부딪히는 충이다.'),
  ('myo', 'yu', 'clash', 'myo-yu', NULL, '관계와 기준, 부드러움과 날카로움의 충이다.'),
  ('jin', 'sul', 'clash', 'jin-sul', NULL, '묵은 구조와 새 변화가 부딪히는 충이다.'),
  ('sa', 'hae', 'clash', 'sa-hae', NULL, '열기와 물기, 드러남과 감춤의 충이다.')
ON CONFLICT (source_branch_id, target_branch_id, relation_type, COALESCE(group_key, '')) DO UPDATE SET
  transformed_element_id = EXCLUDED.transformed_element_id,
  interpretation_seed = EXCLUDED.interpretation_seed;

-- ---------------------------------------------------------------------------
-- Ten gods, twelve life stages, special stars
-- ---------------------------------------------------------------------------

INSERT INTO ten_gods
  (id, label_ko, label_hanja, group_name, element_relation, yin_yang_relation, keywords, strengths, cautions, career_hints, wealth_hints, relationship_hints, description_seed, sort_order)
VALUES
  ('bigyeon', '비견', '比肩', 'self', 'same', 'same', '["자존", "독립", "동료", "경쟁"]', '["자기 기준", "독립성", "꾸준함"]', '["고집", "비교심"]', '["프리랜스", "전문직", "동료 협업"]', '["공동 지출 주의"]', '["대등한 관계 선호"]', '나와 같은 기운으로 자존과 독립성을 뜻한다.', 1),
  ('geopjae', '겁재', '劫財', 'self', 'same', 'opposite', '["경쟁", "승부", "분산", "친구"]', '["추진력", "위기 대응"]', '["재물 분산", "관계 경쟁"]', '["영업", "경쟁 시장"]', '["동업/보증 주의"]', '["강한 친구 인연"]', '나와 같은 편이면서도 재물을 나누는 기운이다.', 2),
  ('siksin', '식신', '食神', 'output', 'generated_by_self', 'same', '["표현", "생산", "먹을복", "꾸준함"]', '["콘텐츠 생산", "성실함"]', '["느슨함", "안주"]', '["콘텐츠", "교육", "식음료"]', '["꾸준한 수입"]', '["편안한 표현"]', '내가 생하는 기운으로 생산과 표현을 뜻한다.', 3),
  ('sanggwan', '상관', '傷官', 'output', 'generated_by_self', 'opposite', '["재능", "반골", "표현", "변화"]', '["창의성", "문제 제기"]', '["규칙 충돌", "말실수"]', '["기획", "창작", "마케팅"]', '["능력 기반 수입"]', '["솔직한 표현"]', '날카로운 표현과 재능, 기존 규칙을 깨는 힘이다.', 4),
  ('pyeonjae', '편재', '偏財', 'wealth', 'controlled_by_self', 'same', '["사업", "유통", "큰돈", "활동성"]', '["사업 감각", "외부 기회"]', '["충동 투자", "무리한 확장"]', '["사업", "영업", "투자 관리"]', '["큰돈 흐름"]', '["넓은 인맥"]', '내가 다루는 재물로 사업성과 외부 재물을 뜻한다.', 5),
  ('jeongjae', '정재', '正財', 'wealth', 'controlled_by_self', 'opposite', '["월급", "저축", "현실", "안정"]', '["관리 능력", "성실한 축적"]', '["소심함", "기회 회피"]', '["회계", "관리", "운영"]', '["안정 수입"]', '["책임 있는 관계"]', '정돈된 재물과 안정적 수입을 뜻한다.', 6),
  ('pyeongwan', '편관', '偏官', 'official', 'controls_self', 'same', '["압박", "도전", "권위", "위기"]', '["돌파력", "책임감"]', '["스트레스", "무리"]', '["조직 책임", "위기 대응"]', '["위험 보상"]', '["강한 인연"]', '나를 제어하는 강한 기운으로 도전과 압박을 뜻한다.', 7),
  ('jeonggwan', '정관', '正官', 'official', 'controls_self', 'opposite', '["직장", "명예", "규칙", "책임"]', '["신뢰", "조직 적응"]', '["경직성", "눈치"]', '["공직", "대기업", "관리직"]', '["정기 수입"]', '["공식 관계"]', '나를 바르게 세우는 기운으로 직장, 명예, 규칙을 뜻한다.', 8),
  ('pyeonin', '편인', '偏印', 'resource', 'generates_self', 'same', '["직감", "연구", "고독", "특수성"]', '["깊은 공부", "독창성"]', '["고립", "의심"]', '["연구", "상담", "전문 지식"]', '["지식 수익"]', '["거리감"]', '나를 생하는 특수한 지식과 직관의 기운이다.', 9),
  ('jeongin', '정인', '正印', 'resource', 'generates_self', 'opposite', '["학문", "보호", "문서", "자격"]', '["학습력", "문서운"]', '["의존", "실행 지연"]', '["교육", "문서", "자격 기반"]', '["안정 지원"]', '["보호적 관계"]', '나를 생하는 안정적 자원으로 학문, 문서, 보호를 뜻한다.', 10)
ON CONFLICT (id) DO UPDATE SET
  label_ko = EXCLUDED.label_ko,
  label_hanja = EXCLUDED.label_hanja,
  group_name = EXCLUDED.group_name,
  element_relation = EXCLUDED.element_relation,
  yin_yang_relation = EXCLUDED.yin_yang_relation,
  keywords = EXCLUDED.keywords,
  strengths = EXCLUDED.strengths,
  cautions = EXCLUDED.cautions,
  career_hints = EXCLUDED.career_hints,
  wealth_hints = EXCLUDED.wealth_hints,
  relationship_hints = EXCLUDED.relationship_hints,
  description_seed = EXCLUDED.description_seed,
  sort_order = EXCLUDED.sort_order;

INSERT INTO twelve_life_stages (id, label_ko, label_hanja, keywords, interpretation_seed, sort_order)
VALUES
  ('jangsaeng', '장생', '長生', '["시작", "성장", "도움"]', '새롭게 자라나는 시작과 도움의 기운이다.', 1),
  ('mokyok', '목욕', '沐浴', '["매력", "감수성", "변화"]', '감수성과 매력이 살아나지만 흔들림도 있다.', 2),
  ('gwandae', '관대', '冠帶', '["자존", "성장", "외부 활동"]', '사회적 자존과 외부 활동성이 커진다.', 3),
  ('geonrok', '건록', '建祿', '["자립", "실력", "기반"]', '자립과 실력의 기반을 세우는 힘이다.', 4),
  ('jewang', '제왕', '帝旺', '["정점", "강함", "주도"]', '기운이 가장 강하게 드러나는 정점이다.', 5),
  ('soi', '쇠', '衰', '["조절", "관리", "완급"]', '강한 기운을 조절하고 관리하는 시기다.', 6),
  ('byeong', '병', '病', '["민감", "점검", "회복"]', '예민함과 점검이 필요한 기운이다.', 7),
  ('sa_stage', '사', '死', '["정지", "전환", "정리"]', '멈춤과 전환, 정리가 필요한 기운이다.', 8),
  ('myo_stage', '묘', '墓', '["저장", "축적", "닫힘"]', '기운이 안으로 모이고 저장되는 흐름이다.', 9),
  ('jeol', '절', '絶', '["단절", "새 출발", "비움"]', '낡은 흐름을 끊고 새 출발을 준비한다.', 10),
  ('tae', '태', '胎', '["잉태", "가능성", "준비"]', '아직 드러나지 않은 가능성이 생긴다.', 11),
  ('yang', '양', '養', '["양육", "보호", "준비"]', '기운을 기르고 보호하는 흐름이다.', 12)
ON CONFLICT (id) DO UPDATE SET
  label_ko = EXCLUDED.label_ko,
  label_hanja = EXCLUDED.label_hanja,
  keywords = EXCLUDED.keywords,
  interpretation_seed = EXCLUDED.interpretation_seed,
  sort_order = EXCLUDED.sort_order;

INSERT INTO special_stars (id, label_ko, label_hanja, category, keywords, interpretation_seed, caution_seed)
VALUES
  ('yeokma', '역마', '驛馬', 'movement', '["이동", "변화", "출장", "이직"]', '움직임과 변화가 활발해지는 별이다.', '성급한 이동과 충동적 이직은 주의한다.'),
  ('dowha', '도화', '桃花', 'charm', '["매력", "인기", "표현", "관계"]', '사람의 시선을 끌고 매력이 드러나는 별이다.', '관계가 복잡해지지 않도록 경계를 세운다.'),
  ('hwagae', '화개', '華蓋', 'depth', '["예술", "고독", "종교성", "몰입"]', '예술성과 몰입, 내면의 깊이를 뜻한다.', '혼자만의 세계에 갇히지 않도록 한다.'),
  ('mungo', '문곡', '文曲', 'study', '["글", "공부", "문서", "표현"]', '글과 문서, 공부, 표현력에 도움을 준다.', '생각만 많고 실행이 늦어지는 점을 주의한다.')
ON CONFLICT (id) DO UPDATE SET
  label_ko = EXCLUDED.label_ko,
  label_hanja = EXCLUDED.label_hanja,
  category = EXCLUDED.category,
  keywords = EXCLUDED.keywords,
  interpretation_seed = EXCLUDED.interpretation_seed,
  caution_seed = EXCLUDED.caution_seed;

-- ---------------------------------------------------------------------------
-- Long-form interpretation seeds
-- ---------------------------------------------------------------------------

INSERT INTO season_metaphor_rules
  (id, day_stem_id, month_branch_id, dominant_element_id, weak_element_id, metaphor, explanation, version)
VALUES
  ('winter-eul-flower', 'eul', 'ja', 'water', 'fire', '겨울 물가에 핀 작은 꽃 같은 사주', '["차가운 환경 속에서도 부드럽게 버티는 생명력이 있다.", "따뜻한 화 기운과 단단한 금 기운이 들어올 때 재능이 현실에서 빛난다."]', '2026.05.29'),
  ('winter-eul-frozen-garden', 'eul', 'chuk', 'water', 'fire', '얼어붙은 정원에서 봄을 기다리는 코스모스 같은 사주', '["겉으로는 조용하지만 안쪽에는 오래 버티는 생장력이 있다.", "초년보다 중년 이후에 자기 색이 분명해지는 흐름으로 본다."]', '2026.05.29'),
  ('winter-gap-tree', 'gap', 'ja', 'water', 'fire', '겨울 강가에 선 큰 나무 같은 사주', '["생각이 깊고 책임감이 있으나 온기와 실행력이 필요하다.", "좋은 환경을 만나면 늦게 크게 자라는 힘이 있다."]', '2026.05.29'),
  ('summer-gye-rain', 'gye', 'o', 'fire', 'water', '한여름에 내리는 단비 같은 사주', '["뜨거운 판을 식히고 분위기를 부드럽게 만드는 재능이 있다.", "다만 스스로 소진되지 않도록 회복 루틴이 필요하다."]', '2026.05.29')
ON CONFLICT (id) DO UPDATE SET
  day_stem_id = EXCLUDED.day_stem_id,
  month_branch_id = EXCLUDED.month_branch_id,
  dominant_element_id = EXCLUDED.dominant_element_id,
  weak_element_id = EXCLUDED.weak_element_id,
  metaphor = EXCLUDED.metaphor,
  explanation = EXCLUDED.explanation,
  version = EXCLUDED.version;

INSERT INTO advanced_saju_rules
  (id, domain, condition, metaphor, interpretations, cautions, timing_hints, confidence, version)
VALUES
  ('official-weak-autonomy', 'official_luck', '{"official_score":"low"}', NULL,
   '["관운이 약하다는 말은 직장운이 없다는 뜻이 아니라, 획일적인 규칙보다 자율성과 전문성이 살아나는 환경이 더 맞는다는 뜻으로 해석한다.", "조직에 들어가더라도 직책보다 실무 권한, 전문성, 독립적 판단이 보장될 때 오래 간다."]',
   '["상사의 말 한마디에 감정적으로 퇴사나 이직을 결정하지 않도록 한다.", "계약 조건과 역할 범위는 문서로 확인한다."]',
   '[{"ageRange":"27~30세","theme":"이직/역할 변화","body":"관성이나 역마가 활성화되는 세운이면 직장 이동, 부서 변화, 시험, 직책 변화가 들어올 수 있다."}]',
   'medium', '2026.05.29'),
  ('wealth-opens-middle-age', 'wealth_luck', '{"wealth_score":"medium","structure_score":"needed"}', NULL,
   '["재물운은 초반에 크게 터지기보다 30대 후반부터 40대 초중반에 수입 구조가 정리되며 안정되는 흐름으로 해석한다.", "기획력과 신뢰가 쌓인 뒤 돈이 따라오는 타입이므로 평판과 반복 고객이 중요하다."]',
   '["큰돈을 한 번에 노리는 방식보다 고정 수입과 장기 축적을 우선한다.", "동업, 보증, 감정적 투자는 신중히 본다."]',
   '[{"ageRange":"38~43세","theme":"재물 구조 정리","body":"재성 흐름이 대운/세운에서 보강되면 수익 모델, 자산 관리, 사업 확장 기회가 생긴다."}]',
   'medium', '2026.05.29'),
  ('career-change-late-twenties', 'career_luck', '{"age":"late_20s","relation_events":["clash","official"]}', NULL,
   '["20대 후반에는 직장, 역할, 공부 방향이 바뀌는 신호가 들어올 수 있다.", "이직운은 무조건 떠나는 운이 아니라 더 맞는 환경을 찾는 운으로 본다."]',
   '["좋은 제안처럼 보여도 처우, 성장 가능성, 상사/조직 문화, 계약 조건을 확인한다.", "감정적 퇴사는 피한다."]',
   '[{"ageRange":"27~29세","theme":"이직 검토","body":"관성 또는 충이 강해지는 해라면 이직, 직무 전환, 시험, 자격 취득을 검토하기 쉽다."}]',
   'medium', '2026.05.29'),
  ('children-unknown-hour', 'children_luck', '{"birth_time_unknown":true}', NULL,
   '["출생 시간이 없으면 자식운과 말년운은 시주가 빠져 세밀한 판단이 어렵다.", "대신 원국의 식상 흐름과 대운/세운에서 들어오는 식상 기운을 보조적으로 본다."]',
   '["자식운을 단정하지 않는다.", "임신, 출산, 건강 관련 예측은 하지 않는다."]',
   '[]',
   'low', '2026.05.29'),
  ('condition-water-heavy', 'health_condition', '{"dominant_element":"water"}', NULL,
   '["수 기운이 강하면 생각과 감정이 몸의 리듬에 영향을 주기 쉽다.", "컨디션 관리는 수면, 체온, 순환, 기록 습관을 중심으로 본다."]',
   '["질병명이나 진단처럼 표현하지 않는다.", "불편한 증상은 전문가 상담을 안내한다."]',
   '[]',
   'medium', '2026.05.29')
ON CONFLICT (id) DO UPDATE SET
  domain = EXCLUDED.domain,
  condition = EXCLUDED.condition,
  metaphor = EXCLUDED.metaphor,
  interpretations = EXCLUDED.interpretations,
  cautions = EXCLUDED.cautions,
  timing_hints = EXCLUDED.timing_hints,
  confidence = EXCLUDED.confidence,
  version = EXCLUDED.version,
  updated_at = now();

INSERT INTO luck_domain_rules
  (id, domain, condition, title, body_templates, timing_logic, version)
VALUES
  ('job-official-year', 'career', '{"ten_god":"jeonggwan"}', '직장/관운이 들어오는 해',
   '["직장, 시험, 직책, 평가, 계약처럼 공식적인 일이 부각된다.", "좋은 직장운은 책임도 함께 오므로 조건을 꼼꼼히 봐야 한다."]',
   '{"lookFor":["yearly_luck.ten_god=jeonggwan","daewoon.ten_god=jeonggwan","branch_relation=clash"]}', '2026.05.29'),
  ('wealth-resource-build', 'wealth', '{"ten_god":"jeongjae"}', '안정 재물운',
   '["고정 수입, 저축, 현실적 자산 관리에 유리하다.", "작은 돈을 지키는 습관이 큰돈의 기반이 된다."]',
   '{"lookFor":["yearly_luck.ten_god=jeongjae","daewoon.ten_god=jeongjae"]}', '2026.05.29'),
  ('business-pyeonjae', 'business', '{"ten_god":"pyeonjae"}', '사업/외부 재물운',
   '["외부 기회, 거래처, 영업, 사업 확장이 활발해질 수 있다.", "규모를 키우기 전 정산과 계약 구조를 먼저 세워야 한다."]',
   '{"lookFor":["yearly_luck.ten_god=pyeonjae","daewoon.ten_god=pyeonjae"]}', '2026.05.29'),
  ('move-yeokma', 'career', '{"special_star":"yeokma"}', '이동/이직운',
   '["이동, 출장, 이사, 부서 이동, 이직 검토가 들어오기 쉽다.", "이동이 곧 성공은 아니므로 조건 비교가 필요하다."]',
   '{"lookFor":["special_star=yeokma","branch_relation=clash"]}', '2026.05.29')
ON CONFLICT (id) DO UPDATE SET
  domain = EXCLUDED.domain,
  condition = EXCLUDED.condition,
  title = EXCLUDED.title,
  body_templates = EXCLUDED.body_templates,
  timing_logic = EXCLUDED.timing_logic,
  version = EXCLUDED.version,
  updated_at = now();

INSERT INTO reading_section_templates
  (id, report_type, section_key, title, sort_order, prompt_hints, required_data, safety_rules, version)
VALUES
  ('saju-summary-v1', 'saju', 'summary', '전체 총평', 1, '["사주의 핵심 비유와 전체 흐름을 장문으로 설명한다."]', '["chart", "element_scores", "season_metaphor"]', '["no_deterministic_claims"]', '2026.05.29'),
  ('saju-career-v1', 'saju', 'career', '직업운과 관운', 2, '["관성, 식상, 인성, 대운/세운을 바탕으로 직업 성향과 이직 가능 구간을 설명한다."]', '["ten_god_scores", "daewoon", "yearly_luck"]', '["avoid_absolute_job_prediction"]', '2026.05.29'),
  ('saju-wealth-v1', 'saju', 'wealth', '금전운', 3, '["재성 흐름과 돈이 모이는 방식, 새는 패턴, 좋아지는 나이대를 설명한다."]', '["wealth_score", "daewoon", "yearly_luck"]', '["no_investment_advice"]', '2026.05.29'),
  ('saju-family-v1', 'saju', 'family', '배우자운과 자식운', 4, '["배우자운과 자식운은 단정하지 않고 관계 패턴과 신뢰도 제한을 함께 설명한다."]', '["relationship_luck", "children_luck", "birth_time_unknown"]', '["no_reproductive_prediction"]', '2026.05.29'),
  ('saju-timing-v1', 'saju', 'timing', '나이대별 흐름', 5, '["대운/세운을 바탕으로 운이 트이는 구간과 조심할 구간을 표로 정리한다."]', '["daewoon", "yearly_luck", "samjae"]', '["no_fatalism"]', '2026.05.29')
ON CONFLICT (report_type, section_key, version) DO UPDATE SET
  title = EXCLUDED.title,
  sort_order = EXCLUDED.sort_order,
  prompt_hints = EXCLUDED.prompt_hints,
  required_data = EXCLUDED.required_data,
  safety_rules = EXCLUDED.safety_rules;

-- ---------------------------------------------------------------------------
-- Compatibility, daily fortune, naming
-- ---------------------------------------------------------------------------

INSERT INTO compatibility_rules
  (id, relation_type, condition, score_delta, keywords, attraction_hints, caution_hints, conversation_tips, timing_hints, version)
VALUES
  ('compat-element-generate', NULL, '{"relation":"element_generates"}', 8, '["보완", "성장", "도움"]', '["한 사람의 기운이 다른 사람의 성장을 돕는다."]', '["도움이 간섭처럼 느껴지지 않게 한다."]', '["조언보다 질문을 먼저 건넨다."]', '[]', '2026.05.29'),
  ('compat-branch-clash', NULL, '{"relation":"branch_clash"}', -7, '["긴장", "속도 차이", "변화"]', '["서로에게 새로운 자극을 줄 수 있다."]', '["생활 리듬과 감정 표현 속도가 부딪힐 수 있다."]', '["중요한 결정은 시간을 두고 합의한다."]', '[]', '2026.05.29'),
  ('compat-couple-official-wealth', 'couple', '{"mix":["official","wealth"]}', 5, '["현실감", "책임", "안정"]', '["관계가 현실적 기반으로 이어지기 쉽다."]', '["책임이 의무감으로만 느껴지지 않게 한다."]', '["돈과 일정 이야기를 피하지 않는다."]', '[]', '2026.05.29')
ON CONFLICT (id) DO UPDATE SET
  relation_type = EXCLUDED.relation_type,
  condition = EXCLUDED.condition,
  score_delta = EXCLUDED.score_delta,
  keywords = EXCLUDED.keywords,
  attraction_hints = EXCLUDED.attraction_hints,
  caution_hints = EXCLUDED.caution_hints,
  conversation_tips = EXCLUDED.conversation_tips,
  timing_hints = EXCLUDED.timing_hints,
  version = EXCLUDED.version,
  updated_at = now();

INSERT INTO daily_fortune_rules
  (id, condition, focus_area, body_templates, lucky_hints, caution_hints, version)
VALUES
  ('daily-water-day', '{"day_element":"water"}', '전체', '["생각과 감정의 흐름이 깊어지는 날이다.", "기록하고 정리하면 마음이 가벼워진다."]', '{"colors":["세이지", "네이비"], "numbers":[2,6]}', '["답장을 서두르지 않는다.", "밤늦은 고민을 줄인다."]', '2026.05.29'),
  ('daily-fire-day', '{"day_element":"fire"}', '일', '["표현과 발표, 외부 활동이 살아나는 날이다.", "짧고 분명한 메시지가 좋다."]', '{"colors":["코랄", "아이보리"], "numbers":[3,9]}', '["말이 앞서지 않게 한다."]', '2026.05.29')
ON CONFLICT (id) DO UPDATE SET
  condition = EXCLUDED.condition,
  focus_area = EXCLUDED.focus_area,
  body_templates = EXCLUDED.body_templates,
  lucky_hints = EXCLUDED.lucky_hints,
  caution_hints = EXCLUDED.caution_hints,
  version = EXCLUDED.version;

INSERT INTO korean_surnames (hangul, hanja, commonness_rank, sound_tags, notes)
VALUES
  ('김', '金', 1, '["받침", "단단함"]', '가장 흔한 성씨.'),
  ('이', '李', 2, '["모음 시작", "부드러움"]', '밝고 열린 이름과 잘 어울림.'),
  ('박', '朴', 3, '["받침", "명료함"]', '강한 첫소리 이름과 균형 필요.'),
  ('최', '崔', 4, '["센소리", "세련됨"]', '부드러운 이름과 조합 좋음.'),
  ('유', '柳', 20, '["모음", "유연함"]', '부드럽고 흐르는 이름과 조합 좋음.')
ON CONFLICT (hangul, COALESCE(hanja, '')) DO UPDATE SET
  commonness_rank = EXCLUDED.commonness_rank,
  sound_tags = EXCLUDED.sound_tags,
  notes = EXCLUDED.notes;

INSERT INTO hangul_name_syllables
  (syllable, gender_tone, mood_tags, element_hint, sound_tags, avoid_reason)
VALUES
  ('하', 'neutral', '["밝은", "맑은", "현대적인"]', 'fire', '["열림", "부드러움"]', NULL),
  ('린', 'feminine', '["섬세한", "맑은"]', 'water', '["받침", "부드러움"]', NULL),
  ('서', 'neutral', '["단정한", "지적인"]', 'metal', '["열림", "차분함"]', NULL),
  ('윤', 'neutral', '["부드러운", "신뢰감"]', 'water', '["받침", "둥근 소리"]', NULL),
  ('이', 'neutral', '["밝은", "가벼운"]', 'wood', '["모음", "열림"]', NULL),
  ('안', 'neutral', '["안정적인", "현대적인"]', 'earth', '["받침", "안정감"]', NULL)
ON CONFLICT (syllable) DO UPDATE SET
  gender_tone = EXCLUDED.gender_tone,
  mood_tags = EXCLUDED.mood_tags,
  element_hint = EXCLUDED.element_hint,
  sound_tags = EXCLUDED.sound_tags,
  avoid_reason = EXCLUDED.avoid_reason,
  updated_at = now();

INSERT INTO hanja_characters
  (char, korean_readings, meaning_ko, meaning_en, total_strokes, radical, element_hint, name_usable, source_id, source_version, tags)
VALUES
  ('河', '["하"]', '강, 물길', 'river', 8, '水', 'water', true, 'internal-myeongri-v1', '2026.05.29', '["물", "흐름", "확장"]'),
  ('夏', '["하"]', '여름, 밝음', 'summer', 10, '夊', 'fire', true, 'internal-myeongri-v1', '2026.05.29', '["밝음", "활력"]'),
  ('潾', '["린"]', '맑은 물결', 'clear water', 16, '水', 'water', true, 'internal-myeongri-v1', '2026.05.29', '["맑음", "물"]'),
  ('瑞', '["서"]', '상서로움', 'auspicious', 13, '玉', 'metal', true, 'internal-myeongri-v1', '2026.05.29', '["길상", "단정"]'),
  ('潤', '["윤"]', '윤택함, 적심', 'moist, enrich', 15, '水', 'water', true, 'internal-myeongri-v1', '2026.05.29', '["윤택", "물"]'),
  ('安', '["안"]', '편안함', 'peace', 6, '宀', 'earth', true, 'internal-myeongri-v1', '2026.05.29', '["안정", "평온"]')
ON CONFLICT (char) DO UPDATE SET
  korean_readings = EXCLUDED.korean_readings,
  meaning_ko = EXCLUDED.meaning_ko,
  meaning_en = EXCLUDED.meaning_en,
  total_strokes = EXCLUDED.total_strokes,
  radical = EXCLUDED.radical,
  element_hint = EXCLUDED.element_hint,
  name_usable = EXCLUDED.name_usable,
  source_id = EXCLUDED.source_id,
  source_version = EXCLUDED.source_version,
  tags = EXCLUDED.tags,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- AI prompt and safety policies
-- ---------------------------------------------------------------------------

INSERT INTO ai_prompt_templates
  (id, report_type, template_key, system_prompt, user_prompt_template, output_schema, version)
VALUES
  ('saju-long-report-v1', 'saju', 'long_report',
   '한국어로 사주 장문 리포트를 작성한다. 계산값과 DB seed만 근거로 사용하고, 미래를 확정하지 않는다. 건강, 투자, 법률, 사고, 사망, 임신 관련 단정은 금지한다.',
   '입력된 사주 계산 결과, 대운/세운, 해석 seed를 바탕으로 전체 총평, 오행, 어린시절, 직업운, 금전운, 사업운, 배우자운, 자식운, 건강/컨디션, 나이대별 흐름을 작성한다.',
   '{"type":"object","required":["summary","sections","disclaimer"]}', '2026.05.29'),
  ('compatibility-report-v1', 'compatibility', 'compatibility_report',
   '한국어로 궁합 리포트를 작성한다. 관계를 단정하거나 조종하는 표현은 금지한다.',
   '두 사람의 사주 계산 결과와 궁합 규칙을 바탕으로 끌리는 지점, 조율 지점, 대화 팁을 작성한다.',
   '{"type":"object","required":["score","keywords","sections","disclaimer"]}', '2026.05.29')
ON CONFLICT (report_type, template_key, version) DO UPDATE SET
  system_prompt = EXCLUDED.system_prompt,
  user_prompt_template = EXCLUDED.user_prompt_template,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

INSERT INTO safety_policies
  (id, policy_type, pattern, replacement_hint, severity, version)
VALUES
  ('no-fatalism', 'forbidden_claim', '반드시|무조건|평생 안 된다|망한다', '경향, 가능성, 주의할 흐름으로 완화한다.', 3, '2026.05.29'),
  ('no-medical-diagnosis', 'forbidden_topic', '암|사망|불치병|수명|임신 가능|유산', '건강/컨디션 관리는 일반 생활 조언으로 제한한다.', 3, '2026.05.29'),
  ('no-investment-advice', 'forbidden_topic', '매수|매도|대출받아|몰빵|종목 추천', '금전운은 소비/저축/수익 구조 성향으로 표현한다.', 3, '2026.05.29'),
  ('no-relationship-control', 'forbidden_claim', '헤어져야 한다|결혼하면 불행|상대를 조종', '관계 조언은 대화와 경계 설정 중심으로 표현한다.', 3, '2026.05.29')
ON CONFLICT (id) DO UPDATE SET
  policy_type = EXCLUDED.policy_type,
  pattern = EXCLUDED.pattern,
  replacement_hint = EXCLUDED.replacement_hint,
  severity = EXCLUDED.severity,
  version = EXCLUDED.version,
  updated_at = now();

COMMIT;

