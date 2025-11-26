import React from 'react';
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

// Sample subtopics data
const SUBTOPICS_DATA: any = {
  l1: {
    chapterName: 'Python Programming',
    topicName: 'Summary & Objectives',
    subtopics: [
      { id: 'st1', title: 'What you will learn', icon: 'book', completed: false },
      { id: 'st2', title: 'Learning Goals', icon: 'target', completed: false },
    ],
  },
  l4: {
    chapterName: 'Python Programming',
    topicName: 'Pandas Library',
    subtopics: [
      { id: 'st3', title: 'What is Pandas?', icon: 'help-circle', completed: false },
      { id: 'st4', title: 'DataFrame Basics', icon: 'grid', completed: false },
      { id: 'st5', title: 'Data Cleaning', icon: 'sparkles', completed: false },
    ],
  },
};

export default function SubtopicsListScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();

  const data = SUBTOPICS_DATA[lessonId as string] || SUBTOPICS_DATA.l1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E6B800" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.chapterName}>{data.chapterName}</Text>
          <Text style={styles.topicName}>Topic: {data.topicName}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <NovaMascot animation="happy" size={100} />
          <Text style={styles.heroTitle}>Let's explore the subtopics!</Text>
          <Text style={styles.heroSubtitle}>
            {data.subtopics.length} subtopics to master
          </Text>
        </View>

        {/* Subtopics List */}
        <View style={styles.subtopicsContainer}>
          <Text style={styles.sectionTitle}>Subtopics</Text>
          {data.subtopics.map((subtopic: any, index: number) => (
            <TouchableOpacity
              key={subtopic.id}
              style={styles.subtopicCard}
              onPress={() =>
                router.push(`/topic/${subtopic.id}?chapter=${data.chapterName}&topic=${data.topicName}`)
              }
            >
              <View style={styles.subtopicNumber}>
                <Text style={styles.subtopicNumberText}>{index + 1}</Text>
              </View>
              
              <View style={styles.subtopicContent}>
                <View style={styles.subtopicHeader}>
                  <Text style={styles.subtopicTitle}>{subtopic.title}</Text>
                  <View style={styles.subtopicIcon}>
                    <Ionicons name={subtopic.icon} size={24} color="#E6B800" />
                  </View>
                </View>
                
                {subtopic.completed && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                )}
              </View>
              
              <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#2D2D3D',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  chapterName: {
    fontSize: 14,
    color: '#A0A0B0',
    textAlign: 'center',
  },
  topicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#A0A0B0',
    marginTop: 8,
    textAlign: 'center',
  },
  subtopicsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtopicCard: {
    flexDirection: 'row',
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  subtopicNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6B800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subtopicNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  subtopicContent: {
    flex: 1,
  },
  subtopicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtopicTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtopicIcon: {
    marginLeft: 12,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  completedText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
});
