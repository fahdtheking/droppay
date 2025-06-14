/*
  # DropPay Authentication System Setup
  
  1. Enhanced Authentication
    - Secure password handling
    - Multi-factor authentication
    - Session management
    - OAuth integration
  
  2. Security Features
    - Login attempt tracking
    - Account lockout protection
    - Password reset flows
    - Device management
  
  3. Authentication Functions
    - User registration
    - Login validation
    - Session management
    - Security helpers
*/

-- =============================================
-- AUTHENTICATION TABLES
-- =============================================

-- User sessions for enhanced security
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Login attempts tracking
CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    attempted_at TIMESTAMPTZ DEFAULT now()
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Magic link tokens
CREATE TABLE IF NOT EXISTS magic_link_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- OAuth providers
CREATE TABLE IF NOT EXISTS oauth_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'google', 'github', 'apple', etc.
    provider_user_id TEXT NOT NULL,
    provider_email TEXT,
    provider_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(provider, provider_user_id)
);

-- Two-factor authentication backup codes
CREATE TABLE IF NOT EXISTS two_factor_backup_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Trusted devices
CREATE TABLE IF NOT EXISTS trusted_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    device_name TEXT,
    device_info JSONB DEFAULT '{}',
    last_used TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, device_fingerprint)
);

-- =============================================
-- AUTHENTICATION FUNCTIONS
-- =============================================

-- Function to hash passwords using crypt
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql;

-- Function to verify passwords
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql;

