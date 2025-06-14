/*
# Row Level Security Policies for Role-Based Access

This migration creates comprehensive RLS policies to ensure each user role gets proper access to their designated dashboard and data.

## Security Features:
1. Role-based data access control
2. Dashboard access verification
3. Financial data protection
4. Team collaboration security
5. Cross-role access prevention

## Roles Supported:
- admin: Full platform access
- supplier: Marketplace and product management
- reseller: Commission tracking and team management
- client: Shopping and order history
- moderator: Content moderation
- analyst: Analytics and reporting
- support: Customer support access
*/

-- =============================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE((
    SELECT role = 'admin' 
    FROM public.users 
    WHERE id = auth.uid()
  ), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(check_role text)
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE((
    SELECT role::text = check_role 
    FROM public.users 
    WHERE id = auth.uid()
  ), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has any of multiple roles
CREATE OR REPLACE FUNCTION public.has_any_role(check_roles text[])
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE((
    SELECT role::text = ANY(check_roles)
    FROM public.users 
    WHERE id = auth.uid()
  ), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's supplier ID
CREATE OR REPLACE FUNCTION public.get_supplier_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT s.id 
    FROM public.suppliers s 
    WHERE s.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's reseller ID
CREATE OR REPLACE FUNCTION public.get_reseller_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT r.id 
    FROM public.resellers r 
    WHERE r.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT role::text 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- USER & PROFILE POLICIES
-- =============================================

-- Users: Can see own data, admins/support can see all
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT TO authenticated
  USING (
    id = auth.uid() OR 
    public.has_any_role(ARRAY['admin', 'support', 'moderator'])
  );

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- User profiles: Can manage own profile, admins/support can view all
CREATE POLICY "Users can manage own profile" ON public.user_profiles
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR 
    public.has_any_role(ARRAY['admin', 'support'])
  )
  WITH CHECK (user_id = auth.uid());

-- User sessions: Can see own sessions, admins can see all
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR 
    public.is_admin()
  );

-- Login attempts: Only admins and support can view
CREATE POLICY "Admins can view login attempts" ON public.login_attempts
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'support']));

-- =============================================
-- SUPPLIER POLICIES
-- =============================================

-- Suppliers: Can manage own data, admins/moderators can view all
CREATE POLICY "Suppliers can manage own data" ON public.suppliers
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR 
    public.has_any_role(ARRAY['admin', 'moderator', 'support'])
  )
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- RESELLER POLICIES
-- =============================================

-- Resellers: Can manage own data, admins can view all
CREATE POLICY "Resellers can manage own data" ON public.resellers
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR 
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  )
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- PRODUCT & CATALOG POLICIES
-- =============================================

-- Categories: Public read, admins can manage
CREATE POLICY "Categories are publicly readable" ON public.categories
  FOR SELECT TO authenticated
  USING (is_active = true OR public.has_any_role(ARRAY['admin', 'moderator']));

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'moderator']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'moderator']));

-- Products: Suppliers manage own, others can read active products
CREATE POLICY "Products are readable by authenticated users" ON public.products
  FOR SELECT TO authenticated
  USING (
    status = 'active' OR 
    supplier_id = public.get_supplier_id() OR
    public.has_any_role(ARRAY['admin', 'moderator', 'analyst'])
  );

CREATE POLICY "Suppliers can manage own products" ON public.products
  FOR ALL TO authenticated
  USING (
    supplier_id = public.get_supplier_id() OR
    public.has_any_role(ARRAY['admin', 'moderator'])
  )
  WITH CHECK (
    supplier_id = public.get_supplier_id() OR
    public.has_any_role(ARRAY['admin', 'moderator'])
  );

-- Product variants: Follow product access rules
CREATE POLICY "Product variants follow product access" ON public.product_variants
  FOR SELECT TO authenticated
  USING (
    product_id IN (
      SELECT id FROM public.products 
      WHERE status = 'active' OR 
            supplier_id = public.get_supplier_id() OR
            public.has_any_role(ARRAY['admin', 'moderator'])
    )
  );

