'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import SidebarStack from '@/components/sidebar/SidebarStack';
import DataStatus from '@/components/layout/DataStatus';
import Link from 'next/link';

// Subcomponents / Modules
import TacticalBlueprint from '@/components/national-teams/TacticalBlueprint';
import TicketPortal from '@/components/national-teams/TicketPortal';
import TourCampsCalendar from '@/components/national-teams/TourCampsCalendar';
import HonorRoll from '@/components/national-teams/HonorRoll';
import DepthChart from '@/components/national-teams/DepthChart';
import CoachingStaff from '@/components/national-teams/CoachingStaff';
import HistoricalRecords from '@/components/national-teams/HistoricalRecords';

interface PlayerAsset {
  id: string;
  name: string;
  number?: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD' | string;
  club?: string;
  caps: number;
  goals: number;
  assists: number;
  rating: number;
  status?: string;
  gender: 'men' | 'women';
  squad_type: string;
  slug?: string;
}

interface WireArticle {
  id: string;
  headline: string;
  summary: string;
  sourceName: string;
  publishedAt: string;
  league: string;
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
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize URL gender param changes
  useEffect(() => {
    if (urlGender === 'WOMEN' || urlGender === 'MEN') {
      setActiveGender(urlGender);
    }
  }, [urlGender]);

  // Fetch National Squad & Wire News dynamically from Database
  useEffect(() => {
    async function fetchNationalData() {
      setIsLoading(true);
      const genderDb = activeGender === 'MEN' ? 'men' : 'women';

      // 1. Fetch Squad Players for Active National Program
      const { data: playerData } = await supabase
        .from('players')
        .select('*')
        .eq('gender', genderDb)
        .eq('squad_type', activeAge)
        .order('rating', { ascending: false });

      if (playerData) {
        setSquad(playerData as PlayerAsset[]);
      }

      // 2. Fetch Latest Wire News tagged for active National Team
      const tag = activeGender === 'MEN' ? 'CANMNT' : 'CANWNT';
      const { data: newsData } = await supabase
        .from('news_wire')
        .select('*')
        .or(`league.eq.${tag},tags.cs.{${tag}}`)
        .order('created_at', { ascending: false })
        .limit(3);

      if (newsData) {
        setNews(newsData as WireArticle[]);
      }

      setIsLoading(false);
    }

    fetchNationalData();
  }, [activeGender, activeAge]);

  // Dynamic Computation: Top 11 Starters vs. Remaining Substitutes
  const startingXI = useMemo(() => squad.slice(0, 11), [squad]);
  const substitutes = useMemo(() => squad.slice(11), [squad]);

