/*
  # Performance Indexes

  1. User and Authentication Indexes
  2. Product and E-commerce Indexes
  3. Financial and Commission Indexes
  4. Team and Collaboration Indexes
  5. Analytics and Tracking Indexes
  6. Full-text Search Indexes
*/

-- User and authentication indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_country ON user_profiles(country);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active, expires_at);

-- Supplier indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_store_url ON suppliers(store_url);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_at ON suppliers(created_at);

-- Reseller indexes
CREATE INDEX IF NOT EXISTS idx_resellers_user_id ON resellers(user_id);
CREATE INDEX IF NOT EXISTS idx_resellers_referral_code ON resellers(referral_code);
CREATE INDEX IF NOT EXISTS idx_resellers_performance_tier ON resellers(performance_tier);
CREATE INDEX IF NOT EXISTS idx_resellers_total_sales ON resellers(total_sales);

-- Category indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_inventory ON products(inventory_quantity);

-- Full-text search index for products
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_description_trgm ON products USING gin(description gin_trgm_ops);

-- Product variant indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_reseller_id ON orders(reseller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Order item indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);

-- Commission indexes
CREATE INDEX IF NOT EXISTS idx_commissions_reseller_id ON commissions(reseller_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_type ON commissions(type);
CREATE INDEX IF NOT EXISTS idx_commissions_created_at ON commissions(created_at);

-- Payout indexes
CREATE INDEX IF NOT EXISTS idx_payouts_reseller_id ON payouts(reseller_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON payouts(created_at);

-- Wallet transaction indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);

-- Team indexes
CREATE INDEX IF NOT EXISTS idx_reseller_teams_leader_id ON reseller_teams(leader_id);
CREATE INDEX IF NOT EXISTS idx_reseller_teams_invite_code ON reseller_teams(invite_code);

CREATE INDEX IF NOT EXISTS idx_team_memberships_team_id ON team_memberships(team_id);
CREATE INDEX IF NOT EXISTS idx_team_memberships_reseller_id ON team_memberships(reseller_id);

CREATE INDEX IF NOT EXISTS idx_team_milestones_team_id ON team_milestones(team_id);
CREATE INDEX IF NOT EXISTS idx_team_milestones_status ON team_milestones(status);
CREATE INDEX IF NOT EXISTS idx_team_milestones_deadline ON team_milestones(deadline);

-- Tracking and analytics indexes
CREATE INDEX IF NOT EXISTS idx_tracking_links_reseller_id ON tracking_links(reseller_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_product_id ON tracking_links(product_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_link_code ON tracking_links(link_code);

CREATE INDEX IF NOT EXISTS idx_link_analytics_tracking_link_id ON link_analytics(tracking_link_id);
CREATE INDEX IF NOT EXISTS idx_link_analytics_created_at ON link_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_link_analytics_converted ON link_analytics(converted);

-- Shopping cart indexes
CREATE INDEX IF NOT EXISTS idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_session_id ON shopping_carts(session_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Campaign indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_reseller_id ON campaigns(reseller_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_end_date ON campaigns(end_date);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Product review indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);

-- AI agent indexes
CREATE INDEX IF NOT EXISTS idx_ai_agents_type ON ai_agents(type);
CREATE INDEX IF NOT EXISTS idx_ai_agents_is_active ON ai_agents(is_active);

-- System setting indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_is_public ON system_settings(is_public);

-- Daily metrics indexes
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_type ON daily_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_entity_id ON daily_metrics(entity_id);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date_type_entity ON daily_metrics(date, metric_type, entity_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_supplier_status ON products(supplier_id, status);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON products(category_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_client_status ON orders(client_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_status ON orders(supplier_id, status);
CREATE INDEX IF NOT EXISTS idx_commissions_reseller_status ON commissions(reseller_id, status);