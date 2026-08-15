import Link from 'next/link';
import { VideoStage, TacticalPitch, HighlightsGrid, MediaArchive, LiveFeed } from '@/components/match-center';
import { getWireFeed } from '@/lib/data/newsWire';

// Maps the placeholder matchId prefix to a League-vocabulary category so
// the related-dispatches strip below can filter the wire feed. Once real
// match data exists this becomes a lookup on the match's actual
// competition instead of a string-prefix guess.
function deriveLeagueFromMatchId(matchId: string): string | undefined {
  if (matchId.startsWith('cpl-')) return 'CPL';
  if (matchId.startsWith('nsl-')) return 'NSL';
  if (matchId.startsWith('league1-')) return 'Provincial';
  return undefined;
}

// TODO: replace with the real official broadcast URL for this match/league
// once that mapping exists (see chat: mediaSources / YOUTUBE_SOURCES plan).
// Placeholder network name only — never auto-redirects, always requires an
// explicit click.
function broadcastNetworkFor(league: string | undefined): string {
  if (league === 'CPL' || league === 'NSL') return 'OneSoccer';
  return 'the official broadcaster';
}

export default async function MatchCenterMatchPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const league = deriveLeagueFromMatchId(matchId);
  const network = broadcastNetworkFor(league);
  const relatedDispatches = league ? await getWireFeed({ category: league, limit: 4 }) : [];

  return (
    <main className="mx-auto max-w-7xl p-6">
      <section className="rounded-sm bg-charcoal p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-crimson uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse"></span>
            LIVE
          </span>
          {league && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-white/10 text-neutral-300 uppercase">
              {league}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-black">CAVALRY FC 2–1 FORGE FC</h1>
        <p className="text-sm text-neutral-400">67&apos; • ATCO FIELD</p>

        <div className="mt-4 flex flex-col items-start gap-1.5">
          <Link
            href="#"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-sm bg-crimson hover:bg-crimson-dim text-white font-mono text-xs font-bold px-4 py-2.5 uppercase tracking-wider transition-colors"
          >
            [ Watch Live on {network} ➔ ]
          </Link>
          <p className="text-[10px] text-neutral-500">
            Opens in a new tab. Broadcasting rights require direct viewing — availability may vary outside Canada/CONCACAF.
          </p>
        </div>

        <VideoStage />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <TacticalPitch />
        <LiveFeed />
      </section>

      {relatedDispatches.length > 0 && (
        <section className="mt-6 rounded-sm border border-border bg-card p-4">
          <h2 className="mb-3 text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase border-b border-border pb-2">
            {league} DISPATCHES // FROM THE WIRE
          </h2>
          <div className="divide-y divide-border">
            {relatedDispatches.map((story) => (
              <Link key={story.id} href={story.sourceUrl || '#'} target="_blank" className="block py-2.5 group">
                <div className="flex items-center gap-2 text-[10px] font-mono text-charcoal-soft mb-0.5">
                  <span className="text-crimson font-bold">{story.timestamp}</span>
                  <span>• {story.sourceName}</span>
                </div>
                <div className="text-xs font-bold text-charcoal group-hover:text-crimson transition-colors line-clamp-1">
                  {story.headline}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <HighlightsGrid />
      </section>
      <section className="mt-6">
        <MediaArchive />
      </section>
    </main>
  );
}