CREATE POLICY "Suppliers can manage own product variants" ON public.product_variants
  FOR ALL TO authenticated
  USING (
    product_id IN (
      SELECT id FROM public.products 
      WHERE supplier_id = public.get_supplier_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'moderator'])
  )
  WITH CHECK (
    product_id IN (
      SELECT id FROM public.products 
      WHERE supplier_id = public.get_supplier_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'moderator'])
  );

-- Product reviews: Users can manage own reviews, suppliers can see reviews for their products
CREATE POLICY "Users can manage own reviews" ON public.product_reviews
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR
    product_id IN (
      SELECT id FROM public.products 
      WHERE supplier_id = public.get_supplier_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'moderator'])
  )
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- E-COMMERCE POLICIES
-- =============================================

-- Shopping carts: Users can manage own carts
CREATE POLICY "Users can manage own shopping carts" ON public.shopping_carts
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Cart items: Users can manage items in their carts
CREATE POLICY "Users can manage own cart items" ON public.cart_items
  FOR ALL TO authenticated
  USING (
    cart_id IN (
      SELECT id FROM public.shopping_carts 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    cart_id IN (
      SELECT id FROM public.shopping_carts 
      WHERE user_id = auth.uid()
    )
  );

-- Orders: Complex access based on role
CREATE POLICY "Order access by role" ON public.orders
  FOR SELECT TO authenticated
  USING (
    client_id = auth.uid() OR  -- Clients see their orders
    supplier_id = public.get_supplier_id() OR  -- Suppliers see orders for their products
    reseller_id = public.get_reseller_id() OR  -- Resellers see orders they facilitated
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])  -- Staff see all
  );

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (
    client_id = auth.uid() OR
    public.has_any_role(ARRAY['admin', 'support'])
  );

CREATE POLICY "Order updates by role" ON public.orders
  FOR UPDATE TO authenticated
  USING (
    supplier_id = public.get_supplier_id() OR  -- Suppliers can update order status
    public.has_any_role(ARRAY['admin', 'support'])  -- Staff can update
  )
  WITH CHECK (
    supplier_id = public.get_supplier_id() OR
    public.has_any_role(ARRAY['admin', 'support'])
  );

-- Order items: Follow order access rules
CREATE POLICY "Order items follow order access" ON public.order_items
  FOR SELECT TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE client_id = auth.uid() OR 
            supplier_id = public.get_supplier_id() OR
            reseller_id = public.get_reseller_id() OR
            public.has_any_role(ARRAY['admin', 'support', 'analyst'])
    )
  );

-- =============================================
-- FINANCIAL POLICIES
-- =============================================

-- Commissions: Resellers see own, suppliers see commissions for their products
CREATE POLICY "Commission access by role" ON public.commissions
  FOR SELECT TO authenticated
  USING (
    reseller_id = public.get_reseller_id() OR
    order_id IN (
      SELECT id FROM public.orders 
      WHERE supplier_id = public.get_supplier_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Admins can manage commissions" ON public.commissions
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'support']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'support']));

-- Payouts: Resellers see own payouts
CREATE POLICY "Resellers can view own payouts" ON public.payouts
  FOR SELECT TO authenticated
  USING (
    reseller_id = public.get_reseller_id() OR
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Admins can manage payouts" ON public.payouts
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'support']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'support']));

-- Wallet transactions: Users see own transactions
CREATE POLICY "Users can view own wallet transactions" ON public.wallet_transactions
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Users can create wallet transactions" ON public.wallet_transactions
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    public.has_any_role(ARRAY['admin', 'support'])
  );

-- =============================================
-- TEAM & COLLABORATION POLICIES
-- =============================================

