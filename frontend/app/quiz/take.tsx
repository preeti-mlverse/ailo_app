import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Sample quiz questions
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What is Python?',
    options: [
      'A type of snake',
      'A programming language',
      'A game',
      'A calculator',
    ],
    correctAnswer: 'A programming language',
  },
  {
    id: 'q2',
    question: 'What are Python libraries?',
    options: [
      'Places to borrow books',
      'Collections of ready-made code',
      'Online stores',
      'Music apps',
    ],
    correctAnswer: 'Collections of ready-made code',
  },
  {
    id: 'q3',
    question: 'What does a variable do?',
    options: [
      'Stores information',
      'Deletes files',
      'Plays music',
      'Opens websites',
    ],
    correctAnswer: 'Stores information',
  },
  {
    id: 'q4',
    question: 'Why is Python important for AI?',
    options: [
      'It makes computers faster',
      'It powers AI, websites, and robots',
      'It plays games',
      'It prints documents',
    ],
    correctAnswer: 'It powers AI, websites, and robots',
  },
  {
    id: 'q5',
    question: 'Variables are like:',
    options: [
      'Labeled boxes to store information',
      'Empty folders',
      'Broken computers',
      'Music players',
    ],
    correctAnswer: 'Labeled boxes to store information',
  },
];

export default function QuizTakeScreen() {
  const router = useRouter();
  const { topicId } = useLocalSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    router.push(
      `/quiz/results?score=${correctCount}&total=${QUIZ_QUESTIONS.length}&topicId=${topicId}`
    );
  };

  const selectedAnswer = selectedAnswers[currentQuestion.id];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Quiz</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
        </Text>
      </View>

      {/* Question Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.questionNumber}>Q{currentQuestionIndex + 1}.</Text>
        <Text style={styles.question}>{currentQuestion.question}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => handleSelectAnswer(option)}
              >
                <View style={styles.optionContent}>
                  <View
                    style={[
                      styles.optionCircle,
                      isSelected && styles.optionCircleSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.optionCircleInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    <Text style={styles.optionLabel}>{optionLabel}. </Text>
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={currentQuestionIndex === 0 ? '#666666' : '#E6B800'}
          />
          <Text
            style={[
              styles.navButtonText,
              currentQuestionIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              !selectedAnswer && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!selectedAnswer}
          >
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedAnswer && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!selectedAnswer}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={!selectedAnswer ? '#666666' : '#1E1E2E'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#2D2D3D',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#2D2D3D',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#3D3D4D',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E6B800',
  },
  progressText: {
    fontSize: 14,
    color: '#A0A0B0',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E6B800',
    marginBottom: 12,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3D3D4D',
  },
  optionButtonSelected: {
    borderColor: '#E6B800',
    backgroundColor: '#3D3D4D',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#A0A0B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCircleSelected: {
    borderColor: '#E6B800',
  },
  optionCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E6B800',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionLabel: {
    fontWeight: 'bold',
    color: '#E6B800',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 32,
    gap: 12,
    backgroundColor: '#2D2D3D',
    borderTopWidth: 1,
    borderTopColor: '#3D3D4D',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E6B800',
    gap: 8,
  },
  navButtonDisabled: {
    borderColor: '#3D3D4D',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E6B800',
  },
  navButtonTextDisabled: {
    color: '#666666',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#E6B800',
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#3D3D4D',
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#E6B800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#3D3D4D',
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
});
