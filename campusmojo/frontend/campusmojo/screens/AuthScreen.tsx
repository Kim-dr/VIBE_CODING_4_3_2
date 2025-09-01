import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { FormField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { validateAuthForm } from '../utils/validation';
import { APP_CONSTANTS, COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../utils/constants';

interface FormErrors {
  email?: string;
  password?: string;
}

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleSubmit = async () => {
    // Clear previous errors
    setFormErrors({});

    // Validate form
    const validation = validateAuthForm(email, password);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    // Submit form
    const result = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);

    if (result.success) {
      if (isSignUp) {
        Alert.alert('Success', 'Check your email for the confirmation link!');
      }
    } else {
      Alert.alert('Error', result.error || 'An error occurred');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormErrors({});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={styles.title}>{APP_CONSTANTS.APP_NAME}</Text>
        <Text style={styles.subtitle}>{APP_CONSTANTS.APP_TAGLINE}</Text>
        
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={formErrors.email}
        />
        
        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          error={formErrors.password}
        />
        
        <Button
          title={isSignUp ? 'Sign Up' : 'Sign In'}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
        
        <Button
          title={isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          onPress={toggleMode}
          variant="outline"
          style={styles.toggleButton}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    color: COLORS.dark,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: COLORS.gray[600],
  },
  submitButton: {
    marginBottom: SPACING.md,
  },
  toggleButton: {
    marginTop: SPACING.sm,
  },
});
