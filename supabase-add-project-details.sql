-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add mobile screenshot + tech stack columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS mobile_screenshot_url text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack text[] DEFAULT '{}';

-- 2. Seed default tech stacks based on category
UPDATE projects SET tech_stack = ARRAY['WordPress', 'PHP', 'MySQL', 'JavaScript', 'CSS', 'Elementor']
  WHERE category = 'WordPress' AND (tech_stack IS NULL OR tech_stack = '{}');

UPDATE projects SET tech_stack = ARRAY['Shopify', 'Liquid', 'JavaScript', 'CSS', 'Shopify APIs']
  WHERE category = 'Shopify' AND (tech_stack IS NULL OR tech_stack = '{}');
