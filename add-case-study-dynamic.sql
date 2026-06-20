-- add-case-study-dynamic.sql
-- Dynamic case study system: slugs, template assignment, content fields.
-- Safe to run multiple times (IF NOT EXISTS throughout).

-- ── Case study fields from add-case-study-fields.sql (idempotent) ─────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS approach  text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome   text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metrics   jsonb DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration  text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role      text;

-- ── New dynamic columns ────────────────────────────────────────────────────────
-- URL slug: e.g. "brew-and-bloom" → /project/brew-and-bloom
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Template selector: 'web' | 'cro' | NULL (NULL = no case study published)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_study_type text;

-- Client display name in the meta bar (defaults to project title if NULL)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name text;

-- Date range shown in meta bar / hero sidebar
ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline text;

-- Hero-scale outcome statement in the dark results section
ALTER TABLE projects ADD COLUMN IF NOT EXISTS results_headline text;

-- CTA button text in results section
ALTER TABLE projects ADD COLUMN IF NOT EXISTS results_cta text DEFAULT 'Start a Project';

-- Client testimonial
ALTER TABLE projects ADD COLUMN IF NOT EXISTS testimonial_quote  text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS testimonial_author text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS testimonial_role   text;

-- CRO-template-specific fields stored as JSONB:
-- {
--   engagement, window, tests_shipped,
--   section_number, section_title, test_id, test_duration,
--   hypothesis, fix,
--   test_metrics: [{label, value, accent?}],
--   before_image_url, after_image_url
-- }
ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_study_data jsonb DEFAULT '{}'::jsonb;

-- ── Backfill slugs for existing projects ───────────────────────────────────────
UPDATE projects
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;
