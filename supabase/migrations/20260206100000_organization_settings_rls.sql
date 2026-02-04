-- Organization settings RLS policies (Task 01-10)
-- Allow owner/admin to UPDATE organizations, and manage org details.

-- ============================================
-- Organizations: owner/admin can UPDATE own organization
-- ============================================
CREATE POLICY "Org owner or admin can update own organization"
    ON organizations FOR UPDATE
    USING (
        id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid()
            AND is_deleted = FALSE
            AND role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid()
            AND is_deleted = FALSE
            AND role IN ('owner', 'admin')
        )
    );

-- ============================================
-- buyer_org_details: members can SELECT, owner/admin can INSERT/UPDATE
-- ============================================
CREATE POLICY "Org members can view buyer_org_details"
    ON buyer_org_details FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid() AND is_deleted = FALSE
        )
    );

CREATE POLICY "Org owner or admin can insert buyer_org_details"
    ON buyer_org_details FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid()
            AND is_deleted = FALSE
            AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Org owner or admin can update buyer_org_details"
    ON buyer_org_details FOR UPDATE
    USING (
        org_id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid()
            AND is_deleted = FALSE
            AND role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        org_id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid()
            AND is_deleted = FALSE
            AND role IN ('owner', 'admin')
        )
    );

-- ============================================
-- vendor_org_details: members can SELECT, owner/admin can INSERT/UPDATE
-- ============================================
CREATE POLICY "Org members can view vendor_org_details"
    ON vendor_org_details FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid() AND is_deleted = FALSE
        )
    );

CREATE POLICY "Org owner or admin can insert vendor_org_details"
    ON vendor_org_details FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid()
            AND is_deleted = FALSE
            AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Org owner or admin can update vendor_org_details"
    ON vendor_org_details FOR UPDATE
    USING (
        org_id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid()
            AND is_deleted = FALSE
            AND role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        org_id IN (
            SELECT org_id FROM profiles
            WHERE id = auth.uid()
            AND is_deleted = FALSE
            AND role IN ('owner', 'admin')
        )
    );
