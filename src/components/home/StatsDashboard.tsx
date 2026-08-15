'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Activity, ChevronUp } from 'lucide-react';

export default function StatsDashboard() {
  const [showAll, setShowAll] = useState(false);

  const topScorers = [
    { rank: 1, name: "Jonathan David", team: "Lille", goals: 15, width: "100%" },
    { rank: 2, name: "Cyle Larin", team: "Mallorca", goals: 11, width: "75%" },
    { rank: 3, name: "Iké Ugbo", team: "Troyes", goals: 9, width: "60%" },
    { rank: 4, name: "Lucas Cavallini", team: "Puebla", goals: 7, width: "45%" },
    { rank: 5, name: "Theo Bair", team: "Motherwell", goals: 6, width: "35%" },
    { rank: 6, name: "Tani Oluwaseyi", team: "Minnesota", goals: 6, width: "35%" },
    { rank: 7, name: "Ayo Akinola", team: "MLS", goals: 5, width: "30%" },
    { rank: 8, name: "Jayden Nelson", team: "Rosenborg", goals: 5, width: "30%" },
    { rank: 9, name: "Liam Millar", team: "Hull City", goals: 4, width: "25%" },
    { rank: 10, name: "Junior Hoilett", team: "Hibernian", goals: 4, width: "25%" },
  ];

  const topAssists = [
    { rank: 1, name: "Alphonso Davies", team: "Bayern", assists: 8, width: "100%" },
    { rank: 2, name: "Stephen Eustáquio", team: "Porto", assists: 6, width: "75%" },
    { rank: 3, name: "Tajon Buchanan", team: "Inter", assists: 4, width: "50%" },
    { rank: 4, name: "Ali Ahmed", team: "Vancouver", assists: 4, width: "50%" },
    { rank: 5, name: "Mathieu Choinière", team: "Montreal", assists: 3, width: "35%" },
    { rank: 6, name: "Ismaël Kone", team: "Watford", assists: 3, width: "35%" },
    { rank: 7, name: "Jacob Shaffelburg", team: "Nashville", assists: 3, width: "35%" },
    { rank: 8, name: "Samuel Piette", team: "Montreal", assists: 2, width: "25%" },
    { rank: 9, name: "Nathan Saliba", team: "Montreal", assists: 2, width: "25%" },
    { rank: 10, name: "Joel Waterman", team: "Montreal", assists: 2, width: "25%" },
  ];

  // On mobile, show top 5 unless expanded; on desktop (lg+), show all 10
  const displayedScorers = showAll ? topScorers : topScorers.slice(0, 5);
  const displayedAssists = showAll ? topAssists : topAssists.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-sm p-3 flex flex-col gap-4 text-charcoal dark:text-white shadow-sm">
      {/* Top Section: Global Form Tracker */}
      <div className="flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-crimson dark:text-crimson" strokeWidth={1.5} />
            <h2 className="text-xs font-mono font-bold tracking-widest text-charcoal dark:text-white">GLOBAL FORM TRACKER</h2>
          </div>
          <Link 
            href="/stats" 
            className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-crimson dark:hover:text-crimson transition-colors"
          >
            [more]
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-1">
          {/* Golden Boot */}
          <div className="flex flex-col">
            <h3 className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest mb-0.5">[ GOLDEN BOOT RACE ]</h3>
            <div className="hidden lg:block">
              {topScorers.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between group py-[3px] border-b border-neutral-200 dark:border-neutral-900/40">
                  <div className="flex items-center gap-1.5 min-w-0 pr-1 flex-1">
                    <div className="w-4 h-4 bg-neutral-100 dark:bg-bg border border-border rounded-sm flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-crimson dark:group-hover:text-crimson transition-colors">{player.rank}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 min-w-0 overflow-hidden">
                      <span className="text-[11px] font-bold text-charcoal dark:text-neutral-200 truncate">{player.name}</span>
                      <span className="text-[8px] text-charcoal-soft truncate">{player.team}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <div className="w-8 h-1 bg-neutral-200 dark:bg-neutral-900 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-crimson dark:bg-crimson" style={{ width: player.width }} />
                    </div>
                    <span className="text-[11px] font-bold text-charcoal dark:text-white w-3 text-right font-mono">{player.goals}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="block lg:hidden">
              {displayedScorers.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between group py-[3px] border-b border-neutral-200 dark:border-neutral-900/40">
                  <div className="flex items-center gap-1.5 min-w-0 pr-1 flex-1">
                    <div className="w-4 h-4 bg-neutral-100 dark:bg-bg border border-border rounded-sm flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-crimson dark:group-hover:text-crimson transition-colors">{player.rank}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 min-w-0 overflow-hidden">
                      <span className="text-[11px] font-bold text-charcoal dark:text-neutral-200 truncate">{player.name}</span>
                      <span className="text-[8px] text-charcoal-soft truncate">{player.team}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <span className="text-[11px] font-bold text-charcoal dark:text-white w-3 text-right font-mono">{player.goals}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Playmakers */}
          <div className="flex flex-col mt-2 lg:mt-0">
            <h3 className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest mb-0.5">[ TOP PLAYMAKERS ]</h3>
            <div className="hidden lg:block">
              {topAssists.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between group py-[3px] border-b border-neutral-200 dark:border-neutral-900/40">
                  <div className="flex items-center gap-1.5 min-w-0 pr-1 flex-1">
                    <div className="w-4 h-4 bg-neutral-100 dark:bg-bg border border-border rounded-sm flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-crimson dark:group-hover:text-crimson transition-colors">{player.rank}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 min-w-0 overflow-hidden">
                      <span className="text-[11px] font-bold text-charcoal dark:text-neutral-200 truncate">{player.name}</span>
                      <span className="text-[8px] text-charcoal-soft truncate">{player.team}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <div className="w-8 h-1 bg-neutral-200 dark:bg-neutral-900 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-neutral-500 dark:bg-neutral-400" style={{ width: player.width }} />
                    </div>
                    <span className="text-[11px] font-bold text-charcoal dark:text-white w-3 text-right font-mono">{player.assists}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="block lg:hidden">
              {displayedAssists.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between group py-[3px] border-b border-neutral-200 dark:border-neutral-900/40">
                  <div className="flex items-center gap-1.5 min-w-0 pr-1 flex-1">
                    <div className="w-4 h-4 bg-neutral-100 dark:bg-bg border border-border rounded-sm flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-crimson dark:group-hover:text-crimson transition-colors">{player.rank}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 min-w-0 overflow-hidden">
                      <span className="text-[11px] font-bold text-charcoal dark:text-neutral-200 truncate">{player.name}</span>
                      <span className="text-[8px] text-charcoal-soft truncate">{player.team}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <span className="text-[11px] font-bold text-charcoal dark:text-white w-3 text-right font-mono">{player.assists}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Expand Trigger */}
        <div className="block lg:hidden mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-center">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-crimson dark:text-crimson hover:underline flex items-center justify-center gap-1 w-full"
          >
            {showAll ? (
              <>COLLAPSE TOP 5 <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>VIEW FULL 10-PLAYER SCOUTING SHEET ➔</>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Section: Interactive Partner Spotlight Ad Slot */}
      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono px-1.5 py-0.5 border uppercase font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-600/40">
            [ PARTNER SPOTLIGHT ]
          </span>
          <span className="text-[9px] font-mono text-charcoal-soft">SPONSORED CONTENT</span>
        </div>
        <a 
          href="#" 
          className="relative group block overflow-hidden border border-border bg-surface rounded-sm transition-colors hover:border-neutral-400 dark:hover:border-neutral-700"
        >
          <div className="relative w-full aspect-[16/9] bg-neutral-100 dark:bg-black">
            <Image
              src="/ad.jpg"
              alt="Official Match Ball Partner"
              fill
              className="object-contain group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </a>
      </div>
    </div>
  );
}