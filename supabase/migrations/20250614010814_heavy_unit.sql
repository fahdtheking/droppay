/*
  # Role-Based Security Policies for DropPay Platform
  
  1. Security Policies
    - Users can only access their own data
    - Suppliers can manage their own products and orders
    - Resellers can access their commissions and team data
    - Clients can access their orders and reviews
    - Admins have full access for management
    - Moderators can moderate content
    - Analysts can view analytics data
    - Support can assist users
    
  2. Dashboard Access Control
    - Each role gets access to appropriate dashboard features
    - Cross-role data access is properly restricted
    - Public data (like products) is accessible to relevant roles
*/

-- =============================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE((
    SELECT role = 'admin' 
    FROM users 
    WHERE id = auth.uid()
  ), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION auth.has_role(check_role text)
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE((
    SELECT role::text = check_role 
    FROM users 
    WHERE id = auth.uid()
  ), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has any of multiple roles
CREATE OR REPLACE FUNCTION auth.has_any_role(check_roles text[])
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE((
    SELECT role::text = ANY(check_roles)
    FROM users 
    WHERE id = auth.uid()
  ), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's supplier ID
CREATE OR REPLACE FUNCTION auth.get_supplier_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT s.id 
    FROM suppliers s 
    WHERE s.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's reseller ID
CREATE OR REPLACE FUNCTION auth.get_reseller_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT r.id 
    FROM resellers r 
    WHERE r.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- USER & PROFILE POLICIES
-- =============================================

-- Users: Can see own data, admins/support can see all
CREATE POLICY "Users can view own data" ON users
  FOR SELECT TO authenticated
  USING (
    id = auth.uid() OR 
    auth.has_any_role(ARRAY['admin', 'support', 'moderator'])
  );

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- User profiles: Can manage own profile, admins/support can view all
CREATE POLICY "Users can manage own profile" ON user_profiles
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR 
    auth.has_any_role(ARRAY['admin', 'support'])
  )
  WITH CHECK (user_id = auth.uid());

-- User sessions: Can see own sessions, admins can see all
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR 
    auth.is_admin()
  );

-- Login attempts: Only admins and support can view
CREATE POLICY "Admins can view login attempts" ON login_attempts
  FOR SELECT TO authenticated
  USING (auth.has_any_role(ARRAY['admin', 'support']));

-- =============================================
-- SUPPLIER POLICIES
-- =============================================

-- Suppliers: Can manage own data, admins/moderators can view all
CREATE POLICY "Suppliers can manage own data" ON suppliers
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR 
    auth.has_any_role(ARRAY['admin', 'moderator', 'support'])
  )
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- RESELLER POLICIES
-- =============================================

-- Resellers: Can manage own data, admins can view all
CREATE POLICY "Resellers can manage own data" ON resellers
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR 
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  )
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- PRODUCT & CATALOG POLICIES
-- =============================================

-- Categories: Public read, admins can manage
CREATE POLICY "Categories are publicly readable" ON categories
  FOR SELECT TO authenticated
  USING (is_active = true OR auth.has_any_role(ARRAY['admin', 'moderator']));

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL TO authenticated
  USING (auth.has_any_role(ARRAY['admin', 'moderator']))
  WITH CHECK (auth.has_any_role(ARRAY['admin', 'moderator']));

-- Products: Suppliers manage own, others can read active products
CREATE POLICY "Products are readable by authenticated users" ON products
  FOR SELECT TO authenticated
  USING (
    status = 'active' OR 
    supplier_id = auth.get_supplier_id() OR
    auth.has_any_role(ARRAY['admin', 'moderator', 'analyst'])
  );

CREATE POLICY "Suppliers can manage own products" ON products
  FOR ALL TO authenticated
  USING (
    supplier_id = auth.get_supplier_id() OR
    auth.has_any_role(ARRAY['admin', 'moderator'])
  )
  WITH CHECK (
    supplier_id = auth.get_supplier_id() OR
    auth.has_any_role(ARRAY['admin', 'moderator'])
  );

-- Product variants: Follow product access rules
CREATE POLICY "Product variants follow product access" ON product_variants
  FOR SELECT TO authenticated
  USING (
    product_id IN (
      SELECT id FROM products 
      WHERE status = 'active' OR 
            supplier_id = auth.get_supplier_id() OR
            auth.has_any_role(ARRAY['admin', 'moderator'])
    )
  );

CREATE POLICY "Suppliers can manage own product variants" ON product_variants
  FOR ALL TO authenticated
  USING (
    product_id IN (
      SELECT id FROM products 
      WHERE supplier_id = auth.get_supplier_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'moderator'])
  )
  WITH CHECK (
    product_id IN (
      SELECT id FROM products 
      WHERE supplier_id = auth.get_supplier_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'moderator'])
  );

-- Product reviews: Users can manage own reviews, suppliers can see reviews for their products
CREATE POLICY "Users can manage own reviews" ON product_reviews
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR
    product_id IN (
      SELECT id FROM products 
      WHERE supplier_id = auth.get_supplier_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'moderator'])
  )
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- E-COMMERCE POLICIES
-- =============================================

