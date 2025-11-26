# AILO - AI-Powered Learning Platform 🚀

## Overview
AILO is a comprehensive EdTech mobile application built with Expo (React Native) and FastAPI, featuring an AI-powered learning companion named Nova the mascot.

## 🎯 Features Implemented (Tier 1 - MVP)

### 1. **User Onboarding & Authentication**
- ✅ Landing screen with Nova mascot animation
- ✅ User signup with student/parent/teacher roles
- ✅ Parental consent for users under 18
- ✅ Email verification (OTP - mocked)
- ✅ Personalization quiz
- ✅ Daily goal setting
- ✅ MongoDB-based authentication

### 2. **Home Dashboard**
- ✅ Personalized welcome screen
- ✅ Streak tracking (daily consistency)
- ✅ XP and level display
- ✅ Daily goal progress
- ✅ Learning progress visualization
- ✅ AI-powered recommendations (OpenAI GPT-3.5)

### 3. **Learn Tab (Curriculum & Lessons)**
- ✅ Chapter list with progress indicators
- ✅ Topic list within chapters
- ✅ Lesson viewing with Markdown support
- ✅ Nova mascot interventions and tips
- ✅ Progress tracking (auto-save)
- ✅ Mark as complete functionality

### 4. **Practice Tab (Quizzes & Assessments)**
- ✅ Daily Challenge (5 random questions)
- ✅ Practice by Chapter
- ✅ Quiz taking interface
- ✅ Instant feedback
- ✅ Results screen with performance breakdown
- ✅ XP rewards for correct answers

### 5. **AI Features**
- ✅ Nova AI Chatbot (OpenAI GPT-3.5)
- ✅ Step-by-step problem solving
- ✅ Context-aware responses
- ✅ Personalized learning recommendations

### 6. **Community Tab**
- ✅ Leaderboard (Top 10 + user rank)
- ✅ Study Groups creation and joining
- ✅ Group messaging (basic text chat)

### 7. **Profile & Settings**
- ✅ User profile display
- ✅ Statistics (Level, XP, Streak)
- ✅ Settings menu
- ✅ Logout functionality

### 8. **Privacy & Data Controls**
- ✅ Privacy settings
- ✅ Data export
- ✅ Account deletion (soft delete with 30-day recovery)

### 9. **Parent Dashboard**
- ✅ Parent account linking
- ✅ View child's progress
- ✅ Weekly summary
- ✅ Activity breakdown
- ✅ AI-powered insights

## 🛠 Tech Stack

### Frontend
- **Framework**: Expo (React Native)
- **Routing**: expo-router (file-based routing)
- **State Management**: Zustand
- **UI Components**: Custom components with Ionicons
- **HTTP Client**: Axios
- **Markdown**: react-native-markdown-display
- **Storage**: AsyncStorage

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT tokens with passlib
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Security**: bcrypt password hashing

## 📱 App Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── signup.tsx
│   │   ├── login.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── learn.tsx
│   │   ├── practice.tsx
│   │   ├── community.tsx
│   │   └── profile.tsx
│   ├── chapter/[id].tsx
│   ├── topic/[id].tsx
│   ├── _layout.tsx
│   └── index.tsx
├── components/
│   ├── NovaMascot.tsx
│   └── ai/
│       └── NovaChatbot.tsx
├── contexts/
│   └── AuthContext.tsx
└── utils/
    └── api.ts

backend/
├── server.py (comprehensive API with all endpoints)
├── .env (OpenAI API key configured)
└── requirements.txt
```

## 🗄 Database Schema

### Collections:
- **users**: User accounts (student/parent/teacher)
- **chapters**: Learning chapters
- **topics**: Lessons/topics within chapters
- **user_progress**: Chapter progress tracking
- **topic_progress**: Topic/lesson progress
- **quiz_questions**: Question bank
- **quiz_responses**: User answers and performance
- **flagged_questions**: Student-reported issues
- **user_activity**: Daily activity for streak calculation
- **study_groups**: Community groups
- **group_members**: Group membership
- **group_messages**: Group chat messages
- **feedback**: User feedback
- **onboarding_responses**: Personalization quiz answers
- **parent_links**: Parent-student relationships
- **chat_history**: AI chatbot conversations
- **privacy_settings**: User privacy preferences

## 🚀 Getting Started

### 1. Seed Sample Data
The app includes a "Load Sample Content" button on the home screen that seeds:
- 3 chapters (Math topics)
- 4 topics with lesson content
- 6 quiz questions

### 2. Create an Account
- Sign up as a student
- Complete the personalization quiz
- Set your daily learning goal

### 3. Explore Features
- **Home**: View your dashboard and AI recommendations
- **Learn**: Browse chapters and study topics
- **Practice**: Take the daily challenge
- **Community**: Check the leaderboard and join study groups
- **Profile**: Manage your account

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-otp` - Verify email
- `GET /api/auth/me` - Get current user

### Learning
- `GET /api/chapters` - List all chapters
- `GET /api/chapters/{id}/topics` - Get topics in chapter
- `POST /api/topics/{id}/progress` - Update progress

