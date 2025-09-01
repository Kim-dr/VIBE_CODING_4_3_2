import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Slider } from 'react-native-ui-lib';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { moodUtils } from '../utils/supabase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FormField } from '../components/ui/FormField';
import { validateMood, validateEnergy } from '../utils/validation';
import { MOOD_EMOJIS, APP_CONSTANTS, COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../utils/constants';
import { Mood } from '../types';

export const MoodTrackerScreen: React.FC = () => {
  const { user } = useAuth();
  const [mood, setMood] = useState(APP_CONSTANTS.DEFAULT_MOOD);
  const [energy, setEnergy] = useState(APP_CONSTANTS.DEFAULT_ENERGY);
  const [note, setNote] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { execute: saveMood, loading } = useApi<Mood>();

  const handleSaveMood = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save your mood');
      return;
    }

    // Clear previous errors
    setFormErrors({});

    // Validate inputs
    const errors: Record<string, string> = {};
    
    if (!validateMood(mood)) {
      errors.mood = 'Please select a valid mood (1-5)';
    }
    
    if (!validateEnergy(energy)) {
      errors.energy = 'Please select a valid energy level (1-5)';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Save mood
    const result = await saveMood(() => 
      moodUtils.addMood({
        user_id: user.id,
        mood: mood as 1 | 2 | 3 | 4 | 5,
        energy: energy as 1 | 2 | 3 | 4 | 5,
        note: note.trim() || undefined,
      })
    );

    if (result.success) {
      Alert.alert('Success', 'Mood saved successfully!');
      setMood(APP_CONSTANTS.DEFAULT_MOOD);
      setEnergy(APP_CONSTANTS.DEFAULT_ENERGY);
      setNote('');
    } else {
      Alert.alert('Error', result.error || 'Failed to save mood');
    }
  };

  const getMoodDescription = (moodValue: number): string => {
    const descriptions = {
      1: 'Very Sad',
      2: 'Sad',
      3: 'Neutral',
      4: 'Happy',
      5: 'Very Happy',
    };
    return descriptions[moodValue as keyof typeof descriptions] || 'Unknown';
  };

  const getEnergyDescription = (energyValue: number): string => {
    const descriptions = {
      1: 'Very Low',
      2: 'Low',
      3: 'Moderate',
      4: 'High',
      5: 'Very High',
    };
    return descriptions[energyValue as keyof typeof descriptions] || 'Unknown';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      
      <Card>
        <Text style={styles.sectionTitle}>Mood</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.moodDisplay}>
            {MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS]} {getMoodDescription(mood)}
          </Text>
          <Slider
            value={mood}
            onValueChange={setMood}
            minimumValue={1}
            maximumValue={5}
            step={1}
            style={styles.slider}
          />
          <View style={styles.moodLabels}>
            <Text style={styles.moodLabel}>😢</Text>
            <Text style={styles.moodLabel}>😞</Text>
            <Text style={styles.moodLabel}>😐</Text>
            <Text style={styles.moodLabel}>😊</Text>
            <Text style={styles.moodLabel}>😁</Text>
          </View>
        </View>
        {formErrors.mood && <Text style={styles.errorText}>{formErrors.mood}</Text>}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Energy Level</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.energyDisplay}>
            {getEnergyDescription(energy)} Energy
          </Text>
          <Slider
            value={energy}
            onValueChange={setEnergy}
            minimumValue={1}
            maximumValue={5}
            step={1}
            style={styles.slider}
          />
          <View style={styles.energyLabels}>
            <Text style={styles.energyLabel}>Very Low</Text>
            <Text style={styles.energyLabel}>Low</Text>
            <Text style={styles.energyLabel}>Moderate</Text>
            <Text style={styles.energyLabel}>High</Text>
            <Text style={styles.energyLabel}>Very High</Text>
          </View>
        </View>
        {formErrors.energy && <Text style={styles.errorText}>{formErrors.energy}</Text>}
      </Card>

      <Card>
        <FormField
          label="Notes (Optional)"
          value={note}
          onChangeText={setNote}
          placeholder="How was your day? Any specific thoughts?"
          multiline
          numberOfLines={4}
          style={styles.noteInput}
        />
      </Card>

      <Button
        title="Save Mood"
        onPress={handleSaveMood}
        loading={loading}
        style={styles.saveButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: COLORS.dark,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: SPACING.md,
    color: COLORS.dark,
  },
  sliderContainer: {
    marginBottom: SPACING.md,
  },
  moodDisplay: {
    fontSize: FONT_SIZES.lg,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    color: COLORS.dark,
  },
  energyDisplay: {
    fontSize: FONT_SIZES.lg,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    color: COLORS.dark,
  },
  slider: {
    marginBottom: SPACING.sm,
  },
  moodLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
  },
  moodLabel: {
    fontSize: FONT_SIZES.md,
  },
  energyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
  },
  energyLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
    textAlign: 'center',
    flex: 1,
  },
  noteInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: SPACING.lg,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
});
