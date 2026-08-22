// src/app/stats/page.tsx
import React from 'react';
import SidebarStack from '@/components/sidebar/SidebarStack';
import { getCplStandings, getNslStandings, getMlsStandings, getNwslStandings } from '@/lib/data/standings';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const [cpl, nsl, mls, nwsl] = await Promise.all([
    getCplStandings(),
    getNslStandings(),
    getMlsStandings(),
    getNwslStandings(),
  ]);

  return (
    <div className="w-full">
      {/* Page content */}
      <SidebarStack 
        standings={cpl} 
        nslStandings={nsl} 
        mlsStandings={mls} 
        nwslStandings={nwsl} 
      />
    </div>
  );
}
