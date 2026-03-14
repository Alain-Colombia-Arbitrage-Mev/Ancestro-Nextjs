-- =====================================================
-- MIGRACIÓN: KYC + AML para investor onboarding
-- Ancestro - PostgreSQL (RDS)
-- Fecha: 2026-03-14
-- =====================================================

BEGIN;

-- 1. Extender investor_profiles con columnas KYC
ALTER TABLE investor_profiles
  ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS kyc_verification_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS kyc_completed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS kyc_metadata JSONB;

-- 2. Extender investor_profiles con columnas AML
ALTER TABLE investor_profiles
  ADD COLUMN IF NOT EXISTS aml_status VARCHAR(20) DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS aml_completed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS aml_source_of_funds VARCHAR(50),
  ADD COLUMN IF NOT EXISTS aml_source_other TEXT,
  ADD COLUMN IF NOT EXISTS aml_net_worth VARCHAR(20),
  ADD COLUMN IF NOT EXISTS aml_annual_income VARCHAR(20),
  ADD COLUMN IF NOT EXISTS aml_is_pep BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS aml_pep_details TEXT,
  ADD COLUMN IF NOT EXISTS aml_is_us_citizen BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS aml_us_tax_id VARCHAR(50),
  ADD COLUMN IF NOT EXISTS aml_tax_country VARCHAR(100),
  ADD COLUMN IF NOT EXISTS aml_occupation VARCHAR(255),
  ADD COLUMN IF NOT EXISTS aml_employer VARCHAR(255),
  ADD COLUMN IF NOT EXISTS aml_investment_purpose VARCHAR(50),
  ADD COLUMN IF NOT EXISTS aml_declaration_accepted BOOLEAN DEFAULT FALSE;

-- 3. Tabla de audit trail para eventos KYC/webhook
CREATE TABLE IF NOT EXISTS kyc_events (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  verification_id VARCHAR(255),
  status VARCHAR(20),
  raw_payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Índices
CREATE INDEX IF NOT EXISTS idx_kyc_events_user_id ON kyc_events(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_events_verification_id ON kyc_events(verification_id);
CREATE INDEX IF NOT EXISTS idx_kyc_events_created_at ON kyc_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_kyc_status ON investor_profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_aml_flagged ON investor_profiles(aml_status)
  WHERE aml_status = 'flagged';

-- 5. Sincronizar datos existentes
UPDATE investor_profiles SET kyc_status = 'verified' WHERE kyc_verified = true;
UPDATE investor_profiles SET kyc_status = 'not_started' WHERE kyc_verified = false OR kyc_verified IS NULL;

COMMIT;

-- =====================================================
-- ROLLBACK (ejecutar solo si necesitas revertir)
-- =====================================================
-- BEGIN;
-- DROP TABLE IF EXISTS kyc_events;
-- ALTER TABLE investor_profiles
--   DROP COLUMN IF EXISTS kyc_status,
--   DROP COLUMN IF EXISTS kyc_verification_id,
--   DROP COLUMN IF EXISTS kyc_completed_at,
--   DROP COLUMN IF EXISTS kyc_metadata,
--   DROP COLUMN IF EXISTS aml_status,
--   DROP COLUMN IF EXISTS aml_completed_at,
--   DROP COLUMN IF EXISTS aml_source_of_funds,
--   DROP COLUMN IF EXISTS aml_source_other,
--   DROP COLUMN IF EXISTS aml_net_worth,
--   DROP COLUMN IF EXISTS aml_annual_income,
--   DROP COLUMN IF EXISTS aml_is_pep,
--   DROP COLUMN IF EXISTS aml_pep_details,
--   DROP COLUMN IF EXISTS aml_is_us_citizen,
--   DROP COLUMN IF EXISTS aml_us_tax_id,
--   DROP COLUMN IF EXISTS aml_tax_country,
--   DROP COLUMN IF EXISTS aml_occupation,
--   DROP COLUMN IF EXISTS aml_employer,
--   DROP COLUMN IF EXISTS aml_investment_purpose,
--   DROP COLUMN IF EXISTS aml_declaration_accepted;
-- COMMIT;
