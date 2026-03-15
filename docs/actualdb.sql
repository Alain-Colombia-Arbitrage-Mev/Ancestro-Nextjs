-- =====================================================
-- ANCESTRO FULL DATABASE SCHEMA
-- PostgreSQL + PostGIS + Fintech Ledger Ready
-- =====================================================

-- =====================
-- EXTENSIONS
-- =====================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- =====================
-- USERS
-- =====================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cognito_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50), -- investor, client, partner, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- PAYMENT ACCOUNTS (BALANCES)
-- =====================

CREATE TABLE payment_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    available_balance NUMERIC(18,2) DEFAULT 0 CHECK (available_balance >= 0),
    locked_balance NUMERIC(18,2) DEFAULT 0 CHECK (locked_balance >= 0),
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- LEDGER (ACCOUNTING CORE)
-- =====================

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reference_id UUID,
    reference_type VARCHAR(50),
    type VARCHAR(50) CHECK (type IN ('credit','debit','investment','roi')),
    amount NUMERIC(18,2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(18,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- PAYMENTS
-- =====================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50),
    entity_id UUID,
    amount NUMERIC(18,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(10) DEFAULT 'USD',
    provider VARCHAR(50), -- stripe / crypto
    provider_reference VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- CRYPTO WALLETS
-- =====================

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_address VARCHAR(255),
    network VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- PROPERTIES (POSTGIS)
-- =====================

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id),
    property_type VARCHAR(50), -- roof, land, parking
    location GEOGRAPHY(Point, 4326),
    address TEXT,
    area_m2 NUMERIC,
    expected_price NUMERIC(18,2),
    is_partnership BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    partner_type VARCHAR(50), -- installer / distributor / agent
    location GEOGRAPHY(Point,4326),
    referral_code VARCHAR(100),
    subscription_active BOOLEAN DEFAULT FALSE
);


CREATE TABLE company_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID REFERENCES users(id),
    shares NUMERIC(18,2),
    purchase_price NUMERIC(18,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- ENERGY PROJECTS
-- =====================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    name VARCHAR(255),
    project_type VARCHAR(50), -- solar / ev
    capacity_kwh NUMERIC,
    total_cost NUMERIC(18,2),
    funded_amount NUMERIC(18,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'funding',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- INVESTMENTS
-- =====================

CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id),
    amount NUMERIC(18,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- ROI DISTRIBUTIONS
-- =====================

CREATE TABLE roi_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES users(id),
    amount NUMERIC(18,2),
    distributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- LEASING CONTRACTS
-- =====================

CREATE TABLE leasing_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    kwh_required NUMERIC,
    monthly_payment NUMERIC(18,2),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- HOTELS (BOOKING)
-- =====================

CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id),
    name VARCHAR(255),
    city VARCHAR(255),
    location GEOGRAPHY(Point, 4326),
    rooms INT,
    bathrooms INT,
    beds INT,
    max_capacity INT,
    price_per_night NUMERIC(18,2),
    price_per_week NUMERIC(18,2),
    price_per_month NUMERIC(18,2),
    amenities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- HOTEL BOOKINGS
-- =====================

CREATE TABLE hotel_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    payment_id UUID REFERENCES payments(id),
    check_in DATE,
    check_out DATE,
    total_amount NUMERIC(18,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- EXPERIENCES
-- =====================

CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id),
    title VARCHAR(255),
    city VARCHAR(255),
    location GEOGRAPHY(Point, 4326),
    max_capacity INT,
    price_per_night NUMERIC(18,2),
    amenities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- MARKETPLACE PRODUCTS
-- =====================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES users(id),
    name VARCHAR(255),
    category VARCHAR(100),
    sku VARCHAR(100),
    manufacturer VARCHAR(255),
    price NUMERIC(18,2),
    stock INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- ORDERS
-- =====================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES users(id),
    payment_id UUID REFERENCES payments(id),
    total_amount NUMERIC(18,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- ORDER ITEMS
-- =====================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT,
    price NUMERIC(18,2)
);

-- =====================
-- SUBSCRIPTIONS (STRIPE SAAS)
-- =====================

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    stripe_subscription_id VARCHAR(255),
    plan VARCHAR(50), -- installer / vip
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE investor_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    investor_type VARCHAR(50),
    kyc_verified BOOLEAN DEFAULT FALSE,
    w8ben_signed BOOLEAN DEFAULT FALSE,
    shareholder BOOLEAN DEFAULT FALSE,
    shares_owned NUMERIC(18,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50),
    entity_id UUID,
    s3_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE waitlist (
    id SERIAL PRIMARY KEY,
    waitlist_entry TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    country_of_residence TEXT,
    accepted_terms BOOLEAN,
    form_source TEXT,
    waitlist_status TEXT,
    assigned_department TEXT,
    date_submitted TIMESTAMP,
    notes TEXT
);



CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    contact_name TEXT,
    contact_reason TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    form_source TEXT,
    follow_up_status TEXT,
    assigned_department TEXT,
    last_communication_date TIMESTAMP,
    next_follow_up_date TIMESTAMP,
    notes TEXT
);



CREATE TABLE investment_requests (
    id SERIAL PRIMARY KEY,
    investment_request TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    investment_range_usd TEXT,
    message TEXT,
    form_source TEXT,
    follow_up_status TEXT,
    assigned_to TEXT,
    submission_date TIMESTAMP,
    department_notified TEXT,
    notes TEXT
);



-- =====================
-- INDEXES
-- =====================

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_investments_project ON investments(project_id);
CREATE INDEX idx_ledger_user ON ledger_entries(user_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_properties_location ON properties USING GIST(location);
CREATE INDEX idx_hotels_location ON hotels USING GIST(location);
CREATE INDEX idx_experiences_location ON experiences USING GIST(location);








-- =====================================================
-- END OF FILE
-- =====================================================