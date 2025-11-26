#!/usr/bin/env python3
"""
Backend API Testing for AILO EdTech Learn Tab
Tests the hierarchical navigation flow: Chapters → Topics → Subtopics → Microcontent → Quiz
"""

import requests
import json
import os
from datetime import datetime

# Get backend URL from frontend .env
BACKEND_URL = "https://nova-tutor.preview.emergentagent.com/api"

class LearnTabTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.auth_token = None
        self.user_data = None
        self.test_results = []
        
    def log_test(self, test_name, success, details="", data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def setup_auth(self):
        """Create test user and get auth token"""
        print("\n=== AUTHENTICATION SETUP ===")
        
        # Try to create a test user
        signup_data = {
            "email": "learntab.tester@ailo.com",
            "mobile": "+1234567890",
            "password": "TestPassword123!",
            "full_name": "Learn Tab Tester",
            "role": "student",
            "terms_accepted": True,
            "privacy_accepted": True
        }
        
        try:
            response = requests.post(f"{self.base_url}/auth/signup", json=signup_data)
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data["access_token"]
                self.user_data = data["user"]
                self.log_test("User Signup", True, f"Created user: {self.user_data['full_name']}")
                return True
            elif response.status_code == 400 and "already registered" in response.text:
                # User exists, try login
                login_data = {
                    "email": signup_data["email"],
                    "password": signup_data["password"]
                }
                response = requests.post(f"{self.base_url}/auth/login", json=login_data)
                if response.status_code == 200:
                    data = response.json()
                    self.auth_token = data["access_token"]
                    self.user_data = data["user"]
                    self.log_test("User Login", True, f"Logged in user: {self.user_data['full_name']}")
                    return True
                else:
                    self.log_test("User Login", False, f"Login failed: {response.text}")
                    return False
            else:
                self.log_test("User Signup", False, f"Signup failed: {response.text}")
                return False
        except Exception as e:
            self.log_test("Authentication Setup", False, f"Error: {str(e)}")
            return False
    
    def get_headers(self):
        """Get authorization headers"""
        return {"Authorization": f"Bearer {self.auth_token}"}
    
    def test_database_population(self):
        """Test if database has been populated with Excel data"""
        print("\n=== DATABASE VERIFICATION ===")
        
        # We'll verify through API calls since we can't directly access MongoDB
        try:
            # Test chapters endpoint to verify data exists
            response = requests.get(f"{self.base_url}/chapters", headers=self.get_headers())
            if response.status_code == 200:
                chapters = response.json()
                chapter_count = len(chapters)
                self.log_test("Database - Chapters", chapter_count >= 1, 
                            f"Found {chapter_count} chapters (expected: 1)", chapters)
                return chapter_count > 0
            else:
                self.log_test("Database - Chapters", False, f"Failed to fetch chapters: {response.text}")
                return False
        except Exception as e:
            self.log_test("Database Population Check", False, f"Error: {str(e)}")
            return False
    
    def test_chapters_endpoint(self):
        """Test GET /api/chapters"""
        print("\n=== TESTING CHAPTERS ENDPOINT ===")
        
        try:
            response = requests.get(f"{self.base_url}/chapters", headers=self.get_headers())
            if response.status_code == 200:
                chapters = response.json()
                if chapters and len(chapters) > 0:
                    chapter = chapters[0]
                    required_fields = ["chapter_id", "title", "order"]
                    has_required = all(field in chapter for field in required_fields)
                    
                    self.log_test("GET /api/chapters", has_required, 
                                f"Retrieved {len(chapters)} chapters with required fields", chapters)
                    return chapters[0]["chapter_id"] if has_required else None
                else:
                    self.log_test("GET /api/chapters", False, "No chapters found")
                    return None
            else:
                self.log_test("GET /api/chapters", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("GET /api/chapters", False, f"Error: {str(e)}")
            return None
    
    def test_chapter_topics_endpoint(self, chapter_id):
        """Test GET /api/chapters/{chapter_id}/topics"""
        print("\n=== TESTING CHAPTER TOPICS ENDPOINT ===")
        
        try:
            response = requests.get(f"{self.base_url}/chapters/{chapter_id}/topics", headers=self.get_headers())
            if response.status_code == 200:
                topics = response.json()
                if topics and len(topics) > 0:
                    topic = topics[0]
                    required_fields = ["topic_id", "title", "order"]
                    has_required = all(field in topic for field in required_fields)
                    
                    self.log_test("GET /api/chapters/{chapter_id}/topics", has_required,
                                f"Retrieved {len(topics)} topics with required fields", topics)
                    return topics[0]["topic_id"] if has_required else None
                else:
                    self.log_test("GET /api/chapters/{chapter_id}/topics", False, "No topics found")
                    return None
            else:
                self.log_test("GET /api/chapters/{chapter_id}/topics", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("GET /api/chapters/{chapter_id}/topics", False, f"Error: {str(e)}")
            return None
    
    def test_topic_subtopics_endpoint(self, topic_id):
        """Test GET /api/topics/{topic_id}/subtopics (NEW)"""
        print("\n=== TESTING TOPIC SUBTOPICS ENDPOINT (NEW) ===")
        
        try:
            response = requests.get(f"{self.base_url}/topics/{topic_id}/subtopics", headers=self.get_headers())
            if response.status_code == 200:
                data = response.json()
                if "subtopics" in data and len(data["subtopics"]) > 0:
                    subtopic = data["subtopics"][0]
                    required_fields = ["subtopic_id", "title", "order"]
                    has_required = all(field in subtopic for field in required_fields)
                    
                    self.log_test("GET /api/topics/{topic_id}/subtopics", has_required,
                                f"Retrieved {len(data['subtopics'])} subtopics with required fields", data)
                    return subtopic["subtopic_id"] if has_required else None
                else:
                    self.log_test("GET /api/topics/{topic_id}/subtopics", False, "No subtopics found")
                    return None
            else:
                self.log_test("GET /api/topics/{topic_id}/subtopics", False,
                            f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("GET /api/topics/{topic_id}/subtopics", False, f"Error: {str(e)}")
            return None
    
    def test_subtopic_microcontent_endpoint(self, subtopic_id):
        """Test GET /api/subtopics/{subtopic_id}/microcontent (NEW)"""
        print("\n=== TESTING SUBTOPIC MICROCONTENT ENDPOINT (NEW) ===")
        
        try:
            response = requests.get(f"{self.base_url}/subtopics/{subtopic_id}/microcontent", headers=self.get_headers())
            if response.status_code == 200:
                data = response.json()
                if "cards" in data and len(data["cards"]) > 0:
                    card = data["cards"][0]
                    required_fields = ["microcontent_id", "story", "relate", "why"]
                    has_required = all(field in card for field in required_fields)
                    
                    self.log_test("GET /api/subtopics/{subtopic_id}/microcontent", has_required,
                                f"Retrieved {len(data['cards'])} microcontent cards with 3 modes", data)
                    return True
                else:
                    self.log_test("GET /api/subtopics/{subtopic_id}/microcontent", False, "No microcontent cards found")
                    return False
            else:
                self.log_test("GET /api/subtopics/{subtopic_id}/microcontent", False,
                            f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("GET /api/subtopics/{subtopic_id}/microcontent", False, f"Error: {str(e)}")
            return False
    
    def test_subtopic_progress_endpoint(self, subtopic_id):
        """Test POST /api/subtopics/{subtopic_id}/progress (NEW)"""
        print("\n=== TESTING SUBTOPIC PROGRESS ENDPOINT (NEW) ===")
        
        try:
            # Test updating progress
            progress_data = {
                "current_card": 1,
                "completed": False
            }
            
            response = requests.post(f"{self.base_url}/subtopics/{subtopic_id}/progress", 
                                   params=progress_data, headers=self.get_headers())
            if response.status_code == 200:
                data = response.json()
                has_message = "message" in data
                has_xp = "xp_earned" in data
                
                self.log_test("POST /api/subtopics/{subtopic_id}/progress", has_message and has_xp,
                            f"Progress updated successfully, XP earned: {data.get('xp_earned', 0)}", data)
                return True
            else:
                self.log_test("POST /api/subtopics/{subtopic_id}/progress", False,
                            f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /api/subtopics/{subtopic_id}/progress", False, f"Error: {str(e)}")
            return False
    
    def test_subtopic_quiz_endpoint(self, subtopic_id):
        """Test GET /api/subtopics/{subtopic_id}/quiz (NEW)"""
        print("\n=== TESTING SUBTOPIC QUIZ ENDPOINT (NEW) ===")
        
        try:
            response = requests.get(f"{self.base_url}/subtopics/{subtopic_id}/quiz", headers=self.get_headers())
            if response.status_code == 200:
                data = response.json()
                if "questions" in data and len(data["questions"]) > 0:
                    question = data["questions"][0]
                    required_fields = ["question_id", "question_text", "options"]
                    has_required = all(field in question for field in required_fields)
                    
                    self.log_test("GET /api/subtopics/{subtopic_id}/quiz", has_required,
                                f"Retrieved {len(data['questions'])} quiz questions", data)
                    return data["quiz_id"], data["questions"][0]["question_id"], data["questions"][0]["options"][0]
                else:
                    self.log_test("GET /api/subtopics/{subtopic_id}/quiz", False, "No quiz questions found")
                    return None, None, None
            else:
                self.log_test("GET /api/subtopics/{subtopic_id}/quiz", False,
                            f"HTTP {response.status_code}: {response.text}")
                return None, None, None
        except Exception as e:
            self.log_test("GET /api/subtopics/{subtopic_id}/quiz", False, f"Error: {str(e)}")
            return None, None, None
    
    def test_quiz_submit_endpoint(self, quiz_id, subtopic_id, question_id, user_answer):
        """Test POST /api/quiz/submit (NEW)"""
        print("\n=== TESTING QUIZ SUBMIT ENDPOINT (NEW) ===")
        
        try:
            submit_data = {
                "quiz_id": quiz_id,
                "subtopic_id": subtopic_id,
                "answers": [
                    {
                        "question_id": question_id,
                        "user_answer": user_answer
                    }
                ]
            }
            
            response = requests.post(f"{self.base_url}/quiz/submit", json=submit_data, headers=self.get_headers())
            if response.status_code == 200:
                data = response.json()
                required_fields = ["score", "correct_count", "xp_earned"]
                has_required = all(field in data for field in required_fields)
                
                self.log_test("POST /api/quiz/submit", has_required,
                            f"Quiz submitted - Score: {data.get('score', 0)}%, XP: {data.get('xp_earned', 0)}", data)
                return True
            else:
                self.log_test("POST /api/quiz/submit", False,
                            f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /api/quiz/submit", False, f"Error: {str(e)}")
            return False
    
    def run_full_test_suite(self):
        """Run complete test suite for Learn Tab backend"""
        print("🚀 Starting Learn Tab Backend API Testing")
        print("=" * 60)
        
        # Step 1: Setup authentication
        if not self.setup_auth():
            print("❌ Authentication failed - cannot continue testing")
            return False
        
        # Step 2: Verify database population
        if not self.test_database_population():
            print("❌ Database verification failed - data may not be populated")
            return False
        
        # Step 3: Test hierarchical flow
        chapter_id = self.test_chapters_endpoint()
        if not chapter_id:
            print("❌ Chapters endpoint failed - cannot continue hierarchical testing")
            return False
        
        topic_id = self.test_chapter_topics_endpoint(chapter_id)
        if not topic_id:
            print("❌ Topics endpoint failed - cannot continue hierarchical testing")
            return False
        
        subtopic_id = self.test_topic_subtopics_endpoint(topic_id)
        if not subtopic_id:
            print("❌ Subtopics endpoint failed - cannot continue hierarchical testing")
            return False
        
        # Test microcontent
        if not self.test_subtopic_microcontent_endpoint(subtopic_id):
            print("❌ Microcontent endpoint failed")
        
        # Test progress update
        if not self.test_subtopic_progress_endpoint(subtopic_id):
            print("❌ Progress update endpoint failed")
        
        # Test quiz flow
        quiz_id, question_id, sample_answer = self.test_subtopic_quiz_endpoint(subtopic_id)
        if quiz_id and question_id:
            self.test_quiz_submit_endpoint(quiz_id, subtopic_id, question_id, sample_answer)
        
        # Summary
        self.print_test_summary()
        return True
    
    def print_test_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for test in self.test_results if test["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        
        print("\n📋 DETAILED RESULTS:")
        for test in self.test_results:
            status = "✅" if test["success"] else "❌"
            print(f"{status} {test['test']}: {test['details']}")
        
        # Check for critical failures
        critical_tests = [
            "GET /api/chapters",
            "GET /api/chapters/{chapter_id}/topics", 
            "GET /api/topics/{topic_id}/subtopics",
            "GET /api/subtopics/{subtopic_id}/microcontent",
            "POST /api/subtopics/{subtopic_id}/progress",
            "GET /api/subtopics/{subtopic_id}/quiz",
            "POST /api/quiz/submit"
        ]
        
        failed_critical = [test for test in self.test_results 
                          if not test["success"] and test["test"] in critical_tests]
        
        if failed_critical:
            print(f"\n⚠️  CRITICAL FAILURES ({len(failed_critical)}):")
            for test in failed_critical:
                print(f"   ❌ {test['test']}: {test['details']}")
        else:
            print("\n✅ All critical Learn Tab endpoints are working!")

if __name__ == "__main__":
    tester = LearnTabTester()
    tester.run_full_test_suite()