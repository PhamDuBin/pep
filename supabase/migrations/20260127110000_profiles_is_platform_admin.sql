-- =============================================================================
-- profiles.is_platform_admin
-- Platform Admin 判定用フラグ（002 Application Approval の権限チェックに使用）
-- =============================================================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_platform_admin BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN profiles.is_platform_admin IS
'True if this user is a platform administrator (can approve/reject applications).';
