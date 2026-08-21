'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Gender = 'MEN' | 'WOMEN';

type PlayerLeader = {
  rank: number;
  name: string;
  club: string;
  stat: string;
  initials: string;
  slug: string;
};

const menGoldenBoot: PlayerLeader[] = [
  { rank: 1, name: 'Terran Campbell', club: 'Forge FC', stat: '14 G', initials: 'TC', slug: 'terran-campbell' },
  { rank: 2, name: 'Moses Dyer', club: 'Vancouver FC', stat: '11 G', initials: 'MD', slug: 'moses-dyer' },
  { rank: 3, name: 'Brian Wright', club: 'York United', stat: '9 G', initials: 'BW', slug: 'brian-wright' },
  { rank: 4, name: 'Alejandro Díaz', club: 'Sogndal', stat: '8 G', initials: 'AD', slug: 'alejandro-diaz' },
  { rank: 5, name: 'Woobens Pacius', club: 'Nashville SC', stat: '7 G', initials: 'WP', slug: 'woobens-pacius' },
];

const womenGoldenBoot: PlayerLeader[] = [
  { rank: 1, name: 'Jorian Baucom', club: 'AFC Toronto', stat: '10 G', initials: 'JB', slug: 'jorian-baucom' },
  { rank: 2, name: 'Evelyne Viens', club: 'Roma', stat: '8 G', initials: 'EV', slug: 'evelyne-viens' },
  { rank: 3, name: 'Cloé Lacasse', club: 'Utah Royals', stat: '7 G', initials: 'CL', slug: 'cloe-lacasse' },
  { rank: 4, name: 'Clarissa Larisey', club: 'BK Häcken', stat: '6 G', initials: 'CL', slug: 'clarissa-larisey' },
  { rank: 5, name: 'Deanne Rose', club: 'Leicester City', stat: '5 G', initials: 'DR', slug: 'deanne-rose' },
];

const menPlaymakers: PlayerLeader[] = [
  { rank: 1, name: 'Kyle Bekker', club: 'Forge FC', stat: '9 AST', initials: 'KB', slug: 'kyle-bekker' },
  { rank: 2, name: 'Ollie Bassett', club: 'Atlético Ottawa', stat: '7 AST', initials: 'OB', slug: 'ollie-bassett' },
  { rank: 3, name: 'Alistair Johnston', club: 'Celtic', stat: '5 AST', initials: 'AJ', slug: 'alistair-johnston' },
  { rank: 4, name: 'Stephen Eustáquio', club: 'FC Porto', stat: '5 AST', initials: 'SE', slug: 'stephen-eustaquio' },
  { rank: 5, name: 'Tajon Buchanan', club: 'Villarreal', stat: '4 AST', initials: 'TB', slug: 'tajon-buchanan' },
];

const womenPlaymakers: PlayerLeader[] = [
  { rank: 1, name: 'Jessie Fleming', club: 'Portland Thorns', stat: '8 AST', initials: 'JF', slug: 'jessie-fleming' },
  { rank: 2, name: 'Ashley Lawrence', club: 'Chelsea', stat: '6 AST', initials: 'AL', slug: 'ashley-lawrence' },
  { rank: 3, name: 'Julia Grosso', club: 'Chicago Red Stars', stat: '5 AST', initials: 'JG', slug: 'julia-grosso' },
  { rank: 4, name: 'Gabrielle Carle', club: 'Washington Spirit', stat: '4 AST', initials: 'GC', slug: 'gabrielle-carle' },
  { rank: 5, name: 'Quinn', club: 'Seattle Reign', stat: '4 AST', initials: 'QU', slug: 'quinn' },
];

export default function StatsDashboard() {
  const [gender, setGender] = useState<Gender>('MEN');

  const goldenBootData = gender === 'MEN' ? menGoldenBoot : womenGoldenBoot;
  const playmakersData = gender === 'MEN' ? menPlaymakers : womenPlaymakers;

  return (
    <section className="bg-[#0a0a0a] border border-neutral-800 rounded-sm p-4 sm:p-5 text-white font-mono">
      {/* Header with Gender Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3 mb-4">
        <div>
          <div className="text-[9px] text-neutral-500 tracking-[0.2em] uppercase">
            TELEMETRY SIGNAL
          </div>
          <h2 className="text-sm font-bold uppercase tracking-tight text-neutral-100 mt-0.5">
            Global Form Tracker
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-[#171717] border border-neutral-800 p-1 rounded-sm">
          <button
            onClick={() => setGender('MEN')}
            className={`px-3 py-1 text-[9px] font-bold transition-colors rounded-sm ${
              gender === 'MEN'
                ? 'bg-red-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            [ MEN ]
          </button>
          <button
            onClick={() => setGender('WOMEN')}
            className={`px-3 py-1 text-[9px] font-bold transition-colors rounded-sm ${
              gender === 'WOMEN'
                ? 'bg-red-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            [ WOMEN ]
          </button>
        </div>
      </div>

      {/* 2-Column Grid for Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Golden Boot Table */}
        <div className="bg-[#171717] border border-neutral-800 rounded-sm p-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
            <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase">
              Golden Boot Race
            </span>
            <span className="text-[8px] text-neutral-500">TOP 5</span>
          </div>
          <div className="space-y-2">
            {goldenBootData.map((player) => (
              <div
                key={player.rank}
                className="flex items-center justify-between p-1.5 hover:bg-neutral-800/50 rounded-sm transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-neutral-500 w-3 font-bold shrink-0">
                    {player.rank}.
                  </span>
                  {/* Monochrome Avatar Square */}
                  <span className="w-6 h-6 rounded-sm bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-300 shrink-0">
                    {player.initials}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/players/${player.slug}`}
                      className="text-xs font-bold text-neutral-200 hover:text-red-500 truncate block transition-colors"
                    >
                      {player.name}
                    </Link>
                    <span className="text-[8px] text-neutral-500 truncate block">
                      {player.club}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-500 shrink-0 pl-2">
                  {player.stat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Playmakers Table */}
        <div className="bg-[#171717] border border-neutral-800 rounded-sm p-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
            <span className="text-[10px] font-bold text-neutral-300 tracking-wider uppercase">
              Top Playmakers
            </span>
            <span className="text-[8px] text-neutral-500">TOP 5</span>
          </div>
          <div className="space-y-2">
            {playmakersData.map((player) => (
              <div
                key={player.rank}
                className="flex items-center justify-between p-1.5 hover:bg-neutral-800/50 rounded-sm transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-neutral-500 w-3 font-bold shrink-0">
                    {player.rank}.
                  </span>
                  {/* Monochrome Avatar Square */}
                  <span className="w-6 h-6 rounded-sm bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-300 shrink-0">
                    {player.initials}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/players/${player.slug}`}
                      className="text-xs font-bold text-neutral-200 hover:text-red-500 truncate block transition-colors"
                    >
                      {player.name}
                    </Link>
                    <span className="text-[8px] text-neutral-500 truncate block">
                      {player.club}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-300 shrink-0 pl-2">
                  {player.stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-neutral-800 text-right">
        <Link
          href="/stats"
          className="text-[9px] text-red-500 hover:underline uppercase font-bold"
        >
          [ VIEW FULL STATS HUB ➔ ]
        </Link>
      </div>
    </section>
  );
}
