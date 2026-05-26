// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://esm.sh/bcryptjs";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { mobile, pin } = await req.json();

    console.log('Login attempt for mobile:', mobile);

    // Validate inputs
    if (!mobile || !pin || !/^\d{4}$/.test(pin)) {
      return new Response(
        JSON.stringify({ error: 'Invalid mobile number or PIN' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get driver record
    const { data: driver, error: fetchError } = await supabase
      .from('drivers')
      .select('*')
      .eq('mobile', mobile)
      .single();

    if (fetchError || !driver) {
      console.log('Driver not found for mobile:', mobile);
      return new Response(
        JSON.stringify({ error: 'Invalid mobile number or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if account is locked
    if (driver.account_locked_until) {
      const lockoutEnd = new Date(driver.account_locked_until);
      if (lockoutEnd > new Date()) {
        const minutesRemaining = Math.ceil((lockoutEnd.getTime() - Date.now()) / 60000);
        return new Response(
          JSON.stringify({ 
            error: `Account is locked due to too many failed attempts. Try again in ${minutesRemaining} minutes.` 
          }),
          { status: 423, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Lockout expired, reset
        await supabase
          .from('drivers')
          .update({ 
            account_locked_until: null, 
            failed_login_attempts: 0 
          })
          .eq('id', driver.id);
      }
    }

    // Verify PIN using pure JS implementation
    const pinMatch = bcrypt.compareSync(pin, driver.pin_hash);

    if (!pinMatch) {
      console.log('Invalid PIN for mobile:', mobile);
      
      // Increment failed attempts
      const newFailedAttempts = (driver.failed_login_attempts || 0) + 1;
      const updateData: any = {
        failed_login_attempts: newFailedAttempts,
        last_failed_login_at: new Date().toISOString()
      };

      // Lock account if max attempts reached
      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockoutEnd = new Date();
        lockoutEnd.setMinutes(lockoutEnd.getMinutes() + LOCKOUT_DURATION_MINUTES);
        updateData.account_locked_until = lockoutEnd.toISOString();
      }

      await supabase
        .from('drivers')
        .update(updateData)
        .eq('id', driver.id);

      const remainingAttempts = MAX_FAILED_ATTEMPTS - newFailedAttempts;
      if (remainingAttempts > 0) {
        return new Response(
          JSON.stringify({ 
            error: `Invalid mobile number or PIN. ${remainingAttempts} attempts remaining.` 
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            error: `Account locked for ${LOCKOUT_DURATION_MINUTES} minutes due to too many failed attempts.` 
          }),
          { status: 423, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Reset failed attempts on successful login
    await supabase
      .from('drivers')
      .update({ 
        failed_login_attempts: 0,
        last_failed_login_at: null,
        account_locked_until: null
      })
      .eq('id', driver.id);

    // Create session token (using Supabase auth)
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: `${mobile}@driverapp.com`
    });

    if (sessionError) {
      console.error('Session creation failed:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Login successful for mobile:', mobile);

    return new Response(
      JSON.stringify({ 
        success: true,
        driver: {
          id: driver.id,
          name: driver.name,
          mobile: driver.mobile,
          membership_id: driver.membership_id,
          status: driver.status,
          kyc_status: driver.kyc_status
        },
        auth_url: sessionData.properties.action_link
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
