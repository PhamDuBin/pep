-- =============================================================================
-- Task 005: Add profiles.deleted_at for member removal (soft delete)
-- メンバー削除（ソフトデリート）用に deleted_at を追加
-- =============================================================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

COMMENT ON COLUMN profiles.deleted_at IS 'Set when profile is soft-deleted (member removal). Null when is_deleted = false.';
