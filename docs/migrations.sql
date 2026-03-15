-- =====================================================
-- MIGRACIONES PENDIENTES - Ancestro PostgreSQL (RDS)
-- Ejecutar en orden sobre la DB existente
-- Conexión: psql -h ancestro-back2.cyr0gak22eby.us-east-1.rds.amazonaws.com -U ancestro -d postgres
-- =====================================================


-- ═══════════════════════════════════════════════════════
-- MIGRACIÓN 1: KYC + AML en investor_profiles
-- Para: Lambda webhook de MetaMap + endpoint /api/kyc/status
-- ═══════════════════════════════════════════════════════

BEGIN;

-- Columnas KYC (MetaMap)
ALTER TABLE investor_profiles
  ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS kyc_verification_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS kyc_completed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS kyc_metadata JSONB;

-- Columnas AML (cuestionario)
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

-- Tabla audit trail para webhooks
CREATE TABLE IF NOT EXISTS kyc_events (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  verification_id VARCHAR(255),
  status VARCHAR(20),
  raw_payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_kyc_events_user_id ON kyc_events(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_events_verification_id ON kyc_events(verification_id);
CREATE INDEX IF NOT EXISTS idx_kyc_events_created_at ON kyc_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_kyc_status ON investor_profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_aml_flagged ON investor_profiles(aml_status)
  WHERE aml_status = 'flagged';

-- Sincronizar datos existentes
UPDATE investor_profiles SET kyc_status = 'verified' WHERE kyc_verified = true;
UPDATE investor_profiles SET kyc_status = 'not_started' WHERE kyc_verified = false OR kyc_verified IS NULL;

COMMIT;


-- ═══════════════════════════════════════════════════════
-- MIGRACIÓN 2: SEC 501(a) + AML en investment_requests
-- Para: Cuestionario de inversionista acreditado
-- ═══════════════════════════════════════════════════════

BEGIN;

-- Información del inversionista
ALTER TABLE investment_requests
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS citizenship VARCHAR(100),
  ADD COLUMN IF NOT EXISTS investor_type VARCHAR(20);

-- Criterios de acreditación SEC 501(a)
ALTER TABLE investment_requests
  ADD COLUMN IF NOT EXISTS accreditation_criteria TEXT[],
  ADD COLUMN IF NOT EXISTS entity_criteria TEXT[];

-- Due diligence AML
ALTER TABLE investment_requests
  ADD COLUMN IF NOT EXISTS source_of_funds VARCHAR(50),
  ADD COLUMN IF NOT EXISTS source_of_funds_other TEXT,
  ADD COLUMN IF NOT EXISTS is_pep BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pep_details TEXT,
  ADD COLUMN IF NOT EXISTS is_us_citizen BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS us_tax_id VARCHAR(50);

-- Declaración y revisión
ALTER TABLE investment_requests
  ADD COLUMN IF NOT EXISTS declaration_accepted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS accreditation_status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
  ADD COLUMN IF NOT EXISTS review_date TIMESTAMP,
  ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Índices
CREATE INDEX IF NOT EXISTS idx_investment_requests_status
  ON investment_requests(accreditation_status);
CREATE INDEX IF NOT EXISTS idx_investment_requests_pep
  ON investment_requests(is_pep) WHERE is_pep = true;

COMMIT;


-- ═══════════════════════════════════════════════════════
-- ROLLBACK (solo si necesitas revertir todo)
-- ═══════════════════════════════════════════════════════

-- BEGIN;
--
-- -- Revertir migración 2
-- ALTER TABLE investment_requests
--   DROP COLUMN IF EXISTS date_of_birth, DROP COLUMN IF EXISTS address,
--   DROP COLUMN IF EXISTS citizenship, DROP COLUMN IF EXISTS investor_type,
--   DROP COLUMN IF EXISTS accreditation_criteria, DROP COLUMN IF EXISTS entity_criteria,
--   DROP COLUMN IF EXISTS source_of_funds, DROP COLUMN IF EXISTS source_of_funds_other,
--   DROP COLUMN IF EXISTS is_pep, DROP COLUMN IF EXISTS pep_details,
--   DROP COLUMN IF EXISTS is_us_citizen, DROP COLUMN IF EXISTS us_tax_id,
--   DROP COLUMN IF EXISTS declaration_accepted, DROP COLUMN IF EXISTS accreditation_status,
--   DROP COLUMN IF EXISTS reviewed_by, DROP COLUMN IF EXISTS review_date,
--   DROP COLUMN IF EXISTS review_notes;
--
-- -- Revertir migración 1
-- DROP TABLE IF EXISTS kyc_events;
-- ALTER TABLE investor_profiles
--   DROP COLUMN IF EXISTS kyc_status, DROP COLUMN IF EXISTS kyc_verification_id,
--   DROP COLUMN IF EXISTS kyc_completed_at, DROP COLUMN IF EXISTS kyc_metadata,
--   DROP COLUMN IF EXISTS aml_status, DROP COLUMN IF EXISTS aml_completed_at,
--   DROP COLUMN IF EXISTS aml_source_of_funds, DROP COLUMN IF EXISTS aml_source_other,
--   DROP COLUMN IF EXISTS aml_net_worth, DROP COLUMN IF EXISTS aml_annual_income,
--   DROP COLUMN IF EXISTS aml_is_pep, DROP COLUMN IF EXISTS aml_pep_details,
--   DROP COLUMN IF EXISTS aml_is_us_citizen, DROP COLUMN IF EXISTS aml_us_tax_id,
--   DROP COLUMN IF EXISTS aml_tax_country, DROP COLUMN IF EXISTS aml_occupation,
--   DROP COLUMN IF EXISTS aml_employer, DROP COLUMN IF EXISTS aml_investment_purpose,
--   DROP COLUMN IF EXISTS aml_declaration_accepted;
--
-- COMMIT;
