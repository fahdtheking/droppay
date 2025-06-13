import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  role: 'supplier' | 'client' | 'reseller' | 'admin'
  is_verified: boolean
  avatar_url?: string
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
  address?: any
  preferences: any
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  user_id: string
  company_name: string
  legal_name: string
  tax_id?: string
  store_url: string
  store_name: string
  description?: string
  logo_url?: string
  commission_rate: number
  status: 'pending' | 'approved' | 'suspended' | 'rejected'
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
  created_at: string
  updated_at: string
}