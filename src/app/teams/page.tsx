// src/app/teams/page.tsx

import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import SidebarStack from '@/components/sidebar/SidebarStack';
import { teams } from '@/lib/data/demo';
import { standings, nslStandings } from '@/lib/data/proLeagues/proLeaguesDemo';

export default function TeamsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8">
      <HubHeader
        eyebrow="Entity index // Teams"
        title="TEAM INDEX"
        description="Competition-aware team entities connect standings, fixtures, player rosters, form and tactical analysis."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((t) => (
          <Link
            key={t.id}
            href={`/teams/${t.slug}`}
            className="group border border-border p-5 hover:border-crimson"
          >
            <div className="flex justify-between">
              <div>
                <div className="text-[9px] font-mono uppercase text-crimson">
                  {t.competitionName} {' // '} {t.province}
                </div>
                <h2 className="mt-1 text-xl font-black group-hover:text-crimson">
                  {t.name}
                </h2>
                <p className="text-xs text-charcoal-soft">{t.city}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black">{t.points}</div>
                <div className="text-[9px] font-mono text-charcoal-soft">
                  PTS
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-1">
              {t.form.map((f, i) => (
                <span
                  key={i}
                  className={`flex h-6 w-6 items-center justify-center text-[9px] font-bold ${
                    f === 'W'
                      ? 'bg-emerald-500/15 text-emerald-600'
                      : f === 'D'
                      ? 'bg-amber-500/15 text-amber-600'
                      : 'bg-crimson/10 text-crimson'
                  }`}
                >
                  {f}
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