-- Reseller teams: Team members and leaders can view, leaders can manage
CREATE POLICY "Team access for members" ON public.reseller_teams
  FOR SELECT TO authenticated
  USING (
    leader_id = public.get_reseller_id() OR
    id IN (
      SELECT team_id FROM public.team_memberships 
      WHERE reseller_id = public.get_reseller_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Team leaders can manage teams" ON public.reseller_teams
  FOR ALL TO authenticated
  USING (
    leader_id = public.get_reseller_id() OR
    public.has_any_role(ARRAY['admin', 'support'])
  )
  WITH CHECK (
    leader_id = public.get_reseller_id() OR
    public.has_any_role(ARRAY['admin', 'support'])
  );

-- Team memberships: Team members can view, leaders can manage
CREATE POLICY "Team membership access" ON public.team_memberships
  FOR SELECT TO authenticated
  USING (
    reseller_id = public.get_reseller_id() OR
    team_id IN (
      SELECT id FROM public.reseller_teams 
      WHERE leader_id = public.get_reseller_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Team leaders can manage memberships" ON public.team_memberships
  FOR ALL TO authenticated
  USING (
    team_id IN (
      SELECT id FROM public.reseller_teams 
      WHERE leader_id = public.get_reseller_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'support'])
  )
  WITH CHECK (
    team_id IN (
      SELECT id FROM public.reseller_teams 
      WHERE leader_id = public.get_reseller_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'support'])
  );

-- Team milestones: Team members can view, leaders can manage
CREATE POLICY "Team milestone access" ON public.team_milestones
  FOR SELECT TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM public.team_memberships 
      WHERE reseller_id = public.get_reseller_id()
    ) OR
    team_id IN (
      SELECT id FROM public.reseller_teams 
      WHERE leader_id = public.get_reseller_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

CREATE POLICY "Team leaders can manage milestones" ON public.team_milestones
  FOR ALL TO authenticated
  USING (
    team_id IN (
      SELECT id FROM public.reseller_teams 
      WHERE leader_id = public.get_reseller_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'support'])
  )
  WITH CHECK (
    team_id IN (
      SELECT id FROM public.reseller_teams 
      WHERE leader_id = public.get_reseller_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'support'])
  );

-- =============================================
-- MARKETING & ANALYTICS POLICIES
-- =============================================

-- Tracking links: Resellers manage own links
CREATE POLICY "Resellers can manage own tracking links" ON public.tracking_links
  FOR ALL TO authenticated
  USING (
    reseller_id = public.get_reseller_id() OR
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  )
  WITH CHECK (
    reseller_id = public.get_reseller_id() OR
    public.has_any_role(ARRAY['admin', 'support'])
  );

-- Link analytics: Follow tracking link access
CREATE POLICY "Link analytics follow tracking link access" ON public.link_analytics
  FOR SELECT TO authenticated
  USING (
    tracking_link_id IN (
      SELECT id FROM public.tracking_links 
      WHERE reseller_id = public.get_reseller_id()
    ) OR
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  );

-- Campaigns: Resellers manage own campaigns
CREATE POLICY "Resellers can manage own campaigns" ON public.campaigns
  FOR ALL TO authenticated
  USING (
    reseller_id = public.get_reseller_id() OR
    public.has_any_role(ARRAY['admin', 'support', 'analyst'])
  )
  WITH CHECK (
    reseller_id = public.get_reseller_id() OR
    public.has_any_role(ARRAY['admin', 'support'])
  );

-- Daily metrics: Analysts and admins can view all, others see relevant data
CREATE POLICY "Daily metrics access by role" ON public.daily_metrics
  FOR SELECT TO authenticated
  USING (
    public.has_any_role(ARRAY['admin', 'analyst']) OR
    (entity_id = public.get_supplier_id() AND public.has_role('supplier')) OR
    (entity_id = public.get_reseller_id() AND public.has_role('reseller'))
  );

CREATE POLICY "Admins can manage daily metrics" ON public.daily_metrics
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'analyst']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'analyst']));

-- =============================================
-- COMMUNICATION POLICIES
-- =============================================