-- Shopping carts: Users can manage own carts
CREATE POLICY "Users can manage own shopping carts" ON shopping_carts
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Cart items: Users can manage items in their carts
CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL TO authenticated
  USING (
    cart_id IN (
      SELECT id FROM shopping_carts 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    cart_id IN (
      SELECT id FROM shopping_carts 
      WHERE user_id = auth.uid()
    )
  );

-- Orders: Complex access based on role
CREATE POLICY "Order access by role" ON orders
  FOR SELECT TO authenticated
  USING (
    client_id = auth.uid() OR  -- Clients see their orders
    supplier_id = auth.get_supplier_id() OR  -- Suppliers see orders for their products
    reseller_id = auth.get_reseller_id() OR  -- Resellers see orders they facilitated
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])  -- Staff see all
  );

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (
    client_id = auth.uid() OR
    auth.has_any_role(ARRAY['admin', 'support'])
  );

CREATE POLICY "Order updates by role" ON orders
  FOR UPDATE TO authenticated
  USING (
    supplier_id = auth.get_supplier_id() OR  -- Suppliers can update order status
    auth.has_any_role(ARRAY['admin', 'support'])  -- Staff can update
  )
  WITH CHECK (
    supplier_id = auth.get_supplier_id() OR
    auth.has_any_role(ARRAY['admin', 'support'])
  );

-- Order items: Follow order access rules
CREATE POLICY "Order items follow order access" ON order_items
  FOR SELECT TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE client_id = auth.uid() OR 
            supplier_id = auth.get_supplier_id() OR
            reseller_id = auth.get_reseller_id() OR
            auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
    )
  );

-- =============================================
-- FINANCIAL POLICIES
-- =============================================

