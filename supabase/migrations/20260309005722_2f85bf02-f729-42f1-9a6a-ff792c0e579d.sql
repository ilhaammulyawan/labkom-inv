-- 1. Buat trigger untuk auto-assign role 'user' saat signup
CREATE OR REPLACE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 2. Assign role 'admin' ke ilham.mulyawan@gmail.com (b92f6dfa-8c45-43bb-bf4d-1a029a8b6724)
INSERT INTO public.user_roles (user_id, role)
VALUES ('b92f6dfa-8c45-43bb-bf4d-1a029a8b6724', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Assign role 'user' ke ilhaammulyawan@gmail.com (e335ddb4-a3c3-4b58-a9d1-76824ff21dc1) jika belum ada
INSERT INTO public.user_roles (user_id, role)
VALUES ('e335ddb4-a3c3-4b58-a9d1-76824ff21dc1', 'user')
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Tambahkan INSERT policy agar trigger bisa insert ke user_roles
CREATE POLICY "System can insert user_roles"
ON public.user_roles
FOR INSERT
WITH CHECK (true);