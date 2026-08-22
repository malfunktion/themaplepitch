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
import StandingsWidget from '@/components/common/StandingsWidget';
import type { StandingsRow } from '@/lib/types';

interface SidebarStackProps {
  standings?: StandingsRow[];
  nslStandings?: StandingsRow[];
  mlsStandings?: StandingsRow[];
  nwslStandings?: StandingsRow[];
  breakpoint?: 'md' | 'lg';
  defaultTab?: 'standings' | 'provincial' | 'stateside' | 'radars' | 'main';
}

export default function SidebarStack({ 
  standings = [], 
  nslStandings = [], 
  mlsStandings = [], 
  nwslStandings = [], 
  defaultTab = 'standings' 
}: SidebarStackProps) {
  const getInitialTab = (): 'standings' | 'provincial' | 'stateside' => {
    if (defaultTab === 'provincial') return 'provincial';
    if (defaultTab === 'stateside' || defaultTab === 'radars') return 'stateside';
    return 'standings';
  };

  const [activeTab, setActiveTab] = useState<'standings' | 'provincial' | 'stateside'>(getInitialTab());
  const [statesideLeague, setStatesideLeague] = useState<'MLS' | 'NWSL'>('MLS');

  const currentStatesideData = statesideLeague === 'MLS' ? mlsStandings : nwslStandings;

  return (
    <div className="flex flex-col gap-4 w-full pb-4">
      {/* 3-Tab Switcher */}
      <div className="flex bg-card border border-border rounded-sm p-1 text-[10px] font-bold sticky top-2 z-20 shadow-xl">
        <button
          onClick={() => setActiveTab('standings')}
          className={`flex-1 py-2.5 text-center transition-colors rounded-sm ${
            activeTab === 'standings' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
          }`}
        >
          [ STANDINGS ]
        </button>
        <button
          onClick={() => setActiveTab('provincial')}
          className={`flex-1 py-2.5 text-center transition-colors rounded-sm ${
            activeTab === 'provincial' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
          }`}
        >
          [ PROVINCIAL ]
        </button>
        <button
          onClick={() => setActiveTab('stateside')}
          className={`flex-1 py-2.5 text-center transition-colors rounded-sm ${
            activeTab === 'stateside' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
          }`}
        >
          [ STATESIDE ]
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

        {activeTab === 'stateside' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Stateside Standings Toggle Wrapper */}
            <div className="bg-card border border-border rounded-sm p-3 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-mono font-bold tracking-widest uppercase">
                  STATESIDE LEAGUES
                </span>
                <div className="flex bg-neutral-100 dark:bg-bg border border-border rounded-sm p-0.5 text-[9px] font-mono font-bold">
                  <button
                    onClick={() => setStatesideLeague('MLS')}
                    className={`px-2.5 py-1 rounded-sm transition-colors ${
                      statesideLeague === 'MLS' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
                    }`}
                  >
                    MLS ({mlsStandings.length})
                  </button>
                  <button
                    onClick={() => setStatesideLeague('NWSL')}
                    className={`px-2.5 py-1 rounded-sm transition-colors ${
                      statesideLeague === 'NWSL' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
                    }`}
                  >
                    NWSL ({nwslStandings.length})
                  </button>
                </div>
              </div>
              
              <StandingsWidget
                title={`${statesideLeague} STANDINGS`}
                cplStandings={currentStatesideData}
                hideToggle={true}
                compact={true}
              />
            </div>

            {/* Radars flow directly underneath in Stateside Tab */}
            <div className="flex flex-col gap-6 pt-2 border-t border-border/40">
              <ContractRadarWidget />
              <DualNationalRadar />
              <SidebarRumourMill />
              <SidebarAdWidget4 />
            </div>
          </div>
        )}
      </div>

      <SidebarAdWidget5 />
    </div>
  );
}
