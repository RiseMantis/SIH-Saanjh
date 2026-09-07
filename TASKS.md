# TASKS.md — Ordered Build Backlog

Work through tasks in order. Each task is scoped to be completable in one agent session (roughly 30–90 min of focused work). Do not start Task N+1 until Task N's "Definition of done" is met, unless tasks are explicitly marked `[parallel]`.

Conventions: `#backend`, `#client`, `#infra`, `#ai` tag which part of the stack a task touches. `[parallel]` tasks have no dependency on each other and can run in separate agent sessions/branches.

---

## Phase 0 — Scaffolding

### TASK 1 — Repo scaffold `#infra`
Create the full folder structure from `AGENTS.md` §4. Add `.gitignore` (Python, Node/Flutter, `.env`, `__pycache__`, `venv/`). Add empty `requirements.txt`, `.env.example` with placeholder keys: `DATABASE_URL`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `JWT_SECRET`, `LLM_API_KEY`, `LLM_PROVIDER`.
**Done when:** `tree` of the repo matches AGENTS.md §4; `docker-compose.yml` exists (can be a stub, filled in Task 2).

### TASK 2 — Local infra via Docker Compose `#infra`
Write `docker-compose.yml` with services: `db` (postgres:15), `minio` (S3-compatible storage), `api` (builds from `/backend/Dockerfile`). Wire env vars from `.env`. `api` depends on `db` and `minio`.
**Done when:** `docker compose up` starts all three containers and Postgres is reachable on the configured port.

### TASK 3 — Database schema `#backend`
Create `/backend/schema.sql` with all tables from the build plan: `users`, `clusters`, `cluster_members`, `listings`, `listing_media`, `ai_audit_log`, `requirements`, `requirement_matches`, `orders`. Enable `pgcrypto` (for `gen_random_uuid()`) and `pg_trgm` extensions. Add a generated `search_vector` column on `listings` (`title || description_en || array_to_string(tags,' ')`) with a GIN index.
**Done when:** running `schema.sql` against a fresh Postgres container creates all tables with no errors, and `\d listings` shows the search index.

### TASK 4 — FastAPI app skeleton `#backend`
Create `/backend/app/main.py` with FastAPI app instance, CORS middleware (allow all origins for hackathon), health check `GET /health` returning `{"status":"ok"}`, and router registration stubs for `auth`, `listings`, `media`, `catalog`, `requirements`, `orders`, `mock`. Create `db.py` with a SQLAlchemy engine/session using `DATABASE_URL` from `config.py`.
**Done when:** `uvicorn app.main:app --reload` starts, `/health` returns 200, `/docs` loads with empty router sections visible.

---

## Phase 1 — Auth & Users

### TASK 5 — Auth endpoints `#backend`
Implement `POST /auth/register` (name, role, phone/email, password → hash with bcrypt, insert into `users`), `POST /auth/login` (verify password, return JWT with `sub`, `role`, 24h expiry), `POST /auth/mock-kyc` (JWT-protected, sets `is_kyc_verified = true` for the current user). Add a `get_current_user` dependency other routers will reuse.
**Done when:** register → login → mock-kyc flow works via `/docs`; an unauthenticated call to a protected route returns 401.

---

## Phase 2 — AI Pipelines `[parallel with Phase 1 once Task 4 is done]`

### TASK 6 — Image enhancement service `#ai #backend`
Implement `services/image_enhancer.py` per the build plan: `rembg` background removal → composite on neutral background → auto-crop to content bbox with padding → `ImageOps.autocontrast` + slight brightness boost → return JPEG bytes. Wrap in `POST /media/photo` (multipart upload) that uploads both raw and enhanced versions to storage, inserts two `listing_media` rows, returns both URLs.
**Done when:** uploading a real product photo via `/docs` returns an enhanced image URL, visibly background-removed, in under ~5 seconds.

