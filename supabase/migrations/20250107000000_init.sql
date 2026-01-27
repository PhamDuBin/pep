-- PEP Database Schema
-- Initial migration: All tables matching database.md ERD
-- 全テーブルを database.md ERD に合わせて定義

-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Organizations table
-- 組織テーブル（Buyer/Vendor/Platform）
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('buyer', 'vendor', 'platform')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
    billing_customer_id TEXT,
    billing_email TEXT,
    payment_method_type TEXT CHECK (payment_method_type IN ('card', 'invoice')),
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE organizations IS 'Buyer/Vendor/Platform organizations / 組織';
COMMENT ON COLUMN organizations.type IS 'buyer | vendor | platform';
COMMENT ON COLUMN organizations.status IS 'active | inactive | pending | suspended';
COMMENT ON COLUMN organizations.billing_customer_id IS 'Stripe Customer ID (cus_xxxx)';
COMMENT ON COLUMN organizations.billing_email IS 'Billing email address / 請求書送付先メール';
COMMENT ON COLUMN organizations.payment_method_type IS 'card (Buyer) or invoice (Vendor)';

-- ============================================
-- Profiles table (linked to auth.users)
-- ユーザープロフィールテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id),
    email TEXT,
    display_name TEXT,
    department TEXT,
    avatar_url TEXT,
    avatar_color TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Add FK for organizations.created_by after profiles exists
ALTER TABLE organizations ADD CONSTRAINT fk_organizations_created_by
    FOREIGN KEY (created_by) REFERENCES profiles(id);
ALTER TABLE organizations ADD CONSTRAINT fk_organizations_updated_by
    FOREIGN KEY (updated_by) REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE profiles IS 'User profiles linked to auth.users / ユーザープロフィール';
COMMENT ON COLUMN profiles.role IS 'owner | admin | member';
COMMENT ON COLUMN profiles.status IS 'active | inactive | pending';

-- ============================================
-- Buyer organization details (1:1)
-- Buyer組織の詳細情報
-- ============================================
CREATE TABLE IF NOT EXISTS buyer_org_details (
    org_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
    industry TEXT,
    employee_count TEXT,
    purpose TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TRIGGER update_buyer_org_details_updated_at
    BEFORE UPDATE ON buyer_org_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE buyer_org_details IS 'Buyer organization details / Buyer組織の詳細情報';

-- ============================================
-- Vendor organization details (1:1)
-- Vendor組織の詳細情報
-- ============================================
CREATE TABLE IF NOT EXISTS vendor_org_details (
    org_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
    industry TEXT,
    employee_count TEXT,
    business_description TEXT,
    service_description TEXT,
    website_url TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TRIGGER update_vendor_org_details_updated_at
    BEFORE UPDATE ON vendor_org_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE vendor_org_details IS 'Vendor organization details / Vendor組織の詳細情報';

-- ============================================
-- Invitations table
-- 招待テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_invitations_org_id ON invitations(org_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);

CREATE TRIGGER update_invitations_updated_at
    BEFORE UPDATE ON invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE invitations IS 'Member invitation tokens / メンバー招待トークン';

-- ============================================
-- Buyer applications table
-- Buyer利用申請テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS buyer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    industry TEXT,
    employee_count TEXT,
    purpose TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id),
    review_note TEXT,
    reviewed_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(org_id)
);

CREATE INDEX IF NOT EXISTS idx_buyer_applications_org_id ON buyer_applications(org_id);
CREATE INDEX IF NOT EXISTS idx_buyer_applications_status ON buyer_applications(status);

CREATE TRIGGER update_buyer_applications_updated_at
    BEFORE UPDATE ON buyer_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE buyer_applications IS 'Buyer application for approval / Buyer利用申請';

-- ============================================
-- Vendor applications table
-- Vendor利用申請テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS vendor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    industry TEXT,
    employee_count TEXT,
    business_description TEXT,
    service_description TEXT,
    website_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id),
    review_note TEXT,
    reviewed_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(org_id)
);

