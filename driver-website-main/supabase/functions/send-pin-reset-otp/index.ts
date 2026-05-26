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

    const { mobile } = await req.json();

    console.log('PIN reset OTP request for mobile:', mobile);

    if (!mobile) {
      return new Response(
        JSON.stringify({ error: 'Mobile number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if driver exists
    const { data: driver, error: fetchError } = await supabase
      .from('drivers')
      .select('id, name')
      .eq('mobile', mobile)
      .single();

    if (fetchError || !driver) {
      // Don't reveal if mobile exists or not for security
      console.log('Driver not found, but returning success for security');
      return new Response(
        JSON.stringify({ success: true, message: 'If this mobile number is registered, an OTP has been sent.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_hash = await bcrypt.hash(otp);

    // Set expiry (10 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Store OTP
    const { error: otpError } = await supabase
      .from('pin_reset_otps')
      .insert({
        mobile,
        otp_hash,
        expires_at: expiresAt.toISOString()
      });

    if (otpError) {
      console.error('Failed to store OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // TODO: In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    // For now, log OTP for development
    console.log(`OTP for ${mobile}: ${otp}`);

    // In development, return OTP in response (REMOVE IN PRODUCTION!)
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // DEVELOPMENT ONLY - remove this line in production:
        otp_dev: otp
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Send OTP error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
