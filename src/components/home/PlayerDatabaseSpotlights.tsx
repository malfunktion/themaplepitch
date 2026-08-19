'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface SpotlightPlayer {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  gender?: 'men' | 'women';
  position: string;
  club: string;
  vitals: string;
  tag: string;
}

function slugify(name: string) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const defaultMenPlayers: SpotlightPlayer[] = [
  { id: '1', name: 'Alphonso Davies', position: 'LB / LM', club: 'Bayern Munich', vitals: '25 YRS // 55 CAPS', tag: 'CanMNT' },
  { id: '2', name: 'Jonathan David', position: 'ST', club: 'Lille OSC', vitals: '26 YRS // 54 CAPS', tag: 'CanMNT' },
  { id: '3', name: 'Stephen Eustáquio', position: 'CM', club: 'FC Porto', vitals: '29 YRS // 42 CAPS', tag: 'CanMNT' },
  { id: '4', name: 'Tajon Buchanan', position: 'RW / WB', club: 'Villarreal', vitals: '27 YRS // 40 CAPS', tag: 'CanMNT' },
  { id: '5', name: 'Ismaël Koné', position: 'CM', club: 'Marseille', vitals: '23 YRS // 26 CAPS', tag: 'CanMNT' },
  { id: '6', name: 'Alistair Johnston', position: 'RB', club: 'Celtic FC', vitals: '27 YRS // 48 CAPS', tag: 'CanMNT' },
  { id: '7', name: 'Maxim Tissot', position: 'LB', club: 'Forge FC', vitals: 'CPL // VETERAN', tag: 'CPL' },
  { id: '8', name: 'Tobias Warschewski', position: 'ST', club: 'Cavalry FC', vitals: 'CPL // GOLDEN BOOT', tag: 'CPL' },
];

const defaultWomenPlayers: SpotlightPlayer[] = [
  { id: '1', name: 'Jessie Fleming', position: 'CM', club: 'Portland Thorns', vitals: '28 YRS // 132 CAPS', tag: 'CanWNT' },
  { id: '2', name: 'Kadeisha Buchanan', position: 'CB', club: 'Chelsea FC', vitals: '30 YRS // 150 CAPS', tag: 'CanWNT' },
  { id: '3', name: 'Julia Grosso', position: 'CM', club: 'Chicago Red Stars', vitals: '25 YRS // 65 CAPS', tag: 'CanWNT' },
  { id: '4', name: 'Cloé Lacasse', position: 'RW', club: 'Utah Royals', vitals: '32 YRS // 38 CAPS', tag: 'CanWNT' },
  { id: '5', name: 'Evelyne Viens', position: 'ST', club: 'AS Roma', vitals: '29 YRS // 32 CAPS', tag: 'CanWNT' },
  { id: '6', name: 'Shelina Zadorsky', position: 'CB', club: 'West Ham United', vitals: '33 YRS // 101 CAPS', tag: 'CanWNT' },
  { id: '7', name: 'Jade Rose', position: 'CB', club: 'Harvard / CanWNT', vitals: '23 YRS // 22 CAPS', tag: 'CanWNT' },
  { id: '8', name: 'Jorian Baucom', position: 'ST', club: 'AFC Toronto', vitals: 'NSL // GOLDEN BOOT', tag: 'NSL' },
];

export default function PlayerDatabaseSpotlights({
  spotlights = [],
}: {
  spotlights?: SpotlightPlayer[];
}) {
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');

  const cmsMen = spotlights.filter((p) => p.gender === 'men');
  const cmsWomen = spotlights.filter((p) => p.gender === 'women');

  const menList = cmsMen.length > 0 ? cmsMen : defaultMenPlayers;
  const womenList = cmsWomen.length > 0 ? cmsWomen : defaultWomenPlayers;

  const activePlayers = activeTab === 'men' ? menList : womenList;

  return (
    <section className="w-full bg-card text-charcoal dark:text-white p-6 border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-border gap-4">
        <div>
          <span className="text-xs font-mono text-crimson tracking-widest uppercase">PLAYER DATABASE</span>
          <h2 className="text-xl font-bold tracking-tight text-charcoal dark:text-white">PROFILES // SPOTLIGHTS</h2>
        </div>
        <div className="flex items-center space-x-1 bg-neutral-200 dark:bg-card p-1 border border-border">
          <button
            onClick={() => setActiveTab('men')}
            className={`px-3 py-1 text-xs font-mono uppercase transition-colors ${
              activeTab === 'men' ? 'bg-crimson text-white font-bold shadow-sm' : 'text-neutral-600 dark:text-charcoal-soft hover:text-charcoal dark:hover:text-white'
            }`}
          >
            [ MEN ]
          </button>
          <button
            onClick={() => setActiveTab('women')}
            className={`px-3 py-1 text-xs font-mono uppercase transition-colors ${
              activeTab === 'women' ? 'bg-crimson text-white font-bold shadow-sm' : 'text-neutral-600 dark:text-charcoal-soft hover:text-charcoal dark:hover:text-white'
            }`}
          >
            [ WOMEN ]
          </button>
        </div>
      </div>

      <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 sm:pb-0 scrollbar-none">
        {activePlayers.map((player) => {
          const playerRoute = player.slug || slugify(player.name);
          const clubRoute = slugify(player.club);

          return (
            <div
              key={player._id || player.id || player.name}
              className="min-w-[260px] sm:min-w-0 w-[260px] sm:w-auto flex-shrink-0 snap-start bg-surface border border-border p-4 flex flex-col justify-between hover:border-crimson transition-colors group"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono bg-crimson/10 dark:bg-crimson/20 text-crimson px-2 py-0.5 border border-crimson/20 dark:border-crimson/30">
                    {player.tag}
                  </span>
                  <span className="text-[10px] font-mono text-charcoal-soft">{player.vitals}</span>
                </div>
                <h3 className="text-sm font-bold tracking-tight text-charcoal dark:text-white">
                  <Link
                    href={`/players/${playerRoute}`}
                    className="hover:text-crimson transition-colors block truncate"
                  >
                    {player.name}
                  </Link>
                </h3>
                <p className="text-xs font-mono text-neutral-600 dark:text-charcoal-soft mt-1">{player.position}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-[11px] font-mono text-neutral-600 dark:text-charcoal-soft">
                <Link
                  href={`/teams/${clubRoute}`}
                  className="hover:text-crimson hover:underline truncate mr-2"
                >
                  {player.club}
                </Link>
                <Link
                  href={`/players/${playerRoute}`}
                  className="text-crimson font-bold hover:underline shrink-0"
                >
                  DOSSIER ➔
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
