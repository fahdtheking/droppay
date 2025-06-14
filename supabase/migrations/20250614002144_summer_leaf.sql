-- =============================================
-- DROPPAY DATABASE SCHEMA OPTIMIZATION
-- Comprehensive database architecture for global e-commerce platform
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =============================================
-- ENHANCED ENUMS WITH FUTURE-PROOFING
-- =============================================

-- Core user roles with extensibility
CREATE TYPE user_role AS ENUM (
    'admin', 'supplier', 'reseller', 'client', 
    'moderator', 'analyst', 'support'
);

-- Enhanced order statuses
CREATE TYPE order_status AS ENUM (
    'draft', 'pending', 'confirmed', 'processing', 
    'shipped', 'in_transit', 'delivered', 'completed',
    'cancelled', 'refunded', 'disputed', 'returned'
);

-- Payment statuses with crypto support
CREATE TYPE payment_status AS ENUM (
    'pending', 'processing', 'paid', 'failed', 
    'refunded', 'partially_refunded', 'disputed',
    'crypto_pending', 'crypto_confirmed'
);

-- Commission types for complex scenarios
CREATE TYPE commission_type AS ENUM (
    'sale', 'bonus', 'milestone', 'referral', 
    'team_bonus', 'performance_bonus', 'override',
    'ai_generated', 'blockchain_reward'
);

-- AI agent types for comprehensive coverage
CREATE TYPE ai_agent_type AS ENUM (
    'jarvis_home', 'verify_supplier', 'client_assistant',
    'growth_advisor', 'campaign_studio', 'product_discovery',
    'transaction_simulator', 'team_collaboration', 'supplier_success',
    'wallet_assistant', 'admin_control', 'fraud_detection',
    'price_optimizer', 'inventory_manager', 'customer_insights'
);

-- =============================================
-- CORE USER MANAGEMENT (ENHANCED)
-- =============================================

-- Enhanced users table with security features
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    password_hash text,
    name text NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    
    -- Security fields
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    is_locked boolean DEFAULT false,
    failed_login_attempts integer DEFAULT 0,
    last_failed_login timestamptz,
    
    -- Contact information
    phone text,
    avatar_url text,
    
    -- Timestamps
    email_verified_at timestamptz,
    last_login_at timestamptz,
    password_changed_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Soft delete
    deleted_at timestamptz,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$')
);

-- Enhanced user profiles with AI/ML support
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    
    -- Location and preferences
    country text,
    currency text DEFAULT 'USD',
    timezone text,
    language text DEFAULT 'en',
    
    -- Personal information
    date_of_birth date,
    address jsonb,
    preferences jsonb DEFAULT '{}',
    
    -- KYC and verification
    kyc_status text DEFAULT 'pending',
    kyc_documents jsonb DEFAULT '[]',
    verification_level integer DEFAULT 0,
    
    -- AI/ML fields
    behavioral_data jsonb DEFAULT '{}',
    ai_preferences jsonb DEFAULT '{}',
    recommendation_weights jsonb DEFAULT '{}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_verification_level CHECK (verification_level BETWEEN 0 AND 5),
    CONSTRAINT valid_currency CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'SGD'))
);

-- User sessions for security tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    session_token text UNIQUE NOT NULL,
    ip_address inet,
    user_agent text,
    device_fingerprint text,
    is_active boolean DEFAULT true,
    expires_at timestamptz NOT NULL,
    created_at timestamptz DEFAULT now(),
    last_activity timestamptz DEFAULT now()
);

-- =============================================
-- SUPPLIER MANAGEMENT (ENHANCED)
-- =============================================

