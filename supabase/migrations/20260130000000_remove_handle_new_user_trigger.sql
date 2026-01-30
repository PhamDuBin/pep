-- =============================================================================
-- Remove handle_new_user trigger and simplify create_signup RPC
-- handle_new_userトリガーを削除し、create_signup RPCを簡略化
--
-- Background: The trigger auto-created profiles with org_id=NULL on auth.users
-- creation. This caused ambiguous state (profile exists but signup incomplete).
-- Now profiles are created ONLY within RPC functions (create_signup, and future
-- accept_invitation).
--
-- 背景: トリガーがauth.users作成時にorg_id=NULLのprofileを自動生成していたが、
-- 曖昧な状態（profileは存在するがsignup未完了）を引き起こしていた。
-- 今後profileはRPC関数内でのみ作成される。
-- =============================================================================

-- 1. Drop the trigger on auth.users
-- auth.usersのトリガーを削除
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop the trigger function
-- トリガー関数を削除
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Drop the index that was only needed for trigger-created profiles
-- トリガー作成profilesのためだけに存在したインデックスを削除
DROP INDEX IF EXISTS idx_profiles_pending_no_org;

-- 4. Clean up orphan profiles (created by trigger, never completed signup)
-- 孤立profileの削除（トリガーで作成されたがsignup未完了のもの）
-- auth.usersは削除しない（ユーザーは再度signupを実行可能）

-- 4. Soft-delete orphan profiles (created by trigger, never completed signup)
-- 孤立profileの論理削除（トリガーで作成されたがsignup未完了のもの）
-- 物理削除するとFK参照違反が発生するため、is_deleted=TRUEで論理削除
-- auth.usersは削除しない（ユーザーは再度signupを実行可能）
UPDATE profiles
SET is_deleted = TRUE, updated_at = NOW()
WHERE org_id IS NULL
  AND status = 'pending'
  AND is_deleted = FALSE;

-- 5. Replace create_signup RPC with simplified INSERT logic
-- create_signup RPCをシンプルなINSERTロジックに置き換え
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

    -- 2. Create profile (simple INSERT - no trigger creates it beforehand)
    -- プロフィール作成（シンプルなINSERT - トリガーによる事前作成なし）
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
        RAISE;
END;
$$;

-- 6. Re-apply permissions (CREATE OR REPLACE may reset them)
-- 権限を再適用
REVOKE ALL ON FUNCTION create_signup(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION create_signup(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION create_signup(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_signup(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

COMMENT ON FUNCTION create_signup IS
'Self-Signup RPC: Creates organization, profile, and application in a single transaction.
Profile is created directly (no trigger). Only authenticated users and service_role can execute.
サインアップRPC: 組織・プロフィール・申請を1トランザクションで作成。
プロフィールは直接INSERT（トリガーなし）。authenticated/service_roleのみ実行可能。';
