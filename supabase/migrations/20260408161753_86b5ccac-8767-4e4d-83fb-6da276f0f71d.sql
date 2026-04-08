
-- 1. Backfill: give author role to anyone who has book_submissions but no author role
INSERT INTO public.user_roles (user_id, role)
SELECT DISTINCT bs.author_id, 'author'::app_role
FROM public.book_submissions bs
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = bs.author_id AND ur.role = 'author'
)
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Fix notifications: allow users to insert their own notifications (for purchase confirmations etc.)
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;

CREATE POLICY "Users can insert their own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Tighten book_submissions insert: require author role
DROP POLICY IF EXISTS "Authors can create submissions" ON public.book_submissions;

CREATE POLICY "Authors with role can create submissions"
ON public.book_submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id AND public.has_role(auth.uid(), 'author'::app_role));
