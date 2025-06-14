/*
  # Seed Data for DropPay Platform

  1. AI Agents
  2. System Settings
  3. Categories
  4. Demo Users
  5. Demo Suppliers
  6. Demo Products
  7. Demo Resellers and Teams
*/

-- Insert AI Agents
INSERT INTO ai_agents (name, type, description, configuration, is_active) VALUES
('Jarvis Home AI', 'jarvis_home', 'Main platform assistant providing guidance and support', '{"capabilities": ["general_assistance", "navigation", "onboarding"], "personality": "helpful"}', true),
('Verify Supplier AI', 'verify_supplier', 'Assists with supplier verification and document processing', '{"capabilities": ["document_verification", "compliance_check"], "personality": "professional"}', true),
('Client Assistant AI', 'client_assistant', 'Helps clients with shopping and order management', '{"capabilities": ["product_discovery", "order_tracking", "support"], "personality": "friendly"}', true),
('Growth Advisor AI', 'growth_advisor', 'Provides performance insights and optimization strategies', '{"capabilities": ["analytics", "recommendations", "optimization"], "personality": "analytical"}', true),
('Campaign Studio AI', 'campaign_studio', 'Orchestrates creative AI tools for marketing campaigns', '{"capabilities": ["content_creation", "campaign_optimization"], "personality": "creative"}', true),
('Product Discovery AI', 'product_discovery', 'Helps users find relevant products and recommendations', '{"capabilities": ["search", "recommendations", "filtering"], "personality": "helpful"}', true),
('Transaction Simulator AI', 'transaction_simulator', 'Analyzes transaction scenarios and pricing strategies', '{"capabilities": ["financial_modeling", "pricing_optimization"], "personality": "analytical"}', true),
('Team Collaboration AI', 'team_collaboration', 'Optimizes team dynamics and collaboration strategies', '{"capabilities": ["team_management", "collaboration_tools"], "personality": "supportive"}', true),
('Supplier Success AI', 'supplier_success', 'Helps suppliers optimize their marketplace performance', '{"capabilities": ["inventory_management", "performance_optimization"], "personality": "business_focused"}', true),
('Wallet Assistant AI', 'wallet_assistant', 'Manages financial transactions and earnings optimization', '{"capabilities": ["financial_management", "earnings_optimization"], "personality": "trustworthy"}', true),
('Admin Control AI', 'admin_control', 'Provides administrative insights and system monitoring', '{"capabilities": ["system_monitoring", "user_management"], "personality": "professional"}', true)
ON CONFLICT (type) DO NOTHING;

-- Insert System Settings
INSERT INTO system_settings (key, value, description, is_public) VALUES
('platform_name', 'DropPay', 'Platform name', true),
('platform_version', '2.0.0', 'Current platform version', true),
('default_currency', 'USD', 'Default platform currency', true),
('default_commission_rate', '15.0', 'Default commission rate percentage', false),
('min_payout_amount', '50.0', 'Minimum payout amount', true),
('platform_fee_rate', '2.5', 'Platform fee percentage', false),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)', false),
('email_verification_required', 'true', 'Whether email verification is required', false),
('auto_approve_resellers', 'true', 'Whether to auto-approve reseller applications', false),
('maintenance_mode', 'false', 'Whether the platform is in maintenance mode', true)
ON CONFLICT (key) DO NOTHING;

