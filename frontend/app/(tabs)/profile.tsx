import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { privacyAPI } from '../../utils/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await privacyAPI.deleteAccount();
              Alert.alert('Success', 'Account deletion requested');
              await logout();
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      const response = await privacyAPI.exportData();
      Alert.alert('Success', 'Your data has been exported');
      console.log('Exported data:', response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Level {user?.level || 1}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.xp || 0}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.streak || 0}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color="#FFD700" />
          <Text style={styles.menuItemText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#FFD700" />
          <Text style={styles.menuItemText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#FFD700" />
          <Text style={styles.menuItemText}>Privacy & Data</Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

        {/* Parent Dashboard (if parent) */}
        {user?.role === 'parent' && (
          <>
            <Text style={styles.sectionTitle}>Parent Dashboard</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="people-outline" size={24} color="#4ECDC4" />
              <Text style={styles.menuItemText}>My Children</Text>
              <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
            </TouchableOpacity>
          </>
        )}

        {/* Data & Privacy */}
        <Text style={styles.sectionTitle}>Data & Privacy</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleExportData}
          disabled={loading}
        >
          <Ionicons name="download-outline" size={24} color="#4ECDC4" />
          <Text style={styles.menuItemText}>Export My Data</Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color="#A0A0B0" />
          <Text style={styles.menuItemText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-outline" size={24} color="#A0A0B0" />
          <Text style={styles.menuItemText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#FFD700" />
          <Text style={styles.menuItemText}>Help & FAQ</Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#FFD700" />
          <Text style={styles.menuItemText}>Feedback</Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>Danger Zone</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
          <Text style={[styles.menuItemText, { color: '#FF6B6B' }]}>Logout</Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
          <Text style={[styles.menuItemText, { color: '#FF6B6B' }]}>
            Delete Account
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#A0A0B0" />
        </TouchableOpacity>

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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  userCard: {
    backgroundColor: '#2D2D3D',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#A0A0B0',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0A0B0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
});
