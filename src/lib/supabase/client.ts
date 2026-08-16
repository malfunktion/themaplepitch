import { createClient } from "@supabase/supabase-js";

// Falls back to a syntactically-valid placeholder URL when env vars are
// missing, rather than an empty string — @supabase/supabase-js throws
// synchronously at construction time ("supabaseUrl is required") if given
// an empty string, which breaks Next's build-time page-data collection
// for every page that imports this client, even ones that never actually
// run a query. A placeholder host lets construction succeed; any real
// query against it fails at call time instead, which every consumer here
// already handles via normal { data, error } checks.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase env vars are missing — copy .env.example to .env.local " +
      "and fill in your project URL and anon key. Data calls will fail " +
      "gracefully until then; the site will still render with mock/fallback data."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);