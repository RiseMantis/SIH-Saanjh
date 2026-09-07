import unittest
from app.services.matching import calculate_match_score

class TestMatching(unittest.TestCase):
    def test_perfect_match(self):
        artisan = {
            "craft_category": "Textiles",
            "state": "Madhya Pradesh",
            "typical_price": 1800.0,
            "trust_score": 100
        }
        requirement = {
            "category": "Textiles",
            "preferred_state": "Madhya Pradesh",
            "max_unit_price": 2000.0
        }
        res = calculate_match_score(artisan, requirement)
        self.assertEqual(res["score"], 100.0)
        self.assertEqual(res["breakdown"]["category_score"], 40.0)
        self.assertEqual(res["breakdown"]["state_score"], 20.0)
        self.assertEqual(res["breakdown"]["price_score"], 25.0)
        self.assertEqual(res["breakdown"]["trust_score_contribution"], 15.0)

    def test_mismatched_category(self):
        artisan = {
            "craft_category": "Pottery",
            "state": "Gujarat",
            "typical_price": 600.0,
            "trust_score": 80
        }
        requirement = {
            "category": "Woodwork",
            "preferred_state": "Gujarat",
            "max_unit_price": 1000.0
        }
        res = calculate_match_score(artisan, requirement)
        # Category score should be 0
        self.assertEqual(res["breakdown"]["category_score"], 0.0)
        self.assertLess(res["score"], 60.0)

    def test_over_budget_degradation(self):
        artisan = {
            "craft_category": "Jewelry",
            "state": "Rajasthan",
            "typical_price": 3000.0,
            "trust_score": 90
        }
        requirement = {
            "category": "Jewelry",
            "preferred_state": "Rajasthan",
            "max_unit_price": 2000.0
        }
        res = calculate_match_score(artisan, requirement)
        # Price is 50% over budget, price fit should be lower than 25
        self.assertLess(res["breakdown"]["price_score"], 25.0)

if __name__ == "__main__":
    unittest.main()

