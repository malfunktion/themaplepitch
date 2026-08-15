import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { getPlayer, players, teams, matches } from '@/lib/data/demo';

export function generateStaticParams() {
  return players.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayer(slug);

  if (!player) {
    return { title: 'Player Not Found' };
  }

  const title = player.name;
  const description = `${player.name} — ${player.position} for ${player.clubName}. ${player.nationality.join('/')} international. Stats, pathway, and scouting profile on The Maple Pitch.`;

  return {
    title,
    description,
    alternates: { canonical: `/players/${player.slug}` },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: `/players/${player.slug}`,
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
  const player = getPlayer(slug);
  if (!player) notFound();

  // player.clubId refers to a team's id, not its slug — look the team up
  // to get the slug the /teams/[slug] route actually expects.
  const club = teams.find((t) => t.id === player.clubId);
  const clubMatches = matches
    .filter((m) => m.homeTeamId === player.clubId || m.awayTeamId === player.clubId)
    .slice(0, 6);

  const statTiles: [string, string | number][] = [
    ['RATING', player.rating],
    ['APPS', player.appearances],
    ['GOALS', player.goals],
    ['ASSISTS', player.assists],
    ['xG', player.xG.toFixed(1)],
    ['xA', player.xA.toFixed(1)],
    ['MINUTES', player.minutes],
  ];

  return (
    <>
      <HubHeader
        eyebrow={`Player dossier // ${player.clubName}`}
        title={player.name.toUpperCase()}
        description={`${player.position} · ${player.nationality.join(' / ')}${player.province ? ` · ${player.province}` : ''} · Born ${player.birthYear}. One player entity powers this profile, scouting, comparisons, and pathway views.`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statTiles.map(([label, value]) => (
              <div key={label} className="border border-border bg-card p-4">
                <div className="text-[9px] font-mono text-charcoal-soft">{label}</div>
                <div className="mt-2 text-3xl font-black">{value}</div>
              </div>
            ))}
          </div>

          <div className="border border-border p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">Club &amp; pathway</div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {club ? (
                <Link
                  href={`/teams/${club.slug}`}
                  className="border border-border px-3 py-1.5 font-bold hover:border-crimson hover:text-crimson transition-colors"
                >
                  {player.clubName}
                </Link>
              ) : (
                <span className="border border-border px-3 py-1.5 font-bold">{player.clubName}</span>
              )}
              {player.pathway.map((step) => (
                <span key={step} className="border border-border/60 px-3 py-1.5 text-charcoal-soft">
                  {step}
                </span>
              ))}
            </div>
          </div>

          {clubMatches.length > 0 && (
            <div className="border border-border p-5">
              <div className="text-[10px] font-mono uppercase text-crimson">Recent &amp; upcoming (club)</div>
              <div className="mt-3 divide-y divide-border">
                {clubMatches.map((m) => (
                  <Link
                    key={m.id}
                    href={`/matches/${m.id}`}
                    className="flex items-center justify-between py-3 text-xs hover:text-crimson"
                  >
                    <span>{m.date}</span>
                    <span>
                      {m.homeTeamName} {m.status === 'final' ? m.homeScore : '—'}–
                      {m.status === 'final' ? m.awayScore : '—'} {m.awayTeamName}
                    </span>
                    <span className="font-mono uppercase">{m.status}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside>
          <div className="border border-border bg-card p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">Entity status</div>
            <div className="mt-4 space-y-2 text-xs text-charcoal-soft">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-mono uppercase text-charcoal">{player.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Position</span>
                <span className="font-mono uppercase text-charcoal">{player.position}</span>
              </div>
              <div className="flex justify-between">
                <span>Nationality</span>
                <span className="font-mono uppercase text-charcoal">{player.nationality.join(', ')}</span>
              </div>
              {player.province && (
                <div className="flex justify-between">
                  <span>Province</span>
                  <span className="font-mono uppercase text-charcoal">{player.province}</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6">
        <SourceStamp source={player.source} />
      </div>
    </>
  );
}
