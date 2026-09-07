import json
import re
from typing import List, Optional, Dict, Any
from app.config import get_settings

settings = get_settings()

CATALOG_SYSTEM_PROMPT = """You are an expert e-commerce cataloger for traditional Indian artisans and craftspeople.
Given an artisan's spoken or written description (transcript) and optional image tags, create a professional e-commerce catalog entry.
You MUST respond with pure JSON only, matching this exact schema:
{
  "title": "Clear, appealing product title in English (max 12 words)",
  "description_en": "Rich, respectful English product description highlighting craft, technique, materials, and care (2-3 sentences)",
  "description_hi": "Professional Hindi description reflecting the same details (2-3 sentences)",
  "category": "One of: Textiles, Pottery, Jewelry, Woodwork, Painting, Metalwork, Basketry",
  "tags": ["3 to 6 lowercase search tags"]
}
"""

def extract_json(text: str) -> Dict[str, Any]:
    """Helper to parse and repair JSON from model output."""
    text = text.strip()
    # Remove markdown fence if present
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON substring
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise

async def generate_catalog_entry(transcript: str, image_tags: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Takes artisan description / transcript and optional image tags,
    generates e-commerce catalog fields using LLM or structured fallback.
    """
    user_prompt = f"Artisan Voice Note / Transcript:\n{transcript}"
    if image_tags:
        user_prompt += f"\n\nVisual Tags Detected: {', '.join(image_tags)}"

    # If LLM API Key is configured, call OpenAI/compatible LLM
    if settings.LLM_API_KEY:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.LLM_API_KEY)
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": CATALOG_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
            )
            content = response.choices[0].message.content
            data = extract_json(content)
            # Ensure required fields
            return {
                "title": str(data.get("title", "Handcrafted Artisan Item")),
                "description_en": str(data.get("description_en", transcript)),
                "description_hi": str(data.get("description_hi", transcript)),
                "category": str(data.get("category", "Textiles")),
                "tags": list(data.get("tags", ["handmade", "artisan", "traditional"]))
            }
        except Exception as e:
            # Fall back to heuristic generator on API failure
            pass

    # Heuristic fallback generator based on keywords
    t_lower = transcript.lower()
    
    if any(w in t_lower for w in ["saree", "saari", "suit", "cotton", "silk", "handloom", "zari", "weave", "साड़ी", "कपड़ा", "बुनाई"]):
        category = "Textiles"
        title = "Hand-woven Chanderi Cotton Saree with Zari Motifs"
        desc_en = "Authentic hand-woven Chanderi cotton saree created on traditional pit looms. Features fine golden zari butti work and borders, lightweight drape, and hand-finished tassels."
        desc_hi = "पारंपरिक पिट लूम पर हाथ से बुनी गई प्रामाणिक चंदेरी सूती साड़ी। इसमें सुनहरी ज़री का बारीक काम और आकर्षक बॉर्डर शामिल है।"
        tags = ["chanderi", "handloom", "cotton", "saree", "zari", "traditional"]
    elif any(w in t_lower for w in ["pot", "clay", "terracotta", "glaze", "ceramic", "मिट्टी", "बर्तन", "मटका"]):
        category = "Pottery"
        title = "Hand-thrown Terracotta Clay Water Vessel"
        desc_en = "Handcrafted terracotta pot thrown on a traditional kick-wheel and wood-fired. Decorated with natural incised geometric patterns to keep water naturally cool."
        desc_hi = "पारंपरिक चाक पर हाथ से गढ़ा गया और लकड़ी की भट्टी में पकाया गया प्राकृतिक टेराकोटा जल पात्र। पानी को प्राकृतिक रूप से ठंडा रखता है।"
        tags = ["terracotta", "pottery", "clay", "natural", "eco-friendly"]
    elif any(w in t_lower for w in ["brass", "copper", "metal", "diya", "lamp", "पीतल", "धातु", "दीया"]):
        category = "Metalwork"
        title = "Hand-engraved Traditional Brass Diya Lamp"
        desc_en = "Exquisitely hand-chased brass oil lamp featuring engraved lotus petal motifs and a sturdy decorative pedestal. Polished with natural lac finish."
        desc_hi = "कमल की पंखुड़ियों की सुंदर नक्काशी से सजा हाथ से बना पारंपरिक पीतल का दीया। टिकाऊ और शुभ अवसरों के लिए उपयुक्त।"
        tags = ["brass", "metalwork", "diya", "engraved", "puja", "festive"]
    elif any(w in t_lower for w in ["paint", "warli", "madhubani", "canvas", "रंग", "चित्रकारी", "पेंटिंग"]):
        category = "Painting"
        title = "Traditional Warli Tribal Canvas Painting"
        desc_en = "Original folk artwork depicting community celebrations, painted using natural pigments and rice paste on textured handmade paper."
        desc_hi = "हाथ से बने कागज़ पर चावल के लेप और प्राकृतिक रंगों से बनाई गई प्रामाणिक पारंपरिक वारली लोक चित्रकारी।"
        tags = ["painting", "warli", "folk-art", "tribal", "handmade"]
    else:
        category = "Craft"
        title = "Handcrafted Heritage Artisan Creation"
        desc_en = f"Finely crafted artisan work made using time-honored traditional methods. {transcript}"
        desc_hi = f"पारंपरिक विधि से निर्मित प्रामाणिक हस्तशिल्प कृति। {transcript}"
        tags = ["handcrafted", "authentic", "heritage", "artisan"]

    return {
        "title": title,
        "description_en": desc_en,
        "description_hi": desc_hi,
        "category": category,
        "tags": tags
    }