CREATE INDEX IF NOT EXISTS idx_vendor_applications_org_id ON vendor_applications(org_id);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status ON vendor_applications(status);

CREATE TRIGGER update_vendor_applications_updated_at
    BEFORE UPDATE ON vendor_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE vendor_applications IS 'Vendor application for approval / Vendor利用申請';

-- ============================================
-- Projects table
-- RFIプロジェクトテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_org_id UUID NOT NULL REFERENCES organizations(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_discussion', 'closed')),
    started_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_projects_buyer_org_id ON projects(buyer_org_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE projects IS 'RFI projects / RFIプロジェクト';
COMMENT ON COLUMN projects.status IS 'draft | in_discussion | closed';

-- ============================================
-- Project vendors table
-- プロジェクトとVendorの紐付けテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS project_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    vendor_org_id UUID NOT NULL REFERENCES organizations(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'read')),
    notified_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(project_id, vendor_org_id)
);

CREATE INDEX IF NOT EXISTS idx_project_vendors_project_id ON project_vendors(project_id);
CREATE INDEX IF NOT EXISTS idx_project_vendors_vendor_org_id ON project_vendors(vendor_org_id);

CREATE TRIGGER update_project_vendors_updated_at
    BEFORE UPDATE ON project_vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE project_vendors IS 'Project-Vendor assignments / プロジェクトとVendorの紐付け';

-- ============================================
-- Project attachments table
-- プロジェクト添付ファイルテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS project_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_project_attachments_project_id ON project_attachments(project_id);

CREATE TRIGGER update_project_attachments_updated_at
    BEFORE UPDATE ON project_attachments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE project_attachments IS 'Manually attached files / 手動添付ファイル';
COMMENT ON COLUMN project_attachments.file_path IS 'Supabase Storage path';

-- ============================================
-- AI Chat sessions table
-- AIチャットセッションテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    project_id UUID REFERENCES projects(id),
    title TEXT,
    is_presentation_mode BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_project_id ON ai_chat_sessions(project_id);

CREATE TRIGGER update_ai_chat_sessions_updated_at
    BEFORE UPDATE ON ai_chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE ai_chat_sessions IS 'AI chat sessions for RFI drafting / RFI草案作成用AIチャットセッション';
COMMENT ON COLUMN ai_chat_sessions.is_presentation_mode IS 'For slide generation';

-- ============================================
-- AI Chat messages table
-- AIチャットメッセージテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding vector(1536),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);

CREATE TRIGGER update_ai_chat_messages_updated_at
    BEFORE UPDATE ON ai_chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE ai_chat_messages IS 'AI chat messages with embeddings / embedding付きAIチャットメッセージ';
COMMENT ON COLUMN ai_chat_messages.embedding IS 'pgvector, 1536 dim (OpenAI ada-002)';

-- ============================================
-- Project plans table
-- プロジェクト計画書テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS project_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ai_session_id UUID REFERENCES ai_chat_sessions(id),
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_project_plans_project_id ON project_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_project_plans_ai_session_id ON project_plans(ai_session_id);

CREATE TRIGGER update_project_plans_updated_at
    BEFORE UPDATE ON project_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE project_plans IS 'Project plans generated by AI / AI生成のプロジェクト計画書';
COMMENT ON COLUMN project_plans.ai_session_id IS 'Source AI session / 生成元AIセッション';

-- ============================================
-- Project plan vendors table
-- 計画書のVendor送信記録テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS project_plan_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES project_plans(id) ON DELETE CASCADE,
    vendor_org_id UUID NOT NULL REFERENCES organizations(id),
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(plan_id, vendor_org_id)
);

CREATE INDEX IF NOT EXISTS idx_project_plan_vendors_plan_id ON project_plan_vendors(plan_id);
CREATE INDEX IF NOT EXISTS idx_project_plan_vendors_vendor_org_id ON project_plan_vendors(vendor_org_id);

CREATE TRIGGER update_project_plan_vendors_updated_at
    BEFORE UPDATE ON project_plan_vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE project_plan_vendors IS 'Plan-Vendor delivery records / 計画書のVendor送信記録';

