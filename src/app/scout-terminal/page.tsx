'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SidebarStack from '@/components/sidebar/SidebarStack';
import type { StandingsRow } from '@/lib/types';
import DataStatus from '@/components/layout/DataStatus';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';

interface ProspectDossier {
  id: string;
  name: string;
  position: string;
  age: number;
  club: string;
  region: string;
  metrics: {
    sprintSpeed: string;
    passAcc: string;
    duelsWon: string;
    staminaIndex: string;
  };
  destination: string;
  tier: string;
  status: 'ACTIVE TRIAL' | 'MONITORED' | 'SIGNED' | 'FREE AGENT';
}

const TERMINAL_PROSPECTS: ProspectDossier[] = [
  { id: 'c1', name: 'LEO SOTO', position: 'ST / WING', age: 19, club: 'SIMCOE COUNTY U-19', region: 'L1O', metrics: { sprintSpeed: '33.4 km/h', passAcc: '82%', duelsWon: '58%', staminaIndex: '94.2' }, destination: 'VALLADOLID TRIAL (ESP)', tier: 'TIER 1 PROSPECT', status: 'ACTIVE TRIAL' },
  { id: 'c2', name: 'NOAH MENSAH', position: 'CM / CDM', age: 21, club: 'CALGARY FOOTHILLS', region: 'L1AB', metrics: { sprintSpeed: '31.1 km/h', passAcc: '91%', duelsWon: '67%', staminaIndex: '96.8' }, destination: 'CPL PRE-SEASON CAMP', tier: 'TIER 1 PROSPECT', status: 'MONITORED' },
  { id: 'c3', name: 'LIAM DUMONT', position: 'CB', age: 18, club: 'L1Q SELECTS', region: 'L1Q', metrics: { sprintSpeed: '32.0 km/h', passAcc: '88%', duelsWon: '74%', staminaIndex: '91.5' }, destination: 'MLS NEXT PRO COMBINE', tier: 'TIER 2 PROSPECT', status: 'ACTIVE TRIAL' },
  { id: 'c4', name: 'ETHAN VANCE', position: 'FB / WING', age: 20, club: 'TSS ROVERS', region: 'L1BC', metrics: { sprintSpeed: '34.2 km/h', passAcc: '79%', duelsWon: '61%', staminaIndex: '97.4' }, destination: 'PORTUGUESE U-23 TRIAL', tier: 'TIER 1 PROSPECT', status: 'ACTIVE TRIAL' },
  { id: 'c5', name: 'MATEO ROSSI', position: 'AM / CM', age: 19, club: 'VAUGHAN AZZURRI', region: 'L1O', metrics: { sprintSpeed: '30.5 km/h', passAcc: '94%', duelsWon: '59%', staminaIndex: '93.0' }, destination: 'BOLOGNA ACADEMY TEST', tier: 'TIER 1 PROSPECT', status: 'MONITORED' },
  { id: 'c6', name: 'JONAH CLARKE', position: 'GK', age: 18, club: 'CYJ TORONTO', region: 'L1O', metrics: { sprintSpeed: '28.1 km/h', passAcc: '86%', duelsWon: '82%', staminaIndex: '99.1' }, destination: 'CPL U-21 COMBINE', tier: 'TIER 2 PROSPECT', status: 'MONITORED' },
  { id: 'c7', name: 'LUCAS MOREL', position: 'LW / RW', age: 21, club: 'FC LAVAL', region: 'L1Q', metrics: { sprintSpeed: '35.0 km/h', passAcc: '81%', duelsWon: '53%', staminaIndex: '95.6' }, destination: 'LIGUE 2 TRIAL (FRA)', tier: 'TIER 1 PROSPECT', status: 'ACTIVE TRIAL' },
  { id: 'c8', name: 'OWEN BARKER', position: 'CDM', age: 19, club: 'VALOUR FC ACAD.', region: 'CPL RES.', metrics: { sprintSpeed: '30.8 km/h', passAcc: '89%', duelsWon: '71%', staminaIndex: '94.8' }, destination: 'USL PRO-AM COMBINE', tier: 'TIER 2 PROSPECT', status: 'FREE AGENT' },
];

