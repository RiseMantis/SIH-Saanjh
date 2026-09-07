from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from uuid import UUID

from app.db import get_db

router = APIRouter(prefix="/artisans", tags=["artisans"])

@router.get("/{id}")
async def get_artisan_profile(id: UUID, db: AsyncSession = Depends(get_db)):
    """
    Public profile endpoint for an artisan.
    Returns artisan information, published portfolio listings, and cluster membership.
    """
    artisan_q = text("""
        SELECT id, name, village, district, state, craft_category, bio,
               trust_score, is_kyc_verified, avatar_url, group_name,
               monthly_capacity, bulk_capable, created_at
        FROM users
        WHERE id = :id AND role = 'artisan'
    """)
    artisan_res = await db.execute(artisan_q, {"id": str(id)})
    artisan = artisan_res.mappings().first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found")

    # Fetch published listings
    listings_q = text("""
        SELECT id, title, description_en, description_hi, category, tags,
               price, price_min, price_max, created_at
        FROM listings
        WHERE artisan_id = :id AND status = 'published'
        ORDER BY created_at DESC
    """)
    listings_res = await db.execute(listings_q, {"id": str(id)})
    listings = []
    for row in listings_res.mappings().all():
        l_item = dict(row)
        media_res = await db.execute(
            text("SELECT id, media_type, url FROM listing_media WHERE listing_id = :lid LIMIT 2"),
            {"lid": str(row["id"])}
        )
        l_item["media"] = [dict(m) for m in media_res.mappings().all()]
        listings.append(l_item)

    # Fetch cluster membership
    cluster_q = text("""
        SELECT c.id, c.name, c.region, c.craft_category, cm.joined_at
        FROM cluster_members cm
        JOIN clusters c ON cm.cluster_id = c.id
        WHERE cm.user_id = :id
    """)
    cluster_res = await db.execute(cluster_q, {"id": str(id)})
    clusters = [dict(c) for c in cluster_res.mappings().all()]

    profile = dict(artisan)
    profile["portfolio"] = listings
    profile["clusters"] = clusters
    return profile