CREATE TABLE IF NOT EXISTS suppliers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    
    -- Company information
    company_name text NOT NULL,
    legal_name text NOT NULL,
    tax_id text,
    business_type text,
    registration_number text,
    
    -- Store configuration
    store_url text UNIQUE NOT NULL,
    store_name text NOT NULL,
    description text,
    logo_url text,
    banner_url text,
    store_theme text DEFAULT 'modern',
    
    -- Business metrics
    commission_rate decimal(5,2) DEFAULT 15.00,
    minimum_order_amount decimal(10,2) DEFAULT 25.00,
    annual_revenue decimal(15,2),
    employee_count integer,
    
    -- Status and verification
    status text DEFAULT 'pending',
    verification_documents jsonb DEFAULT '[]',
    compliance_score decimal(3,2) DEFAULT 0.00,
    
    -- AI/ML fields
    performance_metrics jsonb DEFAULT '{}',
    ai_insights jsonb DEFAULT '{}',
    
    -- Store settings
    store_settings jsonb DEFAULT '{}',
    payment_methods jsonb DEFAULT '[]',
    shipping_zones jsonb DEFAULT '[]',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    verified_at timestamptz,
    
    -- Constraints
    CONSTRAINT valid_commission_rate CHECK (commission_rate BETWEEN 0 AND 50),
    CONSTRAINT valid_compliance_score CHECK (compliance_score BETWEEN 0 AND 1),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'suspended', 'rejected'))
);

-- =============================================
-- PRODUCT MANAGEMENT (ENHANCED)
-- =============================================

-- Enhanced categories with ML support
CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    parent_id uuid REFERENCES categories(id) ON DELETE CASCADE,
    
    -- Commission and business rules
    commission_rate decimal(5,2),
    tax_rate decimal(5,2) DEFAULT 0.00,
    
    -- Display and organization
    image_url text,
    icon_name text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    
    -- AI/ML fields
    ai_tags jsonb DEFAULT '[]',
    trend_score decimal(3,2) DEFAULT 0.00,
    seasonality_data jsonb DEFAULT '{}',
    
    -- SEO
    seo_title text,
    seo_description text,
    seo_keywords text[],
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enhanced products table with comprehensive features
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
    category_id uuid REFERENCES categories(id),
    
    -- Basic product information
    sku text NOT NULL,
    name text NOT NULL,
    description text,
    short_description text,
    
    -- Pricing and costs
    price decimal(10,2) NOT NULL,
    cost decimal(10,2),
    msrp decimal(10,2),
    commission_rate decimal(5,2),
    
    -- Inventory management
    inventory_quantity integer DEFAULT 0,
    reserved_quantity integer DEFAULT 0,
    low_stock_threshold integer DEFAULT 10,
    reorder_point integer DEFAULT 5,
    
    -- Physical attributes
    weight decimal(8,2),
    dimensions jsonb, -- {length, width, height, unit}
    
    -- Media and content
    images jsonb DEFAULT '[]',
    videos jsonb DEFAULT '[]',
    documents jsonb DEFAULT '[]',
    
    -- Product features
    features jsonb DEFAULT '[]',
    specifications jsonb DEFAULT '{}',
    variants_config jsonb DEFAULT '{}',
    
    -- Categorization and search
    tags text[],
    brand text,
    model text,
    
    -- Status and visibility
    status text DEFAULT 'draft',
    is_featured boolean DEFAULT false,
    is_digital boolean DEFAULT false,
    requires_shipping boolean DEFAULT true,
    
    -- AI/ML fields
    ai_generated_tags jsonb DEFAULT '[]',
    recommendation_score decimal(3,2) DEFAULT 0.00,
    trend_score decimal(3,2) DEFAULT 0.00,
    quality_score decimal(3,2) DEFAULT 0.00,
    
    -- SEO
    seo_title text,
    seo_description text,
    seo_keywords text[],
    
    -- Analytics
    view_count integer DEFAULT 0,
    click_count integer DEFAULT 0,
    conversion_rate decimal(5,4) DEFAULT 0.0000,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    published_at timestamptz,
    discontinued_at timestamptz,
    
    -- Constraints
    CONSTRAINT valid_price CHECK (price >= 0),
    CONSTRAINT valid_inventory CHECK (inventory_quantity >= 0),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'inactive', 'out_of_stock', 'discontinued')),
    CONSTRAINT unique_supplier_sku UNIQUE (supplier_id, sku)
);

