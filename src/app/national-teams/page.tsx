'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
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
  id?: string;
  number?: number;
  name: string;
  club?: string;
  position?: string;
  age?: number;
  caps?: number;
  ga?: string;
  status?: 'LOCKED' | 'UNTIED / DUAL-NAT' | 'INJURED' | string;
  gender?: string;
  squad_type?: string;
  slug?: string;
}

function NationalTeamsContent() {
  const searchParams = useSearchParams();
  const urlGender = searchParams.get('gender')?.toUpperCase() as 'MEN' | 'WOMEN' | null;

  const [activeGender, setActiveGender] = useState<'MEN' | 'WOMEN'>(
    urlGender === 'WOMEN' ? 'WOMEN' : 'MEN'
  );
  const [activeAge, setActiveAge] = useState<'SENIOR' | 'U-23' | 'U-20' | 'U-17'>('SENIOR');

  const [squadPool, setSquadPool] = useState<SquadPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);

  useEffect(() => {
    getCplStandings().then(setStandings);
    getNslStandings().then(setNslStandings);
  }, []);

  useEffect(() => {
    if (urlGender && (urlGender === 'MEN' || urlGender === 'WOMEN')) {
      setActiveGender(urlGender);
    }
  }, [urlGender]);

  useEffect(() => {
    async function fetchNationalSquad() {
      setLoading(true);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('gender', activeGender.toLowerCase())
        .eq('squad_type', activeAge)
        .limit(26);

      if (error) {
        console.error('Error fetching national squad:', error);
        setSquadPool([]);
      } else {
        setSquadPool(data || []);
      }
      setLoading(false);
    }

    fetchNationalSquad();
  }, [activeGender, activeAge]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-600 font-mono text-xs font-bold uppercase tracking-widest">
                [ NATIONAL TEAM DOSSIER ]
              </span>
              <DataStatus />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              {activeGender === 'MEN' ? 'CanMNT' : 'CanWNT'} Command Centre
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Gender Toggle */}
            <div className="inline-flex bg-neutral-900 border border-neutral-800 p-1 rounded-sm">
              <button
                onClick={() => setActiveGender('MEN')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-sm transition-colors ${
                  activeGender === 'MEN' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Men
              </button>
              <button
                onClick={() => setActiveGender('WOMEN')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-sm transition-colors ${
                  activeGender === 'WOMEN' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Women
              </button>
            </div>

            {/* Age Tier Toggle */}
            <div className="inline-flex bg-neutral-900 border border-neutral-800 p-1 rounded-sm">
              {(['SENIOR', 'U-23', 'U-20', 'U-17'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveAge(tier)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-sm transition-colors ${
                    activeAge === tier ? 'bg-neutral-800 text-red-500 border border-red-500/30' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Squad Roster Module */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-sm p-4">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-800/80 pb-2">
                <h2 className="text-sm font-mono font-bold uppercase text-neutral-200">
                  // ACTIVE CALL-UP ROSTER ({activeGender} - {activeAge})
                </h2>
                <span className="text-[10px] font-mono text-neutral-500">
                  COUNT: {squadPool.length} ASSETS
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase tracking-widest animate-pulse">
                  SYNCING NATIONAL ROSTER TELEMETRY...
                </div>
              ) : squadPool.length === 0 ? (
                <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">
                  NO ACTIVE PLAYER DOSSIERS RECORDED FOR THIS SQUAD SELECTION.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 text-[10px]">
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">PLAYER</th>
                        <th className="py-2 px-3">CLUB</th>
                        <th className="py-2 px-3">POS</th>
                        <th className="py-2 px-3 text-center">AGE</th>
                        <th className="py-2 px-3 text-center">CAPS</th>
                        <th className="py-2 px-3 text-center">G/A</th>
                        <th className="py-2 px-3 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
                      {squadPool.map((p, idx) => (
                        <tr key={p.id || idx} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-2.5 px-3 text-neutral-500">{p.number || idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-white">
                            {p.slug ? (
                              <Link href={`/players/${p.slug}`} className="hover:text-red-500 transition-colors">
                                {p.name}
                              </Link>
                            ) : (
                              p.name
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-neutral-400">{p.club || 'N/A'}</td>
                          <td className="py-2.5 px-3 text-neutral-400">{p.position || 'DF'}</td>
                          <td className="py-2.5 px-3 text-center text-neutral-400">{p.age || '--'}</td>
                          <td className="py-2.5 px-3 text-center text-neutral-400">{p.caps || 0}</td>
                          <td className="py-2.5 px-3 text-center text-neutral-400">{p.ga || '0/0'}</td>
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
