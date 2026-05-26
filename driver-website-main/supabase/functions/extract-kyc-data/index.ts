import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_DOC_TYPES = ['AADHAAR', 'DRIVING_LICENSE'] as const;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Supabase env not configured');
      return new Response(
        JSON.stringify({ error: 'Server not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { imageBase64, documentType } = await req.json();

    if (!imageBase64 || !documentType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate documentType against allowlist to prevent prompt injection
    if (!ALLOWED_DOC_TYPES.includes(documentType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid document type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic validation of imageBase64 (must be a data URL or base64 string, reasonable size)
    if (typeof imageBase64 !== 'string' || imageBase64.length < 100 || imageBase64.length > 15_000_000) {
      return new Response(
        JSON.stringify({ error: 'Invalid image payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = '';
    if (documentType === 'AADHAAR') {
      systemPrompt = `You are an OCR system extracting data from an Aadhaar Card. 
Extract ONLY the following information in JSON format:
{
  "name": "Full name as shown on card",
  "dob": "Date of birth in YYYY-MM-DD format or year only if full date not available",
  "address": "Complete address (exclude Aadhaar number)",
  "district": "District name if clearly visible, otherwise best guess from address",
  "state": "State name if clearly visible, otherwise best guess from address",
  "pincode": "6-digit pincode",
  "aadhaar_no": "12-digit Aadhaar number (format: XXXX XXXX XXXX or XXXXXXXXXXXX)"
}

Rules:
- Return ONLY valid JSON
- If a field cannot be extracted, use empty string ""
- Do not include any explanatory text
- Ensure date is in YYYY-MM-DD format or just YYYY if only year is visible
- Remove any spaces from aadhaar_no`;
    } else if (documentType === 'DRIVING_LICENSE') {
      systemPrompt = `You are an OCR system extracting data from a Driving License. 
Extract ONLY the following information in JSON format:
{
  "license_no": "License number",
  "license_valid_till": "Validity date in YYYY-MM-DD format",
  "name": "Full name as shown on card",
  "dob": "Date of birth in YYYY-MM-DD format",
  "address": "Complete address"
}

Rules:
- Return ONLY valid JSON
- If a field cannot be extracted, use empty string ""
- Do not include any explanatory text
- Ensure date is in YYYY-MM-DD format`;
    }

    console.log(`Processing ${documentType} document`);

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-1.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: `AI process failed (${aiResponse.status}): ${errorText.slice(0, 100)}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const extractedText = aiData.choices?.[0]?.message?.content;

    if (!extractedText) {
      return new Response(
        JSON.stringify({ error: 'No data extracted from document' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let extractedData;
    try {
      const cleanText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      extractedData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse AI JSON response');
      return new Response(
        JSON.stringify({ error: 'Failed to parse extracted data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in extract-kyc-data:', error?.message || 'unknown');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