-- Product variants for size, color, etc.
CREATE TABLE IF NOT EXISTS product_variants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    
    -- Variant identification
    sku text NOT NULL,
    name text NOT NULL,
    
    -- Pricing
    price_adjustment decimal(10,2) DEFAULT 0,
    cost_adjustment decimal(10,2) DEFAULT 0,
    
    -- Inventory
    inventory_quantity integer DEFAULT 0,
    reserved_quantity integer DEFAULT 0,
    
    -- Variant attributes
    attributes jsonb DEFAULT '{}', -- {color: 'red', size: 'L'}
    images jsonb DEFAULT '[]',
    
    -- Status
    is_active boolean DEFAULT true,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT unique_product_variant_sku UNIQUE (product_id, sku)
);

-- =============================================
-- RESELLER MANAGEMENT (ENHANCED)
-- =============================================

CREATE TABLE IF NOT EXISTS resellers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    
    -- Reseller type and identification
    reseller_type text DEFAULT 'solo',
    referral_code text UNIQUE NOT NULL,
    
    -- Performance metrics
    performance_tier text DEFAULT 'bronze',
    total_sales decimal(12,2) DEFAULT 0,
    total_commission decimal(12,2) DEFAULT 0,
    team_bonus_earned decimal(12,2) DEFAULT 0,
    
    -- Current period metrics
    current_month_sales decimal(12,2) DEFAULT 0,
    current_month_commission decimal(12,2) DEFAULT 0,
    last_sale_date timestamptz,
    
    -- Payout information
    payout_info jsonb DEFAULT '{}',
    payout_schedule text DEFAULT 'weekly',
    minimum_payout decimal(10,2) DEFAULT 50.00,
    
    -- AI/ML fields
    ai_performance_insights jsonb DEFAULT '{}',
    recommended_products jsonb DEFAULT '[]',
    behavioral_patterns jsonb DEFAULT '{}',
    
    -- Status and verification
    status text DEFAULT 'active',
    verification_level integer DEFAULT 0,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    onboarding_completed_at timestamptz,
    
    -- Constraints
    CONSTRAINT valid_reseller_type CHECK (reseller_type IN ('solo', 'team_leader', 'team_member')),
    CONSTRAINT valid_performance_tier CHECK (performance_tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'suspended', 'pending'))
);

-- Enhanced team management
CREATE TABLE IF NOT EXISTS reseller_teams (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    leader_id uuid REFERENCES resellers(id),
    description text,
    invite_code text UNIQUE,
    
    -- Team metrics
    total_sales decimal(12,2) DEFAULT 0,
    total_members integer DEFAULT 0,
    active_members integer DEFAULT 0,
    
    -- Team settings
    commission_sharing_model text DEFAULT 'individual',
    team_goals jsonb DEFAULT '{}',
    
    -- AI/ML fields
    team_performance_insights jsonb DEFAULT '{}',
    collaboration_score decimal(3,2) DEFAULT 0.00,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Team memberships with roles
CREATE TABLE IF NOT EXISTS team_memberships (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid REFERENCES reseller_teams(id) ON DELETE CASCADE,
    reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
    role text DEFAULT 'member',
    
    -- Membership details
    contribution_percentage decimal(5,2) DEFAULT 0.00,
    is_active boolean DEFAULT true,
    
    -- Timestamps
    joined_at timestamptz DEFAULT now(),
    left_at timestamptz,
    
    -- Constraints
    CONSTRAINT unique_team_member UNIQUE (team_id, reseller_id),
    CONSTRAINT valid_role CHECK (role IN ('leader', 'co_leader', 'member', 'trainee'))
);

-- =============================================
-- ORDER MANAGEMENT (ENHANCED)
-- =============================================

CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number text UNIQUE NOT NULL,
    
    -- Order parties
    client_id uuid REFERENCES users(id),
    supplier_id uuid REFERENCES suppliers(id),
    reseller_id uuid REFERENCES resellers(id),
    
    -- Order status and workflow
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    fulfillment_status text DEFAULT 'pending',
    
    -- Financial details
    subtotal decimal(12,2) NOT NULL,
    tax_amount decimal(12,2) DEFAULT 0,
    shipping_amount decimal(12,2) DEFAULT 0,
    discount_amount decimal(12,2) DEFAULT 0,
    commission_amount decimal(12,2) DEFAULT 0,
    total_amount decimal(12,2) NOT NULL,
    currency text DEFAULT 'USD',
    
    -- Payment information
    payment_method text,
    payment_reference text,
    payment_processor text,
    
    -- Addresses
    shipping_address jsonb NOT NULL,
    billing_address jsonb,
    
    -- Shipping and tracking
    shipping_method text,
    tracking_number text,
    carrier text,
    estimated_delivery timestamptz,
    
    -- Order metadata
    notes text,
    internal_notes text,
    source text DEFAULT 'web',
    device_type text,
    
    -- AI/ML fields
    fraud_score decimal(3,2) DEFAULT 0.00,
    risk_level text DEFAULT 'low',
    ai_insights jsonb DEFAULT '{}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    confirmed_at timestamptz,
    shipped_at timestamptz,
    delivered_at timestamptz,
    cancelled_at timestamptz,
    
    -- Constraints
    CONSTRAINT valid_fraud_score CHECK (fraud_score BETWEEN 0 AND 1),
    CONSTRAINT valid_risk_level CHECK (risk_level IN ('low', 'medium', 'high', 'critical'))
);

