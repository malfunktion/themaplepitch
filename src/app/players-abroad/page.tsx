import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import SidebarStack from '@/components/sidebar/SidebarStack';
import { players } from '@/lib/data/demo';
import { standings, nslStandings } from '@/lib/data/proLeagues/proLeaguesDemo';

export default function PlayersAbroad() {
  const abroad = players.filter((p) => p.pathway.includes('Europe'));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8">
        <HubHeader
          eyebrow="Global watch // Canada"
          title="CANADIANS ABROAD"
          description="A dedicated movement layer for Canadian players outside the domestic system. The live version should ingest verified club and competition sources."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {abroad.map((p) => (
            <Link key={p.id} href={`/players/${p.slug}`} className="border border-border p-5 hover:border-crimson">
              <div className="text-[9px] font-mono uppercase text-crimson">
                GLOBAL WATCH // {p.position}
              </div>
              <h2 className="mt-1 text-xl font-black">{p.name}</h2>
              <p className="text-xs text-charcoal-soft">{p.clubName}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.pathway.map((x) => (
                  <span key={x} className="border border-border px-2 py-1 text-[9px] font-mono">
                    {x}
                  </span>
                ))}
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
