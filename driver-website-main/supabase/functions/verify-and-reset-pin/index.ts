import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { mobile, otp, new_pin } = await req.json();

    console.log('PIN reset verification for mobile:', mobile);

    // Validate inputs
    if (!mobile || !otp || !new_pin) {
      return new Response(
        JSON.stringify({ error: 'Mobile, OTP, and new PIN are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/^\d{4}$/.test(new_pin)) {
      return new Response(
        JSON.stringify({ error: 'New PIN must be exactly 4 digits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the most recent unused OTP for this mobile
    const { data: otpRecords, error: otpError } = await supabase
      .from('pin_reset_otps')
      .select('*')
      .eq('mobile', mobile)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (otpError || !otpRecords || otpRecords.length === 0) {
      console.log('No valid OTP found for mobile:', mobile);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const otpRecord = otpRecords[0];

    // Check if OTP is expired
    const expiresAt = new Date(otpRecord.expires_at);
    if (expiresAt < new Date()) {
      console.log('OTP expired for mobile:', mobile);
      return new Response(
        JSON.stringify({ error: 'OTP has expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify OTP
    const otpMatch = await bcrypt.compare(otp, otpRecord.otp_hash);

    if (!otpMatch) {
      console.log('Invalid OTP for mobile:', mobile);
      return new Response(
        JSON.stringify({ error: 'Invalid OTP' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as used
    await supabase
      .from('pin_reset_otps')
      .update({ used: true })
      .eq('id', otpRecord.id);

    // Hash new PIN
    const new_pin_hash = await bcrypt.hash(new_pin);

    // Update driver's PIN
    const { error: updateError } = await supabase
      .from('drivers')
      .update({ 
        pin_hash: new_pin_hash,
        failed_login_attempts: 0,
        account_locked_until: null
      })
      .eq('mobile', mobile);

    if (updateError) {
      console.error('Failed to update PIN:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to reset PIN' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('PIN reset successful for mobile:', mobile);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'PIN reset successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PIN reset error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
