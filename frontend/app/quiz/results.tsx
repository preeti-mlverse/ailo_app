import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { NovaMascot } from '../../components/NovaMascot';
import { Ionicons } from '@expo/vector-icons';

export default function QuizResultsScreen() {
  const router = useRouter();
  const { score, total, topicId } = useLocalSearchParams();

  const scoreNum = parseInt(score as string);
  const totalNum = parseInt(total as string);
  const percentage = Math.round((scoreNum / totalNum) * 100);
  const xpEarned = scoreNum * 20;

  // Determine message based on performance
  let resultMessage = '';
  let mascotAnimation: 'happy' | 'cheer' | 'sad' = 'happy';
  
  if (percentage >= 80) {
    resultMessage = 'Great job! 🎉';
    mascotAnimation = 'cheer';
  } else if (percentage >= 60) {
    resultMessage = 'Good effort! 👍';
    mascotAnimation = 'happy';
  } else {
    resultMessage = 'Keep practicing! 💪';
    mascotAnimation = 'sad';
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <NovaMascot animation={mascotAnimation} size={140} />
        </View>

        {/* Result Message */}
        <Text style={styles.resultMessage}>{resultMessage}</Text>
        <Text style={styles.subtitle}>You scored {scoreNum} / {totalNum}</Text>

        {/* Score Circle */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{scoreNum} / {totalNum}</Text>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="flash" size={32} color="#FFD700" />
            </View>
            <Text style={styles.statValue}>+{xpEarned} XP</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="flame" size={32} color="#FF6B6B" />
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle" size={32} color="#4ECDC4" />
            </View>
            <Text style={styles.statValue}>Daily goal</Text>
            <Text style={styles.statLabel}>Achieved</Text>
          </View>
        </View>

        {/* Badges/Achievements */}
        {percentage >= 80 && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="trophy" size={40} color="#FFD700" />
              <Text style={styles.badgeText}>Quiz Master</Text>
              <Text style={styles.badgeSubtext}>Level 1</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => router.back()}
          >
            <Text style={styles.reviewButtonText}>Review answers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push('/(tabs)/learn')}
          >
            <Text style={styles.continueButtonText}>Continue to next topic</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  content: {
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  mascotContainer: {
    marginBottom: 24,
  },
  resultMessage: {
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
  scoreContainer: {
    marginBottom: 40,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#2D2D3D',
    borderWidth: 8,
    borderColor: '#E6B800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#A0A0B0',
    textAlign: 'center',
  },
  badgeContainer: {
    width: '100%',
    marginBottom: 32,
  },
  badge: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E6B800',
  },
  badgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 12,
  },
  badgeSubtext: {
    fontSize: 14,
    color: '#A0A0B0',
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  reviewButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E6B800',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E6B800',
  },
  continueButton: {
    backgroundColor: '#E6B800',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
});
