/*
  # Database Functions

  1. Authentication Functions
  2. Search Functions
  3. Commission Calculation Functions
  4. Analytics Functions
  5. Utility Functions
*/

-- Function to update search vector for products
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
CREATE TRIGGER update_product_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_search_vector();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS trigger AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('order_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Trigger to automatically generate order numbers
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_resellers_updated_at
  BEFORE UPDATE ON resellers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Product search function
CREATE OR REPLACE FUNCTION search_products(
  search_query text DEFAULT NULL,
  category_filter uuid DEFAULT NULL,
  min_price decimal DEFAULT NULL,
  max_price decimal DEFAULT NULL,
  supplier_filter uuid DEFAULT NULL,
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price decimal,
  supplier_name text,
  category_name text,
  search_rank real
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
    CASE 
      WHEN search_query IS NOT NULL THEN
        ts_rank(p.search_vector, plainto_tsquery('english', search_query))
      ELSE 0
    END as search_rank
  FROM products p
  LEFT JOIN suppliers s ON p.supplier_id = s.id
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE 
    p.status = 'active'
    AND (search_query IS NULL OR p.search_vector @@ plainto_tsquery('english', search_query))
    AND (category_filter IS NULL OR p.category_id = category_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (supplier_filter IS NULL OR p.supplier_id = supplier_filter)
  ORDER BY 
    CASE WHEN search_query IS NOT NULL THEN search_rank ELSE 0 END DESC,
    p.is_featured DESC,
    p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate reseller earnings
CREATE OR REPLACE FUNCTION calculate_reseller_earnings(reseller_uuid uuid)
RETURNS TABLE (
  total_sales decimal,
  total_commission decimal,
  pending_commission decimal,
  paid_commission decimal,
  team_bonus decimal,
  current_tier performance_tier
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(oi.total_price), 0) as total_sales,
    COALESCE(SUM(c.amount), 0) as total_commission,
    COALESCE(SUM(CASE WHEN c.status = 'pending' THEN c.amount ELSE 0 END), 0) as pending_commission,
    COALESCE(SUM(CASE WHEN c.status = 'paid' THEN c.amount ELSE 0 END), 0) as paid_commission,
    r.team_bonus_earned as team_bonus,
    r.performance_tier as current_tier
  FROM resellers r
  LEFT JOIN commissions c ON r.id = c.reseller_id
  LEFT JOIN order_items oi ON c.order_item_id = oi.id
  WHERE r.id = reseller_uuid
  GROUP BY r.id, r.team_bonus_earned, r.performance_tier;
END;
$$ LANGUAGE plpgsql;

-- Function to get supplier performance summary
CREATE OR REPLACE FUNCTION get_supplier_performance(supplier_uuid uuid)
RETURNS TABLE (
  total_products integer,
  active_products integer,
  total_orders integer,
  total_revenue decimal,
  total_commission_paid decimal,
  active_resellers integer,
  avg_order_value decimal
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT p.id)::integer as total_products,
    COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END)::integer as active_products,
    COUNT(DISTINCT o.id)::integer as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue,
    COALESCE(SUM(c.amount), 0) as total_commission_paid,
    COUNT(DISTINCT c.reseller_id)::integer as active_resellers,
    CASE 
      WHEN COUNT(o.id) > 0 THEN COALESCE(AVG(o.total_amount), 0)
      ELSE 0
    END as avg_order_value
  FROM suppliers s
  LEFT JOIN products p ON s.id = p.supplier_id
  LEFT JOIN orders o ON s.id = o.supplier_id
  LEFT JOIN commissions c ON o.id = c.order_id
  WHERE s.id = supplier_uuid
  GROUP BY s.id;
END;
$$ LANGUAGE plpgsql;

-- Function to update team statistics
CREATE OR REPLACE FUNCTION update_team_stats()
RETURNS trigger AS $$
BEGIN
  -- Update team member count and total sales
  UPDATE reseller_teams 
  SET 
    total_members = (
      SELECT COUNT(*) FROM team_memberships 
      WHERE team_id = COALESCE(NEW.team_id, OLD.team_id)
    ),
    total_sales = (
      SELECT COALESCE(SUM(r.total_sales), 0)
      FROM team_memberships tm
      JOIN resellers r ON tm.reseller_id = r.id
      WHERE tm.team_id = COALESCE(NEW.team_id, OLD.team_id)
    )
  WHERE id = COALESCE(NEW.team_id, OLD.team_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update team stats when membership changes
CREATE TRIGGER update_team_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON team_memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_team_stats();

-- Function to create tracking link
CREATE OR REPLACE FUNCTION create_tracking_link(
  reseller_uuid uuid,
  product_uuid uuid
)
RETURNS text AS $$
DECLARE
  link_code text;
  base_url text;
  full_url text;
BEGIN
  -- Generate unique link code
  link_code := encode(gen_random_bytes(8), 'base64');
  link_code := replace(replace(replace(link_code, '/', ''), '+', ''), '=', '');
  
  -- Get base URL (this would be configurable)
  base_url := 'https://droppay.com/track/';
  full_url := base_url || link_code;
  
  -- Insert tracking link
  INSERT INTO tracking_links (reseller_id, product_id, link_code, full_url)
  VALUES (reseller_uuid, product_uuid, link_code, full_url);
  
  RETURN full_url;
END;
$$ LANGUAGE plpgsql;

-- Function to record link click
CREATE OR REPLACE FUNCTION record_link_click(
  link_code_param text,
  ip_address_param inet DEFAULT NULL,
  user_agent_param text DEFAULT NULL,
  referrer_param text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  tracking_link_id_var uuid;
BEGIN
  -- Get tracking link ID and update click count
  UPDATE tracking_links 
  SET 
    clicks = clicks + 1,
    last_clicked_at = now()
  WHERE link_code = link_code_param
  RETURNING id INTO tracking_link_id_var;
  
  -- Insert analytics record
  IF tracking_link_id_var IS NOT NULL THEN
    INSERT INTO link_analytics (
      tracking_link_id,
      ip_address,
      user_agent,
      referrer
    ) VALUES (
      tracking_link_id_var,
      ip_address_param,
      user_agent_param,
      referrer_param
    );
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate commission for order item
CREATE OR REPLACE FUNCTION calculate_commission(
  order_item_uuid uuid
)
RETURNS decimal AS $$
DECLARE
  commission_amount decimal;
  commission_rate decimal;
  item_total decimal;
  product_rate decimal;
  category_rate decimal;
  supplier_rate decimal;
BEGIN
  -- Get order item details and rates
  SELECT 
    oi.total_price,
    p.commission_rate,
    c.commission_rate,
    s.commission_rate
  INTO 
    item_total,
    product_rate,
    category_rate,
    supplier_rate
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  LEFT JOIN categories c ON p.category_id = c.id
  JOIN suppliers s ON p.supplier_id = s.id
  WHERE oi.id = order_item_uuid;
  
  -- Determine commission rate (product > category > supplier)
  commission_rate := COALESCE(product_rate, category_rate, supplier_rate, 15.0);
  
  -- Calculate commission amount
  commission_amount := item_total * (commission_rate / 100);
  
  RETURN commission_amount;
END;
$$ LANGUAGE plpgsql;