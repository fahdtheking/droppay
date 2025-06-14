-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- Comprehensive security implementation for DropPay
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER MANAGEMENT POLICIES
-- =============================================

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data (except role and security fields)
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        OLD.role = NEW.role AND -- Cannot change role
        OLD.is_verified = NEW.is_verified -- Cannot change verification status
    );

-- Allow user registration
CREATE POLICY "Users can insert own data during registration" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User profiles
CREATE POLICY "Users can manage own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User sessions
CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- SUPPLIER POLICIES
-- =============================================

-- Suppliers can read their own data
CREATE POLICY "Suppliers can read own data" ON suppliers
    FOR SELECT USING (auth.uid() = user_id);

-- Suppliers can update their own data (except status)
CREATE POLICY "Suppliers can update own data" ON suppliers
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id AND
        OLD.status = NEW.status -- Cannot change approval status
    );

-- Allow supplier registration
CREATE POLICY "Suppliers can insert own data" ON suppliers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can manage all suppliers
CREATE POLICY "Admins can manage suppliers" ON suppliers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- PRODUCT POLICIES
-- =============================================

-- Products are readable by all authenticated users
CREATE POLICY "Products are readable by authenticated users" ON products
    FOR SELECT TO authenticated USING (true);

-- Suppliers can manage their own products
CREATE POLICY "Suppliers can manage own products" ON products
    FOR ALL USING (
        supplier_id IN (
            SELECT id FROM suppliers WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        supplier_id IN (
            SELECT id FROM suppliers WHERE user_id = auth.uid()
        )
    );

-- Product variants follow same rules as products
CREATE POLICY "Product variants readable by authenticated users" ON product_variants
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Suppliers can manage own product variants" ON product_variants
    FOR ALL USING (
        product_id IN (
            SELECT p.id FROM products p
            JOIN suppliers s ON p.supplier_id = s.id
            WHERE s.user_id = auth.uid()
        )
    );

-- Categories are readable by all
CREATE POLICY "Categories are readable by all" ON categories
    FOR SELECT TO authenticated USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- RESELLER POLICIES
-- =============================================

-- Resellers can read their own data
CREATE POLICY "Resellers can read own data" ON resellers
    FOR SELECT USING (auth.uid() = user_id);

-- Resellers can update their own data (except performance metrics)
CREATE POLICY "Resellers can update own data" ON resellers
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id AND
        OLD.total_sales = NEW.total_sales AND
        OLD.total_commission = NEW.total_commission AND
        OLD.performance_tier = NEW.performance_tier
    );

-- Allow reseller registration
CREATE POLICY "Resellers can insert own data" ON resellers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Team management
CREATE POLICY "Team leaders can manage their teams" ON reseller_teams
    FOR ALL USING (
        leader_id IN (
            SELECT id FROM resellers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can read their teams" ON reseller_teams
    FOR SELECT USING (
        id IN (
            SELECT tm.team_id FROM team_memberships tm
            JOIN resellers r ON tm.reseller_id = r.id
            WHERE r.user_id = auth.uid()
        )
    );

-- Team memberships
CREATE POLICY "Users can read own team memberships" ON team_memberships
    FOR SELECT USING (
        reseller_id IN (
            SELECT id FROM resellers WHERE user_id = auth.uid()
        )
    );

-- =============================================
-- ORDER POLICIES
-- =============================================

-- Orders are visible to related parties
CREATE POLICY "Orders visible to related parties" ON orders
    FOR SELECT USING (
        auth.uid() = client_id OR
        supplier_id IN (
            SELECT id FROM suppliers WHERE user_id = auth.uid()
        ) OR
        reseller_id IN (
            SELECT id FROM resellers WHERE user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'support')
        )
    );

-- Clients can create orders
CREATE POLICY "Clients can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Suppliers can update order status
CREATE POLICY "Suppliers can update order status" ON orders
    FOR UPDATE USING (
        supplier_id IN (
            SELECT id FROM suppliers WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        supplier_id IN (
            SELECT id FROM suppliers WHERE user_id = auth.uid()
        )
    );

-- Order items follow order visibility rules
CREATE POLICY "Order items visible to order parties" ON order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM orders WHERE
            auth.uid() = client_id OR
            supplier_id IN (
                SELECT id FROM suppliers WHERE user_id = auth.uid()
            ) OR
            reseller_id IN (
                SELECT id FROM resellers WHERE user_id = auth.uid()
            )
        )
    );

