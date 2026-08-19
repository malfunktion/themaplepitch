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
  id?: number | string;
  number?: number;
  name: string;
  club?: string;
  league?: string;
  position: string;
  age?: number;
  caps?: number;
  goals?: number;
  assists?: number;
  rating?: number;
  ga?: string;
  status?: 'LOCKED' | 'UNTIED / DUAL-NAT' | 'INJURED' | string;
  gender?: string;
  squad_type?: string;
}

interface WireArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  category: string;
  sourceUrl?: string;
}

function NationalTeamsContent() {
  const searchParams = useSearchParams();
  const urlGender = searchParams.get('gender')?.toUpperCase() as 'MEN' | 'WOMEN' | null;
  const [activeGender, setActiveGender] = useState<'MEN' | 'WOMEN'>(
    urlGender === 'WOMEN' ? 'WOMEN' : 'MEN'
  );
  const [activeAge, setActiveAge] = useState<'SENIOR' | 'U-23' | 'U-20' | 'U-17'>('SENIOR');

  const [squad, setSquad] = useState<PlayerAsset[]>([]);
  const [news, setNews] = useState<WireArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const standings: StandingsRow[] = getCplStandings();
  const nslStandings: StandingsRow[] = getNslStandings();

  // Sync gender with URL params if updated
  useEffect(() => {
    if (urlGender === 'WOMEN' || urlGender === 'MEN') {
      setActiveGender(urlGender);
    }
  }, [urlGender]);

  // Fetch complete squad pool and news wire dynamically from Supabase
  useEffect(() => {
    async function fetchNationalData() {
      setIsLoading(true);
      const genderDb = activeGender === 'MEN' ? 'men' : 'women';
      const nationalTag = activeGender === 'MEN' ? 'CanMNT' : 'CanWNT';

      // 1. Fetch entire active national squad pool without arbitrary limits
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('gender', genderDb)
        .eq('squad_type', activeAge)
        .order('rating', { ascending: false });

      if (playerError) {
        console.error('Error fetching national squad:', playerError);
      }

      if (playerData && playerData.length > 0) {
        setSquad(playerData as PlayerAsset[]);
      } else {
        // Fallback mock pool if DB is unseeded, ensuring full positional depth is visible
        setSquad([
          { id: 1, name: 'Alphonso Davies', position: 'LB', club: 'Bayern Munich', caps: 58, goals: 15, rating: 8.5, status: 'LOCKED' },
          { id: 2, name: 'Jonathan David', position: 'ST', club: 'Lille OSC', caps: 55, goals: 31, rating: 8.4, status: 'LOCKED' },
          { id: 3, name: 'Stephen Eustáquio', position: 'CM', club: 'FC Porto', caps: 42, goals: 4, rating: 8.1, status: 'LOCKED' },
          { id: 4, name: 'Tajon Buchanan', position: 'RW', club: 'Villarreal', caps: 40, goals: 8, rating: 8.0, status: 'LOCKED' },
          { id: 5, name: 'Alistair Johnston', position: 'RB', club: 'Celtic FC', caps: 48, goals: 2, rating: 7.9, status: 'LOCKED' },
          { id: 6, name: 'Cyle Larin', position: 'ST', club: 'RCD Mallorca', caps: 78, goals: 30, rating: 7.9, status: 'LOCKED' },
          { id: 7, name: 'Ismaël Koné', position: 'CM', club: 'Marseille', caps: 26, goals: 3, rating: 7.9, status: 'LOCKED' },
          { id: 8, name: 'Moïse Bombito', position: 'CB', club: 'Nice', caps: 18, goals: 1, rating: 7.8, status: 'LOCKED' },
          { id: 9, name: 'Jacob Shaffelburg', position: 'LW', club: 'Nashville SC', caps: 22, goals: 4, rating: 7.8, status: 'LOCKED' },
          { id: 10, name: 'Derek Cornelius', position: 'CB', club: 'Marseille', caps: 25, goals: 1, rating: 7.7, status: 'LOCKED' },
          { id: 11, name: 'Jonathan Osorio', position: 'CM', club: 'Toronto FC', caps: 75, goals: 9, rating: 7.7, status: 'LOCKED' },
          { id: 12, name: 'Maxime Crépeau', position: 'GK', club: 'Portland Timbers', caps: 22, rating: 7.7, status: 'LOCKED' },
          { id: 13, name: 'Dayne St. Clair', position: 'GK', club: 'Minnesota United', caps: 6, rating: 7.5, status: 'LOCKED' },
          { id: 14, name: 'Tom McGill', position: 'GK', club: 'Brighton', caps: 2, rating: 7.2, status: 'UNTIED / DUAL-NAT' },
          { id: 15, name: 'Joel Waterman', position: 'CB', club: 'CF Montréal', caps: 4, rating: 7.4, status: 'LOCKED' },
          { id: 16, name: 'Luc de Fougerolles', position: 'CB', club: 'Fulham', caps: 2, rating: 7.3, status: 'UNTIED / DUAL-NAT' },
          { id: 17, name: 'Richie Laryea', position: 'RB', club: 'Toronto FC', caps: 52, goals: 3, rating: 7.6, status: 'LOCKED' },
          { id: 18, name: 'Sam Adekugbe', position: 'LB', club: 'Vancouver Whitecaps', caps: 44, goals: 1, rating: 7.5, status: 'LOCKED' },
          { id: 19, name: 'Mathieu Choinière', position: 'CM', club: 'Grasshopper Zürich', caps: 6, rating: 7.5, status: 'LOCKED' },
          { id: 20, name: 'Nathan Saliba', position: 'CM', club: 'CF Montréal', caps: 2, rating: 7.4, status: 'LOCKED' },
          { id: 21, name: 'Liam Millar', position: 'LW', club: 'Preston North End', caps: 32, goals: 1, rating: 7.6, status: 'LOCKED' },
          { id: 22, name: 'Tani Oluwaseyi', position: 'ST', club: 'Minnesota United', caps: 5, goals: 1, rating: 7.6, status: 'LOCKED' },
        ]);
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

  // Starting XI (Top 11 highest rated) and Full Squad Depth Pool (Remaining players)
  const startingXI = squad.slice(0, 11);
  const squadDepthPool = squad.slice(11);

  // Group depth pool by position category
  const depthByPosition = {
    GK: squadDepthPool.filter(p => p.position?.toUpperCase().includes('GK')),
    DEF: squadDepthPool.filter(p => p.position?.toUpperCase().includes('DEF') || p.position?.toUpperCase().includes('CB') || p.position?.toUpperCase().includes('RB') || p.position?.toUpperCase().includes('LB')),
    MID: squadDepthPool.filter(p => p.position?.toUpperCase().includes('MID') || p.position?.toUpperCase().includes('CM') || p.position?.toUpperCase().includes('DM') || p.position?.toUpperCase().includes('AM')),
    FWD: squadDepthPool.filter(p => p.position?.toUpperCase().includes('FWD') || p.position?.toUpperCase().includes('ST') || p.position?.toUpperCase().includes('W') || p.position?.toUpperCase().includes('CF')),
  };

  const activeGenderUpper = activeGender;

  return (
    <div className="min-h-screen bg-neutral-950 text-foreground font-sans selection:bg-crimson selection:text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
              <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                NATIONAL TEAM COMMAND CENTER // {activeGender} ({activeAge})
              </span>
            </div>
            <h1 className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">
              CANADA SOCCER // {activeGender === 'MEN' ? 'CANMNT DOSSIER' : 'CANWNT DOSSIER'}
            </h1>
          </div>

          {/* Gender & Age Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-neutral-900 border border-border rounded-sm p-1">
              <button
                onClick={() => setActiveGender('MEN')}
                className={`px-3 py-1.5 font-mono text-xs uppercase font-bold transition-all ${
                  activeGender === 'MEN' ? 'bg-crimson text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ MEN ]
              </button>
              <button
                onClick={() => setActiveGender('WOMEN')}
                className={`px-3 py-1.5 font-mono text-xs uppercase font-bold transition-all ${
                  activeGender === 'WOMEN' ? 'bg-crimson text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ WOMEN ]
              </button>
            </div>

            <div className="flex bg-neutral-900 border border-border rounded-sm p-1">
              {(['SENIOR', 'U-23', 'U-20', 'U-17'] as const).map((ageGroup) => (
                <button
                  key={ageGroup}
                  onClick={() => setActiveAge(ageGroup)}
                  className={`px-2.5 py-1.5 font-mono text-xs uppercase font-bold transition-all ${
                    activeAge === ageGroup ? 'bg-neutral-800 text-white border border-border/80' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {ageGroup}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DataStatus />

        {/* Main 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* Left/Center Main Feed Column (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Top Tier: Live Wire Dispatches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {news.length > 0 ? (
                news.map((item) => (
                  <div key={item.id} className="bg-neutral-900/80 border border-border/60 p-4 rounded-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-crimson mb-2">
                        <span>{item.source}</span>
                        <span>{item.timestamp}</span>
                      </div>
                      <h3 className="font-mono text-xs font-bold text-white uppercase leading-snug mb-2">
                        {item.headline}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2">{item.summary}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-neutral-900/50 border border-border/40 p-4 rounded-sm text-center font-mono text-xs text-neutral-500">
                  LIVE WIRE DISPATCHES SYNCHRONIZING FOR {activeGender === 'MEN' ? '#CanMNT' : '#CanWNT'}...
                </div>
              )}
            </div>

            {/* Middle Tier: Tactical Pitch (Starting XI) */}
            <div className="bg-neutral-900/9il border border-border p-6 rounded-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-border/60 pb-3">
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                  TOP 11 STARTING SQUAD {'//'} AUTOMATED TACTICAL MATRIX ({startingXI.length} ASSETS)
                </h2>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">SORTED BY HIGHEST DB RATING</span>
              </div>

              {/* Pitch Graphic Area */}
              <div className="w-full bg-neutral-950 border border-border/80 rounded-sm p-6 relative min-h-[380px] flex flex-col justify-between items-center shadow-inner">
                {/* Tactical Field Markings */}
                <div className="absolute inset-0 border border-neutral-800/60 m-4 rounded pointer-events-none" />
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-neutral-800/60 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-neutral-800/60 pointer-events-none" />

                {/* Pitch Nodes Grid by Position Line */}
                <div className="w-full flex justify-center z-10 py-2">
                  <div className="flex gap-4">
                    {startingXI.filter(p => p.position?.toUpperCase().includes('GK')).map((player, idx) => (
                      <PlayerPitchNode key={player.id || idx} player={player} />
                    ))}
                  </div>
                </div>

                <div className="w-full flex justify-around z-10 py-2">
                  {startingXI.filter(p => p.position?.toUpperCase().includes('DEF') || p.position?.toUpperCase().includes('B')).map((player, idx) => (
                    <PlayerPitchNode key={player.id || idx} player={player} />
                  ))}
                </div>

                <div className="w-full flex justify-around z-10 py-2">
                  {startingXI.filter(p => p.position?.toUpperCase().includes('MID') || p.position?.toUpperCase().includes('M')).map((player, idx) => (
                    <PlayerPitchNode key={player.id || idx} player={player} />
                  ))}
                </div>

                <div className="w-full flex justify-around z-10 py-2">
                  {startingXI.filter(p => p.position?.toUpperCase().includes('FWD') || p.position?.toUpperCase().includes('ST') || p.position?.toUpperCase().includes('W')).map((player, idx) => (
                    <PlayerPitchNode key={player.id || idx} player={player} />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Tier: Substitutes & Full Squad Depth Matrix */}
            <div className="bg-neutral-900/90 border border-border p-6 rounded-sm">
              <div className="flex justify-between items-center mb-6 border-b border-border/60 pb-3">
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                  SUBSTITUTES & SQUAD DEPTH POOL ({squadDepthPool.length} ASSETS) {'//'} POSITION GROUPINGS
                </h2>
                <span className="text-xs font-mono text-neutral-500">FULL SQUAD ROSTER SYNCED</span>
              </div>

              {/* Grouped Position Render */}
              <div className="space-y-6">
                {Object.entries(depthByPosition).map(([posGroup, players]) => (
                  players.length > 0 && (
                    <div key={posGroup} className="space-y-3">
                      <div className="flex items-center gap-2 border-l-2 border-crimson pl-2">
                        <h3 className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-widest">
                          [ {posGroup} DEPUTIES & RESERVES ({players.length}) ]
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {players.map((player, idx) => (
                          <div 
                            key={player.id || idx} 
                            className="bg-neutral-950/80 border border-border/50 p-3 rounded-sm flex justify-between items-center hover:border-crimson/50 transition-colors"
                          >
                            <div>
                              <h4 className="font-mono text-xs font-bold text-white">{player.name}</h4>
                              <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                                {player.club || player.league || 'Pro Club'} • <span className="text-crimson font-bold">{player.position}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono font-bold text-neutral-300 block">
                                {player.rating ? `${Number(player.rating).toFixed(1)} RTG` : `${player.caps || 0} CAPS`}
                              </span>
                              <span className="text-[9px] font-mono text-neutral-500 block uppercase">
                                {player.status || 'ACTIVE'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Subcomponents Stack */}
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

          {/* Right Sidebar Column (4 Columns) */}
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
      <div className="bg-neutral-900/95 border border-crimson/60 group-hover:border-crimson px-3 py-2 rounded text-center shadow-lg transition-all">
        <span className="text-[11px] font-mono font-bold text-white block leading-none">{player.name}</span>
        <span className="text-[9px] font-mono text-neutral-400 block mt-1">
          {player.position} • {player.rating ? `${Number(player.rating).toFixed(1)} RTG` : 'PRO'}
        </span>
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
