import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    role: 'student',
    terms_accepted: false,
    privacy_accepted: false,
  });

  const handleSignup = async () => {
    if (!formData.email || !formData.mobile || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.terms_accepted || !formData.privacy_accepted) {
      Alert.alert('Error', 'Please accept terms and privacy policy');
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
      router.replace('/(auth)/onboarding');
    } catch (error: any) {
      Alert.alert('Signup Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join AILO and start learning!</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor="#666"
            value={formData.full_name}
            onChangeText={(text) => setFormData({ ...formData, full_name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            placeholderTextColor="#666"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Age *"
            placeholderTextColor="#666"
            keyboardType="number-pad"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Grade"
            placeholderTextColor="#666"
            keyboardType="number-pad"
            value={formData.grade}
            onChangeText={(text) => setFormData({ ...formData, grade: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Board (e.g., CBSE, ICSE)"
            placeholderTextColor="#666"
            value={formData.board}
            onChangeText={(text) => setFormData({ ...formData, board: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="School"
            placeholderTextColor="#666"
            value={formData.school}
            onChangeText={(text) => setFormData({ ...formData, school: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#666"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
          />

          {parseInt(formData.age) < 18 && (
            <>
              <Text style={styles.sectionTitle}>Parental Consent Required</Text>
              <TextInput
                style={styles.input}
                placeholder="Parent Email *"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.parent_email}
                onChangeText={(text) =>
                  setFormData({ ...formData, parent_email: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Parent Phone *"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                value={formData.parent_phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, parent_phone: text })
                }
              />
            </>
          )}

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              setFormData({ ...formData, terms_accepted: !formData.terms_accepted })
            }
          >
            <View
              style={[
                styles.checkbox,
                formData.terms_accepted && styles.checkboxChecked,
              ]}
            >
              {formData.terms_accepted && (
                <Ionicons name="checkmark" size={16} color="#1E1E2E" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>I accept the Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              setFormData({
                ...formData,
                privacy_accepted: !formData.privacy_accepted,
              })
            }
          >
            <View
              style={[
                styles.checkbox,
                formData.privacy_accepted && styles.checkboxChecked,
              ]}
            >
              {formData.privacy_accepted && (
                <Ionicons name="checkmark" size={16} color="#1E1E2E" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>I accept the Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 16,
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
    marginTop: 16,
    marginBottom: 8,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#2D2D3D',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3D3D4D',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FFD700',
  },
  checkboxLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2E',
  },
  linkText: {
    color: '#FFD700',
    fontSize: 14,
    textAlign: 'center',
  },
});
