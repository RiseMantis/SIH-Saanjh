from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional
from uuid import UUID

from app.db import get_db
from app.services.storage import upload_media_file
from app.services.image_enhancer import enhance_image
from app.services.transcriber import transcribe_audio

router = APIRouter(prefix="/media", tags=["media"])

@router.post("/photo")
async def upload_photo(
    file: UploadFile = File(...),
    listing_id: Optional[UUID] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Accepts raw product photo, runs image enhancer (background removal, auto-crop, contrast),
    stores both raw and enhanced versions, inserts listing_media records, and returns both URLs.
    """
    raw_bytes = await file.read()
    if not raw_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    filename = file.filename or "photo.jpg"
    
    # 1. Upload raw photo
    raw_url, raw_key = upload_media_file(raw_bytes, f"raw_{filename}", content_type=file.content_type or "image/jpeg")

    # 2. Process image enhancement
    try:
        enhanced_bytes = enhance_image(raw_bytes)
    except Exception as e:
        enhanced_bytes = raw_bytes

    enhanced_url, enhanced_key = upload_media_file(enhanced_bytes, f"enhanced_{filename}", content_type="image/jpeg")

    # 3. Insert both into listing_media
    query = text("""
        INSERT INTO listing_media (id, listing_id, media_type, url, storage_key)
        VALUES (gen_random_uuid(), :listing_id, :media_type, :url, :storage_key)
        RETURNING id
    """)

    res_raw = await db.execute(query, {
        "listing_id": str(listing_id) if listing_id else None,
        "media_type": "raw_photo",
        "url": raw_url,
        "storage_key": raw_key
    })
    raw_media_id = str(res_raw.scalar())

    res_enh = await db.execute(query, {
        "listing_id": str(listing_id) if listing_id else None,
        "media_type": "enhanced_photo",
        "url": enhanced_url,
        "storage_key": enhanced_key
    })
    enh_media_id = str(res_enh.scalar())

    return {
        "raw_url": raw_url,
        "enhanced_url": enhanced_url,
        "raw_media_id": raw_media_id,
        "enhanced_media_id": enh_media_id,
        "listing_id": str(listing_id) if listing_id else None
    }

@router.post("/voice")
async def upload_voice(
    file: UploadFile = File(...),
    listing_id: Optional[UUID] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Accepts voice memo, stores raw audio in storage, runs Whisper transcription,
    and returns transcript, detected language, and stored audio URL.
    """
    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Audio file is empty")

    filename = file.filename or "voice.wav"
    audio_url, audio_key = upload_media_file(audio_bytes, filename, content_type=file.content_type or "audio/wav")

    # Insert into listing_media
    query = text("""
        INSERT INTO listing_media (id, listing_id, media_type, url, storage_key)
        VALUES (gen_random_uuid(), :listing_id, :media_type, :url, :storage_key)
        RETURNING id
    """)
    res = await db.execute(query, {
        "listing_id": str(listing_id) if listing_id else None,
        "media_type": "voice",
        "url": audio_url,
        "storage_key": audio_key
    })
    media_id = str(res.scalar())

    # Transcribe audio
    transcript, detected_lang = transcribe_audio(audio_bytes, filename)

    return {
        "transcript": transcript,
        "detected_language": detected_lang,
        "audio_url": audio_url,
        "media_id": media_id,
        "listing_id": str(listing_id) if listing_id else None
    }
