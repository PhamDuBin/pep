-- =============================================================================
-- Restore handle_new_user trigger and create onboarding RPCs
-- handle_new_userトリガーを復元し、オンボーディングRPCを作成
--
-- Background: Previous migration (20260130000000) removed the trigger and
-- simplified create_signup RPC. This migration restores the trigger-based flow
-- and creates separate onboarding RPCs for buyer/vendor.
--
-- 背景: 前回マイグレーション(20260130000000)でトリガーを削除しcreate_signup RPCを
-- 簡略化した。本マイグレーションでトリガーベースのフローを復元し、
-- buyer/vendor別のオンボーディングRPCを作成する。
--
-- Rollback / ロールバック手順:
--   1. DROP FUNCTION IF EXISTS complete_buyer_onboarding(UUID,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT);
--   2. DROP FUNCTION IF EXISTS complete_vendor_onboarding(UUID,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT);
--   3. DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--   4. DROP FUNCTION IF EXISTS public.handle_new_user();
--   5. DROP INDEX IF EXISTS idx_profiles_pending_no_org;
--   6. Restore create_signup RPC from 20260130000000 if needed.
-- =============================================================================

-- 1. Revert soft-deleted orphan profiles from previous migration
-- 前回マイグレーションで論理削除した孤立profilesを元に戻す
UPDATE profiles
SET is_deleted = FALSE, updated_at = NOW()
WHERE org_id IS NULL
  AND status = 'pending'
  AND is_deleted = TRUE;

-- 2. Drop the simplified create_signup RPC from previous migration
-- 前回作成した簡略化create_signup RPCを削除
DROP FUNCTION IF EXISTS create_signup(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

-- 3. Restore handle_new_user trigger function
-- handle_new_userトリガー関数を復元
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_org_id UUID;
    v_role TEXT;
    v_status TEXT;
BEGIN
    -- Get org_id from user metadata if provided (for invitation flow)
    -- 招待フローの場合はメタデータからorg_idを取得
    v_org_id := (NEW.raw_user_meta_data->>'org_id')::UUID;

    -- Get role from metadata, default to 'owner' for self-signup
    -- セルフサインアップの場合はデフォルトで'owner'
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'owner');
    IF v_role NOT IN ('owner', 'admin', 'member') THEN
        v_role := 'owner';
    END IF;

    -- Set status based on whether org_id is provided
    -- org_idの有無に基づいてステータスを設定
    IF v_org_id IS NOT NULL THEN
        v_status := 'active';  -- Invitation flow
    ELSE
        v_status := 'pending'; -- Self-signup flow
    END IF;

    -- Create profile
    INSERT INTO public.profiles (id, org_id, email, display_name, role, status)
    VALUES (
        NEW.id,
        v_org_id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        v_role,
        v_status
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Restore trigger on auth.users
-- auth.usersのトリガーを復元
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Restore index for pending users without organization
-- 組織未所属のpendingユーザー用インデックスを復元
CREATE INDEX IF NOT EXISTS idx_profiles_pending_no_org
    ON profiles(status)
    WHERE org_id IS NULL AND status = 'pending';

COMMENT ON FUNCTION public.handle_new_user() IS
'Creates profile on user signup. For self-signup, creates pending profile without org_id. For invitation flow, creates active profile with org_id.
ユーザー登録時にプロフィールを作成。セルフサインアップの場合はorg_idなしのpending状態、招待フローの場合はorg_id付きのactive状態で作成。';

-- =============================================================================
-- complete_buyer_onboarding RPC
-- Buyerオンボーディング完了用のRPC関数
-- =============================================================================

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
            to_jsonb('buyer')
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

-- =============================================================================
-- complete_vendor_onboarding RPC
-- Vendorオンボーディング完了用のRPC関数
-- =============================================================================

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
            to_jsonb('vendor')
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

-- Grant execute permissions
-- 権限付与
REVOKE ALL ON FUNCTION complete_buyer_onboarding(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION complete_buyer_onboarding(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION complete_buyer_onboarding(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_buyer_onboarding(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

REVOKE ALL ON FUNCTION complete_vendor_onboarding(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION complete_vendor_onboarding(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION complete_vendor_onboarding(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_vendor_onboarding(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

-- Comments
COMMENT ON FUNCTION complete_buyer_onboarding IS
'Complete buyer onboarding: create organization (type=buyer), update profile to active, create buyer_application, and update user metadata.
Buyerオンボーディング完了: 組織作成(type=buyer)、プロフィールをactiveに更新、buyer_application作成、ユーザーメタデータ更新を1トランザクションで実行。';

COMMENT ON FUNCTION complete_vendor_onboarding IS
'Complete vendor onboarding: create organization (type=vendor), update profile to active, create vendor_application, and update user metadata.
Vendorオンボーディング完了: 組織作成(type=vendor)、プロフィールをactiveに更新、vendor_application作成、ユーザーメタデータ更新を1トランザクションで実行。';
