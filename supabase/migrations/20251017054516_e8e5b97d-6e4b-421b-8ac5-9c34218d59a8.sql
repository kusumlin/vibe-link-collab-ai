-- Create applications table to track creator interests in brand posts
CREATE TABLE public.applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES public.collaboration_posts(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text DEFAULT 'pending',
  UNIQUE(creator_id, post_id)
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Brands can view applications for their own posts
CREATE POLICY "Brands can view applications for their posts"
ON public.applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.collaboration_posts
    WHERE collaboration_posts.id = applications.post_id
    AND collaboration_posts.brand_user_id = auth.uid()
  )
);

-- Creators can view their own applications
CREATE POLICY "Creators can view their own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = creator_id);

-- Creators can create applications
CREATE POLICY "Creators can create applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- Add index for better performance
CREATE INDEX idx_applications_post_id ON public.applications(post_id);
CREATE INDEX idx_applications_creator_id ON public.applications(creator_id);