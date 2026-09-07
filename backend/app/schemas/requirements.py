from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import date, datetime


class RequirementCreate(BaseModel):
    """Create a new B2B requirement."""
    title: str
    description: Optional[str] = None
    category: str
    quantity: int
    max_unit_price: Optional[float] = None
    preferred_state: Optional[str] = None
    delivery_deadline: Optional[date] = None


class RequirementResponse(BaseModel):
    """Requirement detail."""
    id: UUID
    buyer_id: UUID
    title: str
    description: Optional[str] = None
    category: str
    quantity: int
    max_unit_price: Optional[float] = None
    preferred_state: Optional[str] = None
    delivery_deadline: Optional[date] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class MatchResultResponse(BaseModel):
    """A scored match between a requirement and an artisan."""
    artisan_id: UUID
    artisan_name: str
    village: Optional[str] = None
    state: Optional[str] = None
    craft_category: Optional[str] = None
    trust_score: int
    monthly_capacity: Optional[int] = None
    bulk_capable: bool
    score: float
    breakdown: Dict[str, Any]
