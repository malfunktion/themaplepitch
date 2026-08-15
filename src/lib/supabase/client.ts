import { createClient } from "@supabase/supabase-js";

// Guards against a confusing runtime error if .env.local hasn't been
// filled in yet — better to fail loudly at startup than silently
// later when a query mysteriously returns nothing.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing — copy .env.example to .env.local " +
      "and fill in your project URL and anon key. Data calls will fail " +
      "until then; the site will still render with mock data."
  );
}

export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? ""
);