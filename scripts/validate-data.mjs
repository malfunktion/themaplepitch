// scripts/validate-data.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

console.log('🔍 Running Data Integrity & Vault Validation Test...');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function validate() {
  try {
    const { count, error } = await supabase.from('teams').select('*', { count: 'exact', head: true });

    if (error) {
      // A real connectivity/auth failure here means the anon key or URL
      // this ran with is wrong — that's exactly the class of bug (see
      // wrangler.toml) that silently breaks every page at once. Failing
      // the build on it is the point; swallowing it here just moves the
      // same failure to production, where it's much harder to see.
      console.error('❌ Supabase connectivity check failed:', error.message);
      process.exit(1);
    }

    console.log(`✅ Database connectivity confirmed. Teams table record count: ${count ?? 0}`);
    console.log('✨ Data Validation Test Passed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Data validation script error:', err.message);
    process.exit(1);
  }
}

validate();
