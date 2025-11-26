import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { NovaMascot } from '../../components/NovaMascot';
import { dashboardAPI, seedAPI } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getHome();
      setDashboard(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSeedData = async () => {
    try {
      await seedAPI.seedData();
      setSeeded(true);
      await loadDashboard();
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <NovaMascot animation="idle" size={100} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />
      }
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <NovaMascot animation="wave" size={120} />
        <Text style={styles.heroText}>Ready to start your AI Journey!</Text>
      </View>

      {/* Learning Journey Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Learning Journey</Text>
        
        <View style={styles.learningCard}>
          <View style={styles.learningHeader}>
            <View>
              <Text style={styles.unitTitle}>Unit 1: Python Programming</Text>
              <View style={styles.learningMeta}>
                <Ionicons name="list" size={16} color="#A0A0B0" />
                <Text style={styles.metaText}>11 Topics • 75 minutes</Text>
              </View>
            </View>
            <View style={styles.learningIcon}>
              <Ionicons name="code-slash" size={32} color="#FFD700" />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.push('/(tabs)/learn')}
          >
            <Text style={styles.startButtonText}>Start Learning</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Track Progress Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Track Your Progress</Text>
        
        <View style={styles.progressGrid}>
          <TouchableOpacity style={[styles.progressCard, styles.streakCard]}>
            <View style={styles.progressIcon}>
              <Ionicons name="flame" size={40} color="#FF6B6B" />
            </View>
            <Text style={styles.progressTitle}>Start your</Text>
            <Text style={styles.progressTitle}>streak today!</Text>
            <Text style={styles.progressValue}>{dashboard?.user?.streak || 0} days</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.progressCard, styles.goalCard]}>
            <View style={styles.progressIcon}>
              <Ionicons name="target" size={40} color="#E74C3C" />
            </View>
            <Text style={styles.progressTitle}>Set Your Daily</Text>
            <Text style={styles.progressTitle}>Goal!</Text>
            <Text style={styles.progressValue}>{dashboard?.daily_goal?.target_minutes || 30} min</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.progressCard, styles.xpCard]}>
            <View style={styles.progressIcon}>
              <Ionicons name="star" size={40} color="#FFD700" />
            </View>
            <Text style={styles.progressTitle}>Start gaining</Text>
            <Text style={styles.progressTitle}>XP Points!</Text>
            <Text style={styles.progressValue}>{dashboard?.user?.xp || 0} XP</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, styles.communityAction]}
            onPress={() => router.push('/(tabs)/community')}
          >
            <Ionicons name="people" size={48} color="#FFFFFF" />
            <Text style={styles.actionTitle}>Explore communities</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, styles.assessmentAction]}
            onPress={() => router.push('/(tabs)/practice')}
          >
            <Ionicons name="school" size={48} color="#FFFFFF" />
            <Text style={styles.actionTitle}>Take an assessment!</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* AI Recommendations */}
      {dashboard?.recommendations && dashboard.recommendations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={20} color="#FFD700" />
            <Text style={[styles.sectionTitle, { marginLeft: 8, marginBottom: 0 }]}>
              AI Tips for You
            </Text>
          </View>
          {dashboard.recommendations.slice(0, 3).map((rec: string, index: number) => (
            <View key={index} style={styles.tipCard}>
              <Ionicons name="bulb" size={20} color="#4ECDC4" />
              <Text style={styles.tipText}>{rec}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Seed Data Button (Development) */}
      {!seeded && (
        <TouchableOpacity style={styles.seedButton} onPress={handleSeedData}>
          <Ionicons name="download" size={20} color="#1E1E2E" />
          <Text style={styles.seedButtonText}>Load Sample Content</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  heroSection: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 40,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  learningCard: {
    backgroundColor: '#E8F4F8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 8,
  },
  learningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
    marginBottom: 8,
  },
  learningMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#666666',
  },
  learningIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  progressCard: {
    width: '31%',
    aspectRatio: 0.9,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCard: {
    backgroundColor: '#4ECDC4',
  },
  goalCard: {
    backgroundColor: '#4ECDC4',
  },
  xpCard: {
    backgroundColor: '#4ECDC4',
  },
  progressIcon: {
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  communityAction: {
    backgroundColor: '#5DADE2',
  },
  assessmentAction: {
    backgroundColor: '#5DADE2',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  seedButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  seedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#A0A0B0',
    textAlign: 'center',
  },
});
