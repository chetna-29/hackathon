import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://zshmawywlkaftmtnqskp.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_eGdSE0C-udH9s0ZrQW0acA_s15d1X_P";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
