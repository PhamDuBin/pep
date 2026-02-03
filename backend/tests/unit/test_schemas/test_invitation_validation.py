"""Invitation schema validation tests."""

import pytest
from pydantic import ValidationError

from app.schemas.invitation import (
    InvitationCreateRequest,
    AcceptInvitationRequest,
)


class TestInvitationCreateRequestValidation:
    """Tests for InvitationCreateRequest schema validation."""

    def test_valid_admin_invitation(self):
        """Valid admin invitation passes."""
        data = InvitationCreateRequest(
            email="test@example.com",
            role="admin"
        )
        assert data.email == "test@example.com"
        assert data.role == "admin"

    def test_valid_member_invitation(self):
        """Valid member invitation passes."""
        data = InvitationCreateRequest(
            email="test@example.com",
            role="member"
        )
        assert data.role == "member"

    def test_invalid_email(self):
        """Invalid email fails."""
        with pytest.raises(ValidationError) as exc_info:
            InvitationCreateRequest(
                email="not-an-email",
                role="member"
            )
        assert "value is not a valid email address" in str(exc_info.value)

    def test_email_required(self):
        """email is required."""
        with pytest.raises(ValidationError) as exc_info:
            InvitationCreateRequest(role="member")
        assert "email" in str(exc_info.value)

    def test_role_required(self):
        """role is required."""
        with pytest.raises(ValidationError) as exc_info:
            InvitationCreateRequest(email="test@example.com")
        assert "role" in str(exc_info.value)

    def test_invalid_role_owner(self):
        """role='owner' fails (only admin/member allowed)."""
        with pytest.raises(ValidationError) as exc_info:
            InvitationCreateRequest(
                email="test@example.com",
                role="owner"
            )
        assert "Input should be 'admin' or 'member'" in str(exc_info.value)

    def test_invalid_role_arbitrary(self):
        """Arbitrary role fails."""
        with pytest.raises(ValidationError) as exc_info:
            InvitationCreateRequest(
                email="test@example.com",
                role="superuser"
            )
        assert "Input should be 'admin' or 'member'" in str(exc_info.value)


class TestAcceptInvitationRequestValidation:
    """Tests for AcceptInvitationRequest schema validation."""

    def test_valid_user_id(self):
        """Valid user_id passes."""
        data = AcceptInvitationRequest(user_id="user-uuid-12345")
        assert data.user_id == "user-uuid-12345"

    def test_user_id_required(self):
        """user_id is required."""
        with pytest.raises(ValidationError) as exc_info:
            AcceptInvitationRequest()
        assert "user_id" in str(exc_info.value)

    def test_user_id_empty_string(self):
        """Empty user_id passes (no min_length constraint)."""
        # Note: This might be a gap - consider adding min_length=1
        data = AcceptInvitationRequest(user_id="")
        assert data.user_id == ""
