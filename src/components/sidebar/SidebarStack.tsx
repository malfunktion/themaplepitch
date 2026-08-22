// src/components/sidebar/SidebarStack.tsx
'use client';

import React, { useState } from 'react';
import ScoutDash from '@/components/home/ScoutDash';
import ProvincialPyramidTracker from '@/components/home/ProvincialPyramidTracker';
import ContractRadarWidget from '@/components/home/ContractRadarWidget';
import DualNationalRadar from '@/components/home/DualNationalRadar';
import SidebarRumourMill from '@/components/home/SidebarRumourMill';
import SidebarAdWidget from '@/components/home/SidebarAdWidget';
import SidebarAdWidget4 from '@/components/home/SidebarAdWidget4';
import SidebarAdWidget5 from '@/components/home/SidebarAdWidget5';
import type { StandingsRow } from '@/lib/types';

interface SidebarStackProps {
  standings?: StandingsRow[];
  nslStandings?: StandingsRow[];
  breakpoint?: 'md' | 'lg';
  defaultTab?: 'main' | 'provincial';
}

export default function SidebarStack({ standings = [], nslStandings = [], defaultTab = 'main' }: SidebarStackProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'provincial'>(defaultTab);

  return (
    <div className="flex flex-col gap-4 w-full pb-4">
      {/* Top Tab Switcher for Provincial view vs Main Dashboard Stack */}
      <div className="flex bg-card border border-border rounded-sm p-1 text-[10px] font-bold sticky top-2 z-20 shadow-xl">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex-1 py-2.5 text-center transition-colors rounded-sm ${
            activeTab === 'main' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
          }`}
        >
          [ STANDINGS & RADARS ]
        </button>
        <button
          onClick={() => setActiveTab('provincial')}
          className={`flex-1 py-2.5 text-center transition-colors rounded-sm ${
            activeTab === 'provincial' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
          }`}
        >
          [ PROVINCIAL ]
        </button>
      </div>

      <div className="w-full">
        {activeTab === 'main' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* 1. Standings Widget at the Top */}
            <ScoutDash standings={standings} nslStandings={nslStandings} />
            <SidebarAdWidget />

            {/* 2. Radar Section Directly Underneath Standings */}
            <div className="flex flex-col gap-6 pt-2 border-t border-border/40">
              <ContractRadarWidget />
              <DualNationalRadar />
              <SidebarRumourMill />
              <SidebarAdWidget4 />
            </div>
          </div>
        )}

        {activeTab === 'provincial' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <ProvincialPyramidTracker />
          </div>
        )}
      </div>

      <SidebarAdWidget5 />
    </div>
  );
}
