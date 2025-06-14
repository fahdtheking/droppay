/*
  # Fix Registration Infinite Loop

  1. Simplify RLS policies to prevent conflicts
  2. Fix authentication flow issues
  3. Ensure proper user creation process
*/

-- Drop problematic policies first
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Recreate simplified user policies
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_insert_own" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow admins to view all users
CREATE POLICY "admins_view_all_users" ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'support', 'moderator')
    )
  );

-- Fix user profiles policies
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;

CREATE POLICY "profiles_select_own" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "profiles_insert_own" ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update_own" ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Fix suppliers policies
DROP POLICY IF EXISTS "Suppliers can manage own data" ON suppliers;

CREATE POLICY "suppliers_select_own" ON suppliers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "suppliers_insert_own" ON suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "suppliers_update_own" ON suppliers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Fix resellers policies
DROP POLICY IF EXISTS "Resellers can manage own data" ON resellers;

CREATE POLICY "resellers_select_own" ON resellers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "resellers_insert_own" ON resellers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "resellers_update_own" ON resellers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create a simple function to get user role without complex logic
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$;

-- Create a simple function to check if user has role
CREATE OR REPLACE FUNCTION public.user_has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = required_role
  );
$$;

-- Create a simple function to check if user has any of the roles
CREATE OR REPLACE FUNCTION public.user_has_any_role(required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = ANY(required_roles)
  );
$$;