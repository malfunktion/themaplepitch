// src/app/match-centre/page.tsx

import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { matches } from '@/lib/data/demo';

export default function MatchCentre() {
  const upcoming = matches.filter((m) => m.status !== 'final');
  return (
    <>
      <HubHeader
        eyebrow="Live match intelligence"
        title="MATCH CENTRE"
        description="Upcoming and completed matches in one place, with a canonical route for every fixture and room for event-level data."
      />
      <div className="mb-6 border border-crimson/40 bg-crimson/5 p-4 text-xs">
        <b className="font-mono text-crimson">LIVE ARCHITECTURE {'// '}</b>
        Production match feeds should update score, minute, incidents and event data
        independently from page rendering.
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {upcoming.map((m) => (
          <Link
            key={m.id}
            href={`/matches/${m.id}`}
            className="border border-border p-5 hover:border-crimson"
          >
            <div className="text-[9px] font-mono uppercase text-crimson">
              {m.competitionName}
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <span className="font-black">{m.homeTeamName}</span>
              <span className="font-mono">VS</span>
              <span className="font-black">{m.awayTeamName}</span>
            </div>
            <div className="mt-4 border-t border-border pt-3 text-center text-[9px] font-mono uppercase text-charcoal-soft">
              {m.date} {'// '}
              {m.venue}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <SourceStamp />
      </div>
    </>
  );
}
