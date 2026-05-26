import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_TYPES = ['SELFIE', 'SIGNATURE', 'AADHAAR', 'DRIVING_LICENSE'] as const;
type DocType = typeof ALLOWED_TYPES[number];

const PROMPTS: Record<DocType, { description: string; criteria: string }> = {
  SELFIE: {
    description: "a clear photograph of a single human person's face (a portrait/selfie suitable for an ID card)",
    criteria: "The image must show one human face clearly visible, looking roughly at the camera, with the face being the main subject. Reject if it is a document, screenshot, object, animal, group photo, blurry, or has no visible human face.",
  },
  SIGNATURE: {
    description: "a handwritten signature on paper or a plain background (ink/pen strokes forming a signature)",
    criteria: "The image must show handwritten signature strokes (cursive ink/pen marks) typically on white/plain paper. Reject if it is a photo of a person, an ID card, a printed document, or random text/objects.",
  },
  AADHAAR: {
    description: "an Indian Aadhaar Card (front or back), issued by UIDAI, containing a 12-digit Aadhaar number",
    criteria: "The image must clearly be an Aadhaar Card from the Government of India / UIDAI. It typically shows the UIDAI logo, 'Government of India' text, an Aadhaar number, and a photo. Reject if it is a Driving License, PAN card, Voter ID, selfie, signature, or any other document.",
  },
  DRIVING_LICENSE: {
    description: "an Indian Driving Licence (DL) issued by an RTO / state transport authority",
    criteria: "The image must clearly be a Driving Licence — it shows 'Driving Licence' text, a DL number, vehicle classes, validity dates, and an RTO/state transport authority. Reject if it is an Aadhaar card, PAN, Voter ID, selfie, signature, or any other document.",
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, documentType } = await req.json();

    if (!imageBase64 || !documentType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!ALLOWED_TYPES.includes(documentType)) {
      return new Response(JSON.stringify({ error: 'Invalid document type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (typeof imageBase64 !== 'string' || imageBase64.length < 100 || imageBase64.length > 15_000_000) {
      return new Response(JSON.stringify({ error: 'Invalid image payload' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cfg = PROMPTS[documentType as DocType];
    const systemPrompt = `You are a strict document/image classifier for a driver membership KYC system.

The user is supposed to upload: ${cfg.description}.

Acceptance criteria: ${cfg.criteria}

Respond ONLY with valid JSON in this exact shape, no markdown, no explanation:
{
  "isValid": true | false,
  "confidence": 0.0 to 1.0,
  "detectedAs": "short label of what the image actually shows",
  "reason": "one short sentence explaining the decision"
}

Be strict. If you are not confident the image matches the expected type, set isValid to false.`;

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
              { type: 'image_url', image_url: { url: imageBase64 } },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI service credits exhausted.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'Failed to validate document' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const text = aiData.choices?.[0]?.message?.content ?? '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed: { isValid: boolean; confidence: number; detectedAs: string; reason: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse classifier JSON:', cleaned);
      return new Response(JSON.stringify({ error: 'Failed to parse validation result' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, ...parsed }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('validate-document-type error:', error?.message || 'unknown');
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
