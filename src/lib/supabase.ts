import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseUrl = "https://zjdtrrvxnkcydtzizayq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZHRycnZ4bmtjeWR0eml6YXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NTI4NDUsImV4cCI6MjA1MTAyODg0NX0.DPJ7XM3kOhv7tIzYPuIVm8Ky1-wBQpHv1QHOlqK9xCw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);