-- Function to generate secure tokens
CREATE OR REPLACE FUNCTION generate_secure_token(length INTEGER DEFAULT 32)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(length), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to check if account is locked
CREATE OR REPLACE FUNCTION is_account_locked(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_record users%ROWTYPE;
BEGIN
    SELECT * INTO user_record FROM users WHERE email = user_email;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    RETURN user_record.is_locked AND (
        user_record.locked_until IS NULL OR 
        user_record.locked_until > now()
    );
END;
$$ LANGUAGE plpgsql;

-- Function to lock account after failed attempts
CREATE OR REPLACE FUNCTION check_and_lock_account(user_email TEXT)
RETURNS void AS $$
DECLARE
    failed_attempts INTEGER;
    user_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO user_id FROM users WHERE email = user_email;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Count failed attempts in last 15 minutes
    SELECT COUNT(*) INTO failed_attempts
    FROM login_attempts
    WHERE email = user_email 
    AND success = false 
    AND attempted_at > now() - INTERVAL '15 minutes';
    
    -- Lock account if too many failed attempts
    IF failed_attempts >= 5 THEN
        UPDATE users 
        SET 
            is_locked = true,
            locked_until = now() + INTERVAL '30 minutes',
            failed_login_attempts = failed_attempts
        WHERE id = user_id;
    ELSE
        UPDATE users 
        SET failed_login_attempts = failed_attempts
        WHERE id = user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to authenticate user
CREATE OR REPLACE FUNCTION authenticate_user(
    user_email TEXT,
    user_password TEXT,
    user_ip INET DEFAULT NULL,
    user_agent_string TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    user_id UUID,
    message TEXT,
    requires_2fa BOOLEAN
) AS $$
DECLARE
    user_record users%ROWTYPE;
    login_success BOOLEAN := false;
    error_message TEXT := '';
    needs_2fa BOOLEAN := false;
BEGIN
    -- Check if account is locked
    IF is_account_locked(user_email) THEN
        INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
        VALUES (user_email, user_ip, user_agent_string, false, 'Account locked');
        
        RETURN QUERY SELECT false, NULL::UUID, 'Account is temporarily locked', false;
        RETURN;
    END IF;
    
    -- Get user record
    SELECT * INTO user_record FROM users WHERE email = user_email;
    
    IF NOT FOUND THEN
        error_message := 'Invalid email or password';
    ELSIF NOT verify_password(user_password, user_record.password_hash) THEN
        error_message := 'Invalid email or password';
    ELSIF NOT user_record.is_verified THEN
        error_message := 'Email not verified';
    ELSE
        login_success := true;
        needs_2fa := user_record.two_factor_enabled;
        
        -- Update last login
        UPDATE users 
        SET 
            last_login_at = now(),
            failed_login_attempts = 0,
            is_locked = false,
            locked_until = NULL
        WHERE id = user_record.id;
    END IF;
    
    -- Log the attempt
    INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
    VALUES (user_email, user_ip, user_agent_string, login_success, 
            CASE WHEN login_success THEN NULL ELSE error_message END);
    
    -- Check and lock account if needed
    IF NOT login_success THEN
        PERFORM check_and_lock_account(user_email);
        error_message := 'Invalid email or password';
    END IF;
    
    RETURN QUERY SELECT 
        login_success, 
        CASE WHEN login_success THEN user_record.id ELSE NULL END,
        CASE WHEN login_success THEN 'Login successful' ELSE error_message END,
        needs_2fa;
END;
$$ LANGUAGE plpgsql;

-- Function to create user session
CREATE OR REPLACE FUNCTION create_user_session(
    user_uuid UUID,
    device_information JSONB DEFAULT '{}',
    user_ip INET DEFAULT NULL,
    user_agent_string TEXT DEFAULT NULL,
    session_duration INTERVAL DEFAULT '7 days'
)
RETURNS TABLE(
    session_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ
) AS $$
DECLARE
    new_session_token TEXT;
    new_refresh_token TEXT;
    expiry_time TIMESTAMPTZ;
BEGIN
    new_session_token := generate_secure_token(32);
    new_refresh_token := generate_secure_token(32);
    expiry_time := now() + session_duration;
    
    INSERT INTO user_sessions (
        user_id, session_token, refresh_token, device_info, 
        ip_address, user_agent, expires_at
    ) VALUES (
        user_uuid, new_session_token, new_refresh_token, device_information,
        user_ip, user_agent_string, expiry_time
    );
    
    RETURN QUERY SELECT new_session_token, new_refresh_token, expiry_time;
END;
$$ LANGUAGE plpgsql;

-- Function to validate session
CREATE OR REPLACE FUNCTION validate_session(token TEXT)
RETURNS TABLE(
    valid BOOLEAN,
    user_id UUID,
    expires_at TIMESTAMPTZ
) AS $$
DECLARE
    session_record user_sessions%ROWTYPE;
BEGIN
    SELECT * INTO session_record 
    FROM user_sessions 
    WHERE session_token = token 
    AND is_active = true 
    AND expires_at > now();
    
    IF FOUND THEN
        -- Update last activity
        UPDATE user_sessions 
        SET last_activity = now() 
        WHERE id = session_record.id;
        
        RETURN QUERY SELECT true, session_record.user_id, session_record.expires_at;
    ELSE
        RETURN QUERY SELECT false, NULL::UUID, NULL::TIMESTAMPTZ;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create password reset token
CREATE OR REPLACE FUNCTION create_password_reset_token(user_email TEXT)
RETURNS TABLE(
    success BOOLEAN,
    token TEXT,
    message TEXT
) AS $$
DECLARE
    user_uuid UUID;
    reset_token TEXT;
BEGIN
    -- Check if user exists
    SELECT id INTO user_uuid FROM users WHERE email = user_email;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'User not found';
        RETURN;
    END IF;
    
    -- Generate token
    reset_token := generate_secure_token(32);
    
    -- Insert token
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (user_uuid, reset_token, now() + INTERVAL '1 hour');
    
    RETURN QUERY SELECT true, reset_token, 'Reset token created';
END;
$$ LANGUAGE plpgsql;

-- Function to reset password with token
CREATE OR REPLACE FUNCTION reset_password_with_token(
    reset_token TEXT,
    new_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    token_record password_reset_tokens%ROWTYPE;
    password_hash TEXT;
BEGIN
    -- Get token record
    SELECT * INTO token_record 
    FROM password_reset_tokens 
    WHERE token = reset_token 
    AND expires_at > now() 
    AND used_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Invalid or expired token';
        RETURN;
    END IF;
    
    -- Hash new password
    password_hash := hash_password(new_password);
    
    -- Update user password
    UPDATE users 
    SET 
        password_hash = password_hash,
        updated_at = now()
    WHERE id = token_record.user_id;
    
    -- Mark token as used
    UPDATE password_reset_tokens 
    SET used_at = now() 
    WHERE id = token_record.id;
    
    -- Invalidate all user sessions
    UPDATE user_sessions 
    SET is_active = false 
    WHERE user_id = token_record.user_id;
    
    RETURN QUERY SELECT true, 'Password reset successful';
END;
$$ LANGUAGE plpgsql;

-- Function to create magic link
CREATE OR REPLACE FUNCTION create_magic_link(user_email TEXT)
RETURNS TABLE(
    success BOOLEAN,
    token TEXT,
    message TEXT
) AS $$
DECLARE
    magic_token TEXT;
BEGIN
    -- Generate token
    magic_token := generate_secure_token(32);
    
    -- Insert token
    INSERT INTO magic_link_tokens (email, token, expires_at)
    VALUES (user_email, magic_token, now() + INTERVAL '15 minutes');
    
    RETURN QUERY SELECT true, magic_token, 'Magic link created';
END;
$$ LANGUAGE plpgsql;

-- Function to authenticate with magic link
CREATE OR REPLACE FUNCTION authenticate_magic_link(
    magic_token TEXT,
    user_ip INET DEFAULT NULL,
    user_agent_string TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    user_id UUID,
    message TEXT
) AS $$
DECLARE
    token_record magic_link_tokens%ROWTYPE;
    user_uuid UUID;
BEGIN
    -- Get token record
    SELECT * INTO token_record 
    FROM magic_link_tokens 
    WHERE token = magic_token 
    AND expires_at > now() 
    AND used_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::UUID, 'Invalid or expired magic link';
        RETURN;
    END IF;
    
    -- Get or create user
    SELECT id INTO user_uuid FROM users WHERE email = token_record.email;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::UUID, 'User not found';
        RETURN;
    END IF;
    
    -- Mark token as used
    UPDATE magic_link_tokens 
    SET used_at = now() 
    WHERE id = token_record.id;
    
    -- Update last login
    UPDATE users 
    SET last_login_at = now() 
    WHERE id = user_uuid;
    
    -- Log successful login
    INSERT INTO login_attempts (email, ip_address, user_agent, success)
    VALUES (token_record.email, user_ip, user_agent_string, true);
    
    RETURN QUERY SELECT true, user_uuid, 'Magic link authentication successful';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- INDEXES FOR AUTHENTICATION TABLES
-- =============================================

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active, expires_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_magic_link_tokens_token ON magic_link_tokens(token);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_magic_link_tokens_email ON magic_link_tokens(email);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_oauth_providers_user_id ON oauth_providers(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_oauth_providers_provider ON oauth_providers(provider, provider_user_id);

-- =============================================
-- RLS POLICIES FOR AUTHENTICATION TABLES
-- =============================================

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE two_factor_backup_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;

-- Users can see their own sessions
CREATE POLICY "Users can see own sessions" ON user_sessions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can see their own OAuth providers
CREATE POLICY "Users can see own OAuth providers" ON oauth_providers
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can manage their own trusted devices
CREATE POLICY "Users can manage own trusted devices" ON trusted_devices
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Only admins can see login attempts
CREATE POLICY "Admins can see login attempts" ON login_attempts
  FOR SELECT TO authenticated
  USING (auth.is_admin());