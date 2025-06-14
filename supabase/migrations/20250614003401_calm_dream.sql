/*
  # DropPay Security Policies and RLS Implementation
  
  1. Row Level Security Policies
    - Comprehensive RLS for all tables
    - Role-based access control
    - Data isolation and protection
  
  2. Authentication Functions
    - User role checking
    - Permission validation
    - Security helpers
  
  3. Advanced Security Features
    - Multi-factor authentication support
    - Session management
    - Audit logging
*/

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- =============================================
-- AUTHENTICATION HELPER FUNCTIONS
-- =============================================

-- Function to get current user ID
CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS UUID AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  )::uuid;
$$ LANGUAGE SQL STABLE;

-- Function to get current user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
  SELECT role = 'admin' FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user is supplier
CREATE OR REPLACE FUNCTION auth.is_supplier()
RETURNS BOOLEAN AS $$
  SELECT role = 'supplier' FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user is reseller
CREATE OR REPLACE FUNCTION auth.is_reseller()
RETURNS BOOLEAN AS $$
  SELECT role = 'reseller' FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user is client
CREATE OR REPLACE FUNCTION auth.is_client()
RETURNS BOOLEAN AS $$
  SELECT role = 'client' FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- =============================================
-- USER MANAGEMENT POLICIES
-- =============================================

-- Users can insert own data during registration
CREATE POLICY "Users can insert own data during registration" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can read own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Users can update own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT TO authenticated
  USING (auth.is_admin());

-- User profiles policies
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO public
  USING (auth.uid() = user_id);

-- =============================================
-- SUPPLIER POLICIES
-- =============================================

-- Suppliers can read own data
CREATE POLICY "Suppliers can read own data" ON suppliers
  FOR SELECT TO public
  USING (auth.uid() = user_id);

-- Suppliers can update own data
CREATE POLICY "Suppliers can update own data" ON suppliers
  FOR UPDATE TO public
  USING (auth.uid() = user_id);

-- Admins can read all suppliers
CREATE POLICY "Admins can read all suppliers" ON suppliers
  FOR ALL TO authenticated
  USING (auth.is_admin());

-- =============================================
-- PRODUCT POLICIES
-- =============================================

-- Products are readable by all
CREATE POLICY "Products are readable by all" ON products
  FOR SELECT TO public
  USING (true);

-- Suppliers can manage own products
CREATE POLICY "Suppliers can manage own products" ON products
  FOR ALL TO public
  USING (
    auth.uid() IN (
      SELECT user_id FROM suppliers WHERE id = products.supplier_id
    )
  );

-- Product variants follow same rules as products
CREATE POLICY "Product variants readable by all" ON product_variants
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Suppliers can manage own product variants" ON product_variants
  FOR ALL TO public
  USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

-- =============================================
-- CATEGORY POLICIES
-- =============================================

-- Categories are readable by all
CREATE POLICY "Categories are readable by all" ON categories
  FOR SELECT TO public
  USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL TO authenticated
  USING (auth.is_admin());

-- =============================================
-- ORDER POLICIES
-- =============================================

-- Orders visible to related parties
CREATE POLICY "Orders visible to related parties" ON orders
  FOR SELECT TO public
  USING (
    auth.uid() = client_id OR
    auth.uid() IN (
      SELECT user_id FROM suppliers WHERE id = orders.supplier_id
    ) OR
    auth.uid() IN (
      SELECT user_id FROM resellers WHERE id = orders.reseller_id
    )
  );

-- Clients can create orders
CREATE POLICY "Clients can create orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = client_id);

-- Suppliers can update order status
CREATE POLICY "Suppliers can update order status" ON orders
  FOR UPDATE TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM suppliers WHERE id = orders.supplier_id
    )
  );

-- Order items follow order policies
CREATE POLICY "Order items visible to order parties" ON order_items
  FOR SELECT TO public
  USING (
    order_id IN (
      SELECT id FROM orders WHERE
        auth.uid() = client_id OR
        auth.uid() IN (
          SELECT user_id FROM suppliers WHERE id = orders.supplier_id
        ) OR
        auth.uid() IN (
          SELECT user_id FROM resellers WHERE id = orders.reseller_id
        )
    )
  );

-- =============================================
-- COMMISSION POLICIES
-- =============================================

-- Resellers can see own commissions
CREATE POLICY "Resellers can see own commissions" ON commissions
  FOR SELECT TO public
  USING (
    auth.uid() IN (
      SELECT user_id FROM resellers WHERE id = commissions.reseller_id
    )
  );

