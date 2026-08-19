// src/components/home/CollegiateWatchlist.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, ArrowRight } from 'lucide-react';

const collegiateWatchlistData = {
  MEN: [
    { name: 'J. Smith', school: 'Syracuse Univ.', league: 'NCAA D1', stats: '11 G • 3 A' },
    { name: 'T. Wright', school: 'Cape Breton', league: 'U SPORTS', stats: '9 G • 2 A' },
    { name: 'M. Rossi', school: 'Wake Forest', league: 'NCAA D1', stats: '7 G • 5 A' },
  ],
  WOMEN: [
    { name: 'S. Alarie', school: 'Penn State', league: 'NCAA D1', stats: '14 G • 4 A' },
    { name: 'C. Briand', school: 'Laval', league: 'U SPORTS', stats: '12 G • 2 A' },
    { name: 'M. Leon', school: 'Florida State', league: 'NCAA D1', stats: '10 G • 3 A' },
  ]
};

export default function CollegiateWatchlist() {
  const [gender, setGender] = useState<'MEN' | 'WOMEN'>('MEN');
  const activeList = collegiateWatchlistData[gender];

  return (
    <div className="bg-[#171717] border border-border rounded-sm p-4 h-full flex flex-col justify-between text-white">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-red-600" />
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-200">
              [ COLLEGIATE WATCHLIST ]
            </h3>
          </div>
          <div className="flex bg-card border border-neutral-800 p-0.5 rounded-sm">
            {(['MEN', 'WOMEN'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-sm transition-colors ${
                  gender === g ? 'bg-red-600 text-white' : 'text-charcoal-soft hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-neutral-800/60 my-2">
          {activeList.map((player, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-mono">
              <div>
                <p className="font-bold text-neutral-100">{player.name}</p>
                <p className="text-[9px] text-charcoal-soft">{player.school} • {player.league}</p>
              </div>
              <span className="text-red-500 font-bold">{player.stats}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/collegiate-pipeline"
        className="mt-2 pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono font-bold text-red-500 hover:text-red-400 transition-colors group"
      >
        <span>VIEW FULL COLLEGIATE TERMINAL</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