  // Sub-group Substitutes by Position
  const subsByPosition = useMemo(() => {
    return {
      GK: substitutes.filter((p) => p.position.includes('GK')),
      DEF: substitutes.filter((p) => p.position.includes('DEF') || p.position.includes('CB') || p.position.includes('LB') || p.position.includes('RB')),
      MID: substitutes.filter((p) => p.position.includes('MID') || p.position.includes('CM') || p.position.includes('CDM') || p.position.includes('CAM')),
      FWD: substitutes.filter((p) => p.position.includes('FWD') || p.position.includes('ST') || p.position.includes('RW') || p.position.includes('LW')),
    };
  }, [substitutes]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-16">
      {/* Program Selector Bar */}
      <div className="border-b border-neutral-800 bg-neutral-900/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
            <h1 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              NATIONAL PROGRAM DOSSIER // {activeGender}
            </h1>
          </div>

          {/* Gender Toggles */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 border border-neutral-800 rounded-sm">
            <button
              onClick={() => setActiveGender('MEN')}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-sm transition-all ${
                activeGender === 'MEN'
                  ? 'bg-crimson text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              [ CANMNT ]
            </button>
            <button
              onClick={() => setActiveGender('WOMEN')}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-sm transition-all ${
                activeGender === 'WOMEN'
                  ? 'bg-crimson text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              [ CANWNT ]
            </button>
          </div>

          {/* Age Tier Toggles */}
          <div className="flex items-center gap-1 text-xs font-mono">
            {(['SENIOR', 'U-23', 'U-20', 'U-17'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveAge(tier)}
                className={`px-2.5 py-1 border rounded-sm transition-colors ${
                  activeAge === tier
                    ? 'border-crimson text-crimson font-bold bg-crimson/10'
                    : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <DataStatus />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* MAIN 8-COLUMN CONTENT FEED */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* TIER 1: LIVE PROGRAM DISPATCHES (NEWS FROM THE WIRE) */}
            <section className="bg-neutral-900 border border-neutral-800 rounded-sm p-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
                <span className="text-xs font-mono text-crimson font-bold uppercase tracking-wider">
                  # {activeGender === 'MEN' ? 'CanMNT' : 'CanWNT'} INTELLIGENCE DISPATCHES
                </span>
                <Link href="/the-wire" className="text-[10px] font-mono text-neutral-400 hover:text-crimson">
                  VIEW ALL WIRE ARTICLES ➔
                </Link>
              </div>

              {news.length === 0 ? (
                <p className="text-xs font-mono text-neutral-500 py-4">No recent dispatches logged for this national program stream.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {news.map((item) => (
                    <div key={item.id} className="bg-neutral-950 p-3 border border-neutral-800/80 rounded-sm hover:border-neutral-700 transition-colors">
                      <span className="text-[9px] font-mono text-crimson uppercase">{item.sourceName || 'THE WIRE'}</span>
                      <h3 className="text-xs font-bold text-white mt-1 line-clamp-2">{item.headline}</h3>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{item.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* TIER 2: TACTICAL PITCH GRAPHIC (HIGHEST RATED XI ON THE FIELD) */}
            <section className="bg-neutral-900 border border-neutral-800 rounded-sm p-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
                <span className="text-xs font-mono text-white font-bold uppercase tracking-wider">
                  TOP 11 STARTING SQUAD // DYNAMIC FORMATION MATRIX
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  AUTO-SORTED BY HIGHEST DB RATING
                </span>
              </div>

              {/* Vector Soccer Field Drawing */}
              <div className="relative w-full aspect-[16/10] bg-emerald-950/40 border-2 border-emerald-800/50 rounded-md overflow-hidden p-4 flex flex-col justify-between">
                {/* Field Markings */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-emerald-700/40" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-emerald-700/40 rounded-full" />
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-48 h-20 border-b border-x border-emerald-700/40" />
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-48 h-20 border-t border-x border-emerald-700/40" />

                {/* Starting 11 Node Overlay Grid */}
                <div className="relative z-10 h-full flex flex-col justify-between py-2">
                  {/* Forwards Row */}
                  <div className="flex justify-around items-center">
                    {startingXI.slice(8, 11).map((p) => (
                      <PlayerPitchNode key={p.id} player={p} />
                    ))}
                  </div>

                  {/* Midfielders Row */}
                  <div className="flex justify-around items-center">
                    {startingXI.slice(5, 8).map((p) => (
                      <PlayerPitchNode key={p.id} player={p} />
                    ))}
                  </div>

                  {/* Defenders Row */}
                  <div className="flex justify-around items-center">
                    {startingXI.slice(1, 5).map((p) => (
                      <PlayerPitchNode key={p.id} player={p} />
                    ))}
                  </div>

                  {/* Goalkeeper */}
                  <div className="flex justify-center items-center">
                    {startingXI.slice(0, 1).map((p) => (
                      <PlayerPitchNode key={p.id} player={p} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* TIER 3: SUBSTITUTES & SQUAD DEPTH MATRIX */}
            <section className="bg-neutral-900 border border-neutral-800 rounded-sm p-4">
              <div className="border-b border-neutral-800 pb-2 mb-4 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider">
                  SUBSTITUTES & SQUAD DEPTH POOL ({substitutes.length} ASSETS)
                </span>
                <span className="text-[10px] font-mono text-neutral-500">SORTED BY POSITION DEPTH</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['GK', 'DEF', 'MID', 'FWD'] as const).map((posGroup) => (
                  <div key={posGroup} className="bg-neutral-950 p-3 border border-neutral-800/60 rounded-sm">
                    <span className="text-[10px] font-mono text-crimson font-bold uppercase">{posGroup} DEPUTIES</span>
                    <div className="mt-2 flex flex-col divide-y divide-neutral-900">
                      {subsByPosition[posGroup].length === 0 ? (
                        <span className="text-[10px] font-mono text-neutral-600 py-1">No reserves listed</span>
                      ) : (
                        subsByPosition[posGroup].map((p, idx) => (
                          <div key={p.id} className="py-1.5 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-white">{p.name}</span>
                              <span className="text-[10px] text-neutral-500 ml-2">// {p.club || 'Unattached'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono">
                              <span className="text-neutral-400">{p.caps} caps</span>
                              <span className="text-crimson font-bold">{p.rating?.toFixed(1)} RTG</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Dossier Modules Stack */}
            <TacticalBlueprint />
            <TicketPortal />
            <TourCampsCalendar />
            <HonorRoll />
            <DepthChart />
            <CoachingStaff activeGender={activeGender} />
            <HistoricalRecords activeGender={activeGender} />
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <SidebarStack />
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
      <div className="bg-neutral-900/90 border border-crimson/60 group-hover:border-crimson px-2 py-1 rounded text-center shadow-lg transition-all">
        <span className="text-[10px] font-mono font-bold text-white block leading-none">{player.name}</span>
        <span className="text-[8px] font-mono text-neutral-400 block mt-0.5">{player.position} • {player.rating?.toFixed(1)} RTG</span>
      </div>
    </div>
  );
}

export default function NationalTeamsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-500 font-mono text-xs uppercase">LOADING NATIONAL DOSSIER...</div>}>
      <NationalTeamsContent />
    </Suspense>
  );
}
