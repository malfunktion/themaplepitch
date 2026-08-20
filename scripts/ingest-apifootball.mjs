import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function slugify(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// 1. DEFINE THIS FIRST (Before any loops use it)
const VERIFIED_CANADIAN_API_TEAMS = [
  // CPL Clubs (API-Football IDs)
  { id: 15121, name: 'Forge FC', league: 'CPL' },
  { id: 15122, name: 'Cavalry FC', league: 'CPL' },
  { id: 15123, name: 'Atlético Ottawa', league: 'CPL' },
  { id: 15124, name: 'Pacific FC', league: 'CPL' },
  { id: 15125, name: 'York United FC', league: 'CPL' },
  { id: 15126, name: 'Valour FC', league: 'CPL' },
  { id: 15127, name: 'HFX Wanderers FC', league: 'CPL' },
  { id: 15128, name: 'Vancouver FC', league: 'CPL' },
  // Canadian MLS Clubs
  { id: 1603, name: 'Toronto FC', league: 'MLS' },
  { id: 1614, name: 'CF Montréal', league: 'MLS' },
  { id: 1601, name: 'Vancouver Whitecaps FC', league: 'MLS' }
];

async function runIngestion() {
  console.log('🚀 Starting Scope-Locked API-Football & Squad Ingestion...');

  // 2. NOW THE LOOP WILL FIND IT
  for (const team of VERIFIED_CANADIAN_API_TEAMS) {
    // Your fetch, database check, and upsert logic goes here...
  }
}

runIngestion().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
