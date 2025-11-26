import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { NovaMascot } from '../../components/NovaMascot';
import { Ionicons } from '@expo/vector-icons';
import { learningAPI } from '../../utils/api';

export default function LearnScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await learningAPI.getChapters();
      console.log('Chapters fetched:', response.data);
      setChapters(response.data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      Alert.alert('Error', 'Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChapters();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E6B800" />
        <Text style={styles.loadingText}>Loading chapters...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Journey Visualization Header */}
      <View style={styles.journeyHeader}>
        <Text style={styles.headerTitle}>Your AI Learning Journey</Text>
        
        {/* Hill with path */}
        <View style={styles.hillContainer}>
          {/* Starting point */}
          <View style={styles.startPoint}>
            <View style={styles.flagContainer}>
              <Ionicons name="flag" size={24} color="#E6B800" />
              <Text style={styles.pointLabel}>Start</Text>
            </View>
          </View>
          
          {/* Nova on bicycle in the middle */}
          <View style={styles.mascotContainer}>
            <NovaMascot animation="wave" size={80} />
            <Ionicons name="bicycle" size={32} color="#E6B800" style={styles.bicycleIcon} />
          </View>
          
          {/* Destination point */}
          <View style={styles.endPoint}>
            <View style={styles.flagContainer}>
              <Ionicons name="trophy" size={24} color="#E6B800" />
              <Text style={styles.pointLabel}>Goal</Text>
            </View>
          </View>
          
          {/* Sloped path line */}
          <View style={styles.pathLine} />
        </View>
        
        <Text style={styles.journeySubtitle}>8 units • Master AI fundamentals</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E6B800" />
        }
      >
        <Text style={styles.sectionTitle}>All Units ({chapters.length})</Text>
        
        {chapters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No chapters available</Text>
          </View>
        ) : (
          chapters.map((chapter: any, index: number) => (
            <TouchableOpacity
              key={chapter.chapter_id}
              style={styles.chapterCard}
              onPress={() => {
                console.log('Navigating to chapter:', chapter.chapter_id);
                router.push(`/chapter/${chapter.chapter_id}`);
              }}
            >
              <View style={styles.chapterNumber}>
                <Text style={styles.chapterNumberText}>{index + 1}</Text>
              </View>
              
              <View style={styles.chapterContent}>
                <View style={styles.chapterHeader}>
                  <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>{chapter.title || chapter.chapter_name}</Text>
                    <Text style={styles.chapterSubtitle}>{chapter.description || 'Learn Python Programming'}</Text>
                  </View>
                  <View style={styles.chapterIconContainer}>
                    <Ionicons name="logo-python" size={28} color="#E6B800" />
                  </View>
                </View>
                
                <View style={styles.chapterMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="book-outline" size={16} color="#A0A0B0" />
                    <Text style={styles.metaText}>15 Topics</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="#A0A0B0" />
                    <Text style={styles.metaText}>75 min</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => router.push(`/chapter/${chapter.chapter_id}`)}
                >
                  <Text style={styles.startButtonText}>Start Learning</Text>
                  <Ionicons name="arrow-forward" size={16} color="#1E1E2E" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  journeyHeader: {
    backgroundColor: '#FFF8DC',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E2E',
    marginBottom: 20,
    textAlign: 'center',
  },
  hillContainer: {
    height: 140,
    marginVertical: 16,
    position: 'relative',
  },
  startPoint: {
    position: 'absolute',
    left: 20,
    bottom: 10,
  },
  endPoint: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  flagContainer: {
    alignItems: 'center',
  },
  pointLabel: {
    fontSize: 12,
    color: '#E6B800',
    fontWeight: 'bold',
    marginTop: 4,
  },
  mascotContainer: {
    position: 'absolute',
    left: 30,
    bottom: 35,
    alignItems: 'center',
  },
  bicycleIcon: {
    marginTop: -15,
  },
  pathLine: {
    position: 'absolute',
    left: 80,
    right: 80,
    bottom: 50,
    height: 3,
    borderTopWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#E6B800',
    transform: [{ rotate: '-15deg' }],
  },
  journeySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 16,
  },
  chapterCard: {
    flexDirection: 'row',
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chapterNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6B800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  chapterNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  chapterContent: {
    flex: 1,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chapterInfo: {
    flex: 1,
    marginRight: 12,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  chapterSubtitle: {
    fontSize: 13,
    color: '#A0A0B0',
  },
  chapterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#3D3D4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#A0A0B0',
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#E6B800',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
});
