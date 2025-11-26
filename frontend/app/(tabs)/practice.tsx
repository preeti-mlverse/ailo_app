import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NovaMascot } from '../../components/NovaMascot';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PracticeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/practice/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboard(response.data);
    } catch (error) {
      console.error('Error loading practice dashboard:', error);
      Alert.alert('Error', 'Failed to load practice dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handleStartQuiz = (quizId: string, chapterName: string) => {
    Alert.alert('Coming Soon', `Quiz for ${chapterName} will start here!`);
    // router.push({ pathname: '/practice/quiz', params: { quizId, chapterName } });
  };

  const handleViewStats = () => {
    Alert.alert('Coming Soon', 'Detailed stats will appear here!');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E6B800" />
        <Text style={styles.loadingText}>Loading practice...</Text>
      </View>
    );
  }

  const isFirstTime = dashboard?.stats?.total_quizzes === 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E6B800" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PRACTICE</Text>
        <TouchableOpacity onPress={handleViewStats} style={styles.statsButton}>
          <Ionicons name="stats-chart" size={24} color="#E6B800" />
        </TouchableOpacity>
      </View>

      {/* Stats Section (if not first time) */}
      {!isFirstTime && (
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={28} color="#FF6B6B" />
            <Text style={styles.statValue}>{dashboard.stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={28} color="#4ECDC4" />
            <Text style={styles.statValue}>{dashboard.stats.avg_score}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={28} color="#E6B800" />
            <Text style={styles.statValue}>{dashboard.stats.total_xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>
      )}

      {/* Welcome Section for First-Time Users */}
      {isFirstTime && (
        <View style={styles.welcomeSection}>
          <NovaMascot animation="wave" size={120} />
          <Text style={styles.welcomeTitle}>🎉 WELCOME TO PRACTICE!</Text>
          <Text style={styles.welcomeText}>
            Your first quiz is waiting! Complete it to:
          </Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>✓ Unlock personalized recommendations</Text>
            <Text style={styles.benefitItem}>✓ Start building your learning streak</Text>
            <Text style={styles.benefitItem}>✓ Earn XP and badges</Text>
          </View>
        </View>
      )}

      {/* Chapter-Based Practice */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 CHAPTER-BASED PRACTICE</Text>
        <Text style={styles.sectionSubtitle}>Practice what you've learned</Text>
        
        {dashboard.chapter_quizzes?.map((quiz: any, index: number) => (
          <TouchableOpacity
            key={quiz.quiz_id}
            style={[
              styles.quizCard,
              index === 0 && isFirstTime && styles.highlightedCard
            ]}
            onPress={() => handleStartQuiz(quiz.quiz_id, quiz.chapter_name)}
          >
            <View style={styles.quizHeader}>
              <View style={styles.quizTitleContainer}>
                <Text style={styles.chapterNumber}>Chapter {quiz.chapter_number}</Text>
                <Text style={styles.quizTitle}>{quiz.chapter_name}</Text>
              </View>
              {quiz.completed && (
                <Ionicons name="checkmark-circle" size={28} color="#4ECDC4" />
              )}
            </View>
            
            <View style={styles.quizInfo}>
              <View style={styles.quizInfoItem}>
                <Ionicons name="help-circle-outline" size={16} color="#A0A0B0" />
                <Text style={styles.quizInfoText}>{quiz.total_questions} questions</Text>
              </View>
              <View style={styles.quizInfoItem}>
                <Ionicons name="time-outline" size={16} color="#A0A0B0" />
                <Text style={styles.quizInfoText}>~{Math.floor(quiz.time_limit / 60)} minutes</Text>
              </View>
            </View>
            
            {quiz.best_score !== null ? (
              <View style={styles.quizProgress}>
                <Text style={styles.bestScoreText}>
                  Best: {quiz.best_score}% ({quiz.attempts} attempts)
                </Text>
                {quiz.best_score < 90 && (
                  <Text style={styles.improvementText}>🔥 Aim for 90%!</Text>
                )}
              </View>
            ) : (
              <View style={styles.rewardBadge}>
                <Ionicons name="gift" size={16} color="#E6B800" />
                <Text style={styles.rewardBadgeText}>Reward: {quiz.xp_reward} XP</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[
                styles.quizActionButton,
                index === 0 && isFirstTime && styles.primaryButton
              ]}
              onPress={() => handleStartQuiz(quiz.quiz_id, quiz.chapter_name)}
            >
              <Text style={[
                styles.quizActionButtonText,
                index === 0 && isFirstTime && styles.primaryButtonText
              ]}>
                {quiz.best_score !== null ? 'Retake Quiz' : 'Start Quiz'}
              </Text>
              <Ionicons 
                name="arrow-forward" 
                size={16} 
                color={index === 0 && isFirstTime ? "#1E1E2E" : "#E6B800"} 
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mascot Tip */}
      <View style={styles.tipSection}>
        <NovaMascot animation="happy" size={60} />
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipText}>
            {isFirstTime 
              ? "Start with Chapter 1 to build your foundation!" 
              : "Focus on chapters where your score is below 80% to maximize your learning!"}
          </Text>
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsButton: {
    padding: 8,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0A0B0',
    marginTop: 4,
  },
  welcomeSection: {
    backgroundColor: '#2D2D3D',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#A0A0B0',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#FFFFFF',
    marginVertical: 6,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#A0A0B0',
    marginBottom: 16,
  },
  quizCard: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#E6B800',
    backgroundColor: '#3D3D2D',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  quizTitleContainer: {
    flex: 1,
  },
  chapterNumber: {
    fontSize: 12,
    color: '#E6B800',
    fontWeight: '600',
    marginBottom: 4,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quizInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  quizInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quizInfoText: {
    fontSize: 13,
    color: '#A0A0B0',
  },
  quizProgress: {
    marginBottom: 12,
  },
  bestScoreText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  improvementText: {
    fontSize: 12,
    color: '#FF6B6B',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  rewardBadgeText: {
    fontSize: 13,
    color: '#E6B800',
    fontWeight: '600',
  },
  quizActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E6B800',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  quizActionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E6B800',
  },
  primaryButton: {
    backgroundColor: '#E6B800',
    borderColor: '#E6B800',
  },
  primaryButtonText: {
    color: '#1E1E2E',
  },
  tipSection: {
    flexDirection: 'row',
    backgroundColor: '#2D2D3D',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E6B800',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: '#A0A0B0',
    lineHeight: 18,
  },
});
