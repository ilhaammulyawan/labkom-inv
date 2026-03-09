DROP POLICY IF EXISTS "Users can update own pending borrowings" ON public.borrowings;
CREATE POLICY "Users can update own borrowings" ON public.borrowings
FOR UPDATE TO authenticated
USING (auth.uid() = borrower_id AND status IN ('Menunggu', 'Dipinjam'))
WITH CHECK (auth.uid() = borrower_id AND status IN ('Menunggu', 'Pengembalian'));