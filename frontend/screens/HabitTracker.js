// frontend/screens/HabitTrackerScreen.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Button, Picker } from 'react-native-ui-lib';
import { supabase } from '../utils/supabase';

export default function HabitTrackerScreen() {
  const [habits, setHabits] = useState([]);
  const [type, setType] = useState('sleep');
  const [value, setValue] = useState('');
  const [todayTotal, setTodayTotal] = useState({ sleep: 0, steps: 0 });

  useEffect(() => {
    loadTodayHabits();
  }, []);

  async function loadTodayHabits() {
    const { data: { user } } = await supabase.auth.getUser();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });

    setHabits(data || []);
    
    // Calculate today's totals
    const sleepTotal = data
      ?.filter(h => h.type === 'sleep')
      .reduce((sum, h) => sum + parseFloat(h.value), 0) || 0;
      
    const stepsTotal = data
      ?.filter(h => h.type === 'steps')
      .reduce((sum, h) => sum + parseFloat(h.value), 0) || 0;
    
    setTodayTotal({ sleep: sleepTotal, steps: stepsTotal });
  }

  async function addHabit() {
    if (!value) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('habits')
      .insert([
        { 
          user_id: user.id, 
          type: type, 
          value: parseFloat(value) 
        }
      ]);

    if (!error) {
      setValue('');
      loadTodayHabits(); // Reload habits
    }
  }

  async function deleteHabit(id) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (!error) {
      loadTodayHabits(); // Reload habits
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>
      
      {/* Today's Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{todayTotal.sleep.toFixed(1)}h</Text>
          <Text style={styles.summaryLabel}>Sleep Today</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{todayTotal.steps}</Text>
          <Text style={styles.summaryLabel}>Steps Today</Text>
        </View>
      </View>

      {/* Add New Habit */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Add New Entry</Text>
        
        <Picker
          value={type}
          onChange={setType}
          style={styles.picker}
        >
          <Picker.Item value="sleep" label="Sleep (hours)" />
          <Picker.Item value="steps" label="Steps" />
        </Picker>
        
        <TextInput
          style={styles.input}
          placeholder={type === 'sleep' ? 'Hours slept' : 'Step count'}
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
        />
        
        <Button
          label="Add Entry"
          onPress={addHabit}
          style={styles.addButton}
        />
      </View>

      {/* Recent Entries */}
      <Text style={styles.sectionTitle}>Today's Entries</Text>
      {habits.length === 0 ? (
        <Text style={styles.emptyText}>No entries today yet. Start tracking!</Text>
      ) : (
        habits.map((habit, index) => (
          <View key={index} style={styles.habitItem}>
            <View>
              <Text style={styles.habitType}>
                {habit.type === 'sleep' ? '💤 Sleep' : '👟 Steps'}
              </Text>
              <Text style={styles.habitValue}>
                {habit.value} {habit.type === 'sleep' ? 'hours' : 'steps'}
              </Text>
              <Text style={styles.habitTime}>
                {new Date(habit.created_at).toLocaleTimeString()}
              </Text>
            </View>
            <Button
              label="Delete"
              size="small"
              onPress={() => deleteHabit(habit.id)}
              outline
            />
          </View>
        ))
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  picker: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  addButton: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  habitType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  habitValue: {
    fontSize: 14,
    color: '#666',
  },
  habitTime: {
    fontSize: 12,
    color: '#999',
  },
});