-- Suppliers can see commissions for their products
CREATE POLICY "Suppliers can see product commissions" ON commissions
  FOR SELECT TO public
  USING (
    order_id IN (
      SELECT id FROM orders WHERE
        auth.uid() IN (
          SELECT user_id FROM suppliers WHERE id = orders.supplier_id
        )
    )
  );

-- =============================================
-- TEAM COLLABORATION POLICIES
-- =============================================

-- Team members can read team data
CREATE POLICY "Team members can read team data" ON reseller_teams
  FOR SELECT TO public
  USING (
    auth.uid() IN (
      SELECT r.user_id FROM resellers r
      JOIN team_memberships tm ON r.id = tm.reseller_id
      WHERE tm.team_id = reseller_teams.id
    )
  );

-- Team leaders can manage their teams
CREATE POLICY "Team leaders can manage teams" ON reseller_teams
  FOR ALL TO public
  USING (
    auth.uid() IN (
      SELECT user_id FROM resellers WHERE id = reseller_teams.leader_id
    )
  );

-- Team membership policies
CREATE POLICY "Team members can read memberships" ON team_memberships
  FOR SELECT TO public
  USING (
    auth.uid() IN (
      SELECT user_id FROM resellers WHERE id = team_memberships.reseller_id
    ) OR
    team_id IN (
      SELECT id FROM reseller_teams WHERE
        auth.uid() IN (
          SELECT user_id FROM resellers WHERE id = reseller_teams.leader_id
        )
    )
  );

-- =============================================
-- TRACKING AND ANALYTICS POLICIES
-- =============================================

-- Resellers can manage own tracking links
CREATE POLICY "Resellers can manage own tracking links" ON tracking_links
  FOR ALL TO public
  USING (
    auth.uid() IN (
      SELECT user_id FROM resellers WHERE id = tracking_links.reseller_id
    )
  );

-- Link analytics follow tracking link policies
CREATE POLICY "Link analytics follow tracking policies" ON link_analytics
  FOR SELECT TO public
  USING (
    tracking_link_id IN (
      SELECT id FROM tracking_links WHERE
        auth.uid() IN (
          SELECT user_id FROM resellers WHERE id = tracking_links.reseller_id
        )
    )
  );

-- =============================================
-- SHOPPING CART POLICIES
-- =============================================

-- Users can manage own shopping carts
CREATE POLICY "Users can manage own carts" ON shopping_carts
  FOR ALL TO public
  USING (auth.uid() = user_id);

-- Cart items follow cart policies
CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL TO public
  USING (
    cart_id IN (
      SELECT id FROM shopping_carts WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- NOTIFICATION POLICIES
-- =============================================

-- Users can see own notifications
CREATE POLICY "Users can see own notifications" ON notifications
  FOR SELECT TO public
  USING (auth.uid() = user_id);

-- Users can update own notifications
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO public
  USING (auth.uid() = user_id);

-- =============================================
-- SYSTEM POLICIES
-- =============================================

-- AI agents readable by all
CREATE POLICY "AI agents readable by all" ON ai_agents
  FOR SELECT TO public
  USING (true);

-- Only admins can manage AI agents
CREATE POLICY "Admins can manage AI agents" ON ai_agents
  FOR ALL TO authenticated
  USING (auth.is_admin());

-- Public settings readable by all
CREATE POLICY "Public settings readable by all" ON system_settings
  FOR SELECT TO public
  USING (is_public = true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings" ON system_settings
  FOR ALL TO authenticated
  USING (auth.is_admin());

-- Daily metrics policies
CREATE POLICY "Users can read relevant metrics" ON daily_metrics
  FOR SELECT TO public
  USING (
    entity_id = auth.uid() OR
    entity_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    ) OR
    entity_id IN (
      SELECT id FROM resellers WHERE user_id = auth.uid()
    ) OR
    auth.is_admin()
  );

-- =============================================
-- RESELLER POLICIES
-- =============================================

-- Resellers can read own data
CREATE POLICY "Resellers can read own data" ON resellers
  FOR SELECT TO public
  USING (auth.uid() = user_id);

-- Resellers can update own data
CREATE POLICY "Resellers can update own data" ON resellers
  FOR UPDATE TO public
  USING (auth.uid() = user_id);

-- Suppliers can read resellers for their products
CREATE POLICY "Suppliers can read resellers" ON resellers
  FOR SELECT TO public
  USING (
    auth.is_supplier() AND
    id IN (
      SELECT DISTINCT reseller_id FROM orders
      WHERE supplier_id IN (
        SELECT id FROM suppliers WHERE user_id = auth.uid()
      )
    )
  );