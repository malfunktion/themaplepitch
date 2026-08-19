'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import SidebarStack from '@/components/sidebar/SidebarStack';
import DataStatus from '@/components/layout/DataStatus';
import TacticalBlueprint from '@/components/national-teams/TacticalBlueprint';
import TicketPortal from '@/components/national-teams/TicketPortal';
import TourCampsCalendar from '@/components/national-teams/TourCampsCalendar';
import HonorRoll from '@/components/national-teams/HonorRoll';
import RosterRevolution from '@/components/national-teams/RosterRevolution';
import DepthChart from '@/components/national-teams/DepthChart';
import CoachingStaff from '@/components/national-teams/CoachingStaff';
import HistoricalRecords from '@/components/national-teams/HistoricalRecords';
import RegionalGrassroots from '@/components/national-teams/RegionalGrassroots';
import FanCommunityHub from '@/components/national-teams/FanCommunityHub';
import PressRoomTranscripts from '@/components/national-teams/PressRoomTranscripts';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';
import type { StandingsRow, WireStory } from '@/lib/types';

interface SquadPlayer {
  id?: number;
  number?: number;
  name: string;
  club?: string;
  league?: string;
  position: string;
  age?: number;
  caps?: number;
  rating?: number;
  ga?: string;
  status?: 'LOCKED' | 'UNTIED / DUAL-NAT' | 'INJURED';
  gender?: string;
  squad_type?: string;
  goals?: number;
  assists?: number;
}

