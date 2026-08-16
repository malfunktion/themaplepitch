import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import SidebarStack from '@/components/sidebar/SidebarStack';
import { matches } from '@/lib/data/demo';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';

export default async function MatchesPage() {
  const [standings, nslStandings] = await Promise.all([getCplStandings(), getNslStandings()]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8">
        <HubHeader
          eyebrow="Match centre // Canada"
          title="MATCH CENTRE"
          description="A single match entity connects fixtures, scores, team pages, competition pages and future event data."
        />
        <div className="space-y-3">
          {matches.map((m) => (
            <Link
              key={m.id}
              href={`/matches/${m.id}`}
              className="grid gap-3 border border-border p-4 hover:border-crimson sm:grid-cols-[120px_1fr_120px] sm:items-center"
            >
              <div>
                <div className="text-[9px] font-mono uppercase text-crimson">{m.competitionName}</div>
                <div className="text-xs text-charcoal-soft">{m.date}</div>
              </div>
              <div className="text-center text-sm font-black">
                {m.homeTeamName}{' '}
                <span className="mx-2 font-mono">
                  {m.status === 'final' ? `${m.homeScore} — ${m.awayScore}` : 'VS'}
                </span>{' '}
                {m.awayTeamName}
              </div>
              <div className="text-right text-[9px] font-mono uppercase text-charcoal-soft">{m.status}</div>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <SourceStamp />
        </div>
      </div>
      <div className="lg:col-span-4 sticky top-6">
        <SidebarStack standings={standings} nslStandings={nslStandings} defaultTab="standings" />
      </div>
    </div>
  );
}
