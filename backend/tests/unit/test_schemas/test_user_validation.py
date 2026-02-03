"""User schema validation tests."""

import pytest
from pydantic import ValidationError

from app.schemas.user import (
    UserProfileUpdate,
    AvatarUpdate,
    PasswordChange,
    EmailChangeRequest,
)


class TestUserProfileUpdateValidation:
    """Tests for UserProfileUpdate schema validation."""

    def test_valid_display_name(self):
        """Valid display_name passes."""
        data = UserProfileUpdate(display_name="Test User")
        assert data.display_name == "Test User"

    def test_display_name_min_length(self):
        """Empty display_name fails (min_length=1)."""
        with pytest.raises(ValidationError) as exc_info:
            UserProfileUpdate(display_name="")
        assert "String should have at least 1 character" in str(exc_info.value)

    def test_display_name_max_length(self):
        """display_name over 100 chars fails."""
        with pytest.raises(ValidationError) as exc_info:
            UserProfileUpdate(display_name="x" * 101)
        assert "String should have at most 100 characters" in str(exc_info.value)

    def test_display_name_exactly_100_chars(self):
        """display_name exactly 100 chars passes."""
        data = UserProfileUpdate(display_name="x" * 100)
        assert len(data.display_name) == 100

    def test_department_max_length(self):
        """department over 100 chars fails."""
        with pytest.raises(ValidationError) as exc_info:
            UserProfileUpdate(department="x" * 101)
        assert "String should have at most 100 characters" in str(exc_info.value)

    def test_department_optional(self):
        """department is optional."""
        data = UserProfileUpdate()
        assert data.department is None

    def test_all_fields_optional(self):
        """All fields are optional."""
        data = UserProfileUpdate()
        assert data.display_name is None
        assert data.department is None


class TestAvatarUpdateValidation:
    """Tests for AvatarUpdate schema validation."""

    def test_valid_hex_color(self):
        """Valid hex color passes."""
        data = AvatarUpdate(avatar_color="#FF5733")
        assert data.avatar_color == "#FF5733"

    def test_valid_hex_color_lowercase(self):
        """Lowercase hex color passes."""
        data = AvatarUpdate(avatar_color="#ff5733")
        assert data.avatar_color == "#ff5733"

    def test_invalid_color_no_hash(self):
        """Color without # fails."""
        with pytest.raises(ValidationError) as exc_info:
            AvatarUpdate(avatar_color="FF5733")
        assert "String should match pattern" in str(exc_info.value)

    def test_invalid_color_short(self):
        """3-digit hex color fails (requires 6 digits)."""
        with pytest.raises(ValidationError) as exc_info:
            AvatarUpdate(avatar_color="#FFF")
        assert "String should match pattern" in str(exc_info.value)

    def test_invalid_color_too_long(self):
        """8-digit hex color fails."""
        with pytest.raises(ValidationError) as exc_info:
            AvatarUpdate(avatar_color="#FF5733FF")
        assert "String should match pattern" in str(exc_info.value)

    def test_invalid_color_non_hex(self):
        """Non-hex characters fail."""
        with pytest.raises(ValidationError) as exc_info:
            AvatarUpdate(avatar_color="#GGGGGG")
        assert "String should match pattern" in str(exc_info.value)

    def test_avatar_color_optional(self):
        """avatar_color is optional."""
        data = AvatarUpdate()
        assert data.avatar_color is None

    def test_avatar_url_optional(self):
        """avatar_url is optional."""
        data = AvatarUpdate()
        assert data.avatar_url is None


class TestPasswordChangeValidation:
    """Tests for PasswordChange schema validation."""

    def test_valid_passwords(self):
        """Valid passwords pass."""
        data = PasswordChange(
            current_password="oldpassword123",
            new_password="newpassword456"
        )
        assert data.current_password == "oldpassword123"
        assert data.new_password == "newpassword456"

    def test_current_password_too_short(self):
        """current_password under 8 chars fails."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordChange(
                current_password="short",
                new_password="validpassword"
            )
        assert "String should have at least 8 characters" in str(exc_info.value)

    def test_new_password_too_short(self):
        """new_password under 8 chars fails."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordChange(
                current_password="validpassword",
                new_password="short"
            )
        assert "String should have at least 8 characters" in str(exc_info.value)

    def test_new_password_too_long(self):
        """new_password over 72 chars fails."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordChange(
                current_password="validpassword",
                new_password="x" * 73
            )
        assert "String should have at most 72 characters" in str(exc_info.value)

    def test_new_password_exactly_72_chars(self):
        """new_password exactly 72 chars passes."""
        data = PasswordChange(
            current_password="validpassword",
            new_password="x" * 72
        )
        assert len(data.new_password) == 72

    def test_current_password_required(self):
        """current_password is required."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordChange(new_password="validpassword")
        assert "current_password" in str(exc_info.value)

    def test_new_password_required(self):
        """new_password is required."""
        with pytest.raises(ValidationError) as exc_info:
            PasswordChange(current_password="validpassword")
        assert "new_password" in str(exc_info.value)


class TestEmailChangeRequestValidation:
    """Tests for EmailChangeRequest schema validation."""

    def test_valid_email(self):
        """Valid email passes."""
        data = EmailChangeRequest(new_email="test@example.com")
        assert data.new_email == "test@example.com"

    def test_invalid_email_no_at(self):
        """Email without @ fails."""
        with pytest.raises(ValidationError) as exc_info:
            EmailChangeRequest(new_email="testexample.com")
        assert "value is not a valid email address" in str(exc_info.value)

    def test_invalid_email_no_domain(self):
        """Email without domain fails."""
        with pytest.raises(ValidationError) as exc_info:
            EmailChangeRequest(new_email="test@")
        assert "value is not a valid email address" in str(exc_info.value)

    def test_invalid_email_spaces(self):
        """Email with spaces fails."""
        with pytest.raises(ValidationError) as exc_info:
            EmailChangeRequest(new_email="test @example.com")
        assert "value is not a valid email address" in str(exc_info.value)

    def test_new_email_required(self):
        """new_email is required."""
        with pytest.raises(ValidationError) as exc_info:
            EmailChangeRequest()
        assert "new_email" in str(exc_info.value)
