from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional, List
from uuid import UUID

from app.db import get_db
from app.routers.auth import get_current_user
from app.schemas.listings import ListingCreate, ListingUpdate, ListingResponse, ListingListResponse, MediaResponse

router = APIRouter(prefix="/listings", tags=["listings"])

@router.post("", response_model=ListingResponse)
async def create_listing(
    data: ListingCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Creates or idempotently upserts a listing draft for the authenticated artisan.
    Uses client_uuid for offline-first deduplication.
    """
    artisan_id = current_user["id"]

    # Check for existing client_uuid (idempotent upsert)
    if data.client_uuid:
        existing = await db.execute(
            text("SELECT * FROM listings WHERE client_uuid = :client_uuid"),
            {"client_uuid": str(data.client_uuid)}
        )
        row = existing.mappings().first()
        if row:
            # Check ownership
            if str(row["artisan_id"]) != str(artisan_id):
                raise HTTPException(status_code=403, detail="Not authorized to edit this listing")
            
            # Update draft
            update_q = text("""
                UPDATE listings SET
                    title = COALESCE(:title, title),
                    description_en = COALESCE(:description_en, description_en),
                    description_hi = COALESCE(:description_hi, description_hi),
                    category = COALESCE(:category, category),
                    tags = COALESCE(:tags, tags),
                    price_min = COALESCE(:price_min, price_min),
                    price_max = COALESCE(:price_max, price_max),
                    price = COALESCE(:price, price),
                    updated_at = now()
                WHERE id = :id
                RETURNING *
            """)
            res = await db.execute(update_q, {
                "id": row["id"],
                "title": data.title,
                "description_en": data.description_en,
                "description_hi": data.description_hi,
                "category": data.category,
                "tags": data.tags or [],
                "price_min": data.price_min,
                "price_max": data.price_max,
                "price": data.price
            })
            updated = res.mappings().first()
            return dict(updated)

    # Insert new listing
    insert_q = text("""
        INSERT INTO listings (
            id, client_uuid, artisan_id, title, description_en, description_hi,
            category, tags, price_min, price_max, price, status
        ) VALUES (
            gen_random_uuid(), :client_uuid, :artisan_id, :title, :description_en, :description_hi,
            :category, :tags, :price_min, :price_max, :price, 'draft'
        ) RETURNING *
    """)
    res = await db.execute(insert_q, {
        "client_uuid": str(data.client_uuid) if data.client_uuid else None,
        "artisan_id": str(artisan_id),
        "title": data.title,
        "description_en": data.description_en,
        "description_hi": data.description_hi,
        "category": data.category,
        "tags": data.tags or [],
        "price_min": data.price_min,
        "price_max": data.price_max,
        "price": data.price
    })
    created = res.mappings().first()
    return dict(created)

@router.patch("/{id}", response_model=ListingResponse)
async def update_listing(
    id: UUID,
    data: ListingUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Updates an existing listing. Verifies that current_user is the owner.
    """
    existing = await db.execute(
        text("SELECT * FROM listings WHERE id = :id"),
        {"id": str(id)}
    )
    row = existing.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Listing not found")
    if str(row["artisan_id"]) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="You do not own this listing")

    update_q = text("""
        UPDATE listings SET
            title = COALESCE(:title, title),
            description_en = COALESCE(:description_en, description_en),
            description_hi = COALESCE(:description_hi, description_hi),
            category = COALESCE(:category, category),
            tags = COALESCE(:tags, tags),
            price_min = COALESCE(:price_min, price_min),
            price_max = COALESCE(:price_max, price_max),
            price = COALESCE(:price, price),
            updated_at = now()
        WHERE id = :id
        RETURNING *
    """)
    res = await db.execute(update_q, {
        "id": str(id),
        "title": data.title,
        "description_en": data.description_en,
        "description_hi": data.description_hi,
        "category": data.category,
        "tags": data.tags if data.tags is not None else row["tags"],
        "price_min": data.price_min,
        "price_max": data.price_max,
        "price": data.price
    })
    updated = res.mappings().first()
    return dict(updated)

