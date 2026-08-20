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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* Archived Season Snapshot Banner */}
          <div className="border border-border p-5 bg-card">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">
              {activeSeason} Campaign Snapshot
            </div>
            {standing ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="border border-border/60 p-3 bg-neutral-900/5">
                  <div className="text-neutral-400 text-[9px]">FINAL POSITION</div>
                  <div className="text-base font-bold mt-1 text-charcoal dark:text-white">
                    #{standing.position || '—'}
                  </div>
                </div>
                <div className="border border-border/60 p-3 bg-neutral-900/5">
                  <div className="text-neutral-400 text-[9px]">POINTS</div>
                  <div className="text-base font-bold mt-1 text-crimson">
                    {standing.points ?? '—'} PTS
                  </div>
                </div>
                <div className="border border-border/60 p-3 bg-neutral-900/5">
                  <div className="text-neutral-400 text-[9px]">RECORD (W-D-L)</div>
                  <div className="text-xs font-bold mt-1 text-charcoal dark:text-white">
                    {standing.wins}-{standing.draws}-{standing.losses}
                  </div>
                </div>
                <div className="border border-border/60 p-3 bg-neutral-900/5">
                  <div className="text-neutral-400 text-[9px]">GOAL DIFF</div>
                  <div className="text-xs font-bold mt-1 text-charcoal dark:text-white">
                    {standing.goals_for} GF / {standing.goals_against} GA ({standing.goals_for - standing.goals_against >= 0 ? '+' : ''}{standing.goals_for - standing.goals_against})
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-charcoal-soft font-mono">
                No archived league table snapshot recorded for the {activeSeason} campaign.
              </div>
            )}
          </div>

          {/* Archived Top Scorers / Season Stats */}
          <div className="border border-border p-5 bg-card">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">
              {activeSeason} Top Goalscorers &amp; Playmakers
            </div>
            {topScorers.length > 0 ? (
              <div className="divide-y divide-border text-xs">
                {topScorers.map((stat: any, idx: number) => {
                  const p = Array.isArray(stat.player) ? stat.player[0] : stat.player;
                  const playerRoute = p?.slug || p?.external_id || p?.id;
                  return (
                    <div key={idx} className="py-2.5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-neutral-400 text-[10px]">#{idx + 1}</span>
                        <Link href={`/players/${playerRoute}`} className="font-bold hover:text-crimson">
                          {p?.name || 'Unknown Player'}
                        </Link>
                        <span className="font-mono uppercase text-[10px] text-charcoal-soft">
                          ({p?.position || 'POS'})
                        </span>
                      </div>
                      <div className="font-mono text-xs">
                        <span className="text-crimson font-bold">{stat.goals} GOALS</span> • {stat.assists} AST • {stat.matches_played} APPS
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-charcoal-soft font-mono">
                Detailed player stats matrix not yet indexed for {activeSeason}.
              </div>
            )}
          </div>

          {/* Active Roster */}
          <div className="border border-border p-5 bg-card">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">
              Squad Roster ({players.length})
            </div>
            {players.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {players.map((p: any) => {
                  const playerRouteParam = p.slug || p.external_id || p.id;
                  return (
                    <Link
                      key={p.id}
                      href={`/players/${playerRouteParam}`}
                      className="border border-border/60 p-3 flex justify-between items-center hover:border-crimson transition-colors text-xs"
                    >
                      <span className="font-bold">{p.name}</span>
                      <span className="font-mono text-charcoal-soft uppercase">
                        {p.position || 'CM'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-charcoal-soft font-mono">No active roster loaded in vault.</div>
            )}
          </div>

          {/* Fixtures & Results */}
          <div className="border border-border p-5 bg-card">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">
              Fixtures &amp; Match Log
            </div>
            {matches.length > 0 ? (
              <div className="divide-y divide-border text-xs">
                {matches.map((m: any) => {
                  const homeTeam = Array.isArray(m.home_team) ? m.home_team[0] : m.home_team;
                  const awayTeam = Array.isArray(m.away_team) ? m.away_team[0] : m.away_team;
                  return (
                    <div key={m.id} className="py-2.5 flex justify-between items-center font-mono">
                      <span className="text-neutral-400 text-[11px]">{safeFormatDate(m.match_date)}</span>
                      <span className="font-bold">
                        {homeTeam?.name || 'Home'} vs {awayTeam?.name || 'Away'}
                      </span>
                      <span className="uppercase text-crimson text-[10px]">
                        {m.stage || 'Match'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-charcoal-soft font-mono">No fixtures recorded for this club.</div>
            )}
          </div>
        </section>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="border border-border bg-card p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">Club Information</div>
            <div className="mt-4 space-y-3 text-xs text-charcoal-soft font-mono">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span>League</span>
                <span className="uppercase text-charcoal">{team.league || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span>Database Slug</span>
                <span className="text-charcoal">{team.slug}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span>Active Season Filter</span>
                <span className="text-crimson font-bold">{activeSeason}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6">
        <SourceStamp source={{ name: 'The Maple Pitch Historical Club Vault', accessedAt: new Date().toISOString() }} />
      </div>
    </>
  );
}
