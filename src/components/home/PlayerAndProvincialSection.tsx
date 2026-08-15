'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProvincialSpotlightSection() {
  const provincialStories = [
    {
      id: 1,
      league: 'L1O MEN',
      title: 'Simcoe Secures Late Winner',
      blurb: 'A stunning stoppage-time strike keeps the championship dream alive in League1 Ontario action.',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      league: 'L1BC WOMEN',
      title: 'Surrey Surge Into Semifinals',
      blurb: 'Dominant defensive display anchors a crucial provincial tournament victory on the road.',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 3,
      league: 'L1QC MEN',
      title: 'Montreal Derby Ends Level',
      blurb: 'Intense rivalry matchup leaves both sides battling for vital table position down the stretch.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 4,
      league: 'L1O WOMEN',
      title: 'Ottawa Striker Sets Record',
      blurb: 'Clinical finishing highlights an unforgettable afternoon at Barlow field.',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 5,
      league: 'PLSQ',
      title: 'Quebec Squad Clinches Berth',
      blurb: 'Tactical discipline and relentless pressure pay off in a five-goal thriller.',
      image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 6,
      league: 'L1AB',
      title: 'Calgary Clash Lights Up Foothills',
      blurb: 'Late surge seals all three points in front of a roaring provincial crowd.',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section className="w-full bg-surface border border-border grid grid-cols-1 lg:grid-cols-4 grid-rows-none lg:grid-rows-3 gap-0 shadow-sm">
      {/* Left Side: Player Spotlight (Spans 2 columns by 3 rows) */}
      <Link
        href="/players/spotlight"
        className="lg:col-span-2 lg:row-span-3 relative group overflow-hidden bg-card border-r border-border flex flex-col justify-end p-6 md:p-8 min-h-[420px] lg:min-h-[500px]"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop"
            alt="Player Spotlight"
            fill
            className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500 opacity-20 dark:opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-end h-full">
          <div className="mb-auto">
            <span className="inline-block px-2.5 py-1 text-xs font-mono font-bold tracking-widest text-white bg-crimson uppercase">
              PLAYER SPOTLIGHT
            </span>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-charcoal dark:text-white mb-3 uppercase">
              Midfield Maestro Dominates Abroad
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 line-clamp-2 leading-relaxed">
              A comprehensive breakdown of tactical intelligence, defensive recovery rates, and progressive passing metrics making waves in Europe.
            </p>
            <div className="inline-flex items-center text-xs font-mono font-bold tracking-wider text-crimson dark:text-crimson group-hover:underline">
              [ READ MORE... ]
            </div>
          </div>
        </div>
      </Link>

      {/* Right Side: Provincial Leagues Carousel (Spans 2 columns by 3 rows) */}
      <div className="lg:col-span-2 lg:row-span-3 flex flex-col bg-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
            PROVINCIAL LEAGUES // WIRE
          </span>
          <span className="text-xs font-mono text-charcoal-soft uppercase">
            SWIPE ➔
          </span>
        </div>
        <div className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory h-full bg-surface">
          {provincialStories.map((story) => (
            <div
              key={story.id}
              className="min-w-[240px] md:min-w-[260px] w-[240px] md:w-[260px] flex-shrink-0 snap-start relative group flex flex-col justify-end p-5 border-r border-border bg-card overflow-hidden min-h-[420px] lg:min-h-[500px]"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500 opacity-20 dark:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
              </div>
              <div className="relative z-10 flex flex-col justify-end h-full">
                <div className="mb-auto">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest text-white bg-crimson uppercase">
                    {story.league}
                  </span>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-bold tracking-tight text-charcoal dark:text-white mb-2 uppercase line-clamp-2">
                    {story.title}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                    {story.blurb}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}