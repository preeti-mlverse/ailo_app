import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { NovaMascot } from '../../components/NovaMascot';
import { onboardingAPI } from '../../utils/api';

const QUIZ_QUESTIONS = [
  {
    id: 'age',
    question: 'What is your age?',
    type: 'input',
    inputType: 'number',
    placeholder: 'Enter your age',
  },
  {
    id: 'class',
    question: 'Which class are you in?',
    type: 'input',
    inputType: 'number',
    placeholder: 'Enter your class (e.g., 10, 12)',
  },
  {
    id: 'board',
    question: 'Which board are you studying in?',
    type: 'options',
    options: ['CBSE', 'ICSE', 'State Board', 'IB', 'Other'],
  },
  {
    id: 'school',
    question: 'What is your school name? (Optional)',
    type: 'input',
    inputType: 'text',
    placeholder: 'Enter your school name',
    optional: true,
  },
  {
    id: 'city',
    question: 'Which city are you from? (Optional)',
    type: 'input',
    inputType: 'text',
    placeholder: 'Enter your city',
    optional: true,
  },
  {
    id: 'goal',
    question: 'What is your learning goal?',
    type: 'options',
    options: ['Curriculum-based Learning', 'Industry-level AI Skills', 'Both'],
  },
  {
    id: 'current_level',
    question: 'What is your current AI knowledge level?',
    type: 'options',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [inputValue, setInputValue] = useState('');
  const [dailyGoal, setDailyGoal] = useState(30);
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [loading, setLoading] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswer = (answer: string) => {
    const questionId = question.id;
    setAnswers({ ...answers, [questionId]: answer });

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setInputValue('');
    } else {
      setShowGoalSetting(true);
    }
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim() && !question.optional) {
      Alert.alert('Required', 'Please enter a value');
      return;
    }

    handleAnswer(inputValue.trim() || 'Not provided');
  };

  const handleSkip = () => {
    if (question.optional) {
      handleAnswer('Not provided');
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      // Submit quiz responses
      const responses = Object.keys(answers).map((questionId) => ({
        question_id: questionId,
        answer: answers[questionId],
      }));
      await onboardingAPI.submitQuiz(responses);

      // Set daily goal
      await onboardingAPI.setGoal({
        daily_goal_minutes: dailyGoal,
        study_preferences: Object.values(answers),
      });

      // Refresh user data
      await refreshUser();

      // Navigate to home
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  if (showGoalSetting) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <NovaMascot animation="happy" size={150} />
          <Text style={styles.title}>Almost Done!</Text>
          <Text style={styles.subtitle}>How much time can you commit daily to learn AI?</Text>

          <View style={styles.goalContainer}>
            <Text style={styles.goalLabel}>Daily Commitment: {dailyGoal} minutes</Text>
            <View style={styles.goalButtons}>
              <TouchableOpacity
                style={[styles.goalButton, dailyGoal === 15 && styles.goalButtonActive]}
                onPress={() => setDailyGoal(15)}
              >
                <Text
                  style={[
                    styles.goalButtonText,
                    dailyGoal === 15 && styles.goalButtonTextActive,
                  ]}
                >
                  15 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.goalButton, dailyGoal === 30 && styles.goalButtonActive]}
                onPress={() => setDailyGoal(30)}
              >
                <Text
                  style={[
                    styles.goalButtonText,
                    dailyGoal === 30 && styles.goalButtonTextActive,
                  ]}
                >
                  30 min
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.goalButton, dailyGoal === 60 && styles.goalButtonActive]}
                onPress={() => setDailyGoal(60)}
              >
                <Text
                  style={[
                    styles.goalButtonText,
                    dailyGoal === 60 && styles.goalButtonTextActive,
                  ]}
                >
                  60 min
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleFinishOnboarding}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Setting up...' : 'Start Learning AI!'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <NovaMascot animation="think" size={120} />
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.question}>{question.question}</Text>

        {question.type === 'input' ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={question.placeholder}
              placeholderTextColor="#666"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={question.inputType === 'number' ? 'number-pad' : 'default'}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleInputSubmit}
            >
              <Text style={styles.submitButtonText}>Next</Text>
            </TouchableOpacity>
            {question.optional && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.options}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0B0',
    marginBottom: 32,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressText: {
    color: '#A0A0B0',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2D2D3D',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3D3D4D',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  skipButton: {
    padding: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#A0A0B0',
  },
  options: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3D3D4D',
  },
  optionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  goalContainer: {
    width: '100%',
    marginBottom: 32,
  },
  goalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  goalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  goalButton: {
    flex: 1,
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3D3D4D',
  },
  goalButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  goalButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  goalButtonTextActive: {
    color: '#1E1E2E',
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
});
