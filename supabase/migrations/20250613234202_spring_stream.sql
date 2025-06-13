/*
  # Fix RLS policies for users table

  1. Security Changes
    - Drop existing policies that use incorrect uid() function
    - Add proper INSERT policy for user registration
    - Add proper SELECT and UPDATE policies using auth.uid()
    
  2. Policy Details
    - INSERT: Allow authenticated users to insert their own user record during registration
    - SELECT: Allow users to read their own data
    - UPDATE: Allow users to update their own data
*/

-- Drop existing policies that may be using incorrect uid() function
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create proper INSERT policy for user registration
CREATE POLICY "Users can insert own data during registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create proper SELECT policy
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create proper UPDATE policy
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);