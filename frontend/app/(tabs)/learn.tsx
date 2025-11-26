import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { learningAPI } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function LearnScreen() {
  const router = useRouter();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      const response = await learningAPI.getChapters();
      setChapters(response.data);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChapters();
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return '#3D3D4D';
    if (progress < 50) return '#FF6B6B';
    if (progress < 100) return '#FFD700';
    return '#4ECDC4';
  };

  const getStatusIcon = (chapter: any) => {
    if (chapter.completed) return 'checkmark-circle';
    if (chapter.progress > 0) return 'play-circle';
    return 'lock-closed';
  };

  const getStatusColor = (chapter: any) => {
    if (chapter.completed) return '#4ECDC4';
    if (chapter.progress > 0) return '#FFD700';
    return '#A0A0B0';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn</Text>
        <Text style={styles.subtitle}>Master new concepts</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />
        }
      >
        {chapters.map((chapter, index) => (
          <TouchableOpacity
            key={chapter.chapter_id}
            style={styles.chapterCard}
            onPress={() => router.push(`/chapter/${chapter.chapter_id}`)}
            disabled={chapter.locked}
          >
            <View style={styles.chapterHeader}>
              <View style={styles.chapterIcon}>
                <Ionicons name={chapter.icon || 'book'} size={32} color="#FFD700" />
              </View>
              <View style={styles.chapterInfo}>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Text style={styles.chapterDescription}>{chapter.description}</Text>
              </View>
              <Ionicons
                name={getStatusIcon(chapter)}
                size={28}
                color={getStatusColor(chapter)}
              />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${chapter.progress}%`,
                      backgroundColor: getProgressColor(chapter.progress),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(chapter.progress)}%</Text>
            </View>
          </TouchableOpacity>
        ))}

        {chapters.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#A0A0B0" />
            <Text style={styles.emptyText}>No chapters available yet</Text>
            <Text style={styles.emptySubtext}>Check back soon for new content!</Text>
          </View>
        )}

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
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0B0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  chapterCard: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chapterIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#3D3D4D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  chapterDescription: {
    fontSize: 14,
    color: '#A0A0B0',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#3D3D4D',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0A0B0',
    marginTop: 8,
  },
});
