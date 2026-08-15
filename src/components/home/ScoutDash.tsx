'use client';
import React, { useState } from 'react';
import type { StandingsRow } from '@/lib/types';

interface ScoutDashProps {
  standings?: StandingsRow[];
  nslStandings?: StandingsRow[];
}

export default function ScoutDash({ standings = [], nslStandings = [] }: ScoutDashProps) {
  const [leagueTab, setLeagueTab] = useState<'CPL' | 'NSL'>('CPL');

  const contractRadar = Array.from({ length: 10 }).map((_, i) => ({
    name: `Player ${i + 1}`,
    club: i % 2 === 0 ? 'Lille' : 'Porto',
    exp: `${Math.floor(Math.random() * 60) + 10} DAYS`,
  }));

  const activeStandings = leagueTab === 'CPL' ? standings : nslStandings;

  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400 border-b border-border dark:border-neutral-800 pb-2">
        <span>{/* SCOUT DASH */}[ SCOUTING DASHBOARD ]</span>
        <div className="flex gap-1">
          <button
            onClick={() => setLeagueTab('CPL')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
              leagueTab === 'CPL' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            CPL
          </button>
          <button
            onClick={() => setLeagueTab('NSL')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
              leagueTab === 'NSL' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            NSL
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
          {leagueTab} Standings
        </div>
        {activeStandings.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs font-mono py-1 border-b border-border/40 dark:border-neutral-800/40">
            <span className="text-foreground font-bold">{row.position ?? idx + 1}. {row.clubName}</span>
            <span className="text-neutral-400">{row.points} PTS</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 mt-2">
        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
          Contract Radar (Expiring)
        </div>
        <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
          {contractRadar.map((p, i) => (
            <div key={i} className="flex justify-between items-center text-xs font-mono bg-neutral-900/40 p-1.5 rounded-sm">
              <span className="text-foreground">{p.name} ({p.club})</span>
              <span className="text-red-600 font-bold">{p.exp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
