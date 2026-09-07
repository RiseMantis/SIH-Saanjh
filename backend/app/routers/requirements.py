from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List, Optional
from uuid import UUID

from app.db import get_db
from app.routers.auth import get_current_user
from app.schemas.requirements import RequirementCreate, RequirementResponse, MatchResultResponse
from app.services.matching import find_matches_for_requirement

router = APIRouter(prefix="/requirements", tags=["requirements"])

@router.post("", response_model=RequirementResponse)
async def create_requirement(
    data: RequirementCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Creates a new B2B bulk sourcing requirement for the authenticated buyer.
    """
    buyer_id = current_user["id"]
    query = text("""
        INSERT INTO requirements (
            id, buyer_id, title, description, category, quantity,
            max_unit_price, preferred_state, delivery_deadline, status
        ) VALUES (
            gen_random_uuid(), :buyer_id, :title, :description, :category, :quantity,
            :max_unit_price, :preferred_state, :delivery_deadline, 'open'
        ) RETURNING *
    """)
    params = {
        "buyer_id": str(buyer_id),
        "title": data.title,
        "description": data.description,
        "category": data.category,
        "quantity": data.quantity,
        "max_unit_price": data.max_unit_price,
        "preferred_state": data.preferred_state,
        "delivery_deadline": data.delivery_deadline
    }
    res = await db.execute(query, params)
    row = res.mappings().first()
    return dict(row)

@router.get("/{id}/matches", response_model=List[MatchResultResponse])
async def get_requirement_matches(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Ranks top artisans and clusters matching the requirement criteria
    (category match 40%, location match 20%, price fit 25%, trust score contribution 15%).
    """
    req_res = await db.execute(
        text("SELECT * FROM requirements WHERE id = :id"),
        {"id": str(id)}
    )
    requirement = req_res.mappings().first()
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")

    matches = await find_matches_for_requirement(dict(requirement), db, limit=10)
    return matches

@router.get("", response_model=List[RequirementResponse])
async def list_my_requirements(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Lists requirements posted by the current user.
    """
    res = await db.execute(
        text("SELECT * FROM requirements WHERE buyer_id = :buyer_id ORDER BY created_at DESC"),
        {"buyer_id": str(current_user["id"])}
    )
    rows = res.mappings().all()
    return [dict(r) for r in rows]