-- Notifications: Users see own notifications
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Messages: Users can see sent/received messages
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT TO authenticated
  USING (
    sender_id = auth.uid() OR 
    recipient_id = auth.uid() OR
    public.has_any_role(ARRAY['admin', 'support', 'moderator'])
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE TO authenticated
  USING (
    recipient_id = auth.uid() OR  -- Can mark as read
    public.has_any_role(ARRAY['admin', 'support', 'moderator'])
  )
  WITH CHECK (
    recipient_id = auth.uid() OR
    public.has_any_role(ARRAY['admin', 'support', 'moderator'])
  );

-- =============================================
-- AI & SYSTEM POLICIES
-- =============================================

-- AI agents: All authenticated users can view, admins can manage
CREATE POLICY "AI agents are viewable by authenticated users" ON public.ai_agents
  FOR SELECT TO authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage AI agents" ON public.ai_agents
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- System settings: Public settings viewable by all, admins manage all
CREATE POLICY "Public system settings are viewable" ON public.system_settings
  FOR SELECT TO authenticated
  USING (is_public = true OR public.is_admin());

CREATE POLICY "Admins can manage system settings" ON public.system_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================
-- DASHBOARD ACCESS FUNCTIONS
-- =============================================

-- Function to get user's dashboard route based on role
CREATE OR REPLACE FUNCTION public.get_dashboard_route()
RETURNS text AS $$
DECLARE
  user_role_val text;
BEGIN
  SELECT role::text INTO user_role_val FROM public.users WHERE id = auth.uid();
  
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
CREATE OR REPLACE FUNCTION public.can_access_dashboard(dashboard_type text)
RETURNS boolean AS $$
DECLARE
  user_role_val text;
BEGIN
  SELECT role::text INTO user_role_val FROM public.users WHERE id = auth.uid();
  
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

-- =============================================
-- UTILITY FUNCTIONS FOR FRONTEND
-- =============================================

-- Function to get user's complete profile with role-specific data
CREATE OR REPLACE FUNCTION public.get_user_profile()
RETURNS jsonb AS $$
DECLARE
  user_data jsonb;
  profile_data jsonb;
  role_data jsonb := '{}';
  user_role_val text;
BEGIN
  -- Get basic user data
  SELECT to_jsonb(u.*) INTO user_data 
  FROM public.users u 
  WHERE u.id = auth.uid();
  
  IF user_data IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get user profile
  SELECT to_jsonb(up.*) INTO profile_data 
  FROM public.user_profiles up 
  WHERE up.user_id = auth.uid();
  
  -- Get role-specific data
  user_role_val := (user_data->>'role')::text;
  
  CASE user_role_val
    WHEN 'supplier' THEN
      SELECT to_jsonb(s.*) INTO role_data 
      FROM public.suppliers s 
      WHERE s.user_id = auth.uid();
    WHEN 'reseller' THEN
      SELECT to_jsonb(r.*) INTO role_data 
      FROM public.resellers r 
      WHERE r.user_id = auth.uid();
    ELSE
      role_data := '{}';
  END CASE;
  
  -- Combine all data
  RETURN jsonb_build_object(
    'user', user_data,
    'profile', COALESCE(profile_data, '{}'),
    'role_data', COALESCE(role_data, '{}'),
    'dashboard_route', public.get_dashboard_route()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has completed onboarding
CREATE OR REPLACE FUNCTION public.is_onboarding_complete()
RETURNS boolean AS $$
DECLARE
  user_role_val text;
  has_profile boolean := false;
  has_role_data boolean := false;
BEGIN
  SELECT role::text INTO user_role_val FROM public.users WHERE id = auth.uid();
  
  -- Check if user profile exists
  SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE user_id = auth.uid()) INTO has_profile;
  
  -- Check role-specific data
  CASE user_role_val
    WHEN 'supplier' THEN
      SELECT EXISTS(SELECT 1 FROM public.suppliers WHERE user_id = auth.uid()) INTO has_role_data;
    WHEN 'reseller' THEN
      SELECT EXISTS(SELECT 1 FROM public.resellers WHERE user_id = auth.uid()) INTO has_role_data;
    WHEN 'client' THEN
      has_role_data := true; -- Clients don't need additional setup
    ELSE
      has_role_data := true; -- Staff roles don't need additional setup
  END CASE;
  
  RETURN has_profile AND has_role_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;