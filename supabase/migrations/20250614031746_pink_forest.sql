/*
  # Email Authentication Features

  1. Email Confirmation Setup
    - Configure email templates
    - Add email verification tracking
    - Set up confirmation flow

  2. Password Reset Setup
    - Add password reset tokens
    - Configure reset flow
    - Add security measures

  3. Security Enhancements
    - Rate limiting for auth attempts
    - Email verification requirements
    - Secure token handling
*/

-- Add email verification tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_sent_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMPTZ;

-- Add password reset tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_sent_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ;

-- Add rate limiting for auth attempts
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address INET,
  attempt_type TEXT NOT NULL, -- 'login', 'register', 'reset_password', 'verify_email'
  attempts INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMPTZ DEFAULT now(),
  last_attempt_at TIMESTAMPTZ DEFAULT now(),
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for rate limiting lookups
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_email_type ON auth_rate_limits(email, attempt_type);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_ip_type ON auth_rate_limits(ip_address, attempt_type);

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_auth_rate_limit(
  p_email TEXT,
  p_ip_address INET,
  p_attempt_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_attempts INTEGER;
  v_blocked_until TIMESTAMPTZ;
BEGIN
  -- Check if currently blocked
  SELECT blocked_until INTO v_blocked_until
  FROM auth_rate_limits
  WHERE email = p_email 
    AND attempt_type = p_attempt_type
    AND blocked_until > now()
  LIMIT 1;

  IF v_blocked_until IS NOT NULL THEN
    RETURN FALSE;
  END IF;

  -- Count recent attempts
  SELECT COALESCE(SUM(attempts), 0) INTO v_current_attempts
  FROM auth_rate_limits
  WHERE email = p_email 
    AND attempt_type = p_attempt_type
    AND last_attempt_at > (now() - INTERVAL '1 minute' * p_window_minutes);

  -- If too many attempts, block the user
  IF v_current_attempts >= p_max_attempts THEN
    INSERT INTO auth_rate_limits (email, ip_address, attempt_type, attempts, blocked_until)
    VALUES (p_email, p_ip_address, p_attempt_type, 1, now() + INTERVAL '1 hour')
    ON CONFLICT (email, attempt_type) 
    DO UPDATE SET 
      attempts = auth_rate_limits.attempts + 1,
      last_attempt_at = now(),
      blocked_until = now() + INTERVAL '1 hour';
    
    RETURN FALSE;
  END IF;

  -- Record this attempt
  INSERT INTO auth_rate_limits (email, ip_address, attempt_type)
  VALUES (p_email, p_ip_address, p_attempt_type)
  ON CONFLICT (email, attempt_type) 
  DO UPDATE SET 
    attempts = auth_rate_limits.attempts + 1,
    last_attempt_at = now();

  RETURN TRUE;
END;
$$;

-- Function to generate secure tokens
CREATE OR REPLACE FUNCTION generate_auth_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Function to send email verification
CREATE OR REPLACE FUNCTION send_email_verification(
  p_user_id UUID,
  p_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Generate verification token
  v_token := generate_auth_token();
  v_expires_at := now() + INTERVAL '24 hours';

  -- Update user with verification token
  UPDATE users 
  SET 
    email_verification_token = v_token,
    email_verification_sent_at = now(),
    email_verification_expires_at = v_expires_at
  WHERE id = p_user_id;

  -- Here you would integrate with your email service
  -- For now, we'll just return true
  RETURN TRUE;
END;
$$;

-- Function to verify email
CREATE OR REPLACE FUNCTION verify_email(
  p_token TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find user with valid token
  SELECT id INTO v_user_id
  FROM users
  WHERE email_verification_token = p_token
    AND email_verification_expires_at > now()
    AND email_verified_at IS NULL;

  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Mark email as verified
  UPDATE users 
  SET 
    email_verified_at = now(),
    is_verified = true,
    email_verification_token = NULL,
    email_verification_sent_at = NULL,
    email_verification_expires_at = NULL
  WHERE id = v_user_id;

  RETURN TRUE;
END;
$$;

-- Function to initiate password reset
CREATE OR REPLACE FUNCTION initiate_password_reset(
  p_email TEXT,
  p_ip_address INET DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_token TEXT;
  v_expires_at TIMESTAMPTZ;
  v_rate_limit_ok BOOLEAN;
BEGIN
  -- Check rate limits
  v_rate_limit_ok := check_auth_rate_limit(p_email, p_ip_address, 'reset_password', 3, 60);
  
  IF NOT v_rate_limit_ok THEN
    RETURN FALSE;
  END IF;

  -- Find user by email
  SELECT id INTO v_user_id
  FROM users
  WHERE email = p_email;

  IF v_user_id IS NULL THEN
    -- Don't reveal if email exists, but still return true for security
    RETURN TRUE;
  END IF;

  -- Generate reset token
  v_token := generate_auth_token();
  v_expires_at := now() + INTERVAL '1 hour';

  -- Update user with reset token
  UPDATE users 
  SET 
    password_reset_token = v_token,
    password_reset_sent_at = now(),
    password_reset_expires_at = v_expires_at
  WHERE id = v_user_id;

  -- Here you would send the reset email
  -- For now, we'll just return true
  RETURN TRUE;
END;
$$;

-- Function to reset password
CREATE OR REPLACE FUNCTION reset_password(
  p_token TEXT,
  p_new_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  -- Find user with valid reset token
  SELECT id, email INTO v_user_id, v_email
  FROM users
  WHERE password_reset_token = p_token
    AND password_reset_expires_at > now();

  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Clear reset token
  UPDATE users 
  SET 
    password_reset_token = NULL,
    password_reset_sent_at = NULL,
    password_reset_expires_at = NULL,
    failed_login_attempts = 0,
    is_locked = false,
    locked_until = NULL
  WHERE id = v_user_id;

  -- The actual password update will be handled by Supabase Auth
  RETURN TRUE;
END;
$$;

-- Enable RLS on rate limits table
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow system functions to access rate limits
CREATE POLICY "rate_limits_system_only" ON auth_rate_limits
  FOR ALL
  TO authenticated
  USING (false);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token) WHERE email_verification_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token) WHERE password_reset_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified_at) WHERE email_verified_at IS NOT NULL;

-- Clean up expired tokens (run this periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_auth_tokens()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cleaned_count INTEGER;
BEGIN
  -- Clean up expired email verification tokens
  UPDATE users 
  SET 
    email_verification_token = NULL,
    email_verification_sent_at = NULL,
    email_verification_expires_at = NULL
  WHERE email_verification_expires_at < now()
    AND email_verification_token IS NOT NULL;

  GET DIAGNOSTICS v_cleaned_count = ROW_COUNT;

  -- Clean up expired password reset tokens
  UPDATE users 
  SET 
    password_reset_token = NULL,
    password_reset_sent_at = NULL,
    password_reset_expires_at = NULL
  WHERE password_reset_expires_at < now()
    AND password_reset_token IS NOT NULL;

  GET DIAGNOSTICS v_cleaned_count = v_cleaned_count + ROW_COUNT;

  -- Clean up old rate limit records
  DELETE FROM auth_rate_limits 
  WHERE last_attempt_at < (now() - INTERVAL '24 hours');

  RETURN v_cleaned_count;
END;
$$;