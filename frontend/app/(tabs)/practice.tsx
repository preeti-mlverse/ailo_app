import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { NovaMascot } from '../../components/NovaMascot';
import { Ionicons } from '@expo/vector-icons';
import { quizAPI } from '../../utils/api';

export default function PracticeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartDailyChallenge = async () => {
    setLoading(true);
    try {
      const response = await quizAPI.getDailyChallenge();
      // Navigate to quiz screen with quiz data
      router.push({
        pathname: '/quiz/[id]',
        params: { id: response.data.quiz_id, quizData: JSON.stringify(response.data) },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load daily challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.subtitle}>Test your knowledge</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Daily Challenge */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash" size={24} color="#FFD700" />
            <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Daily Challenge</Text>
          </View>

          <TouchableOpacity
            style={styles.dailyChallengeCard}
            onPress={handleStartDailyChallenge}
            disabled={loading}
          >
            <View style={styles.challengeHeader}>
              <NovaMascot animation="cheer" size={80} />
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>Today's Challenge</Text>
                <Text style={styles.challengeDescription}>
                  5 questions to test your skills
                </Text>
                <View style={styles.challengeBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.challengeBadgeText}>+25 XP</Text>
                </View>
              </View>
            </View>
            <View style={styles.challengeButton}>
              <Text style={styles.challengeButtonText}>
                {loading ? 'Loading...' : 'Start Now'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#1E1E2E" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Practice by Chapter */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book" size={24} color="#4ECDC4" />
            <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Practice by Chapter</Text>
          </View>

          <TouchableOpacity
            style={styles.practiceCard}
            onPress={() => router.push('/(tabs)/learn')}
          >
            <View style={styles.practiceIcon}>
              <Ionicons name="calculator" size={32} color="#FFD700" />
            </View>
            <View style={styles.practiceInfo}>
              <Text style={styles.practiceTitle}>Chapter Quizzes</Text>
              <Text style={styles.practiceDescription}>
                Practice questions from each chapter
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
          </TouchableOpacity>
        </View>

        {/* Special Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={24} color="#FF6B6B" />
            <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Special Challenges</Text>
          </View>

          <View style={styles.comingSoonCard}>
            <Ionicons name="rocket" size={48} color="#A0A0B0" />
            <Text style={styles.comingSoonText}>Coming Soon!</Text>
            <Text style={styles.comingSoonSubtext}>
              Weekly challenges and tournaments
            </Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0B0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dailyChallengeCard: {
    backgroundColor: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  challengeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 8,
  },
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  challengeBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  challengeButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  challengeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  practiceCard: {
    flexDirection: 'row',
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  practiceIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#3D3D4D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  practiceDescription: {
    fontSize: 14,
    color: '#A0A0B0',
  },
  comingSoonCard: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#A0A0B0',
    marginTop: 8,
    textAlign: 'center',
  },
});
