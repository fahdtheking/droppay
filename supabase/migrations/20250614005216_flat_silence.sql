/*
  # Row Level Security Policies

  1. User Policies
    - Users can read/update their own data
    - Admins can read all users
    - Support staff can read user data

  2. Supplier Policies
    - Suppliers can manage their own data
    - Admins and moderators can view all suppliers

  3. Reseller Policies
    - Resellers can manage their own data
    - Team leaders can view team member data

  4. Product Policies
    - Suppliers can manage their own products
    - Everyone can read active products

  5. Order Policies
    - Users can view their own orders
    - Suppliers can view orders for their products

  6. Commission Policies
    - Resellers can view their own commissions
    - Admins can view all commissions

  7. Team Policies
    - Team members can view team data
    - Team leaders can manage teams
*/

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS text AS $$
  SELECT role::text FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
  SELECT role = 'admin' FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_supplier()
RETURNS boolean AS $$
  SELECT role = 'supplier' FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_reseller()
RETURNS boolean AS $$
  SELECT role = 'reseller' FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_staff()
RETURNS boolean AS $$
  SELECT role IN ('admin', 'moderator', 'analyst', 'support') FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Users policies
CREATE POLICY "users_own_data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "users_admin_read" ON users
  FOR SELECT USING (auth.is_admin());

CREATE POLICY "users_staff_read" ON users
  FOR SELECT USING (auth.is_staff());

-- User profiles policies
CREATE POLICY "profiles_own_data" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "profiles_staff_read" ON user_profiles
  FOR SELECT USING (auth.is_staff());

-- Suppliers policies
CREATE POLICY "suppliers_own_data" ON suppliers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "suppliers_public_read" ON suppliers
  FOR SELECT USING (status = 'approved');

CREATE POLICY "suppliers_staff_read" ON suppliers
  FOR SELECT USING (auth.is_staff());

-- Resellers policies
CREATE POLICY "resellers_own_data" ON resellers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "resellers_supplier_read" ON resellers
  FOR SELECT USING (auth.is_supplier());

CREATE POLICY "resellers_staff_read" ON resellers
  FOR SELECT USING (auth.is_staff());

-- Categories policies
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "categories_admin_manage" ON categories
  FOR ALL USING (auth.is_admin());

-- Products policies
CREATE POLICY "products_supplier_manage" ON products
  FOR ALL USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "products_staff_read" ON products
  FOR SELECT USING (auth.is_staff());

-- Product variants policies
CREATE POLICY "variants_supplier_manage" ON product_variants
  FOR ALL USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "variants_public_read" ON product_variants
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM products WHERE status = 'active'
    )
  );

