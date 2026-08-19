'use client';

import React from 'react';
import type { WireStory } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface HeroDossierProps {
  story: WireStory;
}

export default function HeroDossier({ story }: HeroDossierProps) {
  const imageSrc = story.thumbnailUrl || "/topImage.jpg";

  return (
    <Link
      href={story.sourceUrl || '#'}
      className="block bg-card border border-border rounded-sm overflow-hidden relative group min-h-[420px] flex flex-col justify-end transition-colors hover:border-crimson/60 shadow-sm"
    >
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={story.headline}
          fill
          unoptimized
          className="object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 p-6 flex flex-col justify-end h-full">
        <div className="mb-auto">
          <span className="inline-block px-2 py-0.5 text-[10px] tracking-widest font-mono uppercase bg-crimson text-white font-semibold">
            [ {story.league || 'CPL'} {' // '} FEATURED ]
          </span>
        </div>
        <div className="mt-8">
          <h2 className="text-xl lg:text-2xl font-bold text-charcoal dark:text-white tracking-tight leading-snug mb-2 group-hover:text-crimson dark:group-hover:text-crimson transition-colors">
            {story.headline}
          </h2>
          <p className="text-xs lg:text-sm text-neutral-600 dark:text-charcoal-soft font-sans line-clamp-2 mb-4">
            {story.summary}
          </p>
          <div className="flex items-center text-xs font-mono font-semibold text-crimson dark:text-crimson group-hover:underline">
            [READ MORE...] ➔
          </div>
        </div>
      </div>
    </Link>
  );
}
