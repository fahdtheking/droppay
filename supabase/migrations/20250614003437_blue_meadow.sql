/*
  # DropPay Performance Optimization
  
  1. Strategic Indexing
    - Composite indexes for common queries
    - Partial indexes for filtered data
    - GIN indexes for full-text search
    - JSONB indexes for metadata queries
  
  2. Materialized Views
    - Pre-computed analytics
    - Performance summaries
    - Reporting data
  
  3. Query Optimization
    - Efficient functions
    - Optimized procedures
    - Performance monitoring
*/

-- =============================================
-- STRATEGIC INDEXING
-- =============================================

-- User indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login ON users(last_login_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_is_verified ON users(is_verified) WHERE is_verified = true;

-- Supplier indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_suppliers_store_url ON suppliers(store_url);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_suppliers_commission_rate ON suppliers(commission_rate);

-- Product indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_inventory ON products(inventory_quantity);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active ON products(status) WHERE status = 'active';

-- Full-text search index for products
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search_vector ON products USING GIN(search_vector);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_name_search ON products USING GIN(to_tsvector('english', name));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- Composite indexes for common product queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_supplier_status ON products(supplier_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_status ON products(category_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_status_price ON products(status, price);

-- Order indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_supplier ON orders(supplier_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_reseller ON orders(reseller_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Composite indexes for order queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_client_status ON orders(client_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_supplier_status ON orders(supplier_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_date_status ON orders(created_at, status);

-- Order items indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Commission indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_reseller ON commissions(reseller_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_created_at ON commissions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_type ON commissions(type);

-- Composite commission indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_reseller_status ON commissions(reseller_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_reseller_date ON commissions(reseller_id, created_at);

-- Reseller indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resellers_user_id ON resellers(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resellers_referral_code ON resellers(referral_code);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resellers_performance_tier ON resellers(performance_tier);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resellers_total_sales ON resellers(total_sales);

-- Team indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_team_memberships_team_id ON team_memberships(team_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_team_memberships_reseller_id ON team_memberships(reseller_id);

-- Tracking indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tracking_links_reseller ON tracking_links(reseller_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tracking_links_product ON tracking_links(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tracking_links_code ON tracking_links(link_code);

-- Analytics indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_link_analytics_tracking_link ON link_analytics(tracking_link_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_link_analytics_created_at ON link_analytics(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_link_analytics_country ON link_analytics(country);

-- Daily metrics indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_metrics_date_type ON daily_metrics(date, metric_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_metrics_entity ON daily_metrics(entity_id);

-- Notification indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- =============================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- =============================================

-- Daily sales summary
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_sales_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value,
    COUNT(DISTINCT client_id) as unique_customers,
    COUNT(DISTINCT supplier_id) as active_suppliers,
    COUNT(DISTINCT reseller_id) as active_resellers
FROM orders 
WHERE status NOT IN ('cancelled', 'refunded')
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Create unique index for materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_sales_summary_date ON daily_sales_summary(date);

-- Supplier performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS supplier_performance_summary AS
SELECT 
    s.id as supplier_id,
    s.company_name,
    COUNT(DISTINCT p.id) as total_products,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue,
    COALESCE(AVG(o.total_amount), 0) as avg_order_value,
    COUNT(DISTINCT o.client_id) as unique_customers,
    s.commission_rate,
    s.status
FROM suppliers s
LEFT JOIN products p ON s.id = p.supplier_id
LEFT JOIN orders o ON s.id = o.supplier_id AND o.status NOT IN ('cancelled', 'refunded')
GROUP BY s.id, s.company_name, s.commission_rate, s.status;

-- Create unique index for supplier performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_performance_summary_id ON supplier_performance_summary(supplier_id);

-- Reseller performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS reseller_performance_summary AS
SELECT 
    r.id as reseller_id,
    u.name as reseller_name,
    r.referral_code,
    r.performance_tier,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(c.amount), 0) as total_commissions,
    COALESCE(SUM(o.total_amount), 0) as total_sales_value,
    COUNT(DISTINCT o.client_id) as unique_customers,
    COUNT(DISTINCT tl.id) as tracking_links_created,
    COALESCE(SUM(tl.clicks), 0) as total_clicks,
    COALESCE(SUM(tl.conversions), 0) as total_conversions,
    CASE 
        WHEN SUM(tl.clicks) > 0 THEN (SUM(tl.conversions)::DECIMAL / SUM(tl.clicks) * 100)
        ELSE 0 
    END as conversion_rate
FROM resellers r
JOIN users u ON r.user_id = u.id
LEFT JOIN orders o ON r.id = o.reseller_id AND o.status NOT IN ('cancelled', 'refunded')
LEFT JOIN commissions c ON r.id = c.reseller_id AND c.status = 'paid'
LEFT JOIN tracking_links tl ON r.id = tl.reseller_id
GROUP BY r.id, u.name, r.referral_code, r.performance_tier;

-- Create unique index for reseller performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_reseller_performance_summary_id ON reseller_performance_summary(reseller_id);

-- Product performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS product_performance_summary AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.sku,
    p.price,
    p.commission_rate,
    s.company_name as supplier_name,
    c.name as category_name,
    COUNT(DISTINCT oi.id) as total_orders,
    COALESCE(SUM(oi.quantity), 0) as total_quantity_sold,
    COALESCE(SUM(oi.total_price), 0) as total_revenue,
    COUNT(DISTINCT o.client_id) as unique_customers,
    COUNT(DISTINCT tl.id) as tracking_links,
    COALESCE(SUM(tl.clicks), 0) as total_clicks,
    p.inventory_quantity,
    p.status
FROM products p
JOIN suppliers s ON p.supplier_id = s.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status NOT IN ('cancelled', 'refunded')
LEFT JOIN tracking_links tl ON p.id = tl.product_id
GROUP BY p.id, p.name, p.sku, p.price, p.commission_rate, s.company_name, c.name, p.inventory_quantity, p.status;

-- Create unique index for product performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_performance_summary_id ON product_performance_summary(product_id);

-- =============================================
-- PERFORMANCE FUNCTIONS
-- =============================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY supplier_performance_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY reseller_performance_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_performance_summary;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh daily sales summary
CREATE OR REPLACE FUNCTION refresh_daily_sales_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_summary;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh performance summaries
CREATE OR REPLACE FUNCTION refresh_performance_summaries()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY supplier_performance_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY reseller_performance_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_performance_summary;
END;
$$ LANGUAGE plpgsql;

-- Function to get reseller earnings
CREATE OR REPLACE FUNCTION calculate_reseller_earnings(reseller_uuid UUID)
RETURNS TABLE(
    total_commissions DECIMAL,
    pending_commissions DECIMAL,
    paid_commissions DECIMAL,
    this_month_commissions DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(c.amount), 0) as total_commissions,
        COALESCE(SUM(CASE WHEN c.status = 'pending' THEN c.amount ELSE 0 END), 0) as pending_commissions,
        COALESCE(SUM(CASE WHEN c.status = 'paid' THEN c.amount ELSE 0 END), 0) as paid_commissions,
        COALESCE(SUM(CASE WHEN c.status = 'paid' AND DATE_TRUNC('month', c.created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN c.amount ELSE 0 END), 0) as this_month_commissions
    FROM commissions c
    WHERE c.reseller_id = reseller_uuid;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function for product search with ranking
CREATE OR REPLACE FUNCTION search_products(
    search_query TEXT,
    category_filter UUID DEFAULT NULL,
    min_price DECIMAL DEFAULT NULL,
    max_price DECIMAL DEFAULT NULL,
    supplier_filter UUID DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    description TEXT,
    price DECIMAL,
    supplier_name TEXT,
    category_name TEXT,
    search_rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        s.company_name as supplier_name,
        c.name as category_name,
        ts_rank(p.search_vector, plainto_tsquery('english', search_query)) as search_rank
    FROM products p
    JOIN suppliers s ON p.supplier_id = s.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 
        p.status = 'active'
        AND (search_query IS NULL OR p.search_vector @@ plainto_tsquery('english', search_query))
        AND (category_filter IS NULL OR p.category_id = category_filter)
        AND (min_price IS NULL OR p.price >= min_price)
        AND (max_price IS NULL OR p.price <= max_price)
        AND (supplier_filter IS NULL OR p.supplier_id = supplier_filter)
    ORDER BY 
        CASE WHEN search_query IS NOT NULL THEN ts_rank(p.search_vector, plainto_tsquery('english', search_query)) END DESC,
        p.is_featured DESC,
        p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================
-- PERFORMANCE MONITORING
-- =============================================

-- Function to get slow queries
CREATE OR REPLACE FUNCTION get_slow_queries(threshold_duration TEXT DEFAULT '1s')
RETURNS TABLE(
    query TEXT,
    calls BIGINT,
    total_time DOUBLE PRECISION,
    mean_time DOUBLE PRECISION,
    max_time DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pg_stat_statements.query,
        pg_stat_statements.calls,
        pg_stat_statements.total_exec_time,
        pg_stat_statements.mean_exec_time,
        pg_stat_statements.max_exec_time
    FROM pg_stat_statements
    WHERE pg_stat_statements.mean_exec_time > EXTRACT(EPOCH FROM threshold_duration::INTERVAL) * 1000
    ORDER BY pg_stat_statements.mean_exec_time DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get index usage statistics
CREATE OR REPLACE FUNCTION index_usage_stats()
RETURNS TABLE(
    schemaname TEXT,
    tablename TEXT,
    indexname TEXT,
    idx_scan BIGINT,
    idx_tup_read BIGINT,
    idx_tup_fetch BIGINT,
    usage_category TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.schemaname,
        s.tablename,
        s.indexname,
        s.idx_scan,
        s.idx_tup_read,
        s.idx_tup_fetch,
        CASE 
            WHEN s.idx_scan = 0 THEN 'UNUSED'
            WHEN s.idx_scan < 100 THEN 'LOW_USAGE'
            WHEN s.idx_scan < 1000 THEN 'MEDIUM_USAGE'
            ELSE 'HIGH_USAGE'
        END as usage_category
    FROM pg_stat_user_indexes s
    WHERE s.schemaname = 'public'
    ORDER BY s.idx_scan DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get table size statistics
CREATE OR REPLACE FUNCTION table_size_stats()
RETURNS TABLE(
    schemaname TEXT,
    tablename TEXT,
    row_count BIGINT,
    total_size TEXT,
    index_size TEXT,
    table_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname::TEXT,
        tablename::TEXT,
        n_tup_ins - n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;