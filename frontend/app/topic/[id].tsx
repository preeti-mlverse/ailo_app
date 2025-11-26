import React, { useEffect, useState, useRef } from 'react';
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
import Markdown from 'react-native-markdown-display';
import { NovaMascot } from '../../components/NovaMascot';
import { NovaChatbot } from '../../components/ai/NovaChatbot';

export default function TopicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useEffect(() => {
    if (id) {
      loadTopic();
    }
  }, [id]);

  const loadTopic = async () => {
    try {
      // For now, we'll create a simple topic viewer
      // In full implementation, this would fetch from API
      setTopic({
        topic_id: id,
        title: 'Sample Topic',
        content: `# Welcome to Learning!\n\nThis is where the lesson content will be displayed.\n\n## Key Concepts\n- Point 1\n- Point 2\n- Point 3`,
      });
    } catch (error) {
      console.error('Error loading topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPosition = contentOffset.y;
    const scrollHeight = contentSize.height;
    const viewHeight = layoutMeasurement.height;
    
    setScrollPosition(scrollPosition);
    setContentHeight(scrollHeight);
    setScrollViewHeight(viewHeight);

    // Calculate progress
    const progress = (scrollPosition / (scrollHeight - viewHeight)) * 100;
    
    // Auto-save progress every 10 seconds would be implemented here
    if (progress > 0) {
      updateProgress(Math.min(progress, 100));
    }
  };

  const updateProgress = async (progress: number) => {
    try {
      await learningAPI.updateProgress(id as string, progress, scrollPosition);
    } catch (error) {
      // Silently fail - auto-save
    }
  };

  const handleMarkComplete = async () => {
    try {
      await learningAPI.updateProgress(id as string, 100, scrollPosition);
      router.back();
    } catch (error) {
      console.error('Error marking complete:', error);
    }
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
        <Text style={styles.title} numberOfLines={1}>{topic?.title}</Text>
        <TouchableOpacity onPress={() => setChatVisible(true)} style={styles.chatButton}>
          <Ionicons name="chatbubbles" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={1000}
      >
        {/* Nova Welcome Message */}
        <View style={styles.novaMessage}>
          <NovaMascot animation="happy" size={60} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              Let's learn together! Take your time and ask me if you need help.
            </Text>
          </View>
        </View>

        {/* Lesson Content */}
        <View style={styles.lessonContent}>
          <Markdown
            style={markdownStyles}
          >
            {topic?.content || '# No content available'}
          </Markdown>
        </View>

        {/* Nova Tips */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#FFD700" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Pro Tip from Nova</Text>
            <Text style={styles.tipText}>
              Try to understand the concept before moving on. You can always ask me questions!
            </Text>
          </View>
        </View>

        {/* Complete Button */}
        <TouchableOpacity style={styles.completeButton} onPress={handleMarkComplete}>
          <Ionicons name="checkmark-circle" size={24} color="#1E1E2E" />
          <Text style={styles.completeButtonText}>Mark as Complete</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      <NovaChatbot
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        context={`Lesson: ${topic?.title}`}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  chatButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  novaMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 24,
    gap: 16,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  speechText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  lessonContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
});

const markdownStyles = {
  body: {
    color: '#FFFFFF',
  },
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 16,
    marginBottom: 12,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 12,
  },
  bullet_list: {
    marginBottom: 12,
  },
  bullet_list_item: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginLeft: 16,
  },
  code_inline: {
    backgroundColor: '#2D2D3D',
    color: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: '#2D2D3D',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
};
