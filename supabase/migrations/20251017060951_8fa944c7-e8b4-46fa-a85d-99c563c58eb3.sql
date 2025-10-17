-- Add views column to collaboration_posts
ALTER TABLE collaboration_posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;