-- Create profiles table to store user information
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email text,
  user_type text CHECK (user_type IN ('creator', 'brand')),
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create collaboration_posts table
CREATE TABLE public.collaboration_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  brand_name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  compensation text NOT NULL,
  target_audience text NOT NULL,
  target_age_range text NOT NULL,
  target_gender text NOT NULL,
  campaign_brief text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collaboration_posts ENABLE ROW LEVEL SECURITY;

-- Collaboration posts policies
CREATE POLICY "Anyone can view collaboration posts"
  ON public.collaboration_posts FOR SELECT
  USING (true);

CREATE POLICY "Brands can create their own posts"
  ON public.collaboration_posts FOR INSERT
  WITH CHECK (auth.uid() = brand_user_id);

CREATE POLICY "Brands can update their own posts"
  ON public.collaboration_posts FOR UPDATE
  USING (auth.uid() = brand_user_id);

CREATE POLICY "Brands can delete their own posts"
  ON public.collaboration_posts FOR DELETE
  USING (auth.uid() = brand_user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.collaboration_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'user_type'
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();