/*
  # DropPay Platform Database Schema

  1. New Tables
    - `users` - User authentication and basic info
    - `user_profiles` - Extended user profile information
    - `suppliers` - Supplier company information and store settings
    - `resellers` - Reseller-specific data and performance metrics
    - `categories` - Product categories with hierarchical structure
    - `products` - Product catalog with pricing and inventory
    - `product_variants` - Product variations (size, color, etc.)
    - `orders` - Order management and tracking
    - `order_items` - Individual items within orders
    - `shopping_carts` - Persistent shopping cart storage
    - `cart_items` - Items in shopping carts
    - `commissions` - Commission tracking and payouts
    - `reseller_teams` - Team collaboration structure
    - `team_memberships` - Team member relationships
    - `team_milestones` - Collective team goals and rewards
    - `tracking_links` - Unique referral links for resellers
    - `link_analytics` - Click and conversion tracking
    - `notifications` - User notifications system
    - `ai_agents` - AI agent configurations and usage
    - `system_settings` - Platform configuration
    - `daily_metrics` - Daily analytics snapshots

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure financial and personal data

  3. Performance
    - Add indexes for common queries
    - Optimize for real-time operations
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('admin', 'supplier', 'reseller', 'client');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cancelled');
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');
CREATE TYPE commission_type AS ENUM ('sale', 'bonus', 'milestone', 'referral');
CREATE TYPE supplier_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'inactive', 'out_of_stock', 'discontinued');
CREATE TYPE reseller_type AS ENUM ('solo', 'team_leader', 'team_member');
CREATE TYPE performance_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
CREATE TYPE notification_type AS ENUM ('order_status', 'commission_earned', 'team_milestone', 'system_alert', 'marketing');
CREATE TYPE ai_agent_type AS ENUM ('jarvis_home', 'verify_supplier', 'client_assistant', 'growth_advisor', 'campaign_studio', 'product_discovery', 'transaction_simulator', 'team_collaboration', 'supplier_success', 'wallet_assistant', 'admin_control');

-- =============================================
-- CORE TABLES
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  is_verified boolean DEFAULT false,
  email_verified_at timestamptz,
  phone text,
  avatar_url text,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User profiles for extended information
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  country text,
  currency text DEFAULT 'USD',
  timezone text,
  language text DEFAULT 'en',
  address jsonb,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resellers
CREATE TABLE IF NOT EXISTS resellers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reseller_type reseller_type DEFAULT 'solo',
  referral_code text UNIQUE NOT NULL,
  performance_tier performance_tier DEFAULT 'bronze',
  total_sales decimal(12,2) DEFAULT 0,
  total_commission decimal(12,2) DEFAULT 0,
  team_bonus_earned decimal(12,2) DEFAULT 0,
  payout_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories (hierarchical)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  commission_rate decimal(5,2),
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  sku text NOT NULL,
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
  images jsonb DEFAULT '[]',
  features jsonb DEFAULT '[]',
  specifications jsonb DEFAULT '{}',
  tags text[],
  status product_status DEFAULT 'draft',
  is_featured boolean DEFAULT false,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(supplier_id, sku)
);

-- Product variants (size, color, etc.)
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  sku text NOT NULL,
  name text NOT NULL,
  price_adjustment decimal(10,2) DEFAULT 0,
  inventory_quantity integer DEFAULT 0,
  attributes jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, sku)
);

-- Shopping carts
CREATE TABLE IF NOT EXISTS shopping_carts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id uuid REFERENCES shopping_carts(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  product_name text NOT NULL,
  product_sku text NOT NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  commission_rate decimal(5,2),
  commission_amount decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Commissions
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id),
  order_item_id uuid REFERENCES order_items(id),
  amount decimal(10,2) NOT NULL,
  rate decimal(5,2) NOT NULL,
  status commission_status DEFAULT 'pending',
  type commission_type DEFAULT 'sale',
  description text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reseller teams
CREATE TABLE IF NOT EXISTS reseller_teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES reseller_teams(id) ON DELETE CASCADE,
  reseller_id uuid REFERENCES resellers(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, reseller_id)
);

-- Team milestones
CREATE TABLE IF NOT EXISTS team_milestones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES reseller_teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  target_amount decimal(12,2) NOT NULL,
  current_amount decimal(12,2) DEFAULT 0,
  reward_description text,
  reward_amount decimal(10,2),
  deadline timestamptz,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tracking links for resellers
CREATE TABLE IF NOT EXISTS tracking_links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Link analytics
CREATE TABLE IF NOT EXISTS link_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_link_id uuid REFERENCES tracking_links(id) ON DELETE CASCADE,
  ip_address inet,
  user_agent text,
  referrer text,
  country text,
  device_type text,
  converted boolean DEFAULT false,
  conversion_value decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- AI Agents
CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type ai_agent_type NOT NULL,
  description text,
  configuration jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  usage_stats jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Daily metrics for analytics
CREATE TABLE IF NOT EXISTS daily_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  metric_type text NOT NULL,
  entity_id uuid,
  value decimal(15,2) NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, metric_type, entity_id)
);

-- =============================================
-- INDEXES
-- =============================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_reseller ON orders(reseller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Commissions
CREATE INDEX IF NOT EXISTS idx_commissions_reseller ON commissions(reseller_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_created_at ON commissions(created_at);

-- Tracking links
CREATE INDEX IF NOT EXISTS idx_tracking_links_reseller ON tracking_links(reseller_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_product ON tracking_links(product_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_code ON tracking_links(link_code);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_link_analytics_tracking_link ON link_analytics(tracking_link_id);
CREATE INDEX IF NOT EXISTS idx_link_analytics_created_at ON link_analytics(created_at);

-- Daily metrics
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date_type ON daily_metrics(date, metric_type);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_entity ON daily_metrics(entity_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resellers_updated_at BEFORE UPDATE ON resellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order numbers
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

-- Auto-calculate commission amounts
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

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Basic policies (users can read their own data)
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Suppliers can manage their own data
CREATE POLICY "Suppliers can read own data" ON suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Suppliers can update own data" ON suppliers FOR UPDATE USING (auth.uid() = user_id);

-- Products are readable by all, manageable by suppliers
CREATE POLICY "Products are readable by all" ON products FOR SELECT USING (true);
CREATE POLICY "Suppliers can manage own products" ON products FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM suppliers WHERE id = supplier_id)
);

-- Categories are readable by all
CREATE POLICY "Categories are readable by all" ON categories FOR SELECT USING (true);

-- Orders are visible to related parties
CREATE POLICY "Orders visible to related parties" ON orders FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT user_id FROM suppliers WHERE id = supplier_id) OR
  auth.uid() IN (SELECT user_id FROM resellers WHERE id = reseller_id)
);

-- Commissions visible to resellers
CREATE POLICY "Resellers can see own commissions" ON commissions FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM resellers WHERE id = reseller_id)
);

-- Notifications visible to recipients
CREATE POLICY "Users can see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- System settings - public ones readable by all
CREATE POLICY "Public settings readable by all" ON system_settings FOR SELECT USING (is_public = true);

-- AI agents readable by all
CREATE POLICY "AI agents readable by all" ON ai_agents FOR SELECT USING (true);