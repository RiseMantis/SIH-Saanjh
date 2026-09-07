import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional

from app.db import get_db
from app.schemas.catalog import CatalogRequest, CatalogResponse, PricingRequest, PricingResponse
from app.services.cataloger import generate_catalog_entry
from app.services.pricing import calculate_pricing, get_market_anchor

router = APIRouter(prefix="/catalog", tags=["catalog"])

@router.post("/generate", response_model=CatalogResponse)
async def generate_listing(
    request: CatalogRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Takes voice transcript and optional image tags.
    Generates SEO-friendly title, bilingual English/Hindi descriptions, category, and tags.
    Inserts a record in ai_audit_log with action_type='listing_generated'.
    """
    result = await generate_catalog_entry(request.transcript, request.image_tags)

    # Insert into ai_audit_log
    try:
        query = text("""
            INSERT INTO ai_audit_log (
                id, action_type, input_summary, output_summary, reason_code
            ) VALUES (
                gen_random_uuid(), 'listing_generated', :input_summary, :output_summary, 'ai_cataloger_v1'
            )
        """)
        input_data = {
            "transcript_preview": request.transcript[:150],
            "tags": request.image_tags
        }
        await db.execute(query, {
            "input_summary": json.dumps(input_data),
            "output_summary": json.dumps(result)
        })
    except Exception as e:
        # Do not block response if logging encounters an issue
        pass

    return result

@router.post("/pricing", response_model=PricingResponse)
async def suggest_pricing(
    request: PricingRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Computes fair, market-informed pricing with a strict cost floor.
    Inserts a record in ai_audit_log with action_type='price_suggested'.
    """
    hourly_rate = 60.0
    cost_floor = request.raw_material_cost + (request.estimated_hours * hourly_rate)

    market_anchor = await get_market_anchor(request.category, cost_floor, db)

    price_min, price_max, explanation = calculate_pricing(
        raw_material_cost=request.raw_material_cost,
        estimated_hours=request.estimated_hours,
        intricacy_score=request.intricacy_score,
        market_anchor=market_anchor,
        seasonality_multiplier=request.seasonality_multiplier
    )

    # Insert into ai_audit_log
    try:
        query = text("""
            INSERT INTO ai_audit_log (
                id, action_type, input_summary, output_summary, reason_code
            ) VALUES (
                gen_random_uuid(), 'price_suggested', :input_summary, :output_summary, 'pricing_v1_cost_floor'
            )
        """)
        input_data = {
            "raw_material_cost": request.raw_material_cost,
            "estimated_hours": request.estimated_hours,
            "intricacy": request.intricacy_score,
            "category": request.category,
            "market_anchor": market_anchor,
            "cost_floor": cost_floor
        }
        output_data = {
            "price_min": price_min,
            "price_max": price_max,
            "explanation": explanation
        }
        await db.execute(query, {
            "input_summary": json.dumps(input_data),
            "output_summary": json.dumps(output_data)
        })
    except Exception:
        pass

    return {
        "price_min": price_min,
        "price_max": price_max,
        "explanation": explanation
    }
