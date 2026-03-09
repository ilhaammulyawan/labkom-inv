
-- Fix: restrict activity_logs insert to only allow users to log their own actions
DROP POLICY "Authenticated users can insert activity_logs" ON public.activity_logs;
CREATE POLICY "Users can insert own activity_logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
