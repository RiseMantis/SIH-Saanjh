from pydantic import BaseModel
from typing import Optional, List


class CatalogRequest(BaseModel):
    """Request to generate a listing from transcript."""
    transcript: str
    image_tags: Optional[List[str]] = None


class CatalogResponse(BaseModel):
    """AI-generated listing fields."""
    title: str
    description_en: str
    description_hi: str
    category: str
    tags: List[str]


class PricingRequest(BaseModel):
    """Request for pricing suggestion."""
    raw_material_cost: float
    estimated_hours: float
    intricacy_score: float = 3.0  # 1-5 scale
    category: str
    seasonality_multiplier: float = 1.0


class PricingResponse(BaseModel):
    """AI pricing suggestion."""
    price_min: float
    price_max: float
    explanation: str