-- Enhanced order items
CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id),
    variant_id uuid REFERENCES product_variants(id),
    
    -- Product snapshot at time of order
    product_name text NOT NULL,
    product_sku text NOT NULL,
    product_description text,
    
    -- Pricing and quantities
    quantity integer NOT NULL,
    unit_price decimal(10,2) NOT NULL,
    total_price decimal(10,2) NOT NULL,
    
    -- Commission details
    commission_rate decimal(5,2),
    commission_amount decimal(10,2),
    
    -- Product snapshot for historical accuracy
    product_snapshot jsonb DEFAULT '{}',
    
    -- Fulfillment
    fulfillment_status text DEFAULT 'pending',
    shipped_quantity integer DEFAULT 0,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_quantity CHECK (quantity > 0),
    CONSTRAINT valid_unit_price CHECK (unit_price >= 0)
);

-- =============================================
-- COMMISSION & FINANCIAL MANAGEMENT
-- =============================================

CREATE TABLE IF NOT EXISTS commissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
    order_id uuid REFERENCES orders(id),
    order_item_id uuid REFERENCES order_items(id),
    
    -- Commission details
    amount decimal(10,2) NOT NULL,
    rate decimal(5,2) NOT NULL,
    type commission_type DEFAULT 'sale',
    status text DEFAULT 'pending',
    
    -- Additional context
    description text,
    reference_id text,
    
    -- Team sharing
    team_id uuid REFERENCES reseller_teams(id),
    shared_amount decimal(10,2) DEFAULT 0,
    
    -- Processing
    processed_at timestamptz,
    paid_at timestamptz,
    
    -- AI/ML fields
    ai_calculated boolean DEFAULT false,
    calculation_method text DEFAULT 'standard',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_amount CHECK (amount >= 0),
    CONSTRAINT valid_rate CHECK (rate BETWEEN 0 AND 100),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'paid', 'cancelled', 'disputed'))
);

-- Payout management
CREATE TABLE IF NOT EXISTS payouts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
    
    -- Payout details
    amount decimal(10,2) NOT NULL,
    currency text DEFAULT 'USD',
    method text NOT NULL,
    
    -- Processing information
    reference text,
    processor_reference text,
    status text DEFAULT 'pending',
    
    -- Fees
    processing_fee decimal(10,2) DEFAULT 0,
    net_amount decimal(10,2) NOT NULL,
    
    -- Metadata
    commission_ids uuid[],
    notes text,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    processed_at timestamptz,
    completed_at timestamptz,
    
    -- Constraints
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_method CHECK (method IN ('bank_transfer', 'paypal', 'stripe', 'crypto', 'check')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled'))
);

-- =============================================
-- MARKETING & CAMPAIGNS
-- =============================================

