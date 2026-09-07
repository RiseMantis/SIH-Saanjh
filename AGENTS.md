# AGENTS.md — Project Brief & Working Rules
## AI-Driven Market Linkage & Smart Cataloging App for Artisans (Hackathon MVP)

This file is the persistent context for any AI coding agent (Antigravity, Claude Code, Cursor, etc.) working in this repo. Read this in full before starting any task. Re-read it if you've been working for a while and are unsure of a convention. Task-by-task instructions live in `TASKS.md` — work through them in order unless told otherwise.

---

## 1. What we're building

A voice-first mobile/web app that lets marginalized artisans photograph a craft item, describe it by voice in a regional language, and get an AI-generated, e-commerce-ready listing (photo cleaned up, bilingual title/description, suggested price) with almost no typing. Buyers browse a public feed and can post bulk B2B requirements that get matched to artisans/clusters.

This is a **hackathon MVP**, not a production system. Optimize for: working end-to-end demo > architectural purity > feature completeness. When in doubt, ship the simpler version and leave a `# TODO(post-hackathon):` comment rather than gold-plating.

## 2. Scope boundary — do not exceed this without being asked

**Build for real:**
- Auth (email/phone + password, JWT)
- Photo upload → AI background removal/enhancement
- Voice upload → transcript → AI-generated bilingual listing (title, description EN/HI, category, tags)
- Pricing suggestion (rule-based formula, not ML)
- Listing CRUD + public discover feed with search/filter
- Artisan public profile page
- B2B requirement posting + naive SQL-scored matching
- Orders + a simple trust score that updates on order status change
- An audit log table that every AI suggestion and trust-score change writes to

**Explicitly mocked — build the endpoint/UI, fake the integration:**
- DigiLocker KYC → a toggle that sets `is_kyc_verified = true`
- GeM sync, ONDC sync → endpoints that return a hardcoded success payload
- Escrow / invoice discounting / Day-1 payment → a static worked-example screen keyed to a real order id

**Do not build:** cluster dispute resolution workflows, real ML pricing model, content moderation classifier, multi-language coverage beyond Hindi/English, refresh-token rotation, microservices split. If a task file asks for one of these, flag it rather than silently expanding scope.

## 3. Tech stack (do not substitute without discussing)

| Layer | Choice |
|---|---|
| Backend | Python 3.11, FastAPI, Pydantic v2 |
| Database | PostgreSQL 15 (Docker locally; Supabase/Railway/Render in deploy) |
| File storage | S3-compatible (MinIO locally, Supabase Storage or S3 in deploy) |
| Background removal | `rembg` (u2netp model for speed) |
| Image post-processing | Pillow |
| ASR | `openai-whisper` (`small` model) locally; Bhashini API as a swappable provider if credentials arrive |
| Listing generation | One structured LLM call (provider-agnostic — use whichever API key is available in `.env`) |
| Pricing | Deterministic weighted formula (see `TASKS.md` Task 6) — explicitly not ML for MVP |
| Search | Postgres `tsvector`/`pg_trgm`, no Elasticsearch |
| Auth | JWT via `python-jose`, `passlib[bcrypt]` for hashing |
| Client | Flutter (mobile-first) or React web — whichever the team is faster in; confirm before scaffolding |
| Deploy | Railway or Render for API, Vercel for web client |

## 4. Repo layout

```
/backend
  /app
    main.py
    /routers        # one file per resource: auth.py, listings.py, media.py, catalog.py, requirements.py, orders.py, mock.py
    /services        # image_enhancer.py, transcriber.py, cataloger.py, pricing.py, matching.py, trust_score.py
    /models          # SQLAlchemy models, one file per table or grouped by domain
    /schemas         # Pydantic request/response schemas
    db.py
    config.py         # reads .env
  /tests
  schema.sql
  seed.py
  Dockerfile
  requirements.txt
/client               # Flutter or React app
docker-compose.yml
.env.example
AGENTS.md             # this file
TASKS.md              # ordered task backlog
README.md
```

Create this structure exactly in Task 1 of `TASKS.md`. Do not reorganize it mid-project without updating this file.

## 5. Conventions

- **API responses**: always return JSON with a consistent envelope on errors: `{"detail": "human readable message"}` (FastAPI's default `HTTPException` shape — don't invent a custom wrapper).
- **IDs**: UUIDs everywhere (`gen_random_uuid()` server-side default, or client-generated UUID for idempotent create — see Task 9 on offline sync).
- **Migrations**: no Alembic for the hackathon. `schema.sql` is the single source of truth, run once on container start. If the schema changes, edit `schema.sql` directly and note the change in your task's commit message.
- **Secrets**: never hardcode API keys. Everything comes from `.env`, and `.env.example` must be kept up to date whenever a new key is introduced.
- **Every AI-producing endpoint** (image enhance, catalog generate, pricing suggest, trust score change) **must write a row to `ai_audit_log`** with a `reason_code`. This is a scope requirement, not optional polish — it's a specific judging criterion referenced in the source ideation doc (§8.2, §13).
- **Idempotency**: `POST /listings` and `POST /media/*` must accept an optional client-generated `client_uuid` and upsert on conflict, to support offline-first capture syncing later. Don't skip this even though offline sync itself isn't fully built.
- **Commits**: small, one task (or sub-task) per commit, message format `[TASK-N] short description`.
- **Testing bar for a hackathon**: a manual `curl`/`/docs` Swagger check per endpoint is sufficient. Write automated tests only for `services/pricing.py` and `services/matching.py` since those are pure functions worth locking down (see Task 13).

## 6. Definition of done for any task

A task in `TASKS.md` is done when:
1. The endpoint/feature works when exercised via FastAPI's `/docs` UI or the client screen it powers.
2. It matches the scope boundary in §2 — no silent scope creep.
3. Errors return sensible HTTP status codes (400/401/404/422/500), not unhandled tracebacks.
4. Any new env var is added to `.env.example`.
5. If it's an AI-producing endpoint, it writes to `ai_audit_log`.

## 7. When something in TASKS.md is ambiguous

Pick the interpretation that gets to a working demo fastest, implement it, and leave a one-line comment explaining the assumption. Don't block on asking — this is a time-boxed hackathon, not a spec review.

## 8. Reference

The full narrative plan (architecture rationale, AI pipeline code sketches, demo script, "is this real AI" talking points) lives in `docs/Backend_Build_Plan_Artisan_Platform.md` in this repo — read it once for context, then work from `TASKS.md` day to day.