### TASK 7 — Voice transcription service `#ai #backend`
Implement `services/transcriber.py` using `whisper` (`small` model, load once at module import, not per-request). Wrap in `POST /media/voice` (multipart audio upload) that stores the raw audio, runs transcription, returns `{transcript, detected_language}`.
**Done when:** uploading a short voice memo returns a plausible transcript and detected language code.

### TASK 8 — Listing generation service `#ai #backend`
Implement `services/cataloger.py`: takes `transcript` + optional `image_tags` list, sends the structured prompt from the build plan to the configured LLM provider, parses/repairs the JSON response, returns `{title, description_en, description_hi, category, tags}`. Wrap in `POST /catalog/generate`. On success, insert a row into `ai_audit_log` with `action_type='listing_generated'`.
**Done when:** given a sample transcript, the endpoint returns valid JSON matching the schema and an audit row is created.

### TASK 9 — Pricing service `#ai #backend`
Implement `services/pricing.py` exactly as the weighted formula in the build plan (cost floor → market anchor from comparable listings → quality adjustment → seasonality nudge → explanation string). Wrap in `POST /catalog/pricing`, taking `raw_material_cost`, `estimated_hours`, `intricacy_score`, `category` (used to pull comparable prices from published `listings`), `seasonality_multiplier`. Insert `ai_audit_log` row with `action_type='price_suggested'`.
**Done when:** the endpoint returns a `{price_min, price_max, explanation}` that never goes below the cost floor, tested with at least 3 different input combinations.

---

## Phase 3 — Listings & Feed