CREATE TABLE IF NOT EXISTS campaigns (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
    team_id uuid REFERENCES reseller_teams(id),
    
    -- Campaign details
    name text NOT NULL,
    description text,
    type text DEFAULT 'individual',
    
    -- Budget and performance
    budget decimal(10,2),
    spent_amount decimal(10,2) DEFAULT 0,
    target_audience jsonb DEFAULT '{}',
    
    -- Timing
    start_date date,
    end_date date,
    status text DEFAULT 'draft',
    
    -- AI/ML fields
    ai_optimized boolean DEFAULT false,
    performance_predictions jsonb DEFAULT '{}',
    optimization_suggestions jsonb DEFAULT '[]',
    
    -- Campaign settings
    settings jsonb DEFAULT '{}',
    performance_metrics jsonb DEFAULT '{}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_type CHECK (type IN ('individual', 'team', 'collaborative', 'ai_generated')),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled'))
);

-- Enhanced tracking links
CREATE TABLE IF NOT EXISTS tracking_links (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    campaign_id uuid REFERENCES campaigns(id),
    
    -- Link details
    link_code text UNIQUE NOT NULL,
    full_url text NOT NULL,
    short_url text,
    
    -- Performance metrics
    clicks integer DEFAULT 0,
    unique_clicks integer DEFAULT 0,
    conversions integer DEFAULT 0,
    conversion_value decimal(10,2) DEFAULT 0,
    
    -- Configuration
    is_active boolean DEFAULT true,
    expires_at timestamptz,
    
    -- AI/ML fields
    performance_score decimal(3,2) DEFAULT 0.00,
    ai_insights jsonb DEFAULT '{}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_clicked_at timestamptz
);

-- Link analytics for detailed tracking
CREATE TABLE IF NOT EXISTS link_analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_link_id uuid REFERENCES tracking_links(id) ON DELETE CASCADE,
    
    -- Visitor information
    ip_address inet,
    user_agent text,
    referrer text,
    
    -- Geographic data
    country text,
    region text,
    city text,
    
    -- Device information
    device_type text,
    browser text,
    os text,
    
    -- Conversion tracking
    converted boolean DEFAULT false,
    conversion_value decimal(10,2),
    order_id uuid REFERENCES orders(id),
    
    -- Timestamps
    created_at timestamptz DEFAULT now()
);

-- =============================================
-- AI/ML INFRASTRUCTURE
-- =============================================

CREATE TABLE IF NOT EXISTS ai_agents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    type ai_agent_type NOT NULL,
    description text,
    
    -- Configuration
    configuration jsonb DEFAULT '{}',
    model_version text,
    api_endpoint text,
    
    -- Status and performance
    is_active boolean DEFAULT true,
    performance_metrics jsonb DEFAULT '{}',
    usage_stats jsonb DEFAULT '{}',
    
    -- Capabilities
    supported_languages text[] DEFAULT ARRAY['en'],
    max_requests_per_minute integer DEFAULT 100,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_trained_at timestamptz
);

-- AI interactions log
CREATE TABLE IF NOT EXISTS ai_interactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES ai_agents(id),
    user_id uuid REFERENCES users(id),
    
    -- Interaction details
    session_id text,
    interaction_type text NOT NULL,
    input_data jsonb NOT NULL,
    output_data jsonb,
    
    -- Performance metrics
    response_time_ms integer,
    confidence_score decimal(3,2),
    user_satisfaction integer, -- 1-5 rating
    
    -- Context
    context_data jsonb DEFAULT '{}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_confidence_score CHECK (confidence_score BETWEEN 0 AND 1),
    CONSTRAINT valid_user_satisfaction CHECK (user_satisfaction BETWEEN 1 AND 5)
);

-- =============================================
-- ANALYTICS & REPORTING
-- =============================================

-- Daily metrics snapshots
CREATE TABLE IF NOT EXISTS daily_metrics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date date NOT NULL,
    metric_type text NOT NULL,
    entity_id uuid,
    value decimal(15,2) NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT unique_daily_metric UNIQUE (date, metric_type, entity_id)
);

-- Real-time analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type text NOT NULL,
    user_id uuid REFERENCES users(id),
    session_id text,
    
    -- Event data
    properties jsonb DEFAULT '{}',
    context jsonb DEFAULT '{}',
    
    -- Geographic and device info
    ip_address inet,
    country text,
    device_type text,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    processed_at timestamptz
);

