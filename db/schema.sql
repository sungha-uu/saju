-- Saju fortune service database schema
-- Target: PostgreSQL / Supabase
-- Purpose: Store every core dataset needed for saju, compatibility, daily fortune, and naming.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. Source and version management
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS data_sources (
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

CREATE TABLE IF NOT EXISTS data_versions (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  version TEXT NOT NULL,
  source_ids JSONB NOT NULL DEFAULT '[]',
  checksum TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (domain, version)
);

-- ---------------------------------------------------------------------------
-- 2. Calendar, lunar calendar, solar terms
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS calendar_days (
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
  source_id TEXT REFERENCES data_sources(id),
  source_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS solar_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  name TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  term_order INTEGER NOT NULL,
  source_id TEXT REFERENCES data_sources(id),
  source_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (year, name)
);

CREATE INDEX IF NOT EXISTS idx_solar_terms_year_order
  ON solar_terms (year, term_order);

-- ---------------------------------------------------------------------------
-- 3. Core myeongri data
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS five_elements (
  id TEXT PRIMARY KEY,
  label_ko TEXT NOT NULL,
  label_hanja TEXT,
  direction TEXT,
  season TEXT,
  color TEXT,
  organ_metaphor TEXT,
  personality_keywords JSONB NOT NULL DEFAULT '[]',
  description TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS heavenly_stems (
  id TEXT PRIMARY KEY,
  label_ko TEXT NOT NULL,
  label_hanja TEXT,
  element_id TEXT NOT NULL REFERENCES five_elements(id),
  yin_yang TEXT NOT NULL CHECK (yin_yang IN ('yin', 'yang')),
  sort_order INTEGER NOT NULL,
  description_seed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS earthly_branches (
  id TEXT PRIMARY KEY,
  label_ko TEXT NOT NULL,
  label_hanja TEXT,
  animal TEXT,
  element_id TEXT NOT NULL REFERENCES five_elements(id),
  yin_yang TEXT NOT NULL CHECK (yin_yang IN ('yin', 'yang')),
  month_order INTEGER,
  time_start TIME,
  time_end TIME,
  season TEXT,
  sort_order INTEGER NOT NULL,
  description_seed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS branch_hidden_stems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id TEXT NOT NULL REFERENCES earthly_branches(id),
  stem_id TEXT NOT NULL REFERENCES heavenly_stems(id),
  role TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL,
  UNIQUE (branch_id, stem_id, role)
);

CREATE TABLE IF NOT EXISTS sixty_gapja (
  id INTEGER PRIMARY KEY,
  stem_id TEXT NOT NULL REFERENCES heavenly_stems(id),
  branch_id TEXT NOT NULL REFERENCES earthly_branches(id),
  label_ko TEXT NOT NULL,
  element_hint TEXT,
  description_seed TEXT,
  UNIQUE (stem_id, branch_id)
);

CREATE TABLE IF NOT EXISTS element_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_element_id TEXT NOT NULL REFERENCES five_elements(id),
  target_element_id TEXT NOT NULL REFERENCES five_elements(id),
  relation_type TEXT NOT NULL,
  description_seed TEXT,
  UNIQUE (source_element_id, target_element_id, relation_type)
);

CREATE TABLE IF NOT EXISTS stem_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_stem_id TEXT NOT NULL REFERENCES heavenly_stems(id),
  target_stem_id TEXT NOT NULL REFERENCES heavenly_stems(id),
  relation_type TEXT NOT NULL,
  transformed_element_id TEXT REFERENCES five_elements(id),
  interpretation_seed TEXT,
  UNIQUE (source_stem_id, target_stem_id, relation_type)
);

CREATE TABLE IF NOT EXISTS branch_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_branch_id TEXT NOT NULL REFERENCES earthly_branches(id),
  target_branch_id TEXT NOT NULL REFERENCES earthly_branches(id),
  relation_type TEXT NOT NULL,
  group_key TEXT,
  transformed_element_id TEXT REFERENCES five_elements(id),
  interpretation_seed TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_branch_relations_unique
  ON branch_relations (source_branch_id, target_branch_id, relation_type, COALESCE(group_key, ''));

-- ---------------------------------------------------------------------------
-- 4. Ten gods, twelve stages, special stars
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ten_gods (
  id TEXT PRIMARY KEY,
  label_ko TEXT NOT NULL,
  label_hanja TEXT,
  group_name TEXT NOT NULL,
  element_relation TEXT NOT NULL,
  yin_yang_relation TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]',
  strengths JSONB NOT NULL DEFAULT '[]',
  cautions JSONB NOT NULL DEFAULT '[]',
  career_hints JSONB NOT NULL DEFAULT '[]',
  wealth_hints JSONB NOT NULL DEFAULT '[]',
  relationship_hints JSONB NOT NULL DEFAULT '[]',
  description_seed TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ten_god_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_stem_id TEXT NOT NULL REFERENCES heavenly_stems(id),
  target_stem_id TEXT NOT NULL REFERENCES heavenly_stems(id),
  ten_god_id TEXT NOT NULL REFERENCES ten_gods(id),
  UNIQUE (day_stem_id, target_stem_id)
);

