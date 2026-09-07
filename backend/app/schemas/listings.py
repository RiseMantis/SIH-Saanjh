from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class ListingCreate(BaseModel):
    """Create a new listing (draft)."""
    client_uuid: Optional[UUID] = None  # For idempotent upsert
    title: Optional[str] = None
    description_en: Optional[str] = None
    description_hi: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = []
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    price: Optional[float] = None


class ListingUpdate(BaseModel):
    """Update an existing listing."""
    title: Optional[str] = None
    description_en: Optional[str] = None
    description_hi: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    price: Optional[float] = None


class MediaResponse(BaseModel):
    """A media item attached to a listing."""
    id: UUID
    media_type: str
    url: str


class ListingResponse(BaseModel):
    """Full listing response."""
    id: UUID
    client_uuid: Optional[UUID] = None
    artisan_id: UUID
    artisan_name: Optional[str] = None
    artisan_village: Optional[str] = None
    title: Optional[str] = None
    description_en: Optional[str] = None
    description_hi: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = []
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    price: Optional[float] = None
    status: str
    media: List[MediaResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ListingListResponse(BaseModel):
    """Paginated listing list."""
    items: List[ListingResponse]
    total: int
    limit: int
    offset: int
