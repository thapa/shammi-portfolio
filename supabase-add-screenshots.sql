-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add screenshot_url column to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshot_url text;

-- 2. Allow anon to update screenshot_url (needed so the frontend can save the URL after uploading)
CREATE POLICY "Allow screenshot update" ON projects
  FOR UPDATE USING (true) WITH CHECK (true);

-- 3. Create public storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public)
  VALUES ('project-screenshots', 'project-screenshots', true)
  ON CONFLICT (id) DO NOTHING;

-- 4. Storage policies — allow public read + anon upload/update
CREATE POLICY "Public read screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-screenshots');

CREATE POLICY "Anon upload screenshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-screenshots');

CREATE POLICY "Anon update screenshots" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-screenshots');
