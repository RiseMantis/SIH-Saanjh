import json
from uuid import UUID
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

async def adjust_trust_score(
    artisan_id: UUID,
    delta: int,
    reason: str,
    order_id: Optional[UUID],
    db: AsyncSession
) -> int:
    """
    Adjusts an artisan's trust score within bounds [0, 100].
    Logs an entry to ai_audit_log with action_type='trust_score_changed'.
    Returns updated trust score.
    """
    # Fetch current score
    res = await db.execute(
        text("SELECT trust_score FROM users WHERE id = :id"),
        {"id": str(artisan_id)}
    )
    current_score = res.scalar() or 50

    new_score = max(0, min(100, current_score + delta))

    # Update user trust score
    await db.execute(
        text("UPDATE users SET trust_score = :score, updated_at = now() WHERE id = :id"),
        {"score": new_score, "id": str(artisan_id)}
    )

    # Insert into ai_audit_log
    audit_query = text("""
        INSERT INTO ai_audit_log (
            id, user_id, order_id, action_type, input_summary, output_summary, reason_code
        ) VALUES (
            gen_random_uuid(), :user_id, :order_id, 'trust_score_changed',
            :input_summary, :output_summary, :reason_code
        )
    """)
    input_summary = json.dumps({
        "artisan_id": str(artisan_id),
        "previous_score": current_score,
        "delta": delta,
        "order_id": str(order_id) if order_id else None
    })
    output_summary = json.dumps({
        "new_score": new_score,
        "reason": reason
    })

    await db.execute(audit_query, {
        "user_id": str(artisan_id),
        "order_id": str(order_id) if order_id else None,
        "input_summary": input_summary,
        "output_summary": output_summary,
        "reason_code": reason
    })

    return new_score
