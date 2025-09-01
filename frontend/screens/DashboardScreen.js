// frontend/screens/DashboardScreen.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-ui-lib';
import { supabase } from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const [userData, setUserData] = useState({});
  const [recentMood, setRecentMood] = useState(null);
  const [recentHabits, setRecentHabits] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadUserData();
    loadRecentMood();
    loadRecentHabits();
  }, []);

  async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setUserData(data);
  }

  async function loadRecentMood() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    setRecentMood(data);
  }

  async function loadRecentHabits() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);
    
    setRecentHabits(data || []);
  }

  const getMoodEmoji = (moodValue) => {
    const moods = ['😢', '😞', '😐', '😊', '😁'];
    return moods[moodValue - 1] || '❓';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Welcome back, {userData?.handle || 'Student'}!</Text>
      
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{recentMood ? getMoodEmoji(recentMood.mood) : '😶'}</Text>
          <Text style={styles.statLabel}>Current Mood</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{recentHabits.length}</Text>
          <Text style={styles.statLabel}>Today's Habits</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('MoodTracker')}
        >
          <Text style={styles.actionEmoji}>😊</Text>
          <Text style={styles.actionText}>Log Mood</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('HabitTracker')}
        >
          <Text style={styles.actionEmoji}>💤</Text>
          <Text style={styles.actionText}>Log Sleep</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('BudgetTracker')}
        >
          <Text style={styles.actionEmoji}>💰</Text>
          <Text style={styles.actionText}>Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('PeerGroups')}
        >
          <Text style={styles.actionEmoji}>👥</Text>
          <Text style={styles.actionText}>Groups</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {recentMood && (
        <Card style={styles.activityCard}>
          <Text>You logged your mood: {getMoodEmoji(recentMood.mood)}</Text>
          <Text style={styles.activityTime}>
            {new Date(recentMood.created_at).toLocaleTimeString()}
          </Text>
        </Card>
      )}

      {recentHabits.map((habit, index) => (
        <Card key={index} style={styles.activityCard}>
          <Text>Logged {habit.type}: {habit.value}</Text>
          <Text style={styles.activityTime}>
            {new Date(habit.created_at).toLocaleTimeString()}
          </Text>
        </Card>
      ))}

      {recentHabits.length === 0 && !recentMood && (
        <Card style={styles.activityCard}>
          <Text>No recent activity. Get started by logging your first mood or habit!</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
  activityCard: {
    padding: 15,
    marginBottom: 10,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});