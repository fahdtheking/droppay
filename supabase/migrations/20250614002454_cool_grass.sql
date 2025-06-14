-- =============================================
-- AUTHENTICATION & SECURITY IMPLEMENTATION
-- Comprehensive auth system for DropPay
-- =============================================

-- =============================================
-- AUTHENTICATION FUNCTIONS
-- =============================================

-- Enhanced user registration function
CREATE OR REPLACE FUNCTION register_user(
    email_param text,
    password_param text,
    name_param text,
    role_param user_role DEFAULT 'client',
    profile_data jsonb DEFAULT '{}'
)
RETURNS jsonb AS $$
DECLARE
    user_id uuid;
    result jsonb;
BEGIN
    -- Validate email format
    IF email_param !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid email format');
    END IF;
    
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM users WHERE email = email_param) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Email already registered');
    END IF;
    
    -- Create user
    INSERT INTO users (email, password_hash, name, role)
    VALUES (email_param, crypt(password_param, gen_salt('bf')), name_param, role_param)
    RETURNING id INTO user_id;
    
    -- Create user profile
    INSERT INTO user_profiles (user_id, preferences)
    VALUES (user_id, profile_data);
    
    -- Create role-specific records
    CASE role_param
        WHEN 'reseller' THEN
            INSERT INTO resellers (user_id, referral_code)
            VALUES (user_id, generate_referral_code());
        WHEN 'supplier' THEN
            -- Supplier record will be created during onboarding
            NULL;
        ELSE
            NULL;
    END CASE;
    
    result := jsonb_build_object(
        'success', true,
        'user_id', user_id,
        'message', 'User registered successfully'
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User authentication function
CREATE OR REPLACE FUNCTION authenticate_user(
    email_param text,
    password_param text,
    ip_address_param inet DEFAULT NULL,
    user_agent_param text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
    user_record users%ROWTYPE;
    session_token text;
    result jsonb;
BEGIN
    -- Get user record
    SELECT * INTO user_record
    FROM users 
    WHERE email = email_param;
    
    -- Check if user exists
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
    
    -- Check if account is locked
    IF user_record.is_locked THEN
        RETURN jsonb_build_object('success', false, 'error', 'Account is locked');
    END IF;
    
    -- Check if account is active
    IF NOT user_record.is_active THEN
        RETURN jsonb_build_object('success', false, 'error', 'Account is inactive');
    END IF;
    
    -- Verify password
    IF user_record.password_hash = crypt(password_param, user_record.password_hash) THEN
        -- Password correct - reset failed attempts
        UPDATE users 
        SET 
            failed_login_attempts = 0,
            last_login_at = now()
        WHERE id = user_record.id;
        
        -- Generate session token
        session_token := encode(gen_random_bytes(32), 'base64');
        
        -- Create session
        INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at)
        VALUES (
            user_record.id, 
            session_token, 
            ip_address_param, 
            user_agent_param, 
            now() + interval '30 days'
        );
        
        result := jsonb_build_object(
            'success', true,
            'user_id', user_record.id,
            'email', user_record.email,
            'name', user_record.name,
            'role', user_record.role,
            'session_token', session_token,
            'is_verified', user_record.is_verified
        );
        
    ELSE
        -- Password incorrect - increment failed attempts
        UPDATE users 
        SET 
            failed_login_attempts = failed_login_attempts + 1,
            last_failed_login = now()
        WHERE id = user_record.id;
        
        result := jsonb_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Authentication failed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Session validation function
CREATE OR REPLACE FUNCTION validate_session(session_token_param text)
RETURNS jsonb AS $$
DECLARE
    session_record user_sessions%ROWTYPE;
    user_record users%ROWTYPE;
    result jsonb;
BEGIN
    -- Get session record
    SELECT * INTO session_record
    FROM user_sessions 
    WHERE session_token = session_token_param
    AND is_active = true
    AND expires_at > now();
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired session');
    END IF;
    
    -- Get user record
    SELECT * INTO user_record
    FROM users 
    WHERE id = session_record.user_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'User account not found or inactive');
    END IF;
    
    -- Update last activity
    UPDATE user_sessions 
    SET last_activity = now()
    WHERE id = session_record.id;
    
    result := jsonb_build_object(
        'success', true,
        'user_id', user_record.id,
        'email', user_record.email,
        'name', user_record.name,
        'role', user_record.role,
        'is_verified', user_record.is_verified
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Session validation failed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
    code text;
    exists boolean;
BEGIN
    LOOP
        -- Generate 8-character alphanumeric code
        code := upper(substring(encode(gen_random_bytes(6), 'base64') from 1 for 8));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM resellers WHERE referral_code = code) INTO exists;
        
        EXIT WHEN NOT exists;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Password strength validation
