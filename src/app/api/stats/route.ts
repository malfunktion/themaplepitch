// src/app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const revalidate = 60;

export async function GET() {
  try {
    const [playersRes, teamsRes] = await Promise.all([
      supabase.from('players').select('*'),
      supabase.from('teams').select('*'),
    ]);

    if (playersRes.error) {
      console.error('/api/stats players query error:', playersRes.error);
    }
    if (teamsRes.error) {
      console.error('/api/stats teams query error:', teamsRes.error);
    }

    return NextResponse.json(
      {
        players: playersRes.data ?? [],
        teams: teamsRes.data ?? [],
        meta: {
          status: 'live',
          playersCount: playersRes.data?.length ?? 0,
          teamsCount: teamsRes.data?.length ?? 0,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (err: any) {
    console.error('/api/stats route exception:', err);
    return NextResponse.json(
      { players: [], teams: [], error: err.message },
      { status: 500 }
    );
  }
}