@router.post("/{id}/publish", response_model=ListingResponse)
async def publish_listing(
    id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Publishes a listing draft. Requires non-null title, price, and category.
    """
    existing = await db.execute(
        text("SELECT * FROM listings WHERE id = :id"),
        {"id": str(id)}
    )
    row = existing.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Listing not found")
    if str(row["artisan_id"]) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="You do not own this listing")

    # Validate core fields
    if not row["title"] or not row["title"].strip():
        raise HTTPException(status_code=400, detail="Title is required to publish")
    if not row["category"]:
        raise HTTPException(status_code=400, detail="Category is required to publish")
    if row["price"] is None and (row["price_min"] is None or row["price_max"] is None):
        raise HTTPException(status_code=400, detail="Price is required to publish")

    res = await db.execute(
        text("UPDATE listings SET status = 'published', updated_at = now() WHERE id = :id RETURNING *"),
        {"id": str(id)}
    )
    published = res.mappings().first()
    return dict(published)

@router.get("/{id}", response_model=ListingResponse)
async def get_listing(id: UUID, db: AsyncSession = Depends(get_db)):
    """
    Returns complete listing details including media and artisan information.
    """
    query = text("""
        SELECT l.*, u.name as artisan_name, u.village as artisan_village
        FROM listings l
        JOIN users u ON l.artisan_id = u.id
        WHERE l.id = :id
    """)
    res = await db.execute(query, {"id": str(id)})
    row = res.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Listing not found")

    # Fetch associated media
    media_res = await db.execute(
        text("SELECT id, media_type, url FROM listing_media WHERE listing_id = :id"),
        {"id": str(id)}
    )
    media_items = [dict(m) for m in media_res.mappings().all()]
    
    result = dict(row)
    result["media"] = media_items
    return result

@router.get("", response_model=ListingListResponse)
async def list_listings(
    category: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    q: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """
    Public feed and search endpoint.
    Filters exclusively for status='published' listings.
    Supports full-text search with ts_rank ranking and combined AND filters.
    """
    conditions = ["l.status = 'published'"]
    params = {"limit": limit, "offset": offset}

    if category:
        conditions.append("l.category ILIKE :category")
        params["category"] = f"%{category}%"

    if state:
        conditions.append("u.state ILIKE :state")
        params["state"] = f"%{state}%"

    if min_price is not None:
        conditions.append("COALESCE(l.price, l.price_min, 0) >= :min_price")
        params["min_price"] = min_price

    if max_price is not None:
        conditions.append("COALESCE(l.price, l.price_max, 999999) <= :max_price")
        params["max_price"] = max_price

    order_clause = "l.created_at DESC"
    if q and q.strip():
        # Full text search ranking
        conditions.append("(l.search_vector @@ plainto_tsquery('english', :q) OR l.title ILIKE :q_like)")
        params["q"] = q.strip()
        params["q_like"] = f"%{q.strip()}%"
        order_clause = "ts_rank(l.search_vector, plainto_tsquery('english', :q)) DESC, l.created_at DESC"

    where_str = " AND ".join(conditions)

    count_query = text(f"""
        SELECT COUNT(*) 
        FROM listings l
        JOIN users u ON l.artisan_id = u.id
        WHERE {where_str}
    """)
    total_count = (await db.execute(count_query, params)).scalar() or 0

    items_query = text(f"""
        SELECT l.*, u.name as artisan_name, u.village as artisan_village
        FROM listings l
        JOIN users u ON l.artisan_id = u.id
        WHERE {where_str}
        ORDER BY {order_clause}
        LIMIT :limit OFFSET :offset
    """)
    items_res = await db.execute(items_query, params)
    rows = items_res.mappings().all()

    items = []
    for r in rows:
        item = dict(r)
        # Fetch first media thumbnail if exists
        m_res = await db.execute(
            text("SELECT id, media_type, url FROM listing_media WHERE listing_id = :id LIMIT 3"),
            {"id": str(r["id"])}
        )
        item["media"] = [dict(m) for m in m_res.mappings().all()]
        items.append(item)

    return {
        "items": items,
        "total": total_count,
        "limit": limit,
        "offset": offset
    }
