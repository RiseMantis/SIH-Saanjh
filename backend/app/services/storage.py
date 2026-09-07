import os
import uuid
from pathlib import Path
from typing import Tuple
from app.config import get_settings

settings = get_settings()

LOCAL_MEDIA_DIR = Path("media_uploads")
LOCAL_MEDIA_DIR.mkdir(parents=True, exist_ok=True)

def get_s3_client():
    try:
        import boto3
        from botocore.config import Config
        return boto3.client(
            "s3",
            endpoint_url=settings.S3_ENDPOINT,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            config=Config(signature_version="s3v4"),
            region_name="us-east-1",
        )
    except Exception:
        return None

def upload_media_file(data: bytes, filename: str, content_type: str = "image/jpeg") -> Tuple[str, str]:
    """
    Uploads media data. Attempts S3 (MinIO) first. If unavailable, falls back to local storage.
    Returns (url, storage_key).
    """
    ext = os.path.splitext(filename)[1] or ".bin"
    storage_key = f"{uuid.uuid4()}{ext}"

    s3 = get_s3_client()
    if s3:
        try:
            try:
                s3.head_bucket(Bucket=settings.S3_BUCKET)
            except Exception:
                try:
                    s3.create_bucket(Bucket=settings.S3_BUCKET)
                except Exception:
                    pass

            s3.put_object(
                Bucket=settings.S3_BUCKET,
                Key=storage_key,
                Body=data,
                ContentType=content_type,
            )
            url = f"{settings.S3_ENDPOINT}/{settings.S3_BUCKET}/{storage_key}"
            return url, storage_key
        except Exception:
            pass

    # Local fallback
    file_path = LOCAL_MEDIA_DIR / storage_key
    with open(file_path, "wb") as f:
        f.write(data)
    url = f"/static-media/{storage_key}"
    return url, storage_key
