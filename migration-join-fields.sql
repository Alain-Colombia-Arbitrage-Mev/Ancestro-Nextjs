-- ═══════════════════════════════════════════════════════════
-- Migration: add structured columns to investment_requests + contacts
-- Source: /join form captures country, city, company, experience
-- Before this migration they went only into the `notes` blob.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE investment_requests
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS experience text;

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS experience text,
  ADD COLUMN IF NOT EXISTS investment_range text,
  ADD COLUMN IF NOT EXISTS profile_type text;

-- Verification queries (run manually to confirm)
-- SELECT column_name FROM information_schema.columns WHERE table_name='investment_requests' AND column_name IN ('country','city','company','experience');
-- SELECT column_name FROM information_schema.columns WHERE table_name='contacts' AND column_name IN ('country','city','company','experience','investment_range','profile_type');
