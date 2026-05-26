-- Keep public schemes and gallery content synchronized across all devices.

ALTER TABLE public.schemes ADD COLUMN IF NOT EXISTS scheme_price TEXT;
ALTER TABLE public.schemes ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'yearly';
ALTER TABLE public.schemes ADD COLUMN IF NOT EXISTS scheme_type TEXT DEFAULT 'government';
ALTER TABLE public.schemes ADD COLUMN IF NOT EXISTS apply_url TEXT;

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  description_en TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view gallery items" ON public.gallery_items;
CREATE POLICY "Everyone can view gallery items"
  ON public.gallery_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery items" ON public.gallery_items;
CREATE POLICY "Admins can manage gallery items"
  ON public.gallery_items FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

DROP TRIGGER IF EXISTS update_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.schemes REPLICA IDENTITY FULL;
ALTER TABLE public.gallery_items REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1
       FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime'
         AND schemaname = 'public'
         AND tablename = 'schemes'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.schemes;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1
       FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime'
         AND schemaname = 'public'
         AND tablename = 'gallery_items'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_items;
  END IF;
END $$;
