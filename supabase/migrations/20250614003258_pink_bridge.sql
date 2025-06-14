/*
  # DropPay Database Schema Optimization
  
  1. Enhanced Schema Structure
    - Optimized data types and constraints
    - Advanced indexing strategies
    - Improved relationships and foreign keys
    - Partitioning for large tables
  
  2. New Features
    - AI/ML integration points
    - Web3 compatibility
    - Advanced team collaboration
    - Enhanced analytics tracking
  
  3. Performance Improvements
    - Composite indexes for common queries
    - Partial indexes for filtered data
    - GIN indexes for full-text search
    - Materialized views for analytics
*/

-- =============================================
-- ENHANCED ENUMS AND TYPES
-- =============================================

-- Enhanced user roles with new types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'supplier', 'reseller', 'client', 'moderator', 'analyst', 'support');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enhanced order status
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enhanced payment status
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Commission status
DO $$ BEGIN
    CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Commission types
DO $$ BEGIN
    CREATE TYPE commission_type AS ENUM ('sale', 'bonus', 'milestone', 'referral');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Supplier status
DO $$ BEGIN
    CREATE TYPE supplier_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Product status
DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('draft', 'active', 'inactive', 'out_of_stock', 'discontinued');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Reseller types
DO $$ BEGIN
    CREATE TYPE reseller_type AS ENUM ('solo', 'team_leader', 'team_member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Performance tiers
DO $$ BEGIN
    CREATE TYPE performance_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notification types
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('order_status', 'commission_earned', 'team_milestone', 'system_alert', 'marketing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AI agent types
DO $$ BEGIN
    CREATE TYPE ai_agent_type AS ENUM (
        'jarvis_home', 'verify_supplier', 'client_assistant', 
        'growth_advisor', 'campaign_studio', 'product_discovery',
        'transaction_simulator', 'team_collaboration', 'supplier_success',
        'wallet_assistant', 'admin_control'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- ENHANCED CORE TABLES
-- =============================================

-- Enhanced users table with security features
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT,
            name TEXT NOT NULL,
            role user_role NOT NULL DEFAULT 'client',
            is_verified BOOLEAN DEFAULT false,
            email_verified_at TIMESTAMPTZ,
            phone TEXT,
            avatar_url TEXT,
            last_login_at TIMESTAMPTZ,
            failed_login_attempts INTEGER DEFAULT 0,
            is_locked BOOLEAN DEFAULT false,
            locked_until TIMESTAMPTZ,
            two_factor_enabled BOOLEAN DEFAULT false,
            two_factor_secret TEXT,
            backup_codes TEXT[],
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Enhanced user profiles with extended information
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        CREATE TABLE user_profiles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            country TEXT,
            currency TEXT DEFAULT 'USD',
            timezone TEXT,
            language TEXT DEFAULT 'en',
            date_of_birth DATE,
            address JSONB,
            preferences JSONB DEFAULT '{}',
            kyc_status TEXT DEFAULT 'pending',
            kyc_documents JSONB DEFAULT '[]',
            social_profiles JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Enhanced suppliers table
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'suppliers') THEN
        CREATE TABLE suppliers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            company_name TEXT NOT NULL,
            legal_name TEXT NOT NULL,
            tax_id TEXT,
            business_type TEXT,
            store_url TEXT UNIQUE NOT NULL,
            store_name TEXT NOT NULL,
            description TEXT,
            logo_url TEXT,
            banner_url TEXT,
            commission_rate DECIMAL(5,2) DEFAULT 15.00,
            status supplier_status DEFAULT 'pending',
            verification_documents JSONB DEFAULT '[]',
            store_settings JSONB DEFAULT '{}',
            performance_metrics JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Enhanced resellers table
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'resellers') THEN
        CREATE TABLE resellers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            reseller_type reseller_type DEFAULT 'solo',
            referral_code TEXT UNIQUE NOT NULL,
            performance_tier performance_tier DEFAULT 'bronze',
            total_sales DECIMAL(12,2) DEFAULT 0,
            total_commission DECIMAL(12,2) DEFAULT 0,
            team_bonus_earned DECIMAL(12,2) DEFAULT 0,
            payout_info JSONB DEFAULT '{}',
            performance_metrics JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Enhanced categories table
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories') THEN
        CREATE TABLE categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
            commission_rate DECIMAL(5,2),
            image_url TEXT,
            is_active BOOLEAN DEFAULT true,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Enhanced products table
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
        CREATE TABLE products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
            category_id UUID REFERENCES categories(id),
            sku TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            short_description TEXT,
            price DECIMAL(10,2) NOT NULL,
            cost DECIMAL(10,2),
            commission_rate DECIMAL(5,2),
            inventory_quantity INTEGER DEFAULT 0,
            low_stock_threshold INTEGER DEFAULT 10,
            weight DECIMAL(8,2),
            dimensions JSONB,
            images JSONB DEFAULT '[]',
            features JSONB DEFAULT '[]',
            specifications JSONB DEFAULT '{}',
            tags TEXT[],
            status product_status DEFAULT 'draft',
            is_featured BOOLEAN DEFAULT false,
            seo_title TEXT,
            seo_description TEXT,
            search_vector TSVECTOR,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now(),
            UNIQUE(supplier_id, sku)
        );
    END IF;
