-- Add case study fields to the projects table
-- Run this in the Supabase SQL editor

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS challenge  TEXT,
  ADD COLUMN IF NOT EXISTS approach   TEXT,
  ADD COLUMN IF NOT EXISTS outcome    TEXT,
  ADD COLUMN IF NOT EXISTS metrics    JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS duration   TEXT,
  ADD COLUMN IF NOT EXISTS role       TEXT;

-- metrics column shape: [{ "label": "Conversion Rate", "value": "+34%" }, ...]
-- Example seed for testing:
-- UPDATE projects SET
--   challenge  = 'The client needed a complete redesign of their e-commerce experience. Their existing Shopify theme was slow, visually outdated, and converting at below-industry averages.',
--   approach   = 'We audited the full funnel, rebuilt the theme from scratch using a custom Shopify 2.0 setup, and introduced a streamlined checkout flow with trust signals at every step.',
--   outcome    = 'Faster. Cleaner. Converting.',
--   metrics    = '[{"label":"Conversion Rate","value":"+28%"},{"label":"Page Speed","value":"92/100"},{"label":"Bounce Rate","value":"-22%"}]',
--   duration   = '6 weeks',
--   role       = 'Shopify Development'
-- WHERE id = '<your-project-id>';
