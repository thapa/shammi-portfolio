-- ═══════════════════════════════════════════════════════════════════
--  Run this in your Supabase SQL Editor
--  Adds the "leads" table to capture chat widget visitors
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text,
  email      text        NOT NULL,
  phone      text,
  source     text        DEFAULT 'chat_widget',
  notes      text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (chat widget submits without auth)
CREATE POLICY "Allow anon insert on leads"
  ON leads FOR INSERT TO anon
  WITH CHECK (true);

-- Allow reading leads (for your own admin use — restrict if needed)
CREATE POLICY "Allow anon select on leads"
  ON leads FOR SELECT TO anon
  USING (true);
