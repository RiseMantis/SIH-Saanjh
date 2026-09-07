from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional, List
from uuid import UUID

from app.db import get_db

router = APIRouter(prefix="/admin", tags=["admin-audit"])

@router.get("/audit-log")
async def get_audit_logs(
    listing_id: Optional[UUID] = Query(None),
    order_id: Optional[UUID] = Query(None),
    user_id: Optional[UUID] = Query(None),
    action_type: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns AI explainability audit logs from ai_audit_log table.
    Demonstrates model decisions, prompts, reasoning codes, and trust score changes.
    """
    conditions = []
    params = {"limit": limit}

    if listing_id:
        conditions.append("listing_id = :listing_id")
        params["listing_id"] = str(listing_id)
    if order_id:
        conditions.append("order_id = :order_id")
        params["order_id"] = str(order_id)
    if user_id:
        conditions.append("user_id = :user_id")
        params["user_id"] = str(user_id)
    if action_type:
        conditions.append("action_type = :action_type")
        params["action_type"] = action_type

    where_str = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    query = text(f"""
        SELECT id, user_id, listing_id, order_id, action_type,
               input_summary, output_summary, reason_code, created_at
        FROM ai_audit_log
        {where_str}
        ORDER BY created_at DESC
        LIMIT :limit
    """)

    res = await db.execute(query, params)
    rows = res.mappings().all()
    return [dict(r) for r in rows]
