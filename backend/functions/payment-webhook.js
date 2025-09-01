// Handle payment webhooks from IntaSend
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { event, invoice, payload } = await req.json()
  
  if (event === 'invoice.completed') {
    // Update user tier in profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ tier: payload.tier })
      .eq('id', payload.user_id)
    
    if (!error) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
  
  return new Response(JSON.stringify({ success: false }), {
    headers: { 'Content-Type': 'application/json' },
  })
})