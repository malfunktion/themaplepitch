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
  const { data: teams } = await supabase.from('teams').select('slug');
  return (teams || [])
    .filter((t) => t.slug)
    .map((t) => ({ slug: t.slug }));
}

function formatDate(dateVal: string | null | undefined): string {
  if (!dateVal) return 'TBD';
  const parsed = new Date(dateVal);
  return isNaN(parsed.getTime())
    ? 'TBD'
    : parsed.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function getTeamData(slug: string) {
  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!team) return null;

  const [playersRes, matchesRes] = await Promise.all([
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
      .order('match_date', { ascending: false })
      .limit(8),
  ]);

  return {
    team,
    players: playersRes.data || [],
    matches: matchesRes.data || [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTeamData(slug);

  if (!data?.team) {
    return { title: 'Team Not Found' };
  }

  const { team } = data;
  const title = `${team.name} | The Maple Pitch`;
  const description = `${team.name} club hub, roster, fixtures, and telemetry on The Maple Pitch.`;

  return {
    title,
    description,
    alternates: { canonical: `/teams/${team.slug}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/teams/${team.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function TeamProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getTeamData(slug);

  if (!data?.team) notFound();

  const { team, players, matches } = data;

  return (
    <>
      <HubHeader
        eyebrow={`Club Hub // ${team.league || 'Canada'}`}
        title={team.name.toUpperCase()}
        description={`Official club dossier, active roster, and competition schedule for ${team.name}.`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="border border-border p-5 bg-card">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">Active Roster ({players.length})</div>
            {players.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {players.map((p) => (
                  <Link
                    key={p.id}
                    href={`/players/${p.external_id || p.id}`}
                    className="border border-border/60 p-3 flex justify-between items-center hover:border-crimson transition-colors text-xs"
                  >
                    <span className="font-bold">{p.name}</span>
                    <span className="font-mono text-charcoal-soft uppercase">{p.position || 'CM'}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-xs text-charcoal-soft">No active roster loaded in vault.</div>
            )}
          </div>

          <div className="border border-border p-5 bg-card">
            <div className="text-[10px] font-mono uppercase text-crimson mb-3">Fixtures &amp; Results</div>
            {matches.length > 0 ? (
              <div className="divide-y divide-border text-xs">
                {matches.map((m: any) => {
                  const homeTeam = Array.isArray(m.home_team) ? m.home_team[0] : m.home_team;
                  const awayTeam = Array.isArray(m.away_team) ? m.away_team[0] : m.away_team;
                  const homeName = homeTeam?.name;
                  const awayName = awayTeam?.name;
                  return (
                    <div key={m.id} className="py-2.5 flex justify-between items-center">
                      <span>{formatDate(m.match_date)}</span>
                      <span>{homeName || 'Home'} vs {awayName || 'Away'}</span>
                      <span className="font-mono uppercase text-charcoal-soft">{m.stage || 'Match'}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-charcoal-soft">No fixtures recorded for this club.</div>
            )}
          </div>
        </section>

        <aside>
          <div className="border border-border bg-card p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">Club Information</div>
            <div className="mt-4 space-y-2 text-xs text-charcoal-soft">
              <div className="flex justify-between">
                <span>League</span>
                <span className="font-mono uppercase text-charcoal">{team.league || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Slug</span>
                <span className="font-mono text-charcoal">{team.slug}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6">
        <SourceStamp source={"TheSportsDB Automated Vault Sync" as any} />
      </div>
    </>
  );
}
