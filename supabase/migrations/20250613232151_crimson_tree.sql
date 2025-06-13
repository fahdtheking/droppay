-- DropPay Platform Seed Data
-- Initial data for development and testing

-- =============================================
-- SYSTEM SETTINGS
-- =============================================

INSERT INTO system_settings (key, value, description, is_public) VALUES
('platform_name', '"DropPay"', 'Platform name', true),
('default_currency', '"USD"', 'Default platform currency', true),
('default_commission_rate', '15.0', 'Default commission rate percentage', false),
('platform_fee_rate', '2.5', 'Platform fee percentage', false),
('minimum_payout_amount', '50.0', 'Minimum amount for payouts', false),
('supported_currencies', '["USD", "EUR", "GBP", "CAD", "AUD"]', 'Supported currencies', true),
('supported_countries', '["US", "UK", "CA", "AU", "DE", "FR", "JP", "SG"]', 'Supported countries', true);

-- =============================================
-- CATEGORIES
-- =============================================

INSERT INTO categories (id, name, slug, description, commission_rate) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Electronics', 'electronics', 'Electronic devices and gadgets', 12.0),
('550e8400-e29b-41d4-a716-446655440002', 'Fashion', 'fashion', 'Clothing and accessories', 18.0),
('550e8400-e29b-41d4-a716-446655440003', 'Home & Garden', 'home-garden', 'Home improvement and garden supplies', 14.0),
('550e8400-e29b-41d4-a716-446655440004', 'Health & Beauty', 'health-beauty', 'Health and beauty products', 16.0),
('550e8400-e29b-41d4-a716-446655440005', 'Sports & Outdoors', 'sports-outdoors', 'Sports and outdoor equipment', 13.0),
('550e8400-e29b-41d4-a716-446655440006', 'Books & Media', 'books-media', 'Books, movies, and digital media', 10.0),
('550e8400-e29b-41d4-a716-446655440007', 'Automotive', 'automotive', 'Car parts and accessories', 11.0),
('550e8400-e29b-41d4-a716-446655440008', 'Software & SaaS', 'software-saas', 'Software and digital services', 25.0);

-- Electronics subcategories
INSERT INTO categories (id, name, slug, description, parent_id, commission_rate) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'Smartphones', 'smartphones', 'Mobile phones and accessories', '550e8400-e29b-41d4-a716-446655440001', 10.0),
('550e8400-e29b-41d4-a716-446655440012', 'Audio', 'audio', 'Headphones, speakers, and audio equipment', '550e8400-e29b-41d4-a716-446655440001', 15.0),
('550e8400-e29b-41d4-a716-446655440013', 'Computers', 'computers', 'Laptops, desktops, and accessories', '550e8400-e29b-41d4-a716-446655440001', 8.0);

-- =============================================
-- DEMO USERS
-- =============================================

-- Admin user
INSERT INTO users (id, email, password_hash, name, role, is_verified, email_verified_at) VALUES
('550e8400-e29b-41d4-a716-446655440100', 'admin@droppay.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlJO', 'Admin User', 'admin', true, CURRENT_TIMESTAMP);

-- Supplier user
INSERT INTO users (id, email, password_hash, name, role, is_verified, email_verified_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'supplier@techcorp.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlJO', 'TechCorp Electronics', 'supplier', true, CURRENT_TIMESTAMP);