CREATE TABLE IF NOT EXISTS twelve_life_stages (
  id TEXT PRIMARY KEY,
  label_ko TEXT NOT NULL,
  label_hanja TEXT,
  keywords JSONB NOT NULL DEFAULT '[]',
  interpretation_seed TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS life_stage_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_stem_id TEXT NOT NULL REFERENCES heavenly_stems(id),
  branch_id TEXT NOT NULL REFERENCES earthly_branches(id),
  life_stage_id TEXT NOT NULL REFERENCES twelve_life_stages(id),
  UNIQUE (day_stem_id, branch_id)
);

CREATE TABLE IF NOT EXISTS special_stars (
  id TEXT PRIMARY KEY,
  label_ko TEXT NOT NULL,
  label_hanja TEXT,
  category TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]',
  interpretation_seed TEXT,
  caution_seed TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS special_star_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  special_star_id TEXT NOT NULL REFERENCES special_stars(id),
  base_type TEXT NOT NULL,
  base_key TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_key TEXT NOT NULL,
  notes TEXT,
  UNIQUE (special_star_id, base_type, base_key, target_type, target_key)
);

-- ---------------------------------------------------------------------------
-- 5. Saju calculation outputs
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS saju_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID,
  calendar_type TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_time_unknown BOOLEAN NOT NULL DEFAULT false,
  timezone TEXT NOT NULL DEFAULT 'Asia/Seoul',
  year_stem_id TEXT REFERENCES heavenly_stems(id),
  year_branch_id TEXT REFERENCES earthly_branches(id),
  month_stem_id TEXT REFERENCES heavenly_stems(id),
  month_branch_id TEXT REFERENCES earthly_branches(id),
  day_stem_id TEXT REFERENCES heavenly_stems(id),
  day_branch_id TEXT REFERENCES earthly_branches(id),
  hour_stem_id TEXT REFERENCES heavenly_stems(id),
  hour_branch_id TEXT REFERENCES earthly_branches(id),
  element_scores JSONB NOT NULL DEFAULT '{}',
  ten_god_scores JSONB NOT NULL DEFAULT '{}',
  special_stars JSONB NOT NULL DEFAULT '[]',
  calculation_version TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saju_charts_birth_date
  ON saju_charts (birth_date);

