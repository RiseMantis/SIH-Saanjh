from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional
from uuid import UUID
from datetime import datetime, timezone, timedelta

from app.db import get_db

router = APIRouter(prefix="/mock", tags=["mock-integrations"])

class SyncRequest(BaseModel):
    listing_id: UUID

@router.post("/gem-sync")
async def mock_gem_sync(data: SyncRequest):
    """
    Simulates Government e-Marketplace (GeM) catalog synchronization.
    Returns simulated GeM catalog item ID and status.
    """
    now = datetime.now(timezone.utc).isoformat()
    return {
        "status": "synced",
        "platform": "Government e-Marketplace (GeM)",
        "listing_id": str(data.listing_id),
        "external_id": f"GEM-CAT-{str(data.listing_id)[:8].upper()}-IN",
        "synced_at": now,
        "compliance": {
            "make_in_india_verified": True,
            "artisan_msme_exemption": "Applicable",
            "tier": "Direct Purchase Eligible"
        }
    }

@router.post("/ondc-sync")
async def mock_ondc_sync(data: SyncRequest):
    """
    Simulates Open Network for Digital Commerce (ONDC) network registry publishing.
    """
    now = datetime.now(timezone.utc).isoformat()
    return {
        "status": "published",
        "platform": "ONDC Open Commerce Network",
        "listing_id": str(data.listing_id),
        "bpp_id": "artisan-bpp.open-network.nic.in",
        "item_id": f"ONDC-SKU-{str(data.listing_id)[:8].upper()}",
        "synced_at": now,
        "network_broadcast": "Active across 14 buyer apps (Paytm, Mystore, Pincode)"
    }

@router.get("/day1-payment/{order_id}")
async def mock_day1_payment(order_id: UUID, db: AsyncSession = Depends(get_db)):
    """
    Renders the worked Day-1 payment timeline for invoice financing:
    - Day 0: Order placed & confirmed
    - Day 1: 90% upfront advanced to artisan to fund raw materials & wages
    - Day 15: Dispatched & verified
    - Day 30: Buyer invoice settles & 10% remaining reconciled
    """
    total_amount = 18000.0  # Fallback default
    try:
        res = await db.execute(
            text("SELECT total_amount, placed_at, status FROM orders WHERE id = :id"),
            {"id": str(order_id)}
        )
        row = res.mappings().first()
        if row and row["total_amount"]:
            total_amount = float(row["total_amount"])
    except Exception:
        pass

    upfront_90 = round(total_amount * 0.90, 2)
    settle_10 = round(total_amount * 0.10, 2)
    now = datetime.now(timezone.utc)

    return {
        "order_id": str(order_id),
        "order_total": total_amount,
        "financing_model": "Day-1 Working Capital Advance",
        "currency": "INR",
        "timeline": [
            {
                "stage": "Day 0",
                "title": "Order Confirmed & PO Issued",
                "date": now.strftime("%d %b %Y"),
                "status": "completed",
                "amount": total_amount,
                "description": "Buyer issues bulk purchase order. Escrow guarantees funds."
            },
            {
                "stage": "Day 1",
                "title": "90% Working Capital Disbursed",
                "date": (now + timedelta(days=1)).strftime("%d %b %Y"),
                "status": "active",
                "amount": upfront_90,
                "description": f"₹{upfront_90:,.0f} released immediately to artisan's Aadhaar/UPI account to procure raw materials."
            },
            {
                "stage": "Day 15",
                "title": "Craft Inspection & Dispatch",
                "date": (now + timedelta(days=15)).strftime("%d %b %Y"),
                "status": "upcoming",
                "amount": None,
                "description": "Cluster coordinator inspects batch quality and initiates logistics shipment."
            },
            {
                "stage": "Day 30",
                "title": "Buyer Settlement & 10% Retention Release",
                "date": (now + timedelta(days=30)).strftime("%d %b %Y"),
                "status": "upcoming",
                "amount": settle_10,
                "description": f"Buyer settles 30-day invoice. Remaining ₹{settle_10:,.0f} retention transferred to artisan."
            }
        ]
    }
