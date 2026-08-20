// src/app/teams/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data: teams } = await supabase.from('teams').select('id, slug, external_id');
  const params: { slug: string }[] = [];

  (teams || []).forEach((t) => {
    if (t.slug) params.push({ slug: String(t.slug) });
    if (t.external_id && t.external_id !== t.slug) params.push({ slug: String(t.external_id) });
    if (t.id) params.push({ slug: String(t.id) });
  });

  return params;
}

function safeFormatDate(dateVal: any): string {
  if (!dateVal) return 'TBD';
  try {
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return 'TBD';
    return parsed.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'TBD';
  }
}

async function getTeamData(slugParam: string, seasonParam: string) {
  const isNumeric = !isNaN(Number(slugParam));
  
  const flexQuery = isNumeric
    ? `id.eq.${slugParam},slug.eq.${slugParam},external_id.eq.${slugParam}`
    : `slug.eq.${slugParam},external_id.eq.${slugParam},slug.ilike.%${slugParam}%`;

  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .or(flexQuery)
    .maybeSingle();

  if (!team) return null;

  const activeSeason = seasonParam || '2026';

  // Fetch concurrent relational data: players, matches, historical standings, and season stats
  const [playersRes, matchesRes, standingRes, seasonStatsRes] = await Promise.all([
    supabase.from('players').select('*').eq('current_team_id', team.id),
    supabase
      .from('matches')
      .select(`
        id,
        match_date,
        stage,
        home_team:teams!home_team_id(name, slug),
        away_team:teams!away_team_id(name, slug)
      `)
      .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
      .limit(8),
    supabase
      .from('team_season_standings')
      .select('*')
      .eq('team_id', team.id)
      .eq('season', activeSeason)
      .maybeSingle(),
    supabase
      .from('player_season_stats')
      .select(`
        goals,
        assists,
        matches_played,
        rating,
        player:players(id, name, slug, external_id, position)
      `)
      .eq('team_id', team.id)
      .eq('season', activeSeason)
      .order('goals', { ascending: false })
      .limit(5),
  ]);

  return {
    team,
    activeSeason,
    standing: standingRes.data || null,
    topScorers: seasonStatsRes.data || [],
    players: playersRes.data || [],
    matches: matchesRes.data || [],
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ season?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { season } = await searchParams;
  const data = await getTeamData(slug, season || '2026');

  if (!data?.team) {
    return { title: 'Team Not Found' };
  }

  const { team, activeSeason } = data;
  const title = `${team.name || 'Team'} (${activeSeason}) | The Maple Pitch`;
  const description = `${team.name || 'Club'} historical archive, ${activeSeason} campaign stats, roster, and fixtures on The Maple Pitch.`;

  return {
    title,
    description,
    alternates: { canonical: `/teams/${team.slug || team.external_id || team.id}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/teams/${team.slug || team.external_id || team.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function TeamProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ season?: string }>;
}) {
  const { slug } = await params;
  const { season } = await searchParams;
  const data = await getTeamData(slug, season || '2026');

  if (!data?.team) notFound();

  const { team, activeSeason, standing, topScorers, players, matches } = data;
  const availableSeasons = ['2026', '2025', '2024'];

  return (
    <>
      <HubHeader
        eyebrow={`Club Archive // ${team.league || 'Canada'} // ${activeSeason} Season`}
        title={(team.name || 'Team').toUpperCase()}
        description={`Official club dossier, historical standings, and multi-season player metrics for ${team.name || 'Club'}.`}
      />

      {/* Historical Season Selector Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border border-border bg-card p-3">
        <span className="text-[10px] font-mono uppercase text-charcoal-soft mr-2">
          SEASON SELECTOR:
        </span>
        {availableSeasons.map((s) => {
          const isSelected = activeSeason === s;
          return (
            <Link
              key={s}
              href={`/teams/${team.slug || team.id}?season=${s}`}
              className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors border rounded-sm ${
                isSelected
                  ? 'bg-crimson text-white border-crimson'
                  : 'bg-transparent text-charcoal-soft border-border hover:text-charcoal hover:border-charcoal'
              }`}
            >
              [ {s} {s === '2026' ? '(Active)' : ''} ]
            </Link>
          );
        })}
      </div>

      
