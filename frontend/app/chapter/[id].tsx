import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NovaMascot } from '../../components/NovaMascot';
import { NovaChatbot } from '../../components/ai/NovaChatbot';

// Sample topic structure based on your screenshot
const CHAPTER_CONTENT: any = {
  unit1: {
    title: 'Python Programming',
    subtitle: 'Your foundation for AI development',
    totalLessons: 31,
    sections: [
      {
        id: 's1',
        number: '0',
        title: 'Chapter Overview',
        subtitle: 'What you\'ll learn & why it matters for AI',
        lessons: [
          { id: 'l1', title: 'Summary & Objectives', completed: false },
          { id: 'l2', title: 'Learning Objectives', completed: false },
        ],
      },
      {
        id: 's2',
        number: '1.1',
        title: 'Python Libraries',
        subtitle: 'Your \'toolbox\' for AI in Python',
        lessons: [
          { id: 'l3', title: 'Definition of Libraries', completed: false },
          { id: 'l4', title: 'Role of NumPy and Pantas', completed: false },
        ],
      },
      {
        id: 's3',
        number: '1.1.1',
        title: 'NumPy Library',
        subtitle: 'Smart tables for real-world data',
        lessons: [
          { id: 'l5', title: 'Definition and Rank', completed: false },
          { id: 'l6', title: 'NumPy for Big Data', completed: false },
          { id: 'l7', title: 'Hands-on Practice', completed: false },
        ],
      },
      {
        id: 's4',
        number: '1.1.2',
        title: 'Pantas Library',
        subtitle: 'The Swiss Army knife for data',
        lessons: [
          { id: 'l8', title: 'What is Pantas?', completed: false },
          { id: 'l9', title: 'DataFrame Basics', completed: false },
          { id: 'l10', title: 'Data Cleaning', completed: false },
        ],
      },
      {
        id: 's5',
        number: '1.2',
        title: 'Data Visualization',
        subtitle: 'Making data speak visually',
        lessons: [
          { id: 'l11', title: 'Introduction to Matplotlib', completed: false },
          { id: 'l12', title: 'Creating Charts', completed: false },
        ],
      },
    ],
  },
  // Add other units as needed
};

export default function ChapterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [expandedSections, setExpandedSections] = useState<string[]>(['s1']);
  const [chatVisible, setChatVisible] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const chapter = CHAPTER_CONTENT[id as string] || CHAPTER_CONTENT.unit1;
  const completedCount = completedLessons.length;

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(s => s !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const toggleLesson = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(l => l !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E6B800" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{chapter.title}</Text>
        </View>
        <TouchableOpacity onPress={() => setChatVisible(true)} style={styles.chatButton}>
          <Ionicons name="chatbubbles" size={24} color="#E6B800" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section with Mascot */}
        <View style={styles.heroSection}>
          <View style={styles.mascotWrapper}>
            <NovaMascot animation="happy" size={100} />
          </View>
          <Text style={styles.heroTitle}>Hey, Data Explorer 👋</Text>
          <Text style={styles.heroSubtitle}>
            You're about to turn Python into your <Text style={styles.highlight}>superpower</Text> for AI.
          </Text>
          <Text style={styles.heroDescription}>
            Learn step-by-step, in tiny bites. Let's start!
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressNumber}>{completedCount}/{chapter.totalLessons}</Text>
          </View>
          <Text style={styles.progressLabel}>micro-lessons</Text>
        </View>

        {/* Topics List */}
        <View style={styles.topicsContainer}>
          {chapter.sections.map((section: any, index: number) => {
            const isExpanded = expandedSections.includes(section.id);
            const sectionCompleted = section.lessons.every((l: any) => 
              completedLessons.includes(l.id)
            );

            return (
              <View key={section.id} style={styles.sectionContainer}>
                {/* Section Header */}
                <TouchableOpacity
                  style={[
                    styles.sectionHeader,
                    index === 0 && styles.firstSection,
                  ]}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={styles.sectionNumberBadge}>
                    <Text style={styles.sectionNumber}>{section.number}</Text>
                  </View>
                  
                  <View style={styles.sectionInfo}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                  </View>
                  
                  <Ionicons 
                    name={isExpanded ? 'chevron-up' : 'chevron-forward'} 
                    size={24} 
                    color="#A0A0B0" 
                  />
                </TouchableOpacity>

                {/* Section Lessons */}
                {isExpanded && (
                  <View style={styles.lessonsContainer}>
                    {section.lessons.map((lesson: any) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      
                      return (
                        <TouchableOpacity
                          key={lesson.id}
                          style={styles.lessonRow}
                          onPress={() => {
                            toggleLesson(lesson.id);
                            // Navigate to lesson detail
                            router.push(`/topic/${lesson.id}`);
                          }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.checkbox,
                              isCompleted && styles.checkboxChecked,
                            ]}
                            onPress={() => toggleLesson(lesson.id)}
                          >
                            {isCompleted && (
                              <Ionicons name="checkmark" size={16} color="#1E1E2E" />
                            )}
                          </TouchableOpacity>
                          
                          <Text style={[
                            styles.lessonTitle,
                            isCompleted && styles.lessonTitleCompleted,
                          ]}>
                            {lesson.title}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <NovaChatbot
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        context={`Chapter: ${chapter.title}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
    textAlign: 'center',
  },
  chatButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: '#E8F4F8',
    padding: 24,
    alignItems: 'center',
  },
  mascotWrapper: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E2E',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    color: '#00BFA5',
    fontStyle: 'italic',
  },
  heroDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#E6B800',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9E6',
    marginBottom: 8,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666666',
  },
  topicsContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  firstSection: {
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: '#E6B800',
  },
  sectionNumberBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E6B800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  lessonsContainer: {
    marginTop: 8,
    marginLeft: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E6B800',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E6B800',
  },
  lessonTitle: {
    flex: 1,
    fontSize: 14,
    color: '#1E1E2E',
  },
  lessonTitleCompleted: {
    color: '#999999',
    textDecorationLine: 'line-through',
  },
});
