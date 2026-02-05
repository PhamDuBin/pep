-- =============================================================================
-- transfer_ownership RPC
-- Owner移譲用のRPC関数
--
-- Transfers organization ownership from current owner to another member.
-- 組織のオーナー権限を別のメンバーに移譲する。
--
-- Rollback / ロールバック手順:
--   1. DROP FUNCTION IF EXISTS transfer_ownership(UUID, UUID, UUID);
-- =============================================================================

CREATE OR REPLACE FUNCTION transfer_ownership(
    p_org_id UUID,
    p_current_owner_id UUID,
    p_new_owner_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 1. Verify current owner is actually owner of this org
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = p_current_owner_id
          AND org_id = p_org_id
          AND role = 'owner'
          AND is_deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Current user is not the owner of this organization';
    END IF;

    -- 2. Verify new owner is an active member of the same org
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = p_new_owner_id
          AND org_id = p_org_id
          AND status = 'active'
          AND is_deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Target user is not an active member of this organization';
    END IF;

    -- 3. Prevent self-transfer
    IF p_current_owner_id = p_new_owner_id THEN
        RAISE EXCEPTION 'Cannot transfer ownership to yourself';
    END IF;

    -- 4. Demote current owner to admin
    UPDATE profiles
    SET role = 'admin', updated_at = NOW(), updated_by = p_current_owner_id
    WHERE id = p_current_owner_id AND org_id = p_org_id;

    -- 5. Promote new owner
    UPDATE profiles
    SET role = 'owner', updated_at = NOW(), updated_by = p_current_owner_id
    WHERE id = p_new_owner_id AND org_id = p_org_id;

    RETURN jsonb_build_object(
        'org_id', p_org_id,
        'previous_owner_id', p_current_owner_id,
        'new_owner_id', p_new_owner_id,
        'status', 'transferred'
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

-- Grant permissions
REVOKE ALL ON FUNCTION transfer_ownership(UUID, UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION transfer_ownership(UUID, UUID, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION transfer_ownership(UUID, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION transfer_ownership(UUID, UUID, UUID) TO service_role;

COMMENT ON FUNCTION transfer_ownership IS
'Transfer organization ownership: demote current owner to admin, promote target member to owner. Both operations run in a single transaction.
Owner移譲: 現オーナーをadminに降格、対象メンバーをownerに昇格。単一トランザクション内で実行。';
