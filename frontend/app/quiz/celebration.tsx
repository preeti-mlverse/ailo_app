import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { NovaMascot } from '../../components/NovaMascot';
import { Ionicons } from '@expo/vector-icons';

export default function CelebrationScreen() {
  const router = useRouter();
  const { topicId, topicTitle } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Celebration Content */}
      <View style={styles.content}>
        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <NovaMascot animation="cheer" size={150} />
        </View>

        {/* Celebration Message */}
        <Text style={styles.title}>Great job! 🎉</Text>
        <Text style={styles.subtitle}>You completed the topic!</Text>

        {/* Topic Name */}
        <View style={styles.topicCard}>
          <Ionicons name="checkmark-circle" size={32} color="#4ECDC4" />
          <Text style={styles.topicName}>{topicTitle || 'Summary & Objectives'}</Text>
        </View>

        {/* Quiz Introduction */}
        <View style={styles.quizIntro}>
          <Text style={styles.quizIntroTitle}>Ready for a Quick Quiz?</Text>
          <Text style={styles.quizIntroSubtitle}>
            Test your understanding with 5 questions
          </Text>
          
          <View style={styles.quizDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="help-circle-outline" size={20} color="#E6B800" />
              <Text style={styles.detailText}>5 Questions</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color="#E6B800" />
              <Text style={styles.detailText}>~3 minutes</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.startQuizButton}
          onPress={() => router.push(`/quiz/take?topicId=${topicId}`)}
        >
          <Text style={styles.startQuizButtonText}>Start Quiz</Text>
          <Ionicons name="arrow-forward" size={20} color="#1E1E2E" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.back()}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A0B0',
    marginBottom: 32,
    textAlign: 'center',
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    gap: 16,
  },
  topicName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quizIntro: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 24,
  },
  quizIntroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  quizIntroSubtitle: {
    fontSize: 14,
    color: '#A0A0B0',
    marginBottom: 20,
    textAlign: 'center',
  },
  quizDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  startQuizButton: {
    flexDirection: 'row',
    backgroundColor: '#E6B800',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  startQuizButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#A0A0B0',
  },
});
