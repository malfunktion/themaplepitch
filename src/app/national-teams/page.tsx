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
  status?: 'LOCKED' | 'UNTIED / DUAL-NAT' | 'INJURED' | 'ACTIVE';
  gender?: string;
  squad_type?: string;
}

interface WireArticle {
  id: string;
  headline: string;
  summary: string;
  league: string;
  sourceName: string;
  timestamp: string;
}

function NationalTeamsContent() {
  const searchParams = useSearchParams();
  const urlGender = searchParams.get('gender')?.toUpperCase() as 'MEN' | 'WOMEN' | null;

  const [activeGender, setActiveGender] = useState<'MEN' | 'WOMEN'>(
    urlGender === 'WOMEN' ? 'WOMEN' : 'MEN'
  );
  const [activeAge, setActiveAge] = useState<'SENIOR' | 'U-23' | 'U-20' | 'U-17'>('SENIOR');
  const [squad, setSquad] = useState<SquadPlayer[]>([]);
  const [news, setNews] = useState<WireArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state if URL search param changes
  useEffect(() => {
    if (urlGender === 'WOMEN' || urlGender === 'MEN') {
      setActiveGender(urlGender);
    }
  }, [urlGender]);

  // Fetch complete dynamic data from Supabase
  useEffect(() => {
    async function fetchNationalData() {
      setIsLoading(true);
      const genderDb = activeGender === 'MEN' ? 'men' : 'women';
      const nationalTag = activeGender === 'MEN' ? 'CanMNT' : 'CanWNT';

      // Pull up to 45 players to ensure the entire squad pool is captured
      const { data: playerData } = await supabase
        .from('players')
        .select('*')
        .eq('gender', genderDb)
        .eq('squad_type', activeAge)
        .or(`metadata->>national_team.eq.${nationalTag},team_id.not.is.null`)
        .order('rating', { ascending: false })
        .limit(45);

      if (playerData && playerData.length > 0) {
        setSquad(playerData as SquadPlayer[]);
      } else {
        // Fallback mock array if offline/empty
        setSquad([
          { name: 'Alphonso Davies', position: 'LB', club: 'Bayern Munich', rating: 8.5, caps: 58, status: 'LOCKED' },
          { name: 'Jonathan David', position: 'ST', club: 'Lille OSC', rating: 8.4, caps: 55, status: 'LOCKED' },
          { name: 'Stephen Eustáquio', position: 'CM', club: 'FC Porto', rating: 8.1, caps: 42, status: 'LOCKED' },
          { name: 'Tajon Buchanan', position: 'RW', club: 'Villarreal', rating: 8.0, caps: 40, status: 'LOCKED' },
          { name: 'Alistair Johnston', position: 'RB', club: 'Celtic FC', rating: 7.9, caps: 48, status: 'LOCKED' },
          { name: 'Ismaël Koné', position: 'CM', club: 'Marseille', rating: 7.9, caps: 26, status: 'LOCKED' },
          { name: 'Cyle Larin', position: 'ST', club: 'Mallorca', rating: 7.9, caps: 78, status: 'LOCKED' },
          { name: 'Moïse Bombito', position: 'CB', club: 'OGC Nice', rating: 7.8, caps: 18, status: 'LOCKED' },
          { name: 'Jacob Shaffelburg', position: 'LW', club: 'Nashville SC', rating: 7.8, caps: 22, status: 'LOCKED' },
          { name: 'Jonathan Osorio', position: 'CM', club: 'Toronto FC', rating: 7.7, caps: 75, status: 'LOCKED' },
          { name: 'Maxime Crépeau', position: 'GK', club: 'Portland Timbers', rating: 7.7, caps: 22, status: 'LOCKED' },
          { name: 'Dayne St. Clair', position: 'GK', club: 'Minnesota United', rating: 7.5, caps: 6, status: 'ACTIVE' },
          { name: 'Derek Cornelius', position: 'CB', club: 'Marseille', rating: 7.7, caps: 24, status: 'ACTIVE' },
          { name: 'Joel Waterman', position: 'CB', club: 'CF Montréal', rating: 7.4, caps: 4, status: 'ACTIVE' },
          { name: 'Mathieu Choinière', position: 'CM', club: 'Grasshopper', rating: 7.5, caps: 6, status: 'ACTIVE' },
          { name: 'Nathan Saliba', position: 'CM', club: 'CF Montréal', rating: 7.4, caps: 2, status: 'ACTIVE' },
          { name: 'Liam Millar', position: 'LW', club: 'Preston North End', rating: 7.6, caps: 32, status: 'ACTIVE' },
          { name: 'Richie Laryea', position: 'RWB', club: 'Toronto FC', rating: 7.6, caps: 52, status: 'ACTIVE' },
          { name: 'Tani Oluwaseyi', position: 'ST', club: 'Minnesota United', rating: 7.6, caps: 5, status: 'ACTIVE' },
          { name: 'Ali Ahmed', position: 'LM', club: 'Vancouver Whitecaps', rating: 7.5, caps: 8, status: 'ACTIVE' },
        ] as SquadPlayer[]);
      }

      // Fetch News Dispatches
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
  const sortedSquad = [...squad].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const startingXI = sortedSquad.slice(0, 11);
  const squadDepthPool = sortedSquad.slice(11);

  // Helper to group substitutes securely by position category
  const getSubsByPosition = (posCategory: 'GK' | 'DEF' | 'MID' | 'FWD') => {
    return squadDepthPool.filter(p => {
      const pos = (p.position || '').toUpperCase();
      if (posCategory === 'GK') return pos.includes('GK');
      if (posCategory === 'DEF') return pos.includes('CB') || pos.includes('LB') || pos.includes('RB') || pos.includes('FB') || pos.includes('DEF') || pos.includes('WB');
      if (posCategory === 'MID') return pos.includes('CM') || pos.includes('DM') || pos.includes('AM') || pos.includes('LM') || pos.includes('RM') || pos.includes('MID');
      if (posCategory === 'FWD') return pos.includes('ST') || pos.includes('FW') || pos.includes('LW') || pos.includes('RW') || pos.includes('W') || pos.includes('CF');
      return false;
    });
  };

  const gkDeputies = getSubsByPosition('GK');
  const defDeputies = getSubsByPosition('DEF');
  const midDeputies = getSubsByPosition('MID');
  const fwdDeputies = getSubsByPosition('FWD');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-mono">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header & Toggles */}
        <div className="border border-neutral-800 bg-neutral-900/50 p-6 mb-8 rounded-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <span className="text-xs text-red-500 font-bold uppercase tracking-widest">[ NATIONAL DOSSIER ]</span>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
                {activeGender === 'MEN' ? 'MEN’S NATIONAL PROGRAM' : 'WOMEN’S NATIONAL PROGRAM'}
              </h1>
            </div>
            
            {/* Gender Toggle */}
            <div className="flex gap-2 border border-neutral-800 p-1 bg-neutral-950">
              <button
                onClick={() => setActiveGender('MEN')}
                className={`px-4 py-1.5 text-xs uppercase transition-all ${
                  activeGender === 'MEN' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ CANMNT ]
              </button>
              <button
                onClick={() => setActiveGender('WOMEN')}
                className={`px-4 py-1.5 text-xs uppercase transition-all ${
                  activeGender === 'WOMEN' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ CANWNT ]
              </button>
            </div>
          </div>

          {/* Age Group Selector */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-800">
            {(['SENIOR', 'U-23', 'U-20', 'U-17'] as const).map((age) => (
              <button
                key={age}
                onClick={() => setActiveAge(age)}
                className={`px-3 py-1 text-xs uppercase border transition-all ${
                  activeAge === age
                    ? 'border-red-600 bg-red-600/10 text-red-500 font-bold'
                    : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Center Content Feed */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Tier 1: Wire Dispatches */}
            <div className="border border-neutral-800 bg-neutral-900/40 p-5 rounded-sm">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                // LIVE PROGRAM DISPATCHES ({activeGender === 'MEN' ? 'CANMNT' : 'CANWNT'})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {news.length > 0 ? (
                  news.map((item) => (
                    <div key={item.id} className="border border-neutral-800 bg-neutral-950 p-4 rounded-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] text-red-500 font-bold uppercase block mb-1">[{item.sourceName || 'THE WIRE'}]</span>
                        <h4 className="text-xs font-bold text-white mb-2 line-clamp-2">{item.headline}</h4>
                        <p className="text-[10px] text-neutral-400 line-clamp-2">{item.summary}</p>
                      </div>
                      <span className="text-[9px] text-neutral-600 mt-3 block">{item.timestamp || 'RECENT'}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-6 text-center text-xs text-neutral-500">
                    NO ACTIVE WIRE DISPATCHES FOUND FOR {activeGender === 'MEN' ? '#CANMNT' : '#CANWNT'}
                  </div>
                )}
              </div>
            </div>

            {/* Tier 2: Tactical Pitch (Starting XI) */}
            <div className="border border-neutral-800 bg-neutral-900/40 p-6 rounded-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                  TOP 11 STARTING SQUAD // DYNAMIC FORMATION MATRIX
                </h3>
                <span className="text-[10px] text-red-500 font-bold">AUTO-SORTED BY HIGHEST DB RATING</span>
              </div>

              {/* Vector Pitch Graphic */}
              <div className="relative w-full h-[420px] bg-neutral-950 border border-neutral-800 rounded-sm flex flex-col justify-between p-6 overflow-hidden">
                {/* Pitch Markings */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-neutral-800/80"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-neutral-800/80 rounded-full"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 border-b border-x border-neutral-800/80"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 border-t border-x border-neutral-800/80"></div>

                {/* Forwards */}
                <div className="flex justify-around items-center z-10">
                  {startingXI.slice(9, 11).map((p, idx) => (
                    <PlayerPitchNode key={idx} player={p} />
                  ))}
                </div>

                {/* Midfielders */}
                <div className="flex justify-around items-center z-10">
                  {startingXI.slice(5, 9).map((p, idx) => (
                    <PlayerPitchNode key={idx} player={p} />
                  ))}
                </div>

                {/* Defenders */}
                <div className="flex justify-around items-center z-10">
                  {startingXI.slice(1, 5).map((p, idx) => (
                    <PlayerPitchNode key={idx} player={p} />
                  ))}
                </div>

                {/* Goalkeeper */}
                <div className="flex justify-center items-center z-10">
                  {startingXI.slice(0, 1).map((p, idx) => (
                    <PlayerPitchNode key={idx} player={p} />
                  ))}
                </div>
              </div>
            </div>

            {/* Tier 3: Substitutes & Full Squad Depth Pool (Grouped by Position) */}
            <div className="border border-neutral-800 bg-neutral-900/40 p-6 rounded-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                  SUBSTITUTES & SQUAD DEPTH POOL ({squadDepthPool.length} ASSETS)
                </h3>
                <span className="text-[10px] text-red-500 font-bold">SORTED BY POSITION DEPTH</span>
              </div>

              {squadDepthPool.length > 0 ? (
                <div className="space-y-6">
                  
                  {/* GK DEPUTIES */}
                  {gkDeputies.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-red-500 mb-3 tracking-wide">
                        // GOALKEEPER DEPTH ({gkDeputies.length} ASSETS)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                              <th className="py-2 px-3">Player Name</th>
                              <th className="py-2 px-3">Club / League</th>
                              <th className="py-2 px-3 text-right">Caps</th>
                              <th className="py-2 px-3 text-right">Rating</th>
                              <th className="py-2 px-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gkDeputies.map((p, idx) => (
                              <tr key={p.id || idx} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                                <td className="py-2.5 px-3 font-bold text-white">{p.name}</td>
                                <td className="py-2.5 px-3 text-neutral-400">{p.club || p.league || 'Pro Club'}</td>
                                <td className="py-2.5 px-3 text-right text-neutral-300">{p.caps ?? 0}</td>
                                <td className="py-2.5 px-3 text-right text-red-400">{p.rating ? `${Number(p.rating).toFixed(1)} RTG` : 'PRO'}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm border bg-red-600/10 text-red-500 border-red-600/30">
                                    [ {p.status || 'ACTIVE'} ]
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* DEFENDER DEPUTIES */}
                  {defDeputies.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-red-500 mb-3 tracking-wide">
                        // DEFENDER DEPTH ({defDeputies.length} ASSETS)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                              <th className="py-2 px-3">Player Name</th>
                              <th className="py-2 px-3">Pos</th>
                              <th className="py-2 px-3">Club / League</th>
                              <th className="py-2 px-3 text-right">Caps</th>
                              <th className="py-2 px-3 text-right">Rating</th>
                              <th className="py-2 px-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {defDeputies.map((p, idx) => (
                              <tr key={p.id || idx} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                                <td className="py-2.5 px-3 font-bold text-white">{p.name}</td>
                                <td className="py-2.5 px-3 text-red-400">{p.position}</td>
                                <td className="py-2.5 px-3 text-neutral-400">{p.club || p.league || 'Pro Club'}</td>
                                <td className="py-2.5 px-3 text-right text-neutral-300">{p.caps ?? 0}</td>
                                <td className="py-2.5 px-3 text-right text-red-400">{p.rating ? `${Number(p.rating).toFixed(1)} RTG` : 'PRO'}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm border bg-red-600/10 text-red-500 border-red-600/30">
                                    [ {p.status || 'ACTIVE'} ]
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* MIDFIELDER DEPUTIES */}
                  {midDeputies.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-red-500 mb-3 tracking-wide">
                        // MIDFIELDER DEPTH ({midDeputies.length} ASSETS)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                              <th className="py-2 px-3">Player Name</th>
                              <th className="py-2 px-3">Pos</th>
                              <th className="py-2 px-3">Club / League</th>
                              <th className="py-2 px-3 text-right">Caps</th>
                              <th className="py-2 px-3 text-right">Rating</th>
                              <th className="py-2 px-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {midDeputies.map((p, idx) => (
                              <tr key={p.id || idx} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                                <td className="py-2.5 px-3 font-bold text-white">{p.name}</td>
                                <td className="py-2.5 px-3 text-red-400">{p.position}</td>
                                <td className="py-2.5 px-3 text-neutral-400">{p.club || p.league || 'Pro Club'}</td>
                                <td className="py-2.5 px-3 text-right text-neutral-300">{p.caps ?? 0}</td>
                                <td className="py-2.5 px-3 text-right text-red-400">{p.rating ? `${Number(p.rating).toFixed(1)} RTG` : 'PRO'}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm border bg-red-600/10 text-red-500 border-red-600/30">
                                    [ {p.status || 'ACTIVE'} ]
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* FORWARD DEPUTIES */}
                  {fwdDeputies.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-red-500 mb-3 tracking-wide">
                        // FORWARD DEPTH ({fwdDeputies.length} ASSETS)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                              <th className="py-2 px-3">Player Name</th>
                              <th className="py-2 px-3">Pos</th>
                              <th className="py-2 px-3">Club / League</th>
                              <th className="py-2 px-3 text-right">Caps</th>
                              <th className="py-2 px-3 text-right">Rating</th>
                              <th className="py-2 px-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fwdDeputies.map((p, idx) => (
                              <tr key={p.id || idx} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                                <td className="py-2.5 px-3 font-bold text-white">{p.name}</td>
                                <td className="py-2.5 px-3 text-red-400">{p.position}</td>
                                <td className="py-2.5 px-3 text-neutral-400">{p.club || p.league || 'Pro Club'}</td>
                                <td className="py-2.5 px-3 text-right text-neutral-300">{p.caps ?? 0}</td>
                                <td className="py-2.5 px-3 text-right text-red-400">{p.rating ? `${Number(p.rating).toFixed(1)} RTG` : 'PRO'}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm border bg-red-600/10 text-red-500 border-red-600/30">
                                    [ {p.status || 'ACTIVE'} ]
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="py-8 text-center text-xs text-neutral-500">
                  LOADING ENTIRE SQUAD POOL...
                </div>
              )}
            </div>

            {/* Additional Dossier Modules */}
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
            <SidebarStack />
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
      <div className="bg-neutral-900/95 border border-red-600/60 group-hover:border-red-600 px-2.5 py-1.5 rounded text-center shadow-lg transition-all">
        <span className="text-[10px] font-mono font-bold text-white block leading-none">{player.name}</span>
        <span className="text-[8px] font-mono text-neutral-400 block mt-0.5">
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