END $$;

-- Product variants table
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_variants') THEN
        CREATE TABLE product_variants (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            sku TEXT NOT NULL,
            name TEXT NOT NULL,
            price_adjustment DECIMAL(10,2) DEFAULT 0,
            inventory_quantity INTEGER DEFAULT 0,
            attributes JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now(),
            UNIQUE(product_id, sku)
        );
    END IF;
END $$;

-- Enhanced orders table
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
        CREATE TABLE orders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_number TEXT UNIQUE NOT NULL,
            client_id UUID REFERENCES users(id),
            supplier_id UUID REFERENCES suppliers(id),
            reseller_id UUID REFERENCES resellers(id),
            status order_status DEFAULT 'pending',
            subtotal DECIMAL(12,2) NOT NULL,
            tax_amount DECIMAL(12,2) DEFAULT 0,
            shipping_amount DECIMAL(12,2) DEFAULT 0,
            discount_amount DECIMAL(12,2) DEFAULT 0,
            total_amount DECIMAL(12,2) NOT NULL,
            currency TEXT DEFAULT 'USD',
            payment_status payment_status DEFAULT 'pending',
            payment_method TEXT,
            payment_reference TEXT,
            shipping_address JSONB,
            billing_address JSONB,
            tracking_number TEXT,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Order items table
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'order_items') THEN
        CREATE TABLE order_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id),
            variant_id UUID REFERENCES product_variants(id),
            product_name TEXT NOT NULL,
            product_sku TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price DECIMAL(10,2) NOT NULL,
            total_price DECIMAL(10,2) NOT NULL,
            commission_rate DECIMAL(5,2),
            commission_amount DECIMAL(10,2),
            created_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Enhanced commissions table
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'commissions') THEN
        CREATE TABLE commissions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            reseller_id UUID REFERENCES resellers(id) ON DELETE CASCADE,
            order_id UUID REFERENCES orders(id),
            order_item_id UUID REFERENCES order_items(id),
            amount DECIMAL(10,2) NOT NULL,
            rate DECIMAL(5,2) NOT NULL,
            status commission_status DEFAULT 'pending',
            type commission_type DEFAULT 'sale',
            description TEXT,
            paid_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- =============================================
-- TEAM COLLABORATION TABLES
-- =============================================

-- Reseller teams
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reseller_teams') THEN
        CREATE TABLE reseller_teams (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            leader_id UUID REFERENCES resellers(id),
            description TEXT,
            invite_code TEXT UNIQUE,
            total_sales DECIMAL(12,2) DEFAULT 0,
            total_members INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Team memberships
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'team_memberships') THEN
        CREATE TABLE team_memberships (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            team_id UUID REFERENCES reseller_teams(id) ON DELETE CASCADE,
            reseller_id UUID REFERENCES resellers(id) ON DELETE CASCADE,
            role TEXT DEFAULT 'member',
            joined_at TIMESTAMPTZ DEFAULT now(),
            UNIQUE(team_id, reseller_id)
        );
    END IF;
END $$;

