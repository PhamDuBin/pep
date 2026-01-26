-- Fix handle_new_user trigger to support org_id from user metadata
-- ユーザーメタデータからorg_idを取得するようにトリガーを修正
--
-- This allows user signup with organization assignment via:
-- この修正により、以下の方法で組織を指定してユーザー登録が可能:
--
-- 1. Invitation flow: org_id is passed in user metadata
--    招待フロー: org_idがユーザーメタデータで渡される
--
-- 2. Self-signup: profile is created without org_id (pending state)
--    セルフサインアップ: org_idなしでprofileが作成される（保留状態）

-- First, make org_id nullable to support pending users
-- まず、保留ユーザーをサポートするためにorg_idをnullableに変更
ALTER TABLE profiles ALTER COLUMN org_id DROP NOT NULL;

-- Update the trigger function to handle org_id from metadata
-- メタデータからorg_idを取得するようにトリガー関数を更新
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_org_id UUID;
    v_role TEXT;
    v_status TEXT;
BEGIN
    -- Get org_id from user metadata if provided (e.g., from invitation)
    -- 招待などでユーザーメタデータにorg_idが含まれている場合は取得
    v_org_id := (NEW.raw_user_meta_data->>'org_id')::UUID;

    -- Get role from metadata, default to 'member'
    -- メタデータからロールを取得、デフォルトは'member'
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'member');
    IF v_role NOT IN ('owner', 'admin', 'member') THEN
        v_role := 'member';
    END IF;

    -- Set status based on whether org_id is provided
    -- org_idの有無に基づいてステータスを設定
    IF v_org_id IS NOT NULL THEN
        v_status := 'active';
    ELSE
        v_status := 'pending';
    END IF;

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

-- Add comment explaining the behavior
COMMENT ON FUNCTION public.handle_new_user() IS
'Creates profile on user signup. If org_id is in metadata (from invitation), user is active. Otherwise, user is pending until assigned to an organization.
ユーザー登録時にプロフィールを作成。メタデータにorg_idがあれば（招待経由）activeに、なければ組織割り当てまでpendingに設定。';

-- Add index for finding pending users without organization
-- 組織未割り当てユーザーを検索するためのインデックス追加
CREATE INDEX IF NOT EXISTS idx_profiles_pending_no_org
    ON profiles(status)
    WHERE org_id IS NULL AND status = 'pending';