-- Client users
INSERT INTO users (id, email, password_hash, name, role, is_verified, email_verified_at) VALUES
('550e8400-e29b-41d4-a716-446655440102', 'john@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlJO', 'John Smith', 'client', true, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440103', 'jane@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlJO', 'Jane Doe', 'client', true, CURRENT_TIMESTAMP);

-- Reseller users
INSERT INTO users (id, email, password_hash, name, role, is_verified, email_verified_at) VALUES
('550e8400-e29b-41d4-a716-446655440104', 'sarah@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlJO', 'Sarah Johnson', 'reseller', true, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440105', 'mike@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlJO', 'Mike Chen', 'reseller', true, CURRENT_TIMESTAMP);

-- =============================================
-- USER PROFILES
-- =============================================

INSERT INTO user_profiles (user_id, country, currency, address, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'US', 'USD', 
 '{"street": "123 Tech Street", "city": "San Francisco", "state": "CA", "zip": "94105", "country": "US"}',
 '{"notifications": {"email": true, "sms": false}, "language": "en"}'),
('550e8400-e29b-41d4-a716-446655440102', 'US', 'USD',
 '{"street": "456 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "US"}',
 '{"notifications": {"email": true, "sms": true}, "language": "en"}'),
('550e8400-e29b-41d4-a716-446655440104', 'US', 'USD',
 '{"street": "789 Business Ave", "city": "Chicago", "state": "IL", "zip": "60601", "country": "US"}',
 '{"notifications": {"email": true, "sms": true}, "language": "en"}');

-- =============================================
-- SUPPLIERS
-- =============================================

INSERT INTO suppliers (id, user_id, company_name, legal_name, tax_id, store_url, store_name, description, commission_rate, status) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 
 'TechCorp Electronics', 'TechCorp Electronics LLC', 'TC123456789', 'techcorp', 'TechCorp Store',
 'Premium electronics and gadgets for modern lifestyle', 15.0, 'approved');

-- =============================================
-- RESELLERS
-- =============================================

INSERT INTO resellers (id, user_id, reseller_type, referral_code, performance_tier, total_sales, total_commission) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440104', 'team_leader', 'SARAH2024', 'gold', 45680.00, 6852.00),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440105', 'solo', 'MIKE2024', 'silver', 28450.00, 4267.50);

-- =============================================
-- PRODUCTS
-- =============================================

INSERT INTO products (id, supplier_id, category_id, sku, name, description, price, cost, commission_rate, inventory_quantity, images, features, status) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440012',
 'WBH-001', 'Wireless Bluetooth Headphones', 
 'Premium wireless headphones with active noise cancellation and superior sound quality. Perfect for music lovers and professionals.',
 89.99, 45.00, 15.0, 245,
 '["https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg"]',
 '["Noise Cancelling", "Wireless", "20hr Battery", "Quick Charge", "Premium Sound"]',
 'active'),

('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440004',
 'SFT-002', 'Smart Fitness Tracker',
 'Advanced fitness tracker with comprehensive health monitoring features including heart rate, GPS, and waterproof design.',
 129.99, 65.00, 20.0, 89,
 '["https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg"]',
 '["Heart Rate Monitor", "GPS", "Waterproof", "Sleep Tracking", "7-day Battery"]',
 'active'),

('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440001',
 'PPC-003', 'Portable Phone Charger',
 'High-capacity portable charger with fast charging technology and LED display showing remaining power.',
 34.99, 18.00, 12.0, 156,
 '["https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg"]',
 '["Fast Charging", "Compact", "LED Display", "10000mAh", "Universal Compatibility"]',
 'active');

-- =============================================
-- TEAMS
-- =============================================

INSERT INTO reseller_teams (id, name, leader_id, description, invite_code) VALUES
('550e8400-e29b-41d4-a716-446655440501', 'Alpha Sellers', '550e8400-e29b-41d4-a716-446655440301', 
 'High-performing sales team focused on electronics and tech products', 'ALPHA2024');

INSERT INTO team_memberships (team_id, reseller_id, role) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440301', 'leader'),
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440302', 'member');

-- =============================================
-- TRACKING LINKS
-- =============================================

INSERT INTO tracking_links (id, reseller_id, product_id, link_code, full_url, clicks, conversions) VALUES
('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440401',
 'SARAH-WBH001', 'https://droppay.com/store/techcorp/wireless-bluetooth-headphones?ref=SARAH-WBH001', 245, 12),
('550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440402',
 'MIKE-SFT002', 'https://droppay.com/store/techcorp/smart-fitness-tracker?ref=MIKE-SFT002', 189, 8);

