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
import type { StandingsRow } from '@/lib/types';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';

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
}

function NationalTeamsContent() {
  const searchParams = useSearchParams();
  const urlGender = searchParams.get('gender')?.toUpperCase() as 'MEN' | 'WOMEN' | null;
  
  const [activeGender, setActiveGender] = useState<'MEN' | 'WOMEN'>(
    urlGender === 'WOMEN' ? 'WOMEN' : 'MEN'
  );
  const [activeAge, setActiveAge] = useState<'SENIOR' | 'U-23' | 'U-20' | 'U-17'>('SENIOR');
  const [squadPool, setSquadPool] = useState<SquadPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  // Standings for the sidebar stack
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);

  useEffect(() => {
    getCplStandings().then(setStandings);
    getNslStandings().then(setNslStandings);
  }, []);

  // Sync state if URL search param changes
  useEffect(() => {
    if (urlGender === 'WOMEN' || urlGender === 'MEN') {
      setActiveGender(urlGender);
    }
  }, [urlGender]);

  // Fetch full active national squad pool from Supabase
  useEffect(() => {
    async function fetchNationalSquad() {
      setLoading(true);
      const genderDb = activeGender === 'WOMEN' ? 'women' : 'men';

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('gender', genderDb)
        .order('rating', { ascending: false })
        .limit(35);

      if (error) {
        console.error('Error fetching national squad:', error);
      } else {
        setSquadPool(data || []);
      }
      setLoading(false);
    }

    fetchNationalSquad();
  }, [activeGender, activeAge]);

  const sortedSquad = [...squadPool].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const startingXI = sortedSquad.slice(0, 11);
  const squadDepthPool = sortedSquad.slice(11);

  const activeGenderUpper = activeGender === 'WOMEN' ? 'WOMEN' : 'MEN';

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-neutral-500 text-xs tracking-widest uppercase">
        SYNCING NATIONAL DOSSIER...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-foreground py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
          <div>
            <h1 className="font-mono text-xl font-bold tracking-wider uppercase">
              CANADA {activeGender} // NATIONAL SQUAD POOL
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              DYNAMIC FORMATION MATRIX & SQUAD DEPTH VAULT
            </p>
          </div>

          {/* Gender Toggles */}
          <div className="flex items-center gap-3">
            <div className="flex bg-neutral-900 border border-border rounded-sm p-1">
              <button
                onClick={() => setActiveGender('MEN')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  activeGender === 'MEN' ? 'bg-crimson text-white font-bold' : 'text-neutral-400 hover:text-foreground'
                }`}
              >
                MEN
              </button>
              <button
                onClick={() => setActiveGender('WOMEN')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  activeGender === 'WOMEN' ? 'bg-crimson text-white font-bold' : 'text-neutral-400 hover:text-foreground'
                }`}
              >
                WOMEN
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout (8 Columns Content / 4 Columns Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Content Feed */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* TOP 11 STARTING SQUAD SECTION */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-crimson">
                  TOP 11 STARTING SQUAD // DYNAMIC FORMATION MATRIX
                </h2>
                <span className="text-xs font-mono text-neutral-500">AUTO-SORTED BY HIGHEST DB RATING</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {startingXI.map((player, idx) => (
                  <div key={player.id || idx} className="bg-neutral-900 border border-border/60 p-4 rounded-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">{player.position || 'PRO'}</span>
                      <span className="text-xs font-mono font-bold text-crimson">{player.rating ? `${player.rating} RTG` : 'LOCKED'}</span>
                    </div>
                    <h3 className="font-mono text-sm font-bold mt-2">{player.name}</h3>
                    <p className="text-xs font-mono text-neutral-400 mt-1">{player.club || player.league || 'National Asset'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBSTITUTES & SQUAD DEPTH POOL */}
            <div className="space-y-4 pt-6 border-t border-border/40">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-neutral-300">
                  SUBSTITUTES & SQUAD DEPTH POOL ({squadDepthPool.length} ASSETS)
                </h2>
                <span className="text-xs font-mono text-neutral-500">SORTED BY POSITION DEPTH</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {squadDepthPool.map((player, idx) => (
                  <div key={player.id || idx} className="bg-neutral-900/60 border border-border/40 p-3 rounded-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-mono text-xs font-bold">{player.name}</h4>
                      <p className="text-[10px] font-mono text-neutral-500">{player.club || player.league || 'Pro Club'} • {player.position}</p>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">{player.rating ? `${player.rating} RTG` : `${player.caps || 0} caps`}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COMPLETE DOSSIER MODULES STACK */}
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

export default function NationalTeamsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-neutral-500 text-xs tracking-widest uppercase">
          LOADING NATIONAL DOSSIER...
        </div>
      }
    >
      <NationalTeamsContent />
    </Suspense>
  );
}

