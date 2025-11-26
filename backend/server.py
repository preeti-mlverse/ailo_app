from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import random
import openai

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'ailo_db')]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "ailo-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# OpenAI Setup
openai.api_key = os.environ.get('OPENAI_API_KEY', '')

# Create the main app
app = FastAPI(title="AILO EdTech API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# MODELS
# ============================================================================

class UserRole(str):
    STUDENT = "student"
    PARENT = "parent"
    TEACHER = "teacher"

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "student"

class UserCreate(BaseModel):
    email: EmailStr
    mobile: str
    password: str
    role: str = "student"
    full_name: Optional[str] = "User"
    terms_accepted: bool = False
    privacy_accepted: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OnboardingQuizResponse(BaseModel):
    question_id: str
    answer: str

class GoalSetting(BaseModel):
    daily_goal_minutes: int = 30
    study_preferences: List[str] = []

class ChapterProgress(BaseModel):
    chapter_id: str
    progress: float
    completed: bool = False
    last_topic_id: Optional[str] = None

class QuizSubmission(BaseModel):
    quiz_id: str
    question_id: str
    user_answer: str
    time_taken: Optional[int] = None

class QuizResult(BaseModel):
    quiz_id: str
    score: float
    total_questions: int
    correct_answers: int
    xp_earned: int
    recommendations: List[str]

class FlagQuestion(BaseModel):
    question_id: str
    quiz_id: str
    flag_type: str  # "wrong_answer", "unclear", "typo", "other"
    feedback: Optional[str] = None

class Feedback(BaseModel):
    category: str  # "bug", "feature", "content", "other"
    message: str
    rating: Optional[int] = None
    screenshot: Optional[str] = None

class StudyGroup(BaseModel):
    name: str
    description: Optional[str] = None
    max_members: int = 10

class GroupMessage(BaseModel):
    group_id: str
    message: str

class ParentLinkRequest(BaseModel):
    parent_email: EmailStr
    student_id: str

class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = None  # lesson/quiz context

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"user_id": user_id})
    if user is None:
        raise credentials_exception
    return user

def generate_otp():
    return str(random.randint(100000, 999999))

async def get_ai_recommendations(user_id: str, performance_data: Dict):
    """Generate AI-powered learning recommendations"""
    try:
        if not openai.api_key:
            return ["Complete more practice quizzes", "Review weak topics", "Stay consistent"]
        
        prompt = f"""Based on this student's performance data, provide 3 specific, actionable learning recommendations:
        - Average quiz score: {performance_data.get('avg_score', 0)}%
        - Topics struggled with: {', '.join(performance_data.get('weak_topics', []))}
        - Strong topics: {', '.join(performance_data.get('strong_topics', []))}
        - Study streak: {performance_data.get('streak', 0)} days
        
        Provide recommendations as a JSON array of strings."""
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        
        recommendations = response.choices[0].message.content
        # Parse and return recommendations
        return eval(recommendations) if recommendations else ["Keep practicing!"]
    except Exception as e:
        logger.error(f"AI recommendation error: {e}")
        return ["Complete daily practice", "Review challenging topics", "Stay consistent"]

# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@api_router.post("/auth/signup", response_model=Token)
async def signup(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "mobile": user_data.mobile,
        "password": hashed_password,
        "full_name": user_data.full_name,
        "role": user_data.role,
        "terms_accepted": user_data.terms_accepted,
        "privacy_accepted": user_data.privacy_accepted,
        "created_at": datetime.utcnow(),
        "email_verified": False,
        "onboarding_completed": False,
        "xp": 0,
        "level": 1,
        "streak": 0,
        "daily_goal_minutes": 30,
        "total_study_time": 0,
    }
    
    await db.users.insert_one(user_doc)
    
    # Generate OTP (mocked - just store it)
    otp = generate_otp()
    await db.otps.insert_one({
        "user_id": user_id,
        "otp": otp,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(minutes=10)
    })
    
    logger.info(f"Generated OTP for {user_data.email}: {otp}")
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    user_doc.pop("password")
    user_doc.pop("_id")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_doc
    }

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["user_id"]})
    
    user.pop("password")
    user.pop("_id")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@api_router.post("/auth/verify-otp")
async def verify_otp(user_id: str, otp: str, current_user = Depends(get_current_user)):
    otp_doc = await db.otps.find_one({
        "user_id": user_id,
        "otp": otp,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not otp_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"email_verified": True}}
    )
    
    await db.otps.delete_one({"_id": otp_doc["_id"]})
    
    return {"message": "Email verified successfully"}

@api_router.get("/auth/me")
async def get_me(current_user = Depends(get_current_user)):
    current_user.pop("_id", None)
    current_user.pop("password", None)
    return current_user

# ============================================================================
# ONBOARDING ENDPOINTS
# ============================================================================