export default function ScoutTerminalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [activeProspect, setActiveProspect] = useState<ProspectDossier | null>(TERMINAL_PROSPECTS[0]);

  // Live standings synchronization
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);

  useEffect(() => {
    getCplStandings().then(setStandings);
    getNslStandings().then(setNslStandings);
  }, []);

  const filteredProspects = TERMINAL_PROSPECTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.club.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'ALL' || p.region === selectedRegion;
    const matchesTier = selectedTier === 'ALL' || p.tier === selectedTier;
    return matchesSearch && matchesRegion && matchesTier;
  });

  return (
    <div className="min-h-[100dvh] p-2 sm:p-4 md:p-6 pb-[env(safe-area-inset-bottom)] bg-surface text-charcoal font-sans">
      <div className="mb-4 border-b border-border pb-3"><DataStatus /></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content Area (4 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Terminal Header Banner */}
          <div className="bg-card border border-border rounded-sm p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-crimson"></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold bg-crimson text-white px-1.5 py-0.5 rounded-sm">
                    [ DEMO TELEMETRY ]
                  </span>
                  <span className="text-[10px] font-mono text-charcoal-soft">
                    DATASET: DEMONSTRATION / NOT LIVE
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight uppercase text-charcoal">
                  SCOUT TERMINAL // PROSPECT DOSSIERS
                </h1>
              </div>
              <Link 
                href="/the-wire"
                className="self-start sm:self-auto text-xs font-mono font-bold px-3 py-1.5 bg-border text-charcoal rounded-sm hover:bg-border transition-colors border border-border"
              >
                ← RETURN TO WIRE
              </Link>
            </div>
          </div>

          {/* Search and Filters Toolbar */}
          <div className="bg-card border border-border rounded-sm p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-charcoal-soft uppercase mb-1">QUERY PLAYER / CLUB</label>
              <input 
                type="text"
                placeholder="Search name, club..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-sm px-2.5 py-1.5 text-charcoal focus:outline-none focus:border-crimson"
              />
            </div>
            <div>
              <label className="block text-[10px] text-charcoal-soft uppercase mb-1">FILTER REGION / LEAGUE</label>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-surface border border-border rounded-sm px-2.5 py-1.5 text-charcoal focus:outline-none focus:border-crimson"
              >
                <option value="ALL">ALL REGIONS</option>
                <option value="L1O">L1 ONTARIO</option>
                <option value="L1Q">L1 QUÉBEC</option>
                <option value="L1BC">L1 BC</option>
                <option value="L1AB">L1 ALBERTA</option>
                <option value="CPL RES.">CPL RESERVES</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-charcoal-soft uppercase mb-1">FILTER TIER</label>
              <select 
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full bg-surface border border-border rounded-sm px-2.5 py-1.5 text-charcoal focus:outline-none focus:border-crimson"
              >
                <option value="ALL">ALL TIERS</option>
                <option value="TIER 1 PROSPECT">TIER 1 PROSPECT</option>
                <option value="TIER 2 PROSPECT">TIER 2 PROSPECT</option>
              </select>
            </div>
          </div>

          {/* Main Workspace: Split into Prospect Table & Active Dossier Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Prospect Table / List (7 Cols) */}
            <div className="lg:col-span-7 bg-card border border-border rounded-sm overflow-hidden">
              <div className="px-3 py-2.5 border-b border-border bg-card/40 flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-charcoal-soft uppercase tracking-wider">
                  TRACKED PROSPECTS ({filteredProspects.length})
                </span>
                <span className="text-crimson text-[10px] font-bold">● LIVE FEED</span>
              </div>
              <div className="divide-y divide-border overflow-x-auto">
                {filteredProspects.length > 0 ? (
                  filteredProspects.map(p => {
                    const isSelected = activeProspect?.id === p.id;
                    return (
                      <div 
                        key={p.id}
                        onClick={() => setActiveProspect(p)}
                        className={`p-3 cursor-pointer transition-colors flex items-center justify-between font-mono text-xs ${
                          isSelected ? 'bg-crimson/10 border-l-4 border-crimson' : 'hover:bg-border/10'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[9px] font-bold bg-border text-charcoal px-1 py-0.2 rounded border border-border">
                              {p.position}
                            </span>
                            <span className="text-[10px] text-charcoal-soft">AGE {p.age}</span>
                            <span className="text-[9px] font-bold text-crimson-dim">{p.region}</span>
                          </div>
                          <div className="font-bold text-charcoal">{p.name}</div>
                          <div className="text-[10px] text-charcoal-soft">{p.club}</div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                            p.status === 'ACTIVE TRIAL' ? 'bg-crimson text-white' : 'bg-border text-charcoal-soft'
                          }`}>
                            {p.status}
                          </span>
                          <div className="text-[10px] text-charcoal-soft mt-1">➔ INSPECT</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs font-mono text-charcoal-soft">
                    NO PROSPECTS MATCH CURRENT FILTER CRITERIA
                  </div>
                )}
              </div>
            </div>

            {/* Active Dossier Inspector (5 Cols) */}
            <div className="lg:col-span-5 bg-card border border-border rounded-sm p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-mono font-bold tracking-wider text-charcoal-soft uppercase">
                  DOSSIER INSPECTOR
                </span>
                <span className="text-[10px] font-mono bg-border text-charcoal px-1.5 py-0.5 rounded">
                  {activeProspect ? activeProspect.tier : 'SELECT PROSPECT'}
                </span>
              </div>

              {activeProspect ? (
                <div className="space-y-4 font-mono">
                  <div>
                    <div className="text-[10px] text-charcoal-soft uppercase">PLAYER NAME</div>
                    <div className="text-base font-extrabold text-charcoal">{activeProspect.name}</div>
                    <div className="text-xs text-charcoal-soft">{activeProspect.club} • {activeProspect.position} • Age {activeProspect.age}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-surface border border-border p-2 rounded-sm">
                      <div className="text-[9px] text-charcoal-soft">PEAK SPRINT</div>
                      <div className="text-sm font-bold text-charcoal">{activeProspect.metrics.sprintSpeed}</div>
                    </div>
                    <div className="bg-surface border border-border p-2 rounded-sm">
                      <div className="text-[9px] text-charcoal-soft">PASS ACCURACY</div>
                      <div className="text-sm font-bold text-charcoal">{activeProspect.metrics.passAcc}</div>
                    </div>
                    <div className="bg-surface border border-border p-2 rounded-sm">
                      <div className="text-[9px] text-charcoal-soft">DUELS WON</div>
                      <div className="text-sm font-bold text-charcoal">{activeProspect.metrics.duelsWon}</div>
                    </div>
                    <div className="bg-surface border border-border p-2 rounded-sm">
                      <div className="text-[9px] text-charcoal-soft">STAMINA INDEX</div>
                      <div className="text-sm font-bold text-charcoal">{activeProspect.metrics.staminaIndex}</div>
                    </div>
                  </div>

                  <div className="bg-surface border border-border p-2.5 rounded-sm space-y-1">
                    <div className="text-[9px] text-charcoal-soft uppercase">CURRENT DESTINATION / TRIAL</div>
                    <div className="text-xs font-bold text-crimson-dim">{activeProspect.destination}</div>
                    <div className="text-[10px] text-charcoal-soft">Verified by Maple Pitch regional scouting network observers.</div>
                  </div>

                  <button 
                    onClick={() => alert(`Exporting demonstration scouting report for ${activeProspect.name}...`)}
                    className="w-full bg-crimson hover:bg-crimson-dim text-white text-xs font-mono font-bold py-2 px-3 rounded-sm transition-colors text-center"
                  >
                    [ EXPORT TELEMETRY REPORT PDF ]
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-xs font-mono text-charcoal-soft">
                  Select a prospect from the table to view full biometric & scout telemetry.
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Sidebar Column (5th Column) — now the shared SidebarStack, same as every other page */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <SidebarStack standings={standings} nslStandings={nslStandings} />
        </div>

      </div>
    </div>
  );
}
