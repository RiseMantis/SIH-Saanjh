import asyncio
import os
import sys
from uuid import uuid4
from passlib.context import CryptContext
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import app.db  # ensures DNS fallback for cloud databases is active
from app.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pw(password: str) -> str:
    return pwd_context.hash(password)

async def seed_database():
    print(f"Connecting to database: {settings.DATABASE_URL}...")
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        print("Creating tables if not present...")
        # Read schema.sql
        schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
        if os.path.exists(schema_path):
            with open(schema_path, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            # Execute schema statement
            try:
                conn = await session.connection()
                raw_conn = await conn.get_raw_connection()
                if hasattr(raw_conn, "driver_connection"):
                    await raw_conn.driver_connection.execute(schema_sql)
                else:
                    await session.execute(text(schema_sql))
                await session.commit()
                print("Schema executed successfully.")
            except Exception as e:
                print(f"Note on schema execution: {e}")
                await session.rollback()

        print("Seeding users (artisans & buyers)...")
        # Artisans
        lakshmi_id = "a1111111-1111-1111-1111-111111111111"
        ramesh_id  = "a2222222-2222-2222-2222-222222222222"
        sunita_id  = "a3333333-3333-3333-3333-333333333333"
        imran_id   = "a4444444-4444-4444-4444-444444444444"

        # Buyers
        ananya_id  = "b1111111-1111-1111-1111-111111111111"
        zeta_id    = "b2222222-2222-2222-2222-222222222222"

        users = [
            {
                "id": lakshmi_id,
                "name": "Lakshmi Devi",
                "email": "lakshmi@chanderi.artisan.in",
                "phone": "+919876543210",
                "password_hash": hash_pw("artisan123"),
                "role": "artisan",
                "village": "Chanderi",
                "district": "Ashoknagar",
                "state": "Madhya Pradesh",
                "craft_category": "Textiles",
                "bio": "I have been weaving cotton and silk sarees on my family handloom for 22 years. Master weaver specializing in Chanderi butti and zari borders.",
                "trust_score": 92,
                "is_kyc_verified": True,
                "avatar_url": "/ccf15a13-79ed-4161-8cb3-f7c0bb1d31ed.jpg",
                "group_name": "Chanderi Bunkar Samuh",
                "monthly_capacity": 18,
                "bulk_capable": True
            },
            {
                "id": ramesh_id,
                "name": "Ramesh Kumbhar",
                "email": "ramesh@kutch.artisan.in",
                "phone": "+919876543211",
                "password_hash": hash_pw("artisan123"),
                "role": "artisan",
                "village": "Bhuj",
                "district": "Kutch",
                "state": "Gujarat",
                "craft_category": "Pottery",
                "bio": "Third-generation potter from Bhuj. I throw water pots, planters and terracotta lamps on a kick wheel and fire them in a wood kiln.",
                "trust_score": 98,
                "is_kyc_verified": True,
                "avatar_url": "/6e7ee150-03ef-45b8-ac7c-4f170456558d.jpg",
                "group_name": "Kutch Mitti Collective",
                "monthly_capacity": 60,
                "bulk_capable": True
            },
            {
                "id": sunita_id,
                "name": "Sunita Bai",
                "email": "sunita@warli.artisan.in",
                "phone": "+919876543212",
                "password_hash": hash_pw("artisan123"),
                "role": "artisan",
                "village": "Dahanu",
                "district": "Palghar",
                "state": "Maharashtra",
                "craft_category": "Painting",
                "bio": "I paint Warli stories — harvest, marriage, the tarpa dance — on handmade paper and cloth using rice paste and chewed bamboo stick.",
                "trust_score": 86,
                "is_kyc_verified": True,
                "avatar_url": "/ccf15a13-79ed-4161-8cb3-f7c0bb1d31ed.jpg",
                "group_name": "Warli Kalakar Mandal",
                "monthly_capacity": 8,
                "bulk_capable": False
            },
            {
                "id": imran_id,
                "name": "Imran Ansari",
                "email": "imran@moradabad.artisan.in",
                "phone": "+919876543213",
                "password_hash": hash_pw("artisan123"),
                "role": "artisan",
                "village": "Moradabad",
                "district": "Moradabad",
                "state": "Uttar Pradesh",
                "craft_category": "Metalwork",
                "bio": "I hand-engrave brass lamps, urns and trays. Our workshop has four artisans and we take festival and bulk architectural orders.",
                "trust_score": 94,
                "is_kyc_verified": True,
                "avatar_url": "/6e7ee150-03ef-45b8-ac7c-4f170456558d.jpg",
                "group_name": "Peetal Nagri Karigar Group",
                "monthly_capacity": 120,
                "bulk_capable": True
            },
            {
                "id": ananya_id,
                "name": "Ananya Rao",
                "email": "ananya@craftboutique.in",
                "phone": "+919876543220",
                "password_hash": hash_pw("buyer123"),
                "role": "buyer",
                "village": "Indiranagar",
                "district": "Bengaluru Urban",
                "state": "Karnataka",
                "bio": "Curator & retail buyer for ethnic handloom and decor boutique.",
                "trust_score": 90,
                "is_kyc_verified": True
            },
            {
                "id": zeta_id,
                "name": "Zeta Workspaces Procurement",
                "email": "procurement@zetaworkspaces.com",
                "phone": "+919876543221",
                "password_hash": hash_pw("buyer123"),
                "role": "buyer",
                "village": "Koregaon Park",
                "district": "Pune",
                "state": "Maharashtra",
                "bio": "Corporate sustainable sourcing & ESG gifting buyer.",
                "trust_score": 95,
                "is_kyc_verified": True
            }
        ]

        for u in users:
            await session.execute(text("""
                INSERT INTO users (
                    id, name, email, phone, password_hash, role,
                    village, district, state, craft_category, bio,
                    trust_score, is_kyc_verified, avatar_url, group_name,
                    monthly_capacity, bulk_capable
                ) VALUES (
                    :id, :name, :email, :phone, :password_hash, :role,
                    :village, :district, :state, :craft_category, :bio,
                    :trust_score, :is_kyc_verified, :avatar_url, :group_name,
                    :monthly_capacity, :bulk_capable
                ) ON CONFLICT (email) DO UPDATE SET
                    name = EXCLUDED.name,
                    trust_score = EXCLUDED.trust_score
            """), {
                **u,
                "avatar_url": u.get("avatar_url"),
                "group_name": u.get("group_name"),
                "monthly_capacity": u.get("monthly_capacity"),
                "bulk_capable": u.get("bulk_capable", False),
                "craft_category": u.get("craft_category")
            })

        print("Seeding clusters and memberships...")
        cluster_id = "c1111111-1111-1111-1111-111111111111"
        await session.execute(text("""
            INSERT INTO clusters (id, name, region, craft_category)
            VALUES (:id, 'Chanderi Weaver Cooperative', 'Bundelkhand, MP', 'Textiles')
            ON CONFLICT (id) DO NOTHING
        """), {"id": cluster_id})

        await session.execute(text("""
            INSERT INTO cluster_members (id, cluster_id, user_id)
            VALUES (gen_random_uuid(), :cluster_id, :user_id)
            ON CONFLICT DO NOTHING
        """), {"cluster_id": cluster_id, "user_id": lakshmi_id})

        print("Seeding 16 published listings across multiple craft categories...")
        listings_data = [
            # Textiles
            {
                "id": "11111111-0000-0000-0000-000000000001",
                "artisan_id": lakshmi_id,
                "title": "Hand-woven Chanderi Cotton Saree, Deep Red with Gold Zari",
                "desc_en": "Authentic hand-woven Chanderi cotton saree in deep crimson with golden zari border. Created over 9 days on traditional pit looms.",
                "desc_hi": "गहरे लाल रंग में सुनहरी ज़री बॉर्डर वाली प्रामाणिक हाथ से बुनी चंदेरी सूती साड़ी। पारंपरिक पिट लूम पर 9 दिनों में तैयार।",
                "category": "Textiles",
                "tags": ["chanderi", "saree", "handloom", "zari", "festive"],
                "price": 1800,
                "media_url": "/cd3f6a7b-0fec-4134-aede-919095ae2caf.jpg"
            },
            {
                "id": "11111111-0000-0000-0000-000000000002",
                "artisan_id": lakshmi_id,
                "title": "Pure Chanderi Silk Dupatta with Peacock Motifs",
                "desc_en": "Lightweight pure silk dupatta featuring hand-placed peacock butti motifs in pure silver thread.",
                "desc_hi": "चांदी के धागे से मोर की सुंदर बूटियों वाला शुद्ध चंदेरी सिल्क दुपट्टा।",
                "category": "Textiles",
                "tags": ["chanderi", "silk", "dupatta", "peacock", "handcrafted"],
                "price": 2400,
                "media_url": "/cd3f6a7b-0fec-4134-aede-919095ae2caf.jpg"
            },
            {
                "id": "11111111-0000-0000-0000-000000000003",
                "artisan_id": lakshmi_id,
                "title": "Natural Indigo Dyed Cotton Stole",
                "desc_en": "Handspun organic cotton stole dyed using 100% natural organic indigo leaf extract.",
                "desc_hi": "प्राकृतिक नील के रस से रंगा हुआ हाथ से काता गया सूती स्टोल।",
                "category": "Textiles",
                "tags": ["indigo", "organic", "cotton", "stole", "eco-friendly"],
                "price": 950,
                "media_url": "/cd3f6a7b-0fec-4134-aede-919095ae2caf.jpg"
            },
            # Pottery
            {
                "id": "11111111-0000-0000-0000-000000000004",
                "artisan_id": ramesh_id,
                "title": "Terracotta Water Pot with Incised Bands",
                "desc_en": "Wheel-thrown terracotta water pot, wood-fired for 14 hours. Incised bands cut by hand with bamboo knife.",
                "desc_hi": "चाक पर गढ़ा गया प्राकृतिक टेराकोटा मटका, 14 घंटे लकड़ी की भट्टी में पकाया गया। पानी को प्राकृतिक रूप से ठंडा रखता है।",
                "category": "Pottery",
                "tags": ["terracotta", "pottery", "water-pot", "kutch", "organic"],
                "price": 640,
                "media_url": "/135c47da-9c2c-4fe5-bce7-4365c1900a42.jpg"
            },
            {
                "id": "11111111-0000-0000-0000-000000000005",
                "artisan_id": ramesh_id,
                "title": "Blue Pottery Decorative Plates, Set of Six",
                "desc_en": "Jaipur-style low-fired quartz blue pottery plates hand-painted in cobalt oxide with traditional floral motifs.",
                "desc_hi": "पारंपरिक नीले रंग में हाथ से रंगे छह सजावटी क्वार्ट्ज प्लेटों का सेट।",
                "category": "Pottery",
                "tags": ["blue-pottery", "plates", "hand-painted", "ceramic", "decor"],
                "price": 2900,
                "media_url": "/593725bd-08fb-4943-8d50-d49f25e68fb8.jpg"
            },
            {
                "id": "11111111-0000-0000-0000-000000000006",
                "artisan_id": ramesh_id,
                "title": "Earthen Cooking Handi with Clay Lid",
                "desc_en": "Lead-free unglazed natural clay handi for slow cooking on gas or charcoal. Retains nutrients naturally.",
                "desc_hi": "धीमी आंच पर खाना पकाने के लिए शुद्ध सीसा-रहित मिट्टी की हांडी।",
                "category": "Pottery",
                "tags": ["cooking", "handi", "clay", "healthy", "traditional"],
                "price": 850,
                "media_url": "/135c47da-9c2c-4fe5-bce7-4365c1900a42.jpg"
            },
            # Metalwork
            {
                "id": "11111111-0000-0000-0000-000000000007",
                "artisan_id": imran_id,
                "title": "Hand-engraved Brass Diya Lamp with Lotus Base",
                "desc_en": "Beaten from solid sheet brass and engraved with hand punches. Lotus pedestal base, polished with lacquer finish.",
                "desc_hi": "कमल के आधार वाला हाथ से नक्काशीदार पीतल का पारंपरिक तेल दीया।",
                "category": "Metalwork",
                "tags": ["brass", "diya", "lamp", "moradabad", "puja", "festive"],
                "price": 780,
                "media_url": "/fd256817-ae13-4f29-97f8-6298d6a34afc.jpg"
            },
            {
                "id": "11111111-0000-0000-0000-000000000008",
                "artisan_id": imran_id,
                "title": "Handmade Hammered Copper Water Carafe and Tumbler Set",
                "desc_en": "Pure copper jug with 2 drinking glasses hammered by master coppersmiths. Ayurvedic health benefits.",
                "desc_hi": "शुद्ध तांबे का हाथ से पीटा गया पानी का जग और दो गिलास का सेट।",
                "category": "Metalwork",
                "tags": ["copper", "hammered", "jug", "ayurvedic", "wellness"],
                "price": 2200,
                "media_url": "/fd256817-ae13-4f29-97f8-6298d6a34afc.jpg"
            },
            {
                "id": "11111111-0000-0000-0000-000000000009",
                "artisan_id": imran_id,
                "title": "Etched Brass Serving Platter, 14-inch",
                "desc_en": "Detailed Persian floral vines chased into heavy gauge brass. Ideal for royal festive service and display.",
                "desc_hi": "शाही मेजवानी और पूजा के लिए 14 इंच का हाथ से नक्काशीदार पीतल का थाल।",
                "category": "Metalwork",
                "tags": ["brass", "platter", "thali", "serving", "heritage"],
                "price": 1850,
                "media_url": "/fd256817-ae13-4f29-97f8-6298d6a34afc.jpg"
            },
            # Painting
            {
                "id": "11111111-0000-0000-0000-000000000010",
                "artisan_id": sunita_id,
                "title": "Warli Harvest Dance Painting on Handmade Paper",
                "desc_en": "Folk painting illustrating the celebration of the rice harvest with the circular tarpa dance. Painted in white rice paste on cowdung-treated paper.",
                "desc_hi": "वारली लोक चित्रकला — हाथ से बने कागज़ पर चावल के लेप से बनी फसल उत्सव की तारपा नृत्य कृति।",
                "category": "Painting",
                "tags": ["warli", "painting", "tribal", "harvest", "folk-art"],
                "price": 1650,
                "media_url": "/6ba30b84-70f0-4e45-b69c-a7db45941994.jpg"
            },
            {
                "id": "11111111-0000-0000-0000-000000000011",
                "artisan_id": sunita_id,
                "title": "Warli Tree of Life & Forest Animals Canvas",
                "desc_en": "Large format 24x36 inch canvas painting depicting ancestral spirits, flora, and village symbiosis.",
                "desc_hi": "वृक्ष और वन्यजीवों को दर्शाती बड़ी वारली कैनवास कलाकृति।",
                "category": "Painting",
                "tags": ["warli", "tree-of-life", "canvas", "wall-art", "ethnic"],
                "price": 3800,
                "media_url": "/6ba30b84-70f0-4e45-b69c-a7db45941994.jpg"
            },
            # Woodwork
            {
                "id": "11111111-0000-0000-0000-000000000012",
                "artisan_id": imran_id,
                "title": "Carved Sheesham Wood Elephant Figurine",
                "desc_en": "Carved from a single block of seasoned rosewood (Sheesham) with hand chisels and natural beeswax finish.",
                "desc_hi": "शीशम की लकड़ी से तराशी गई नक्काशीदार हाथी की मूर्ति।",
                "category": "Woodwork",
                "tags": ["woodwork", "carving", "sheesham", "elephant", "figurine"],
                "price": 3200,
                "media_url": "/e3001f84-6a43-47fd-9471-7934448c693a.jpg"
            },
            {
                "id": "11111111-0000-0000-0000-000000000013",
                "artisan_id": imran_id,
                "title": "Handcrafted Wooden Spice Box (Masala Dabba)",
                "desc_en": "Nine-compartment solid teakwood spice box with glass viewing lid and handmade brass latch.",
                "desc_hi": "सागौन की लकड़ी का हस्तनिर्मित नौ खानों वाला मसाला दानी बॉक्स।",
                "category": "Woodwork",
                "tags": ["woodwork", "kitchen", "spice-box", "teak", "storage"],
                "price": 1450,
                "media_url": "/e3001f84-6a43-47fd-9471-7934448c693a.jpg"
            },
            # Jewelry
            {
                "id": "11111111-0000-0000-0000-000000000014",
                "artisan_id": imran_id,
                "title": "Oxidised Silver Tribal Necklace with Ghungroo Bells",
                "desc_en": "Traditional Banjara style oxidised silver alloy choker necklace with hand-hammered bells and turquoise glass stones.",
                "desc_hi": "बंजारा शैली का ऑक्सीडाइज्ड चांदी का हार, जिसमें हाथ से बनी घुंघरू लगी हैं।",
                "category": "Jewelry",
                "tags": ["jewelry", "tribal", "necklace", "oxidised", "boho"],
                "price": 2450,
                "media_url": "/595bef14-9a37-451c-be49-ba1bff257ecb.jpg"
            },
            # Basketry
            {
                "id": "11111111-0000-0000-0000-000000000015",
                "artisan_id": lakshmi_id,
                "title": "Woven Jute and Cane Storage Basket with Handles",
                "desc_en": "Sturdy storage basket hand-coiled with braided natural golden jute rope over a flexible cane frame.",
                "desc_hi": "केन और प्राकृतिक सुनहरे जूट से बनी मजबूत स्टोरेज टोकरी।",
                "category": "Basketry",
                "tags": ["basketry", "jute", "storage", "cane", "sustainable"],
                "price": 950,
                "media_url": "/7b2a01d5-cb5d-48d5-ab0b-308b6c60322c.jpg"
            },
            {
                "id": "11111111-0000-0000-0000-000000000016",
                "artisan_id": lakshmi_id,
                "title": "Sikki Grass Handwoven Decorative Fruit Tray",
                "desc_en": "Golden Sikki grass woven using traditional Bihar coiling techniques. Naturally golden and moisture resistant.",
                "desc_hi": "प्राकृतिक सुनहरी सिक्की घास से बुनी गई सजावटी फल टोकरी।",
                "category": "Basketry",
                "tags": ["basketry", "sikki", "grass", "tray", "handwoven"],
                "price": 720,
                "media_url": "/7b2a01d5-cb5d-48d5-ab0b-308b6c60322c.jpg"
            }
        ]

        for item in listings_data:
            await session.execute(text("""
                INSERT INTO listings (
                    id, artisan_id, title, description_en, description_hi,
                    category, tags, price, price_min, price_max, status
                ) VALUES (
                    :id, :artisan_id, :title, :desc_en, :desc_hi,
                    :category, :tags, :price, :price_min, :price_max, 'published'
                ) ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    price = EXCLUDED.price,
                    status = 'published'
            """), {
                "id": item["id"],
                "artisan_id": item["artisan_id"],
                "title": item["title"],
                "desc_en": item["desc_en"],
                "desc_hi": item["desc_hi"],
                "category": item["category"],
                "tags": item["tags"],
                "price": item["price"],
                "price_min": round(item["price"] * 0.9),
                "price_max": round(item["price"] * 1.15)
            })

            # Insert listing media
            await session.execute(text("""
                INSERT INTO listing_media (
                    id, listing_id, media_type, url, storage_key
                ) VALUES (
                    gen_random_uuid(), :lid, 'enhanced_photo', :url, :key
                )
            """), {
                "lid": item["id"],
                "url": item["media_url"],
                "key": f"seed_{item['id'][:8]}"
            })

        print("Seeding B2B requirements...")
        req1_id = "r1111111-1111-1111-1111-111111111111"
        req2_id = "r2222222-2222-2222-2222-222222222222"
        await session.execute(text("""
            INSERT INTO requirements (
                id, buyer_id, title, description, category, quantity,
                max_unit_price, preferred_state, status
            ) VALUES
            (:id1, :b1, 'Handwoven Chanderi Saree Gifting Consignment', 'Corporate Diwali festival gifting orders for 50 silk/cotton sarees in festive jewel tones.', 'Textiles', 50, 2000, 'Madhya Pradesh', 'open'),
            (:id2, :b2, 'Handmade Brass Diyas with Lotus Motif for Gifting', 'Bulk requirement of 200 engraved brass lamps for annual corporate conference hampers.', 'Metalwork', 200, 850, 'Uttar Pradesh', 'open')
            ON CONFLICT (id) DO NOTHING
        """), {
            "id1": req1_id,
            "id2": req2_id,
            "b1": ananya_id,
            "b2": zeta_id
        })

        print("Seeding orders and AI audit log...")
        order_id = "o1111111-1111-1111-1111-111111111111"
        await session.execute(text("""
            INSERT INTO orders (
                id, buyer_id, artisan_id, listing_id, quantity, total_amount, status
            ) VALUES (
                :id, :buyer_id, :artisan_id, :listing_id, 1, 1800, 'shipped'
            ) ON CONFLICT (id) DO NOTHING
        """), {
            "id": order_id,
            "buyer_id": ananya_id,
            "artisan_id": lakshmi_id,
            "listing_id": "11111111-0000-0000-0000-000000000001"
        })

        # Seed audit entries for demo explainability
        await session.execute(text("""
            INSERT INTO ai_audit_log (
                id, user_id, listing_id, action_type, input_summary, output_summary, reason_code
            ) VALUES
            (
                gen_random_uuid(), :uid, :lid, 'listing_generated',
                '{"transcript": "हाथ से बुनी चंदेरी सूती साड़ी, लाल और सुनहरा ज़री काम", "craft": "Textiles"}',
                '{"title": "Hand-woven Chanderi Cotton Saree, Deep Red with Gold Zari", "confidence": 0.96}',
                'ai_cataloger_v1'
            ),
            (
                gen_random_uuid(), :uid, :lid, 'price_suggested',
                '{"raw_material": 600, "estimated_hours": 16, "intricacy": 4, "market_anchor": 1800}',
                '{"price_min": 1650, "price_max": 2100, "cost_floor": 1560}',
                'pricing_v1_cost_floor'
            )
        """), {
            "uid": lakshmi_id,
            "lid": "11111111-0000-0000-0000-000000000001"
        })

        await session.commit()
        print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
