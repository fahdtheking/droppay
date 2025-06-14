# DropPay Database Migration Guide

## Overview
This guide provides step-by-step instructions for implementing the optimized DropPay database schema, security policies, and performance enhancements.

## Prerequisites
- PostgreSQL 14+ with required extensions
- Supabase project with admin access
- Database backup before migration

## Migration Steps

### Phase 1: Schema Updates (30-45 minutes)

1. **Enable Required Extensions**
```sql
-- Run in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
```

2. **Apply Schema Changes**
```bash
# Execute schema-optimization.sql
# This will create/update all tables, enums, and basic indexes
```

3. **Verify Schema**
```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify foreign key constraints
SELECT * FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY';
```

### Phase 2: Security Implementation (15-20 minutes)

1. **Apply RLS Policies**
```bash
# Execute security-policies.sql
# This enables RLS and creates all security policies
```

2. **Test Security Policies**
```sql
-- Test as different user roles
SET ROLE authenticated;
SELECT * FROM products LIMIT 5;

-- Verify RLS is working
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

3. **Setup Authentication Functions**
```bash
# Execute authentication-setup.sql
# This creates auth functions and OAuth support
```

### Phase 3: Performance Optimization (20-30 minutes)

1. **Create Performance Indexes**
```bash
# Execute performance-optimization.sql
# This creates all performance indexes and materialized views
```

2. **Monitor Index Creation**
```sql
-- Check index creation progress
SELECT 
    schemaname, 
    tablename, 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

3. **Initialize Materialized Views**
```sql
-- Refresh materialized views
SELECT refresh_daily_sales_summary();
SELECT refresh_performance_summaries();
```

### Phase 4: Data Migration (Variable time)

1. **Migrate Existing Data**
```sql
-- Update existing users table if needed
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_locked boolean DEFAULT false;

-- Migrate existing products
UPDATE products SET status = 'active' WHERE status IS NULL;
UPDATE products SET inventory_quantity = 0 WHERE inventory_quantity IS NULL;
```

2. **Create Default Categories**
```sql
-- Insert default categories
INSERT INTO categories (name, slug, commission_rate) VALUES
('Electronics', 'electronics', 12.0),
('Fashion', 'fashion', 18.0),
('Home & Garden', 'home-garden', 14.0)
ON CONFLICT (slug) DO NOTHING;
```

3. **Setup AI Agents**
```sql
-- Insert default AI agents
INSERT INTO ai_agents (name, type, description) VALUES
('Jarvis Home AI', 'jarvis_home', 'Main platform assistant'),
('Product Discovery AI', 'product_discovery', 'Product recommendation engine'),
('Growth Advisor AI', 'growth_advisor', 'Performance optimization assistant')
ON CONFLICT DO NOTHING;
```

### Phase 5: Validation & Testing (15-20 minutes)

1. **Performance Testing**
```sql
-- Test search performance
SELECT * FROM search_products('electronics', NULL, NULL, NULL, NULL, 10, 0);

-- Test commission calculations
SELECT * FROM calculate_reseller_earnings('user-uuid-here');
```

2. **Security Testing**
```sql
-- Test authentication
SELECT authenticate_user('test@example.com', 'password123');

-- Test session validation
SELECT validate_session('session-token-here');
```

3. **Data Integrity Checks**
```sql
-- Check foreign key constraints
SELECT * FROM information_schema.referential_constraints;

-- Verify triggers are working
INSERT INTO products (supplier_id, name, price, sku) 
VALUES ('supplier-uuid', 'Test Product', 99.99, 'TEST-001');
```

## Post-Migration Tasks

### 1. Update Application Code
- Update database connection strings
- Implement new authentication functions
- Add RLS policy handling
- Update queries to use new indexes

### 2. Setup Monitoring
```sql
-- Enable query monitoring
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Create monitoring views
CREATE OR REPLACE VIEW performance_dashboard AS
SELECT 
    'Active Users' as metric,
    COUNT(*) as value
FROM users WHERE is_active = true
UNION ALL
SELECT 
    'Total Products',
    COUNT(*)
FROM products WHERE status = 'active'
UNION ALL
SELECT 
    'Pending Orders',
    COUNT(*)
FROM orders WHERE status IN ('pending', 'processing');
```

### 3. Setup Automated Tasks
```sql
-- Create refresh schedule for materialized views
-- (Use pg_cron or external scheduler)

-- Daily at 2 AM UTC
SELECT cron.schedule('refresh-daily-sales', '0 2 * * *', 'SELECT refresh_daily_sales_summary();');

-- Hourly performance refresh
SELECT cron.schedule('refresh-performance', '0 * * * *', 'SELECT refresh_performance_summaries();');
```

### 4. Backup Strategy
```bash
# Setup automated backups
pg_dump -h hostname -U username -d database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Setup point-in-time recovery
# Configure WAL archiving in postgresql.conf
```

## Performance Benchmarks

### Expected Improvements
- **Product Search**: 80% faster with full-text indexes
- **Order Queries**: 60% faster with composite indexes
- **Commission Calculations**: 90% faster with materialized views
- **User Authentication**: 50% faster with optimized functions

### Monitoring Queries
```sql
-- Check slow queries
SELECT * FROM get_slow_queries('500ms');

-- Monitor index usage
SELECT * FROM index_usage_stats WHERE usage_category = 'UNUSED';

-- Check table sizes
SELECT * FROM table_size_stats LIMIT 10;
```

## Rollback Plan

### Emergency Rollback
```sql
-- Disable RLS if needed
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Drop problematic indexes
DROP INDEX CONCURRENTLY IF EXISTS idx_products_fulltext_weighted;

-- Restore from backup
-- psql -h hostname -U username -d database_name < backup_file.sql
```

### Gradual Rollback
1. Disable new features in application
2. Remove new indexes one by one
3. Restore original schema
4. Verify data integrity

## Troubleshooting

### Common Issues

1. **Index Creation Timeout**
```sql
-- Increase maintenance_work_mem
SET maintenance_work_mem = '2GB';
CREATE INDEX CONCURRENTLY ...;
```

2. **RLS Policy Conflicts**
```sql
-- Check policy conflicts
SELECT * FROM pg_policies WHERE tablename = 'table_name';

-- Temporarily disable RLS for debugging
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

3. **Performance Degradation**
```sql
-- Analyze tables after migration
ANALYZE;

-- Update table statistics
VACUUM ANALYZE;
```

### Support Contacts
- Database Team: db-team@droppay.com
- DevOps Team: devops@droppay.com
- Emergency: +1-555-DROPPAY

## Success Criteria
- [ ] All tables created successfully
- [ ] RLS policies working correctly
- [ ] Performance indexes created
- [ ] Authentication functions operational
- [ ] Materialized views refreshing
- [ ] Application connecting successfully
- [ ] Performance benchmarks met
- [ ] Security tests passing
- [ ] Backup strategy implemented
- [ ] Monitoring dashboard active