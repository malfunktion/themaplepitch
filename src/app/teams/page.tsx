import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import SidebarStack from '@/components/sidebar/SidebarStack';
import { createClient } from '@supabase/supabase-js';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const revalidate = 60; // Revalidate every 60s

export default async function TeamsPage() {
  const [teamsRes, cplData, nslData] = await Promise.all([
    supabase.from('teams').select('*').order('name', { ascending: true }),
    getCplStandings(),
    getNslStandings(),
  ]);

  const teamList = teamsRes.data || [];
  const standings = cplData || [];
  const nslStandings = nslData || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8">
        <HubHeader
          eyebrow="Entity index // Teams"
          title="TEAM INDEX"
          description="Competition-aware team entities connect standings, fixtures, player rosters, form and tactical analysis. Powered by live Supabase data."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {teamList.map((t) => {
            const teamRoute = t.slug || t.external_id || t.id;
            return (
              <Link
                key={t.id}
                href={`/teams/${teamRoute}`}
                className="group border border-border p-5 hover:border-crimson transition-colors bg-card"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[9px] font-mono uppercase text-crimson">
                      {t.league || 'Domestic'} {' // '} CAN
                    </div>
                    <h2 className="mt-1 text-xl font-black group-hover:text-crimson">
                      {t.name}
                    </h2>
                  </div>
                  {t.logo_url && (
                    <img
                      src={t.logo_url}
                      alt={`${t.name} logo`}
                      className="w-8 h-8 object-contain shrink-0"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs border-t border-border/40 pt-3 font-mono">
                  <span className="text-charcoal-soft">VAULT ID: {t.id}</span>
                  <span className="text-crimson font-bold">[ VIEW DOSSIER → ]</span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6">
          <SourceStamp source={{ name: 'Supabase Live Team Vault', accessedAt: new Date().toISOString() }} />
        </div>
      </div>
      <div className="lg:col-span-4 sticky top-6">
        <SidebarStack standings={standings} nslStandings={nslStandings} defaultTab="standings" />
      </div>
    </div>
  );
}
