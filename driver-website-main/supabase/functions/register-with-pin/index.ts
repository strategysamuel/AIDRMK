// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://esm.sh/bcryptjs";

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

    const { 
      mobile, pin, name, dob, address, district, state, pincode, 
      license_no, license_valid_till, vehicle_types, aadhaar_no, whatsapp,
      membership_plan, payment_status 
    } = await req.json();

    console.log('Registration attempt for mobile:', mobile, 'Plan:', membership_plan);

    // Validate PIN (4 digits)
    if (!pin || !/^\d{4}$/.test(pin)) {
      return new Response(
        JSON.stringify({ error: 'PIN must be exactly 4 digits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!mobile || !name || !dob || !address || !district || !pincode || !license_no || !license_valid_till || !vehicle_types || vehicle_types.length === 0) {
      console.error('Missing required fields:', { mobile, name, dob, address, district, pincode, license_no, license_valid_till, vehicle_types });
      return new Response(
        JSON.stringify({ error: 'All required fields must be provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if mobile already exists
    const { data: existingDriver, error: checkError } = await supabase
      .from('drivers')
      .select('id')
      .eq('mobile', mobile)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing driver:', checkError);
    }

    if (existingDriver) {
      return new Response(
        JSON.stringify({ error: 'Mobile number already registered' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash the PIN (synchronous pure JS to avoid workers)
    const pin_hash = bcrypt.hashSync(pin, 10);

    // Create auth user (email-based for Supabase auth)
    const tempEmail = `${mobile}@driverapp.com`;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: tempEmail,
      password: Math.random().toString(36).slice(-12), // Random password, won't be used
      email_confirm: true,
      user_metadata: { mobile, name }
    });

    if (authError) {
      console.error('Auth user creation failed:', authError);
      return new Response(
        JSON.stringify({ error: `Auth creation failed: ${authError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert driver record
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .insert({
        user_id: authData.user.id,
        mobile,
        name,
        dob,
        address,
        district,
        state: state || 'Tamil Nadu',
        pincode,
        license_no,
        license_valid_till,
        vehicle_types,
        aadhaar_no,
        whatsapp: whatsapp || mobile,
        pin_hash,
        status: 'pending',
        kyc_status: 'pending',
        membership_plan: membership_plan || 'basic',
        has_accepted_terms: true,
        accepted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (driverError) {
      console.error('Driver record creation failed:', driverError);
      // Cleanup: delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return new Response(
        JSON.stringify({ error: `Database error: ${driverError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If payment was successful, create a payment record
    if (payment_status === 'completed' && membership_plan) {
      const amounts = { 'BASIC': 999, 'STANDARD': 2999, 'PREMIUM': 9999 };
      const amount = amounts[membership_plan as keyof typeof amounts] || 0;
      
      await supabase.from('payments').insert({
        driver_id: driverData.id,
        amount,
        currency: 'INR',
        status: 'completed',
        payment_type: 'membership_registration',
        paid_at: new Date().toISOString()
      });
    }

    console.log('Driver registered successfully:', driverData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        driver_id: driverData.id,
        membership_id: driverData.membership_id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Registration Edge Function Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