-- Orders policies
CREATE POLICY "orders_client_read" ON orders
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "orders_supplier_read" ON orders
  FOR SELECT USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "orders_reseller_read" ON orders
  FOR SELECT USING (
    reseller_id IN (
      SELECT id FROM resellers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "orders_staff_read" ON orders
  FOR SELECT USING (auth.is_staff());

CREATE POLICY "orders_client_create" ON orders
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Order items policies
CREATE POLICY "order_items_order_access" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE 
        client_id = auth.uid() OR 
        supplier_id IN (SELECT id FROM suppliers WHERE user_id = auth.uid()) OR
        reseller_id IN (SELECT id FROM resellers WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "order_items_staff_read" ON order_items
  FOR SELECT USING (auth.is_staff());

-- Commissions policies
CREATE POLICY "commissions_reseller_read" ON commissions
  FOR SELECT USING (
    reseller_id IN (
      SELECT id FROM resellers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "commissions_staff_manage" ON commissions
  FOR ALL USING (auth.is_staff());

-- Payouts policies
CREATE POLICY "payouts_reseller_read" ON payouts
  FOR SELECT USING (
    reseller_id IN (
      SELECT id FROM resellers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "payouts_admin_manage" ON payouts
  FOR ALL USING (auth.is_admin());

-- Wallet transactions policies
CREATE POLICY "wallet_own_data" ON wallet_transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "wallet_staff_read" ON wallet_transactions
  FOR SELECT USING (auth.is_staff());

-- Reseller teams policies
CREATE POLICY "teams_member_read" ON reseller_teams
  FOR SELECT USING (
    id IN (
      SELECT team_id FROM team_memberships tm
      JOIN resellers r ON tm.reseller_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

CREATE POLICY "teams_leader_manage" ON reseller_teams
  FOR ALL USING (
    leader_id IN (
      SELECT id FROM resellers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "teams_staff_read" ON reseller_teams
  FOR SELECT USING (auth.is_staff());

-- Team memberships policies
CREATE POLICY "memberships_team_access" ON team_memberships
  FOR SELECT USING (
    team_id IN (
      SELECT id FROM reseller_teams WHERE
        leader_id IN (SELECT id FROM resellers WHERE user_id = auth.uid()) OR
        id IN (
          SELECT team_id FROM team_memberships tm2
          JOIN resellers r ON tm2.reseller_id = r.id
          WHERE r.user_id = auth.uid()
        )
    )
  );

CREATE POLICY "memberships_leader_manage" ON team_memberships
  FOR ALL USING (
    team_id IN (
      SELECT id FROM reseller_teams WHERE
        leader_id IN (SELECT id FROM resellers WHERE user_id = auth.uid())
    )
  );

-- Team milestones policies
CREATE POLICY "milestones_team_access" ON team_milestones
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM team_memberships tm
      JOIN resellers r ON tm.reseller_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

CREATE POLICY "milestones_leader_manage" ON team_milestones
  FOR ALL USING (
    team_id IN (
      SELECT id FROM reseller_teams WHERE
        leader_id IN (SELECT id FROM resellers WHERE user_id = auth.uid())
    )
  );

-- Tracking links policies
CREATE POLICY "tracking_reseller_manage" ON tracking_links
  FOR ALL USING (
    reseller_id IN (
      SELECT id FROM resellers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tracking_staff_read" ON tracking_links
  FOR SELECT USING (auth.is_staff());

-- Link analytics policies
CREATE POLICY "analytics_reseller_read" ON link_analytics
  FOR SELECT USING (
    tracking_link_id IN (
      SELECT id FROM tracking_links tl
      JOIN resellers r ON tl.reseller_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

CREATE POLICY "analytics_staff_read" ON link_analytics
  FOR SELECT USING (auth.is_staff());

-- Shopping carts policies
CREATE POLICY "carts_own_data" ON shopping_carts
  FOR ALL USING (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "cart_items_own_data" ON cart_items
  FOR ALL USING (
    cart_id IN (
      SELECT id FROM shopping_carts WHERE user_id = auth.uid()
    )
  );

-- Campaigns policies
CREATE POLICY "campaigns_reseller_manage" ON campaigns
  FOR ALL USING (
    reseller_id IN (
      SELECT id FROM resellers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "campaigns_staff_read" ON campaigns
  FOR SELECT USING (auth.is_staff());

-- Notifications policies
CREATE POLICY "notifications_own_data" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "messages_sender_read" ON messages
  FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "messages_recipient_read" ON messages
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "messages_send" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_staff_read" ON messages
  FOR SELECT USING (auth.is_staff());

-- Product reviews policies
CREATE POLICY "reviews_own_data" ON product_reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "reviews_public_read" ON product_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "reviews_staff_manage" ON product_reviews
  FOR ALL USING (auth.is_staff());

-- AI agents policies
CREATE POLICY "ai_agents_public_read" ON ai_agents
  FOR SELECT USING (is_active = true);

CREATE POLICY "ai_agents_admin_manage" ON ai_agents
  FOR ALL USING (auth.is_admin());

-- System settings policies
CREATE POLICY "settings_public_read" ON system_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "settings_admin_manage" ON system_settings
  FOR ALL USING (auth.is_admin());

-- Daily metrics policies
CREATE POLICY "metrics_own_data" ON daily_metrics
  FOR SELECT USING (
    entity_id = auth.uid() OR
    entity_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    ) OR
    entity_id IN (
      SELECT id FROM resellers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "metrics_staff_read" ON daily_metrics
  FOR SELECT USING (auth.is_staff());

CREATE POLICY "metrics_admin_manage" ON daily_metrics
  FOR ALL USING (auth.is_admin());

-- User sessions policies
CREATE POLICY "sessions_own_data" ON user_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "sessions_admin_read" ON user_sessions
  FOR SELECT USING (auth.is_admin());

-- Login attempts policies (admin only)
CREATE POLICY "login_attempts_admin_read" ON login_attempts
  FOR SELECT USING (auth.is_admin());