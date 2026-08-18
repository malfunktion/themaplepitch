'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SidebarStack from '@/components/sidebar/SidebarStack';
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
import DataStatus from '@/components/layout/DataStatus';
import { supabase } from '@/lib/supabase/client';

interface SquadPlayer {
  number: number;
  name: string;
  club: string;
  position: string;
  age: number;
  caps: number;
  ga: string;
  status: 'LOCKED' | 'UNTIED / DUAL-NAT' | 'INJURED';
  gender?: string;
}

const standings: StandingsRow[] = [
  { position: 1, clubName: "Forge FC", played: 0, points: 0, goalDifference: 0 },
  { position: 2, clubName: "Pacific FC", played: 0, points: 0, goalDifference: 0 },
  { position: 3, clubName: "Cavalry FC", played: 0, points: 0, goalDifference: 0 },
  { position: 4, clubName: "Atlético Ottawa", played: 0, points: 0, goalDifference: 0 },
  { position: 5, clubName: "York United FC", played: 0, points: 0, goalDifference: 0 },
  { position: 6, clubName: "Valour FC", played: 0, points: 0, goalDifference: 0 },
  { position: 7, clubName: "HFX Wanderers FC", played: 0, points: 0, goalDifference: 0 },
  { position: 8, clubName: "Vancouver FC", played: 0, points: 0, goalDifference: 0 }
];

const nslStandings: StandingsRow[] = [
  { position: 1, clubName: "AFC Toronto", played: 0, points: 0, goalDifference: 0 },
  { position: 2, clubName: "Vancouver Rise FC", played: 0, points: 0, goalDifference: 0 },
  { position: 3, clubName: "Calgary Wild FC", played: 0, points: 0, goalDifference: 0 },
  { position: 4, clubName: "Halifax Tides FC", played: 0, points: 0, goalDifference: 0 },
  { position: 5, clubName: "Montreal Roses FC", played: 0, points: 0, goalDifference: 0 },
  { position: 6, clubName: "Ottawa Rapid FC", played: 0, points: 0, goalDifference: 0 }
];

function NationalTeamsContent() {
  const searchParams = useSearchParams();
  const urlGender = searchParams.get('gender')?.toUpperCase() as 'MEN' | 'WOMEN' | null;
  const [activeGender, setActiveGender] = useState<'MEN' | 'WOMEN'>(
    urlGender === 'WOMEN' ? 'WOMEN' : 'MEN'
  );
  const [activeAge, setActiveAge] = useState<'SENIOR' | 'U-23' | 'U-20' | 'U-17'>('SENIOR');
  const [squadPool, setSquadPool] = useState<SquadPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL search param changes
  useEffect(() => {
    if (urlGender === 'WOMEN' || urlGender === 'MEN') {
      setActiveGender(urlGender);
    }
  }, [urlGender]);

  // Fetch squad from Supabase based on active gender
  useEffect(() => {
    async function fetchNationalSquad() {
      setLoading(true);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('gender', activeGender.toLowerCase());

      if (error) {
        console.error("Error fetching squad:", error);
      } else {
        setSquadPool(data || []);
      }
      setLoading(false);
    }
    fetchNationalSquad();
  }, [activeGender]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-neutral-100">
      {/* Header & Program Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs font-mono text-red-500 tracking-widest uppercase mb-1">
            // CANADIAN NATIONAL TEAMS DOSSIER
          </div>
          <h1 className="text-3xl font-black tracking-tight">NATIONAL PROGRAM HUB</h1>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900 p-1 border border-neutral-800 rounded-sm">
          <button
            onClick={() => setActiveGender('MEN')}
            className={`px-4 py-1.5 text-xs font-mono font-bold transition-colors rounded-sm ${
              activeGender === 'MEN'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            [ MEN'S PROGRAM ]
          </button>
          <button
            onClick={() => setActiveGender('WOMEN')}
            className={`px-4 py-1.5 text-xs font-mono font-bold transition-colors rounded-sm ${
              activeGender === 'WOMEN'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            [ WOMEN'S PROGRAM ]
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-mono tracking-wide">
                {activeGender}’S SQUAD POOL ({activeAge})
              </h2>
              <div className="flex gap-1">
                {(['SENIOR', 'U-23', 'U-20', 'U-17'] as const).map((age) => (
                  <button
                    key={age}
                    onClick={() => setActiveAge(age)}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded border transition-colors ${
                      activeAge === age
                        ? 'bg-red-600/20 text-red-500 border-red-600/40'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center font-mono text-xs text-neutral-500 tracking-widest uppercase">
                LOADING SQUAD DATABASE...
              </div>
            ) : squadPool.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-neutral-500 tracking-widest uppercase">
                NO REGISTERED PROSPECTS FOUND IN SQUAD POOL.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500">
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">PLAYER</th>
                      <th className="py-2 px-3">CLUB</th>
                      <th className="py-2 px-3">POS</th>
                      <th className="py-2 px-3 text-right">AGE</th>
                      <th className="py-2 px-3 text-right">CAPS</th>
                      <th className="py-2 px-3 text-right">G/A</th>
                      <th className="py-2 px-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {squadPool.map((p, idx) => (
                      <tr key={idx} className="hover:bg-neutral-800/30 transition-colors">
                        <td className="py-2.5 px-3 text-neutral-500">{p.number || idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold">{p.name}</td>
                        <td className="py-2.5 px-3 text-neutral-400">{p.club}</td>
                        <td className="py-2.5 px-3 text-neutral-400">{p.position}</td>
                        <td className="py-2.5 px-3 text-right text-neutral-400">{p.age}</td>
                        <td className="py-2.5 px-3 text-right text-neutral-400">{p.caps}</td>
                        <td className="py-2.5 px-3 text-right text-neutral-400">{p.ga}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm border bg-red-500/10 text-red-500 border-red-500/30">
                            [ {p.status} ]
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Remaining modules & subcomponents */}
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

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <SidebarStack standings={standings} nslStandings={nslStandings} />
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
