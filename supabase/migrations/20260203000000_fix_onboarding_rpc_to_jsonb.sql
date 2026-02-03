-- =============================================================================
-- Fix to_jsonb type error in onboarding RPCs
-- オンボーディングRPCの to_jsonb 型エラーを修正
--
-- Problem: to_jsonb('buyer') fails with "could not determine polymorphic type
-- because input has type unknown". PostgreSQL cannot infer the type of a
-- string literal passed to a polymorphic function.
--
-- Fix: Cast string literals explicitly: to_jsonb('buyer'::text)
--
-- Rollback:
--   Re-run 20260201000000_restore_trigger_and_onboarding_rpc.sql
--   (the original functions will be restored with CREATE OR REPLACE)
-- =============================================================================

-- Fix complete_buyer_onboarding: cast 'buyer' to text
CREATE OR REPLACE FUNCTION complete_buyer_onboarding(
    p_user_id UUID,
    p_company_name TEXT,
    p_contact_email TEXT,
    p_display_name TEXT,
    p_billing_customer_id TEXT,
    p_industry TEXT,
    p_employee_count TEXT,
    p_purpose TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_org_id UUID;
    v_application_id UUID;
BEGIN
    -- Check if user already has organization
    IF EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id AND org_id IS NOT NULL) THEN
        RAISE EXCEPTION 'User already has an organization';
    END IF;

    -- 1. Create organization
    INSERT INTO organizations (
        name,
        type,
        status,
        billing_customer_id,
        created_at,
        updated_at
    ) VALUES (
        p_company_name,
        'buyer',
        'active',
        p_billing_customer_id,
        NOW(),
        NOW()
    )
    RETURNING id INTO v_org_id;

    -- 2. Update profile
    UPDATE profiles
    SET
        org_id = v_org_id,
        display_name = p_display_name,
        email = p_contact_email,
        status = 'active',
        updated_at = NOW()
    WHERE id = p_user_id;

    -- 3. Update auth.users metadata (for audit log)
    UPDATE auth.users
    SET
        raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{org_type}',
            to_jsonb('buyer'::text)
        )
    WHERE id = p_user_id;

    -- 4. Create buyer application
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

    -- Return created IDs
    RETURN jsonb_build_object(
        'organization_id', v_org_id,
        'profile_id', p_user_id,
        'application_id', v_application_id,
        'status', 'active'
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

-- Fix complete_vendor_onboarding: cast 'vendor' to text
CREATE OR REPLACE FUNCTION complete_vendor_onboarding(
    p_user_id UUID,
    p_company_name TEXT,
    p_contact_email TEXT,
    p_display_name TEXT,
    p_billing_customer_id TEXT,
    p_industry TEXT,
    p_employee_count TEXT,
    p_business_description TEXT,
    p_service_description TEXT,
    p_website_url TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_org_id UUID;
    v_application_id UUID;
BEGIN
    -- Check if user already has organization
    IF EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id AND org_id IS NOT NULL) THEN
        RAISE EXCEPTION 'User already has an organization';
    END IF;

    -- 1. Create organization
    INSERT INTO organizations (
        name,
        type,
        status,
        billing_customer_id,
        created_at,
        updated_at
    ) VALUES (
        p_company_name,
        'vendor',
        'active',
        p_billing_customer_id,
        NOW(),
        NOW()
    )
    RETURNING id INTO v_org_id;

    -- 2. Update profile
    UPDATE profiles
    SET
        org_id = v_org_id,
        display_name = p_display_name,
        email = p_contact_email,
        status = 'active',
        updated_at = NOW()
    WHERE id = p_user_id;

    -- 3. Update auth.users metadata (for audit log)
    UPDATE auth.users
    SET
        raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{org_type}',
            to_jsonb('vendor'::text)
        )
    WHERE id = p_user_id;

    -- 4. Create vendor application
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

    -- Return created IDs
    RETURN jsonb_build_object(
        'organization_id', v_org_id,
        'profile_id', p_user_id,
        'application_id', v_application_id,
        'status', 'active'
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;