-- ---------------------------------------------------------------------------
-- 6. Daewoon, yearly luck, monthly luck
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS daewoon_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_id UUID REFERENCES saju_charts(id) ON DELETE CASCADE,
  start_age INTEGER NOT NULL,
  end_age INTEGER NOT NULL,
  start_year INTEGER,
  end_year INTEGER,
  stem_id TEXT REFERENCES heavenly_stems(id),
  branch_id TEXT REFERENCES earthly_branches(id),
  ten_god_id TEXT REFERENCES ten_gods(id),
  life_stage_id TEXT REFERENCES twelve_life_stages(id),
  element_effects JSONB NOT NULL DEFAULT '{}',
  themes JSONB NOT NULL DEFAULT '[]',
  caution_themes JSONB NOT NULL DEFAULT '[]',
  interpretation_seed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS yearly_luck_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_id UUID REFERENCES saju_charts(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  age INTEGER,
  stem_id TEXT REFERENCES heavenly_stems(id),
  branch_id TEXT REFERENCES earthly_branches(id),
  ten_god_id TEXT REFERENCES ten_gods(id),
  life_stage_id TEXT REFERENCES twelve_life_stages(id),
  relation_events JSONB NOT NULL DEFAULT '[]',
  themes JSONB NOT NULL DEFAULT '[]',
  caution_themes JSONB NOT NULL DEFAULT '[]',
  interpretation_seed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (chart_id, year)
);

CREATE TABLE IF NOT EXISTS monthly_luck_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  yearly_luck_id UUID REFERENCES yearly_luck_cycles(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  stem_id TEXT REFERENCES heavenly_stems(id),
  branch_id TEXT REFERENCES earthly_branches(id),
  themes JSONB NOT NULL DEFAULT '[]',
  caution_themes JSONB NOT NULL DEFAULT '[]',
  interpretation_seed TEXT,
  UNIQUE (yearly_luck_id, month)
);

CREATE TABLE IF NOT EXISTS samjae_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zodiac_branch_id TEXT NOT NULL REFERENCES earthly_branches(id),
  samjae_order INTEGER NOT NULL CHECK (samjae_order IN (1, 2, 3)),
  target_branch_id TEXT NOT NULL REFERENCES earthly_branches(id),
  label_ko TEXT NOT NULL,
  interpretation_seed TEXT,
  caution_seed TEXT,
  UNIQUE (zodiac_branch_id, samjae_order)
);

