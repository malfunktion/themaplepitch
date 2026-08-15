'use client';

import React, { useState } from 'react';
import ScoutDash from '@/components/home/ScoutDash';
import ProvincialPyramidTracker from '@/components/home/ProvincialPyramidTracker';
import ContractRadarWidget from '@/components/home/ContractRadarWidget';
import DualNationalRadar from '@/components/home/DualNationalRadar';
import SidebarRumourMill from '@/components/home/SidebarRumourMill';
import SidebarAdWidget from '@/components/home/SidebarAdWidget';
import SidebarAdWidget4 from '@/components/home/SidebarAdWidget4';
import type { StandingsRow } from '@/lib/types';

interface SidebarStackProps {
  standings?: StandingsRow[];
  nslStandings?: StandingsRow[];
  /**
   * No longer branches layout — kept so existing call sites don't need to
   * change. Retained in case a future page needs a breakpoint-specific tweak.
   */
  breakpoint?: 'md' | 'lg';
  /**
   * Which tab opens first. Defaults to 'standings' everywhere except where a
   * page passes something else — e.g. pro-leagues, which already shows a full
   * standings table in its main content, so opening the sidebar on the same
   * table again reads as a duplicate rather than useful context.
   */
  defaultTab?: 'standings' | 'provincial' | 'radars';
}

/**
 * The canonical "5th column" — same 7 widgets, same tab-switcher, on every
 * page, at every screen size. Previously this only tab-switched on mobile
 * and dumped all 7 widgets as one long unconditional stack on desktop, which
 * (a) made the sidebar much longer than it needed to be, and (b) buried
 * Provincial under an ad rather than giving it the same slot as Standings.
 * One tab-switcher everywhere fixes both: same position, same size, one
 * pick at a time. See audit items 9 & 10.
 */
export default function SidebarStack({ standings = [], nslStandings = [], defaultTab = 'standings' }: SidebarStackProps) {
  const [activeTab, setActiveTab] = useState<'standings' | 'provincial' | 'radars'>(defaultTab);

  return (
    <div className="flex flex-col gap-4 w-full pb-4">
      <div className="flex bg-card border border-border rounded-sm p-1 text-[10px] font-bold sticky top-2 z-20 shadow-xl">
        <button
          onClick={() => setActiveTab('standings')}
          className={`flex-1 py-2.5 text-center transition-colors rounded-sm ${
            activeTab === 'standings' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal'
          }`}
        >
          [ STANDINGS ]
        </button>
        <button
          onClick={() => setActiveTab('provincial')}
          className={`flex-1 py-2.5 text-center transition-colors rounded-sm ${
            activeTab === 'provincial' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal'
          }`}
        >
          [ PROVINCIAL ]
        </button>
        <button
          onClick={() => setActiveTab('radars')}
          className={`flex-1 py-2.5 text-center transition-colors rounded-sm ${
            activeTab === 'radars' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal'
          }`}
        >
          [ RADARS ]
        </button>
      </div>
      <div className="w-full">
        {activeTab === 'standings' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <ScoutDash standings={standings} nslStandings={nslStandings} />
            <SidebarAdWidget />
          </div>
        )}
        {activeTab === 'provincial' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <ProvincialPyramidTracker />
          </div>
        )}
        {activeTab === 'radars' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <ContractRadarWidget />
            <DualNationalRadar />
            <SidebarRumourMill />
            <SidebarAdWidget4 />
          </div>
        )}
      </div>
    </div>
  );
}