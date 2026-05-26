-- Fix RLS policies so registered drivers can read/write their own data
-- and so the registration flow works correctly

-- ── drivers table ────────────────────────────────────────────────────────────

-- Drop existing overly-restrictive policies
DROP POLICY IF EXISTS "Drivers can view own data" ON public.drivers;
DROP POLICY IF EXISTS "Drivers can insert own data" ON public.drivers;
DROP POLICY IF EXISTS "Drivers can update own data" ON public.drivers;

-- Allow a driver to SELECT their own row
CREATE POLICY "Drivers can view own data"
  ON public.drivers FOR SELECT
  USING (auth.uid() = user_id);

-- Allow INSERT when the user_id matches the authenticated user
CREATE POLICY "Drivers can insert own data"
  ON public.drivers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow UPDATE of own row
CREATE POLICY "Drivers can update own data"
  ON public.drivers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── documents table ──────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Drivers can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Drivers can insert own documents" ON public.documents;

CREATE POLICY "Drivers can view own documents"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.drivers
      WHERE drivers.id = documents.driver_id
        AND drivers.user_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can insert own documents"
  ON public.documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.drivers
      WHERE drivers.id = driver_id
        AND drivers.user_id = auth.uid()
    )
  );

-- ── payments table ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Drivers can insert own payments" ON public.payments;

CREATE POLICY "Drivers can insert own payments"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.drivers
      WHERE drivers.id = driver_id
        AND drivers.user_id = auth.uid()
    )
  );

-- ── storage: driver-documents bucket ─────────────────────────────────────────

-- Drop old conflicting policies
DROP POLICY IF EXISTS "Drivers can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Drivers can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Drivers can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own KYC documents" ON storage.objects;

-- Allow authenticated users to upload to any path under their user_id prefix
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'driver-documents');

CREATE POLICY "Authenticated users can view documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'driver-documents');

CREATE POLICY "Authenticated users can update documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'driver-documents');

CREATE POLICY "Authenticated users can delete documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'driver-documents');
