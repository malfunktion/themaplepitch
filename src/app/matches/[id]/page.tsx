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
  const { data: matches } = await supabase.from('matches').select('id');
  return (matches || [])
    .filter((m) => Boolean(m?.id))
    .map((m) => ({ id: String(m.id) }));
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

async function getMatchData(id: string) {
  const { data: match } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id (id, name, slug, logo_url),
      away_team:teams!away_team_id (id, name, slug, logo_url)
    `)
    .eq('id', id)
    .maybeSingle();

  return match;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatchData(id);

  if (!match) return { title: 'Match Not Found' };

  const home = Array.isArray(match.home_team) ? match.home_team[0] : match.home_team;
  const away = Array.isArray(match.away_team) ? match.away_team[0] : match.away_team;
  const homeName = home?.name || 'Home Team';
  const awayName = away?.name || 'Away Team';

  const title = `${homeName} vs ${awayName} | The Maple Pitch`;
  const description = `Match summary and telemetry for ${homeName} vs ${awayName}.`;

  return { title, description };
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatchData(id);

  if (!match) notFound();

  const home = Array.isArray(match.home_team) ? match.home_team[0] : match.home_team;
  const away = Array.isArray(match.away_team) ? match.away_team[0] : match.away_team;

  return (
    <>
      <HubHeader
        eyebrow={`Match Centre // ${match.stage || 'Fixture'}`}
        title={`${(home?.name || 'Home').toUpperCase()} VS ${(away?.name || 'Away').toUpperCase()}`}
        description={`Scheduled for ${safeFormatDate(match.match_date)}.`}
      />

      <div className="border border-border bg-card p-6 text-center space-y-4">
        <div className="flex justify-between items-center max-w-md mx-auto text-sm font-bold">
          {home?.slug ? (
            <Link href={`/teams/${home.slug}`} className="hover:text-crimson">
              {home.name}
            </Link>
          ) : (
            <span>{home?.name || 'Home'}</span>
          )}
          <span className="font-mono text-crimson px-3 py-1 border border-border">VS</span>
          {away?.slug ? (
            <Link href={`/teams/${away.slug}`} className="hover:text-crimson">
              {away.name}
            </Link>
          ) : (
            <span>{away?.name || 'Away'}</span>
          )}
        </div>
        <div className="text-xs font-mono text-charcoal-soft">
          Date: {safeFormatDate(match.match_date)}
        </div>
      </div>

      <div className="mt-6">
        <SourceStamp source={"TheSportsDB Automated Vault Sync" as any} />
      </div>
    </>
  );
}
