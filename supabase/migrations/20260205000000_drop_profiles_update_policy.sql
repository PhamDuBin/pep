-- =============================================================================
-- Drop "Users can update own profile" RLS policy on profiles
-- クライアントによる profiles 直接 UPDATE を禁止する
--
-- Risk: The policy allowed authenticated clients to UPDATE their own profile
-- row via PostgREST; RLS does not restrict columns, so role/org_id etc. could
-- be self-escalated (trigger 20260204100000 mitigates). Backend uses
-- service_role and does not depend on this policy. No frontend code updates
-- profiles directly. Dropping this policy: clients can no longer UPDATE
-- profiles via PostgREST; all profile updates must go through backend API.
-- =============================================================================

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
