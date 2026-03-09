-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "System can insert user_roles" ON public.user_roles;

-- Add proper admin-only INSERT policy (trigger uses SECURITY DEFINER so bypasses RLS)
CREATE POLICY "Admins can insert user_roles"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));