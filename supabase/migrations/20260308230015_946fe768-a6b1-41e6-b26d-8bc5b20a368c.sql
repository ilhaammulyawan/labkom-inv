-- Create item condition and status enums
CREATE TYPE public.item_condition AS ENUM ('Baik', 'Rusak Ringan', 'Rusak Berat', 'Diperbaiki');
CREATE TYPE public.item_status AS ENUM ('Aktif', 'Dipinjam', 'Dihapus');
CREATE TYPE public.maintenance_status AS ENUM ('Antrian', 'Dalam Perbaikan', 'Selesai');

-- Create items table
CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_code text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  room_id uuid REFERENCES public.rooms(id) ON DELETE SET NULL,
  name text NOT NULL,
  brand text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  serial_number text NOT NULL DEFAULT '',
  hostname text,
  cpu text,
  ram text,
  storage text,
  vga text,
  os text,
  os_license text,
  ip_address text,
  mac_address text,
  screen_size text,
  printer_type text,
  year_manufactured integer,
  year_acquired integer,
  price bigint,
  condition item_condition NOT NULL DEFAULT 'Baik',
  status item_status NOT NULL DEFAULT 'Aktif',
  last_service_date date,
  image_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read items" ON public.items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert items" ON public.items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update items" ON public.items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete items" ON public.items FOR DELETE TO authenticated USING (true);

-- Create maintenance_records table
CREATE TABLE public.maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  repair_date date,
  action text,
  cost bigint,
  technician text NOT NULL DEFAULT '',
  status maintenance_status NOT NULL DEFAULT 'Antrian',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read maintenance_records" ON public.maintenance_records FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert maintenance_records" ON public.maintenance_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update maintenance_records" ON public.maintenance_records FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete maintenance_records" ON public.maintenance_records FOR DELETE TO authenticated USING (true);