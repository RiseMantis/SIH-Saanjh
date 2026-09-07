from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List
from uuid import UUID

from app.db import get_db
from app.routers.auth import get_current_user
from app.schemas.orders import OrderCreate, OrderStatusUpdate, OrderResponse
from app.services.trust_score import adjust_trust_score

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderResponse)
async def create_order(
    data: OrderCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Places an order by a buyer for an artisan's product or accepted match.
    """
    buyer_id = current_user["id"]
    query = text("""
        INSERT INTO orders (
            id, buyer_id, artisan_id, listing_id, requirement_id,
            quantity, total_amount, status
        ) VALUES (
            gen_random_uuid(), :buyer_id, :artisan_id, :listing_id, :requirement_id,
            :quantity, :total_amount, 'confirmed'
        ) RETURNING *
    """)
    params = {
        "buyer_id": str(buyer_id),
        "artisan_id": str(data.artisan_id),
        "listing_id": str(data.listing_id) if data.listing_id else None,
        "requirement_id": str(data.requirement_id) if data.requirement_id else None,
        "quantity": data.quantity,
        "total_amount": data.total_amount
    }
    res = await db.execute(query, params)
    row = res.mappings().first()
    return dict(row)

@router.patch("/{id}/status", response_model=OrderResponse)
async def update_order_status(
    id: UUID,
    data: OrderStatusUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Updates order status: confirmed -> shipped -> delivered -> completed or disputed.
    On 'completed': artisan trust_score += 5 (cap 100) and logs to ai_audit_log.
    On 'disputed': artisan trust_score -= 10 (floor 0) and logs to ai_audit_log.
    """
    order_res = await db.execute(
        text("SELECT * FROM orders WHERE id = :id"),
        {"id": str(id)}
    )
    order = order_res.mappings().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_status = data.status
    artisan_id = order["artisan_id"]

    # Status transition trust impacts
    if new_status == "completed" and order["status"] != "completed":
        await adjust_trust_score(
            artisan_id=artisan_id,
            delta=+5,
            reason="order_completed_on_time",
            order_id=id,
            db=db
        )
    elif new_status == "disputed" and order["status"] != "disputed":
        await adjust_trust_score(
            artisan_id=artisan_id,
            delta=-10,
            reason="buyer_dispute_filed",
            order_id=id,
            db=db
        )

    # Update order
    upd_res = await db.execute(
        text("UPDATE orders SET status = :status, updated_at = now() WHERE id = :id RETURNING *"),
        {"status": new_status, "id": str(id)}
    )
    updated_order = upd_res.mappings().first()
    return dict(updated_order)

@router.get("", response_model=List[OrderResponse])
async def list_orders(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Lists orders involving current user (as either buyer or artisan).
    """
    user_id = str(current_user["id"])
    res = await db.execute(
        text("""
            SELECT * FROM orders 
            WHERE buyer_id = :uid OR artisan_id = :uid 
            ORDER BY placed_at DESC
        """),
        {"uid": user_id}
    )
    rows = res.mappings().all()
    return [dict(r) for r in rows]

@router.get("/{id}", response_model=OrderResponse)
async def get_order(
    id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Gets details of a single order.
    """
    res = await db.execute(
        text("SELECT * FROM orders WHERE id = :id"),
        {"id": str(id)}
    )
    row = res.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Order not found")
    return dict(row)
