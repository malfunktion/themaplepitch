// src/components/wire/WireDashboard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SidebarStack from '@/components/sidebar/SidebarStack';
import SidebarXFeedWidget from '@/components/home/SidebarXFeedWidget';
import FederationLog from '@/components/wire/FederationLog';
import AcademyPipelineDispatch from '@/components/wire/AcademyPipelineDispatch';
import GlobalMediaPressBox from '@/components/wire/GlobalMediaPressBox';
import RegionalAggregator from '@/components/wire/RegionalAggregator';
import RawPressRoomTranscripts from '@/components/wire/RawPressRoomTranscripts';
import OfficiatingAssignments from '@/components/wire/OfficiatingAssignments';
import ScoutingNotebook from '@/components/wire/ScoutingNotebook';
import RosterCompliance from '@/components/wire/RosterCompliance';
import WireContextualStats from '@/components/wire/WireContextualStats';

import type { WireStory, StandingsRow } from '@/lib/types';
import { PROVINCIAL_SUBS } from '@/lib/wireData';

// Added 'Collegiate' into the active leagues list for category counting & filtering
function buildCategories(stories: WireStory[]) {
  const leagues = ['CPL', 'NSL', 'Provincial', 'MLS', 'Abroad', 'Transfers', 'CanMNT', 'CanWNT', 'Collegiate'];
  return [
    { name: 'ALL DISPATCHES', count: stories.length },
    ...leagues.map((league) => ({
      name: league,
      count: stories.filter((s) => s.category?.toLowerCase() === league.toLowerCase()).length,
    })),
  ];
}

const ITEMS_PER_PAGE = 10;
const COMBINE_ITEMS_PER_PAGE = 10;

interface CombinePlayer {
  id: string;
  name: string;
  position: string;
  club: string;
  age: number;
  status: string;
  trialDestination?: string;
}

const COMBINE_PLAYERS: CombinePlayer[] = [
  { id: 'cp-1', name: 'Lucas Tremblay', position: 'CM', club: 'Ottawa South United', age: 18, status: 'INVITED', trialDestination: 'CPL Pre-Season' },
  { id: 'cp-2', name: 'Mateo Silva', position: 'CB', club: 'Sigma FC', age: 17, status: 'TRIAL', trialDestination: 'Scandinavia Tier 1' },
  { id: 'cp-3', name: 'Noah Dubois', position: 'ST', club: 'CF Montréal Academy', age: 18, status: 'CONFIRMED', trialDestination: 'MLS Next Pro' },
];

interface WireDashboardProps {
  initialStories: WireStory[];
  standings: StandingsRow[];
  nslStandings: StandingsRow[];
}