### TASK 10 — Listings CRUD `#backend`
Implement `POST /listings` (draft, accepts `client_uuid` for idempotent upsert per AGENTS.md §5), `PATCH /listings/{id}` (artisan edits/approves AI-suggested fields — must be the listing's owner), `POST /listings/{id}/publish` (sets `status='published'`, requires all core fields non-null), `GET /listings/{id}`.
**Done when:** a listing can be created as draft, edited, and published, with ownership enforced (a different artisan gets 403).

### TASK 11 — Public feed & search `#backend`
Implement `GET /listings` with query params `category`, `state`, `min_price`, `max_price`, `q` (full-text search against `search_vector`), pagination (`limit`/`offset`). Only returns `status='published'` listings.
**Done when:** searching by a keyword returns relevant listings ranked by `ts_rank`, and filters combine correctly (AND semantics).

### TASK 12 — Artisan public profile `#backend`
Implement `GET /artisans/{id}` returning name, village, trust_score, bio/about, published listings (as a portfolio), and cluster membership if any. No auth required (public page).
**Done when:** hitting the endpoint for a seeded artisan returns a complete profile payload matching the fields in the build plan §"Artisan Profile" table.

---

## Phase 4 — B2B, Orders, Trust

### TASK 13 — Requirements & matching `#backend`
Implement `POST /requirements` (buyer posts bulk need), `GET /requirements/{id}/matches` implementing the scored-match function from the build plan (category match, state match, price fit, trust score contribution), returns top 10 ranked artisans/clusters. Write a unit test for the pure scoring function in `services/matching.py`.
**Done when:** posting a requirement against seeded artisans returns a sensibly ranked match list, and the unit test passes.

### TASK 14 — Orders & trust score `#backend`
Implement `POST /orders` (buyer places order against a published listing or accepted match), `PATCH /orders/{id}/status` (confirmed → shipped → delivered → completed, or → disputed). On `completed`, `trust_score += 5` (cap 100); on `disputed`, `trust_score -= 10` (floor 0). Every trust score change writes an `ai_audit_log` row with `action_type='trust_score_changed'`.
**Done when:** walking an order through statuses visibly changes the artisan's trust score and produces audit rows.

---

## Phase 5 — Mocked Integrations `[parallel, low effort]`

### TASK 15 — Mock GeM/ONDC/Day-1 payment endpoints `#backend`
Implement `POST /mock/gem-sync` and `POST /mock/ondc-sync` (accept a `listing_id`, return a hardcoded success payload with a fake external ID and timestamp — no real call). Implement `GET /mock/day1-payment/{order_id}` returning the worked-example structure from the build plan (order confirmed Day 0 → 90% advanced Day 1 → buyer settles Day 30 → reconciliation), populated with the real order's `total_amount` where possible.
**Done when:** all three endpoints return believable, order-specific payloads without touching any real external API.

---

## Phase 6 — Seed Data & Deploy

### TASK 16 — Seed script `#infra`
Write `/backend/seed.py`: creates 3–4 artisan users across different states/categories, 2 buyer users, 15–20 published listings with realistic titles/descriptions/prices across at least 4 craft categories, 2–3 open B2B requirements. Run against a fresh DB via `python seed.py`.
**Done when:** running the seed script populates a fresh database such that `GET /listings` returns 15+ varied items and `/artisans/{id}` shows a populated profile.

### TASK 17 — Deploy backend `#infra`
Deploy the FastAPI app + Postgres to Railway or Render. Configure env vars from `.env` in the platform's dashboard. Confirm `/health` and `/docs` are reachable on the public URL.
**Done when:** the public API URL responds correctly and the client (Task 18+) can point to it.

---

## Phase 7 — Client (build in parallel with Phase 2–4 once Task 5 is done)

### TASK 18 — Client scaffold & auth screens `#client`
Scaffold the chosen client (Flutter or React). Build register/login screens wired to `/auth/*`. Store JWT securely (secure storage on Flutter, httpOnly-adjacent handling or localStorage with clear caveats on React for hackathon purposes).
**Done when:** a new user can register and land on an authenticated home screen.

### TASK 19 — Capture & AI review screen `#client`
Build the core artisan flow: camera capture → voice recorder → calls `/media/photo`, `/media/voice`, `/catalog/generate`, `/catalog/pricing` in sequence → shows an editable review screen (title, both descriptions, category, tags, price range) → "Publish" button calling `/listings` then `/listings/{id}/publish`.
**Done when:** a full capture-to-published-listing flow works end-to-end from the client against the live backend.

### TASK 20 — Discover feed & profile screens `#client`
Build the public feed (list/grid of published listings, search/filter bar) and artisan profile page, both read-only, wired to `/listings` and `/artisans/{id}`.
**Done when:** browsing, searching, and opening a profile all work against seeded data.

### TASK 21 — Buyer portal: post requirement & view matches `#client`
Build a simple buyer-facing screen: form to post a requirement, results screen showing ranked matches from `/requirements/{id}/matches`.
**Done when:** a buyer can post a requirement and see a ranked artisan list.

### TASK 22 — Mocked integration screens `#client`
Build: a KYC screen calling `/auth/mock-kyc`; a "Sync to GeM/ONDC" button pair on the listing detail screen calling the mock endpoints and showing success state; a Day-1 Payment screen rendering `/mock/day1-payment/{order_id}` as a timeline.
**Done when:** all three screens render convincingly using real (mocked) API responses, no hardcoded client-side fake data.

---

## Phase 8 — Polish & Demo Prep

### TASK 23 — Audit log viewer `#client #backend`
Add a small internal/admin screen (or even a raw `GET /admin/audit-log?listing_id=` endpoint viewed via `/docs`) that lists `ai_audit_log` rows for a given listing — used in the demo to show explainability.
**Done when:** picking a seeded listing and viewing its audit trail shows at least a `listing_generated` and a `price_suggested` entry with reason codes.

### TASK 24 — End-to-end rehearsal `#infra`
Run the full demo script from the build plan (`docs/Backend_Build_Plan_Artisan_Platform.md` §12) against the deployed backend + client, on the actual device/browser you'll demo with. Fix anything that breaks. Time it.
**Done when:** the full script runs in under 5 minutes with no crashes, on the exact setup you'll use on stage.
