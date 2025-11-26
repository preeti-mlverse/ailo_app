"""
Add placeholder chapters to the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'ailo_db')]

# All 8 chapters
chapters_data = [
    {
        "title": "Unit 1: Python Programming-II",
        "description": "Learn about Python Programming-II",
        "order": 1,
        "locked": False,
        "icon": "logo-python"
    },
    {
        "title": "Unit 2: Data Science Methodology",
        "subtitle": "An Analytic Approach to Capstone Project",
        "description": "An Analytic Approach to Capstone Project",
        "order": 2,
        "locked": True,
        "icon": "analytics"
    },
    {
        "title": "Unit 3: Making Machines See",
        "description": "Computer Vision fundamentals",
        "order": 3,
        "locked": True,
        "icon": "eye"
    },
    {
        "title": "Unit 4: AI with Orange Data Mining Tool",
        "description": "Visual programming for AI",
        "order": 4,
        "locked": True,
        "icon": "color-palette"
    },
    {
        "title": "Unit 5: Introduction to Big Data and Data Analytics",
        "description": "Working with large-scale datasets",
        "order": 5,
        "locked": True,
        "icon": "server"
    },
    {
        "title": "Unit 6: Understanding Neural Networks",
        "description": "Deep learning foundations",
        "order": 6,
        "locked": True,
        "icon": "git-network"
    },
    {
        "title": "Unit 7: Generative AI",
        "description": "Creating with AI models",
        "order": 7,
        "locked": True,
        "icon": "sparkles"
    },
    {
        "title": "Unit 8: Data Storytelling",
        "description": "Communicating insights effectively",
        "order": 8,
        "locked": True,
        "icon": "bar-chart"
    }
]

async def add_chapters():
    # Get existing chapters
    existing = await db.chapters.find({}).to_list(100)
    existing_titles = [ch.get('title') or ch.get('chapter_name') for ch in existing]
    
    print(f"Found {len(existing)} existing chapters")
    
    for chapter_data in chapters_data:
        # Check if chapter already exists
        if chapter_data['title'] in existing_titles:
            print(f"✓ Chapter already exists: {chapter_data['title']}")
            continue
        
        # Add chapter_id and chapter_name
        chapter_data['chapter_id'] = str(uuid.uuid4())
        chapter_data['chapter_name'] = chapter_data['title']
        
        await db.chapters.insert_one(chapter_data)
        print(f"✅ Added chapter: {chapter_data['title']}")
    
    # Show all chapters
    all_chapters = await db.chapters.find({}).sort("order", 1).to_list(100)
    print(f"\n📚 Total chapters in database: {len(all_chapters)}")
    for ch in all_chapters:
        status = "🔓 Unlocked" if not ch.get('locked', False) else "🔒 Locked"
        print(f"   {ch['order']}. {ch.get('title') or ch.get('chapter_name')} - {status}")
    
    client.close()

asyncio.run(add_chapters())
