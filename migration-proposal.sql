-- =====================================================
-- MIGRATION: Proposal Requests table for /proposal page
-- Ancestro - PostgreSQL (RDS)
-- Fecha: 2026-05-07
-- =====================================================

BEGIN;

CREATE TABLE IF NOT EXISTS proposal_requests (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  property_type VARCHAR(20),
  roof_type VARCHAR(50),
  bill_range VARCHAR(20),
  system_selected VARCHAR(20),
  payment_type VARCHAR(20),
  price TEXT,
  lang VARCHAR(5) DEFAULT 'es',
  form_source VARCHAR(50) DEFAULT 'proposal-page',
  follow_up_status VARCHAR(20) DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proposal_requests_email ON proposal_requests(email);
CREATE INDEX IF NOT EXISTS idx_proposal_requests_status ON proposal_requests(follow_up_status);
CREATE INDEX IF NOT EXISTS idx_proposal_requests_created ON proposal_requests(created_at DESC);

COMMIT;
