// frontend/screens/AuthScreen.js
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-ui-lib';
import { supabase } from '../utils/supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    else Alert.alert('Check your email for the confirmation link!');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campus Mojo</Text>
      <Text style={styles.subtitle}>Your Campus Wellness Companion</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      
      <Button
        label="Sign In"
        onPress={signInWithEmail}
        disabled={loading}
        style={styles.button}
      />
      
      <Button
        label="Sign Up"
        onPress={signUpWithEmail}
        disabled={loading}
        style={styles.button}
        outline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    marginBottom: 15,
    padding: 15,
  },
});