// src/app/pro-leagues/page.tsx
//
// Was 617 lines, ~150 of them league/leaderboard/fixture mock data ahead
// of the page, plus three more static arrays (standings, nslStandings,
// recentStories) buried inside the component itself. Split:
//   - LeaderboardPlayer type -> src/lib/data/proLeagues/proLeaguesTypes.ts
//   - all the mock data -> src/lib/data/proLeagues/proLeaguesDemo.ts
// This file is now the CPL/NSL tab state, the calendar logic, and the
// derived values (sortedPlayers, activeFixtures, etc.) that depend on that
// state — plus the JSX that renders them.

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import SidebarStack from '@/components/sidebar/SidebarStack';
import ProLeaguesTracker from '@/components/home/ProLeaguesTracker';
import CplTalentMap from '@/components/home/CplTalentMap';
import type { StandingsRow } from '@/lib/types';
import DataStatus from '@/components/layout/DataStatus';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';

import {
  PLAYERS_LEADERBOARD,
  XG_DATA,
  TOTW_DATA,
  RECENT_RESULTS,
  UPCOMING_FIXTURES,
  CPL_FIXTURES_2026,
  NSL_FIXTURES_2026,
  recentStories,
} from '@/lib/data/proLeagues/proLeaguesDemo';

function ProLeaguesContent() {
  const searchParams = useSearchParams();
  const urlLeague = searchParams.get('league')?.toUpperCase() as 'CPL' | 'NSL' | null;

  const [sortMetric, setSortMetric] = useState<'goals' | 'assists' | 'rating'>('goals');
  const [scoringView, setScoringView] = useState<'overview' | 'xg'>('overview');

  const [leagueTab, setLeagueTab] = useState<'CPL' | 'NSL'>(
    urlLeague === 'NSL' ? 'NSL' : 'CPL'
  );

  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);

  useEffect(() => {
    getCplStandings().then(setStandings);
    getNslStandings().then(setNslStandings);
  }, []);

  // Sync state if the URL search param changes (e.g. footer link clicked while
  // already on this page — same pattern as provincial-leagues and national-teams).
  useEffect(() => {
    if (urlLeague === 'CPL' || urlLeague === 'NSL') {
      setLeagueTab(urlLeague);
    }
  }, [urlLeague]);

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 7, 1));
  const handlePrevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const today = new Date(2026, 7, 7);

  const sortedPlayers = [...PLAYERS_LEADERBOARD]
    .filter(player => player.league === leagueTab)
    .sort((a, b) => {
      if (sortMetric === 'goals') return b.goals - a.goals;
      if (sortMetric === 'assists') return b.assists - a.assists;
      return parseFloat(b.rating) - parseFloat(a.rating);
    });

  const activeFixtures = leagueTab === 'CPL' ? CPL_FIXTURES_2026 : NSL_FIXTURES_2026;
  const activeXG = leagueTab === 'CPL' ? XG_DATA.CPL : XG_DATA.NSL;
  const activeTOTW = leagueTab === 'CPL' ? TOTW_DATA.CPL : TOTW_DATA.NSL;
  const activeResults = leagueTab === 'CPL' ? RECENT_RESULTS.CPL : RECENT_RESULTS.NSL;
  const activeUpcoming = leagueTab === 'CPL' ? UPCOMING_FIXTURES.CPL : UPCOMING_FIXTURES.NSL;

  return (
    <div className="min-h-[100dvh] p-2 sm:p-4 md:p-6 pb-[env(safe-area-inset-bottom)] bg-surface text-charcoal">
      <div className="mb-4 border-b border-border pb-3"><DataStatus /></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* TOP SECTION: Hero Article + Previous Stories */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            <div className="lg:col-span-5">
              <Link
                href="#"
                className="block bg-card border border-border rounded-sm overflow-hidden relative group h-full min-h-[380px] flex flex-col justify-end transition-colors hover:border-crimson/60"
              >
                <Image
                  src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop"
                  alt="Pro Leagues Hero Matchday Preview"
                  fill
                  className="object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />
                <div className="relative p-5 z-10 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-crimson text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">
                      MATCHDAY PREVIEW
                    </span>
                    <span className="text-crimson text-xs font-mono font-bold tracking-widest">
                      1H AGO
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-charcoal leading-tight mb-2 uppercase">
                    Massive Weekend Derby Looms As Postseason Race Tightens
                  </h2>
                  <p className="text-charcoal text-sm line-clamp-2">
                    Full tactical preview and projected XIs ahead of a crucial fixture that could determine the regular season shield.
                  </p>
                </div>
              </Link>
            </div>
            <div className="lg:col-span-7 bg-card border border-border rounded-sm p-4 flex flex-col justify-between">
              <div className="font-mono text-xs font-bold text-charcoal-soft mb-3 tracking-widest uppercase">
                LATEST PRO LEAGUES DISPATCHES
              </div>
              <div className="flex flex-col gap-3">
                {recentStories.map((story) => (
                  <Link key={story.id} href={story.url} className="group flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="text-[10px] font-mono text-charcoal-soft w-12 shrink-0 pt-0.5">{story.timestamp}</span>
                    <div className="flex-1">
                      <span className="text-[9px] font-mono font-bold text-crimson mr-2 uppercase tracking-wider">[{story.league}]</span>
                      <span className="text-sm font-bold text-charcoal-soft dark:text-neutral-200 group-hover:text-crimson transition-colors leading-tight">
                        {story.headline}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* MASTER LEAGUE TOGGLE */}
          <div className="flex items-center justify-between border-b border-border pb-2 mt-4">
             <h1 className="font-mono text-sm font-bold tracking-widest uppercase text-charcoal dark:text-white">
               PRO LEAGUES // GLOBAL DATA HUB
             </h1>
             <div className="flex gap-2">
                <button
                  onClick={() => setLeagueTab('CPL')}
                  className={`px-4 py-1.5 text-xs font-mono font-bold transition-colors border rounded-sm ${
                    leagueTab === 'CPL' ? 'bg-crimson text-white border-crimson' : 'bg-transparent text-charcoal-soft border-border hover:text-charcoal hover:border-card'
                  }`}
                >
                  [ CPL ]
                </button>
                <button
                  onClick={() => setLeagueTab('NSL')}
                  className={`px-4 py-1.5 text-xs font-mono font-bold transition-colors border rounded-sm ${
                    leagueTab === 'NSL' ? 'bg-crimson text-white border-crimson' : 'bg-transparent text-charcoal-soft border-border hover:text-charcoal hover:border-card'
                  }`}
                >
                  [ NSL ]
                </button>
             </div>
          </div>

          {/* MATCHDAY CENTER — Recent Results paired with Next Up. This is what
              was previously items #2 and #3 from the audit, merged into one card
              rather than two: adding them separately would have just recreated
              the "same story twice" problem we fixed with Scoring Leaders. It
              also fixes the mobile ordering issue directly — Next Up (tickets,
              broadcaster) now sits near the top of the page instead of being the
              very last thing on a long single-column scroll, without touching
              SidebarStack's shared tab order on every other page. */}
          <div className="bg-card border border-border rounded-sm p-4">
             <div className="font-mono text-xs font-bold text-charcoal-soft tracking-widest uppercase mb-4 border-b border-border pb-2">
               {leagueTab} MATCHDAY CENTER
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Recent Results */}
               <div>
                 <div className="text-[10px] font-mono font-bold text-charcoal-soft uppercase tracking-wider mb-2 flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                   RECENT RESULTS
                 </div>
                 <div className="flex flex-col gap-2">
                   {activeResults.map(r => (
                     <div key={r.id} className="border border-border rounded-sm p-2.5">
                       <div className="text-[9px] font-mono text-charcoal-soft mb-1">{r.date} · FT</div>
                       <div className="flex items-center justify-between gap-2 text-sm font-bold text-charcoal dark:text-white">
                         <span className="truncate">{r.home}</span>
                         <span className="font-mono text-crimson px-1 shrink-0">{r.homeScore} – {r.awayScore}</span>
                         <span className="truncate text-right">{r.away}</span>
                       </div>
                       <p className="text-[10px] text-charcoal-soft mt-1 leading-snug">{r.note}</p>
                     </div>
                   ))}
                 </div>
               </div>
               {/* Next Up */}
               <div>
                 <div className="text-[10px] font-mono font-bold text-charcoal-soft uppercase tracking-wider mb-2 flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse"></span>
                   NEXT UP
                 </div>
                 <div className="flex flex-col gap-2">
                   {activeUpcoming.map(f => (
                     <div key={f.id} className="border border-border rounded-sm p-2.5">
                       <div className="flex items-center justify-between mb-1 gap-2">
                         <span className="text-[9px] font-mono text-charcoal-soft">{f.date}</span>
                         <span className="text-[9px] font-mono text-crimson shrink-0">[{f.broadcaster}]</span>
                       </div>
                       <div className="flex items-center justify-between gap-2 text-sm font-bold text-charcoal dark:text-white">
                         <span className="truncate">{f.home}</span>
                         <span className="text-[10px] font-mono text-charcoal-soft px-1 shrink-0">VS</span>
                         <span className="truncate text-right">{f.away}</span>
                       </div>
                     </div>
                   ))}
                 </div>
                 <a href="#pro-leagues-calendar" className="block text-center text-[10px] font-mono font-bold text-crimson hover:underline mt-2">
                   [ FULL CALENDAR ↓ ]
                 </a>
               </div>
             </div>
          </div>

          {/* Core Analytics Tracker Component */}
          <ProLeaguesTracker league={leagueTab} />

          {/* SCORING LEADERS — Overview (goals/assists/rating, sortable) and
              vs Expected Goals share one card via a view toggle, instead of two
              consecutive cards both ranking the same five players. */}
          <div className="bg-card border border-border rounded-sm p-4">
             <div className="flex flex-wrap justify-between items-center gap-3 mb-4 border-b border-border pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="font-mono text-xs font-bold text-charcoal-soft tracking-widest uppercase">
                    {leagueTab} SCORING LEADERS
                  </div>
                  <div className="flex bg-neutral-100 dark:bg-neutral-900 rounded-sm p-0.5 gap-0.5">
                    <button
                      onClick={() => setScoringView('overview')}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-sm transition-colors ${
                        scoringView === 'overview' ? 'bg-crimson text-white' : 'text-charcoal-soft hover:text-charcoal'
                      }`}
                    >
                      [ OVERVIEW ]
                    </button>
                    <button
                      onClick={() => setScoringView('xg')}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-sm transition-colors ${
                        scoringView === 'xg' ? 'bg-crimson text-white' : 'text-charcoal-soft hover:text-charcoal'
                      }`}
                    >
                      [ VS xG ]
                    </button>
                  </div>
                </div>

                {scoringView === 'overview' ? (
                  <div className="flex gap-1">
                    {(['goals', 'assists', 'rating'] as const).map(metric => (
                      <button
                        key={metric}
                        onClick={() => setSortMetric(metric)}
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-sm border transition-colors ${
                          sortMetric === metric
                            ? 'bg-crimson text-white border-crimson'
                            : 'border-border text-charcoal-soft hover:text-charcoal'
                        }`}
                      >
                        {metric}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-charcoal-soft uppercase">
                    DATA SOURCED VIA OPTA
                  </div>
                )}
             </div>

             {scoringView === 'overview' ? (
               <div className="overflow-x-auto">
                 <table className="w-full text-left font-mono text-sm">
                   <thead>
                     <tr className="text-charcoal-soft text-[10px] uppercase border-b border-border">
                       <th className="pb-2 font-normal">#</th>
                       <th className="pb-2 font-normal">Player</th>
                       <th className="pb-2 font-normal">Club</th>
                       <th className="pb-2 font-normal text-right">Goals</th>
                       <th className="pb-2 font-normal text-right">Assists</th>
                       <th className="pb-2 font-normal text-right">Rating</th>
                     </tr>
                   </thead>
                   <tbody>
                     {sortedPlayers.length > 0 ? (
                       sortedPlayers.map((player, idx) => (
                         <tr key={player.rank} className="border-b border-border dark:border-border/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/30 transition-colors">
                           <td className="py-2.5 text-charcoal-soft font-bold">{idx + 1}</td>
                           <td className="py-2.5 font-bold text-charcoal dark:text-neutral-200">{player.name}</td>
                           <td className="py-2.5 text-xs text-charcoal-soft">{player.club}</td>
                           <td className={`py-2.5 text-right ${sortMetric === 'goals' ? 'font-bold text-crimson' : 'text-charcoal-soft'}`}>{player.goals}</td>
                           <td className={`py-2.5 text-right ${sortMetric === 'assists' ? 'font-bold text-crimson' : 'text-charcoal-soft'}`}>{player.assists}</td>
                           <td className={`py-2.5 text-right ${sortMetric === 'rating' ? 'font-bold text-crimson' : 'text-charcoal-soft'}`}>{player.rating}</td>
                         </tr>
                       ))
                     ) : (
                       <tr><td colSpan={6} className="py-4 text-center text-charcoal-soft">No players tracked for {leagueTab} yet.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="w-full overflow-x-auto">
                 <table className="w-full text-left font-mono text-sm">
                   <thead>
                     <tr className="text-charcoal-soft text-[10px] uppercase border-b border-border">
                       <th className="pb-2 font-normal">Player</th>
                       <th className="pb-2 font-normal">Club</th>
                       <th className="pb-2 font-normal text-right">Actual Goals</th>
                       <th className="pb-2 font-normal text-right">Expected (xG)</th>
                       <th className="pb-2 font-normal text-right">Diff (+/-)</th>
                     </tr>
                   </thead>
                   <tbody>
                     {activeXG.map((stat, idx) => {
                       const isOver = parseFloat(stat.diff) > 0;
                       return (
                         <tr key={idx} className="border-b border-border dark:border-border/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/30 transition-colors">
                           <td className="py-2.5 font-bold text-charcoal dark:text-neutral-200">{stat.name}</td>
                           <td className="py-2.5 text-xs text-charcoal-soft">{stat.club}</td>
                           <td className="py-2.5 text-right font-bold text-charcoal dark:text-white">{stat.goals}</td>
                           <td className="py-2.5 text-right text-charcoal-soft">{stat.xG}</td>
                           <td className={`py-2.5 text-right font-bold ${isOver ? 'text-charcoal dark:text-white' : 'text-crimson'}`}>
                             {stat.diff}
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
             )}
          </div>

          {/* TEAM OF THE WEEK (TOTW) */}
          <div className="bg-card border border-border rounded-sm p-4">
             <div className="flex justify-between items-end mb-4 border-b border-border pb-2">
                <div className="font-mono text-xs font-bold text-charcoal-soft tracking-widest uppercase">
                  {leagueTab} TEAM OF THE WEEK // <span className="text-charcoal dark:text-white">{activeTOTW.week}</span>
                </div>
                <div className="text-[10px] font-mono text-charcoal-soft uppercase">
                  FORMATION: {activeTOTW.formation}
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
               {/* Manager Section */}
               <div className="md:col-span-5 flex flex-col gap-2 justify-center bg-neutral-100 dark:bg-neutral-900/40 p-4 rounded-sm border border-border h-full">
                  <span className="text-[10px] font-mono font-bold text-crimson tracking-widest uppercase">MANAGER OF THE WEEK</span>
                  <span className="text-lg md:text-xl font-bold text-charcoal dark:text-white leading-tight">{activeTOTW.manager}</span>
                  <p className="text-xs text-charcoal-soft mt-2">
                    {activeTOTW.managerNote}
                  </p>
               </div>
               {/* Best XI List */}
               <div className="md:col-span-7 grid grid-cols-1 gap-1">
                  {activeTOTW.players.map((player, idx) => {
                    let badgeClass = "";
                    if (player.pos === 'GK') badgeClass = "bg-neutral-300 dark:bg-neutral-700 text-charcoal dark:text-white";
                    else if (player.pos === 'DEF') badgeClass = "bg-neutral-400 dark:bg-neutral-600 text-white";
                    else if (player.pos === 'MID') badgeClass = "bg-neutral-500 dark:bg-neutral-500 text-white";
                    else if (player.pos === 'FWD') badgeClass = "bg-crimson text-white";

                    return (
                      <div key={idx} className="flex justify-between items-center py-[5px] border-b border-border dark:border-border/50 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors px-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-mono font-bold w-7 py-0.5 text-center rounded-sm tracking-wider ${badgeClass}`}>
                            {player.pos}
                          </span>
                          <span className="text-sm font-bold text-charcoal dark:text-neutral-200">{player.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-charcoal-soft tracking-widest uppercase truncate ml-2">
                          {player.club}
                        </span>
                      </div>
                    );
                  })}
               </div>
             </div>
          </div>

          {/* TALENT ORIGIN MAP */}
          <CplTalentMap league={leagueTab} />

          {/* INTERACTIVE CALENDAR FIXTURE TRACKER */}
          <div id="pro-leagues-calendar" className="bg-card border border-border rounded-sm p-4 scroll-mt-20">
             <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
                <div className="font-mono text-xs font-bold text-charcoal-soft tracking-widest uppercase">
                  {leagueTab} OFFICIAL CALENDAR // <span className="text-charcoal dark:text-white">{calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex gap-1">
                   <button onClick={handlePrevMonth} className="px-2 py-1 text-[10px] font-mono border border-border dark:border-neutral-700 rounded-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
                     [ ➔ PREV ]
                   </button>
                   <button onClick={handleNextMonth} className="px-2 py-1 text-[10px] font-mono border border-border dark:border-neutral-700 rounded-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
                     [ NEXT ➔ ]
                   </button>
                </div>
             </div>
             
             <div className="grid grid-cols-7 gap-1 md:gap-2 text-center font-mono text-xs">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="py-2 font-bold text-[9px] tracking-widest text-charcoal-soft uppercase">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`blank-${i}`} className="bg-surface/50 dark:bg-black/20 rounded-sm min-h-[60px]" />
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dateNum = i + 1;
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
                  const fixtureStr = activeFixtures[dateStr];
                  const isToday = (calYear === today.getFullYear() && calMonth === today.getMonth() && dateNum === today.getDate());
                  
                  let bgClass = "bg-surface border border-border dark:border-border/50";
                  let textClass = "text-charcoal-soft";
                  
                  if (isToday) {
                    bgClass = "bg-black dark:bg-black border border-neutral-700 shadow-lg ring-1 ring-crimson/30";
                    textClass = "text-charcoal font-extrabold";
                  } else if (fixtureStr) {
                    bgClass = "bg-crimson border-crimson-dim cursor-pointer hover:bg-crimson hover:scale-[1.02] transition-all";
                    textClass = "text-charcoal font-bold shadow-sm";
                  }

                  return (
                    <div key={dateNum} className={`relative p-1 md:p-2 min-h-[60px] md:min-h-[80px] flex flex-col items-center justify-start rounded-sm overflow-hidden ${bgClass} ${textClass}`}>
                      <span className="text-sm md:text-base mt-1">{dateNum}</span>
                      {fixtureStr && (
                        <div className="mt-auto w-full text-center">
                          <span className="text-[8px] md:text-[9px] leading-tight opacity-95 line-clamp-2 md:line-clamp-none w-full hidden sm:block">
                            {fixtureStr}
                          </span>
                          <span className="text-[10px] block sm:hidden">⚽</span>
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* 5TH COLUMN SIDEBAR */}
        <div className="lg:col-span-4 flex flex-col gap-4 sticky top-6">
          <SidebarStack standings={standings} nslStandings={nslStandings} defaultTab="radars" />
        </div>
      </div>
    </div>
  );
}

export default function ProLeaguesPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-surface flex items-center justify-center font-mono text-charcoal-soft text-xs tracking-widest uppercase">LOADING PRO LEAGUES DOSSIER...</div>}>
      <ProLeaguesContent />
    </Suspense>
  );
}
