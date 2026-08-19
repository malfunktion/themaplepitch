'use client';

import React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';

type ContractPlayer = {
  rank: string;
  name: string;
  club: string;
  position: string;
  expiry: string;
  timeLeft: string;
};

const contractPlayers: ContractPlayer[] = [
  { rank: '01', name: 'Jonathan David', club: 'Lille OSC', position: 'FW', expiry: 'JUN 2026', timeLeft: '45d left' },
  { rank: '02', name: 'Alphonso Davies', club: 'Bayern Munich', position: 'LB', expiry: 'JUN 2026', timeLeft: '45d left' },
  { rank: '03', name: 'Tajon Buchanan', club: 'Inter Milan', position: 'WB', expiry: 'JUN 2027', timeLeft: '340d left' },
  { rank: '04', name: 'Stephen Eustáquio', club: 'FC Porto', position: 'CM', expiry: 'JUN 2025', timeLeft: '120d left' },
  { rank: '05', name: 'Liam Millar', club: 'Hull City', position: 'LW', expiry: 'JUN 2026', timeLeft: '210d left' },
  { rank: '06', name: 'Ismaël Koné', club: 'Marseille', position: 'CM', expiry: 'JUN 2028', timeLeft: '500d left' },
  { rank: '07', name: 'Alistair Johnston', club: 'Celtic FC', position: 'RB', expiry: 'JUN 2027', timeLeft: '360d left' },
  { rank: '08', name: 'Moïse Bombito', club: 'Nice', position: 'CB', expiry: 'JUN 2028', timeLeft: '480d left' },
  { rank: '09', name: 'Derek Cornelius', club: 'Marseille', position: 'CB', expiry: 'JUN 2027', timeLeft: '310d left' },
  { rank: '10', name: 'Cyle Larin', club: 'Mallorca', position: 'FW', expiry: 'JUN 2025', timeLeft: '90d left' },
];

export default function ContractRadarWidget() {
  return (
    <div className="bg-card dark:bg-surface border border-border rounded-sm p-3 font-sans w-full">
      {/* Header: Stacked cleanly to prevent horizontal overflow */}
      <div className="flex flex-col gap-2 mb-3 border-b border-border pb-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] tracking-widest font-bold text-charcoal-soft uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-crimson dark:text-crimson flex-shrink-0" />
            Contract Radar // Expiring
          </h3>
        </div>
        <div className="flex justify-between items-center bg-surface px-2 py-1.5 rounded-sm border border-border w-full">
          <span className="text-[9px] tracking-widest font-bold text-charcoal-soft">STATUS</span>
          <span className="text-[9px] font-mono text-crimson font-bold bg-crimson/10 dark:bg-crimson/20 px-1.5 py-0.5 rounded-sm border border-crimson/20 dark:border-crimson/30">
            EXPIRING DEALS
          </span>
        </div>
      </div>

      {/* Scrollable Player List */}
      <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-none">
        {contractPlayers.map((player) => (
          <div 
            key={player.rank} 
            className="group flex justify-between items-center py-1.5 px-2 hover:bg-neutral-100 dark:hover:bg-card rounded-sm transition-colors cursor-pointer border border-transparent hover:border-border"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[10px] font-mono text-charcoal-soft dark:text-neutral-600 font-bold">{player.rank}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-charcoal dark:text-neutral-200 group-hover:text-crimson dark:group-hover:text-crimson transition-colors truncate">
                  {player.name}
                </span>
                <span className="text-[9px] text-charcoal-soft uppercase tracking-wide truncate">
                  {player.club} • {player.position}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 pl-2">
              <span className="text-[9px] font-mono font-bold text-charcoal dark:text-neutral-300">{player.expiry}</span>
              <span className="text-[8px] font-mono text-crimson dark:text-crimson">{player.timeLeft}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-border">
        <button className="text-[9px] font-bold text-charcoal-soft hover:text-crimson dark:hover:text-crimson tracking-widest w-full text-left transition-colors flex items-center justify-between">
          <span>STATUS: MONITORING</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}