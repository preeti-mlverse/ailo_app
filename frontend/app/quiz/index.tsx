import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NovaMascot } from '../../components/ai/NovaMascot';
import { learningAPI } from '../../utils/api';

const { width } = Dimensions.get('window');

export default function QuizScreen() {
  const router = useRouter();
  const { subtopicId, subtopicTitle } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [quizId, setQuizId] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [subtopicId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await learningAPI.getSubtopicQuiz(subtopicId as string);
      setQuestions(response.data.questions);
      setQuizId(response.data.quiz_id);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      Alert.alert('Error', 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      Alert.alert(
        'Incomplete Quiz',
        `You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: submitQuiz },
        ]
      );
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      
      // Format answers for API
      const answers = questions.map((q, index) => ({
        question_id: q.question_id,
        user_answer: selectedAnswers[index] || '',
      }));

      const response = await learningAPI.submitQuiz(quizId, subtopicId as string, answers);
      
      // Navigate to results screen
      router.push({
        pathname: '/quiz/results',
        params: {
          score: response.data.score,
          correctCount: response.data.correct_count,
          totalQuestions: response.data.total_questions,
          xpEarned: response.data.xp_earned,
          subtopicTitle: subtopicTitle,
        },
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size=\"large\" color=\"#E6B800\" />
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name=\"alert-circle\" size={80} color=\"#E6B800\" />
        <Text style={styles.errorText}>No quiz questions available</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonIcon}>
          <Ionicons name=\"close\" size={28} color=\"#E6B800\" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Quiz Time! 🎯</Text>
          <Text style={styles.headerSubtitle}>{subtopicTitle}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.questionCounter}>
            {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView style={styles.content}>
        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <NovaMascot animation=\"happy\" size={80} />
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>Question {currentQuestionIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswers[currentQuestionIndex] === option && styles.optionButtonSelected,
              ]}
              onPress={() => handleSelectAnswer(option)}
            >
              <View style={[
                styles.optionCheckbox,
                selectedAnswers[currentQuestionIndex] === option && styles.optionCheckboxSelected,
              ]}>
                {selectedAnswers[currentQuestionIndex] === option && (
                  <Ionicons name=\"checkmark\" size={20} color=\"#1E1E2E\" />
                )}
              </View>
              <Text style={[
                styles.optionText,
                selectedAnswers[currentQuestionIndex] === option && styles.optionTextSelected,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.navButtonSecondary,
            currentQuestionIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons 
            name=\"arrow-back\" 
            size={20} 
            color={currentQuestionIndex === 0 ? '#666666' : '#E6B800'} 
          />
          <Text style={[
            styles.navButtonTextSecondary,
            currentQuestionIndex === 0 && styles.navButtonTextDisabled,
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.navButtonPrimary,
            !selectedAnswers[currentQuestionIndex] && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedAnswers[currentQuestionIndex]}
        >
          <Text style={[
            styles.navButtonText,
            !selectedAnswers[currentQuestionIndex] && styles.navButtonTextDisabled,
          ]}>
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </Text>
          <Ionicons 
            name={currentQuestionIndex === questions.length - 1 ? 'checkmark-circle' : 'arrow-forward'}
            size={20} 
            color={!selectedAnswers[currentQuestionIndex] ? '#666666' : '#1E1E2E'} 
          />
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#2D2D3D',
  },
  backButtonIcon: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#A0A0B0',
    textAlign: 'center',
    marginTop: 2,
  },
  headerRight: {
    padding: 8,
  },
  questionCounter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E6B800',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#2D2D3D',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E6B800',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  mascotContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionLabel: {
    fontSize: 14,
    color: '#A0A0B0',
    marginBottom: 8,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    borderColor: '#E6B800',
    backgroundColor: '#3D3D2D',
  },
  optionCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#A0A0B0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCheckboxSelected: {
    backgroundColor: '#E6B800',
    borderColor: '#E6B800',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#2D2D3D',
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  navButtonPrimary: {
    backgroundColor: '#E6B800',
  },
  navButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E6B800',
  },
  navButtonDisabled: {
    backgroundColor: '#3D3D4D',
    borderColor: '#3D3D4D',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  navButtonTextSecondary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E6B800',
  },
  navButtonTextDisabled: {
    color: '#666666',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E6B800',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
});
