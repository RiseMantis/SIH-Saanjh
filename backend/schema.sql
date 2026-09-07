-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('artisan', 'buyer', 'admin')),
    village VARCHAR(255),
    district VARCHAR(255),
    state VARCHAR(100),
    craft_category VARCHAR(100),
    bio TEXT,
    trust_score INTEGER NOT NULL DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
    is_kyc_verified BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url TEXT,
    group_name VARCHAR(255),
    monthly_capacity INTEGER,
    bulk_capable BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT users_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Clusters
CREATE TABLE IF NOT EXISTS clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    craft_category VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cluster_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(cluster_id, user_id)
);

-- Helper function for generated column (PostgreSQL's built-in array_to_string is STABLE, not IMMUTABLE)
CREATE OR REPLACE FUNCTION immutable_array_to_string(arr text[], sep text)
RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
    SELECT array_to_string(arr, sep);
$$;

-- Listings
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_uuid UUID UNIQUE,  -- for idempotent upsert from offline-first clients
    artisan_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500),
    description_en TEXT,
    description_hi TEXT,
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    price_min NUMERIC(12,2),
    price_max NUMERIC(12,2),
    price NUMERIC(12,2),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english'::regconfig,
            coalesce(title, '') || ' ' ||
            coalesce(description_en, '') || ' ' ||
            coalesce(immutable_array_to_string(tags, ' '), '')
        )
    ) STORED
);

CREATE INDEX IF NOT EXISTS idx_listings_search ON listings USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings (category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_artisan ON listings (artisan_id);

-- Listing media
CREATE TABLE IF NOT EXISTS listing_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('raw_photo', 'enhanced_photo', 'voice')),
    url TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI audit log (REQUIRED for every AI-producing endpoint)
CREATE TABLE IF NOT EXISTS ai_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    order_id UUID,  -- FK added after orders table
    action_type VARCHAR(50) NOT NULL,
    input_summary TEXT,
    output_summary TEXT,
    reason_code VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Requirements (B2B bulk needs)
CREATE TABLE IF NOT EXISTS requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    max_unit_price NUMERIC(12,2),
    preferred_state VARCHAR(100),
    delivery_deadline DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'fulfilled', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Requirement matches
CREATE TABLE IF NOT EXISTS requirement_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    artisan_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    breakdown JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id),
    artisan_id UUID NOT NULL REFERENCES users(id),
    listing_id UUID REFERENCES listings(id),
    requirement_id UUID REFERENCES requirements(id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    total_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'shipped', 'delivered', 'completed', 'disputed')),
    placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK for ai_audit_log.order_id now that orders table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_audit_order'
        AND table_name = 'ai_audit_log'
    ) THEN
        ALTER TABLE ai_audit_log ADD CONSTRAINT fk_audit_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders (buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_artisan ON orders (artisan_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
