-- PEP Seed Data
-- 初期データ（Platform組織 + 開発用サンプルデータ）
--
-- Usage / 使用方法:
--   supabase db reset  (applies migrations + seed)
--   or: psql -f supabase/seed.sql
--
-- Note: Users must be created via Supabase Auth (Dashboard or API)
--       Then update their profile with the correct org_id
-- 注意: ユーザーはSupabase Auth経由で作成し、
--       その後profilesのorg_idを更新する必要があります

-- ============================================
-- 1. Platform Organization (REQUIRED)
-- プラットフォーム組織（必須）
-- ============================================
INSERT INTO organizations (id, name, type, status, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'PEP Platform',
    'platform',
    'active',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. Sample Buyer Organization (Development)
-- サンプルBuyer組織（開発用）
-- ============================================
INSERT INTO organizations (id, name, type, status, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    'Sample Buyer Corp',
    'buyer',
    'active',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO buyer_org_details (org_id, industry, employee_count, purpose, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    'IT/Software',
    '100-499',
    'Development and testing',
    NOW(),
    NOW()
) ON CONFLICT (org_id) DO NOTHING;

-- ============================================
-- 3. Sample Vendor Organization (Development)
-- サンプルVendor組織（開発用）
-- ============================================
INSERT INTO organizations (id, name, type, status, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000020',
    'Sample Vendor Inc',
    'vendor',
    'active',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO vendor_org_details (org_id, industry, employee_count, business_description, service_description, website_url, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000020',
    'IT/Software',
    '50-99',
    'Software development and consulting',
    'Custom software development, System integration, Cloud migration',
    'https://example-vendor.com',
    NOW(),
    NOW()
) ON CONFLICT (org_id) DO NOTHING;

-- ============================================
-- 4. Sample Vendor Organization 2 (Development)
-- サンプルVendor組織2（開発用）
-- ============================================
INSERT INTO organizations (id, name, type, status, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000021',
    'Tech Solutions Ltd',
    'vendor',
    'active',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO vendor_org_details (org_id, industry, employee_count, business_description, service_description, website_url, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000021',
    'IT Services',
    '10-49',
    'IT consulting and managed services',
    'Infrastructure management, Security consulting, DevOps support',
    'https://tech-solutions.example.com',
    NOW(),
    NOW()
) ON CONFLICT (org_id) DO NOTHING;

-- ============================================
-- User Creation Instructions / ユーザー作成手順
-- ============================================
--
-- After running this seed, create users via Supabase Dashboard:
-- このシードを実行後、Supabase Dashboardでユーザーを作成:
--
-- 1. Go to Authentication > Users > Add user
-- 2. Create user with email/password
-- 3. Copy the user's UUID
-- 4. Update the profile with correct org_id:
--
-- Example SQL to update profile org_id:
-- プロフィールのorg_id更新SQLの例:
--
-- -- Platform Admin user
-- UPDATE profiles
-- SET org_id = '00000000-0000-0000-0000-000000000001',
--     role = 'owner',
--     status = 'active'
-- WHERE id = '<USER_UUID_HERE>';
--
-- -- Buyer Admin user
-- UPDATE profiles
-- SET org_id = '00000000-0000-0000-0000-000000000010',
--     role = 'owner',
--     status = 'active'
-- WHERE id = '<USER_UUID_HERE>';
--
-- -- Vendor Admin user
-- UPDATE profiles
-- SET org_id = '00000000-0000-0000-0000-000000000020',
--     role = 'owner',
--     status = 'active'
-- WHERE id = '<USER_UUID_HERE>';
--
-- ============================================

-- Verification query / 確認クエリ
-- SELECT id, name, type, status FROM organizations ORDER BY id;
