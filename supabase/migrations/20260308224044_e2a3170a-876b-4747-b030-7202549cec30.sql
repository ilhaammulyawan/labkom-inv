
-- Drop restrictive policies
DROP POLICY "Authenticated users can insert categories" ON public.categories;
DROP POLICY "Authenticated users can update categories" ON public.categories;
DROP POLICY "Authenticated users can delete categories" ON public.categories;
DROP POLICY "Authenticated users can insert rooms" ON public.rooms;
DROP POLICY "Authenticated users can update rooms" ON public.rooms;
DROP POLICY "Authenticated users can delete rooms" ON public.rooms;

-- Allow all operations (auth is handled at app level)
CREATE POLICY "Allow insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update categories" ON public.categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete categories" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Allow insert rooms" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update rooms" ON public.rooms FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete rooms" ON public.rooms FOR DELETE USING (true);
