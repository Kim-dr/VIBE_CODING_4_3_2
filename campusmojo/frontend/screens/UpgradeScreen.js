// frontend/screens/UpgradeScreen.js
import { useState } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-ui-lib'
import * as WebBrowser from 'expo-web-browser'

export default function UpgradeScreen() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async (tier) => {
    setLoading(true)
    
    // Call backend function to create payment link
    const paymentUrl = await createPaymentLink(tier)
    
    // Open payment page in browser
    await WebBrowser.openBrowserAsync(paymentUrl)
    
    setLoading(false)
  }

  return (
    <View>
      <Text>Upgrade to access premium peer groups!</Text>
      <Button label="Lite Tier ($2.99/month)" onPress={() => handleUpgrade('lite')} />
      <Button label="Pro Tier ($4.99/month)" onPress={() => handleUpgrade('pro')} />
    </View>
  )
}