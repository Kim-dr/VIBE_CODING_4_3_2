// frontend/screens/MoodTracker.js
import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Slider } from 'react-native-ui-lib'
import { supabase } from '../utils/supabase'

export default function MoodTracker() {
  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [note, setNote] = useState('')

  const saveMood = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('moods')
      .insert([
        { 
          user_id: user.id, 
          mood: mood, 
          energy: energy, 
          note: note 
        }
      ])

    if (!error) {
      alert('Mood saved successfully!')
    }
  }

  return (
    <View style={styles.container}>
      <Text>How are you feeling today?</Text>
      
      <Text>Mood: {mood}</Text>
      <Slider value={mood} onValueChange={setMood} minimumValue={1} maximumValue={5} />
      
      <Text>Energy: {energy}</Text>
      <Slider value={energy} onValueChange={setEnergy} minimumValue={1} maximumValue={5} />
      
      <Button label="Save Mood" onPress={saveMood} />
    </View>
  )
}