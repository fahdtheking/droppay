import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Enhanced Database Types matching the new schema
export interface User {
  id: string
  email: string
  password_hash?: string
  name: string
  role: 'admin' | 'supplier' | 'reseller' | 'client' | 'moderator' | 'analyst' | 'support'
  is_verified: boolean
  email_verified_at?: string
  phone?: string
  avatar_url?: string
  last_login_at?: string
  failed_login_attempts: number
  is_locked: boolean
  locked_until?: string
  two_factor_enabled: boolean
  two_factor_secret?: string
  backup_codes?: string[]
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  country?: string
  currency: string
  timezone?: string
  language: string
  date_of_birth?: string
  address?: any
  preferences: any
  kyc_status: string
  kyc_documents: any[]
  social_profiles: any
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  user_id: string
  company_name: string
  legal_name: string
  tax_id?: string
  business_type?: string
  store_url: string
  store_name: string
  description?: string
  logo_url?: string
  banner_url?: string
  commission_rate: number
  status: 'pending' | 'approved' | 'suspended' | 'rejected'
  verification_documents: any[]
  store_settings: any
  performance_metrics: any
  created_at: string
  updated_at: string
}

export interface Reseller {
  id: string
  user_id: string
  reseller_type: 'solo' | 'team_leader' | 'team_member'
  referral_code: string
  performance_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  total_sales: number
  total_commission: number
  team_bonus_earned: number
  payout_info: any
  performance_metrics: any
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  commission_rate?: number
  image_url?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  supplier_id: string
  category_id?: string
  sku: string
  name: string
  description?: string
  short_description?: string
  price: number
  cost?: number
  commission_rate?: number
  inventory_quantity: number
  low_stock_threshold: number
  weight?: number
  dimensions?: any
  images: string[]
  features: string[]
  specifications: any
  tags?: string[]
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock' | 'discontinued'
  is_featured: boolean
  seo_title?: string
  seo_description?: string
  search_vector?: string
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  name: string
  price_adjustment: number
  inventory_quantity: number
  attributes: any
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  client_id?: string
  supplier_id?: string
  reseller_id?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  payment_method?: string
  payment_reference?: string
  shipping_address?: any
  billing_address?: any
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  variant_id?: string
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  total_price: number
  commission_rate?: number
  commission_amount?: number
  created_at: string
}

export interface Commission {
  id: string
  reseller_id: string
  order_id?: string
  order_item_id?: string
  amount: number
  rate: number
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  type: 'sale' | 'bonus' | 'milestone' | 'referral'
  description?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface ResellerTeam {
  id: string
  name: string
  leader_id?: string
  description?: string
  invite_code?: string
  total_sales: number
  total_members: number
  created_at: string
  updated_at: string
}

export interface TeamMembership {
  id: string
  team_id: string
  reseller_id: string
  role: string
  joined_at: string
}

export interface TeamMilestone {
  id: string
  team_id: string
  name: string
  description?: string
  target_amount: number
  current_amount: number
  reward_description?: string
  reward_amount?: number
  deadline?: string
  is_completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface TrackingLink {
  id: string
  reseller_id: string
  product_id: string
  link_code: string
  full_url: string
  clicks: number
  conversions: number
  last_clicked_at?: string
  created_at: string
  updated_at: string
}

export interface LinkAnalytics {
  id: string
  tracking_link_id: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  country?: string
  device_type?: string
  converted: boolean
  conversion_value?: number
  created_at: string
}

export interface ShoppingCart {
  id: string
  user_id?: string
  session_id?: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  variant_id?: string
  quantity: number
  unit_price: number
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'order_status' | 'commission_earned' | 'team_milestone' | 'system_alert' | 'marketing'
  title: string
  message: string
  data: any
  is_read: boolean
  read_at?: string
  created_at: string
}

export interface AIAgent {
  id: string
  name: string
  type: 'jarvis_home' | 'verify_supplier' | 'client_assistant' | 'growth_advisor' | 'campaign_studio' | 'product_discovery' | 'transaction_simulator' | 'team_collaboration' | 'supplier_success' | 'wallet_assistant' | 'admin_control'
  description?: string
  configuration: any
  is_active: boolean
  usage_stats: any
  created_at: string
  updated_at: string
}

export interface SystemSetting {
  id: string
  key: string
  value: string
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface DailyMetric {
  id: string
  date: string
  metric_type: string
  entity_id?: string
  value: number
  metadata: any
  created_at: string
}

// Authentication types
export interface UserSession {
  id: string
  user_id: string
  session_token: string
  refresh_token?: string
  device_info: any
  ip_address?: string
  user_agent?: string
  is_active: boolean
  expires_at: string
  last_activity: string
  created_at: string
}

export interface LoginAttempt {
  id: string
  email: string
  ip_address?: string
  user_agent?: string
  success: boolean
  failure_reason?: string
  attempted_at: string
}

// API Response types
export interface AuthResponse {
  success: boolean
  user?: User
  session?: UserSession
  message: string
  requires_2fa?: boolean
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

// Search and filter types
export interface ProductSearchParams {
  query?: string
  category_id?: string
  supplier_id?: string
  min_price?: number
  max_price?: number
  status?: string
  limit?: number
  offset?: number
}

export interface ProductSearchResult {
  id: string
  name: string
  description?: string
  price: number
  supplier_name: string
  category_name?: string
  search_rank?: number
}

// Performance summary types
export interface SupplierPerformance {
  supplier_id: string
  company_name: string
  total_products: number
  total_orders: number
  total_revenue: number
  avg_order_value: number
  unique_customers: number
  commission_rate: number
  status: string
}

export interface ResellerPerformance {
  reseller_id: string
  reseller_name: string
  referral_code: string
  performance_tier: string
  total_orders: number
  total_commissions: number
  total_sales_value: number
  unique_customers: number
  tracking_links_created: number
  total_clicks: number
  total_conversions: number
  conversion_rate: number
}

export interface ProductPerformance {
  product_id: string
  product_name: string
  sku: string
  price: number
  commission_rate?: number
  supplier_name: string
  category_name?: string
  total_orders: number
  total_quantity_sold: number
  total_revenue: number
  unique_customers: number
  tracking_links: number
  total_clicks: number
  inventory_quantity: number
  status: string
}

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Database helper functions
export const getUserRole = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error) return null;
  return data?.role || null;
};

export const getSupplierByUserId = async (userId: string): Promise<Supplier | null> => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  return data;
};

export const getResellerByUserId = async (userId: string): Promise<Reseller | null> => {
  const { data, error } = await supabase
    .from('resellers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  return data;
};

export const searchProducts = async (params: ProductSearchParams): Promise<ProductSearchResult[]> => {
  const { data, error } = await supabase.rpc('search_products', {
    search_query: params.query || null,
    category_filter: params.category_id || null,
    min_price: params.min_price || null,
    max_price: params.max_price || null,
    supplier_filter: params.supplier_id || null,
    limit_count: params.limit || 20,
    offset_count: params.offset || 0
  });

  if (error) {
    console.error('Search error:', error);
    return [];
  }

  return data || [];
};

export const getResellerEarnings = async (resellerId: string) => {
  const { data, error } = await supabase.rpc('calculate_reseller_earnings', {
    reseller_uuid: resellerId
  });

  if (error) {
    console.error('Earnings calculation error:', error);
    return null;
  }

  return data?.[0] || null;
};