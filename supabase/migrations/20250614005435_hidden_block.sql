/*
  # Materialized Views for Performance

  1. Daily Sales Summary
  2. Supplier Performance Summary
  3. Reseller Performance Summary
  4. Product Performance Summary
  5. Team Performance Summary
*/

-- Daily sales summary materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_sales_summary AS
SELECT 
  DATE(o.created_at) as sale_date,
  COUNT(DISTINCT o.id) as total_orders,
  COUNT(DISTINCT o.client_id) as unique_customers,
  COUNT(DISTINCT o.supplier_id) as active_suppliers,
  COUNT(DISTINCT o.reseller_id) as active_resellers,
  SUM(o.total_amount) as total_revenue,
  AVG(o.total_amount) as avg_order_value,
  SUM(c.amount) as total_commissions_paid
FROM orders o
LEFT JOIN commissions c ON o.id = c.order_id
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY DATE(o.created_at)
ORDER BY sale_date DESC;

-- Create unique index for materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_sales_summary_date 
ON daily_sales_summary (sale_date);

-- Supplier performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS supplier_performance_summary AS
SELECT 
  s.id as supplier_id,
  s.company_name,
  s.store_url,
  s.status,
  s.commission_rate,
  COUNT(DISTINCT p.id) as total_products,
  COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_products,
  COUNT(DISTINCT o.id) as total_orders,
  SUM(o.total_amount) as total_revenue,
  AVG(o.total_amount) as avg_order_value,
  COUNT(DISTINCT o.client_id) as unique_customers,
  COUNT(DISTINCT c.reseller_id) as active_resellers,
  SUM(c.amount) as total_commission_paid,
  s.created_at,
  s.updated_at
FROM suppliers s
LEFT JOIN products p ON s.id = p.supplier_id
LEFT JOIN orders o ON s.id = o.supplier_id AND o.status NOT IN ('cancelled', 'refunded')
LEFT JOIN commissions c ON o.id = c.order_id AND c.status = 'paid'
GROUP BY s.id, s.company_name, s.store_url, s.status, s.commission_rate, s.created_at, s.updated_at;

-- Create unique index for supplier performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_performance_summary_id 
ON supplier_performance_summary (supplier_id);

-- Reseller performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS reseller_performance_summary AS
SELECT 
  r.id as reseller_id,
  u.name as reseller_name,
  r.referral_code,
  r.performance_tier,
  r.reseller_type,
  COUNT(DISTINCT c.order_id) as total_orders,
  SUM(c.amount) as total_commissions,
  SUM(oi.total_price) as total_sales_value,
  COUNT(DISTINCT o.client_id) as unique_customers,
  COUNT(DISTINCT tl.id) as tracking_links_created,
  SUM(tl.clicks) as total_clicks,
  SUM(tl.conversions) as total_conversions,
  CASE 
    WHEN SUM(tl.clicks) > 0 THEN (SUM(tl.conversions)::decimal / SUM(tl.clicks)) * 100
    ELSE 0
  END as conversion_rate,
  r.created_at,
  r.updated_at
FROM resellers r
JOIN users u ON r.user_id = u.id
LEFT JOIN commissions c ON r.id = c.reseller_id AND c.status = 'paid'
LEFT JOIN orders o ON c.order_id = o.id
LEFT JOIN order_items oi ON c.order_item_id = oi.id
LEFT JOIN tracking_links tl ON r.id = tl.reseller_id
GROUP BY r.id, u.name, r.referral_code, r.performance_tier, r.reseller_type, r.created_at, r.updated_at;

-- Create unique index for reseller performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_reseller_performance_summary_id 
ON reseller_performance_summary (reseller_id);

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
  p.status,
  COUNT(DISTINCT oi.order_id) as total_orders,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.total_price) as total_revenue,
  COUNT(DISTINCT o.client_id) as unique_customers,
  COUNT(DISTINCT tl.id) as tracking_links,
  SUM(tl.clicks) as total_clicks,
  p.inventory_quantity,
  p.created_at,
  p.updated_at
FROM products p
JOIN suppliers s ON p.supplier_id = s.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status NOT IN ('cancelled', 'refunded')
LEFT JOIN tracking_links tl ON p.id = tl.product_id
GROUP BY p.id, p.name, p.sku, p.price, p.commission_rate, s.company_name, c.name, p.status, p.inventory_quantity, p.created_at, p.updated_at;

-- Create unique index for product performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_performance_summary_id 
ON product_performance_summary (product_id);

-- Team performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS team_performance_summary AS
SELECT 
  rt.id as team_id,
  rt.name as team_name,
  rt.leader_id,
  lu.name as leader_name,
  COUNT(DISTINCT tm.reseller_id) as total_members,
  SUM(r.total_sales) as combined_sales,
  SUM(r.total_commission) as combined_commissions,
  AVG(r.total_sales) as avg_member_sales,
  COUNT(DISTINCT c.order_id) as total_team_orders,
  rt.created_at,
  rt.updated_at
FROM reseller_teams rt
LEFT JOIN resellers lr ON rt.leader_id = lr.id
LEFT JOIN users lu ON lr.user_id = lu.id
LEFT JOIN team_memberships tm ON rt.id = tm.team_id
LEFT JOIN resellers r ON tm.reseller_id = r.id
LEFT JOIN commissions c ON r.id = c.reseller_id AND c.status = 'paid'
GROUP BY rt.id, rt.name, rt.leader_id, lu.name, rt.created_at, rt.updated_at;

-- Create unique index for team performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_team_performance_summary_id 
ON team_performance_summary (team_id);

-- Functions to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_daily_sales_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_summary;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_performance_summaries()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY supplier_performance_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY reseller_performance_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_performance_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY team_performance_summary;
END;
$$ LANGUAGE plpgsql;

-- Initial refresh of all materialized views
SELECT refresh_daily_sales_summary();
SELECT refresh_performance_summaries();