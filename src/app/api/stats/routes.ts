import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';

// src/app/stats/page.tsx fetches this route client-side (via fetch, not a
// direct Supabase call) specifically so the query runs where it's cheap
// to retry/cache, and so the anon key isn't the only thing standing
// between the browser and the database. This route was referenced by
// that page already — it just never existed, which is the actual reason
// "SYNCED PLAYERS: 0" always showed regardless of what was in the table.
export const revalidate = 60;

export async function GET(request: Request) {
  if (!(await checkRateLimit(request))) return rateLimitResponse();

  const [playersRes, teamsRes] = await Promise.all([
    supabase.from('players').select('*'),
    supabase.from('teams').select('*'),
  ]);

  if (playersRes.error) {
    console.error('/api/stats players query failed:', playersRes.error);
  }
  if (teamsRes.error) {
    console.error('/api/stats teams query failed:', teamsRes.error);
  }

  return NextResponse.json(
    {
      players: playersRes.data ?? [],
      teams: teamsRes.data ?? [],
      meta: {
        status: 'live',
        playersError: playersRes.error?.message ?? null,
        teamsError: teamsRes.error?.message ?? null,
      },
    },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
  );
}
