-- =====================================================
-- MIGRACIÓN: Campos SEC 501(a) + AML en investment_requests
-- Ancestro - PostgreSQL (RDS)
-- =====================================================

BEGIN;

-- Investor Info (Sección 1)
ALTER TABLE investment_requests
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS citizenship VARCHAR(100),
  ADD COLUMN IF NOT EXISTS investor_type VARCHAR(20);

-- Accreditation Criteria (Sección 2)
ALTER TABLE investment_requests
  ADD COLUMN IF NOT EXISTS accreditation_criteria TEXT[],
  ADD COLUMN IF NOT EXISTS entity_criteria TEXT[];

-- AML Due Diligence (Sección 3)
ALTER TABLE investment_requests
  ADD COLUMN IF NOT EXISTS source_of_funds VARCHAR(50),
  ADD COLUMN IF NOT EXISTS source_of_funds_other TEXT,
  ADD COLUMN IF NOT EXISTS is_pep BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pep_details TEXT,
  ADD COLUMN IF NOT EXISTS is_us_citizen BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS us_tax_id VARCHAR(50);

-- Declaration + Review (Sección 4)
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
