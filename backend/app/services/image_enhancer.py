import io
from PIL import Image, ImageOps, ImageEnhance

def enhance_image(image_bytes: bytes) -> bytes:
    """
    Image enhancement pipeline:
    1. rembg background removal (with graceful fallback if rembg not installed or failed)
    2. composite onto neutral/off-white studio background
    3. auto-crop to content bounding box with 5% padding
    4. ImageOps.autocontrast + slight brightness & color enhancement
    5. Return JPEG bytes
    """
    input_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    
    # Step 1: Background removal via rembg
    rgba_image = None
    try:
        from rembg import remove
        rgba_image = remove(input_image)
    except Exception as e:
        # Graceful fallback: keep original image with alpha
        rgba_image = input_image

    # Step 2: Content bounding box auto-crop
    bbox = rgba_image.getbbox()
    if bbox:
        # Add 5% padding around bounding box
        width, height = rgba_image.size
        pad_x = int((bbox[2] - bbox[0]) * 0.05)
        pad_y = int((bbox[3] - bbox[1]) * 0.05)
        
        crop_box = (
            max(0, bbox[0] - pad_x),
            max(0, bbox[1] - pad_y),
            min(width, bbox[2] + pad_x),
            min(height, bbox[3] + pad_y)
        )
        cropped_rgba = rgba_image.crop(crop_box)
    else:
        cropped_rgba = rgba_image

    # Step 3: Composite onto neutral studio off-white background (#F9F8F6 / sand tint)
    studio_bg = Image.new("RGB", cropped_rgba.size, (250, 248, 245))
    if cropped_rgba.mode == "RGBA":
        studio_bg.paste(cropped_rgba, mask=cropped_rgba.split()[3])
    else:
        studio_bg.paste(cropped_rgba, (0, 0))

    # Step 4: Autocontrast and slight brightness boost
    enhanced = ImageOps.autocontrast(studio_bg, cutoff=1)
    brightness = ImageEnhance.Brightness(enhanced)
    enhanced = brightness.enhance(1.06)
    color = ImageEnhance.Color(enhanced)
    enhanced = color.enhance(1.05)

    # Step 5: Output JPEG bytes
    output_io = io.BytesIO()
    enhanced.save(output_io, format="JPEG", quality=90, optimize=True)
    return output_io.getvalue()
