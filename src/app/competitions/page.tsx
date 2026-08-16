// src/app/competitions/page.tsx

import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import SidebarStack from '@/components/sidebar/SidebarStack';
import { competitions, teams, matches } from '@/lib/data/demo';
import { standings, nslStandings } from '@/lib/data/proLeagues/proLeaguesDemo';

export default function Competitions() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8">
      <HubHeader
        eyebrow="Competition index"
        title="COMPETITIONS"
        description="A clean registry of Canadian competitions. Every competition is an entity with its own teams, matches, standings and methodology context."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {competitions.map((c) => (
          <Link
            key={c.id}
            href={`/competitions/${c.slug}`}
            className="group border border-border p-5 hover:border-crimson"
          >
            <div className="text-[9px] font-mono uppercase text-crimson">
              {c.level} {'// '}
              {c.gender}
            </div>
            <h2 className="mt-1 text-xl font-black group-hover:text-crimson">
              {c.name}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="border border-border p-3">
                <div className="text-lg font-black">
                  {teams.filter((t) => t.competitionId === c.id).length}
                </div>
                <div className="text-[8px] font-mono text-charcoal-soft">TEAMS</div>
              </div>
              <div className="border border-border p-3">
                <div className="text-lg font-black">
                  {matches.filter((m) => m.competitionId === c.id).length}
                </div>
                <div className="text-[8px] font-mono text-charcoal-soft">MATCHES</div>
              </div>
            </div>
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
