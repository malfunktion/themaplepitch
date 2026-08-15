'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface Prospect {
  rank: number;
  name: string;
  club: string;
  provincialLeague: string;
  position: string;
  rating: string;
  status: string;
  avatarUrl: string;
}

const menProspects: Prospect[] = [
  { rank: 1, name: 'Emil Nielsen', club: 'Simcoe County Rovers', provincialLeague: 'League1 Ontario', position: 'CM', rating: '8.4', status: '🔥 Riser', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' },
  { rank: 2, name: 'Liam Fraser', club: 'Scrosoppi FC', provincialLeague: 'League1 Ontario', position: 'CB', rating: '8.2', status: '⭐ Scout Pick', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
  { rank: 3, name: 'Kobe Da Silva', club: 'TSS Rovers', provincialLeague: 'L1BC', position: 'LW', rating: '8.0', status: '⚡ Fast Track', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop' },
  { rank: 4, name: 'Matteo Campagna', club: 'Whitecaps FC 2', provincialLeague: 'L1BC', position: 'CDM', rating: '7.9', status: '🛡️ Solid', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' },
  { rank: 5, name: 'Svyatik Artemenko', club: 'CS Saint-Laurent', provincialLeague: 'L1 Québec', position: 'GK', rating: '7.8', status: '🧤 Wall', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop' },
  { rank: 6, name: 'Jérémy Gagnon-Laparé', club: 'CF Montréal U23', provincialLeague: 'L1 Québec', position: 'CM', rating: '7.7', status: '🎯 Vision', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop' },
  { rank: 7, name: 'Thomas Craig', club: 'Forge FC Academy', provincialLeague: 'League1 Ontario', position: 'RB', rating: '7.6', status: '⚡ Fast Track', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop' },
  { rank: 8, name: 'Gaga Slonina Jr.', club: 'Simcoe Academy', provincialLeague: 'League1 Ontario', position: 'GK', rating: '7.5', status: '⭐ Elite Pot', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop' },
  { rank: 9, name: 'Christian Greco-Taylor', club: 'Pacific FC Pro-Am', provincialLeague: 'L1BC', position: 'LB', rating: '7.4', status: '🛡️ Solid', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop' },
  { rank: 10, name: 'James Thompson', club: 'Calgary Foothills', provincialLeague: 'L1 Alberta', position: 'ST', rating: '7.3', status: '🔥 Riser', avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=150&auto=format&fit=crop' },
];

const womenProspects: Prospect[] = [
  { rank: 1, name: 'Clara Dupont', club: 'AS Blainville', provincialLeague: 'L1 Québec', position: 'CAM', rating: '8.5', status: '🔥 Riser', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop' },
  { rank: 2, name: 'Maya Ladhani', club: 'NDC Ontario', provincialLeague: 'League1 Ontario', position: 'CM', rating: '8.3', status: '⭐ NSL Bound', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
  { rank: 3, name: 'Annabelle Chukwu', club: 'NDC Ontario', provincialLeague: 'League1 Ontario', position: 'ST', rating: '8.2', status: '⚡ Fast Track', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop' },
  { rank: 4, name: 'Sierra Kitson', club: 'Burnaby FC', provincialLeague: 'L1BC', position: 'CB', rating: '8.0', status: '🛡️ Solid', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' },
  { rank: 5, name: 'Kayla Briggs', club: 'Simcoe County', provincialLeague: 'League1 Ontario', position: 'W', rating: '7.9', status: '🎯 Creator', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=150&auto=format&fit=crop' },
  { rank: 6, name: 'Noelle Adams', club: 'TSS Rovers', provincialLeague: 'L1BC', position: 'CM', rating: '7.8', status: '⭐ Scout Pick', avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=150&auto=format&fit=crop' },
  { rank: 7, name: 'Florence Laroche', club: 'CS Saint-Laurent', provincialLeague: 'L1 Québec', position: 'GK', rating: '7.7', status: '🧤 Wall', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150&auto=format&fit=crop' },
  { rank: 8, name: 'Renee Watson', club: 'Calgary Foothills', provincialLeague: 'L1 Alberta', position: 'LB', rating: '7.5', status: '🔥 Riser', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' },
  { rank: 9, name: 'Olivia Smith-Wong', club: 'Scrosoppi FC', provincialLeague: 'League1 Ontario', position: 'RW', rating: '7.4', status: '⚡ Fast Track', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop' },
  { rank: 10, name: 'Chloe Briand', club: 'FC Laval', provincialLeague: 'L1 Québec', position: 'CDM', rating: '7.3', status: '🛡️ Solid', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' },
];

export default function YouthToProPipeline() {
  const [gender, setGender] = useState<'MEN' | 'WOMEN'>('MEN');
  const activeList = gender === 'MEN' ? menProspects : womenProspects;
  const spotlightProspect = activeList[0];

  return (
    <div className="bg-card border border-border rounded-none p-5 text-charcoal dark:text-white flex flex-col justify-between shadow-sm relative group overflow-hidden">
      
      {/* Top Header Row with Title, Saturated Image Spotlight Graphic Pill, and Gender Toggle */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between pb-4 border-b border-border gap-4">
        
        {/* Section Title Area */}
        <div>
          <span className="text-[10px] font-mono tracking-widest text-crimson uppercase block mb-1">
            GRASSROOTS TO PRO-AM // PIPELINE SCOUT
          </span>
          <h2 className="text-xl font-bold tracking-tight uppercase text-charcoal dark:text-white">Youth-to-Pro Pipeline Tracker</h2>
        </div>

        {/* Featured Spotlight Graphic Pill with Rich Saturated Turf & Red Tones */}
        <div className="hidden lg:flex items-center gap-3 bg-neutral-100 dark:bg-neutral-900 border border-border dark:border-neutral-700/80 px-3 py-1.5 relative overflow-hidden group/pill flex-1 max-w-sm shadow-inner">
          <div className="absolute inset-0 z-0">
            <Image
              src={spotlightProspect.avatarUrl}
              alt={spotlightProspect.name}
              fill
              className="object-cover saturate-150 contrast-125 opacity-25 dark:opacity-45 group-hover/pill:opacity-50 dark:group-hover/pill:opacity-60 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 dark:from-neutral-950 via-neutral-100/90 dark:via-neutral-900/90 to-neutral-100/40 dark:to-neutral-900/40" />
          </div>
          
          <div className="relative z-10 flex items-center gap-3 w-full">
            <div className="w-2 h-8 bg-crimson flex-shrink-0 shadow-sm" />
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-mono text-crimson dark:text-crimson tracking-wider uppercase flex items-center gap-1.5 font-bold">
                <span>⭐ FEATURED SPOTLIGHT</span>
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span className="text-neutral-600 dark:text-neutral-300">{spotlightProspect.provincialLeague}</span>
              </div>
              <div className="text-xs font-mono font-bold text-charcoal dark:text-neutral-100 truncate">
                {spotlightProspect.name} <span className="text-charcoal-soft font-normal">({spotlightProspect.position})</span>
              </div>
            </div>
            <div className="text-right font-mono flex-shrink-0">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase">Rating</div>
              <div className="text-xs font-bold text-crimson dark:text-crimson">{spotlightProspect.rating}</div>
            </div>
          </div>
        </div>

        {/* Minimalist Gender Toggle */}
        <div className="flex items-center bg-neutral-200 dark:bg-neutral-900 border border-border dark:border-neutral-700 p-0.5 text-xs font-mono self-start xl:self-auto">
          <button
            onClick={() => setGender('MEN')}
            className={`px-3 py-1 transition-colors ${
              gender === 'MEN'
                ? 'bg-crimson text-white font-bold shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-charcoal dark:hover:text-white'
            }`}
          >
            MEN
          </button>
          <button
            onClick={() => setGender('WOMEN')}
            className={`px-3 py-1 transition-colors ${
              gender === 'WOMEN'
                ? 'bg-crimson text-white font-bold shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-charcoal dark:hover:text-white'
            }`}
          >
            WOMEN
          </button>
        </div>
      </div>

      {/* Table Data Grid */}
      <div className="my-2 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
              <th className="py-1.5 px-2">#</th>
              <th className="py-1.5 px-3">PROSPECT & CLUB</th>
              <th className="py-1.5 px-2">LEAGUE</th>
              <th className="py-1.5 px-2 text-center">POS</th>
              <th className="py-1.5 px-2 text-right">STATUS</th>
              <th className="py-1.5 px-2 text-right">SCORE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-neutral-800/60 text-xs font-mono">
            {activeList.map((item) => (
              <tr key={item.rank} className="hover:bg-neutral-100 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="py-1 px-2 text-charcoal-soft font-bold">{item.rank}</td>
                <td className="py-1 px-3 flex items-center gap-2.5">
                  <Image
                    src={item.avatarUrl}
                    alt={item.name}
                    width={24}
                    height={24}
                    className="rounded-sm object-cover saturate-125 contrast-125 border border-neutral-300 dark:border-neutral-700 flex-shrink-0"
                  />
                  <div>
                    <div className="font-bold text-charcoal dark:text-neutral-100 tracking-wide leading-tight">{item.name}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-none">{item.club}</div>
                  </div>
                </td>
                <td className="py-1 px-2 text-neutral-600 dark:text-neutral-400 text-[11px]">{item.provincialLeague}</td>
                <td className="py-1 px-2 text-center">
                  <span className="bg-neutral-200 dark:bg-neutral-900 border border-border dark:border-neutral-700 px-1.5 py-0.5 text-[10px] text-neutral-700 dark:text-neutral-300">
                    {item.position}
                  </span>
                </td>
                <td className="py-1 px-2 text-right text-[11px] text-neutral-600 dark:text-neutral-300 font-sans">
                  {item.status}
                </td>
                <td className="py-1 px-2 text-right font-bold text-crimson dark:text-crimson font-mono">
                  {item.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Link / Portal Indicator */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
        <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Top 10 Provincial Academy Standouts</span>
        <a
          href="#"
          className="text-crimson hover:text-crimson-dim transition-colors flex items-center gap-1 font-bold"
        >
          VIEW DETAILED PIPELINE DATABASE &rarr;
        </a>
      </div>
    </div>
  );
}