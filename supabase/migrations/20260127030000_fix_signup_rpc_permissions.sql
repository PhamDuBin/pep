-- Fix create_signup RPC permissions
-- Revoke public access and grant only to authenticated and service_role

-- Revoke ALL from PUBLIC and anon first
REVOKE ALL ON FUNCTION create_signup(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION create_signup(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon;

-- Grant only to authenticated and service_role
GRANT EXECUTE ON FUNCTION create_signup(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_signup(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

COMMENT ON FUNCTION create_signup IS 'Self-Signup RPC: Only authenticated users and service_role can execute';
