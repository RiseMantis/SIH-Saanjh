import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import auth, listings, media, catalog, requirements, orders, mock, artisans, admin

app = FastAPI(
    title="Artisan Market Linkage API",
    description="AI-driven market linkage, smart cataloging, and B2B matchmaking for marginalized artisans",
    version="1.0.0",
)

# CORS — allow all origins for hackathon development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local media static files folder for uploaded/enhanced media
MEDIA_DIR = Path("media_uploads")
MEDIA_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static-media", StaticFiles(directory=str(MEDIA_DIR)), name="static-media")

# Register all API routers
app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(artisans.router)
app.include_router(media.router)
app.include_router(catalog.router)
app.include_router(requirements.router)
app.include_router(orders.router)
app.include_router(mock.router)
app.include_router(admin.router)

@app.get("/health", tags=["system"])
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "artisan-api", "version": "1.0.0"}