-- =============================================
-- BLOCKCHAIN/WEB3 INTEGRATION
-- =============================================

-- Blockchain transactions
CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id),
    
    -- Blockchain details
    blockchain text NOT NULL, -- 'ethereum', 'polygon', 'bsc'
    transaction_hash text UNIQUE NOT NULL,
    block_number bigint,
    
    -- Transaction details
    transaction_type text NOT NULL, -- 'payment', 'commission', 'reward'
    amount decimal(18,8) NOT NULL,
    token_symbol text NOT NULL,
    token_address text,
    
    -- Status
    status text DEFAULT 'pending',
    confirmations integer DEFAULT 0,
    
    -- Related entities
    order_id uuid REFERENCES orders(id),
    commission_id uuid REFERENCES commissions(id),
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    confirmed_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_blockchain CHECK (blockchain IN ('ethereum', 'polygon', 'bsc', 'solana')),
    CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('payment', 'commission', 'reward', 'refund')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled'))
);

-- NFT/Digital assets
CREATE TABLE IF NOT EXISTS digital_assets (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id uuid REFERENCES users(id),
    
    -- Asset details
    asset_type text NOT NULL, -- 'nft', 'token', 'certificate'
    name text NOT NULL,
    description text,
    
    -- Blockchain information
    blockchain text NOT NULL,
    contract_address text NOT NULL,
    token_id text,
    
    -- Metadata
    metadata_uri text,
    attributes jsonb DEFAULT '{}',
    
    -- Status
    is_active boolean DEFAULT true,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    minted_at timestamptz,
    
    -- Constraints
    CONSTRAINT valid_asset_type CHECK (asset_type IN ('nft', 'token', 'certificate', 'badge'))
);

-- =============================================
-- NOTIFICATIONS & COMMUNICATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data jsonb DEFAULT '{}',
    
    -- Delivery channels
    channels text[] DEFAULT ARRAY['in_app'],
    
    -- Status
    is_read boolean DEFAULT false,
    read_at timestamptz,
    
    -- Priority and scheduling
    priority text DEFAULT 'normal',
    scheduled_for timestamptz,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    sent_at timestamptz,
    
    -- Constraints
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- =============================================
-- SYSTEM CONFIGURATION
-- =============================================

CREATE TABLE IF NOT EXISTS system_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key text UNIQUE NOT NULL,
    value text NOT NULL,
    description text,
    is_public boolean DEFAULT false,
    category text DEFAULT 'general',
    
    -- Validation
    data_type text DEFAULT 'string',
    validation_rules jsonb DEFAULT '{}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_data_type CHECK (data_type IN ('string', 'number', 'boolean', 'json', 'array'))
);

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- User indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true;

-- Product indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_tags ON products USING gin(tags);

-- Order indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_reseller_id ON orders(reseller_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Commission indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_reseller_id ON commissions(reseller_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_created_at ON commissions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_type ON commissions(type);

-- Analytics indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Tracking link indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tracking_links_reseller_id ON tracking_links(reseller_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tracking_links_product_id ON tracking_links(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tracking_links_code ON tracking_links(link_code);

-- AI interaction indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_interactions_agent_id ON ai_interactions(agent_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at);

-- =============================================
-- PARTITIONING SETUP
-- =============================================

-- Partition analytics_events by month
CREATE TABLE IF NOT EXISTS analytics_events_template (LIKE analytics_events INCLUDING ALL);

-- Partition daily_metrics by month
CREATE TABLE IF NOT EXISTS daily_metrics_template (LIKE daily_metrics INCLUDING ALL);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Updated timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resellers_updated_at BEFORE UPDATE ON resellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Order number generation
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(nextval('order_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Commission calculation
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.commission_rate IS NOT NULL AND NEW.total_price IS NOT NULL THEN
        NEW.commission_amount := NEW.total_price * (NEW.commission_rate / 100);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_commission_trigger BEFORE INSERT OR UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION calculate_commission();

-- User security function
CREATE OR REPLACE FUNCTION handle_failed_login()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.failed_login_attempts >= 5 THEN
        NEW.is_locked := true;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_failed_login_trigger BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION handle_failed_login();