-- ---------------------------------------------------------------------------
-- 7. Interpretation rules for long-form readings
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS interpretation_rules (
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

CREATE TABLE IF NOT EXISTS advanced_saju_rules (
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

CREATE TABLE IF NOT EXISTS season_metaphor_rules (
  id TEXT PRIMARY KEY,
  day_stem_id TEXT REFERENCES heavenly_stems(id),
  month_branch_id TEXT REFERENCES earthly_branches(id),
  dominant_element_id TEXT REFERENCES five_elements(id),
  weak_element_id TEXT REFERENCES five_elements(id),
  metaphor TEXT NOT NULL,
  explanation JSONB NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS luck_domain_rules (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  condition JSONB NOT NULL DEFAULT '{}',
  title TEXT NOT NULL,
  body_templates JSONB NOT NULL DEFAULT '[]',
  timing_logic JSONB NOT NULL DEFAULT '{}',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reading_section_templates (
  id TEXT PRIMARY KEY,
  report_type TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  prompt_hints JSONB NOT NULL DEFAULT '[]',
  required_data JSONB NOT NULL DEFAULT '[]',
  safety_rules JSONB NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  UNIQUE (report_type, section_key, version)
);

-- ---------------------------------------------------------------------------
-- 8. Compatibility data
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS compatibility_rules (
  id TEXT PRIMARY KEY,
  relation_type TEXT,
  condition JSONB NOT NULL DEFAULT '{}',
  score_delta INTEGER NOT NULL DEFAULT 0,
  keywords JSONB NOT NULL DEFAULT '[]',
  attraction_hints JSONB NOT NULL DEFAULT '[]',
  caution_hints JSONB NOT NULL DEFAULT '[]',
  conversation_tips JSONB NOT NULL DEFAULT '[]',
  timing_hints JSONB NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compatibility_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  person_a_chart_id UUID REFERENCES saju_charts(id),
  person_b_chart_id UUID REFERENCES saju_charts(id),
  relation_type TEXT,
  score INTEGER,
  calculated_data JSONB NOT NULL DEFAULT '{}',
  ai_result JSONB NOT NULL DEFAULT '{}',
  data_versions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 9. Daily fortune data
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS daily_fortune_seeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  day_stem_id TEXT REFERENCES heavenly_stems(id),
  day_branch_id TEXT REFERENCES earthly_branches(id),
  solar_term_id UUID REFERENCES solar_terms(id),
  global_keywords JSONB NOT NULL DEFAULT '[]',
  lucky_colors JSONB NOT NULL DEFAULT '[]',
  lucky_numbers JSONB NOT NULL DEFAULT '[]',
  caution_patterns JSONB NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  UNIQUE (date, version)
);

CREATE TABLE IF NOT EXISTS daily_fortune_rules (
  id TEXT PRIMARY KEY,
  condition JSONB NOT NULL DEFAULT '{}',
  focus_area TEXT NOT NULL,
  body_templates JSONB NOT NULL DEFAULT '[]',
  lucky_hints JSONB NOT NULL DEFAULT '{}',
  caution_hints JSONB NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

-- ---------------------------------------------------------------------------
-- 10. Naming data
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS korean_surnames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hangul TEXT NOT NULL,
  hanja TEXT,
  commonness_rank INTEGER,
  sound_tags JSONB NOT NULL DEFAULT '[]',
  notes TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_korean_surnames_unique
  ON korean_surnames (hangul, COALESCE(hanja, ''));

CREATE TABLE IF NOT EXISTS hangul_name_syllables (
  syllable TEXT PRIMARY KEY,
  gender_tone TEXT NOT NULL DEFAULT 'neutral',
  mood_tags JSONB NOT NULL DEFAULT '[]',
  element_hint TEXT REFERENCES five_elements(id),
  sound_tags JSONB NOT NULL DEFAULT '[]',
  avoid_reason TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hanja_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  char TEXT NOT NULL UNIQUE,
  korean_readings JSONB NOT NULL DEFAULT '[]',
  meaning_ko TEXT,
  meaning_en TEXT,
  total_strokes INTEGER,
  radical TEXT,
  element_hint TEXT REFERENCES five_elements(id),
  name_usable BOOLEAN NOT NULL DEFAULT false,
  source_id TEXT REFERENCES data_sources(id),
  source_version TEXT,
  tags JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS naming_rules (
  id TEXT PRIMARY KEY,
  purpose TEXT,
  condition JSONB NOT NULL DEFAULT '{}',
  title TEXT NOT NULL,
  recommendation_templates JSONB NOT NULL DEFAULT '[]',
  avoid_patterns JSONB NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS generated_name_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID,
  surname TEXT NOT NULL,
  given_name TEXT NOT NULL,
  hangul_full_name TEXT NOT NULL,
  hanja_full_name TEXT,
  meaning_summary TEXT,
  sound_score INTEGER,
  element_score INTEGER,
  preference_tags JSONB NOT NULL DEFAULT '[]',
  source_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 11. Users, profiles, reports, feedback
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS birth_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS fortune_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES birth_profiles(id) ON DELETE SET NULL,
  chart_id UUID REFERENCES saju_charts(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  input_snapshot JSONB NOT NULL DEFAULT '{}',
  calculated_data JSONB NOT NULL DEFAULT '{}',
  ai_result JSONB NOT NULL DEFAULT '{}',
  data_versions JSONB NOT NULL DEFAULT '{}',
  favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES fortune_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback_type TEXT,
  feedback_text TEXT,
  selected_keywords JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 12. AI prompts and safety
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_prompt_templates (
  id TEXT PRIMARY KEY,
  report_type TEXT NOT NULL,
  template_key TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  output_schema JSONB NOT NULL DEFAULT '{}',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (report_type, template_key, version)
);

CREATE TABLE IF NOT EXISTS safety_policies (
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

CREATE TABLE IF NOT EXISTS safety_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES fortune_reports(id) ON DELETE SET NULL,
  policy_id TEXT REFERENCES safety_policies(id),
  event_type TEXT NOT NULL,
  redacted_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
