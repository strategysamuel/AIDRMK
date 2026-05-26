-- Ensure extra driver fields exist (idempotent)
ALTER TABLE public.drivers
  ADD COLUMN IF NOT EXISTS blood_group TEXT,
  ADD COLUMN IF NOT EXISTS emergency_mobile TEXT,
  ADD COLUMN IF NOT EXISTS membership_plan TEXT DEFAULT 'BASIC',
  ADD COLUMN IF NOT EXISTS father_or_husband_name TEXT,
  ADD COLUMN IF NOT EXISTS pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS selfie_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS signature_url TEXT,
  ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_failed_login_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMPTZ;

-- Drop the restrictive check constraint on kyc_status if it exists,
-- so any free-text status value is accepted.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'drivers_kyc_status_check'
  ) THEN
    ALTER TABLE public.drivers DROP CONSTRAINT drivers_kyc_status_check;
  END IF;
END $$;
