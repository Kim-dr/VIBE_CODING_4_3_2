// Supabase Edge Function for creating payment links
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const intasendSecretKey = Deno.env.get('INTASEND_SECRET_KEY')

serve(async (req) => {
  // Create Supabase client with service role key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const { tier, userId } = await req.json()
  
  // Create payment request to IntaSend
  const response = await fetch('https://api.intasend.com/v1/payment/links/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${intasendSecretKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: tier === 'lite' ? 2.99 : 4.99,
      currency: 'USD',
      name: `Campus Mojo ${tier} tier`,
      description: `Monthly subscription for ${tier} tier`,
      redirect_url: `https://yourapp.com/payment-success?user_id=${userId}`,
      webhook_url: 'https://your-project-ref.functions.supabase.co/payment-webhook'
    })
  })
  
  const data = await response.json()
  
  return new Response(JSON.stringify({ url: data.url }), {
    headers: { 'Content-Type': 'application/json' },
  })
})