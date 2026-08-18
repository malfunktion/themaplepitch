import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const revalidate = 3600; // Cache page for 1 hour

export async function generateStaticParams() {
  const { data: players } = await supabase.from('players').select('external_id');
  return (players || [])
    .filter((p) => p.external_id)
    .map((p) => ({ slug: p.external_id }));
}

async function getPlayerData(slug: string) {
  // 1. Fetch player by external_id (slug)
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
    .eq('external_id', slug)
    .single();

  if (!player) return null;

  // 2. Fetch matches for player's club if assigned
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
      .order('match_date', { ascending: false })
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
  const clubName = player.current_team?.name || player.league || 'Free Agent';
  const title = `${player.name} | The Maple Pitch`;
  const description = `${player.name} — ${player.position || 'Player'} (${clubName}). Nationality: ${player.nationality || 'Canada'}. Stats and dossier on The Maple Pitch.`;

  return {
    title,
    description,
    alternates: { canonical: `/players/${player.external_id}` },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: `/players/${player.external_id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PlayerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPlayerData(slug);

  if (!data?.player) notFound();

  const { player, clubMatches } = data;
  const club = player.current_team;
  const clubName = club?.name || (player.league ? `${player.league} League` : 'Unattached');

  const statTiles: [string, string | number][] = [
    ['RATING', player.rating ? Number(player.rating).toFixed(1) : '—'],
    ['GOALS', player.goals ?? 0],
    ['ASSISTS', player.assists ?? 0],
    ['POSITION', player.position || '—'],
    ['GENDER', player.gender ? player.gender.toUpperCase() : '—'],
    ['NATIONALITY', player.nationality || 'CAN'],
  ];

  return (
    <>
      <HubHeader
        eyebrow={`Player dossier // ${clubName}`}
        title={player.name.toUpperCase()}
        description={`${player.position || 'Player'} · ${player.nationality || 'Canada'} · Playing in ${player.league || 'Domestic'}. Live profile powered by Supabase telemetry.`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {statTiles.map(([label, value]) => (
              <div key={label} className="border border-border bg-card p-4">
                <div className="text-[9px] font-mono text-charcoal-soft">{label}</div>
                <div className="mt-2 text-2xl font-black">{value}</div>
              </div>
            ))}
          </div>

          <div className="border border-border p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">Club &amp; Pathway</div>
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
                {player.league}
              </span>
            </div>
          </div>

          {clubMatches.length > 0 && (
            <div className="border border-border p-5">
              <div className="text-[10px] font-mono uppercase text-crimson">Recent Fixtures</div>
              <div className="mt-3 divide-y divide-border">
                {clubMatches.map((m) => (
                  <Link
                    key={m.id}
                    href={`/matches/${m.id}`}
                    className="flex items-center justify-between py-3 text-xs hover:text-crimson"
                  >
                    <span>{new Date(m.match_date).toLocaleDateString()}</span>
                    <span>
                      {m.home_team?.name || 'TBD'} vs {m.away_team?.name || 'TBD'}
                    </span>
                    <span className="font-mono uppercase text-charcoal-soft">{m.stage || 'Fixture'}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside>
          <div className="border border-border bg-card p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">Entity Status</div>
            <div className="mt-4 space-y-2 text-xs text-charcoal-soft">
              <div className="flex justify-between">
                <span>Database ID</span>
                <span className="font-mono text-charcoal">{player.id}</span>
              </div>
              <div className="flex justify-between">
                <span>External Slug</span>
                <span className="font-mono text-charcoal">{player.external_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Position</span>
                <span className="font-mono uppercase text-charcoal">{player.position || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>League Vault</span>
                <span className="font-mono uppercase text-charcoal">{player.league}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6">
        <SourceStamp source="TheSportsDB Automated Vault Sync" />
      </div>
    </>
  );
}
