import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../../lib/theme';
import { Ionicons } from '@expo/vector-icons';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/drx3wkg1h/image/upload';
const CLOUDINARY_PRESET = 'BusTrac';
const API_BASE = 'https://bustrac-backend.onrender.com';

interface Driver {
  _id: string;
  name: string;
  email: string;
  city: string;
  image?: string;
  createdAt: string;
  activeBus?: string;
}

interface FormData {
  name: string;
  email: string;
  city: string;
  image: string;
}

export default function ProfileScreen() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    city: '',
    image: '',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadProfile();
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]); // loadProfile is called once on mount

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('driver_token');
      if (!token) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      console.log('Loading profile with token:', token ? 'Token exists' : 'No token');

      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Profile response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        setDriver(data.driver);
        setForm({
          name: data.driver.name || '',
          email: data.driver.email || '',
          city: data.driver.city || '',
          image: data.driver.image || '',
        });
      } else {
        const errorData = await response.json();
        console.log('Profile error response:', errorData);
        
        // If token is invalid, clear it and ask user to login again
        if (response.status === 401) {
          await AsyncStorage.removeItem('driver_token');
          await AsyncStorage.removeItem('driver_data');
          Alert.alert('Session Expired', 'Please login again', [
            {
              text: 'OK',
              onPress: () => {
                // You might want to navigate to login screen here
                // router.replace('/(auth)/login');
              }
            }
          ]);
          return;
        }
        
        throw new Error(errorData.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);
      formData.append('upload_preset', CLOUDINARY_PRESET);

      const xhr = new XMLHttpRequest();
      
      return new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error'));
        });

        xhr.open('POST', CLOUDINARY_URL);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUrl = await uploadImage(result.assets[0].uri);
        setForm(prev => ({ ...prev, image: imageUrl }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('driver_token');
      
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        setDriver(data.driver);
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: driver?.name || '',
      email: driver?.email || '',
      city: driver?.city || '',
      image: driver?.image || '',
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.navy} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Decorative Background */}
      <View style={styles.backgroundDecor}>
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
        <View style={[styles.blob, styles.blobThree]} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your driver profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Profile Image Section */}
          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              {form.image ? (
                <Image source={{ uri: form.image }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="person" size={48} color={theme.colors.textSecondary} />
                </View>
              )}
              
              {editing && (
                <TouchableOpacity
                  style={styles.imageEditButton}
                  onPress={pickImage}
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="camera" size={20} color="white" />
                  )}
                </TouchableOpacity>
              )}
            </View>

            {uploading && (
              <View style={styles.uploadProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>Uploading {uploadProgress}%</Text>
              </View>
            )}
          </View>

          {/* Profile Information */}
          <View style={styles.infoSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              {editing ? (
                <TextInput
                  style={styles.textInput}
                  value={form.name}
                  onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              ) : (
                <Text style={styles.fieldValue}>{driver?.name || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              {editing ? (
                <TextInput
                  style={styles.textInput}
                  value={form.email}
                  onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.fieldValue}>{driver?.email || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>City</Text>
              {editing ? (
                <TextInput
                  style={styles.textInput}
                  value={form.city}
                  onChangeText={(text) => setForm(prev => ({ ...prev, city: text }))}
                  placeholder="Enter your city"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              ) : (
                <Text style={styles.fieldValue}>{driver?.city || 'Not set'}</Text>
              )}
            </View>

            {/* Driver Stats */}
            <View style={styles.statsSection}>
              <Text style={styles.statsTitle}>Driver Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Ionicons name="calendar" size={24} color={theme.colors.teal} />
                  <Text style={styles.statValue}>
                    {driver?.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A'}
                  </Text>
                  <Text style={styles.statLabel}>Member Since</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Ionicons name="bus" size={24} color={theme.colors.sky} />
                  <Text style={styles.statValue}>{driver?.activeBus ? 'Assigned' : 'None'}</Text>
                  <Text style={styles.statLabel}>Active Bus</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Debug Button - Remove after testing */}
          <View style={styles.debugSection}>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={async () => {
                await AsyncStorage.removeItem('driver_token');
                await AsyncStorage.removeItem('driver_data');
                Alert.alert('Debug', 'Tokens cleared. Please restart app and login again.');
              }}
            >
              <Text style={styles.debugButtonText}>Clear Tokens (Debug)</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {editing ? (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                  disabled={saving || uploading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.saveButton, (saving || uploading) && styles.disabledButton]}
                  onPress={handleSave}
                  disabled={saving || uploading}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={20} color="white" />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditing(true)}
              >
                <Ionicons name="pencil" size={20} color="white" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  backgroundDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 0,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.06,
  },
  blobOne: {
    width: 200,
    height: 200,
    backgroundColor: theme.colors.teal,
    top: -50,
    left: -50,
  },
  blobTwo: {
    width: 150,
    height: 150,
    backgroundColor: theme.colors.sky,
    top: 50,
    right: -30,
  },
  blobThree: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.coral,
    top: 150,
    left: 100,
  },
  content: {
    zIndex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    ...theme.shadow.card,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.teal,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: theme.colors.border,
  },
  imageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  uploadProgress: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: theme.colors.muted,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.teal,
    borderRadius: 2,
  },
  progressText: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  infoSection: {
    marginBottom: theme.spacing.xl,
  },
  fieldGroup: {
    marginBottom: theme.spacing.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  fieldValue: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    paddingVertical: theme.spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.inputBg,
  },
  statsSection: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actionButtons: {
    marginTop: theme.spacing.lg,
  },
  editButton: {
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: theme.colors.teal,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  debugSection: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  debugButton: {
    backgroundColor: theme.colors.coral,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  debugButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
