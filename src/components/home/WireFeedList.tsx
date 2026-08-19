'use client';
import React from 'react';
import Link from 'next/link';
import type { WireStory } from '@/lib/types';

interface WireFeedListProps {
  stories: WireStory[];
}

export default function WireFeedList({ stories }: WireFeedListProps) {
  return (
    <div className="h-full bg-card border border-border rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-charcoal-soft">
        <span>[ THE WIRE ]</span>
        <span className="text-crimson font-bold">LATEST</span>
      </div>
      <div className="flex flex-col divide-y divide-border dark:divide-neutral-800">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={story.sourceUrl || '#'}
            className="group py-2.5 first:pt-0 last:pb-0 flex flex-col gap-1"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-crimson">
              [ {story.league} ]
            </span>
            <h3 className="text-sm font-semibold text-charcoal dark:text-white leading-snug group-hover:text-crimson dark:group-hover:text-crimson transition-colors line-clamp-2">
              {story.headline}
            </h3>
            <span className="text-[11px] font-mono text-charcoal-soft">
              {story.sourceName}
            </span>
          </Link>
        ))}
        {stories.length === 0 && (
          <p className="text-xs text-charcoal-soft py-2">No dispatches yet.</p>
        )}
      </div>
    </div>
  );
}
