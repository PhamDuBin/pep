-- =============================================================================
-- create_signup RPC
-- Self-Signup用のRPC関数
-- organizations, profiles, buyer/vendor_applications を1トランザクションで作成
-- =============================================================================

CREATE OR REPLACE FUNCTION create_signup(
    p_user_id UUID,
    p_org_type TEXT,
    p_company_name TEXT,
    p_contact_email TEXT,
    p_display_name TEXT,
    p_industry TEXT DEFAULT NULL,
    p_employee_count TEXT DEFAULT NULL,
    -- Buyer only
    p_purpose TEXT DEFAULT NULL,
    -- Vendor only
    p_business_description TEXT DEFAULT NULL,
    p_service_description TEXT DEFAULT NULL,
    p_website_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_org_id UUID;
    v_profile_id UUID;
    v_application_id UUID;
BEGIN
    -- Validate org_type
    IF p_org_type NOT IN ('buyer', 'vendor') THEN
        RAISE EXCEPTION 'Invalid org_type: %. Must be buyer or vendor', p_org_type;
    END IF;

    -- 1. Create organization (status = 'pending')
    INSERT INTO organizations (
        name,
        type,
        status,
        created_at,
        updated_at
    ) VALUES (
        p_company_name,
        p_org_type,
        'pending',
        NOW(),
        NOW()
    )
    RETURNING id INTO v_org_id;

    -- 2. Update profile with org_id (profile is created by handle_new_user trigger)
    -- If profile doesn't exist yet, create it.
    -- Set is_deleted = false so re-registration (previously soft-deleted account) works.
    UPDATE profiles
    SET
        org_id = v_org_id,
        display_name = p_display_name,
        email = p_contact_email,
        role = 'owner',
        status = 'pending',
        is_deleted = FALSE,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Check if profile was updated
    IF NOT FOUND THEN
        -- Profile doesn't exist, create it
        INSERT INTO profiles (
            id,
            org_id,
            email,
            display_name,
            role,
            status,
            created_at,
            updated_at
        ) VALUES (
            p_user_id,
            v_org_id,
            p_contact_email,
            p_display_name,
            'owner',
            'pending',
            NOW(),
            NOW()
        );
    END IF;

    v_profile_id := p_user_id;

    -- 3. Create application based on org_type
    IF p_org_type = 'buyer' THEN
        INSERT INTO buyer_applications (
            org_id,
            company_name,
            contact_email,
            industry,
            employee_count,
            purpose,
            status,
            created_by,
            created_at,
            updated_at
        ) VALUES (
            v_org_id,
            p_company_name,
            p_contact_email,
            p_industry,
            p_employee_count,
            p_purpose,
            'pending',
            p_user_id,
            NOW(),
            NOW()
        )
        RETURNING id INTO v_application_id;
    ELSE
        -- Vendor
        INSERT INTO vendor_applications (
            org_id,
            company_name,
            contact_email,
            industry,
            employee_count,
            business_description,
            service_description,
            website_url,
            status,
            created_by,
            created_at,
            updated_at
        ) VALUES (
            v_org_id,
            p_company_name,
            p_contact_email,
            p_industry,
            p_employee_count,
            p_business_description,
            p_service_description,
            p_website_url,
            'pending',
            p_user_id,
            NOW(),
            NOW()
        )
        RETURNING id INTO v_application_id;
    END IF;

    -- Return created IDs
    RETURN jsonb_build_object(
        'organization_id', v_org_id,
        'profile_id', v_profile_id,
        'application_id', v_application_id
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Re-raise the exception (transaction will be rolled back)
        RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_signup TO authenticated;
GRANT EXECUTE ON FUNCTION create_signup TO service_role;

COMMENT ON FUNCTION create_signup IS 'Self-Signup用RPC: organizations, profiles, applications を1トランザクションで作成';
