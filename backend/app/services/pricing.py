from typing import Tuple, Optional, Any

async def get_market_anchor(category: str, cost_floor: float, db: Optional[Any] = None) -> float:
    """
    Computes average price for published listings in the specified category.
    Falls back to cost_floor * 2.5 if no published listings exist.
    """
    if db is not None:
        try:
            from sqlalchemy import text
            result = await db.execute(
                text("""
                    SELECT AVG(COALESCE(price, (price_min + price_max) / 2)) 
                    FROM listings 
                    WHERE category ILIKE :cat AND status = 'published'
                """),
                {"cat": category}
            )
            avg_price = result.scalar()
            if avg_price and avg_price > 0:
                return float(avg_price)
        except Exception:
            pass

    # Category heuristic benchmark fallbacks
    benchmarks = {
        "Textiles": 2200.0,
        "Pottery": 950.0,
        "Jewelry": 2600.0,
        "Woodwork": 3400.0,
        "Painting": 1800.0,
        "Metalwork": 1950.0,
        "Basketry": 850.0
    }
    return benchmarks.get(category, cost_floor * 2.5)

def calculate_pricing(
    raw_material_cost: float,
    estimated_hours: float,
    intricacy_score: float = 3.0,
    market_anchor: float = 0.0,
    seasonality_multiplier: float = 1.0
) -> Tuple[float, float, str]:
    """
    Calculates fair, competitive artisan price according to the formula:
    - cost_floor = raw_material_cost + (estimated_hours * 60)
    - quality_adj = 1 + (intricacy_score - 3) * 0.12
    - base = (0.35 * cost_floor + 0.45 * market_anchor + 0.20 * cost_floor * quality_adj) * seasonality_multiplier
    - base >= cost_floor (never below cost floor!)
    - price_min = round(base * 0.9)
    - price_max = round(base * 1.15)
    Returns (price_min, price_max, explanation)
    """
    hourly_rate = 60.0  # Fair minimum wage baseline for artisan labor in India
    labor_cost = estimated_hours * hourly_rate
    cost_floor = float(raw_material_cost + labor_cost)

    if market_anchor <= 0:
        market_anchor = cost_floor * 2.5

    # Clamp intricacy to 1..5
    intricacy = max(1.0, min(5.0, float(intricacy_score)))
    quality_adj = 1.0 + (intricacy - 3.0) * 0.12

    weighted_base = (
        0.35 * cost_floor +
        0.45 * market_anchor +
        0.20 * (cost_floor * quality_adj)
    ) * max(0.5, float(seasonality_multiplier))

    # Guarantee base never falls below cost floor
    base_price = max(weighted_base, cost_floor)

    price_min = round(max(base_price * 0.90, cost_floor))
    price_max = round(max(base_price * 1.15, price_min + 50.0))

    explanation = (
        f"Calculated from raw materials (₹{raw_material_cost:,.0f}) + "
        f"{estimated_hours:g} hrs labor at ₹{hourly_rate:.0f}/hr = cost floor ₹{cost_floor:,.0f}. "
        f"Anchored against category market average ₹{market_anchor:,.0f} with an intricacy score of {intricacy}/5 "
        f"and {seasonality_multiplier:g}x seasonal demand. Guaranteed to stay at or above cost floor."
    )

    return float(price_min), float(price_max), explanation
