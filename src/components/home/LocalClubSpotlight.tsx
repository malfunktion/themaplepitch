'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, ExternalLink } from 'lucide-react';

export default function LocalClubSpotlight() {
  const stories = [
    {
      id: 1,
      league: "CPL",
      title: "Building from the Ground Up: The Next Wave of Academies",
      readTime: "4 min",
      date: "Aug 05"
    },
    {
      id: 2,
      league: "NSL",
      title: "Northern Super League's Blueprint for Regional Engagement",
      readTime: "6 min",
      date: "Aug 04"
    },
    {
      id: 3,
      league: "GRASSROOTS",
      title: "The Pitch Desperately Needed: Infrastructure in Rural Communities",
      readTime: "5 min",
      date: "Aug 03"
    },
    {
      id: 4,
      league: "PROVINCIAL",
      title: "League1 Ontario Expansion: What It Means for Local Talent",
      readTime: "4 min",
      date: "Aug 02"
    },
    {
      id: 5,
      league: "CPL",
      title: "Supporters Culture on the Prairies: Inside the SG Stands",
      readTime: "7 min",
      date: "Aug 01"
    },
    {
      id: 6,
      league: "NSL",
      title: "Coaching Pathways: Elevating Women in Technical Staff",
      readTime: "5 min",
      date: "Jul 31"
    },
    {
      id: 7,
      league: "GRASSROOTS",
      title: "Winter Training Solutions: Surviving the Canadian Elements",
      readTime: "4 min",
      date: "Jul 30"
    },
    {
      id: 8,
      league: "PROVINCIAL",
      title: "League1 BC Spotlight: Coastal Derbies and Rivalry Growth",
      readTime: "5 min",
      date: "Jul 29"
    },
    {
      id: 9,
      league: "CPL",
      title: "Analytics at the Grassroots: Tracking Data Without a Big Budget",
      readTime: "6 min",
      date: "Jul 28"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-sm p-3 flex flex-col gap-4 shadow-sm">
      {/* Top Section: Local Club Spotlight / Grassroots Impact Grid */}
      <div className="flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-border">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-crimson dark:text-crimson" strokeWidth={1.5} />
            <h2 className="text-xs font-mono font-bold tracking-widest text-charcoal dark:text-white">
              LOCAL CLUB SPOTLIGHT // GRASSROOTS IMPACT
            </h2>
          </div>
          <Link 
            href="/grassroots" 
            className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft hover:text-crimson dark:hover:text-crimson transition-colors"
          >
            [archive]
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {stories.map((story) => (
            <article 
              key={story.id}
              className="bg-surface border border-border dark:border-border/80 rounded-sm p-2 flex flex-col justify-between group hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[7px] font-mono px-1 py-0.5 bg-neutral-200 dark:bg-card border border-border text-neutral-700 dark:text-charcoal-soft font-bold uppercase">
                  {story.league}
                </span>
                <span className="text-[7px] font-mono text-charcoal-soft">{story.date}</span>
              </div>
              
              <h3 className="text-[11px] font-bold text-charcoal dark:text-white group-hover:text-crimson dark:group-hover:text-crimson transition-colors leading-tight line-clamp-2 my-1">
                {story.title}
              </h3>
              
              <div className="flex items-center justify-between pt-1 border-t border-neutral-200 dark:border-neutral-900">
                <span className="text-[8px] font-mono text-charcoal-soft">{story.readTime}</span>
                <span className="text-[8px] font-mono text-neutral-600 dark:text-neutral-300 group-hover:text-crimson dark:group-hover:text-crimson flex items-center gap-0.5 transition-colors font-bold">
                  READ <ExternalLink className="w-2 h-2" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom Section: Partner Spotlight Ad Slot (ad2.jpg) */}
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
              src="/ad2.jpg"
              alt="Partner Spotlight"
              fill
              className="object-contain group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </a>
      </div>
    </div>
  );
                }