### Practice
- `GET /api/quizzes/daily-challenge` - Get daily quiz
- `GET /api/quizzes/chapter/{id}` - Get chapter quiz
- `POST /api/quizzes/submit` - Submit answer
- `GET /api/quizzes/{id}/results` - Get quiz results

### AI
- `POST /api/ai/chat` - Chat with Nova

### Community
- `GET /api/community/leaderboard` - Get leaderboard
- `GET /api/community/groups` - List study groups
- `POST /api/community/groups` - Create group
- `POST /api/community/groups/{id}/join` - Join group
- `GET /api/community/groups/{id}/messages` - Get messages
- `POST /api/community/groups/{id}/messages` - Send message

### Feedback
- `POST /api/feedback/flag-question` - Flag question
- `POST /api/feedback/general` - Submit feedback

### Parent Dashboard
- `POST /api/parent/link` - Link parent to student
- `GET /api/parent/children` - Get linked children
- `GET /api/parent/student/{id}/dashboard` - View child's dashboard

### Privacy
- `GET /api/privacy/settings` - Get privacy settings
- `POST /api/privacy/settings` - Update settings
- `POST /api/privacy/delete-account` - Request deletion
- `GET /api/privacy/export-data` - Export user data

### Development
- `POST /api/seed/data` - Seed sample content

## 🎨 Design Features

### Color Scheme
- **Background**: Dark theme (#1E1E2E)
- **Cards**: #2D2D3D
- **Primary**: Gold (#FFD700) - Nova's signature color
- **Success**: Teal (#4ECDC4)
- **Error**: Red (#FF6B6B)
- **Text**: White (#FFFFFF) and Gray (#A0A0B0)

### Nova Mascot Animations
- **Wave**: Welcome and greeting
- **Cheer**: Celebrating correct answers
- **Think**: Processing or learning
- **Happy**: Positive reinforcement
- **Sad**: Incorrect answers (sympathetic)
- **Idle**: Default state

## 📊 Progress Tracking
- **Auto-save**: Progress saved every time user scrolls during lessons
- **Completion**: 90% scroll or manual "Mark as Complete"
- **XP Rewards**: 10 XP for completing topics, 5 XP per correct answer
- **Level System**: XP-based leveling

## 🔒 Privacy & Security
- **Password Hashing**: bcrypt
- **JWT Tokens**: 7-day expiration
- **Soft Delete**: 30-day recovery period
- **Data Export**: GDPR compliance
- **Parental Controls**: Required for users under 18

## 🤖 AI Integration

### OpenAI GPT-3.5-turbo
- **Chatbot**: Step-by-step explanations
- **Recommendations**: Personalized learning suggestions
- **Insights**: Performance analysis for parent dashboard

### Prompt Engineering
- **System Prompt**: Nova is friendly, encouraging, and educational
- **Temperature**: 0.7 for natural responses
- **Max Tokens**: 200-300 for concise answers

## 📝 Next Steps (Beyond MVP)

### Phase 2 Features:
- Multi-language support (Hindi + English)
- Offline mode with sync
- Advanced analytics
- Video lessons
- Interactive assessments
- Badges and achievements
- Social features (friend system)
- Parent notifications
- School integration
- Teacher dashboard

### Technical Improvements:
- Image optimization
- Caching strategy
- Performance monitoring
- Error tracking (Sentry)
- Analytics (Mixpanel)
- Push notifications
- Deep linking
- App Store deployment

## 🐛 Known Limitations (MVP)

1. **Email**: OTP is logged but not sent (mocked)
2. **File Storage**: No cloud storage yet (base64 for now)
3. **Real-time**: No WebSocket for chat (polling required)
4. **Offline**: No offline support
5. **Media**: No image/video upload yet
6. **Testing**: Manual testing only (no automated tests)

## 💡 Tips for Testing

1. **Start Fresh**: Create a new account
2. **Seed Data**: Click "Load Sample Content" on home screen
3. **Complete Flow**: 
   - Signup → Onboarding → Home → Learn → Practice → Community
4. **Test AI**: Open Nova chatbot from any lesson screen
5. **Test Parent**: Create parent account and link to student

## 🎓 Educational Philosophy

AILO is built on these principles:
- **AI-Enhanced**: Not AI-replaced - human learning first
- **Engaging**: Gamification with purpose
- **Ethical**: Privacy-first, age-appropriate content
- **Adaptive**: Personalized learning paths
- **Social**: Community learning support
- **Transparent**: Clear data usage and controls

## 📱 Mobile-First Design

- **Touch Targets**: Minimum 44x44 points
- **Gestures**: Swipe, scroll, tap optimized
- **Keyboard**: Proper KeyboardAvoidingView
- **Safe Areas**: Respects notches and system UI
- **Performance**: Flash List for efficient rendering
- **Animations**: Native driver for 60fps

## 🎉 Success Metrics

Track these KPIs:
- Daily Active Users (DAU)
- Streak retention
- Lesson completion rate
- Quiz accuracy
- Time spent learning
- AI chatbot engagement
- Community participation
- Parent dashboard usage

---

**Built with ❤️ using Expo, FastAPI, and OpenAI**

**Mascot**: Nova the Learning Bird 🐦✨