@api_router.post("/onboarding/quiz")
async def submit_onboarding_quiz(responses: List[OnboardingQuizResponse], current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Store responses
    for response in responses:
        await db.onboarding_responses.insert_one({
            "user_id": user_id,
            "question_id": response.question_id,
            "answer": response.answer,
            "created_at": datetime.utcnow()
        })
    
    return {"message": "Quiz responses saved"}

@api_router.post("/onboarding/goal")
async def set_goal(goal: GoalSetting, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": {
            "daily_goal_minutes": goal.daily_goal_minutes,
            "study_preferences": goal.study_preferences,
            "onboarding_completed": True
        }}
    )
    
    return {"message": "Goal set successfully"}

# ============================================================================
# HOME/DASHBOARD ENDPOINTS
# ============================================================================

@api_router.get("/dashboard/home")
async def get_home_dashboard(current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Get user progress
    chapters = await db.user_progress.find({"user_id": user_id}).to_list(100)
    total_chapters = await db.chapters.count_documents({})
    completed_chapters = sum(1 for ch in chapters if ch.get("completed", False))
    
    # Get recent activity
    recent_activity = await db.user_activity.find(
        {"user_id": user_id}
    ).sort("date", DESCENDING).limit(7).to_list(7)
    
    # Calculate streak
    streak = current_user.get("streak", 0)
    
    # Get AI recommendations
    quiz_responses = await db.quiz_responses.find({"user_id": user_id}).to_list(100)
    avg_score = sum(r.get("is_correct", 0) for r in quiz_responses) / len(quiz_responses) * 100 if quiz_responses else 0
    
    performance_data = {
        "avg_score": avg_score,
        "weak_topics": [],
        "strong_topics": [],
        "streak": streak
    }
    
    recommendations = await get_ai_recommendations(user_id, performance_data)
    
    return {
        "user": {
            "full_name": current_user["full_name"],
            "xp": current_user.get("xp", 0),
            "level": current_user.get("level", 1),
            "streak": streak,
        },
        "progress": {
            "total_chapters": total_chapters,
            "completed_chapters": completed_chapters,
            "percentage": (completed_chapters / total_chapters * 100) if total_chapters > 0 else 0
        },
        "daily_goal": {
            "target_minutes": current_user.get("daily_goal_minutes", 30),
            "completed_minutes": current_user.get("today_study_minutes", 0)
        },
        "recommendations": recommendations,
        "recent_activity": recent_activity
    }

# ============================================================================
# LEARN TAB ENDPOINTS
# ============================================================================

@api_router.get("/chapters")
async def get_chapters(current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    chapters = await db.chapters.find().sort("order", ASCENDING).to_list(100)
    user_progress = await db.user_progress.find({"user_id": user_id}).to_list(100)
    
    progress_map = {p["chapter_id"]: p for p in user_progress}
    
    result = []
    for chapter in chapters:
        chapter_id = chapter["chapter_id"]
        progress = progress_map.get(chapter_id, {})
        
        result.append({
            "chapter_id": chapter_id,
            "title": chapter["title"],
            "description": chapter.get("description", ""),
            "icon": chapter.get("icon", ""),
            "order": chapter["order"],
            "progress": progress.get("progress", 0),
            "completed": progress.get("completed", False),
            "locked": chapter.get("locked", False)
        })
    
    return result

@api_router.get("/chapters/{chapter_id}/topics")
async def get_chapter_topics(chapter_id: str, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    topics = await db.topics.find({"chapter_id": chapter_id}).sort("order", ASCENDING).to_list(100)
    topic_progress = await db.topic_progress.find({
        "user_id": user_id,
        "chapter_id": chapter_id
    }).to_list(100)
    
    progress_map = {p["topic_id"]: p for p in topic_progress}
    
    result = []
    for topic in topics:
        topic_id = topic["topic_id"]
        progress = progress_map.get(topic_id, {})
        
        result.append({
            "topic_id": topic_id,
            "title": topic["title"],
            "description": topic.get("description", ""),
            "content": topic.get("content", ""),
            "order": topic["order"],
            "progress": progress.get("progress", 0),
            "completed": progress.get("completed", False),
            "last_position": progress.get("last_position", 0)
        })
    
    return result

@api_router.post("/topics/{topic_id}/progress")
async def update_topic_progress(topic_id: str, progress: float, position: int, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    topic = await db.topics.find_one({"topic_id": topic_id})
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    await db.topic_progress.update_one(
        {"user_id": user_id, "topic_id": topic_id},
        {"$set": {
            "chapter_id": topic["chapter_id"],
            "progress": progress,
            "last_position": position,
            "completed": progress >= 90,
            "updated_at": datetime.utcnow()
        }},
        upsert=True
    )
    
    # Update chapter progress
    topics = await db.topics.find({"chapter_id": topic["chapter_id"]}).to_list(100)
    topic_progress = await db.topic_progress.find({
        "user_id": user_id,
        "chapter_id": topic["chapter_id"]
    }).to_list(100)
    
    total_topics = len(topics)
    completed_topics = sum(1 for p in topic_progress if p.get("completed", False))
    chapter_progress = (completed_topics / total_topics * 100) if total_topics > 0 else 0
    
    await db.user_progress.update_one(
        {"user_id": user_id, "chapter_id": topic["chapter_id"]},
        {"$set": {
            "progress": chapter_progress,
            "completed": chapter_progress >= 100,
            "updated_at": datetime.utcnow()
        }},
        upsert=True
    )
    
    # Award XP
    if progress >= 90:
        await db.users.update_one(
            {"user_id": user_id},
            {"$inc": {"xp": 10}}
        )
    
    return {"message": "Progress updated"}

# ============================================================================
# PRACTICE/QUIZ ENDPOINTS
# ============================================================================

@api_router.get("/quizzes/daily-challenge")
async def get_daily_challenge(current_user = Depends(get_current_user)):
    # Get 5 random questions from user's weak topics
    questions = await db.quiz_questions.aggregate([
        {"$sample": {"size": 5}}
    ]).to_list(5)
    
    quiz_id = str(uuid.uuid4())
    
    return {
        "quiz_id": quiz_id,
        "title": "Daily Challenge",
        "questions": [
            {
                "question_id": q["question_id"],
                "question_text": q["question_text"],
                "options": q["options"],
                "difficulty": q.get("difficulty", "medium"),
                "topic": q.get("topic", "")
            }
            for q in questions
        ]
    }

@api_router.get("/quizzes/chapter/{chapter_id}")
async def get_chapter_quiz(chapter_id: str, current_user = Depends(get_current_user)):
    topics = await db.topics.find({"chapter_id": chapter_id}).to_list(100)
    topic_ids = [t["topic_id"] for t in topics]
    
    questions = await db.quiz_questions.find({
        "topic_id": {"$in": topic_ids}
    }).to_list(100)
    
    # Randomly select 10 questions
    selected = random.sample(questions, min(10, len(questions)))
    
    quiz_id = str(uuid.uuid4())
    
    return {
        "quiz_id": quiz_id,
        "title": f"Chapter Quiz",
        "questions": [
            {
                "question_id": q["question_id"],
                "question_text": q["question_text"],
                "options": q["options"],
                "difficulty": q.get("difficulty", "medium"),
                "topic": q.get("topic", "")
            }
            for q in selected
        ]
    }

@api_router.post("/quizzes/submit")
async def submit_quiz_answer(submission: QuizSubmission, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Get question
    question = await db.quiz_questions.find_one({"question_id": submission.question_id})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = submission.user_answer == question["correct_answer"]
    
    # Store response
    await db.quiz_responses.insert_one({
        "user_id": user_id,
        "quiz_id": submission.quiz_id,
        "question_id": submission.question_id,
        "user_answer": submission.user_answer,
        "correct_answer": question["correct_answer"],
        "is_correct": is_correct,
        "time_taken": submission.time_taken,
        "created_at": datetime.utcnow()
    })
    
    # Award XP for correct answer
    if is_correct:
        xp_gained = 5
        await db.users.update_one(
            {"user_id": user_id},
            {"$inc": {"xp": xp_gained}}
        )
    
    return {
        "is_correct": is_correct,
        "correct_answer": question["correct_answer"],
        "explanation": question.get("explanation", ""),
        "xp_gained": 5 if is_correct else 0
    }

@api_router.get("/quizzes/{quiz_id}/results")
async def get_quiz_results(quiz_id: str, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    responses = await db.quiz_responses.find({
        "user_id": user_id,
        "quiz_id": quiz_id
    }).to_list(100)
    
    total_questions = len(responses)
    correct_answers = sum(1 for r in responses if r["is_correct"])
    score = (correct_answers / total_questions * 100) if total_questions > 0 else 0
    xp_earned = correct_answers * 5
    
    # Get AI recommendations
    incorrect_topics = []
    for r in responses:
        if not r["is_correct"]:
            question = await db.quiz_questions.find_one({"question_id": r["question_id"]})
            if question:
                incorrect_topics.append(question.get("topic", ""))
    
    performance_data = {
        "avg_score": score,
        "weak_topics": list(set(incorrect_topics)),
        "strong_topics": [],
        "streak": current_user.get("streak", 0)
    }
    
    recommendations = await get_ai_recommendations(user_id, performance_data)
    
    return {
        "quiz_id": quiz_id,
        "score": score,
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "xp_earned": xp_earned,
        "recommendations": recommendations,
        "performance_breakdown": responses
    }

# ============================================================================
# FLAGGING & FEEDBACK ENDPOINTS
# ============================================================================

@api_router.post("/feedback/flag-question")
async def flag_question(flag: FlagQuestion, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    await db.flagged_questions.insert_one({
        "user_id": user_id,
        "question_id": flag.question_id,
        "quiz_id": flag.quiz_id,
        "flag_type": flag.flag_type,
        "feedback": flag.feedback,
        "created_at": datetime.utcnow(),
        "status": "pending"
    })
    
    # Check if flagged more than 3 times
    flag_count = await db.flagged_questions.count_documents({"question_id": flag.question_id})
    if flag_count >= 3:
        logger.warning(f"Question {flag.question_id} has been flagged {flag_count} times")
    
    return {"message": "Question flagged successfully"}

@api_router.post("/feedback/general")
async def submit_feedback(feedback: Feedback, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    await db.feedback.insert_one({
        "user_id": user_id,
        "category": feedback.category,
        "message": feedback.message,
        "rating": feedback.rating,
        "screenshot": feedback.screenshot,
        "created_at": datetime.utcnow(),
        "status": "pending"
    })
    
    return {"message": "Feedback submitted successfully"}

# ============================================================================
# COMMUNITY ENDPOINTS
# ============================================================================

@api_router.get("/community/leaderboard")
async def get_leaderboard(current_user = Depends(get_current_user)):
    # Get top 10 users by XP
    top_users = await db.users.find(
        {"role": "student"},
        {"user_id": 1, "full_name": 1, "xp": 1, "level": 1}
    ).sort("xp", DESCENDING).limit(10).to_list(10)
    
    # Get current user rank
    all_users = await db.users.find(
        {"role": "student"},
        {"user_id": 1, "xp": 1}
    ).sort("xp", DESCENDING).to_list(10000)
    
    user_rank = next((i + 1 for i, u in enumerate(all_users) if u["user_id"] == current_user["user_id"]), None)
    
    return {
        "top_users": [
            {
                "rank": i + 1,
                "user_id": u["user_id"],
                "full_name": u["full_name"],
                "xp": u["xp"],
                "level": u.get("level", 1)
            }
            for i, u in enumerate(top_users)
        ],
        "current_user_rank": user_rank,
        "current_user_xp": current_user.get("xp", 0)
    }

@api_router.post("/community/groups")
async def create_study_group(group: StudyGroup, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    group_id = str(uuid.uuid4())
    
    await db.study_groups.insert_one({
        "group_id": group_id,
        "name": group.name,
        "description": group.description,
        "max_members": group.max_members,
        "created_by": user_id,
        "created_at": datetime.utcnow()
    })
    
    # Add creator as first member
    await db.group_members.insert_one({
        "group_id": group_id,
        "user_id": user_id,
        "joined_at": datetime.utcnow(),
        "role": "admin"
    })
    
    return {"group_id": group_id, "message": "Group created successfully"}

@api_router.get("/community/groups")
async def get_study_groups(current_user = Depends(get_current_user)):
    groups = await db.study_groups.find().to_list(100)
    
    result = []
    for group in groups:
        member_count = await db.group_members.count_documents({"group_id": group["group_id"]})
        is_member = await db.group_members.find_one({
            "group_id": group["group_id"],
            "user_id": current_user["user_id"]
        })
        
        result.append({
            "group_id": group["group_id"],
            "name": group["name"],
            "description": group.get("description", ""),
            "member_count": member_count,
            "max_members": group["max_members"],
            "is_member": is_member is not None
        })
    
    return result

@api_router.post("/community/groups/{group_id}/join")
async def join_study_group(group_id: str, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Check if already member
    existing = await db.group_members.find_one({"group_id": group_id, "user_id": user_id})
    if existing:
        raise HTTPException(status_code=400, detail="Already a member")
    
    # Check if group is full
    group = await db.study_groups.find_one({"group_id": group_id})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    member_count = await db.group_members.count_documents({"group_id": group_id})
    if member_count >= group["max_members"]:
        raise HTTPException(status_code=400, detail="Group is full")
    
    await db.group_members.insert_one({
        "group_id": group_id,
        "user_id": user_id,
        "joined_at": datetime.utcnow(),
        "role": "member"
    })
    
    return {"message": "Joined group successfully"}

@api_router.get("/community/groups/{group_id}/messages")
async def get_group_messages(group_id: str, current_user = Depends(get_current_user)):
    # Check if member
    is_member = await db.group_members.find_one({
        "group_id": group_id,
        "user_id": current_user["user_id"]
    })
    if not is_member:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    messages = await db.group_messages.find(
        {"group_id": group_id}
    ).sort("created_at", ASCENDING).limit(100).to_list(100)
    
    result = []
    for msg in messages:
        user = await db.users.find_one({"user_id": msg["user_id"]})
        result.append({
            "message_id": str(msg["_id"]),
            "user_id": msg["user_id"],
            "user_name": user["full_name"] if user else "Unknown",
            "message": msg["message"],
            "created_at": msg["created_at"].isoformat()
        })
    
    return result

@api_router.post("/community/groups/{group_id}/messages")
async def send_group_message(group_id: str, message: GroupMessage, current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Check if member
    is_member = await db.group_members.find_one({"group_id": group_id, "user_id": user_id})
    if not is_member:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    await db.group_messages.insert_one({
        "group_id": group_id,
        "user_id": user_id,
        "message": message.message,
        "created_at": datetime.utcnow()
    })
    
    return {"message": "Message sent"}

# ============================================================================
# AI CHATBOT ENDPOINTS
# ============================================================================

@api_router.post("/ai/chat")
async def chat_with_ai(chat: ChatMessage, current_user = Depends(get_current_user)):
    try:
        if not openai.api_key:
            return {
                "response": "I'm Nova, your learning assistant! I'm here to help you understand topics better. How can I assist you today?",
                "success": False,
                "error": "AI service not configured"
            }
        
        system_prompt = """You are Nova, a friendly and encouraging educational assistant for students. 
        Your role is to:
        1. Explain concepts step-by-step in simple terms
        2. Break down complex problems into manageable steps
        3. Encourage students and build their confidence
        4. Use analogies and examples to make concepts clearer
        5. Ask guiding questions to help students think critically
        
        Keep responses concise (2-3 paragraphs max) and age-appropriate."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": chat.message}
        ]
        
        if chat.context:
            messages.insert(1, {"role": "system", "content": f"Context: {chat.context}"})
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=300,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # Store conversation
        await db.chat_history.insert_one({
            "user_id": current_user["user_id"],
            "message": chat.message,
            "response": ai_response,
            "context": chat.context,
            "created_at": datetime.utcnow()
        })
        
        return {
            "response": ai_response,
            "success": True
        }
    except Exception as e:
        logger.error(f"AI chat error: {e}")
        return {
            "response": "I'm having trouble connecting right now. Please try again in a moment!",
            "success": False,
            "error": str(e)
        }

# ============================================================================
# PARENT DASHBOARD ENDPOINTS
# ============================================================================

@api_router.post("/parent/link")
async def link_parent_to_student(request: ParentLinkRequest):
    # Check if parent exists
    parent = await db.users.find_one({"email": request.parent_email, "role": "parent"})
    if not parent:
        raise HTTPException(status_code=404, detail="Parent account not found")
    
    # Link parent to student
    await db.parent_links.insert_one({
        "parent_id": parent["user_id"],
        "student_id": request.student_id,
        "created_at": datetime.utcnow(),
        "verified": True
    })
    
    return {"message": "Parent linked successfully"}

@api_router.get("/parent/children")
async def get_linked_children(current_user = Depends(get_current_user)):
    if current_user["role"] != "parent":
        raise HTTPException(status_code=403, detail="Only parents can access this")
    
    links = await db.parent_links.find({"parent_id": current_user["user_id"]}).to_list(10)
    
    children = []
    for link in links:
        student = await db.users.find_one({"user_id": link["student_id"]})
        if student:
            children.append({
                "student_id": student["user_id"],
                "full_name": student["full_name"],
                "grade": student.get("grade"),
                "school": student.get("school")
            })
    
    return children

@api_router.get("/parent/student/{student_id}/dashboard")
async def get_student_dashboard_for_parent(student_id: str, current_user = Depends(get_current_user)):
    if current_user["role"] != "parent":
        raise HTTPException(status_code=403, detail="Only parents can access this")
    
    # Verify parent is linked to student
    link = await db.parent_links.find_one({
        "parent_id": current_user["user_id"],
        "student_id": student_id
    })
    if not link:
        raise HTTPException(status_code=403, detail="Not linked to this student")
    
    # Get student info
    student = await db.users.find_one({"user_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get quiz performance
    quiz_responses = await db.quiz_responses.find({"user_id": student_id}).to_list(1000)
    total_quizzes = len(set(r["quiz_id"] for r in quiz_responses))
    avg_score = (sum(1 for r in quiz_responses if r["is_correct"]) / len(quiz_responses) * 100) if quiz_responses else 0
    
    # Get activity data (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_activity = await db.user_activity.find({
        "user_id": student_id,
        "date": {"$gte": week_ago}
    }).to_list(7)
    
    total_study_minutes = sum(a.get("minutes", 0) for a in recent_activity)
    
    # Get progress
    chapters = await db.user_progress.find({"user_id": student_id}).to_list(100)
    completed_chapters = sum(1 for ch in chapters if ch.get("completed", False))
    
    # Generate insights with AI
    performance_data = {
        "avg_score": avg_score,
        "weak_topics": [],
        "strong_topics": [],
        "streak": student.get("streak", 0)
    }
    insights = await get_ai_recommendations(student_id, performance_data)
    
    return {
        "student": {
            "full_name": student["full_name"],
            "grade": student.get("grade"),
            "streak": student.get("streak", 0),
            "xp": student.get("xp", 0),
            "level": student.get("level", 1)
        },
        "weekly_summary": {
            "total_study_minutes": total_study_minutes,
            "quizzes_taken": total_quizzes,
            "avg_score": avg_score,
            "chapters_completed": completed_chapters
        },
        "recent_activity": recent_activity,
        "insights": insights
    }

# ============================================================================
# PRIVACY & DATA CONTROL ENDPOINTS
# ============================================================================

@api_router.get("/privacy/settings")
async def get_privacy_settings(current_user = Depends(get_current_user)):
    settings = await db.privacy_settings.find_one({"user_id": current_user["user_id"]})
    
    if not settings:
        # Default settings
        return {
            "data_collection": True,
            "data_sharing": False,
            "personalized_ads": False,
            "analytics": True
        }
    
    return settings

@api_router.post("/privacy/settings")
async def update_privacy_settings(settings: Dict[str, bool], current_user = Depends(get_current_user)):
    await db.privacy_settings.update_one(
        {"user_id": current_user["user_id"]},
        {"$set": {**settings, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    
    return {"message": "Privacy settings updated"}

@api_router.post("/privacy/delete-account")
async def request_account_deletion(current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Soft delete - mark for deletion
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": {
            "deleted_at": datetime.utcnow(),
            "status": "pending_deletion"
        }}
    )
    
    logger.info(f"Account deletion requested for user {user_id}")
    
    return {
        "message": "Account deletion requested. Your data will be permanently deleted in 30 days.",
        "deletion_date": (datetime.utcnow() + timedelta(days=30)).isoformat()
    }

@api_router.get("/privacy/export-data")
async def export_user_data(current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Collect all user data
    user_data = {
        "user_info": current_user,
        "progress": await db.user_progress.find({"user_id": user_id}).to_list(1000),
        "quiz_responses": await db.quiz_responses.find({"user_id": user_id}).to_list(1000),
        "feedback": await db.feedback.find({"user_id": user_id}).to_list(1000),
        "chat_history": await db.chat_history.find({"user_id": user_id}).to_list(1000)
    }
    
    return user_data

# ============================================================================
# SEED DATA ENDPOINT (Development Only)
# ============================================================================

@api_router.post("/seed/data")
async def seed_database():
    """Seed database with sample chapters, topics, and quiz questions"""
    
    # Clear existing data
    await db.chapters.delete_many({})
    await db.topics.delete_many({})
    await db.quiz_questions.delete_many({})
    
    # Seed Chapters
    chapters = [
        {
            "chapter_id": "ch1",
            "title": "Introduction to Mathematics",
            "description": "Learn the basics of numbers and operations",
            "icon": "calculator",
            "order": 1,
            "locked": False
        },
        {
            "chapter_id": "ch2",
            "title": "Algebra Fundamentals",
            "description": "Master variables, equations, and expressions",
            "icon": "function",
            "order": 2,
            "locked": False
        },
        {
            "chapter_id": "ch3",
            "title": "Geometry Basics",
            "description": "Explore shapes, angles, and spatial reasoning",
            "icon": "shapes",
            "order": 3,
            "locked": False
        }
    ]
    
    await db.chapters.insert_many(chapters)
    
    # Seed Topics
    topics = [
        {
            "topic_id": "t1",
            "chapter_id": "ch1",
            "title": "Number Systems",
            "description": "Understanding different types of numbers",
            "content": "# Number Systems\n\nNumbers are the foundation of mathematics. Let's explore:\n\n## Natural Numbers\nNatural numbers are counting numbers: 1, 2, 3, 4, 5...\n\n## Whole Numbers\nWhole numbers include zero: 0, 1, 2, 3, 4, 5...\n\n## Integers\nIntegers include negative numbers: ..., -3, -2, -1, 0, 1, 2, 3, ...\n\n### Practice\nCan you identify which category these numbers belong to?\n- 5 → Natural, Whole, Integer\n- 0 → Whole, Integer\n- -7 → Integer only",
            "order": 1
        },
        {
            "topic_id": "t2",
            "chapter_id": "ch1",
            "title": "Basic Operations",
            "description": "Addition, subtraction, multiplication, and division",
            "content": "# Basic Operations\n\n## Addition (+)\nCombining numbers together\nExample: 5 + 3 = 8\n\n## Subtraction (-)\nTaking away from a number\nExample: 10 - 4 = 6\n\n## Multiplication (×)\nRepeated addition\nExample: 4 × 3 = 12 (same as 4 + 4 + 4)\n\n## Division (÷)\nSplitting into equal parts\nExample: 12 ÷ 3 = 4",
            "order": 2
        },
        {
            "topic_id": "t3",
            "chapter_id": "ch2",
            "title": "Variables and Expressions",
            "description": "Introduction to algebraic thinking",
            "content": "# Variables and Expressions\n\n## What is a Variable?\nA variable is a letter that represents an unknown number.\n\nCommon variables: x, y, z, a, b\n\n## Algebraic Expressions\nCombinations of numbers and variables:\n- 2x + 3\n- 5y - 7\n- 3a + 2b\n\n## Example\nIf x = 5, what is 2x + 3?\n- Replace x with 5: 2(5) + 3\n- Calculate: 10 + 3 = 13",
            "order": 1
        },
        {
            "topic_id": "t4",
            "chapter_id": "ch3",
            "title": "Shapes and Properties",
            "description": "Learn about basic geometric shapes",
            "content": "# Shapes and Properties\n\n## Triangles\n- 3 sides\n- 3 angles\n- Sum of angles = 180°\n\n## Rectangles\n- 4 sides\n- Opposite sides equal\n- All angles = 90°\n\n## Circles\n- No sides\n- Perfectly round\n- Distance from center is radius",
            "order": 1
        }
    ]
    
    await db.topics.insert_many(topics)
    
    # Seed Quiz Questions
    questions = [
        {
            "question_id": "q1",
            "topic_id": "t1",
            "question_text": "Which of these is a whole number?",
            "options": ["-5", "0", "3.5", "1/2"],
            "correct_answer": "0",
            "explanation": "0 is a whole number. Whole numbers include 0 and all positive counting numbers.",
            "difficulty": "easy"
        },
        {
            "question_id": "q2",
            "topic_id": "t2",
            "question_text": "What is 15 - 7?",
            "options": ["6", "7", "8", "9"],
            "correct_answer": "8",
            "explanation": "15 - 7 = 8. Count back 7 from 15 to get the answer.",
            "difficulty": "easy"
        },
        {
            "question_id": "q3",
            "topic_id": "t2",
            "question_text": "What is 6 × 4?",
            "options": ["20", "22", "24", "26"],
            "correct_answer": "24",
            "explanation": "6 × 4 = 24. You can think of it as 6 + 6 + 6 + 6.",
            "difficulty": "medium"
        },
        {
            "question_id": "q4",
            "topic_id": "t3",
            "question_text": "If x = 3, what is 4x + 2?",
            "options": ["10", "12", "14", "16"],
            "correct_answer": "14",
            "explanation": "Replace x with 3: 4(3) + 2 = 12 + 2 = 14",
            "difficulty": "medium"
        },
        {
            "question_id": "q5",
            "topic_id": "t4",
            "question_text": "How many sides does a triangle have?",
            "options": ["2", "3", "4", "5"],
            "correct_answer": "3",
            "explanation": "A triangle has 3 sides and 3 angles.",
            "difficulty": "easy"
        },
        {
            "question_id": "q6",
            "topic_id": "t4",
            "question_text": "What is the sum of angles in a triangle?",
            "options": ["90°", "180°", "270°", "360°"],
            "correct_answer": "180°",
            "explanation": "The three angles in any triangle always add up to 180 degrees.",
            "difficulty": "medium"
        }
    ]
    
    await db.quiz_questions.insert_many(questions)
    
    return {
        "message": "Database seeded successfully",
        "chapters": len(chapters),
        "topics": len(topics),
        "questions": len(questions)
    }

# ============================================================================
# NEW CONTENT ENDPOINTS FOR HIERARCHICAL LEARN TAB
# ============================================================================

@api_router.get("/topics/{topic_id}/subtopics")
async def get_topic_subtopics(topic_id: str, current_user = Depends(get_current_user)):
    """Get all subtopics for a given topic"""
    user_id = current_user["user_id"]
    
    # Get topic info
    topic = await db.topics.find_one({"topic_id": topic_id})
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    # Get all subtopics for this topic
    subtopics = await db.subtopics.find({"topic_id": topic_id}).sort("order", ASCENDING).to_list(100)
    
    # Get user progress for subtopics
    subtopic_ids = [s["subtopic_id"] for s in subtopics]
    progress_docs = await db.subtopic_progress.find({
        "user_id": user_id,
        "subtopic_id": {"$in": subtopic_ids}
    }).to_list(100)
    
    progress_map = {p["subtopic_id"]: p for p in progress_docs}
    
    result = []
    for subtopic in subtopics:
        subtopic_id = subtopic["subtopic_id"]
        progress = progress_map.get(subtopic_id, {})
        
        result.append({
            "subtopic_id": subtopic_id,
            "title": subtopic["title"],
            "subtopic_title": subtopic.get("subtopic_title", ""),
            "order": subtopic.get("order", 0),
            "microcontent_count": subtopic.get("microcontent_count", 0),
            "completed": progress.get("completed", False),
            "progress": progress.get("progress", 0)
        })
    
    return {
        "topic": {
            "topic_id": topic["topic_id"],
            "title": topic["title"],
            "topic_title": topic.get("topic_title", ""),
            "chapter_id": topic["chapter_id"]
        },
        "subtopics": result
    }


@api_router.get("/subtopics/{subtopic_id}/microcontent")
async def get_subtopic_microcontent(subtopic_id: str, current_user = Depends(get_current_user)):
    """Get all microcontent cards for a given subtopic"""
    user_id = current_user["user_id"]
    
    # Get subtopic info
    subtopic = await db.subtopics.find_one({"subtopic_id": subtopic_id})
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")
    
    # Get all microcontent for this subtopic
    microcontent_list = await db.microcontent.find({"subtopic_id": subtopic_id}).sort("order", ASCENDING).to_list(100)
    
    # Get user progress
    progress = await db.subtopic_progress.find_one({
        "user_id": user_id,
        "subtopic_id": subtopic_id
    })
    
    cards = []
    for mc in microcontent_list:
        cards.append({
            "microcontent_id": mc["microcontent_id"],
            "order": mc.get("order", 0),
            "story": mc.get("story_explanation", ""),
            "relate": mc.get("analogy_explanation", ""),
            "why": mc.get("core_text", mc.get("microcontent_text", "")),
            "content_type": mc.get("content_type", "text"),
            "related_code": mc.get("related_code", None)
        })
    
    return {
        "subtopic": {
            "subtopic_id": subtopic["subtopic_id"],
            "title": subtopic["title"],
            "topic_id": subtopic["topic_id"],
            "chapter_id": subtopic["chapter_id"]
        },
        "cards": cards,
        "progress": progress.get("current_card", 0) if progress else 0,
        "total_cards": len(cards)
    }


@api_router.post("/subtopics/{subtopic_id}/progress")
async def update_subtopic_progress(
    subtopic_id: str,
    current_card: int,
    completed: bool = False,
    current_user = Depends(get_current_user)
):
    """Update user progress for a subtopic"""
    user_id = current_user["user_id"]
    
    subtopic = await db.subtopics.find_one({"subtopic_id": subtopic_id})
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")
    
    total_cards = subtopic.get("microcontent_count", 0)
    progress_pct = (current_card / total_cards * 100) if total_cards > 0 else 0
    
    await db.subtopic_progress.update_one(
        {"user_id": user_id, "subtopic_id": subtopic_id},
        {"$set": {
            "topic_id": subtopic["topic_id"],
            "chapter_id": subtopic["chapter_id"],
            "current_card": current_card,
            "progress": progress_pct,
            "completed": completed,
            "updated_at": datetime.utcnow()
        }},
        upsert=True
    )
    
    # Award XP if completed
    if completed:
        await db.users.update_one(
            {"user_id": user_id},
            {"$inc": {"xp": 15}}
        )
    
    return {"message": "Progress updated", "xp_earned": 15 if completed else 0}


@api_router.get("/subtopics/{subtopic_id}/quiz")
async def get_subtopic_quiz(subtopic_id: str, current_user = Depends(get_current_user)):
    """Get quiz questions for a completed subtopic"""
    
    # Get quiz questions for this subtopic
    questions = await db.quiz_questions.find({"subtopic_id": subtopic_id}).to_list(100)
    
    # Select up to 5 questions
    selected_questions = random.sample(questions, min(5, len(questions))) if questions else []
    
    quiz_id = str(uuid.uuid4())
    
    return {
        "quiz_id": quiz_id,
        "subtopic_id": subtopic_id,
        "questions": [
            {
                "question_id": q["question_id"],
                "question_text": q["question_text"],
                "options": q["options"],
                "difficulty": q.get("difficulty", "medium")
            }
            for q in selected_questions
        ]
    }


@api_router.post("/quiz/submit")
async def submit_quiz(
    quiz_id: str,
    subtopic_id: str,
    answers: List[Dict[str, str]],
    current_user = Depends(get_current_user)
):
    """Submit quiz answers and get results"""
    user_id = current_user["user_id"]
    
    # Validate answers
    correct_count = 0
    total_questions = len(answers)
    
    for answer in answers:
        question = await db.quiz_questions.find_one({"question_id": answer["question_id"]})
        if question and question["correct_answer"] == answer["user_answer"]:
            correct_count += 1
    
    score = (correct_count / total_questions * 100) if total_questions > 0 else 0
    xp_earned = correct_count * 5  # 5 XP per correct answer
    
    # Update user XP
    await db.users.update_one(
        {"user_id": user_id},
        {"$inc": {"xp": xp_earned}}
    )
    
    # Store quiz result
    await db.quiz_results.insert_one({
        "user_id": user_id,
        "quiz_id": quiz_id,
        "subtopic_id": subtopic_id,
        "score": score,
        "correct_count": correct_count,
        "total_questions": total_questions,
        "xp_earned": xp_earned,
        "completed_at": datetime.utcnow()
    })
    
    return {
        "score": score,
        "correct_count": correct_count,
        "total_questions": total_questions,
        "xp_earned": xp_earned,
        "message": "Great job!" if score >= 80 else "Keep practicing!"
    }


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
