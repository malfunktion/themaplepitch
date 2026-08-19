'use client';

import React, { useState } from 'react';
import { Target, ChevronRight } from 'lucide-react';

type Prospect = {
  id: string;
  name: string;
  club: string;
  roots: string;
  status: 'UNTIED' | 'MONITORING' | 'ELIGIBLE';
};

const menProspects: Prospect[] = [
  { id: 'm1', name: 'Luca Koleosho', club: 'Burnaby FC', roots: 'ITA/CAN', status: 'UNTIED' },
  { id: 'm2', name: 'Daniel Jebbison', club: 'Bournemouth', roots: 'ENG/CAN', status: 'MONITORING' },
  { id: 'm3', name: 'Luc De Fougerolles', club: 'Fulham', roots: 'ENG/CAN', status: 'ELIGIBLE' },
  { id: 'm4', name: 'Aamir Simms', club: 'Monaco', roots: 'FRA/CAN', status: 'MONITORING' },
];

const womenProspects: Prospect[] = [
  { id: 'w1', name: 'Sydney Schertenleib', club: 'Barcelona B', roots: 'SUI/CAN', status: 'UNTIED' },
  { id: 'w2', name: 'Ava Collins', club: "St. John's", roots: 'NZL/CAN', status: 'ELIGIBLE' },
  { id: 'w3', name: 'Mya Jones', club: 'Memphis', roots: 'ENG/CAN', status: 'MONITORING' },
  { id: 'w4', name: 'Freya Godfrey', club: 'Arsenal U21', roots: 'ENG/CAN', status: 'UNTIED' },
];

export default function DualNationalRadar() {
  const [gender, setGender] = useState<'MEN' | 'WOMEN'>('MEN');
  const activeList = gender === 'MEN' ? menProspects : womenProspects;

  return (
    <div className="bg-card dark:bg-surface border border-border rounded-sm p-3 font-sans w-full">
      {/* Header: Stacked cleanly to prevent horizontal overflow */}
      <div className="flex flex-col gap-2 mb-3 border-b border-border pb-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] tracking-widest font-bold text-charcoal-soft uppercase flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-crimson dark:text-crimson flex-shrink-0" />
            Eligibility Watch
          </h3>
        </div>
        <div className="flex gap-1 bg-surface p-1 rounded-sm border border-border w-full">
          {(['MEN', 'WOMEN'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 text-[10px] tracking-widest font-bold py-1 rounded-sm text-center transition-colors ${
                gender === g 
                  ? 'bg-crimson text-white shadow-sm' 
                  : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
              }`}
            >
              [ {g} ]
            </button>
          ))}
        </div>
      </div>

      {/* Prospect List */}
      <div className="flex flex-col gap-1.5">
        {activeList.map((prospect) => (
          <div 
            key={prospect.id} 
            className="group flex justify-between items-center py-1 px-1.5 hover:bg-neutral-100 dark:hover:bg-card rounded-sm transition-colors cursor-pointer border border-transparent hover:border-border"
          >
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-bold text-charcoal dark:text-neutral-200 group-hover:text-crimson dark:group-hover:text-crimson transition-colors truncate">
                {prospect.name}
              </span>
              <span className="text-[9px] text-charcoal-soft uppercase tracking-wide truncate">
                {prospect.club} • {prospect.roots}
              </span>
            </div>
            <div className="flex items-center flex-shrink-0">
              <span className={`text-[8px] tracking-wider font-bold px-1.5 py-0.5 rounded-sm border whitespace-nowrap ${
                prospect.status === 'UNTIED' 
                  ? 'border-crimson/20 dark:border-crimson/40 text-crimson bg-crimson/10 dark:bg-crimson/20' :
                prospect.status === 'MONITORING' 
                  ? 'border-border text-charcoal-soft' :
                'border-border text-neutral-600 dark:text-neutral-300'
              }`}>
                {prospect.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="mt-2.5 pt-2 border-t border-border">
        <button className="text-[9px] font-bold text-crimson dark:text-crimson hover:text-charcoal dark:hover:text-white tracking-widest w-full text-left transition-colors flex items-center justify-between">
          <span>VIEW WATCHLIST</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}