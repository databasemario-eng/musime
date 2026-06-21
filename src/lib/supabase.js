// SQL para crear la tabla en Supabase:
// CREATE TABLE ranking (id serial primary key, nombre text, score int, mode text, fecha timestamp default now());
// ALTER TABLE ranking ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Allow all" ON ranking FOR ALL USING (true) WITH CHECK (true);

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://eqhdtalwpcstmettwrzw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaGR0YWx3cGNzdG1ldHR3cnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTM1NTEsImV4cCI6MjA5NzYyOTU1MX0.0w9YxjmcReMtddNN1gFbSjL5cyiyJ9CW8KxHVNw9gHw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
