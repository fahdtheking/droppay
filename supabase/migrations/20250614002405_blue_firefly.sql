-- =============================================
-- PERFORMANCE OPTIMIZATION STRATEGIES
-- Advanced indexing and query optimization for DropPay
-- =============================================

-- =============================================
-- COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =============================================

-- User authentication and security
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_active 
ON users(email, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_verified 
ON users(role, is_verified) WHERE is_verified = true;

-- Product search and filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_supplier_status_featured 
ON products(supplier_id, status, is_featured) WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_price 
ON products(category_id, price) WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_created_featured 
ON products(created_at DESC, is_featured) WHERE status = 'active';

-- Order management and reporting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_supplier_status_date 
ON orders(supplier_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_reseller_status_date 
ON orders(reseller_id, status, created_at DESC) WHERE reseller_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_client_payment_date 
ON orders(client_id, payment_status, created_at DESC);

-- Commission tracking and payouts
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_reseller_status_date 
ON commissions(reseller_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_type_status_amount 
ON commissions(type, status, amount DESC) WHERE status = 'approved';

-- Analytics and performance tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_type_user_date 
ON analytics_events(event_type, user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tracking_links_reseller_active_performance 
ON tracking_links(reseller_id, is_active, conversions DESC) WHERE is_active = true;

-- =============================================
-- PARTIAL INDEXES FOR SPECIFIC CONDITIONS
-- =============================================

-- Active products only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active_inventory 
ON products(inventory_quantity) WHERE status = 'active' AND inventory_quantity > 0;

-- Pending orders
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_pending_created 
ON orders(created_at DESC) WHERE status IN ('pending', 'processing');

-- Unpaid commissions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_unpaid_amount 
ON commissions(amount DESC, created_at) WHERE status IN ('pending', 'approved');

-- Active campaigns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_active_performance 
ON campaigns(performance_metrics) WHERE status = 'active';

-- =============================================
-- FULL-TEXT SEARCH INDEXES
-- =============================================

-- Product search with weights
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_fulltext_weighted 
ON products USING gin(
    setweight(to_tsvector('english', name), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(brand, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(tags, ' ')), 'D')
);

-- Supplier search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_suppliers_fulltext 
ON suppliers USING gin(
    to_tsvector('english', company_name || ' ' || COALESCE(description, ''))
);

-- =============================================
-- JSONB INDEXES FOR FLEXIBLE QUERIES
-- =============================================

-- Product features and specifications
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_features_gin 
ON products USING gin(features);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_specifications_gin 
ON products USING gin(specifications);

-- User preferences
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_preferences_gin 
ON user_profiles USING gin(preferences);

-- AI insights and analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_interactions_input_gin 
ON ai_interactions USING gin(input_data);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_properties_gin 
ON analytics_events USING gin(properties);

-- =============================================
-- EXPRESSION INDEXES
-- =============================================

-- Order total calculations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_total_with_tax 
ON orders((total_amount + tax_amount));

-- Commission rates
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_effective_commission 
ON products(COALESCE(commission_rate, 15.0)) WHERE status = 'active';

-- Product profit margins
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_profit_margin 
ON products(((price - COALESCE(cost, 0)) / price)) WHERE price > 0;

-- =============================================
-- COVERING INDEXES
-- =============================================

-- Product listing with all needed fields
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_listing_covering 
ON products(category_id, status, created_at DESC) 
INCLUDE (id, name, price, images, is_featured);

-- Order summary covering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_summary_covering 
ON orders(client_id, created_at DESC) 
INCLUDE (id, order_number, status, total_amount, payment_status);

-- Commission summary covering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_summary_covering 
ON commissions(reseller_id, status, created_at DESC) 
INCLUDE (id, amount, type, order_id);

-- =============================================
-- MATERIALIZED VIEWS FOR COMPLEX AGGREGATIONS
-- =============================================

-- Daily sales summary
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_sales_summary AS
SELECT 
    DATE(created_at) as sale_date,
    supplier_id,
    COUNT(*) as order_count,
    SUM(total_amount) as total_sales,
    SUM(commission_amount) as total_commissions,
    AVG(total_amount) as avg_order_value
FROM orders 
WHERE status NOT IN ('cancelled', 'refunded')
GROUP BY DATE(created_at), supplier_id;

CREATE UNIQUE INDEX ON daily_sales_summary(sale_date, supplier_id);

-- Reseller performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS reseller_performance_summary AS
SELECT 
    r.id as reseller_id,
    r.user_id,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.total_amount) as total_sales,
    SUM(c.amount) as total_commissions,
    AVG(o.total_amount) as avg_order_value,
    COUNT(DISTINCT tl.id) as active_links,
    SUM(tl.clicks) as total_clicks,
    SUM(tl.conversions) as total_conversions,
    CASE 
        WHEN SUM(tl.clicks) > 0 
        THEN SUM(tl.conversions)::decimal / SUM(tl.clicks) 
        ELSE 0 
    END as conversion_rate
FROM resellers r
LEFT JOIN orders o ON r.id = o.reseller_id
LEFT JOIN commissions c ON r.id = c.reseller_id AND c.status = 'paid'
LEFT JOIN tracking_links tl ON r.id = tl.reseller_id AND tl.is_active = true
GROUP BY r.id, r.user_id;

CREATE UNIQUE INDEX ON reseller_performance_summary(reseller_id);

-- Product performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS product_performance_summary AS
SELECT 
    p.id as product_id,
    p.supplier_id,
    p.category_id,
    COUNT(DISTINCT oi.order_id) as total_orders,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.total_price) as total_revenue,
    AVG(oi.unit_price) as avg_selling_price,
    COUNT(DISTINCT tl.id) as tracking_links_count,
    SUM(tl.clicks) as total_clicks,
    SUM(tl.conversions) as total_conversions,
    p.view_count,
    CASE 
        WHEN p.view_count > 0 
        THEN COUNT(DISTINCT oi.order_id)::decimal / p.view_count 
        ELSE 0 
    END as view_to_order_rate
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN tracking_links tl ON p.id = tl.product_id
WHERE p.status = 'active'
GROUP BY p.id, p.supplier_id, p.category_id, p.view_count;

CREATE UNIQUE INDEX ON product_performance_summary(product_id);

-- =============================================
-- REFRESH FUNCTIONS FOR MATERIALIZED VIEWS
-- =============================================

CREATE OR REPLACE FUNCTION refresh_daily_sales_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_summary;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_performance_summaries()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY reseller_performance_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_performance_summary;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- AUTOMATED REFRESH SCHEDULING
-- =============================================

-- Note: In production, use pg_cron or external scheduler
-- Example cron jobs:
-- Daily at 2 AM: SELECT refresh_daily_sales_summary();
-- Hourly: SELECT refresh_performance_summaries();

-- =============================================
-- QUERY OPTIMIZATION FUNCTIONS
-- =============================================

-- Efficient product search function
CREATE OR REPLACE FUNCTION search_products(
    search_term text DEFAULT '',
    category_filter uuid DEFAULT NULL,
    supplier_filter uuid DEFAULT NULL,
    min_price decimal DEFAULT NULL,
    max_price decimal DEFAULT NULL,
    limit_count integer DEFAULT 20,
    offset_count integer DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    name text,
    price decimal,
    images jsonb,
    supplier_name text,
    category_name text,
    rank real
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.price,
        p.images,
        s.company_name as supplier_name,
        c.name as category_name,
        CASE 
            WHEN search_term = '' THEN 1.0
            ELSE ts_rank(
                setweight(to_tsvector('english', p.name), 'A') ||
                setweight(to_tsvector('english', COALESCE(p.description, '')), 'B'),
                plainto_tsquery('english', search_term)
            )
        END as rank
    FROM products p
    JOIN suppliers s ON p.supplier_id = s.id
    JOIN categories c ON p.category_id = c.id
    WHERE 
        p.status = 'active'
        AND p.inventory_quantity > 0
        AND (search_term = '' OR (
            setweight(to_tsvector('english', p.name), 'A') ||
            setweight(to_tsvector('english', COALESCE(p.description, '')), 'B')
        ) @@ plainto_tsquery('english', search_term))
        AND (category_filter IS NULL OR p.category_id = category_filter)
        AND (supplier_filter IS NULL OR p.supplier_id = supplier_filter)
        AND (min_price IS NULL OR p.price >= min_price)
        AND (max_price IS NULL OR p.price <= max_price)
    ORDER BY 
        CASE WHEN search_term = '' THEN p.is_featured::int ELSE 0 END DESC,
        rank DESC,
        p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Efficient commission calculation function
CREATE OR REPLACE FUNCTION calculate_reseller_earnings(
    reseller_uuid uuid,
    start_date date DEFAULT NULL,
    end_date date DEFAULT NULL
)
RETURNS TABLE (
    total_sales decimal,
    total_commissions decimal,
    pending_commissions decimal,
    paid_commissions decimal,
    order_count bigint,
    avg_order_value decimal
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(o.total_amount), 0) as total_sales,
        COALESCE(SUM(c.amount), 0) as total_commissions,
        COALESCE(SUM(CASE WHEN c.status IN ('pending', 'approved') THEN c.amount ELSE 0 END), 0) as pending_commissions,
        COALESCE(SUM(CASE WHEN c.status = 'paid' THEN c.amount ELSE 0 END), 0) as paid_commissions,
        COUNT(DISTINCT o.id) as order_count,
        CASE 
            WHEN COUNT(DISTINCT o.id) > 0 
            THEN SUM(o.total_amount) / COUNT(DISTINCT o.id)
            ELSE 0 
        END as avg_order_value
    FROM resellers r
    LEFT JOIN orders o ON r.id = o.reseller_id
    LEFT JOIN commissions c ON r.id = c.reseller_id
    WHERE 
        r.id = reseller_uuid
        AND (start_date IS NULL OR DATE(o.created_at) >= start_date)
        AND (end_date IS NULL OR DATE(o.created_at) <= end_date);
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================
-- MONITORING AND MAINTENANCE
-- =============================================

-- Index usage monitoring view
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan,
    CASE 
        WHEN idx_scan = 0 THEN 'UNUSED'
        WHEN idx_scan < 100 THEN 'LOW_USAGE'
        WHEN idx_scan < 1000 THEN 'MEDIUM_USAGE'
        ELSE 'HIGH_USAGE'
    END as usage_category
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Table size monitoring
CREATE OR REPLACE VIEW table_size_stats AS
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_tuples,
    n_dead_tup as dead_tuples
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Slow query monitoring function
CREATE OR REPLACE FUNCTION get_slow_queries(min_duration interval DEFAULT '1 second')
RETURNS TABLE (
    query text,
    calls bigint,
    total_time double precision,
    mean_time double precision,
    max_time double precision,
    stddev_time double precision
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pss.query,
        pss.calls,
        pss.total_exec_time as total_time,
        pss.mean_exec_time as mean_time,
        pss.max_exec_time as max_time,
        pss.stddev_exec_time as stddev_time
    FROM pg_stat_statements pss
    WHERE pss.mean_exec_time > EXTRACT(EPOCH FROM min_duration) * 1000
    ORDER BY pss.mean_exec_time DESC;
END;
$$ LANGUAGE plpgsql;