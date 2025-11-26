import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { NovaMascot } from '../../components/NovaMascot';
import { dashboardAPI, seedAPI } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
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

  const isFirstTime = !dashboard || dashboard.progress.completed_chapters === 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {isFirstTime ? 'Welcome!' : 'Welcome back,'}
          </Text>
          <Text style={styles.userName}>{user?.full_name || 'Student'}</Text>
        </View>
        <NovaMascot animation="wave" size={60} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={32} color="#FF6B6B" />
          <Text style={styles.statValue}>{dashboard?.user?.streak || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="star" size={32} color="#FFD700" />
          <Text style={styles.statValue}>{dashboard?.user?.xp || 0}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={32} color="#4ECDC4" />
          <Text style={styles.statValue}>Lv {dashboard?.user?.level || 1}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {/* Daily Goal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Goal</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalText}>Study Time</Text>
            <Text style={styles.goalProgress}>
              {dashboard?.daily_goal?.completed_minutes || 0} /{' '}
              {dashboard?.daily_goal?.target_minutes || 30} min
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    ((dashboard?.daily_goal?.completed_minutes || 0) /
                      (dashboard?.daily_goal?.target_minutes || 30)) *
                    100
                  }%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Progress Overview */}
      {dashboard?.progress && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Chapters Completed</Text>
              <Text style={styles.progressValue}>
                {dashboard.progress.completed_chapters} / {dashboard.progress.total_chapters}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${dashboard.progress.percentage}%` },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {/* AI Recommendations */}
      {dashboard?.recommendations && dashboard.recommendations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={20} color="#FFD700" />
            <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>
              AI Recommendations for You
            </Text>
          </View>
          {dashboard.recommendations.map((rec: string, index: number) => (
            <View key={index} style={styles.recommendationCard}>
              <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
              <Text style={styles.recommendationText}>{rec}</Text>
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

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    color: '#A0A0B0',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0A0B0',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
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
  goalCard: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  goalProgress: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#3D3D4D',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressCard: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  progressValue: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 12,
    lineHeight: 20,
  },
  seedButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
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