-- =============================================
-- SAMPLE ORDERS
-- =============================================

INSERT INTO orders (id, order_number, client_id, supplier_id, reseller_id, status, subtotal, total_amount, payment_status, payment_method, shipping_address) VALUES
('550e8400-e29b-41d4-a716-446655440701', 'ORD-2024-000001', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440301',
 'delivered', 124.98, 124.98, 'paid', 'credit_card',
 '{"street": "456 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "US"}'),

('550e8400-e29b-41d4-a716-446655440702', 'ORD-2024-000002', '550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440302',
 'shipped', 129.99, 129.99, 'paid', 'paypal',
 '{"street": "789 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "US"}');

-- =============================================
-- ORDER ITEMS
-- =============================================

INSERT INTO order_items (id, order_id, product_id, product_name, product_sku, quantity, unit_price, total_price, commission_rate, commission_amount) VALUES
('550e8400-e29b-41d4-a716-446655440801', '550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440401',
 'Wireless Bluetooth Headphones', 'WBH-001', 1, 89.99, 89.99, 15.0, 13.50),
('550e8400-e29b-41d4-a716-446655440802', '550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440403',
 'Portable Phone Charger', 'PPC-003', 1, 34.99, 34.99, 12.0, 4.20),
('550e8400-e29b-41d4-a716-446655440803', '550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440402',
 'Smart Fitness Tracker', 'SFT-002', 1, 129.99, 129.99, 20.0, 26.00);

-- =============================================
-- COMMISSIONS
-- =============================================

INSERT INTO commissions (id, reseller_id, order_id, order_item_id, amount, rate, status, type) VALUES
('550e8400-e29b-41d4-a716-446655440901', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440801',
 13.50, 15.0, 'paid', 'sale'),
('550e8400-e29b-41d4-a716-446655440902', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440802',
 4.20, 12.0, 'paid', 'sale'),
('550e8400-e29b-41d4-a716-446655440903', '550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440803',
 26.00, 20.0, 'approved', 'sale');

-- =============================================
-- AI AGENTS
-- =============================================

INSERT INTO ai_agents (id, name, type, description, configuration, usage_stats) VALUES
('550e8400-e29b-41d4-a716-446655441001', 'Jarvis Home AI', 'jarvis_home', 'Main platform assistant for navigation and general help',
 '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 500}',
 '{"total_interactions": 15420, "avg_response_time": 1.2, "satisfaction_rate": 4.8}'),

('550e8400-e29b-41d4-a716-446655441002', 'Verify Supplier AI', 'verify_supplier', 'Document verification and compliance checking for suppliers',
 '{"model": "gpt-4", "temperature": 0.3, "max_tokens": 1000}',
 '{"documents_processed": 234, "accuracy_rate": 0.96, "avg_processing_time": 45}'),

('550e8400-e29b-41d4-a716-446655441003', 'Product Discovery AI', 'product_discovery', 'Helps resellers find profitable products and optimize strategies',
 '{"model": "gpt-4", "temperature": 0.6, "max_tokens": 800}',
 '{"recommendations_made": 8920, "conversion_rate": 0.23, "user_satisfaction": 4.6}');

-- =============================================
-- SAMPLE NOTIFICATIONS
-- =============================================

INSERT INTO notifications (id, user_id, type, title, message, data) VALUES
('550e8400-e29b-41d4-a716-446655441101', '550e8400-e29b-41d4-a716-446655440104', 'commission_earned', 
 'Commission Earned!', 'You earned $13.50 commission from order ORD-2024-000001',
 '{"order_id": "550e8400-e29b-41d4-a716-446655440701", "amount": 13.50}'),

('550e8400-e29b-41d4-a716-446655441102', '550e8400-e29b-41d4-a716-446655440102', 'order_status',
 'Order Shipped', 'Your order ORD-2024-000001 has been shipped and is on its way!',
 '{"order_id": "550e8400-e29b-41d4-a716-446655440701", "tracking": "TRK123456789"}');