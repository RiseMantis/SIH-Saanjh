from typing import Dict, Any, List, Optional

def calculate_match_score(
    artisan: Dict[str, Any],
    requirement: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Pure scoring function for matching an artisan/cluster with a buyer requirement.
    Formula:
      score = (category_match * 40) + (state_match * 20) + (price_fit * 25) + (trust_normalized * 15)
    Total possible score: 100.0
    """
    # 1. Category Match (40 pts)
    req_cat = (requirement.get("category") or "").strip().lower()
    art_cat = (artisan.get("craft_category") or "").strip().lower()
    category_match = 1.0 if (req_cat and art_cat and req_cat == art_cat) else 0.0

    # 2. State / Region Match (20 pts)
    pref_state = (requirement.get("preferred_state") or "").strip().lower()
    art_state = (artisan.get("state") or "").strip().lower()
    if not pref_state:
        state_match = 0.8  # No state preference specified
    elif pref_state in art_state or art_state in pref_state:
        state_match = 1.0
    else:
        state_match = 0.2

    # 3. Price Fit (25 pts)
    max_price = requirement.get("max_unit_price")
    art_price = artisan.get("typical_price") or artisan.get("price") or 0.0
    if max_price and max_price > 0:
        if art_price <= 0:
            price_fit = 0.7
        elif art_price <= max_price:
            price_fit = 1.0
        else:
            # Degrade gracefully if above budget
            over = (art_price - max_price) / max_price
            price_fit = max(0.0, 1.0 - over)
    else:
        price_fit = 1.0

    # 4. Trust Score Contribution (15 pts)
    trust_score = float(artisan.get("trust_score") or 50.0)
    trust_normalized = max(0.0, min(100.0, trust_score)) / 100.0

    score = (
        (category_match * 40.0) +
        (state_match * 20.0) +
        (price_fit * 25.0) +
        (trust_normalized * 15.0)
    )

    breakdown = {
        "category_score": round(category_match * 40.0, 1),
        "state_score": round(state_match * 20.0, 1),
        "price_score": round(price_fit * 25.0, 1),
        "trust_score_contribution": round(trust_normalized * 15.0, 1)
    }

    return {
        "score": round(score, 1),
        "breakdown": breakdown
    }

async def find_matches_for_requirement(
    requirement: Dict[str, Any],
    db,
    limit: int = 10
) -> List[Dict[str, Any]]:
    """
    Finds and ranks matching artisans for a given requirement from the database.
    """
    from sqlalchemy import text
    # Fetch all artisans
    artisans_q = text("""
        SELECT u.id as artisan_id, u.name as artisan_name, u.village, u.state,
               u.craft_category, u.trust_score, u.monthly_capacity, u.bulk_capable,
               u.avatar_url,
               COALESCE(AVG(l.price), 0) as typical_price
        FROM users u
        LEFT JOIN listings l ON l.artisan_id = u.id AND l.status = 'published'
        WHERE u.role = 'artisan'
        GROUP BY u.id
    """)
    res = await db.execute(artisans_q)
    rows = [dict(r) for r in res.mappings().all()]

    scored_list = []
    for art in rows:
        match_info = calculate_match_score(art, requirement)
        scored_art = {
            "artisan_id": art["artisan_id"],
            "artisan_name": art["artisan_name"],
            "village": art["village"],
            "state": art["state"],
            "craft_category": art["craft_category"],
            "trust_score": art["trust_score"],
            "monthly_capacity": art["monthly_capacity"],
            "bulk_capable": art["bulk_capable"],
            "score": match_info["score"],
            "breakdown": match_info["breakdown"],
            "avatar_url": art.get("avatar_url")
        }
        scored_list.append(scored_art)

    # Sort descending by score
    scored_list.sort(key=lambda x: x["score"], reverse=True)
    return scored_list[:limit]
