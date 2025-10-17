-- Add fields for creator and brand data to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS skills text,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS content_style text,
ADD COLUMN IF NOT EXISTS brand_description text;

-- Update the handle_new_user function to store all metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    user_type,
    skills,
    age,
    gender,
    postal_code,
    content_style,
    brand_description
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'user_type',
    new.raw_user_meta_data->>'skills',
    (new.raw_user_meta_data->>'age')::integer,
    new.raw_user_meta_data->>'gender',
    new.raw_user_meta_data->>'postalCode',
    new.raw_user_meta_data->>'contentStyle',
    new.raw_user_meta_data->>'brandDescription'
  );
  RETURN new;
END;
$function$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();