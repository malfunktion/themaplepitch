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

interface PlayerAsset {
  id: string | number;
  name: string;
  position: string;
  club?: string;
  league?: string;
  rating?: number;
  caps?: number;
  goals?: number;
  assists?: number;
  status?: string;
  number?: number;
}

interface WireArticle {
  id: string | number;
  title: string;
  summary?: string;
  source?: string;
  created_at?: string;
  league?: string;
}

function NationalTeamsContent() {
  const searchParams = useSearchParams();
  const [activeGender, setActiveGender] = useState<'MEN' | 'WOMEN'>('MEN');
  const [activeAge, setActiveAge] = useState<string>('SENIOR');

  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);
  const [squad, setSquad] = useState<PlayerAsset[]>([]);
  const [news, setNews] = useState<WireArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load Standings
  useEffect(() => {
    async function loadStandings() {
      const cpl = await getCplStandings();
      const nsl = await getNslStandings();
      setStandings(cpl);
      setNslStandings(nsl);
    }
    loadStandings();
  }, []);

  // Fetch Dynamic Squad & News from Supabase based on toggles
  useEffect(() => {
    async function fetchNationalData() {
      setIsLoading(true);
      const genderDb = activeGender === 'MEN' ? 'men' : 'women';
      const nationalTag = activeGender === 'MEN' ? 'CanMNT' : 'CanWNT';

      // 1. Fetch full roster pool from Supabase (up to 50 assets to capture entire imported pool)
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('gender', genderDb)
        .order('rating', { ascending: false })
        .limit(50);

      if (playerData && playerData.length > 0) {
        setSquad(playerData as PlayerAsset[]);
      } else {
        setSquad([]);
      }

      // 2. Fetch Latest Wire News
      const { data: newsData } = await supabase
        .from('news_wire')
        .select('*')
        .or(`league.eq.${nationalTag},tags.cs.{${nationalTag}}`)
        .order('created_at', { ascending: false })
        .limit(3);

      if (newsData) {
        setNews(newsData as WireArticle[]);
      }

      setIsLoading(false);
    }

    fetchNationalData();
  }, [activeGender, activeAge]);

  const activeGenderUpper = activeGender;

  // Split squad into Starting XI (Top 11) and Depth Pool (The rest of the imported assets)
  const startingXI = squad.slice(0, 11);
  const squadDepthPool = squad.slice(11);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-mono pb-16">
      {/* Top Header & Toggles */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 sticky top-0 z-30 backdrop-blur-md px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>CANADIAN SOCCER INTELLIGENCE</span>
              <span>//</span>
              <span className="text-crimson font-bold">NATIONAL DOSSIER</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white mt-1">
              {activeGender === 'MEN' ? 'CANMNT' : 'CANWNT'} // {activeAge} COMMAND CENTER
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Gender Toggle */}
            <div className="inline-flex bg-neutral-900 border border-neutral-800 rounded-sm p-0.5">
              <button
                onClick={() => setActiveGender('MEN')}
                className={`px-3 py-1 text-xs font-bold transition-colors ${
                  activeGender === 'MEN'
                    ? 'bg-crimson text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ MEN ]
              </button>
              <button
                onClick={() => setActiveGender('WOMEN')}
                className={`px-3 py-1 text-xs font-bold transition-colors ${
                  activeGender === 'WOMEN'
                    ? 'bg-crimson text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ WOMEN ]
              </button>
            </div>

            {/* Age Toggles */}
            <div className="inline-flex bg-neutral-900 border border-neutral-800 rounded-sm p-0.5">
              {['SENIOR', 'U-23', 'U-20', 'U-17'].map((age) => (
                <button
                  key={age}
                  onClick={() => setActiveAge(age)}
                  className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
                    activeAge === age
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* 1. Top Tier: Live Wire Dispatches */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-sm">
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <h3 className="text-xs font-bold text-neutral-300 tracking-wider">
                  LIVE PROGRAM DISPATCHES // {activeGender === 'MEN' ? '#CanMNT' : '#CanWNT'}
                </h3>
                <span className="text-[10px] text-crimson animate-pulse">● LIVE FEED</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {news.length > 0 ? (
                  news.map((item, idx) => (
                    <div key={item.id || idx} className="bg-neutral-900 border border-neutral-800 p-3 rounded-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] text-crimson font-bold block mb-1">{item.league || 'CANADA SOCCER'}</span>
                        <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                      </div>
                      <span className="text-[9px] text-neutral-500 mt-3 block">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent Dispatch'}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-6 text-center text-xs text-neutral-500">
                    No active dispatches found for this filter.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Middle Tier: Tactical Pitch (Starting XI) */}
            <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
                <h3 className="text-xs font-bold text-white tracking-wider">
                  TOP 11 STARTING SQUAD // DYNAMIC FORMATION MATRIX (4-3-3)
                </h3>
                <span className="text-[10px] text-neutral-400">AUTO-SORTED BY HIGHEST DB RATING</span>
              </div>

              {/* Soccer Pitch Graphic Area */}
              <div className="relative w-full h-[380px] bg-emerald-950/30 border border-emerald-800/40 rounded-sm flex flex-col justify-between p-4 overflow-hidden">
                {/* Field Markings */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-emerald-500/20" />
                  <div className="absolute w-full h-[1px] bg-emerald-500/20" />
                </div>

                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 text-xs text-neutral-400">
                    FETCHING SQUAD TELEMETRY FROM SUPABASE...
                  </div>
                ) : startingXI.length > 0 ? (
                  <>
                    {/* Forwards Row */}
                    <div className="flex justify-around items-center z-10">
                      {startingXI.filter(p => p.position?.includes('ST') || p.position?.includes('FW') || p.position?.includes('RW') || p.position?.includes('LW')).slice(0, 3).map((player, i) => (
                        <PlayerPitchNode key={player.id || i} player={player} />
                      ))}
                    </div>

                    {/* Midfielders Row */}
                    <div className="flex justify-around items-center z-10">
                      {startingXI.filter(p => p.position?.includes('CM') || p.position?.includes('AM') || p.position?.includes('DM') || p.position?.includes('LM') || p.position?.includes('RM')).slice(0, 3).map((player, i) => (
                        <PlayerPitchNode key={player.id || i} player={player} />
                      ))}
                    </div>

                    {/* Defenders Row */}
                    <div className="flex justify-around items-center z-10">
                      {startingXI.filter(p => p.position?.includes('CB') || p.position?.includes('LB') || p.position?.includes('RB') || p.position?.includes('FB')).slice(0, 4).map((player, i) => (
                        <PlayerPitchNode key={player.id || i} player={player} />
                      ))}
                    </div>

                    {/* Goalkeeper Row */}
                    <div className="flex justify-center items-center z-10">
                      {startingXI.filter(p => p.position?.includes('GK')).slice(0, 1).map((player, i) => (
                        <PlayerPitchNode key={player.id || i} player={player} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
                    No starting XI assets found in database for this filter.
                  </div>
                )}
              </div>
            </div>

            {/* 3. Bottom Tier: Substitutes & Squad Depth Pool (Full Dynamic Count) */}
            <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-sm">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
                <h3 className="text-xs font-bold text-white tracking-wider">
                  SUBSTITUTES & SQUAD DEPTH POOL ({squadDepthPool.length} ASSETS)
                </h3>
                <span className="text-[10px] text-neutral-400">SORTED BY POSITION DEPTH & RATING</span>
              </div>

              {squadDepthPool.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {squadDepthPool.map((player, idx) => (
                    <div key={player.id || idx} className="bg-neutral-900 border border-neutral-800 p-3 rounded-sm flex justify-between items-center hover:border-neutral-700 transition-colors">
                      <div>
                        <h4 className="font-mono text-xs font-bold text-white">{player.name}</h4>
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{player.club || player.league || 'Pro Club'} • <span className="text-crimson font-bold">{player.position}</span></p>
                      </div>
                      <span className="text-xs font-mono text-neutral-300 bg-neutral-800 px-2 py-1 rounded-sm">
                        {player.rating ? `${Number(player.rating).toFixed(1)} RTG` : `${player.caps || 0} CAPS`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-neutral-500">
                  All available squad assets are currently deployed in the Starting XI or no secondary depth assets found.
                </div>
              )}
            </div>

            {/* Rest of Dossier Modules */}
            <TacticalBlueprint />
            <TicketPortal />
            <TourCampsCalendar />
            <HonorRoll />
            <RosterRevolution />
            <DepthChart />
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
function PlayerPitchNode({ player }: { player: PlayerAsset }) {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="bg-neutral-900/95 border border-crimson/60 group-hover:border-crimson px-2.5 py-1.5 rounded text-center shadow-lg transition-all">
        <span className="text-[10px] font-mono font-bold text-white block leading-none">{player.name}</span>
        <span className="text-[8px] font-mono text-neutral-400 block mt-0.5">{player.position} • {player.rating ? `${Number(player.rating).toFixed(1)} RTG` : 'PRO'}</span>
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
