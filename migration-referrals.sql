-- =====================================================
-- MIGRATION: Referrals + Commission Settings
-- Ancestro - PostgreSQL (RDS)
-- =====================================================
BEGIN;

-- Referral links table
CREATE TABLE IF NOT EXISTS referral_links (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  signups INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_links_code ON referral_links(code);
CREATE INDEX IF NOT EXISTS idx_referral_links_user ON referral_links(user_id);

-- Referral conversions/commissions
CREATE TABLE IF NOT EXISTS referral_commissions (
  id SERIAL PRIMARY KEY,
  referrer_code TEXT NOT NULL REFERENCES referral_links(code),
  referred_email TEXT,
  amount DECIMAL(10,2),
  commission_percent DECIMAL(5,2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_commissions_code ON referral_commissions(referrer_code);

-- Commission settings (admin panel)
CREATE TABLE IF NOT EXISTS commission_settings (
  id SERIAL PRIMARY KEY,
  role VARCHAR(20) UNIQUE NOT NULL,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  updated_by TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Default values
INSERT INTO commission_settings (role, percentage) VALUES ('affiliate', 15.00) ON CONFLICT (role) DO NOTHING;
INSERT INTO commission_settings (role, percentage) VALUES ('customer', 8.00) ON CONFLICT (role) DO NOTHING;
INSERT INTO commission_settings (role, percentage) VALUES ('epc', 70.00) ON CONFLICT (role) DO NOTHING;

COMMIT;
