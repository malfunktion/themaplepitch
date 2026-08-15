'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroStory {
  headline: string;
  summary: string;
  time: string;
  image: string;
}

interface Dispatch {
  id: string;
  timestamp: string;
  league: string;
  headline: string;
  url: string;
}

interface ProvincialHeroFoldProps {
  leagueName?: string;
  hero?: HeroStory;
  dispatches?: Dispatch[];
}

export default function ProvincialHeroFold({
  leagueName = 'Provincial League',
  hero,
  dispatches = [],
}: ProvincialHeroFoldProps) {
  const defaultHero: HeroStory = hero || {
    headline: 'Marquee Provincial Championship Match Set for Weekend Action',
    summary: 'Top-tier regional clubs prepare for a pivotal clash with playoff implications.',
    time: '2H AGO',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Hero Section - Converted to Next.js Image */}
      <div className="lg:col-span-2 bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm overflow-hidden flex flex-col justify-end relative min-h-[380px] p-6 group">
        <div className="absolute inset-0 z-0">
          <Image
            src={defaultHero.image}
            alt={defaultHero.headline}
            fill
            className="object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-300">
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">{leagueName}</span>
            <span>{' // '} {defaultHero.time}</span>
          </div>
          <h2 className="text-lg md:text-xl font-extrabold text-white leading-tight">
            {defaultHero.headline}
          </h2>
          <p className="text-xs text-neutral-300 line-clamp-2">
            {defaultHero.summary}
          </p>
        </div>
      </div>

      {/* Dispatches Side Stack */}
      <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-3">
        <div className="text-xs font-mono font-bold text-neutral-400 border-b border-border dark:border-neutral-800 pb-2 flex justify-between items-center">
          <span>[ PROVINCIAL DISPATCHES ]</span>
          <span className="text-red-600 ml-auto">LIVE</span>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[320px]">
          {dispatches.length > 0 ? (
            dispatches.map((d) => (
              <Link
                key={d.id}
                href={d.url || '#'}
                className="group block p-2 hover:bg-neutral-800/20 rounded transition-colors border-b border-border/40 dark:border-neutral-800/40 last:border-none"
              >
                <div className="text-[10px] font-mono text-neutral-400 mb-0.5">
                  {d.league} {'//'} {d.timestamp}
                </div>
                <div className="text-xs font-bold text-foreground group-hover:text-red-600 transition-colors leading-tight">
                  {d.headline}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-xs font-mono text-neutral-500 py-4 text-center">
              No active dispatches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
