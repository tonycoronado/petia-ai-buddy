
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_name TEXT NOT NULL DEFAULT 'Max',
  scan_type TEXT NOT NULL DEFAULT 'Health Check',
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on scan_history"
  ON public.scan_history FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access on scan_history"
  ON public.scan_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
