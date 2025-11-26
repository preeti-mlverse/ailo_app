import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { learningAPI } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { NovaChatbot } from '../../components/ai/NovaChatbot';

export default function ChapterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    if (id) {
      loadTopics();
    }
  }, [id]);

  const loadTopics = async () => {
    try {
      const response = await learningAPI.getTopics(id as string);
      setTopics(response.data);
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopicStatus = (topic: any) => {
    if (topic.completed) return { icon: 'checkmark-circle', color: '#4ECDC4' };
    if (topic.progress > 0) return { icon: 'play-circle', color: '#FFD700' };
    return { icon: 'lock-closed', color: '#A0A0B0' };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.title}>Topics</Text>
        <TouchableOpacity onPress={() => setChatVisible(true)} style={styles.chatButton}>
          <Ionicons name="chatbubbles" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {topics.map((topic, index) => {
          const status = getTopicStatus(topic);
          return (
            <TouchableOpacity
              key={topic.topic_id}
              style={styles.topicCard}
              onPress={() => router.push(`/topic/${topic.topic_id}`)}
            >
              <View style={styles.topicNumber}>
                <Text style={styles.topicNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
                {topic.progress > 0 && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${topic.progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{Math.round(topic.progress)}%</Text>
                  </View>
                )}
              </View>
              <Ionicons name={status.icon} size={28} color={status.color} />
            </TouchableOpacity>
          );
        })}

        {topics.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#A0A0B0" />
            <Text style={styles.emptyText}>No topics available</Text>
          </View>
        )}
      </ScrollView>

      <NovaChatbot
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        context={`Chapter topics`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#2D2D3D',
    borderBottomWidth: 1,
    borderBottomColor: '#3D3D4D',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  chatButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  topicCard: {
    flexDirection: 'row',
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  topicNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  topicNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#A0A0B0',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#3D3D4D',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    minWidth: 35,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#A0A0B0',
    marginTop: 16,
  },
});
