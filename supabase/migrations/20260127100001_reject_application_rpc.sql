-- =============================================================================
-- reject_application RPC
-- 利用申請却下用RPC関数
-- Application Rejection時: application のステータスのみ更新
-- organizations, profiles は pending のまま
-- =============================================================================

CREATE OR REPLACE FUNCTION reject_application(
    p_application_id UUID,
    p_admin_id UUID,
    p_review_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_org_id UUID;
    v_org_type TEXT;
    v_ba RECORD;
    v_va RECORD;
BEGIN
    -- 1. Try to find in buyer_applications first
    SELECT * INTO v_ba FROM buyer_applications WHERE id = p_application_id AND is_deleted = FALSE;

    IF FOUND THEN
        -- Check status
        IF v_ba.status != 'pending' THEN
            RAISE EXCEPTION 'Application is not pending. Current status: %', v_ba.status;
        END IF;

        v_org_id := v_ba.org_id;
        v_org_type := 'buyer';

        -- Update application only (NOT organization or profiles)
        UPDATE buyer_applications
        SET status = 'rejected',
            review_note = p_review_note,
            reviewed_by = p_admin_id,
            reviewed_at = NOW(),
            updated_by = p_admin_id,
            updated_at = NOW()
        WHERE id = p_application_id;

        RETURN jsonb_build_object(
            'status', 'rejected',
            'application_id', p_application_id,
            'org_id', v_org_id,
            'org_type', v_org_type,
            'review_note', p_review_note
        );
    END IF;

    -- 2. Try vendor_applications
    SELECT * INTO v_va FROM vendor_applications WHERE id = p_application_id AND is_deleted = FALSE;

    IF FOUND THEN
        -- Check status
        IF v_va.status != 'pending' THEN
            RAISE EXCEPTION 'Application is not pending. Current status: %', v_va.status;
        END IF;

        v_org_id := v_va.org_id;
        v_org_type := 'vendor';

        -- Update application only (NOT organization or profiles)
        UPDATE vendor_applications
        SET status = 'rejected',
            review_note = p_review_note,
            reviewed_by = p_admin_id,
            reviewed_at = NOW(),
            updated_by = p_admin_id,
            updated_at = NOW()
        WHERE id = p_application_id;

        RETURN jsonb_build_object(
            'status', 'rejected',
            'application_id', p_application_id,
            'org_id', v_org_id,
            'org_type', v_org_type,
            'review_note', p_review_note
        );
    END IF;

    -- Not found in either table
    RAISE EXCEPTION 'Application not found: %', p_application_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION reject_application(UUID, UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION reject_application(UUID, UUID, TEXT) TO authenticated;

COMMENT ON FUNCTION reject_application(UUID, UUID, TEXT) IS
'利用申請却下RPC: application.status を rejected に更新。
organizations, profiles は pending のまま変更しない。
review_note に却下理由を記録可能。';
