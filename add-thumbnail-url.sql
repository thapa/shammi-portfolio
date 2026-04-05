-- Add thumbnail_url column to projects table
-- This stores a custom uploaded thumbnail image for the project card grid.
-- screenshot_url and mobile_screenshot_url remain for the auto-generated modal screenshots.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail_url text;
