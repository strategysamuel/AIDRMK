-- Add selfie_photo_url column to drivers table
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS selfie_photo_url text;

-- Ensure has_accepted_terms and accepted_at exist (should already be present)
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS has_accepted_terms boolean DEFAULT false NOT NULL;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS accepted_at timestamp with time zone;