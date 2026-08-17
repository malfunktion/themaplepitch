// src/components/home/ScoutDash.tsx
'use client';
import React, { useState } from 'react';
import type { StandingsRow } from '@/lib/types';
import { Target } from 'lucide-react';

interface ScoutDashProps {
  standings?: StandingsRow[];
  nslStandings?: StandingsRow[];
}

export default function ScoutDash({ standings = [], nslStandings = [] }: ScoutDashProps) {
  const [leagueTab, setLeagueTab] = useState<'CPL' | 'NSL'>('CPL');

  const contractRadar = Array.from({ length: 6 }).map((_, i) => ({
    name: `Player Profile ${i + 1}`,
    club: i % 2 === 0 ? 'Lille OSC' : 'FC Porto',
    exp: `${Math.floor(Math.random() * 50) + 14} DAYS`,
  }));

  const activeStandings = leagueTab === 'CPL' ? standings : nslStandings;

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
            CPL
          </button>
          <button
            onClick={() => setLeagueTab('NSL')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
              leagueTab === 'NSL' ? 'bg-crimson text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            NSL
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-border/60 pb-1">
          <span>{leagueTab} Club</span>
          <span>Pts</span>
        </div>
        <div className="max-h-[240px] overflow-y-auto space-y-1 pr-1">
          {activeStandings && activeStandings.length > 0 ? (
            activeStandings.map((row, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-mono py-1.5 px-1 border-b border-border/40 dark:border-neutral-800/40 hover:bg-neutral-900/20 rounded-sm">
                <span className="text-foreground font-bold flex items-center gap-2">
                  <span className="text-neutral-400 w-4 text-right">{row.position ?? idx + 1}.</span>
                  <span className="truncate max-w-[150px]">{row.clubName}</span>
                </span>
                <span className="text-crimson font-bold">{row.points} PTS</span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-xs text-neutral-500 font-mono italic">
              No standings data available for {leagueTab}.
            </div>
          )}
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
