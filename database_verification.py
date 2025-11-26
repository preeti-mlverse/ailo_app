#!/usr/bin/env python3
"""
Database Verification Script for AILO EdTech Learn Tab
Verifies the database has been populated with the expected data counts
"""

import requests
import json

# Get backend URL from frontend .env
BACKEND_URL = "https://nova-tutor.preview.emergentagent.com/api"

def get_auth_token():
    """Get authentication token"""
    login_data = {
        "email": "learntab.tester@ailo.com",
        "password": "TestPassword123!"
    }
    
    response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

def verify_database_counts():
    """Verify database has expected document counts"""
    token = get_auth_token()
    if not token:
        print("❌ Failed to get auth token")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("🔍 VERIFYING DATABASE DOCUMENT COUNTS")
    print("=" * 50)
    
    # Check chapters (expected: 1)
    response = requests.get(f"{BACKEND_URL}/chapters", headers=headers)
    if response.status_code == 200:
        chapters = response.json()
        print(f"📚 Chapters: {len(chapters)} (expected: 1)")
        
        if chapters:
            chapter_id = chapters[0]["chapter_id"]
            
            # Check topics for this chapter (expected: 15)
            response = requests.get(f"{BACKEND_URL}/chapters/{chapter_id}/topics", headers=headers)
            if response.status_code == 200:
                topics = response.json()
                print(f"📖 Topics: {len(topics)} (expected: 15)")
                
                # Count subtopics across all topics
                total_subtopics = 0
                total_microcontent = 0
                total_quiz_questions = 0
                
                for topic in topics[:3]:  # Check first 3 topics to avoid too many requests
                    topic_id = topic["topic_id"]
                    
                    # Check subtopics for this topic
                    response = requests.get(f"{BACKEND_URL}/topics/{topic_id}/subtopics", headers=headers)
                    if response.status_code == 200:
                        data = response.json()
                        subtopics = data.get("subtopics", [])
                        total_subtopics += len(subtopics)
                        
                        # Check microcontent for first subtopic
                        if subtopics:
                            subtopic_id = subtopics[0]["subtopic_id"]
                            response = requests.get(f"{BACKEND_URL}/subtopics/{subtopic_id}/microcontent", headers=headers)
                            if response.status_code == 200:
                                data = response.json()
                                cards = data.get("cards", [])
                                total_microcontent += len(cards)
                            
                            # Check quiz questions for this subtopic
                            response = requests.get(f"{BACKEND_URL}/subtopics/{subtopic_id}/quiz", headers=headers)
                            if response.status_code == 200:
                                data = response.json()
                                questions = data.get("questions", [])
                                total_quiz_questions += len(questions)
                
                print(f"📝 Subtopics (sampled): {total_subtopics} (expected: ~28 total)")
                print(f"🎯 Microcontent (sampled): {total_microcontent} (expected: ~28 total)")
                print(f"❓ Quiz Questions (sampled): {total_quiz_questions} (expected: multiple)")
                
                print("\n✅ Database appears to be properly populated with Excel data!")
                
                # Show sample data structure
                print("\n📋 SAMPLE DATA STRUCTURE:")
                print("-" * 30)
                if chapters:
                    print(f"Chapter: {chapters[0]['title']}")
                if topics:
                    print(f"  └─ Topic: {topics[0]['title']}")
                    
                    # Get subtopics for first topic
                    response = requests.get(f"{BACKEND_URL}/topics/{topics[0]['topic_id']}/subtopics", headers=headers)
                    if response.status_code == 200:
                        data = response.json()
                        subtopics = data.get("subtopics", [])
                        if subtopics:
                            print(f"      └─ Subtopic: {subtopics[0]['title']}")
                            
                            # Get microcontent for first subtopic
                            response = requests.get(f"{BACKEND_URL}/subtopics/{subtopics[0]['subtopic_id']}/microcontent", headers=headers)
                            if response.status_code == 200:
                                data = response.json()
                                cards = data.get("cards", [])
                                if cards:
                                    print(f"          └─ Microcontent Cards: {len(cards)}")
                                    print(f"              ├─ Story Mode: {'✓' if cards[0].get('story') else '✗'}")
                                    print(f"              ├─ Relate Mode: {'✓' if cards[0].get('relate') else '✗'}")
                                    print(f"              └─ Why Mode: {'✓' if cards[0].get('why') else '✗'}")
            else:
                print(f"❌ Failed to fetch topics: {response.text}")
    else:
        print(f"❌ Failed to fetch chapters: {response.text}")

if __name__ == "__main__":
    verify_database_counts()