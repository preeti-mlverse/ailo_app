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
import { NovaMascot } from '../../components/NovaMascot';
import { Ionicons } from '@expo/vector-icons';

const CHAPTERS = [
  {
    id: 'unit1',
    title: 'Unit 1: Python Programming',
    subtitle: 'Your foundation for AI development',
    topics: 11,
    duration: 75,
    icon: 'logo-python',
  },
  {
    id: 'unit2',
    title: 'Unit 2: Data Science Methodology',
    subtitle: 'An Analytic Approach to Capstone Project',
    topics: 8,
    duration: 60,
    icon: 'analytics',
  },
  {
    id: 'unit3',
    title: 'Unit 3: Making Machines See',
    subtitle: 'Computer Vision fundamentals',
    topics: 10,
    duration: 80,
    icon: 'eye',
  },
  {
    id: 'unit4',
    title: 'Unit 4: AI with Orange Data Mining Tool',
    subtitle: 'Visual programming for AI',
    topics: 7,
    duration: 50,
    icon: 'color-palette',
  },
  {
    id: 'unit5',
    title: 'Unit 5: Introduction to Big Data and Data Analytics',
    subtitle: 'Working with large-scale datasets',
    topics: 9,
    duration: 70,
    icon: 'server',
  },
  {
    id: 'unit6',
    title: 'Unit 6: Understanding Neural Networks',
    subtitle: 'Deep learning foundations',
    topics: 12,
    duration: 90,
    icon: 'git-network',
  },
  {
    id: 'unit7',
    title: 'Unit 7: Generative AI',
    subtitle: 'Creating with AI models',
    topics: 10,
    duration: 85,
    icon: 'sparkles',
  },
  {
    id: 'unit8',
    title: 'Unit 8: Data Storytelling',
    subtitle: 'Communicating insights effectively',
    topics: 8,
    duration: 55,
    icon: 'bar-chart',
  },
];

export default function LearnScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

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
        <Text style={styles.sectionTitle}>All Units</Text>
        
        {CHAPTERS.map((chapter, index) => (
          <TouchableOpacity
            key={chapter.id}
            style={styles.chapterCard}
            onPress={() => router.push(`/chapter/${chapter.id}`)}
          >
            <View style={styles.chapterNumber}>
              <Text style={styles.chapterNumberText}>{index + 1}</Text>
            </View>
            
            <View style={styles.chapterContent}>
              <View style={styles.chapterHeader}>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  <Text style={styles.chapterSubtitle}>{chapter.subtitle}</Text>
                </View>
                <View style={styles.chapterIconContainer}>
                  <Ionicons name={chapter.icon as any} size={28} color="#E6B800" />
                </View>
              </View>
              
              <View style={styles.chapterMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="book-outline" size={16} color="#A0A0B0" />
                  <Text style={styles.metaText}>{chapter.topics} Topics</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#A0A0B0" />
                  <Text style={styles.metaText}>{chapter.duration} min</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => router.push(`/chapter/${chapter.id}`)}
              >
                <Text style={styles.startButtonText}>Start Learning</Text>
                <Ionicons name="arrow-forward" size={16} color="#1E1E2E" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

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
