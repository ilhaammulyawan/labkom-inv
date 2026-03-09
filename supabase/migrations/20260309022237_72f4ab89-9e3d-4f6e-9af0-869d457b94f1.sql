
-- Maintenance Schedules (Jadwal Maintenance)
CREATE TABLE public.maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  frequency TEXT NOT NULL DEFAULT 'monthly',
  next_due_date DATE NOT NULL,
  last_performed_date DATE,
  assigned_technician TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read maintenance_schedules" ON public.maintenance_schedules FOR SELECT USING (true);
CREATE POLICY "Admins can insert maintenance_schedules" ON public.maintenance_schedules FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update maintenance_schedules" ON public.maintenance_schedules FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete maintenance_schedules" ON public.maintenance_schedules FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Software Inventory
CREATE TABLE public.software_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  software_name TEXT NOT NULL,
  version TEXT DEFAULT '',
  license_type TEXT DEFAULT '',
  license_key TEXT DEFAULT '',
  expiry_date DATE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.software_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read software_inventory" ON public.software_inventory FOR SELECT USING (true);
CREATE POLICY "Admins can insert software_inventory" ON public.software_inventory FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update software_inventory" ON public.software_inventory FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete software_inventory" ON public.software_inventory FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Borrowings (Peminjaman)
CREATE TYPE public.borrowing_status AS ENUM ('Menunggu', 'Disetujui', 'Ditolak', 'Dipinjam', 'Dikembalikan');

CREATE TABLE public.borrowings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL,
  borrower_name TEXT NOT NULL,
  purpose TEXT DEFAULT '',
  borrow_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_return_date DATE NOT NULL,
  actual_return_date DATE,
  status public.borrowing_status NOT NULL DEFAULT 'Menunggu',
  approved_by UUID,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.borrowings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read borrowings" ON public.borrowings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert borrowings" ON public.borrowings FOR INSERT TO authenticated WITH CHECK (auth.uid() = borrower_id);
CREATE POLICY "Admins can update borrowings" ON public.borrowings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update own pending borrowings" ON public.borrowings FOR UPDATE USING (auth.uid() = borrower_id AND status = 'Menunggu') WITH CHECK (auth.uid() = borrower_id AND status = 'Menunggu');
CREATE POLICY "Admins can delete borrowings" ON public.borrowings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Activity Logs (Riwayat Perubahan)
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read activity_logs" ON public.activity_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated users can insert activity_logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);
