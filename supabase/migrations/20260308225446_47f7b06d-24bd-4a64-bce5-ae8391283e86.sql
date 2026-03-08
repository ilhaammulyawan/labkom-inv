-- Create storage bucket for app logos
INSERT INTO storage.buckets (id, name, public) VALUES ('app-assets', 'app-assets', true);

-- RLS policies for app-assets bucket
CREATE POLICY "Anyone can read app assets" ON storage.objects FOR SELECT USING (bucket_id = 'app-assets');
CREATE POLICY "Authenticated users can upload app assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-assets');
CREATE POLICY "Authenticated users can update app assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'app-assets');
CREATE POLICY "Authenticated users can delete app assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'app-assets');

-- Create app_settings table for storing app configuration
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert app settings" ON public.app_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update app settings" ON public.app_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete app settings" ON public.app_settings FOR DELETE TO authenticated USING (true);