export default function WireDashboard({ initialStories, standings, nslStandings }: WireDashboardProps) {
  const CATEGORIES = buildCategories(initialStories);
  const [activeFilter, setActiveFilter] = useState('ALL DISPATCHES');
  const [activeSubFilter, setActiveSubFilter] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [marketTab, setMarketTab] = useState<'CPL' | 'NSL'>('CPL');
  const [combinePage, setCombinePage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const heroStory = initialStories.find((s) => s.isHero) || initialStories[0];
  const largeDispatches = initialStories.filter((s) => !s.isHero && !s.isDataDrop).slice(0, 2);
  const compactDispatches = initialStories.filter((s) => !s.isHero && !s.isDataDrop).slice(2, 6);

  const filteredStories = initialStories.filter((s) => {
    if (s.isHero) return false;
    if (activeFilter === 'ALL DISPATCHES') return true;
    if (activeFilter === 'Provincial' && activeSubFilter) {
      return s.category === 'Provincial' && s.subCategory === activeSubFilter;
    }
    return s.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE);
  const streamStories = filteredStories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (catName: string) => {
    setActiveFilter(catName);
    setActiveSubFilter('');
    setCurrentPage(1);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalCombinePages = Math.ceil(COMBINE_PLAYERS.length / COMBINE_ITEMS_PER_PAGE);
  const currentCombinePlayers = COMBINE_PLAYERS.slice(
    (combinePage - 1) * COMBINE_ITEMS_PER_PAGE,
    combinePage * COMBINE_ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-[100dvh] p-2 sm:p-4 md:p-6 pb-[env(safe-area-inset-bottom)] bg-surface text-charcoal font-sans">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* ============ ROW 1: HERO + LATEST ============ */}
          <div className="lg:col-span-4 flex flex-col">
            {heroStory && (
              <Link
                href={heroStory.sourceUrl || '#'}
                className="block bg-card border border-border rounded-sm overflow-hidden relative group h-[368px] flex flex-col justify-end transition-colors"
              >
                {heroStory.thumbnailUrl && (
                  <Image
                    src={heroStory.thumbnailUrl}
                    alt={heroStory.headline}
                    fill
                    className="absolute inset-0 object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                <div className="relative z-10 p-4 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold bg-crimson text-white px-2 py-0.5 rounded-sm">
                      [ {heroStory.category || 'FEATURED'} ]
                    </span>
                    <span className="text-[10px] font-mono text-neutral-300">{heroStory.timestamp || 'JUST NOW'}</span>
                  </div>
                  <h2 className="text-sm md:text-base font-extrabold text-white leading-tight mb-1.5 group-hover:text-crimson transition-colors line-clamp-3">
                    {heroStory.headline}
                  </h2>
                  {heroStory.summary && (
                    <p className="text-xs text-neutral-300 line-clamp-2 mb-2 font-sans">{heroStory.summary}</p>
                  )}
                </div>
              </Link>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-2">
            <div className="bg-card border border-border rounded-sm px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">
                LATEST DISPATCHES (2 FEATURED // 4 COMPACT)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse"></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-h-[332px]">
              <div className="flex flex-col gap-2 h-full">
                {largeDispatches.map((dispatch) => (
                  <Link
                    key={dispatch.id}
                    href={dispatch.sourceUrl || '#'}
                    className="bg-card border border-border rounded-sm p-2.5 group hover:border-crimson/60 transition-colors flex flex-col justify-end relative flex-1 min-h-[120px] overflow-hidden"
                  >
                    {dispatch.thumbnailUrl && (
                      <Image
                        src={dispatch.thumbnailUrl}
                        alt={dispatch.headline}
                        fill
                        className="absolute inset-0 object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono font-bold bg-crimson text-white px-1.5 py-0.5 rounded-sm">
                          [ {dispatch.category || 'WIRE'} ]
                        </span>
                        <span className="text-[9px] font-mono text-neutral-300">{dispatch.timestamp}</span>
                      </div>
                      <h3 className="text-xs font-extrabold text-white leading-tight line-clamp-2 group-hover:text-crimson transition-colors">
                        {dispatch.headline}
                      </h3>
                    </div>
                  </Link>
                ))}
                {largeDispatches.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-[10px] font-mono text-neutral-500 border border-dashed border-border rounded-sm">
                    NO FEATURED DISPATCHES YET
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 h-full">
                {compactDispatches.map((dispatch) => (
                  <Link
                    key={dispatch.id}
                    href={dispatch.sourceUrl || '#'}
                    className="bg-card border border-border rounded-sm px-2.5 py-1.5 group hover:border-crimson/60 transition-colors flex gap-2.5 items-center flex-1"
                  >
                    {dispatch.thumbnailUrl && (
                      <div className="relative w-10 h-8 shrink-0 overflow-hidden rounded-sm bg-border">
                        <Image
                          src={dispatch.thumbnailUrl}
                          alt={dispatch.headline}
                          fill
                          className="object-cover grayscale group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-mono font-bold text-crimson">{dispatch.timestamp}</span>
                        <span className="text-[9px] font-mono text-charcoal-soft uppercase truncate">{dispatch.category}</span>
                      </div>
                      <h3 className="text-[11px] font-bold leading-tight line-clamp-2 group-hover:text-crimson transition-colors">
                        {dispatch.headline}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ============ ROW 2: MAIN STREAM (8 cols) ============ */}
          <main className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-card border border-border rounded-sm p-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">FILTER WIRE</h2>
                <span className="text-[10px] font-mono text-charcoal-soft">{filteredStories.length} DISPATCHES</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isActive = activeFilter === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleFilterChange(cat.name)}
                      className={`text-[10px] font-mono px-2.5 py-1.5 rounded-sm border transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-crimson text-white border-crimson font-bold'
                          : 'border-border text-charcoal-soft hover:text-charcoal hover:bg-border/20'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[9px] px-1 rounded-sm ${isActive ? 'bg-crimson-dim text-white' : 'bg-border text-charcoal-soft'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              {activeFilter === 'Provincial' && (
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border">
                  {PROVINCIAL_SUBS.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setActiveSubFilter(sub);
                        setCurrentPage(1);
                      }}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-sm border transition-colors ${
                        activeSubFilter === sub
                          ? 'bg-crimson text-white border-crimson font-bold'
                          : 'border-border text-charcoal-soft hover:text-charcoal'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-sm">
              <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2">
                  INTELLIGENCE STREAM // {activeSubFilter ? activeSubFilter : activeFilter}
                  <span className="bg-border text-charcoal-soft px-1.5 py-0.5 rounded-sm text-[9px]">
                    PAGE {currentPage} OF {totalPages || 1}
                  </span>
                </span>
                <span className="text-[10px] font-mono text-crimson flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-crimson animate-pulse"></span>
                  LIVE TICKER
                </span>
              </div>
              <div className="divide-y divide-border dark:divide-neutral-800 flex flex-col justify-start min-h-[400px]">
                {streamStories.length > 0 ? (
                  streamStories.map((story) => {
                    const isExpanded = expandedIds[String(story.id)];
                    if (story.isDataDrop) {
                      return (
                        <div key={story.id} className="p-4 bg-crimson/5 border-l-4 border-crimson m-2 rounded-r-sm">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono text-crimson font-bold">{story.timestamp}</span>
                            <span className="text-[9px] font-mono text-charcoal-soft uppercase tracking-wider">// {story.sourceName}</span>
                          </div>
                          <p className="text-sm font-bold text-charcoal leading-snug">{story.headline}</p>
                          {story.summary && (
                            <p className="text-xs text-charcoal-soft mt-1 font-sans italic">{story.summary}</p>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div key={story.id} className="p-3 transition-colors hover:bg-border/10">
                        <div className="flex gap-3 items-start">
                          <div className="w-16 shrink-0 font-mono font-bold text-xs text-crimson pt-0.5">{story.timestamp}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-mono text-charcoal-soft tracking-wider mb-1">{story.sourceName}</div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={story.sourceUrl || '#'}
                                target="_blank"
                                className="font-extrabold text-xs sm:text-sm leading-tight hover:text-crimson transition-colors"
                              >
                                {story.headline}
                              </Link>
                              <button
                                onClick={() => toggleExpand(String(story.id))}
                                className="shrink-0 text-crimson font-mono text-xs p-1 hover:bg-crimson/10 rounded-sm transition-colors"
                              >
                                {isExpanded ? '▼' : '➔'}
                              </button>
                            </div>
                            {isExpanded && (
                              <p className="text-xs text-charcoal-soft mt-1.5 leading-relaxed font-sans">{story.summary}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs font-mono text-charcoal-soft">
                    {initialStories.length === 0
                      ? 'NO APPROVED DISPATCHES YET — approve stories in Sanity Studio to populate the wire.'
                      : `NO DISPATCHES FOUND FOR ${activeSubFilter || activeFilter}`}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-border flex justify-between items-center">
                {currentPage > 1 ? (
                  <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="text-xs font-mono font-bold text-charcoal-soft hover:text-charcoal transition-colors tracking-widest"
                  >
                    [ ➔ RETURN TO NEWER ]
                  </button>
                ) : (
                  <div></div>
                )}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="text-xs font-mono font-bold text-crimson hover:underline tracking-widest"
                  >
                    [ LOAD EARLIER WIRE ARCHIVE ➔ ]
                  </button>
                )}
              </div>
            </div>

            <GlobalMediaPressBox />

            <div>
              <h2 className="text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase mb-2 px-1">
                WIRE DISPATCHES // GRASSROOTS, REGIONAL & FIELD NOTES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AcademyPipelineDispatch />
                <RegionalAggregator />
                <RawPressRoomTranscripts />
                <ScoutingNotebook />
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase mb-2 px-1">
                FRONT OFFICE // COMPLIANCE & OFFICIATING
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RosterCompliance />
                <OfficiatingAssignments />
              </div>
            </div>
          </main>

          {/* ============ ROW 2: SIDEBAR (4 cols) ============ */}
          <aside className="lg:col-span-4 flex flex-col gap-4 pb-4">
            <div className="bg-card border border-crimson/40 rounded-sm p-3 relative overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.1)]">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-crimson"></div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-crimson uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse"></span>
                  LIVE MATCH LOG
                </span>
                <span className="text-[9px] font-mono text-charcoal-soft font-bold">72&apos; MIN</span>
              </div>
              <div className="text-xs font-extrabold text-charcoal mb-1.5">PACIFIC FC 1 - 0 HFX WANDERERS</div>
              <div className="text-[10px] font-mono text-charcoal-soft leading-snug border-l-2 border-border pl-2">
                [ 70&apos; ] Tactical adjustment: Pacific shifts to 5-4-1 low block to preserve lead.
              </div>
            </div>

            <div className="bg-card border border-border rounded-sm p-3">
              <div className="flex items-center gap-1.5 mb-3 border-b border-border pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson"></span>
                <h3 className="text-[10px] font-mono font-bold tracking-wider text-crimson uppercase">
                  {activeFilter} {'// METRICS'}
                </h3>
              </div>
              <div className="space-y-1 font-mono">
                <WireContextualStats activeFilter={activeFilter} />
              </div>
            </div>

            <SidebarStack standings={standings} nslStandings={nslStandings} breakpoint="lg" />

            <div className="bg-card border border-border rounded-sm p-3 space-y-2.5">
              <div className="text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">TERMINAL ACCESS // VIP</div>
              <p className="text-[11px] text-charcoal-soft font-sans leading-snug">
                Unlock the full ad-free telemetry stream and deep database.
              </p>
              <button className="w-full bg-crimson hover:bg-crimson-dim text-white font-mono text-[10px] font-bold py-2 px-3 rounded-sm transition-colors text-center tracking-wider">
                [ UNLOCK AD-FREE TERMINAL • $1.99/MO ]
              </button>
            </div>

            <div className="bg-card border border-border rounded-sm p-3">
              <button onClick={() => setToolsExpanded((prev) => !prev)} className="w-full flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">MORE WIRE TOOLS</span>
                <span className="text-[10px] font-mono font-bold text-crimson">{toolsExpanded ? '[ HIDE ]' : '[ SHOW ]'}</span>
              </button>
              <p className="text-[10px] text-charcoal-soft font-mono mt-1 leading-snug">
                Casualty tracker, federation log, market odds, combine radar, X feed
              </p>
              {toolsExpanded && (
                <div className="mt-3 pt-3 border-t border-border space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                      <span className="text-[11px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">CASUALTY & REHAB TIER</span>
                      <span className="text-[10px] font-bold text-crimson">✚</span>
                    </div>
                    <div className="space-y-2 text-[10px] font-mono">
                      <div className="flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                        <div className="flex justify-between items-center text-charcoal font-bold">
                          <span>T. BUCHANAN</span>
                          <span className="text-crimson">EST. SEPT</span>
                        </div>
                        <span className="text-charcoal-soft">ACL REHAB // CANMNT</span>
                      </div>
                      <div className="flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                        <div className="flex justify-between items-center text-charcoal font-bold">
                          <span>S. ADEKUBE</span>
                          <span className="text-charcoal-soft">DAY-TO-DAY</span>
                        </div>
                        <span className="text-charcoal-soft">HAMSTRING // CPL</span>
                      </div>
                      <div className="flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                        <div className="flex justify-between items-center text-charcoal font-bold">
                          <span>S. ZADORSKY</span>
                          <span className="text-crimson">EST. OCT</span>
                        </div>
                        <span className="text-charcoal-soft">KNEE SPRAIN // CANWNT</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-center text-charcoal font-bold">
                          <span>J. WATERMAN</span>
                          <span className="text-charcoal-soft">PENDING</span>
                        </div>
                        <span className="text-charcoal-soft">CONCUSSION PROTOCOL // MLS</span>
                      </div>
                    </div>
                  </div>

                  <FederationLog />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="text-[11px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">MARKET SHIFTS // ODDS</span>
                      <span className="text-[10px] font-mono font-bold text-crimson">▲ FUTURES</span>
                    </div>
                    <div className="flex bg-card border border-border rounded-sm p-0.5 gap-1">