-- ============================================
-- Chat rooms table
-- Buyer-Vendorチャットルームテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    buyer_org_id UUID NOT NULL REFERENCES organizations(id),
    vendor_org_id UUID NOT NULL REFERENCES organizations(id),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(project_id, buyer_org_id, vendor_org_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_rooms_project_id ON chat_rooms(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_buyer_org_id ON chat_rooms(buyer_org_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_vendor_org_id ON chat_rooms(vendor_org_id);

CREATE TRIGGER update_chat_rooms_updated_at
    BEFORE UPDATE ON chat_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE chat_rooms IS 'Buyer-Vendor chat rooms per project / プロジェクト毎のBuyer-Vendorチャットルーム';

-- ============================================
-- Chat room members table
-- チャットルーム参加者テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS chat_room_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_room_members_room_id ON chat_room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_members_user_id ON chat_room_members(user_id);

CREATE TRIGGER update_chat_room_members_updated_at
    BEFORE UPDATE ON chat_room_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE chat_room_members IS 'Chat room participants / チャットルーム参加者';

-- ============================================
-- Chat messages table
-- チャットメッセージテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
    file_url TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE chat_messages IS 'Chat messages / チャットメッセージ';
COMMENT ON COLUMN chat_messages.message_type IS 'text | file | system';
COMMENT ON COLUMN chat_messages.sender_id IS 'Same as created_by / created_byと同義';

-- ============================================
-- Chat read status table
-- 既読状態テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS chat_read_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_read_status_room_id ON chat_read_status(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_read_status_user_id ON chat_read_status(user_id);

CREATE TRIGGER update_chat_read_status_updated_at
    BEFORE UPDATE ON chat_read_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE chat_read_status IS 'Read status for unread badge / 既読状態（未読バッジ用）';

-- ============================================
-- Subscriptions table
-- Buyerサブスクリプション管理テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_subscription_item_id TEXT,
    status TEXT NOT NULL DEFAULT 'incomplete'
        CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid', 'paused')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    plan_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE subscriptions IS 'Buyer subscription management / Buyerサブスクリプション管理';
COMMENT ON COLUMN subscriptions.stripe_subscription_id IS 'Stripe Subscription ID (sub_xxxx)';
COMMENT ON COLUMN subscriptions.stripe_subscription_item_id IS 'Stripe Subscription Item ID (si_xxxx) for metered billing';
COMMENT ON COLUMN subscriptions.status IS 'Subscription status synced from Stripe';

-- ============================================
-- Usage records table
-- 従量課金の利用記録テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    usage_type TEXT NOT NULL DEFAULT 'document_generation'
        CHECK (usage_type IN ('document_generation')),
    quantity INT NOT NULL DEFAULT 1,
    description TEXT,
    stripe_usage_record_id TEXT,
    reported_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_records_organization_id ON usage_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_subscription_id ON usage_records(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_usage_type ON usage_records(usage_type);
CREATE INDEX IF NOT EXISTS idx_usage_records_created_at ON usage_records(created_at);

COMMENT ON TABLE usage_records IS 'Metered billing usage records / 従量課金の利用記録';
COMMENT ON COLUMN usage_records.usage_type IS 'Type of usage: document_generation';
COMMENT ON COLUMN usage_records.stripe_usage_record_id IS 'Stripe Usage Record ID after reporting';

-- ============================================
-- Invoices table
-- 請求書履歴テーブル（Stripeから同期）
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
    amount_due INT NOT NULL DEFAULT 0,
    amount_paid INT NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'jpy',
    invoice_number TEXT,
    description TEXT,
    invoice_pdf TEXT,
    hosted_invoice_url TEXT,
    due_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE invoices IS 'Invoice history synced from Stripe / 請求書履歴（Stripeから同期）';
COMMENT ON COLUMN invoices.stripe_invoice_id IS 'Stripe Invoice ID (inv_xxxx)';
COMMENT ON COLUMN invoices.status IS 'draft | open | paid | void | uncollectible';

-- ============================================
-- Stripe event logs table
-- Stripe Webhookイベントログ（冪等性・監査証跡用）
-- ============================================
CREATE TABLE IF NOT EXISTS stripe_event_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processing_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (processing_status IN ('pending', 'processed', 'failed', 'skipped')),
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stripe_event_logs_event_id ON stripe_event_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_stripe_event_logs_event_type ON stripe_event_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_event_logs_organization_id ON stripe_event_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_stripe_event_logs_processing_status ON stripe_event_logs(processing_status);
CREATE INDEX IF NOT EXISTS idx_stripe_event_logs_created_at ON stripe_event_logs(created_at);

COMMENT ON TABLE stripe_event_logs IS 'Stripe webhook event logs for idempotency and audit / Stripeイベントログ';
COMMENT ON COLUMN stripe_event_logs.event_id IS 'Stripe event ID (evt_xxxx) - used for idempotency';

-- ============================================
-- Notifications table
-- アプリ内通知テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    type TEXT NOT NULL DEFAULT 'system'
        CHECK (type IN ('project_created', 'chat_message', 'payment_failed', 'application_approved', 'invitation_received', 'system')),
    title TEXT NOT NULL,
    body TEXT,
    link_url TEXT,
    reference_id UUID,
    reference_type TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_org_id ON notifications(org_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

COMMENT ON TABLE notifications IS 'In-app notifications / アプリ内通知';
COMMENT ON COLUMN notifications.type IS 'Notification type / 通知種別';
COMMENT ON COLUMN notifications.reference_id IS 'Related entity ID (project, chat_room, etc.)';

-- ============================================
-- Audit logs table
-- 監査ログテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON audit_logs(org_id, created_at);

COMMENT ON TABLE audit_logs IS 'Operation audit logs for security and compliance / 監査ログ';
COMMENT ON COLUMN audit_logs.actor_id IS 'User who performed the action (null for system)';
COMMENT ON COLUMN audit_logs.action IS 'Action type: create, update, delete, login, logout, etc.';

-- ============================================
-- Enable Row Level Security on all tables
-- ============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_org_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_org_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_plan_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_read_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Basic RLS Policies
-- 基本的なRLSポリシー（詳細は各タスクで追加）
-- ============================================

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Organizations: Members can view their organization
CREATE POLICY "Members can view their organization"
    ON organizations FOR SELECT
    USING (
        id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Platform admins can view all organizations
CREATE POLICY "Platform admins can view all organizations"
    ON organizations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN organizations o ON p.org_id = o.id
            WHERE p.id = auth.uid()
            AND o.type = 'platform'
        )
    );

-- Projects: Buyer org members can view their projects
CREATE POLICY "Buyer members can view their projects"
    ON projects FOR SELECT
    USING (
        buyer_org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Notifications: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Subscriptions: Organization members can view their subscription
CREATE POLICY "Organization members can view own subscription"
    ON subscriptions FOR SELECT
    USING (
        organization_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Platform admins can view all subscriptions
CREATE POLICY "Platform admins can view all subscriptions"
    ON subscriptions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN organizations o ON p.org_id = o.id
            WHERE p.id = auth.uid()
            AND o.type = 'platform'
        )
    );

-- Invoices: Organization members can view their invoices
CREATE POLICY "Organization members can view own invoices"
    ON invoices FOR SELECT
    USING (
        organization_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Platform admins can view all invoices
CREATE POLICY "Platform admins can view all invoices"
    ON invoices FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN organizations o ON p.org_id = o.id
            WHERE p.id = auth.uid()
            AND o.type = 'platform'
        )
    );

-- Audit logs: Platform admins can view all
CREATE POLICY "Platform admins can view all audit logs"
    ON audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN organizations o ON p.org_id = o.id
            WHERE p.id = auth.uid()
            AND o.type = 'platform'
        )
    );

-- Org admins can view their org's audit logs
CREATE POLICY "Org admins can view own org audit logs"
    ON audit_logs FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- ============================================
-- Function to auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
