import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NovaMascot } from '../../components/NovaMascot';
import * as Speech from 'expo-speech';
import { learningAPI } from '../../utils/api';

const { width } = Dimensions.get('window');

export default function SubtopicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<'story' | 'relate' | 'why'>('story');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [microcontent, setMicrocontent] = useState<any[]>([]);
  const [subtopicInfo, setSubtopicInfo] = useState<any>(null);

  useEffect(() => {
    fetchMicrocontent();
  }, [id]);

  useEffect(() => {
    // Stop speech when component unmounts or card changes
    return () => {
      Speech.stop();
    };
  }, [currentCardIndex, activeMode]);

  const fetchMicrocontent = async () => {
    try {
      setLoading(true);
      const response = await learningAPI.getMicrocontent(id as string);
      setMicrocontent(response.data.cards);
      setSubtopicInfo(response.data.subtopic);
      setCurrentCardIndex(response.data.progress || 0);
    } catch (error) {
      console.error('Error fetching microcontent:', error);
      Alert.alert('Error', 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const currentCard = microcontent[currentCardIndex];
      const textToSpeak = currentCard[activeMode];
      
      Speech.speak(textToSpeak, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleNext = async () => {
    Speech.stop();
    setIsSpeaking(false);
    if (currentCardIndex < microcontent.length - 1) {
      const nextIndex = currentCardIndex + 1;
      setCurrentCardIndex(nextIndex);
      setActiveMode('story'); // Reset to story mode
      
      // Update progress
      try {
        await learningAPI.updateSubtopicProgress(id as string, nextIndex, false);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    } else {
      // Mark as completed and navigate to celebration
      console.log('Finishing subtopic, navigating to celebration...');
      try {
        await learningAPI.updateSubtopicProgress(id as string, microcontent.length, true);
        console.log('Progress updated, navigating now...');
        
        // Navigate to celebration
        router.replace({
          pathname: '/quiz/celebration',
          params: {
            subtopicId: id as string,
            subtopicTitle: (subtopicInfo?.title || 'Subtopic') as string,
            topicId: (subtopicInfo?.topic_id || '') as string,
            xpEarned: '20',
          },
        });
      } catch (error: any) {
        console.error('Error completing subtopic:', error);
        console.error('Error details:', error?.response?.data || error?.message);
        Alert.alert('Error', `Failed to complete subtopic: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Subtopic',
      'Are you sure you want to skip this subtopic? You can come back to it later.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          onPress: () => router.back(),
          style: 'destructive',
        },
      ]
    );
  };

  const handlePrevious = () => {
    Speech.stop();
    setIsSpeaking(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setActiveMode('story');
    }
  };

  const handleModeChange = (mode: 'story' | 'relate' | 'why') => {
    Speech.stop();
    setIsSpeaking(false);
    setActiveMode(mode);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E6B800" />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  if (microcontent.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No content available</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCard = microcontent[currentCardIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonHeader}>
          <Ionicons name="arrow-back" size={24} color="#E6B800" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.chapterName}>Python Programming</Text>
          <Text style={styles.topicName}>{subtopicInfo?.title || 'Loading...'}</Text>
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section with Mascot */}
        <View style={styles.heroSection}>
          <NovaMascot animation="happy" size={100} />
          <Text style={styles.lessonSubtitle}>Swipe through to learn!</Text>
        </View>

        {/* Content Card */}
        <View style={styles.cardContainer}>
          {/* Visual Icon */}
          <View style={styles.visualContainer}>
            <Text style={styles.visualEmoji}>📚</Text>
          </View>

          {/* Card Title */}
          <Text style={styles.cardTitle}>Card {currentCardIndex + 1}</Text>

          {/* Mode Tabs */}
          <View style={styles.modeTabsContainer}>
            <TouchableOpacity
              style={[
                styles.modeTab,
                activeMode === 'story' && styles.modeTabActive,
              ]}
              onPress={() => handleModeChange('story')}
            >
              <Ionicons 
                name="book" 
                size={20} 
                color={activeMode === 'story' ? '#1E1E2E' : '#A0A0B0'} 
              />
              <Text
                style={[
                  styles.modeTabText,
                  activeMode === 'story' && styles.modeTabTextActive,
                ]}
              >
                Story
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeTab,
                activeMode === 'relate' && styles.modeTabActive,
              ]}
              onPress={() => handleModeChange('relate')}
            >
              <Ionicons 
                name="link" 
                size={20} 
                color={activeMode === 'relate' ? '#1E1E2E' : '#A0A0B0'} 
              />
              <Text
                style={[
                  styles.modeTabText,
                  activeMode === 'relate' && styles.modeTabTextActive,
                ]}
              >
                Relate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeTab,
                activeMode === 'why' && styles.modeTabActive,
              ]}
              onPress={() => handleModeChange('why')}
            >
              <Ionicons 
                name="help-circle" 
                size={20} 
                color={activeMode === 'why' ? '#1E1E2E' : '#A0A0B0'} 
              />
              <Text
                style={[
                  styles.modeTabText,
                  activeMode === 'why' && styles.modeTabTextActive,
                ]}
              >
                Why
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content Text */}
          <View style={styles.contentCard}>
            <ScrollView style={styles.contentScroll}>
              <Text style={styles.contentText}>{currentCard[activeMode] || 'Content not available'}</Text>
            </ScrollView>

            {/* Audio Button */}
            <TouchableOpacity style={styles.audioButton} onPress={handleSpeak}>
              <Ionicons 
                name={isSpeaking ? 'stop-circle' : 'volume-high'} 
                size={24} 
                color="#E6B800" 
              />
              <Text style={styles.audioButtonText}>
                {isSpeaking ? 'Stop' : 'Listen'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentCardIndex === 0 && styles.navButtonDisabled,
              ]}
              onPress={handlePrevious}
              disabled={currentCardIndex === 0}
            >
              <Ionicons 
                name="arrow-back" 
                size={20} 
                color={currentCardIndex === 0 ? '#666666' : '#1E1E2E'} 
              />
              <Text
                style={[
                  styles.navButtonText,
                  currentCardIndex === 0 && styles.navButtonTextDisabled,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.navButtonNext,
              ]}
              onPress={handleNext}
            >
              <Text
                style={[
                  styles.navButtonText,
                  styles.navButtonTextNext,
                ]}
              >
                {currentCardIndex === microcontent.length - 1 ? 'Finish' : 'Next'}
              </Text>
              <Ionicons 
                name="arrow-forward" 
                size={20} 
                color="#1E1E2E"
              />
            </TouchableOpacity>
          </View>

          {/* Progress Dots */}
          <View style={styles.progressDots}>
            {microcontent.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentCardIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 50 }} />
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
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#2D2D3D',
  },
  backButtonHeader: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  chapterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  topicName: {
    fontSize: 12,
    color: '#A0A0B0',
    textAlign: 'center',
    marginTop: 2,
  },
  headerRight: {
    padding: 8,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E6B800',
    borderRadius: 20,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E6B800',
  },
  cardCounter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E6B800',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#2D2D3D',
  },
  lessonSubtitle: {
    fontSize: 14,
    color: '#A0A0B0',
    marginTop: 12,
    textAlign: 'center',
  },
  cardContainer: {
    margin: 16,
    backgroundColor: '#2D2D3D',
    borderRadius: 20,
    padding: 20,
  },
  visualContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6B800',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  visualEmoji: {
    fontSize: 48,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  modeTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: '#E6B800',
  },
  modeTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0A0B0',
  },
  modeTabTextActive: {
    color: '#1E1E2E',
  },
  contentCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
    marginBottom: 16,
  },
  contentScroll: {
    maxHeight: 250,
  },
  contentText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2D2D3D',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E6B800',
    alignSelf: 'center',
    gap: 8,
  },
  audioButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E6B800',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#E6B800',
    borderRadius: 12,
    gap: 8,
  },
  navButtonNext: {
    backgroundColor: '#E6B800',
  },
  navButtonDisabled: {
    backgroundColor: '#3D3D4D',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  navButtonTextNext: {
    color: '#1E1E2E',
  },
  navButtonTextDisabled: {
    color: '#666666',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3D3D4D',
  },
  dotActive: {
    backgroundColor: '#E6B800',
    width: 24,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E6B800',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
});