-- =============================================
-- COMMISSION POLICIES
-- =============================================

-- Resellers can see their own commissions
CREATE POLICY "Resellers can see own commissions" ON commissions
    FOR SELECT USING (
        reseller_id IN (
            SELECT id FROM resellers WHERE user_id = auth.uid()
        )
    );

-- Suppliers can see commissions for their products
CREATE POLICY "Suppliers can see product commissions" ON commissions
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM orders WHERE supplier_id IN (
                SELECT id FROM suppliers WHERE user_id = auth.uid()
            )
        )
    );

-- System can create commissions
CREATE POLICY "System can create commissions" ON commissions
    FOR INSERT WITH CHECK (true);

-- Payouts
CREATE POLICY "Resellers can see own payouts" ON payouts
    FOR SELECT USING (
        reseller_id IN (
            SELECT id FROM resellers WHERE user_id = auth.uid()
        )
    );

-- =============================================
-- MARKETING POLICIES
-- =============================================

-- Campaigns
CREATE POLICY "Resellers can manage own campaigns" ON campaigns
    FOR ALL USING (
        reseller_id IN (
            SELECT id FROM resellers WHERE user_id = auth.uid()
        )
    );

-- Team campaigns
CREATE POLICY "Team members can read team campaigns" ON campaigns
    FOR SELECT USING (
        team_id IN (
            SELECT tm.team_id FROM team_memberships tm
            JOIN resellers r ON tm.reseller_id = r.id
            WHERE r.user_id = auth.uid()
        )
    );

-- Tracking links
CREATE POLICY "Resellers can manage own tracking links" ON tracking_links
    FOR ALL USING (
        reseller_id IN (
            SELECT id FROM resellers WHERE user_id = auth.uid()
        )
    );

-- Link analytics
CREATE POLICY "Resellers can see own link analytics" ON link_analytics
    FOR SELECT USING (
        tracking_link_id IN (
            SELECT tl.id FROM tracking_links tl
            JOIN resellers r ON tl.reseller_id = r.id
            WHERE r.user_id = auth.uid()
        )
    );

-- =============================================
-- AI/ML POLICIES
-- =============================================

-- AI agents are readable by all authenticated users
CREATE POLICY "AI agents readable by authenticated users" ON ai_agents
    FOR SELECT TO authenticated USING (is_active = true);

-- Only admins can manage AI agents
CREATE POLICY "Admins can manage AI agents" ON ai_agents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- AI interactions
CREATE POLICY "Users can see own AI interactions" ON ai_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI interactions" ON ai_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- ANALYTICS POLICIES
-- =============================================

-- Users can see their own analytics
CREATE POLICY "Users can see own analytics" ON analytics_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create analytics events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Daily metrics - role-based access
CREATE POLICY "Role-based daily metrics access" ON daily_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'analyst')
        ) OR
        entity_id = auth.uid()
    );

-- =============================================
-- BLOCKCHAIN POLICIES
-- =============================================

-- Users can see their own blockchain transactions
CREATE POLICY "Users can see own blockchain transactions" ON blockchain_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Digital assets
CREATE POLICY "Users can manage own digital assets" ON digital_assets
    FOR ALL USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- =============================================
-- NOTIFICATION POLICIES
-- =============================================

-- Users can manage their own notifications
CREATE POLICY "Users can manage own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- SYSTEM POLICIES
-- =============================================

-- Public system settings are readable by all
CREATE POLICY "Public settings readable by all" ON system_settings
    FOR SELECT TO authenticated USING (is_public = true);

-- Private settings only for admins
CREATE POLICY "Private settings for admins only" ON system_settings
    FOR SELECT USING (
        is_public = true OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can modify system settings
CREATE POLICY "Admins can manage system settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );