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
import { learningAPI } from '../../utils/api';

export default function TopicSubtopicsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [topicInfo, setTopicInfo] = useState<any>(null);

  useEffect(() => {
    fetchSubtopics();
  }, [id]);

  const fetchSubtopics = async () => {
    try {
      setLoading(true);
      const response = await learningAPI.getSubtopics(id as string);
      setSubtopics(response.data.subtopics);
      setTopicInfo(response.data.topic);
    } catch (error) {
      console.error('Error fetching subtopics:', error);
      Alert.alert('Error', 'Failed to load subtopics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E6B800" />
        <Text style={styles.loadingText}>Loading subtopics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E6B800" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.chapterName}>Python Programming</Text>
          <Text style={styles.topicName}>Topic: {topicInfo?.title || 'Loading...'}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <NovaMascot animation="happy" size={100} />
          <Text style={styles.heroTitle}>Let's explore the subtopics!</Text>
          <Text style={styles.heroSubtitle}>
            {subtopics.length} subtopics to master
          </Text>
        </View>

        {/* Subtopics List */}
        <View style={styles.subtopicsContainer}>
          <Text style={styles.sectionTitle}>Subtopics</Text>
          {subtopics.map((subtopic: any, index: number) => (
            <TouchableOpacity
              key={subtopic.subtopic_id}
              style={styles.subtopicCard}
              onPress={() =>
                router.push(`/subtopic/${subtopic.subtopic_id}`)
              }
            >
              <View style={styles.subtopicNumber}>
                <Text style={styles.subtopicNumberText}>{index + 1}</Text>
              </View>
              
              <View style={styles.subtopicContent}>
                <View style={styles.subtopicHeader}>
                  <Text style={styles.subtopicTitle}>{subtopic.title}</Text>
                  <View style={styles.subtopicIcon}>
                    <Ionicons name="book" size={24} color="#E6B800" />
                  </View>
                </View>
                
                <Text style={styles.microcontentCount}>
                  {subtopic.microcontent_count || 0} cards
                </Text>
                
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
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
  microcontentCount: {
    fontSize: 12,
    color: '#A0A0B0',
    marginTop: 4,
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
