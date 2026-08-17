// src/components/home/ScoutDash.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { StandingsRow } from '@/lib/types';
import { Target } from 'lucide-react';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';

interface ScoutDashProps {  
  standings?: StandingsRow[];  
  nslStandings?: StandingsRow[];
}

export default function ScoutDash({ standings = [], nslStandings = [] }: ScoutDashProps) {  
  const [leagueTab, setLeagueTab] = useState<'CPL' | 'NSL'>('CPL');

  // Client-side state synchronized with props or live Supabase fetch
  const [cplRows, setCplRows] = useState<StandingsRow[]>(standings);
  const [nslRows, setNslRows] = useState<StandingsRow[]>(nslStandings);

  useEffect(() => {
    // If parent props weren't passed or are empty, fetch live data directly from Supabase
    if (!standings || standings.length === 0) {
      getCplStandings().then((data) => {
        if (data && data.length > 0) setCplRows(data);
      });
    } else {
      setCplRows(standings);
    }

    if (!nslStandings || nslStandings.length === 0) {
      getNslStandings().then((data) => {
        if (data && data.length > 0) setNslRows(data);
      });
    } else {
      setNslRows(nslStandings);
    }
  }, [standings, nslStandings]);

  // Fallback structures reflecting the true baseline: 8 clubs for CPL, 6 clubs for NSL
  const fallbackCpl: StandingsRow[] = [
    { position: 1, clubName: 'Forge FC', played: 20, points: 38, goalDifference: 14 },
    { position: 2, clubName: 'Cavalry FC', played: 20, points: 35, goalDifference: 12 },
    { position: 3, clubName: 'Atlético Ottawa', played: 20, points: 32, goalDifference: 8 },
    { position: 4, clubName: 'Pacific FC', played: 20, points: 28, goalDifference: 3 },
    { position: 5, clubName: 'York United FC', played: 20, points: 26, goalDifference: -1 },
    { position: 6, clubName: 'Vancouver FC', played: 20, points: 24, goalDifference: -4 },
    { position: 7, clubName: 'HFX Wanderers FC', played: 20, points: 22, goalDifference: -7 },
    { position: 8, clubName: 'Valour FC', played: 20, points: 18, goalDifference: -15 },
  ];

  const fallbackNsl: StandingsRow[] = [
    { position: 1, clubName: 'AFC Toronto', played: 15, points: 31, goalDifference: 16 },
    { position: 2, clubName: 'Roses de Montréal', played: 15, points: 28, goalDifference: 11 },
    { position: 3, clubName: 'Vancouver Rise', played: 15, points: 24, goalDifference: 4 },
    { position: 4, clubName: 'Calgary Wild', played: 15, points: 19, goalDifference: -3 },
    { position: 5, clubName: 'Ottawa Rapid', played: 15, points: 15, goalDifference: -8 },
    { position: 6, clubName: 'Halifax Tides', played: 15, points: 11, goalDifference: -14 },
  ];

  const rawStandings = leagueTab === 'CPL' ? cplRows : nslRows;
  const activeStandings = rawStandings && rawStandings.length > 0     
    ? rawStandings     
    : (leagueTab === 'CPL' ? fallbackCpl : fallbackNsl);

  const contractRadar = Array.from({ length: 6 }).map((_, i) => ({
    name: `Player Profile ${i + 1}`,
    club: i % 2 === 0 ? 'Lille OSC' : 'FC Porto',
    exp: `${Math.floor(Math.random() * 50) + 14} DAYS`,
  }));

  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400 border-b border-border dark:border-neutral-800 pb-2">
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-crimson" strokeWidth={1.5} />
          <span className="font-bold text-xs tracking-widest text-charcoal dark:text-white">SCOUT TERMINAL</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setLeagueTab('CPL')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
              leagueTab === 'CPL' ? 'bg-crimson text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            CPL (8)
          </button>
          <button
            onClick={() => setLeagueTab('NSL')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
              leagueTab === 'NSL' ? 'bg-crimson text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            NSL (6)
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-border/60 pb-1">
          <span>{leagueTab} Standings ({activeStandings.length} Clubs)</span>
          <span>Pts</span>
        </div>
        <div className="max-h-[260px] overflow-y-auto space-y-1 pr-1">
          {activeStandings.map((row, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs font-mono py-1.5 px-1 border-b border-border/40 dark:border-neutral-800/40 hover:bg-neutral-900/20 rounded-sm">
              <span className="text-foreground font-bold flex items-center gap-2">
                <span className="text-neutral-400 w-4 text-right">{row.position ?? idx + 1}.</span>
                <span className="truncate max-w-[150px]">{row.clubName || row.name}</span>
              </span>
              <span className="text-crimson font-bold">{row.points} PTS</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 mt-2">
        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-border/60 pb-1">
          Contract Radar (Expiring)
        </div>
        <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
          {contractRadar.map((p, i) => (
            <div key={i} className="flex justify-between items-center text-xs font-mono bg-neutral-900/40 p-1.5 rounded-sm">
              <span className="text-foreground">{p.name} ({p.club})</span>
              <span className="text-crimson font-bold">{p.exp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
