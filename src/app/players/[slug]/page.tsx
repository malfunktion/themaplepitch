// src/app/players/[slug]/page.tsx
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

export const revalidate = 300;

export async function generateStaticParams() {
  const { data: players } = await supabase.from('players').select('id, slug, external_id');
  const params: { slug: string }[] = [];

  (players || []).forEach((p) => {
    if (p.slug) params.push({ slug: String(p.slug) });
    if (p.external_id && p.external_id !== p.slug) params.push({ slug: String(p.external_id) });
    if (p.id) params.push({ slug: String(p.id) });
  });

  return params;
}

async function getPlayerData(slugParam: string) {
  const isNumeric = !isNaN(Number(slugParam));
  
  const flexQuery = isNumeric
    ? `id.eq.${slugParam},slug.eq.${slugParam},external_id.eq.${slugParam}`
    : `slug.eq.${slugParam},external_id.eq.${slugParam},slug.ilike.%${slugParam}%`;

  const { data: player } = await supabase
    .from('players')
    .select(`
      *,
      current_team:teams!current_team_id(id, name, slug, league, logo_url)
    `)
    .or(flexQuery)
    .maybeSingle();

  if (!player) return null;

  // Resolve image URL fallback safely from root columns or JSON metadata
  const resolvedHeadshot = 
    player.headshot_url || 
    player.avatar_url || 
    (player.metadata && typeof player.metadata === 'object' ? (player.metadata as any).photo || (player.metadata as any).avatar : null);

  // Fetch season stats, match logs, and tagged media/news
  const [seasonStatsRes, clubMatchesRes, mediaRes] = await Promise.all([
    supabase
      .from('player_season_stats')
      .select('season, competition, matches_played, goals, assists, minutes, rating, team:teams(name, slug, logo_url)')
      .eq('player_id', player.id)
      .order('season', { ascending: false }),
    player.current_team_id
      ? supabase
          .from('matches')
          .select(`
            id,
            match_date,
            home_score,
            away_score,
            home_team:teams!home_team_id(name, slug),
            away_team:teams!away_team_id(name, slug)
          `)
          .or(`home_team_id.eq.${player.current_team_id},away_team_id.eq.${player.current_team_id}`)
          .limit(6)
      : Promise.resolve({ data: [] }),
    supabase
      .from('media')
      .select('id, title, youtube_id, category, created_at')
      .or(`player_id.eq.${player.id},tags.cs.{${player.slug || player.name}}`)
      .limit(3)
  ]);

  return {
    player: { ...player, headshot_url: resolvedHeadshot },
    seasonStats: seasonStatsRes.data || [],
    clubMatches: clubMatchesRes.data || [],
    mediaClips: mediaRes.data || [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPlayerData(slug);

  if (!data?.player) {
    return { title: 'Player Not Found | The Maple Pitch' };
  }

  const { player } = data;
  const rawTeam = player.current_team as any;
  const clubName = Array.isArray(rawTeam) ? rawTeam[0]?.name : rawTeam?.name || player.league || 'Free Agent';
  const title = `${player.name || 'Player'} | The Maple Pitch`;
  const description = `${player.name || 'Player'} — ${player.position || 'Player'} (${clubName}). Nationality: ${player.nationality || 'Canada'}. Stats and dossier on The Maple Pitch.`;

  return {
    title,
    description,
    alternates: { canonical: `/players/${player.slug || player.external_id || player.id}` },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: `/players/${player.slug || player.external_id || player.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PlayerProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const data = await getPlayerData(slug);

  if (!data?.player) notFound();

  const { player, seasonStats, clubMatches, mediaClips } = data;
  const activeTab = tab === 'national' ? 'national' : 'club';

  const club = Array.isArray(player.current_team) ? (player.current_team as any)[0] : (player.current_team as any);
  const clubName = club?.name || (player.league ? `${player.league} League` : 'Unattached');
  const playerSlug = player.slug || player.external_id || player.id;
  const isWomen = player.gender?.toLowerCase() === 'women';
  const nationalTag = isWomen ? 'CANWNT' : 'CANMNT';

  const clubStatTiles: [string, string | number][] = [
    ['RATING', player.rating ? Number(player.rating).toFixed(1) : '—'],
    ['GOALS', player.goals ?? 0],
    ['ASSISTS', player.assists ?? 0],
    ['POSITION', player.position || '—'],
    ['GENDER', player.gender ? player.gender.toUpperCase() : '—'],
    ['NATIONALITY', player.nationality || 'CAN'],
  ];

  const internationalStatTiles: [string, string | number][] = [
    ['INTL CAPS', player.caps ?? 0],
    ['INTL GOALS', player.intl_goals ?? player.goals ?? 0],
    ['SQUAD STATUS', player.squad_type || 'SENIOR'],
    ['POSITION', player.position || '—'],
    ['PATHWAY', player.excel_pathway || 'Youth EXCEL to Senior'],
    ['PROGRAM', nationalTag],
  ];

  const activeTiles = activeTab === 'national' ? internationalStatTiles : clubStatTiles;

  return (
    <>
      {/* HEADER WITH SUPABASE STORAGE HEADSHOT & CLUB LOGO */}
      <div className="border border-border bg-card p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-28 h-28 rounded-full border-2 border-crimson overflow-hidden bg-neutral-900 flex items-center justify-center shrink-0">
          {player.headshot_url ? (
            <img
              src={player.headshot_url}
              alt={player.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-mono text-2xl text-neutral-400 font-bold">
              {player.name ? player.name.split(' ').map((n: string) => n[0]).join('') : 'MP'}
            </span>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="text-xs font-mono text-crimson font-bold uppercase tracking-wider">
            Player Dossier // {activeTab === 'national' ? `${nationalTag} Program` : clubName}
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-mono tracking-tight text-charcoal dark:text-white uppercase">
            {player.name}
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            {player.position || 'Player'} • {player.nationality || 'Canada'} • {activeTab === 'national' ? `Active ${nationalTag} Representative` : `Playing in ${player.league || 'Domestic'}`}
          </p>
        </div>

        {club?.logo_url && (
          <div className="hidden md:block w-16 h-16 shrink-0">
            <img src={club.logo_url} alt={clubName} className="w-full h-full object-contain" />
          </div>
        )}
      </div>

      {/* CONTEXT SWITCHER TOGGLE BAR */}
      <div className="mb-6 flex items-center gap-2 border border-border bg-card p-2">
        <Link
          href={`/players/${playerSlug}`}
          className={`flex-1 px-4 py-2 text-xs font-mono font-bold uppercase text-center transition-colors border rounded-sm ${
            activeTab === 'club'
              ? 'bg-crimson text-white border-crimson'
              : 'bg-transparent text-charcoal-soft border-border hover:text-charcoal'
          }`}
        >
          [ CLUB &amp; DOMESTIC CAREER ]
        </Link>
        <Link
          href={`/players/${playerSlug}?tab=national`}
          className={`flex-1 px-4 py-2 text-xs font-mono font-bold uppercase text-center transition-colors border rounded-sm ${
            activeTab === 'national'
              ? 'bg-crimson text-white border-crimson'
              : 'bg-transparent text-charcoal-soft border-border hover:text-charcoal'
          }`}
        >
          [ {nationalTag} INTERNATIONAL PROGRAM ]
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* Quick Stat Tiles Matrix */}
          <div className="border border-border p-5 bg-card">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">
              {activeTab === 'national' ? `${nationalTag} Program Metrics` : 'Current Season Performance'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activeTiles.map(([label, val], idx) => (
                <div key={idx} className="border border-border/60 p-3 bg-neutral-900/5">
                  <div className="text-neutral-400 text-[9px] font-mono">{label}</div>
                  <div className="text-base font-bold mt-1 font-mono text-charcoal dark:text-white">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Season Career Breakdown Table */}
          <div className="border border-border p-5 bg-card overflow-x-auto">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">
              Multi-Season Career Archive
            </div>
            {seasonStats.length > 0 ? (
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border text-neutral-400 text-[10px]">
                    <th className="pb-2">SEASON</th>
                    <th className="pb-2">CLUB / PROG</th>
                    <th className="pb-2">COMP</th>
                    <th className="pb-2 text-right">APPS</th>
                    <th className="pb-2 text-right">MINS</th>
                    <th className="pb-2 text-right">GLS</th>
                    <th className="pb-2 text-right">AST</th>
                    <th className="pb-2 text-right">RTG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {seasonStats.map((s: any, idx: number) => {
                    const teamObj = Array.isArray(s.team) ? s.team[0] : s.team;
                    return (
                      <tr key={idx} className="hover:bg-neutral-900/5">
                        <td className="py-2.5 font-bold text-crimson">{s.season}</td>
                        <td className="py-2.5">{teamObj?.name || clubName}</td>
                        <td className="py-2.5 uppercase text-[10px] text-neutral-400">{s.competition || 'CPL'}</td>
                        <td className="py-2.5 text-right">{s.matches_played ?? 0}</td>
                        <td className="py-2.5 text-right">{s.minutes ?? 0}</td>
                        <td className="py-2.5 text-right font-bold text-crimson">{s.goals ?? 0}</td>
                        <td className="py-2.5 text-right">{s.assists ?? 0}</td>
                        <td className="py-2.5 text-right">{s.rating ? Number(s.rating).toFixed(1) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-xs text-charcoal-soft font-mono">
                No granular multi-season stats indexed for this player yet.
              </div>
            )}
          </div>

          {/* MEDIA VAULT / VIDEO HIGHLIGHTS */}
          <div className="border border-border p-5 bg-card">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">
              Player Media Vault &amp; Match Highlights
            </div>
            {mediaClips.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {mediaClips.map((clip: any) => (
                  <div key={clip.id} className="border border-border/80 p-2 bg-neutral-900/40">
                    <div className="aspect-video w-full bg-black">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${clip.youtube_id}`}
                        title={clip.title}
                        allowFullScreen
                      />
                    </div>
                    <div className="text-xs font-mono font-bold mt-2 truncate">{clip.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-charcoal-soft font-mono">No video highlights uploaded for this player yet.</div>
            )}
          </div>

          {/* Recent Club Matches / Fixtures */}
          <div className="border border-border p-5 bg-card">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">
              Recent Club Match Log
            </div>
            {clubMatches.length > 0 ? (
              <div className="divide-y divide-border text-xs font-mono">
                {clubMatches.map((m: any) => {
                  const hTeam = Array.isArray(m.home_team) ? m.home_team[0] : m.home_team;
                  const aTeam = Array.isArray(m.away_team) ? m.away_team[0] : m.away_team;
                  return (
                    <div key={m.id} className="py-2.5 flex justify-between items-center">
                      <span className="text-neutral-400 text-[10px]">{m.match_date ? new Date(m.match_date).toLocaleDateString() : 'TBD'}</span>
                      <span className="font-bold">{hTeam?.name || 'Home'} vs {aTeam?.name || 'Away'}</span>
                      <span className="text-crimson font-bold">{m.home_score ?? 0} - {m.away_score ?? 0}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-charcoal-soft font-mono">No recent match logs recorded.</div>
            )}
          </div>
        </section>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="border border-border bg-card p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">Player Profile Vitals</div>
            <div className="mt-4 space-y-3 text-xs text-charcoal-soft font-mono">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span>Full Name</span>
                <span className="font-mono text-charcoal dark:text-neutral-200">{player.name}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span>Database ID</span>
                <span className="font-mono text-charcoal dark:text-neutral-200">{player.id}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span>Slug Target</span>
                <span className="font-mono text-charcoal dark:text-neutral-200">{playerSlug}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span>Primary Position</span>
                <span className="font-mono uppercase text-charcoal dark:text-neutral-200">{player.position || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Context</span>
                <span className="font-mono uppercase text-crimson font-bold">{activeTab}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6">
        <SourceStamp source={{ name: 'The Maple Pitch Unified Player Vault', accessedAt: new Date().toISOString() }} />
      </div>
    </>
  );
}
