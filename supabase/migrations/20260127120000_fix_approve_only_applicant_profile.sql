-- =============================================================================
-- Fix approve_application: update only the applicant's profile, not all
-- profiles in the org.
-- 承認時は申請人の profile のみ active に更新。組織内の他メンバーは更新しない。
-- =============================================================================

CREATE OR REPLACE FUNCTION approve_application(
    p_application_id UUID,
    p_admin_id UUID
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
    v_applicant_profile_id UUID;
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

        -- 2. Update application
        UPDATE buyer_applications
        SET status = 'approved',
            reviewed_by = p_admin_id,
            reviewed_at = NOW(),
            updated_by = p_admin_id,
            updated_at = NOW()
        WHERE id = p_application_id;

        -- 3. Update organization
        UPDATE organizations
        SET status = 'active',
            updated_by = p_admin_id,
            updated_at = NOW()
        WHERE id = v_org_id;

        -- 4. Copy buyer_applications → buyer_org_details (UPSERT by org_id)
        INSERT INTO buyer_org_details (
            org_id, industry, employee_count, purpose,
            created_by, created_at, updated_by, updated_at
        ) VALUES (
            v_org_id, v_ba.industry, v_ba.employee_count, v_ba.purpose,
            p_admin_id, NOW(), p_admin_id, NOW()
        )
        ON CONFLICT (org_id) DO UPDATE SET
            industry = EXCLUDED.industry,
            employee_count = EXCLUDED.employee_count,
            purpose = EXCLUDED.purpose,
            updated_by = p_admin_id,
            updated_at = NOW();

        -- 5. Update only the applicant's profile (created_by on application; fallback: org.created_by)
        v_applicant_profile_id := v_ba.created_by;
        IF v_applicant_profile_id IS NULL THEN
            SELECT created_by INTO v_applicant_profile_id FROM organizations WHERE id = v_org_id;
        END IF;
        IF v_applicant_profile_id IS NOT NULL THEN
            UPDATE profiles
            SET status = 'active',
                updated_by = p_admin_id,
                updated_at = NOW()
            WHERE id = v_applicant_profile_id AND is_deleted = FALSE;
        END IF;

        RETURN jsonb_build_object(
            'status', 'approved',
            'application_id', p_application_id,
            'org_id', v_org_id,
            'org_type', v_org_type
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

        -- 2. Update application
        UPDATE vendor_applications
        SET status = 'approved',
            reviewed_by = p_admin_id,
            reviewed_at = NOW(),
            updated_by = p_admin_id,
            updated_at = NOW()
        WHERE id = p_application_id;

        -- 3. Update organization
        UPDATE organizations
        SET status = 'active',
            updated_by = p_admin_id,
            updated_at = NOW()
        WHERE id = v_org_id;

        -- 4. Copy vendor_applications → vendor_org_details (UPSERT by org_id)
        INSERT INTO vendor_org_details (
            org_id, industry, employee_count, business_description,
            service_description, website_url,
            created_by, created_at, updated_by, updated_at
        ) VALUES (
            v_org_id, v_va.industry, v_va.employee_count, v_va.business_description,
            v_va.service_description, v_va.website_url,
            p_admin_id, NOW(), p_admin_id, NOW()
        )
        ON CONFLICT (org_id) DO UPDATE SET
            industry = EXCLUDED.industry,
            employee_count = EXCLUDED.employee_count,
            business_description = EXCLUDED.business_description,
            service_description = EXCLUDED.service_description,
            website_url = EXCLUDED.website_url,
            updated_by = p_admin_id,
            updated_at = NOW();

        -- 5. Update only the applicant's profile (created_by on application; fallback: org.created_by)
        v_applicant_profile_id := v_va.created_by;
        IF v_applicant_profile_id IS NULL THEN
            SELECT created_by INTO v_applicant_profile_id FROM organizations WHERE id = v_org_id;
        END IF;
        IF v_applicant_profile_id IS NOT NULL THEN
            UPDATE profiles
            SET status = 'active',
                updated_by = p_admin_id,
                updated_at = NOW()
            WHERE id = v_applicant_profile_id AND is_deleted = FALSE;
        END IF;

        RETURN jsonb_build_object(
            'status', 'approved',
            'application_id', p_application_id,
            'org_id', v_org_id,
            'org_type', v_org_type
        );
    END IF;

    -- Not found in either table
    RAISE EXCEPTION 'Application not found: %', p_application_id;

EXCEPTION
    WHEN OTHERS THEN
        -- Re-raise the exception (transaction will be rolled back)
        RAISE;
END;
$$;

COMMENT ON FUNCTION approve_application(UUID, UUID) IS
'利用申請承認RPC: application/organization を active/approved に更新し、
申請人の profile のみ status=active に更新（組織内の他メンバーは更新しない）。
applications → org_details へデータコピー。
buyer_applications / vendor_applications のいずれかで id が pending のときのみ成功。';
