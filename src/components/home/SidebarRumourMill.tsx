'use client';

import React, { useState } from 'react';
import { Radio, ArrowUpRight } from 'lucide-react';

type Rumour = {
  id: string;
  type: 'RUMOUR' | 'OFFICIAL' | 'SCOUTING';
  text: string;
  time: string;
};

const menRumours: Rumour[] = [
  { id: 'rm1', type: 'RUMOUR', text: 'David linked heavily with January Premier League switch.', time: '1H AGO' },
  { id: 'rm2', type: 'OFFICIAL', text: 'CPL academy product signs in Scandinavia.', time: '3H AGO' },
  { id: 'rm3', type: 'SCOUTING', text: 'European scouts tracked Forge vs Cavalry match.', time: '5H AGO' },
  { id: 'rm4', type: 'RUMOUR', text: 'Davies contract extension talks stall at Bayern.', time: '12H AGO' },
];

const womenRumours: Rumour[] = [
  { id: 'rw1', type: 'OFFICIAL', text: 'Vancouver Rise secure marquee signing.', time: '2H AGO' },
  { id: 'rw2', type: 'RUMOUR', text: 'Lacasse drawing interest from top NWSL sides.', time: '4H AGO' },
  { id: 'rw3', type: 'SCOUTING', text: 'NSL clubs recruiting U20 World Cup standouts.', time: '6H AGO' },
  { id: 'rw4', type: 'OFFICIAL', text: 'Buchanan signs short-term loan deal.', time: '14H AGO' },
];

export default function SidebarRumourMill() {
  const [gender, setGender] = useState<'MEN' | 'WOMEN'>('MEN');
  const activeList = gender === 'MEN' ? menRumours : womenRumours;

  return (
    <div className="bg-card border border-border rounded-sm p-3 font-sans w-full shadow-sm text-charcoal dark:text-white">
      {/* Header: Stacked cleanly to prevent horizontal overflow */}
      <div className="flex flex-col gap-2 mb-3 border-b border-border pb-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] tracking-widest font-bold text-neutral-500 dark:text-neutral-400 uppercase flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-crimson flex-shrink-0" />
            Transfer Ticker
          </h3>
        </div>
        <div className="flex gap-1 bg-neutral-200 dark:bg-bg p-1 rounded-sm border border-border w-full">
          {(['MEN', 'WOMEN'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 text-[10px] tracking-widest font-bold py-1 rounded-sm text-center transition-colors ${
                gender === g ? 'bg-crimson text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-500 hover:text-charcoal dark:hover:text-white'
              }`}
            >
              [ {g} ]
            </button>
          ))}
        </div>
      </div>

      {/* Rumour Ticker */}
      <div className="flex flex-col gap-2.5">
        {activeList.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-[9px] tracking-widest font-bold whitespace-nowrap ${
                item.type === 'OFFICIAL' ? 'text-green-600 dark:text-green-500' :
                item.type === 'RUMOUR' ? 'text-crimson dark:text-crimson' :
                'text-neutral-500 dark:text-neutral-400'
              }`}>
                {item.type}
              </span>
              <span className="text-[8px] font-mono text-neutral-400 dark:text-neutral-600 whitespace-nowrap">{item.time}</span>
            </div>
            <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-snug group-hover:text-charcoal dark:group-hover:text-white transition-colors">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="mt-2.5 pt-2 border-t border-border">
        <button className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-crimson dark:hover:text-crimson tracking-widest w-full text-left transition-colors flex items-center justify-between">
          <span>OPEN RUMOUR MILL</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}