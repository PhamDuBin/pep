-- =============================================================================
-- accept_invitation RPC + RLS for invitations
-- Task 003: Invitation / 招待機能
-- 前提: invitations テーブルは別マイグレーションで作成済みであること。未作成なら本マイグレーションでエラーになる。
-- =============================================================================

-- Add accepted_at if missing (init.sql may not have it)
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;

-- ============================================
-- accept_invitation RPC
-- 招待承諾: invitation 更新 + profile 更新（既存 profile を active に）
-- Frontend が signUp 済みのため handle_new_user で profile が既に存在する → UPDATE
-- ============================================
CREATE OR REPLACE FUNCTION accept_invitation(
    p_token TEXT,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_inv RECORD;
BEGIN
    -- 1. Find invitation by token (init table uses org_id); ignore soft-deleted
    SELECT id, org_id, email, role, status, expires_at
    INTO v_inv
    FROM invitations
    WHERE token = p_token AND is_deleted = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invitation not found';
    END IF;

    IF v_inv.status != 'pending' THEN
        RAISE EXCEPTION 'Invitation is not pending. Current status: %', v_inv.status;
    END IF;

    IF v_inv.expires_at <= NOW() THEN
        RAISE EXCEPTION 'Invitation expired';
    END IF;

    -- 2. Update invitation
    UPDATE invitations
    SET status = 'accepted',
        accepted_at = NOW(),
        updated_at = NOW()
    WHERE id = v_inv.id;

    -- 3. Update profile (created by handle_new_user on signUp): set org_id, role, status='active'
    UPDATE profiles
    SET org_id = v_inv.org_id,
        role = v_inv.role,
        status = 'active',
        email = v_inv.email,
        updated_at = NOW()
    WHERE id = p_user_id AND is_deleted = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found for user_id: %', p_user_id;
    END IF;

    RETURN jsonb_build_object(
        'profile_id', p_user_id,
        'organization_id', v_inv.org_id
    );
END;
$$;

GRANT EXECUTE ON FUNCTION accept_invitation(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION accept_invitation(TEXT, UUID) TO service_role;

COMMENT ON FUNCTION accept_invitation(TEXT, UUID) IS
'Accept invitation: update invitation status and profile (org_id, role, status=active). Invitation flow.';

-- ============================================
-- RLS: invitations
-- Owner/Admin のみ自組織の招待を作成・一覧可能
-- ============================================
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Select: user must be owner or admin of the organization
CREATE POLICY invitations_select_policy ON invitations
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.org_id = invitations.org_id
            AND p.role IN ('owner', 'admin')
            AND p.is_deleted = FALSE
        )
    );

-- Insert: user must be owner or admin of the organization
CREATE POLICY invitations_insert_policy ON invitations
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.org_id = invitations.org_id
            AND p.role IN ('owner', 'admin')
            AND p.is_deleted = FALSE
        )
    );

-- Update: same as select (for cancel / status update by owner/admin)
CREATE POLICY invitations_update_policy ON invitations
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.org_id = invitations.org_id
            AND p.role IN ('owner', 'admin')
            AND p.is_deleted = FALSE
        )
    );

-- Delete: same as select
CREATE POLICY invitations_delete_policy ON invitations
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.org_id = invitations.org_id
            AND p.role IN ('owner', 'admin')
            AND p.is_deleted = FALSE
        )
    );
