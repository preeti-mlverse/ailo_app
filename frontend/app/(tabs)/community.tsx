import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { communityAPI } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function CommunityScreen() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('leaderboard');

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      const [leaderboardRes, groupsRes] = await Promise.all([
        communityAPI.getLeaderboard(),
        communityAPI.getGroups(),
      ]);
      setLeaderboard(leaderboardRes.data);
      setGroups(groupsRes.data);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCommunityData();
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      await communityAPI.joinGroup(groupId);
      Alert.alert('Success', 'Joined group successfully!');
      loadCommunityData();
    } catch (error) {
      Alert.alert('Error', 'Failed to join group');
    }
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect and compete</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.tabActive]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'leaderboard' && styles.tabTextActive,
            ]}
          >
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.tabActive]}
          onPress={() => setActiveTab('groups')}
        >
          <Text
            style={[styles.tabText, activeTab === 'groups' && styles.tabTextActive]}
          >
            Study Groups
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />
        }
      >
        {activeTab === 'leaderboard' && leaderboard && (
          <View>
            {/* Current User Rank */}
            <View style={styles.userRankCard}>
              <Text style={styles.userRankLabel}>Your Rank</Text>
              <View style={styles.userRankInfo}>
                <Text style={styles.userRankNumber}>#{leaderboard.current_user_rank}</Text>
                <Text style={styles.userRankXP}>{leaderboard.current_user_xp} XP</Text>
              </View>
            </View>

            {/* Top Users */}
            <Text style={styles.sectionTitle}>Top Learners</Text>
            {leaderboard.top_users.map((item: any) => (
              <View
                key={item.user_id}
                style={[
                  styles.leaderboardItem,
                  item.rank <= 3 && styles.leaderboardItemTop,
                ]}
              >
                <Text style={styles.rank}>{getRankMedal(item.rank)}</Text>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.full_name}</Text>
                  <Text style={styles.userLevel}>Level {item.level}</Text>
                </View>
                <View style={styles.xpBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.xpText}>{item.xp}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'groups' && (
          <View>
            <Text style={styles.sectionTitle}>Study Groups</Text>
            {groups.map((group) => (
              <View key={group.group_id} style={styles.groupCard}>
                <View style={styles.groupHeader}>
                  <View style={styles.groupIcon}>
                    <Ionicons name="people" size={24} color="#FFD700" />
                  </View>
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupDescription}>
                      {group.description || 'No description'}
                    </Text>
                    <Text style={styles.groupMembers}>
                      {group.member_count} / {group.max_members} members
                    </Text>
                  </View>
                </View>
                {!group.is_member && (
                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => handleJoinGroup(group.group_id)}
                  >
                    <Text style={styles.joinButtonText}>Join Group</Text>
                  </TouchableOpacity>
                )}
                {group.is_member && (
                  <View style={styles.memberBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                    <Text style={styles.memberBadgeText}>Member</Text>
                  </View>
                )}
              </View>
            ))}

            {groups.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#A0A0B0" />
                <Text style={styles.emptyText}>No study groups yet</Text>
                <Text style={styles.emptySubtext}>Be the first to create one!</Text>
              </View>
            )}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2D2D3D',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0A0B0',
  },
  tabTextActive: {
    color: '#1E1E2E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  userRankCard: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  userRankLabel: {
    fontSize: 14,
    color: '#A0A0B0',
    marginBottom: 8,
  },
  userRankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRankNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  userRankXP: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  leaderboardItemTop: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 14,
    color: '#A0A0B0',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D3D4D',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  xpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  groupCard: {
    backgroundColor: '#2D2D3D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#3D3D4D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: '#A0A0B0',
    marginBottom: 8,
  },
  groupMembers: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  memberBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
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
