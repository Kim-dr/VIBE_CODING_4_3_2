// frontend/screens/ProfileScreen.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card } from 'react-native-ui-lib';
import { supabase } from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState({});
  const [stats, setStats] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    loadUserProfile();
    loadUserStats();
  }, []);

  async function loadUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setUserProfile(data || {});
  }

  async function loadUserStats() {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get mood entries count
    const { count: moodCount } = await supabase
      .from('moods')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);
    
    // Get habit entries count
    const { count: habitCount } = await supabase
      .from('habits')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);
    
    // Get group membership count
    const { count: groupCount } = await supabase
      .from('group_members')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);
    
    setStats({
      moodEntries: moodCount || 0,
      habitEntries: habitCount || 0,
      groupsJoined: groupCount || 0,
    });
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
  }

  function navigateToUpgrade() {
    navigation.navigate('Upgrade');
  }

  const getTierDisplay = (tier) => {
    const tiers = {
      free: { name: 'Free Tier', color: '#95a5a6' },
      lite: { name: 'Lite Tier', color: '#3498db' },
      pro: { name: 'Pro Tier', color: '#9b59b6' }
    };
    return tiers[tier] || tiers.free;
  };

  const tierInfo = getTierDisplay(userProfile.tier);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: tierInfo.color }]}>
            <Text style={styles.avatarText}>
              {userProfile.handle ? userProfile.handle.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.handle}>@{userProfile.handle || 'username'}</Text>
            <Text style={styles.email}>{userProfile.email}</Text>
            <View style={[styles.tierBadge, { backgroundColor: tierInfo.color }]}>
              <Text style={styles.tierText}>{tierInfo.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.moodEntries}</Text>
            <Text style={styles.statLabel}>Moods</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.habitEntries}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.groupsJoined}</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
        </View>
      </Card>

      {/* Account Tier */}
      <Card style={styles.tierCard}>
        <Text style={styles.tierTitle}>Your Account Tier</Text>
        <Text style={styles.tierDescription}>
          {userProfile.tier === 'free' 
            ? 'Free members have access to basic features but need to upgrade for premium groups.'
            : userProfile.tier === 'lite'
            ? 'Lite members have access to most premium groups and features.'
            : 'Pro members have full access to all features and premium groups.'
          }
        </Text>
        
        {userProfile.tier === 'free' && (
          <Button
            label="Upgrade Account"
            onPress={navigateToUpgrade}
            style={styles.upgradeButton}
          />
        )}
      </Card>

      {/* App Information */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Campus Mojo</Text>
        <Text style={styles.infoText}>
          Campus Mojo helps students maintain mental wellness through habit tracking, 
          mood monitoring, budget management, and peer support.
        </Text>
        <Text style={styles.infoText}>
          Version 1.0.0 • Built with ❤️ for students
        </Text>
      </Card>

      {/* Actions */}
      <Button
        label="Sign Out"
        onPress={signOut}
        style={styles.signOutButton}
        outline
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  profileCard: {
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  handle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tierText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tierCard: {
    padding: 20,
    marginBottom: 20,
  },
  tierTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  tierDescription: {
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  upgradeButton: {
    padding: 15,
  },
  infoCard: {
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  signOutButton: {
    padding: 15,
    borderColor: '#e74c3c',
  },
});