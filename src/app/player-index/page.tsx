import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import SidebarStack from '@/components/sidebar/SidebarStack';
import { players } from '@/lib/data/demo';
import { standings, nslStandings } from '@/lib/data/proLeagues/proLeaguesDemo';

export default function PlayerIndex() {
  const ranked = [...players].sort((a, b) => b.rating - a.rating);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8">
        <HubHeader
          eyebrow="Flagship index // Players"
          title="CANADIAN PLAYER INDEX"
          description="A searchable ranking layer for Canadian players. The model is intentionally transparent: production, minutes and role context are displayed alongside the index rather than hidden behind one score."
        />
        <div className="border border-border overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-card font-mono text-[9px] uppercase text-charcoal-soft">
              <tr>
                <th className="p-3">Rank</th>
                <th>Player</th>
                <th>Club</th>
                <th>Pos</th>
                <th>Index</th>
                <th>G</th>
                <th>A</th>
                <th>xG</th>
                <th>xA</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((p, i) => (
                <tr key={p.id} className="border-t border-border hover:bg-card">
                  <td className="p-3 font-mono">{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    <Link className="font-black hover:text-crimson" href={`/players/${p.slug}`}>
                      {p.name}
                    </Link>
                  </td>
                  <td>{p.clubName}</td>
                  <td>{p.position}</td>
                  <td className="font-black">{p.rating}</td>
                  <td>{p.goals}</td>
                  <td>{p.assists}</td>
                  <td>{p.xG.toFixed(1)}</td>
                  <td>{p.xA.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link href="/players-abroad" className="border border-border p-4 font-black hover:border-crimson">
            CANADIANS ABROAD →
          </Link>
          <Link href="/pathways" className="border border-border p-4 font-black hover:border-crimson">
            PATHWAY TRACKER →
          </Link>
          <Link href="/tactical-library" className="border border-border p-4 font-black hover:border-crimson">
            TACTICAL LIBRARY →
          </Link>
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
