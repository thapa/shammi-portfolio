-- ============================================================
-- Shammi Portfolio — Supabase Schema + Seed Data
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. PROJECTS
CREATE TABLE projects (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category      text NOT NULL,
  title         text NOT NULL,
  url           text NOT NULL,
  color         text NOT NULL,
  description   text NOT NULL,
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- 2. SERVICES
CREATE TABLE services (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  num           text NOT NULL,
  title         text NOT NULL,
  description   text NOT NULL,
  tags          text[] DEFAULT '{}',
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- 3. EXPERIENCE
CREATE TABLE experience (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role          text NOT NULL,
  company       text NOT NULL,
  period        text NOT NULL,
  description   text NOT NULL,
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- 4. SKILLS
CREATE TABLE skills (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- 5. PROCESS STEPS
CREATE TABLE process_steps (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  num           text NOT NULL,
  title         text NOT NULL,
  description   text NOT NULL,
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- 6. STATS
CREATE TABLE stats (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  value         text NOT NULL,
  label         text NOT NULL,
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY — allow public read access
-- ============================================================
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience    ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills        ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON projects      FOR SELECT USING (true);
CREATE POLICY "Public read" ON services      FOR SELECT USING (true);
CREATE POLICY "Public read" ON experience    FOR SELECT USING (true);
CREATE POLICY "Public read" ON skills        FOR SELECT USING (true);
CREATE POLICY "Public read" ON process_steps FOR SELECT USING (true);
CREATE POLICY "Public read" ON stats         FOR SELECT USING (true);

-- ============================================================
-- SEED DATA — your current portfolio content
-- ============================================================

INSERT INTO projects (category, title, url, color, description, display_order) VALUES
  ('WordPress', 'SJ Win Injury Law',  'https://sjwinjurylaw.com',   'from-blue-400 to-blue-600',    'Law firm website with custom WordPress theme and advanced UI components.',          1),
  ('WordPress', 'Quandary CG',        'https://quandarycg.com',      'from-indigo-400 to-violet-600','Creative agency site built on WordPress with custom page templates.',               2),
  ('WordPress', 'FloPoWer',           'https://flopower.com',         'from-emerald-400 to-teal-600', 'Corporate website with WooCommerce integration and custom fields.',                3),
  ('Shopify',   'Vixen & Fox',        'https://vixenandfox.com.au',  'from-rose-400 to-pink-600',    'Fashion e-commerce store with custom Shopify 2.0 theme and sections.',            4),
  ('Shopify',   'Heritage Store',     'https://heritagestore.com',   'from-amber-400 to-orange-600', 'Natural beauty brand on Shopify with custom checkout and app integration.',        5),
  ('Shopify',   'Gibson Look',        'https://gibsonlook.com',      'from-purple-400 to-indigo-600','Menswear brand store built on Shopify Plus with custom sections.',                  6);

INSERT INTO services (num, title, description, tags, display_order) VALUES
  ('01', 'WordPress Development',
   'Custom theme development, WooCommerce stores, page builder expertise (Elementor, Divi), Advanced Custom Fields, and full site editing.',
   ARRAY['Custom Theme Dev', 'WooCommerce', 'Elementor / Divi', 'ACF & Custom Fields'], 1),
  ('02', 'Shopify Development',
   'Theme customization, Shopify 2.0 sections everywhere, app integration, Shopify Plus builds, and checkout extensions.',
   ARRAY['Theme Customization', 'Shopify 2.0', 'App Integration', 'Shopify Plus'], 2),
  ('03', 'Web Development',
   'Responsive HTML/CSS builds, Bootstrap & Tailwind, jQuery interactions, Webflow & Wix development, and performance optimization.',
   ARRAY['HTML / CSS / JS', 'Bootstrap & Tailwind', 'Webflow & Wix', 'Responsive Design'], 3);

INSERT INTO experience (role, company, period, description, display_order) VALUES
  ('Freelance Web Developer', 'Self-Employed',        '2018 – Present', '200+ projects delivered for clients worldwide across WordPress, Shopify, Wix, and Webflow.', 1),
  ('Project Manager',         'Superior Web Experts', '2015 – 2018',    'Led web development projects, managed client communications and delivery timelines.',       2),
  ('Web Developer / PM',      'MKTechSoft',           '2012 – 2015',    'Built and maintained WordPress and custom web solutions; handled project management duties.', 3);

INSERT INTO skills (name, display_order) VALUES
  ('WordPress', 1), ('Shopify', 2), ('WooCommerce', 3), ('Elementor', 4),
  ('HTML / CSS', 5), ('Bootstrap', 6), ('jQuery', 7), ('Webflow', 8), ('Wix', 9);

INSERT INTO process_steps (num, title, description, display_order) VALUES
  ('01', 'Discovery',    'Understanding your goals, target audience, and project requirements.',         1),
  ('02', 'Planning',     'Wireframes, content strategy, and technical architecture decisions.',          2),
  ('03', 'Development',  'Clean, efficient code built to spec, on time and on budget.',                  3),
  ('04', 'Testing',      'Cross-browser, performance, and user experience quality checks.',              4),
  ('05', 'Launch',       'Smooth deployment, full handover, and ongoing support.',                       5);

INSERT INTO stats (value, label, display_order) VALUES
  ('200+', 'Projects Delivered', 1),
  ('10+',  'Years Experience',   2),
  ('3',    'Companies',          3);
