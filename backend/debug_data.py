import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'ailo_db')]

async def debug_data():
    # Get chapters
    chapters = await db.chapters.find({}).to_list(100)
    print("=== CHAPTERS ===")
    print(f"Total: {len(chapters)}")
    for ch in chapters:
        print(f"  chapter_id: {ch['chapter_id']}")
        print(f"  chapter_name: {ch['chapter_name']}")
        print()
    
    # Get topics
    topics = await db.topics.find({}).to_list(100)
    print("=== TOPICS ===")
    print(f"Total: {len(topics)}")
    for i, topic in enumerate(topics):
        print(f"{i+1}. topic_id: {topic['topic_id']}")
        print(f"   chapter_id: {topic['chapter_id']}")
        print(f"   title: {topic['title']}")
        print(f"   topic_number: {topic.get('topic_number', 'N/A')}")
        print()
    
    # Check relationship
    if chapters:
        chapter_id = chapters[0]['chapter_id']
        print(f"=== CHECKING RELATIONSHIP FOR CHAPTER: {chapter_id} ===")
        matching_topics = await db.topics.find({"chapter_id": chapter_id}).to_list(100)
        print(f"Found {len(matching_topics)} topics")
        for topic in matching_topics[:3]:
            print(f"  - {topic['title']}")
    
    client.close()

asyncio.run(debug_data())
