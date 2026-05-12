-- =====================================================
-- MIGRATION: Onboarding fields on referral_links
-- Ancestro - PostgreSQL (RDS)
-- =====================================================
BEGIN;

ALTER TABLE referral_links
  ADD COLUMN IF NOT EXISTS channel TEXT,
  ADD COLUMN IF NOT EXISTS zip TEXT,
  ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS user_email TEXT,
  ADD COLUMN IF NOT EXISTS user_name TEXT;

CREATE INDEX IF NOT EXISTS idx_referral_links_onboarded ON referral_links(onboarded_at);

COMMIT;
