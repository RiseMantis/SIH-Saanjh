import unittest
from app.services.pricing import calculate_pricing

class TestPricing(unittest.TestCase):
    def test_cost_floor_guarantee(self):
        # raw material = 500, 10 hours labor @ 60 = 600, cost floor = 1100
        price_min, price_max, explanation = calculate_pricing(
            raw_material_cost=500.0,
            estimated_hours=10.0,
            intricacy_score=3.0,
            market_anchor=800.0,  # Below cost floor
            seasonality_multiplier=0.8
        )
        cost_floor = 500.0 + (10.0 * 60.0)
        self.assertGreaterEqual(price_min, cost_floor)
        self.assertGreater(price_max, price_min)
        self.assertIn("Guaranteed to stay at or above cost floor", explanation)

    def test_high_intricacy_boost(self):
        _, price_max_low, _ = calculate_pricing(
            raw_material_cost=1000.0,
            estimated_hours=5.0,
            intricacy_score=1.0,
            market_anchor=3000.0
        )
        _, price_max_high, _ = calculate_pricing(
            raw_material_cost=1000.0,
            estimated_hours=5.0,
            intricacy_score=5.0,
            market_anchor=3000.0
        )
        self.assertGreater(price_max_high, price_max_low)

    def test_seasonality_nudge(self):
        base_min, _, _ = calculate_pricing(
            raw_material_cost=800.0,
            estimated_hours=4.0,
            intricacy_score=3.0,
            market_anchor=2500.0,
            seasonality_multiplier=1.0
        )
        festive_min, _, _ = calculate_pricing(
            raw_material_cost=800.0,
            estimated_hours=4.0,
            intricacy_score=3.0,
            market_anchor=2500.0,
            seasonality_multiplier=1.25
        )
        self.assertGreaterEqual(festive_min, base_min)

if __name__ == "__main__":
    unittest.main()

