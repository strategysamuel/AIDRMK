ALTER TABLE public.drivers 
  ADD COLUMN IF NOT EXISTS blood_group TEXT,
  ADD COLUMN IF NOT EXISTS emergency_mobile TEXT,
  ADD COLUMN IF NOT EXISTS membership_plan TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS father_or_husband_name TEXT;
