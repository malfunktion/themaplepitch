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
  const { data: players } = await supabase.from('players').select('id, external_id, slug');
  const params: { slug: string }[] = [];

  (players || []).forEach((p) => {
    if (p.slug) params.push({ slug: String(p.slug) });
    if (p.external_id && p.external_id !== p.slug) params.push({ slug: String(p.external_id) });
    if (p.id) params.push({ slug: String(p.id) });
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

async function getPlayerData(slugParam: string) {
  const isNumeric = !isNaN(Number(slugParam));
  const flexQuery = isNumeric
    ? `id.eq.${slugParam},slug.eq.${slugParam},external_id.eq.${slugParam}`
    : `slug.eq.${slugParam},external_id.eq.${slugParam}`;

  const { data: player } = await supabase
    .from('players')
    .select(`
      *,
      current_team:teams!current_team_id (
        id,
        name,
        slug,
        logo_url
      )
    `)
    .or(flexQuery)
    .maybeSingle();

  if (!player) return null;

  let clubMatches: any[] = [];
  if (player.current_team_id) {
    const { data: matches } = await supabase
      .from('matches')
      .select(`
        id,
        match_date,
        stage,
        home_team:teams!home_team_id(name, slug),
        away_team:teams!away_team_id(name, slug)
      `)
      .or(`home_team_id.eq.${player.current_team_id},away_team_id.eq.${player.current_team_id}`)
      .limit(6);

    clubMatches = matches || [];
  }

  return { player, clubMatches };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPlayerData(slug);

  if (!data?.player) {
    return { title: 'Player Not Found' };
  }

  const { player } = data;
  const rawTeam = player.current_team as any;
  const clubName = Array.isArray(rawTeam)
    ? rawTeam[0]?.name
    : rawTeam?.name || player.league || 'Free Agent';
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
  const resolvedSearchParams = await searchParams;
  const data = await getPlayerData(slug);

  if (!data?.player) notFound();

  const { player, clubMatches } = data;
  const club = Array.isArray(player.current_team) ? (player.current_team as any)[0] : (player.current_team as any);
  const clubName = club?.name || (player.league ? `${player.league} League` : 'Unattached');

  // Determine Active Dossier View based on context parameter (?tab=national)
  const rawTab = (resolvedSearchParams?.tab || '').toLowerCase();
  const activeTab = rawTab.includes('nation') || rawTab.includes('can') ? 'national' : 'club';

  const isWomen = player.gender?.toLowerCase() === 'women';
  const nationalTag = isWomen ? 'CANWNT' : 'CANMNT';

  const playerSlug = player.slug || player.external_id || player.id;

  // Club Stat Tiles
  const clubStatTiles: [string, string | number][] = [
    ['RATING', player.rating ? Number(player.rating).toFixed(1) : '—'],
    ['GOALS', player.goals ?? 0],
    ['ASSISTS', player.assists ?? 0],
    ['POSITION', player.position || '—'],
    ['GENDER', player.gender ? player.gender.toUpperCase() : '—'],
    ['NATIONALITY', player.nationality || 'CAN'],
  ];

  // International Stat Tiles
  const internationalStatTiles: [string, string | number][] = [
    ['INTL CAPS', player.caps ?? 0],
    ['INTL GOALS', player.intl_goals ?? player.goals ?? 0],
    ['SQUAD STATUS', player.squad_type || 'SENIOR'],
    ['POSITION', player.position || '—'],
    ['PATHWAY', player.excel_pathway || 'Youth EXCEL to Senior'],
    ['PROGRAM', nationalTag],
  ];

  return (
    <>
      <HubHeader
        eyebrow={`Player dossier // ${activeTab === 'national' ? `${nationalTag} International Program` : clubName}`}
        title={(player.name || 'Player').toUpperCase()}
        description={`${player.position || 'Player'} · ${player.nationality || 'Canada'} · ${
          activeTab === 'national' ? `Active ${nationalTag} Representative` : `Playing in ${player.league || 'Domestic'}`
        }. Live profile powered by Supabase telemetry.`}
      />

      {/* CONTEXT SWITCHER TOGGLE BAR */}
      <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
        <Link
          href={`/players/${playerSlug}?tab=club`}
          scroll={false}
          className={`px-4 py-2 font-mono text-xs uppercase font-bold border transition-colors ${
            activeTab === 'club'
              ? 'bg-crimson text-white border-crimson shadow-sm'
              : 'bg-card text-neutral-400 border-border hover:text-white hover:border-neutral-500'
          }`}
        >
          [ CLUB DOSSIER ]
        </Link>
        <Link
          href={`/players/${playerSlug}?tab=national`}
          scroll={false}
          className={`px-4 py-2 font-mono text-xs uppercase font-bold border transition-colors ${
            activeTab === 'national'
              ? 'bg-crimson text-white border-crimson shadow-sm'
              : 'bg-card text-neutral-400 border-border hover:text-white hover:border-neutral-500'
          }`}
        >
          [ INTERNATIONAL DOSSIER // {nationalTag} ]
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          {/* STAT TILES GRID */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(activeTab === 'national' ? internationalStatTiles : clubStatTiles).map(([label, value]) => (
              <div key={label} className="border border-border bg-card p-4">
                <div className="text-[9px] font-mono text-charcoal-soft">{label}</div>
                <div className="mt-2 text-2xl font-black">{value}</div>
              </div>
            ))}
          </div>

          {/* VIEW SPECIFIC CARD: CLUB VS INTERNATIONAL */}
          {activeTab === 'club' ? (
            <div className="border border-border p-5">
              <div className="text-[10px] font-mono uppercase text-crimson">Club &amp; Domestic Pathway</div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {club ? (
                  <Link
                    href={`/teams/${club.slug}`}
                    className="border border-border px-3 py-1.5 font-bold hover:border-crimson hover:text-crimson transition-colors"
                  >
                    {club.name}
                  </Link>
                ) : (
                  <span className="border border-border px-3 py-1.5 font-bold text-charcoal-soft">
                    {clubName}
                  </span>
                )}
                <span className="border border-border/60 px-3 py-1.5 text-charcoal-soft uppercase font-mono">
                  {player.league || 'Domestic'}
                </span>
              </div>
            </div>
          ) : (
            <div className="border border-border p-5 bg-card">
              <div className="text-[10px] font-mono uppercase text-crimson">Canada Soccer // International Pathway</div>
              <div className="mt-3 space-y-3 text-xs">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-charcoal-soft font-mono uppercase">National Team Program:</span>
                  <span className="font-bold text-crimson">{nationalTag} ({player.gender?.toUpperCase() || 'SENIOR'})</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-charcoal-soft font-mono uppercase">Squad Classification:</span>
                  <span className="font-bold">{player.squad_type || 'Senior Core'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-soft font-mono uppercase">EXCEL Pathway Status:</span>
                  <span className="font-bold">{player.excel_pathway || 'Canada Soccer EXCEL Pipeline'}</span>
                </div>
              </div>
            </div>
          )}

          {/* RECENT MATCH FIXTURES */}
          {clubMatches.length > 0 && (
            <div className="border border-border p-5">
              <div className="text-[10px] font-mono uppercase text-crimson">
                {activeTab === 'national' ? 'Recent International / Club Fixtures' : 'Recent Club Fixtures'}
              </div>
              <div className="mt-3 divide-y divide-border">
                {clubMatches.map((m: any) => {
                  const homeTeam = Array.isArray(m.home_team) ? m.home_team[0] : m.home_team;
                  const awayTeam = Array.isArray(m.away_team) ? m.away_team[0] : m.away_team;
                  const homeName = homeTeam?.name;
                  const awayName = awayTeam?.name;
                  return (
                    <Link
                      key={m.id}
                      href={`/matches/${m.id}`}
                      className="flex items-center justify-between py-3 text-xs hover:text-crimson"
                    >
                      <span>{safeFormatDate(m.match_date)}</span>
                      <span>
                        {homeName || 'TBD'} vs {awayName || 'TBD'}
                      </span>
                      <span className="font-mono uppercase text-charcoal-soft">{m.stage || 'Fixture'}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* SIDEBAR METADATA DOSSIER */}
        <aside>
          <div className="border border-border bg-card p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">Entity Status // Telemetry</div>
            <div className="mt-4 space-y-2 text-xs text-charcoal-soft">
              <div className="flex justify-between">
                <span>Database ID</span>
                <span className="font-mono text-charcoal dark:text-neutral-200">{player.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Slug Target</span>
                <span className="font-mono text-charcoal dark:text-neutral-200">{playerSlug}</span>
              </div>
              <div className="flex justify-between">
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
