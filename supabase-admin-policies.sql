-- ═══════════════════════════════════════════════════════════════════
--  Run this in your Supabase SQL Editor
--  Adds INSERT / UPDATE / DELETE policies so the admin panel can
--  write to all content tables using the anon key.
-- ═══════════════════════════════════════════════════════════════════

-- ── PROJECTS ─────────────────────────────────────────────────────────────────
-- Drop the old narrow screenshot-only update policy first
DROP POLICY IF EXISTS "Allow screenshot update" ON projects;

CREATE POLICY "anon_insert_projects"
  ON projects FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_projects"
  ON projects FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_projects"
  ON projects FOR DELETE TO anon USING (true);

-- ── SERVICES ─────────────────────────────────────────────────────────────────
CREATE POLICY "anon_insert_services"
  ON services FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_services"
  ON services FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_services"
  ON services FOR DELETE TO anon USING (true);

-- ── SKILLS ───────────────────────────────────────────────────────────────────
CREATE POLICY "anon_insert_skills"
  ON skills FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_skills"
  ON skills FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_skills"
  ON skills FOR DELETE TO anon USING (true);

-- ── EXPERIENCE ───────────────────────────────────────────────────────────────
CREATE POLICY "anon_insert_experience"
  ON experience FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_experience"
  ON experience FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_experience"
  ON experience FOR DELETE TO anon USING (true);

-- ── STATS ────────────────────────────────────────────────────────────────────
CREATE POLICY "anon_insert_stats"
  ON stats FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_stats"
  ON stats FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_stats"
  ON stats FOR DELETE TO anon USING (true);

-- ── PROCESS STEPS ────────────────────────────────────────────────────────────
CREATE POLICY "anon_insert_process_steps"
  ON process_steps FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_process_steps"
  ON process_steps FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_process_steps"
  ON process_steps FOR DELETE TO anon USING (true);