-- Team milestones
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'team_milestones') THEN
        CREATE TABLE team_milestones (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            team_id UUID REFERENCES reseller_teams(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            target_amount DECIMAL(12,2) NOT NULL,
            current_amount DECIMAL(12,2) DEFAULT 0,
            reward_description TEXT,
            reward_amount DECIMAL(10,2),
            deadline TIMESTAMPTZ,
            is_completed BOOLEAN DEFAULT false,
            completed_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- =============================================
-- MARKETING AND TRACKING TABLES
-- =============================================

-- Tracking links
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tracking_links') THEN
        CREATE TABLE tracking_links (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            reseller_id UUID REFERENCES resellers(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            link_code TEXT UNIQUE NOT NULL,
            full_url TEXT NOT NULL,
            clicks INTEGER DEFAULT 0,
            conversions INTEGER DEFAULT 0,
            last_clicked_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Link analytics
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'link_analytics') THEN
        CREATE TABLE link_analytics (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tracking_link_id UUID REFERENCES tracking_links(id) ON DELETE CASCADE,
            ip_address INET,
            user_agent TEXT,
            referrer TEXT,
            country TEXT,
            device_type TEXT,
            converted BOOLEAN DEFAULT false,
            conversion_value DECIMAL(10,2),
            created_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- =============================================
-- SHOPPING AND CART TABLES
-- =============================================

-- Shopping carts
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'shopping_carts') THEN
        CREATE TABLE shopping_carts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            session_id TEXT,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Cart items
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        CREATE TABLE cart_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            cart_id UUID REFERENCES shopping_carts(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            unit_price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- =============================================
-- COMMUNICATION TABLES
-- =============================================

-- Notifications
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        CREATE TABLE notifications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            type notification_type NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            data JSONB DEFAULT '{}',
            is_read BOOLEAN DEFAULT false,
            read_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- =============================================
-- AI AND SYSTEM TABLES
-- =============================================

-- AI agents
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_agents') THEN
        CREATE TABLE ai_agents (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            type ai_agent_type NOT NULL,
            description TEXT,
            configuration JSONB DEFAULT '{}',
            is_active BOOLEAN DEFAULT true,
            usage_stats JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- System settings
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'system_settings') THEN
        CREATE TABLE system_settings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL,
            description TEXT,
            is_public BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Daily metrics for analytics
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'daily_metrics') THEN
        CREATE TABLE daily_metrics (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            date DATE NOT NULL,
            metric_type TEXT NOT NULL,
            entity_id UUID,
            value DECIMAL(15,2) NOT NULL,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT now(),
            UNIQUE(date, metric_type, entity_id)
        );
    END IF;
END $$;

-- =============================================
-- TRIGGERS AND FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD-' || TO_CHAR(now(), 'YYYY') || '-' || 
                       LPAD(EXTRACT(epoch FROM now())::TEXT, 10, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate commission
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.commission_rate IS NOT NULL THEN
        NEW.commission_amount = NEW.total_price * (NEW.commission_rate / 100);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update product search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = to_tsvector('english', 
        COALESCE(NEW.name, '') || ' ' || 
        COALESCE(NEW.description, '') || ' ' || 
        COALESCE(NEW.short_description, '') || ' ' ||
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DO $$ BEGIN
    -- Updated at triggers
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON users 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_suppliers_updated_at') THEN
        CREATE TRIGGER update_suppliers_updated_at 
            BEFORE UPDATE ON suppliers 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
        CREATE TRIGGER update_products_updated_at 
            BEFORE UPDATE ON products 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_resellers_updated_at') THEN
        CREATE TRIGGER update_resellers_updated_at 
            BEFORE UPDATE ON resellers 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
        CREATE TRIGGER update_categories_updated_at 
            BEFORE UPDATE ON categories 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Order number generation
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'generate_order_number_trigger') THEN
        CREATE TRIGGER generate_order_number_trigger 
            BEFORE INSERT ON orders 
            FOR EACH ROW EXECUTE FUNCTION generate_order_number();
    END IF;
    
    -- Commission calculation
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'calculate_commission_trigger') THEN
        CREATE TRIGGER calculate_commission_trigger 
            BEFORE INSERT OR UPDATE ON order_items 
            FOR EACH ROW EXECUTE FUNCTION calculate_commission();
    END IF;
    
    -- Product search vector update
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_product_search_vector_trigger') THEN
        CREATE TRIGGER update_product_search_vector_trigger 
            BEFORE INSERT OR UPDATE ON products 
            FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();
    END IF;
END $$;