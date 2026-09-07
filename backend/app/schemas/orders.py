from pydantic import BaseModel, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime


class OrderCreate(BaseModel):
    """Create a new order."""
    listing_id: Optional[UUID] = None
    requirement_id: Optional[UUID] = None
    artisan_id: UUID
    quantity: int = 1
    total_amount: float


class OrderStatusUpdate(BaseModel):
    """Update order status."""
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        valid = {"confirmed", "shipped", "delivered", "completed", "disputed"}
        if v not in valid:
            raise ValueError(f"status must be one of {valid}")
        return v


class OrderResponse(BaseModel):
    """Order detail."""
    id: UUID
    buyer_id: UUID
    artisan_id: UUID
    listing_id: Optional[UUID] = None
    requirement_id: Optional[UUID] = None
    quantity: int
    total_amount: float
    status: str
    placed_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
