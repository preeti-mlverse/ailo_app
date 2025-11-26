import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API Functions
export const authAPI = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
  verifyOTP: (userId: string, otp: string) => api.post('/auth/verify-otp', { user_id: userId, otp }),
  getMe: () => api.get('/auth/me'),
};

export const onboardingAPI = {
  submitQuiz: (responses: any[]) => api.post('/onboarding/quiz', responses),
  setGoal: (goal: any) => api.post('/onboarding/goal', goal),
};

export const dashboardAPI = {
  getHome: () => api.get('/dashboard/home'),
};

export const learningAPI = {
  getChapters: () => api.get('/chapters'),
  getTopics: (chapterId: string) => api.get(`/chapters/${chapterId}/topics`),
  updateProgress: (topicId: string, progress: number, position: number) =>
    api.post(`/topics/${topicId}/progress`, { progress, position }),
};

export const quizAPI = {
  getDailyChallenge: () => api.get('/quizzes/daily-challenge'),
  getChapterQuiz: (chapterId: string) => api.get(`/quizzes/chapter/${chapterId}`),
  submitAnswer: (data: any) => api.post('/quizzes/submit', data),
  getResults: (quizId: string) => api.get(`/quizzes/${quizId}/results`),
};

export const communityAPI = {
  getLeaderboard: () => api.get('/community/leaderboard'),
  getGroups: () => api.get('/community/groups'),
  createGroup: (data: any) => api.post('/community/groups', data),
  joinGroup: (groupId: string) => api.post(`/community/groups/${groupId}/join`),
  getMessages: (groupId: string) => api.get(`/community/groups/${groupId}/messages`),
  sendMessage: (groupId: string, message: string) =>
    api.post(`/community/groups/${groupId}/messages`, { message }),
};

export const feedbackAPI = {
  flagQuestion: (data: any) => api.post('/feedback/flag-question', data),
  submitFeedback: (data: any) => api.post('/feedback/general', data),
};

export const aiAPI = {
  chat: (message: string, context?: string) => api.post('/ai/chat', { message, context }),
};

export const parentAPI = {
  linkParent: (data: any) => api.post('/parent/link', data),
  getChildren: () => api.get('/parent/children'),
  getStudentDashboard: (studentId: string) => api.get(`/parent/student/${studentId}/dashboard`),
};

export const privacyAPI = {
  getSettings: () => api.get('/privacy/settings'),
  updateSettings: (settings: any) => api.post('/privacy/settings', settings),
  deleteAccount: () => api.post('/privacy/delete-account'),
  exportData: () => api.get('/privacy/export-data'),
};

export const seedAPI = {
  seedData: () => api.post('/seed/data'),
};

export default api;