function NationalTeamsContent() {
  const searchParams = useSearchParams();
  const urlGender = searchParams.get('gender')?.toUpperCase() as 'MEN' | 'WOMEN' | null;

  const [activeGender, setActiveGender] = useState<'MEN' | 'WOMEN'>(
    urlGender === 'WOMEN' ? 'WOMEN' : 'MEN'
  );
  const [activeAge, setActiveAge] = useState<'SENIOR' | 'U-23' | 'U-20' | 'U-17'>('SENIOR');
  
  const [squadPool, setSquadPool] = useState<SquadPlayer[]>([]);
  const [wireStories, setWireStories] = useState<WireStory[]>([]);
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL search param changes
  useEffect(() => {
    if (urlGender === 'WOMEN' || urlGender === 'MEN') {
      setActiveGender(urlGender);
    }
  }, [urlGender]);

  // Fetch live standings and wire dispatches
  useEffect(() => {
    getCplStandings().then(setStandings);
    getNslStandings().then(setNslStandings);

    async function fetchWireDispatches() {
      const tag = activeGender === 'WOMEN' ? 'CanWNT' : 'CanMNT';
      const { data } = await supabase
        .from('news_wire')
        .select('*')
        .or(`league.eq.${tag},gender.eq.${activeGender.toLowerCase()}`)
        .order('published_at', { ascending: false })
        .limit(3);

      setWireStories(data || []);
    }
    fetchWireDispatches();
  }, [activeGender]);

  // Fetch full active national squad pool from Supabase (Increased limit to pull full roster pool)
  useEffect(() => {
    async function fetchNationalSquad() {
      setLoading(true);
      const genderDb = activeGender === 'WOMEN' ? 'women' : 'men';

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('gender', genderDb)
        .order('rating', { ascending: false })
        .limit(45);

      if (error) {
        console.error('Error fetching national squad:', error);
      } else {
        setSquadPool(data || []);
      }
      setLoading(false);
    }

    fetchNationalSquad();
  }, [activeGender, activeAge]);

  // Sort all fetched players by rating descending
  const sortedSquad = [...squadPool].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // Top 11 for the Tactical Pitch Matrix
  const startingXI = sortedSquad.slice(0, 11);

  // Remaining assets flow into the Substitutes & Squad Depth Pool
  const squadDepthPool = sortedSquad.slice(11);

  // Robust position grouping helper with fallback catching unassigned roles into midfielders
  const getSubsByPosition = (posCategory: 'GK' | 'DEF' | 'MID' | 'FWD') => {
    return squadDepthPool.filter(p => {
      const pos = (p.position || '').toUpperCase();
      if (posCategory === 'GK') return pos.includes('GK');
      if (posCategory === 'DEF') return pos.includes('CB') || pos.includes('LB') || pos.includes('RB') || pos.includes('FB') || pos.includes('DEF') || pos.includes('WB') || pos.includes('BACK');
      if (posCategory === 'FWD') return pos.includes('ST') || pos.includes('FW') || pos.includes('LW') || pos.includes('RW') || pos.includes('W') || pos.includes('CF') || pos.includes('ATT');
      // MID gets everything else (CM, DM, AM, LM, RM, MID, or unclassified assets)
      if (posCategory === 'MID') {
        const isOther = pos.includes('GK') || pos.includes('CB') || pos.includes('LB') || pos.includes('RB') || pos.includes('FB') || pos.includes('DEF') || pos.includes('WB') || pos.includes('BACK') || pos.includes('ST') || pos.includes('FW') || pos.includes('LW') || pos.includes('RW') || pos.includes('W') || pos.includes('CF') || pos.includes('ATT');
        return !isOther;
      }
      return false;
    });
  };

  const activeGenderUpper = activeGender === 'WOMEN' ? 'WOMEN' : 'MEN';

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center font-mono text-charcoal-soft text-xs tracking-widest uppercase">
        SYNCING NATIONAL DOSSIER...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-foreground py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
          <div>
            <h1 className="font-mono text-xl font-bold tracking-wider uppercase">
              CANADA {activeGender} // NATIONAL SQUAD POOL
            </h1>
            <p className="text-xs font-mono text-charcoal-soft mt-1">
              DYNAMIC FORMATION MATRIX & SQUAD DEPTH VAULT
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-card border border-border rounded-sm p-1">
              <button
                onClick={() => setActiveGender('MEN')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  activeGender === 'MEN' ? 'bg-crimson text-white font-bold' : 'text-charcoal-soft hover:text-foreground'
                }`}
              >
                MEN
              </button>
              <button
                onClick={() => setActiveGender('WOMEN')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  activeGender === 'WOMEN' ? 'bg-crimson text-white font-bold' : 'text-charcoal-soft hover:text-foreground'
                }`}
              >
                WOMEN
              </button>
            </div>
            <DataStatus />
          </div>
        </div>

        {/* Age Group Bar */}
        <div className="flex flex-wrap gap-2 pb-2">
          {(['SENIOR', 'U-23', 'U-20', 'U-17'] as const).map((age) => (
            <button
              key={age}
              onClick={() => setActiveAge(age)}
              className={`px-3 py-1.5 font-mono text-xs rounded-sm border transition-all ${
                activeAge === age
                  ? 'bg-crimson text-white border-crimson font-bold'
                  : 'bg-card text-charcoal-soft border-border hover:border-crimson/50'
              }`}
            >
              {age}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main 8-Column Content Feed */}
          <div className="lg:col-span-8 space-y-8">

            {/* Top Tier: Live Wire Dispatches */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-xs font-bold text-crimson tracking-wider uppercase">
                  # {activeGender === 'WOMEN' ? 'CanWNT' : 'CanMNT'} INTELLIGENCE DISPATCHES
                </h2>
                <span className="text-[10px] font-mono text-charcoal-soft">LIVE WIRE STREAM</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {wireStories.length > 0 ? (
                  wireStories.map((story) => (
                    <div key={story.id} className="bg-card/85 border border-border/60 p-3 rounded-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-crimson/10 text-crimson rounded border border-crimson/30">
                          {story.sourceName || 'THE WIRE'}
                        </span>
                        <h4 className="font-mono text-xs font-bold mt-2 line-clamp-2">{story.headline}</h4>
                      </div>
                      <span className="text-[9px] font-mono text-charcoal-soft mt-2">{story.timestamp || 'RECENT'}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 bg-card/50 border border-border/40 p-4 text-center font-mono text-xs text-charcoal-soft">
                    No recent dispatches logged for this national program stream.
                  </div>
                )}
              </div>
            </div>

            {/* Middle Tier: Tactical Pitch Diagram (The Starting XI) */}
            <div className="bg-card/90 border border-border p-6 rounded-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-crimson">
                  TOP 11 STARTING SQUAD // DYNAMIC FORMATION MATRIX
                </h2>
                <span className="text-xs font-mono text-charcoal-soft">AUTO-SORTED BY HIGHEST DB RATING</span>
              </div>

              {/* Vector Grass Field Visualization */}
              <div className="relative w-full h-[360px] bg-emerald-950/40 border-2 border-emerald-500/30 rounded-md overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                {/* Field Markings */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/25 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-emerald-500/25 pointer-events-none" />
                
                {/* Tactical Rows Spread Across Pitch */}
                <div className="flex justify-center gap-4 z-10">
                  {startingXI.slice(9, 11).map((player, idx) => (
                    <PlayerPitchNode key={player.id || idx} player={player} />
                  ))}
                </div>
                <div className="flex justify-around gap-2 z-10">
                  {startingXI.slice(5, 9).map((player, idx) => (
                    <PlayerPitchNode key={player.id || idx} player={player} />
                  ))}
                </div>
                <div className="flex justify-around gap-2 z-10">
                  {startingXI.slice(1, 5).map((player, idx) => (
                    <PlayerPitchNode key={player.id || idx} player={player} />
                  ))}
                </div>
                <div className="flex justify-center z-10">
                  {startingXI.slice(0, 1).map((player, idx) => (
                    <PlayerPitchNode key={player.id || idx} player={player} />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Tier: Substitutes & Squad Depth Matrix */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-neutral-300">
                  SUBSTITUTES & SQUAD DEPTH POOL ({squadDepthPool.length} ASSETS)
                </h2>
                <span className="text-xs font-mono text-charcoal-soft">SORTED BY POSITION DEPTH</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['GK', 'DEF', 'MID', 'FWD'] as const).map((posGroup) => {
                  const deputies = getSubsByPosition(posGroup);
                  if (deputies.length === 0) return null;
                  return (
                    <div key={posGroup} className="bg-card/60 border border-border/50 p-4 rounded-sm space-y-2">
                      <h3 className="font-mono text-xs font-bold text-crimson tracking-wider">{posGroup} DEPUTIES ({deputies.length})</h3>
                      <div className="space-y-1.5">
                        {deputies.map((player, idx) => (
                          <div key={player.id || idx} className="flex justify-between items-center text-xs font-mono bg-card p-2 rounded border border-border/30">
                            <div>
                              <span className="font-bold text-white">{player.name}</span>
                              <span className="text-charcoal-soft text-[10px] block">{player.club || player.league || 'Unattached'} • {player.caps || 0} caps</span>
                            </div>
                            <span className="text-crimson font-bold">{player.rating ? `${player.rating} RTG` : `${player.caps || 0} caps`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complete Dossier Modules Stack */}
            <TacticalBlueprint />
            <TicketPortal />
            <TourCampsCalendar />
            <HonorRoll />
            <RosterRevolution />
            <DepthChart activeGender={activeGenderUpper} />
            <CoachingStaff activeGender={activeGenderUpper} />
            <HistoricalRecords activeGender={activeGenderUpper} />
            <RegionalGrassroots />
            <FanCommunityHub />
            <PressRoomTranscripts />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <SidebarStack standings={standings} nslStandings={nslStandings} />
          </div>

        </div>

      </div>
    </div>
  );
}

// Compact Pitch Node Helper Component
function PlayerPitchNode({ player }: { player: SquadPlayer }) {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="bg-card/95 border border-crimson/60 group-hover:border-crimson px-2.5 py-1.5 rounded text-center shadow-lg transition-all">
        <span className="text-[10px] font-mono font-bold text-white block leading-none">{player.name}</span>
        <span className="text-[8px] font-mono text-charcoal-soft block mt-0.5">{player.position} • {player.rating ? `${player.rating} RTG` : 'PRO'}</span>
      </div>
    </div>
  );
}

export default function NationalTeamsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center font-mono text-charcoal-soft text-xs tracking-widest uppercase">
          LOADING NATIONAL DOSSIER...
        </div>
      }
    >
      <NationalTeamsContent />
    </Suspense>
  );
}
