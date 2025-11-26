import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NovaMascot } from '../../components/NovaMascot';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

// Sample lesson content with 3 explanation modes
const LESSON_CONTENT: any = {
  l1: {
    title: 'Summary & Objectives',
    subtitle: 'What you will learn in this chapter',
    cards: [
      {
        id: 'c1',
        title: 'Welcome to Python Programming',
        story: 'Imagine you have a magic wand that can make computers do anything you want. That magic wand is called Python! It\'s a special language that helps you talk to computers and tell them exactly what to do.',
        relate: 'Just like you use English to talk to your friends, programmers use Python to talk to computers. When you want your friend to help you, you ask nicely. When you want a computer to help you, you write Python code!',
        why: 'Python is important because it\'s the language that powers AI, websites, games, and even robots! Learning Python is like learning a superpower that lets you create amazing things with technology.',
        visual: '🐍',
      },
      {
        id: 'c2',
        title: 'What are Libraries?',
        story: 'Think of a library as a magical toolkit. Instead of having to build every tool from scratch, you can just pick the tools you need from the library. Python libraries are collections of ready-made code that solve common problems.',
        relate: 'It\'s like having a LEGO set. Instead of making every LEGO brick yourself, you get a box full of different pieces you can use to build something amazing!',
        why: 'Libraries save you time and effort. Why spend days building something when someone has already built it and shared it with the world? That\'s the power of Python libraries!',
        visual: '📚',
      },
    ],
  },
  l2: {
    title: 'Learning Objectives',
    subtitle: 'Goals for this chapter',
    cards: [
      {
        id: 'c3',
        title: 'Understanding Variables',
        story: 'Variables are like labeled boxes where you can store information. Imagine you have a box labeled "age" and you put the number 15 inside. Now whenever you need to know the age, you just look in that box!',
        relate: 'Think of variables like your school locker. It has your name on it (the variable name), and inside you keep your books and supplies (the data). You can change what\'s inside anytime you want!',
        why: 'Variables are the foundation of programming. Without variables, computers couldn\'t remember anything! They help us store, organize, and use data in our programs.',
        visual: '📦',
      },
    ],
  },
};

export default function TopicDetailScreen() {
  const router = useRouter();
  const { id, chapter, topic } = useLocalSearchParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<'story' | 'relate' | 'why'>('story');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const lesson = LESSON_CONTENT[id as string] || LESSON_CONTENT.l1;
  const currentCard = lesson.cards[currentCardIndex];
  const chapterName = chapter as string || 'Python Programming';
  const topicName = topic as string || lesson.title;

  useEffect(() => {
    // Stop speech when component unmounts or card changes
    return () => {
      Speech.stop();
    };
  }, [currentCardIndex, activeMode]);

  const handleSpeak = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
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

  const handleNext = () => {
    Speech.stop();
    setIsSpeaking(false);
    if (currentCardIndex < lesson.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setActiveMode('story'); // Reset to story mode
    } else {
      // Navigate to celebration screen when all cards completed
      router.push(`/quiz/celebration?topicId=${id}&topicTitle=${encodeURIComponent(lesson.title)}`);
    }
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E6B800" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.cardCounter}>
            {currentCardIndex + 1}/{lesson.cards.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section with Mascot */}
        <View style={styles.heroSection}>
          <NovaMascot animation="happy" size={100} />
          <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
        </View>

        {/* Content Card */}
        <View style={styles.cardContainer}>
          {/* Visual Icon */}
          <View style={styles.visualContainer}>
            <Text style={styles.visualEmoji}>{currentCard.visual}</Text>
          </View>

          {/* Card Title */}
          <Text style={styles.cardTitle}>{currentCard.title}</Text>

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
              <Text style={styles.contentText}>{currentCard[activeMode]}</Text>
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
                currentCardIndex === lesson.cards.length - 1 && styles.navButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={currentCardIndex === lesson.cards.length - 1}
            >
              <Text
                style={[
                  styles.navButtonText,
                  styles.navButtonTextNext,
                  currentCardIndex === lesson.cards.length - 1 && styles.navButtonTextDisabled,
                ]}
              >
                Next
              </Text>
              <Ionicons 
                name="arrow-forward" 
                size={20} 
                color={currentCardIndex === lesson.cards.length - 1 ? '#666666' : '#1E1E2E'} 
              />
            </TouchableOpacity>
          </View>

          {/* Progress Dots */}
          <View style={styles.progressDots}>
            {lesson.cards.map((_: any, index: number) => (
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
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerRight: {
    padding: 8,
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
});
