# Backend Build Plan: Artisan Platform

## Architecture Overview
The backend is built with FastAPI, PostgreSQL, MinIO (S3-compatible storage), and various AI services (LLMs for cataloging and matching, Whisper for voice descriptions).

## Pricing Formula
- `cost_floor` = raw_material_cost + (estimated_hours × 60)
- `market_anchor` = average price of same-category published listings (fallback: `cost_floor` × 2.5)
- `quality_adj` = 1 + (intricacy_score - 3) × 0.12
- `base` = (0.35 × `cost_floor` + 0.45 × `market_anchor` + 0.20 × `cost_floor` × `quality_adj`) × `seasonality_multiplier`
- `price_min` = round(`base` × 0.9)
- `price_max` = round(`base` × 1.15)

## Matching Algorithm
`score` = (`category_match` × 40) + (`state_match` × 20) + (`price_fit` × 25) + (`trust_normalized` × 15)

## AI Audit Log Requirement
Every AI-producing endpoint MUST log its actions to the `ai_audit_log` table.

## Demo Script Outline
1. Register artisan
2. Capture photo
3. Voice describe
4. AI catalog
5. Price
6. Publish
7. Buyer discovers
8. Buyer posts requirement
9. Matches
10. Order
11. Trust score update
