'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  id: string;
  number?: number;
  name: string;
  club?: string;
  position: string;
  age?: number;
  caps?: number;
  goals?: number;
  assists?: number;
  gender?: string;
  squad_type?: string;
  ga?: string;
  status?: string;
}

function NationalTeamsContent() {
  const [activeGender, setActiveGender] = useState<'men' | 'women'>('men');
  const [activeAge, setActiveAge] = useState<'SENIOR' | 'U-23' | 'U-20' | 'U-17'>('SENIOR');
  const [players, setPlayers] = useState<SquadPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);

  // Fetch CPL & NSL standings for the sidebar
  useEffect(() => {
    getCplStandings().then(setStandings);
    getNslStandings().then(setNslStandings);
  }, []);

  // Fetch National Team squad based on Active Gender & Age filters
  useEffect(() => {
    async function fetchNationalSquad() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('gender', activeGender)
        .eq('squad_type', activeAge)
        .order('caps', { ascending: false })
        .limit(26); // Standard matchday squad cap

      if (error || !data || data.length === 0) {
        // Fallback squad pool if DB rows are not fully tagged yet
        const fallbackSquad: SquadPlayer[] = activeGender === 'men' 
          ? [
              { id: '1', number: 19, name: 'Alphonso Davies', club: 'Bayern Munich', position: 'LB', age: 25, caps: 54, goals: 15, assists: 18, ga: '15/18', status: 'LOCKED', gender: 'men', squad_type: 'SENIOR' },
              { id: '2', number: 9, name: 'Jonathan David', club: 'Lille OSC', position: 'ST', age: 26, caps: 56, goals: 31, assists: 12, ga: '31/12', status: 'LOCKED', gender: 'men', squad_type: 'SENIOR' },
              { id: '3', number: 7, name: 'Stephen Eustáquio', club: 'FC Porto', position: 'CM', age: 29, caps: 48, goals: 4, assists: 6, ga: '4/6', status: 'LOCKED', gender: 'men', squad_type: 'SENIOR' },
              { id: '4', number: 15, name: 'Moïse Bombito', club: 'OGC Nice', position: 'CB', age: 25, caps: 18, goals: 1, assists: 0, ga: '1/0', status: 'LOCKED', gender: 'men', squad_type: 'SENIOR' },
            ]
          : [
              { id: '5', number: 10, name: 'Jessie Fleming', club: 'Portland Thorns', position: 'CM', age: 27, caps: 132, goals: 20, assists: 15, ga: '20/15', status: 'LOCKED', gender: 'women', squad_type: 'SENIOR' },
              { id: '6', number: 14, name: 'Kadeisha Buchanan', club: 'Chelsea FC', position: 'CB', age: 30, caps: 140, goals: 6, assists: 3, ga: '6/3', status: 'LOCKED', gender: 'women', squad_type: 'SENIOR' },
              { id: '7', number: 1, name: 'Kailen Sheridan', club: 'San Diego Wave', position: 'GK', age: 30, caps: 50, goals: 0, assists: 0, ga: '0/0', status: 'LOCKED', gender: 'women', squad_type: 'SENIOR' },
            ];
        setPlayers(fallbackSquad);
      } else {
        setPlayers(data);
      }
      setLoading(false);
    }

    fetchNationalSquad();
  }, [activeGender, activeAge]);

  return (
    <div className="min-h-screen bg-[#121212] text-neutral-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Command Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-4 gap-4">
          <div>
            <DataStatus />
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono mt-1">
              NATIONAL PROGRAM COMMAND CENTER
            </h1>
          </div>

          {/* Gender & Age Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Gender Toggle */}
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-sm p-0.5 font-mono text-xs">
              <button
                onClick={() => setActiveGender('men')}
                className={`px-3 py-1 transition-colors ${
                  activeGender === 'men' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ MEN ]
              </button>
              <button
                onClick={() => setActiveGender('women')}
                className={`px-3 py-1 transition-colors ${
                  activeGender === 'women' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ WOMEN ]
              </button>
            </div>

            {/* Age Group Toggles */}
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-sm p-0.5 font-mono text-xs">
              {(['SENIOR', 'U-23', 'U-20', 'U-17'] as const).map((age) => (
                <button
                  key={age}
                  onClick={() => setActiveAge(age)}
                  className={`px-2.5 py-1 transition-colors ${
                    activeAge === age ? 'bg-neutral-800 text-red-500 font-bold border border-neutral-700' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid: 8-Column Feed + 4-Column Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filtered Active Squad Table */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-mono text-red-500 tracking-wider uppercase font-bold">
                  {activeGender === 'men' ? 'CANMNT' : 'CANWNT'} // {activeAge} SQUAD POOL
                </h2>
                <span className="text-[10px] font-mono text-neutral-400">
                  {players.length} REGISTERED SQUAD ASSETS
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs font-mono text-neutral-500">
                  SYNCING SQUAD TELEMETRY...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 text-[10px] uppercase">
                        <th className="py-2 px-2">#</th>
                        <th className="py-2 px-3">Player</th>
                        <th className="py-2 px-3">Pos</th>
                        <th className="py-2 px-3">Club</th>
                        <th className="py-2 px-3 text-right">Caps</th>
                        <th className="py-2 px-3 text-right">G / A</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((p, idx) => (
                        <tr key={p.id || idx} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                          <td className="py-2.5 px-2 text-neutral-500">{p.number || idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-white">{p.name}</td>
                          <td className="py-2.5 px-3 text-red-400">{p.position}</td>
                          <td className="py-2.5 px-3 text-neutral-400">{p.club || 'Unattached'}</td>
                          <td className="py-2.5 px-3 text-right text-neutral-300">{p.caps ?? 0}</td>
                          <td className="py-2.5 px-3 text-right text-neutral-400">
                            {p.ga ? p.ga : `${p.goals ?? 0} / ${p.assists ?? 0}`}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm border bg-red-500/10 text-red-500 border-red-500/30">
                              [ {p.status || 'ACTIVE'} ]
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Complete Dossier Modules Stack */}
            <TacticalBlueprint />
            <TicketPortal />
            <TourCampsCalendar />
            <HonorRoll />
            <RosterRevolution />
            <DepthChart />
            <CoachingStaff activeGender={activeGender} />
            <HistoricalRecords activeGender={activeGender} />
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
