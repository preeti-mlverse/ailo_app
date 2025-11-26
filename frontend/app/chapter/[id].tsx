import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NovaMascot } from '../../components/NovaMascot';
import { NovaChatbot } from '../../components/ai/NovaChatbot';
import { learningAPI } from '../../utils/api';

export default function ChapterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [chatVisible, setChatVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<any[]>([]);
  const [chapterInfo, setChapterInfo] = useState<any>(null);

  useEffect(() => {
    fetchTopics();
  }, [id]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await learningAPI.getTopics(id as string);
      console.log('Topics response:', response.data);
      
      const topicsData = Array.isArray(response.data) ? response.data : [];
      setTopics(topicsData);
      
      if (topicsData.length > 0) {
        setChapterInfo({
          title: 'Unit 1: Python Programming-II',
          subtitle: 'Your foundation for AI development',
        });
      } else {
        console.log('No topics found for chapter:', id);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      Alert.alert('Error', 'Failed to load topics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E6B800" />
        <Text style={styles.loadingText}>Loading topics...</Text>
      </View>
    );
  }

  const completedCount = topics.filter(t => t.completed).length;
  const totalTopics = topics.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E6B800" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{chapterInfo?.title || 'Chapter'}</Text>
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
            <Text style={styles.progressNumber}>{completedCount}/{totalTopics}</Text>
          </View>
          <Text style={styles.progressLabel}>topics completed</Text>
        </View>

        {/* Topics List */}
        <View style={styles.topicsContainer}>
          <Text style={styles.sectionHeader}>Topics ({topics.length})</Text>
          {topics.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color="#A0A0B0" />
              <Text style={styles.emptyText}>No topics available yet</Text>
            </View>
          ) : (
            topics.map((topic: any, index: number) => (
              <TouchableOpacity
                key={topic.topic_id || index}
                style={[
                  styles.topicCard,
                  index === 0 && styles.firstTopic,
                ]}
                onPress={() => {
                  console.log('Navigating to topic:', topic.topic_id);
                  router.push(`/topic/${topic.topic_id}`);
                }}
              >
                <View style={styles.topicNumberBadge}>
                  <Text style={styles.topicNumber}>{topic.topic_number || index + 1}</Text>
                </View>
                
                <View style={styles.topicInfo}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicDescription}>{topic.description}</Text>
                </View>
                
                {topic.completed ? (
                  <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
                ) : (
                  <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <NovaChatbot
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        context={`Chapter: ${chapterInfo?.title || 'Python Programming'}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
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
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E2E',
    marginBottom: 16,
  },
  topicCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  firstTopic: {
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: '#E6B800',
  },
  topicNumberBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E6B800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topicNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 13,
    color: '#666666',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#A0A0B0',
    marginTop: 16,
    textAlign: 'center',
  },
});