-- Commissions: Resellers see own, suppliers see commissions for their products
CREATE POLICY "Commission access by role" ON commissions
  FOR SELECT TO authenticated
  USING (
    reseller_id = auth.get_reseller_id() OR
    order_id IN (
      SELECT id FROM orders 
      WHERE supplier_id = auth.get_supplier_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Admins can manage commissions" ON commissions
  FOR ALL TO authenticated
  USING (auth.has_any_role(ARRAY['admin', 'support']))
  WITH CHECK (auth.has_any_role(ARRAY['admin', 'support']));

-- Payouts: Resellers see own payouts
CREATE POLICY "Resellers can view own payouts" ON payouts
  FOR SELECT TO authenticated
  USING (
    reseller_id = auth.get_reseller_id() OR
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Admins can manage payouts" ON payouts
  FOR ALL TO authenticated
  USING (auth.has_any_role(ARRAY['admin', 'support']))
  WITH CHECK (auth.has_any_role(ARRAY['admin', 'support']));

-- Wallet transactions: Users see own transactions
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Users can create wallet transactions" ON wallet_transactions
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    auth.has_any_role(ARRAY['admin', 'support'])
  );

-- =============================================
-- TEAM & COLLABORATION POLICIES
-- =============================================

-- Reseller teams: Team members and leaders can view, leaders can manage
CREATE POLICY "Team access for members" ON reseller_teams
  FOR SELECT TO authenticated
  USING (
    leader_id = auth.get_reseller_id() OR
    id IN (
      SELECT team_id FROM team_memberships 
      WHERE reseller_id = auth.get_reseller_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Team leaders can manage teams" ON reseller_teams
  FOR ALL TO authenticated
  USING (
    leader_id = auth.get_reseller_id() OR
    auth.has_any_role(ARRAY['admin', 'support'])
  )
  WITH CHECK (
    leader_id = auth.get_reseller_id() OR
    auth.has_any_role(ARRAY['admin', 'support'])
  );

-- Team memberships: Team members can view, leaders can manage
CREATE POLICY "Team membership access" ON team_memberships
  FOR SELECT TO authenticated
  USING (
    reseller_id = auth.get_reseller_id() OR
    team_id IN (
      SELECT id FROM reseller_teams 
      WHERE leader_id = auth.get_reseller_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Team leaders can manage memberships" ON team_memberships
  FOR ALL TO authenticated
  USING (
    team_id IN (
      SELECT id FROM reseller_teams 
      WHERE leader_id = auth.get_reseller_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'support'])
  )
  WITH CHECK (
    team_id IN (
      SELECT id FROM reseller_teams 
      WHERE leader_id = auth.get_reseller_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'support'])
  );

-- Team milestones: Team members can view, leaders can manage
CREATE POLICY "Team milestone access" ON team_milestones
  FOR SELECT TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_memberships 
      WHERE reseller_id = auth.get_reseller_id()
    ) OR
    team_id IN (
      SELECT id FROM reseller_teams 
      WHERE leader_id = auth.get_reseller_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Team leaders can manage milestones" ON team_milestones
  FOR ALL TO authenticated
  USING (
    team_id IN (
      SELECT id FROM reseller_teams 
      WHERE leader_id = auth.get_reseller_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'support'])
  )
  WITH CHECK (
    team_id IN (
      SELECT id FROM reseller_teams 
      WHERE leader_id = auth.get_reseller_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'support'])
  );

-- =============================================
-- MARKETING & ANALYTICS POLICIES
-- =============================================

-- Tracking links: Resellers manage own links
CREATE POLICY "Resellers can manage own tracking links" ON tracking_links
  FOR ALL TO authenticated
  USING (
    reseller_id = auth.get_reseller_id() OR
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  )
  WITH CHECK (
    reseller_id = auth.get_reseller_id() OR
    auth.has_any_role(ARRAY['admin', 'support'])
  );

-- Link analytics: Follow tracking link access
CREATE POLICY "Link analytics follow tracking link access" ON link_analytics
  FOR SELECT TO authenticated
  USING (
    tracking_link_id IN (
      SELECT id FROM tracking_links 
      WHERE reseller_id = auth.get_reseller_id()
    ) OR
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

-- Campaigns: Resellers manage own campaigns
CREATE POLICY "Resellers can manage own campaigns" ON campaigns
  FOR ALL TO authenticated
  USING (
    reseller_id = auth.get_reseller_id() OR
    auth.has_any_role(ARRAY['admin', 'support', 'analyst'])
  )
  WITH CHECK (
    reseller_id = auth.get_reseller_id() OR
    auth.has_any_role(ARRAY['admin', 'support'])
  );

-- Daily metrics: Analysts and admins can view all, others see relevant data
CREATE POLICY "Daily metrics access by role" ON daily_metrics
  FOR SELECT TO authenticated
  USING (
    auth.has_any_role(ARRAY['admin', 'analyst']) OR
    (entity_id = auth.get_supplier_id() AND auth.has_role('supplier')) OR
    (entity_id = auth.get_reseller_id() AND auth.has_role('reseller'))
  );

CREATE POLICY "Admins can manage daily metrics" ON daily_metrics
  FOR ALL TO authenticated
  USING (auth.has_any_role(ARRAY['admin', 'analyst']))
  WITH CHECK (auth.has_any_role(ARRAY['admin', 'analyst']));

-- =============================================
-- COMMUNICATION POLICIES
-- =============================================

-- Notifications: Users see own notifications
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Messages: Users can see sent/received messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT TO authenticated
  USING (
    sender_id = auth.uid() OR 
    recipient_id = auth.uid() OR
    auth.has_any_role(ARRAY['admin', 'support', 'moderator'])
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE TO authenticated
  USING (
    recipient_id = auth.uid() OR  -- Can mark as read
    auth.has_any_role(ARRAY['admin', 'support', 'moderator'])
  )
  WITH CHECK (
    recipient_id = auth.uid() OR
    auth.has_any_role(ARRAY['admin', 'support', 'moderator'])
  );

-- =============================================
-- AI & SYSTEM POLICIES
-- =============================================

-- AI agents: All authenticated users can view, admins can manage
CREATE POLICY "AI agents are viewable by authenticated users" ON ai_agents
  FOR SELECT TO authenticated
  USING (is_active = true OR auth.is_admin());

CREATE POLICY "Admins can manage AI agents" ON ai_agents
  FOR ALL TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- System settings: Public settings viewable by all, admins manage all
CREATE POLICY "Public system settings are viewable" ON system_settings
  FOR SELECT TO authenticated
  USING (is_public = true OR auth.is_admin());

CREATE POLICY "Admins can manage system settings" ON system_settings
  FOR ALL TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- =============================================
-- DASHBOARD ACCESS FUNCTIONS
-- =============================================

-- Function to get user's dashboard route based on role
CREATE OR REPLACE FUNCTION auth.get_dashboard_route()
RETURNS text AS $$
DECLARE
  user_role_val text;
BEGIN
  SELECT role::text INTO user_role_val FROM users WHERE id = auth.uid();
  
  CASE user_role_val
    WHEN 'admin' THEN RETURN '/dashboard/admin';
    WHEN 'supplier' THEN RETURN '/dashboard/supplier';
    WHEN 'reseller' THEN RETURN '/dashboard/reseller';
    WHEN 'client' THEN RETURN '/dashboard/client';
    WHEN 'moderator' THEN RETURN '/dashboard/admin';
    WHEN 'analyst' THEN RETURN '/dashboard/admin';
    WHEN 'support' THEN RETURN '/dashboard/admin';
    ELSE RETURN '/';
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access specific dashboard
CREATE OR REPLACE FUNCTION auth.can_access_dashboard(dashboard_type text)
RETURNS boolean AS $$
DECLARE
  user_role_val text;
BEGIN
  SELECT role::text INTO user_role_val FROM users WHERE id = auth.uid();
  
  CASE dashboard_type
    WHEN 'admin' THEN 
      RETURN user_role_val IN ('admin', 'moderator', 'analyst', 'support');
    WHEN 'supplier' THEN 
      RETURN user_role_val = 'supplier';
    WHEN 'reseller' THEN 
      RETURN user_role_val = 'reseller';
    WHEN 'client' THEN 
      RETURN user_role_val = 'client';
    ELSE 
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;