/*
  # Complete DropPay Database Schema
  
  1. Core Tables
    - Users with 7 roles (admin, supplier, reseller, client, moderator, analyst, support)
    - User profiles with extended information
    - Suppliers with marketplace functionality
    - Resellers with team structure and performance tracking
    
  2. E-commerce Tables
    - Categories with hierarchical structure
    - Products with variants, search, and inventory
    - Orders with complete transaction management
    - Shopping carts for active sessions
    
  3. Financial Tables
    - Commissions with multiple types
    - Payouts and wallet transactions
    - Team bonuses and milestone rewards
    
  4. Marketing & Analytics
    - Tracking links with click analytics
    - Campaigns and performance metrics
    - Daily metrics and reporting
    
  5. Communication
    - Notifications system
    - Messages between users
    - Product reviews and ratings
    
  6. AI & System
    - AI agents for all platform tools
    - System settings and configuration
    - User sessions and security
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'supplier', 'reseller', 'client', 'moderator', 'analyst', 'support');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cancelled');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'inactive', 'out_of_stock', 'discontinued');
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');
CREATE TYPE commission_type AS ENUM ('sale', 'bonus', 'milestone', 'referral');
CREATE TYPE supplier_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');
CREATE TYPE reseller_type AS ENUM ('solo', 'team_leader', 'team_member');
CREATE TYPE performance_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
CREATE TYPE notification_type AS ENUM ('order_status', 'commission_earned', 'team_milestone', 'system_alert', 'marketing');
CREATE TYPE ai_agent_type AS ENUM ('jarvis_home', 'verify_supplier', 'client_assistant', 'growth_advisor', 'campaign_studio', 'product_discovery', 'transaction_simulator', 'team_collaboration', 'supplier_success', 'wallet_assistant', 'admin_control');

-- =============================================
-- CORE USER TABLES
-- =============================================

-- Users table (enhanced with all roles)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  email_verified_at timestamptz,
  phone text,
  avatar_url text,
  last_login_at timestamptz,
  failed_login_attempts integer DEFAULT 0,
  is_locked boolean DEFAULT false,
  locked_until timestamptz,
  two_factor_enabled boolean DEFAULT false,
  two_factor_secret text,
  backup_codes text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User profiles for extended information
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  country text,
  currency text DEFAULT 'USD',
  timezone text,
  language text DEFAULT 'en',
  date_of_birth date,
  address jsonb,
  preferences jsonb DEFAULT '{}',
  kyc_status kyc_status DEFAULT 'pending',
  kyc_documents jsonb DEFAULT '[]',
  social_profiles jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User sessions for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  refresh_token text,
  device_info jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  is_active boolean DEFAULT true,
  expires_at timestamptz NOT NULL,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Login attempts for security
CREATE TABLE IF NOT EXISTS login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip_address inet,
  user_agent text,
  success boolean NOT NULL,
  failure_reason text,
  attempted_at timestamptz DEFAULT now()
);

-- =============================================
-- BUSINESS ROLE TABLES
-- =============================================

-- Suppliers table (enhanced with marketplace features)
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  legal_name text NOT NULL,
  tax_id text,
  business_type text,
  store_url text UNIQUE NOT NULL,
  store_name text NOT NULL,
  description text,
  logo_url text,
  banner_url text,
  commission_rate decimal(5,2) DEFAULT 15.00,
  status supplier_status DEFAULT 'pending',
  verification_documents jsonb DEFAULT '[]',
  store_settings jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resellers table (enhanced with team features)
CREATE TABLE IF NOT EXISTS resellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reseller_type reseller_type DEFAULT 'solo',
  referral_code text UNIQUE NOT NULL,
  performance_tier performance_tier DEFAULT 'bronze',
  total_sales decimal(12,2) DEFAULT 0,
  total_commission decimal(12,2) DEFAULT 0,
  team_bonus_earned decimal(12,2) DEFAULT 0,
  payout_info jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{}',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- PRODUCT & CATALOG TABLES
-- =============================================

-- Categories table with hierarchical structure
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id),
  commission_rate decimal(5,2),
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table (enhanced with search and inventory)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  short_description text,
  price decimal(10,2) NOT NULL,
  cost decimal(10,2),
  commission_rate decimal(5,2),
  inventory_quantity integer DEFAULT 0,
  low_stock_threshold integer DEFAULT 10,
  weight decimal(8,2),
  dimensions jsonb,
  images text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  specifications jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  status product_status DEFAULT 'draft',
  is_featured boolean DEFAULT false,
  seo_title text,
  seo_description text,
  search_vector tsvector,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product variants for size, color, etc.
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  price_adjustment decimal(10,2) DEFAULT 0,
  inventory_quantity integer DEFAULT 0,
  attributes jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product reviews and ratings
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  is_verified_purchase boolean DEFAULT false,
  is_approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- E-COMMERCE TABLES
-- =============================================

-- Shopping carts for active sessions
CREATE TABLE IF NOT EXISTS shopping_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES shopping_carts(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table (enhanced with complete transaction data)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  client_id uuid REFERENCES users(id),
  supplier_id uuid REFERENCES suppliers(id),
  reseller_id uuid REFERENCES resellers(id),
  status order_status DEFAULT 'pending',
  subtotal decimal(12,2) NOT NULL,
  tax_amount decimal(12,2) DEFAULT 0,
  shipping_amount decimal(12,2) DEFAULT 0,
  discount_amount decimal(12,2) DEFAULT 0,
  total_amount decimal(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_status payment_status DEFAULT 'pending',
  payment_method text,
  payment_reference text,
  shipping_address jsonb,
  billing_address jsonb,
  tracking_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items with commission tracking
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  product_name text NOT NULL,
  product_sku text NOT NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(12,2) NOT NULL,
  commission_rate decimal(5,2),
  commission_amount decimal(12,2),
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- FINANCIAL TABLES
-- =============================================

-- Commissions table with multiple types
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id),
  order_item_id uuid REFERENCES order_items(id),
  amount decimal(12,2) NOT NULL,
  rate decimal(5,2) NOT NULL,
  status commission_status DEFAULT 'pending',
  type commission_type DEFAULT 'sale',
  description text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payouts for reseller earnings
CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
  amount decimal(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending',
  payment_method text,
  payment_reference text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Wallet transactions for all financial activity
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  amount decimal(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  description text,
  reference_id uuid,
  reference_type text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- TEAM & COLLABORATION TABLES
-- =============================================

-- Reseller teams for collaboration
CREATE TABLE IF NOT EXISTS reseller_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  leader_id uuid REFERENCES resellers(id),
  description text,
  invite_code text UNIQUE,
  total_sales decimal(12,2) DEFAULT 0,
  total_members integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team memberships
CREATE TABLE IF NOT EXISTS team_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES reseller_teams(id) ON DELETE CASCADE,
  reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, reseller_id)
);

-- Team milestones for shared goals
CREATE TABLE IF NOT EXISTS team_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES reseller_teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  target_amount decimal(12,2) NOT NULL,
  current_amount decimal(12,2) DEFAULT 0,
  reward_description text,
  reward_amount decimal(12,2),
  deadline timestamptz,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- MARKETING & ANALYTICS TABLES
-- =============================================

-- Tracking links for reseller attribution
CREATE TABLE IF NOT EXISTS tracking_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  link_code text UNIQUE NOT NULL,
  full_url text NOT NULL,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  last_clicked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Link analytics for detailed tracking
CREATE TABLE IF NOT EXISTS link_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_link_id uuid REFERENCES tracking_links(id) ON DELETE CASCADE,
  ip_address inet,
  user_agent text,
  referrer text,
  country text,
  device_type text,
  converted boolean DEFAULT false,
  conversion_value decimal(12,2),
  created_at timestamptz DEFAULT now()
);

-- Campaigns for marketing activities
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text,
  budget decimal(12,2),
  spent decimal(12,2) DEFAULT 0,
  status text DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  target_audience jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Daily metrics for reporting
CREATE TABLE IF NOT EXISTS daily_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  metric_type text NOT NULL,
  entity_id uuid,
  value decimal(15,2) NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, metric_type, entity_id)
);

-- =============================================
-- COMMUNICATION TABLES
-- =============================================

-- Notifications system
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Messages between users
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject text,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- AI & SYSTEM TABLES
-- =============================================

-- AI agents for platform tools
CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type ai_agent_type NOT NULL,
  description text,
  configuration jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  usage_stats jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- System settings and configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;