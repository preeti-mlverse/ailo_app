import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NovaMascot } from '../../components/ai/NovaMascot';

const { width } = Dimensions.get('window');

export default function CelebrationScreen() {
  const router = useRouter();
  const { subtopicId, subtopicTitle } = useLocalSearchParams();
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    // Celebration animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStartQuiz = () => {
    router.push(`/quiz?subtopicId=${subtopicId}&subtopicTitle=${encodeURIComponent(subtopicTitle as string || 'Quiz')}`);
  };

  const handleSkip = () => {
    router.back();
    router.back(); // Go back to subtopics list
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated celebration */}
        <Animated.View
          style={[
            styles.celebrationContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="trophy" size={80} color="#E6B800" />
          </View>
          
          <NovaMascot animation="happy" size={120} />
          
          <Text style={styles.title}>🎉 Awesome Work! 🎉</Text>
          <Text style={styles.subtitle}>
            You've completed all the cards for
          </Text>
          <Text style={styles.topicName}>{subtopicTitle}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="checkmark-circle" size={32} color="#4ECDC4" />
              <Text style={styles.statLabel}>Completed!</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartQuiz}
          >
            <Text style={styles.primaryButtonText}>Take the Quiz</Text>
            <Ionicons name="arrow-forward" size={24} color="#1E1E2E" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkip}
          >
            <Text style={styles.secondaryButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  celebrationContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D2D3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0B0',
    textAlign: 'center',
    marginBottom: 8,
  },
  topicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E6B800',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 120,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#E6B800',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#A0A0B0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0A0B0',
  },
});
