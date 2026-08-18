import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import SidebarStack from '@/components/sidebar/SidebarStack';
import { wireItems } from '@/lib/data/demo';
import { standings, nslStandings } from '@/lib/data/proLeagues/proLeaguesDemo';
import { formatUpdatedAt } from '@/lib/dataStatus';

export default function TransferWire() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8">
        <HubHeader
          eyebrow="Movement intelligence"
          title="TRANSFER / MOVEMENT WIRE"
          description="A source-first movement feed. Confirmed, reported and speculative events should be visually distinct in the production version."
        />
        <div className="space-y-3">
          {wireItems
            .filter((x) => x.category === 'transfer')
            .map((x) => (
              <article key={x.id} className="border border-border p-5">
                <div className="text-[9px] font-mono uppercase text-crimson">
                  MOVEMENT // {formatUpdatedAt(x.timestamp)}
                </div>
                <h2 className="mt-1 font-black">{x.headline}</h2>
                <p className="mt-2 text-sm text-charcoal-soft">{x.dek}</p>
                <div className="mt-4 border-t border-border pt-2 text-[9px] font-mono uppercase">
                  SOURCE // {x.source.name}
                </div>
              </article>
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