-- Insert Categories
INSERT INTO categories (name, slug, description, commission_rate, is_active, sort_order) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets', 12.0, true, 1),
('Software & SaaS', 'software-saas', 'Software products and SaaS solutions', 25.0, true, 2),
('Fashion & Apparel', 'fashion-apparel', 'Clothing, shoes, and accessories', 18.0, true, 3),
('Home & Garden', 'home-garden', 'Home improvement and garden products', 14.0, true, 4),
('Health & Beauty', 'health-beauty', 'Health, wellness, and beauty products', 16.0, true, 5),
('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', 13.0, true, 6),
('Books & Media', 'books-media', 'Books, movies, music, and digital media', 10.0, true, 7),
('Automotive', 'automotive', 'Car parts and automotive accessories', 11.0, true, 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert Demo Users
INSERT INTO users (id, email, name, role, is_verified, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@droppay.com', 'Platform Administrator', 'admin', true, true),
('550e8400-e29b-41d4-a716-446655440002', 'supplier@techcorp.com', 'TechCorp Electronics', 'supplier', true, true),
('550e8400-e29b-41d4-a716-446655440003', 'john@example.com', 'John Smith', 'client', true, true),
('550e8400-e29b-41d4-a716-446655440004', 'sarah@example.com', 'Sarah Johnson', 'reseller', true, true),
('550e8400-e29b-41d4-a716-446655440005', 'mike@example.com', 'Mike Chen', 'reseller', true, true),
('550e8400-e29b-41d4-a716-446655440006', 'moderator@droppay.com', 'Content Moderator', 'moderator', true, true),
('550e8400-e29b-41d4-a716-446655440007', 'analyst@droppay.com', 'Data Analyst', 'analyst', true, true),
('550e8400-e29b-41d4-a716-446655440008', 'support@droppay.com', 'Support Agent', 'support', true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert User Profiles
INSERT INTO user_profiles (user_id, country, currency, timezone, language, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'US', 'USD', 'America/New_York', 'en', '{"notifications": {"email": true, "sms": false}}'),
('550e8400-e29b-41d4-a716-446655440002', 'US', 'USD', 'America/Los_Angeles', 'en', '{"notifications": {"email": true, "sms": true}}'),
('550e8400-e29b-41d4-a716-446655440003', 'US', 'USD', 'America/New_York', 'en', '{"notifications": {"email": true, "sms": false}}'),
('550e8400-e29b-41d4-a716-446655440004', 'CA', 'CAD', 'America/Toronto', 'en', '{"notifications": {"email": true, "sms": true}}'),
('550e8400-e29b-41d4-a716-446655440005', 'US', 'USD', 'America/Chicago', 'en', '{"notifications": {"email": true, "sms": false}}'),
('550e8400-e29b-41d4-a716-446655440006', 'UK', 'GBP', 'Europe/London', 'en', '{"notifications": {"email": true, "sms": false}}'),
('550e8400-e29b-41d4-a716-446655440007', 'US', 'USD', 'America/New_York', 'en', '{"notifications": {"email": true, "sms": false}}'),
('550e8400-e29b-41d4-a716-446655440008', 'US', 'USD', 'America/New_York', 'en', '{"notifications": {"email": true, "sms": false}}')
ON CONFLICT (user_id) DO NOTHING;

-- Insert Demo Supplier
INSERT INTO suppliers (id, user_id, company_name, legal_name, store_url, store_name, description, commission_rate, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'TechCorp Electronics', 'TechCorp Electronics LLC', 'techcorp', 'TechCorp Electronics Store', 'Premium electronics and gadgets for modern lifestyle', 15.0, 'approved')
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Resellers
INSERT INTO resellers (id, user_id, reseller_type, referral_code, performance_tier, total_sales, total_commission) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'team_leader', 'SARAH2024', 'gold', 28450.00, 4267.50),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'solo', 'MIKE2024', 'silver', 15680.00, 2352.00)
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Products
INSERT INTO products (id, supplier_id, category_id, sku, name, description, price, cost, commission_rate, inventory_quantity, status, is_featured, images, features) VALUES
(
  '880e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
  'TC-WBH-001',
  'Wireless Bluetooth Headphones',
  'Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
  89.99,
  45.00,
  15.0,
  245,
  'active',
  true,
  ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
  ARRAY['Noise Cancellation', '30-hour Battery', 'Bluetooth 5.0', 'Quick Charge']
),
(
  '880e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
  'TC-SFT-002',
  'Smart Fitness Tracker',
  'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration.',
  129.99,
  65.00,
  20.0,
  89,
  'active',
  true,
  ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'],
  ARRAY['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking']
),
(
  '880e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
  'TC-PPC-003',
  'Portable Phone Charger',
  'High-capacity portable charger with fast charging technology and multiple device support.',
  34.99,
  18.00,
  12.0,
  156,
  'active',
  false,
  ARRAY['https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg'],
  ARRAY['Fast Charging', 'Multiple Ports', 'LED Indicator', 'Compact Design']
)
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Team
INSERT INTO reseller_teams (id, name, leader_id, description, invite_code, total_sales, total_members) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Alpha Sellers', '770e8400-e29b-41d4-a716-446655440001', 'Top performing reseller team focused on electronics and tech products', 'ALPHA2024', 44130.00, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert Team Memberships
INSERT INTO team_memberships (team_id, reseller_id, role) VALUES
('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'leader'),
('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 'member')
ON CONFLICT (team_id, reseller_id) DO NOTHING;

-- Insert Team Milestone
INSERT INTO team_milestones (team_id, name, description, target_amount, current_amount, reward_description, status) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Bronze Collective', 'Reach $50,000 in combined team sales', 50000.00, 44130.00, '$500 shared bonus pool + Bronze badges for all team members', 'active')
ON CONFLICT DO NOTHING;

-- Insert Demo Tracking Links
INSERT INTO tracking_links (reseller_id, product_id, link_code, full_url, clicks, conversions) VALUES
('770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'SARAH001', 'https://droppay.com/track/SARAH001', 156, 23),
('770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 'SARAH002', 'https://droppay.com/track/SARAH002', 89, 12),
('770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', 'MIKE001', 'https://droppay.com/track/MIKE001', 234, 45)
ON CONFLICT DO NOTHING;

-- Insert Demo Daily Metrics
INSERT INTO daily_metrics (date, metric_type, entity_id, value, metadata) VALUES
(CURRENT_DATE - INTERVAL '1 day', 'sales', '770e8400-e29b-41d4-a716-446655440001', 1250.00, '{"orders": 5, "products": 8}'),
(CURRENT_DATE - INTERVAL '1 day', 'sales', '770e8400-e29b-41d4-a716-446655440002', 890.00, '{"orders": 3, "products": 6}'),
(CURRENT_DATE - INTERVAL '1 day', 'revenue', '660e8400-e29b-41d4-a716-446655440001', 2140.00, '{"orders": 8, "commission_paid": 321.00}'),
(CURRENT_DATE, 'active_users', NULL, 1247, '{"new_signups": 23, "active_sessions": 456}')
ON CONFLICT (date, metric_type, entity_id) DO NOTHING;