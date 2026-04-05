
-- Create stock opname sessions table
CREATE TABLE public.stock_opname_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'Draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock opname items table
CREATE TABLE public.stock_opname_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.stock_opname_sessions(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  is_found BOOLEAN DEFAULT NULL,
  actual_condition TEXT DEFAULT NULL,
  notes TEXT DEFAULT '',
  checked_by UUID REFERENCES auth.users(id),
  checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, item_id)
);

-- Enable RLS
ALTER TABLE public.stock_opname_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_opname_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for sessions
CREATE POLICY "Anyone can read stock_opname_sessions" ON public.stock_opname_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert stock_opname_sessions" ON public.stock_opname_sessions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update stock_opname_sessions" ON public.stock_opname_sessions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete stock_opname_sessions" ON public.stock_opname_sessions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for items
CREATE POLICY "Anyone can read stock_opname_items" ON public.stock_opname_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert stock_opname_items" ON public.stock_opname_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update stock_opname_items" ON public.stock_opname_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete stock_opname_items" ON public.stock_opname_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
