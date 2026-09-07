from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from uuid import UUID


class RegisterRequest(BaseModel):
    """Request body for user registration."""
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    role: str  # 'artisan' or 'buyer'
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    craft_category: Optional[str] = None
    bio: Optional[str] = None
    group_name: Optional[str] = None
    monthly_capacity: Optional[int] = None
    bulk_capable: bool = False

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("artisan", "buyer", "admin"):
            raise ValueError("role must be 'artisan', 'buyer', or 'admin'")
        return v

    @field_validator("email", "phone")
    @classmethod
    def at_least_one_contact(cls, v, info):
        # Validation happens at model level
        return v
    
    def model_post_init(self, __context) -> None:
        if not self.email and not self.phone:
            raise ValueError("At least one of email or phone must be provided")


class LoginRequest(BaseModel):
    """Request body for login. Provide email or phone + password."""
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str

    def model_post_init(self, __context) -> None:
        if not self.email and not self.phone:
            raise ValueError("Provide either email or phone")


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Public user info returned after auth operations."""
    id: UUID
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    craft_category: Optional[str] = None
    bio: Optional[str] = None
    trust_score: int
    is_kyc_verified: bool
    avatar_url: Optional[str] = None
    group_name: Optional[str] = None
    monthly_capacity: Optional[int] = None
    bulk_capable: bool = False

    model_config = {"from_attributes": True}
