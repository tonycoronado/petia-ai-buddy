
CREATE TABLE public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age_range TEXT NOT NULL DEFAULT 'adult',
  weight_range TEXT NOT NULL DEFAULT 'medium',
  img TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own pets"
  ON public.pets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pets"
  ON public.pets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets"
  ON public.pets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets"
  ON public.pets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