CREATE OR REPLACE FUNCTION validate_password_strength(password_param text)
RETURNS jsonb AS $$
DECLARE
    score integer := 0;
    feedback text[] := ARRAY[]::text[];
BEGIN
    -- Check length
    IF length(password_param) >= 8 THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must be at least 8 characters long');
    END IF;
    
    -- Check for uppercase
    IF password_param ~ '[A-Z]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one uppercase letter');
    END IF;
    
    -- Check for lowercase
    IF password_param ~ '[a-z]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one lowercase letter');
    END IF;
    
    -- Check for numbers
    IF password_param ~ '[0-9]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one number');
    END IF;
    
    -- Check for special characters
    IF password_param ~ '[^A-Za-z0-9]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one special character');
    END IF;
    
    RETURN jsonb_build_object(
        'score', score,
        'max_score', 5,
        'is_strong', score >= 4,
        'feedback', feedback
    );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- MAGIC LINK AUTHENTICATION
-- =============================================

-- Magic link tokens table
CREATE TABLE IF NOT EXISTS magic_link_tokens (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text NOT NULL,
    token text UNIQUE NOT NULL,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Generate magic link
CREATE OR REPLACE FUNCTION generate_magic_link(
    email_param text,
    ip_address_param inet DEFAULT NULL,
    user_agent_param text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
    token text;
    expires_at timestamptz;
    result jsonb;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = email_param AND is_active = true) THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Generate secure token
    token := encode(gen_random_bytes(32), 'base64url');
    expires_at := now() + interval '15 minutes';
    
    -- Store token
    INSERT INTO magic_link_tokens (email, token, expires_at, ip_address, user_agent)
    VALUES (email_param, token, expires_at, ip_address_param, user_agent_param);
    
    result := jsonb_build_object(
        'success', true,
        'token', token,
        'expires_at', expires_at,
        'magic_link', 'https://droppay.com/auth/magic?token=' || token
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Failed to generate magic link');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify magic link
CREATE OR REPLACE FUNCTION verify_magic_link(token_param text)
RETURNS jsonb AS $$
DECLARE
    token_record magic_link_tokens%ROWTYPE;
    user_record users%ROWTYPE;
    session_token text;
    result jsonb;
BEGIN
    -- Get token record
    SELECT * INTO token_record
    FROM magic_link_tokens 
    WHERE token = token_param
    AND expires_at > now()
    AND used_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired token');
    END IF;
    
    -- Get user record
    SELECT * INTO user_record
    FROM users 
    WHERE email = token_record.email
    AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Mark token as used
    UPDATE magic_link_tokens 
    SET used_at = now()
    WHERE id = token_record.id;
    
    -- Generate session token
    session_token := encode(gen_random_bytes(32), 'base64');
    
    -- Create session
    INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at)
    VALUES (
        user_record.id, 
        session_token, 
        token_record.ip_address, 
        token_record.user_agent, 
        now() + interval '30 days'
    );
    
    -- Update last login
    UPDATE users 
    SET last_login_at = now()
    WHERE id = user_record.id;
    
    result := jsonb_build_object(
        'success', true,
        'user_id', user_record.id,
        'email', user_record.email,
        'name', user_record.name,
        'role', user_record.role,
        'session_token', session_token,
        'is_verified', user_record.is_verified
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Magic link verification failed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- OAUTH INTEGRATION SETUP
-- =============================================

-- OAuth providers table
CREATE TABLE IF NOT EXISTS oauth_providers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text UNIQUE NOT NULL, -- 'google', 'facebook', 'github', etc.
    client_id text NOT NULL,
    client_secret text NOT NULL,
    authorization_url text NOT NULL,
    token_url text NOT NULL,
    user_info_url text NOT NULL,
    scopes text[] DEFAULT ARRAY['email', 'profile'],
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- OAuth user connections
CREATE TABLE IF NOT EXISTS oauth_connections (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    provider_name text NOT NULL,
    provider_user_id text NOT NULL,
    access_token text,
    refresh_token text,
    token_expires_at timestamptz,
    profile_data jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(provider_name, provider_user_id)
);

-- OAuth authentication function
CREATE OR REPLACE FUNCTION oauth_authenticate(
    provider_name_param text,
    provider_user_id_param text,
    email_param text,
    name_param text,
    profile_data_param jsonb DEFAULT '{}'
)
RETURNS jsonb AS $$
DECLARE
    user_record users%ROWTYPE;
    connection_record oauth_connections%ROWTYPE;
    session_token text;
    result jsonb;
BEGIN
    -- Check if OAuth connection exists
    SELECT * INTO connection_record
    FROM oauth_connections 
    WHERE provider_name = provider_name_param 
    AND provider_user_id = provider_user_id_param;
    
    IF FOUND THEN
        -- Existing connection - get user
        SELECT * INTO user_record
        FROM users 
        WHERE id = connection_record.user_id
        AND is_active = true;
        
        IF NOT FOUND THEN
            RETURN jsonb_build_object('success', false, 'error', 'User account not found or inactive');
        END IF;
        
    ELSE
        -- New connection - check if user exists by email
        SELECT * INTO user_record
        FROM users 
        WHERE email = email_param;
        
        IF FOUND THEN
            -- Link existing user account
            INSERT INTO oauth_connections (user_id, provider_name, provider_user_id, profile_data)
            VALUES (user_record.id, provider_name_param, provider_user_id_param, profile_data_param);
        ELSE
            -- Create new user account
            INSERT INTO users (email, name, role, is_verified)
            VALUES (email_param, name_param, 'client', true)
            RETURNING * INTO user_record;
            
            -- Create user profile
            INSERT INTO user_profiles (user_id, preferences)
            VALUES (user_record.id, '{}');
            
            -- Create OAuth connection
            INSERT INTO oauth_connections (user_id, provider_name, provider_user_id, profile_data)
            VALUES (user_record.id, provider_name_param, provider_user_id_param, profile_data_param);
        END IF;
    END IF;
    
    -- Generate session token
    session_token := encode(gen_random_bytes(32), 'base64');
    
    -- Create session
    INSERT INTO user_sessions (user_id, session_token, expires_at)
    VALUES (user_record.id, session_token, now() + interval '30 days');
    
    -- Update last login
    UPDATE users 
    SET last_login_at = now()
    WHERE id = user_record.id;
    
    result := jsonb_build_object(
        'success', true,
        'user_id', user_record.id,
        'email', user_record.email,
        'name', user_record.name,
        'role', user_record.role,
        'session_token', session_token,
        'is_verified', user_record.is_verified,
        'is_new_user', NOT FOUND
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'OAuth authentication failed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SECURITY MONITORING
-- =============================================

-- Security events logging
CREATE TABLE IF NOT EXISTS security_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id),
    event_type text NOT NULL, -- 'login_success', 'login_failed', 'password_changed', etc.
    ip_address inet,
    user_agent text,
    details jsonb DEFAULT '{}',
    risk_score decimal(3,2) DEFAULT 0.00,
    created_at timestamptz DEFAULT now()
);

-- Log security event function
CREATE OR REPLACE FUNCTION log_security_event(
    user_id_param uuid,
    event_type_param text,
    ip_address_param inet DEFAULT NULL,
    user_agent_param text DEFAULT NULL,
    details_param jsonb DEFAULT '{}'
)
RETURNS void AS $$
DECLARE
    risk_score decimal(3,2) := 0.00;
BEGIN
    -- Calculate basic risk score
    CASE event_type_param
        WHEN 'login_failed' THEN risk_score := 0.3;
        WHEN 'account_locked' THEN risk_score := 0.8;
        WHEN 'password_changed' THEN risk_score := 0.1;
        WHEN 'suspicious_activity' THEN risk_score := 0.9;
        ELSE risk_score := 0.0;
    END CASE;
    
    INSERT INTO security_events (user_id, event_type, ip_address, user_agent, details, risk_score)
    VALUES (user_id_param, event_type_param, ip_address_param, user_agent_param, details_param, risk_score);
END;
$$ LANGUAGE plpgsql;

-- Account security status function
CREATE OR REPLACE FUNCTION get_account_security_status(user_id_param uuid)
RETURNS jsonb AS $$
DECLARE
    user_record users%ROWTYPE;
    recent_events integer;
    failed_logins integer;
    result jsonb;
BEGIN
    SELECT * INTO user_record FROM users WHERE id = user_id_param;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'User not found');
    END IF;
    
    -- Count recent security events
    SELECT COUNT(*) INTO recent_events
    FROM security_events 
    WHERE user_id = user_id_param 
    AND created_at > now() - interval '24 hours';
    
    -- Count recent failed logins
    SELECT COUNT(*) INTO failed_logins
    FROM security_events 
    WHERE user_id = user_id_param 
    AND event_type = 'login_failed'
    AND created_at > now() - interval '1 hour';
    
    result := jsonb_build_object(
        'user_id', user_record.id,
        'is_active', user_record.is_active,
        'is_locked', user_record.is_locked,
        'is_verified', user_record.is_verified,
        'failed_login_attempts', user_record.failed_login_attempts,
        'last_login_at', user_record.last_login_at,
        'recent_security_events', recent_events,
        'recent_failed_logins', failed_logins,
        'password_age_days', EXTRACT(days FROM now() - user_record.password_changed_at),
        'security_score', CASE 
            WHEN user_record.is_locked THEN 0
            WHEN failed_logins > 3 THEN 2
            WHEN recent_events > 10 THEN 3
            WHEN user_record.is_verified AND EXTRACT(days FROM now() - user_record.password_changed_at) < 90 THEN 10
            ELSE 7
        END
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;