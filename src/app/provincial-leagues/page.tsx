'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  PROVINCIAL_DATA,
  type ProvinceCode,
  type GenderCode,
} from '@/lib/data/provincialLeagues';
import SidebarStack from '@/components/sidebar/SidebarStack';
import ProvincialHeroFold from '@/components/provincial/ProvincialHeroFold';
import ProvincialStandingsTable from '@/components/provincial/ProvincialStandingsTable';
import StatLeaderboardCard from '@/components/provincial/StatLeaderboardCard';
import {
  TeamOfTheWeekCard,
  TalentOriginCard,
} from '@/components/provincial/ProvincialTOTWAndOrigin';
import {
  FixturesCard,
  DisciplineLogCard,
} from '@/components/provincial/ProvincialFixturesAndDiscipline';
import ProvincialVideoVault from '@/components/provincial/ProvincialVideoVault';

type HubProvinceSelection = 'ALL' | ProvinceCode;

const PROVINCE_ORDER: ProvinceCode[] = ['ON', 'PRAIRIES', 'AB', 'BC', 'QC'];
const PROVINCE_LABELS: Record<ProvinceCode, string> = {
  ON: '• ONTARIO',
  PRAIRIES: '• PRAIRIES',
  AB: '• ALBERTA',
  BC: '• BRITISH COLUMBIA',
  QC: '• QUÉBEC',
};

function ProvincialLeaguesContent() {
  const searchParams = useSearchParams();
  const urlProvince = searchParams.get('province') as ProvinceCode | null;

  // Master Control States
  const [selectedJurisdiction, setSelectedJurisdiction] =
    useState<HubProvinceSelection>('ALL');
  const [gender, setGender] = useState<GenderCode>('MEN');
  const [tier, setTier] = useState<string>('Premier');

  // Sync with URL query parameters if coming from footer links
  useEffect(() => {
    if (urlProvince && PROVINCIAL_DATA[urlProvince]) {
      setSelectedJurisdiction(urlProvince);
      setTier(PROVINCIAL_DATA[urlProvince].tiers[0]);
    }
  }, [urlProvince]);

  // Handle Jurisdiction Switch
  const handleJurisdictionChange = (j: HubProvinceSelection) => {
    setSelectedJurisdiction(j);
    if (j !== 'ALL') {
      const newProv = PROVINCIAL_DATA[j];
      if (newProv && newProv.tiers && newProv.tiers.length > 0) {
        setTier(newProv.tiers[0]);
      }
    }
  };

  const isAll = selectedJurisdiction === 'ALL';
  const currentProvData = !isAll
    ? PROVINCIAL_DATA[selectedJurisdiction]
    : PROVINCIAL_DATA['ON'];

  // Active Data Slices (for single province view)
  const activeStandings =
    currentProvData.standings[tier]?.[gender] ||
    currentProvData.standings[currentProvData.tiers[0]][gender];
  const activeGoldenBoot = currentProvData.goldenBoot[gender];
  const activeAvgGoals = currentProvData.avgGoals[gender];
  const activeAssists = currentProvData.assists[gender];
  const activeCleanSheets = currentProvData.cleanSheets[gender];
  const activeTOTW = currentProvData.totw[gender];
  const activeHero = currentProvData.hero[gender];
  const activeVideos = currentProvData.videos[gender];

  return (
    <>
      <div className="mb-6 -mt-2">
        {/* Return to Hub Bar if viewing single province */}
        {!isAll && (
          <div className="mb-4">
            <button
              onClick={() => handleJurisdictionChange('ALL')}
              className="text-xs font-mono font-bold text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-2"
            >
              [ ← RETURN TO PAN-CANADIAN PROVINCIAL LEAGUES HUB ]
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* =========================================================
              MAIN CONTENT COLUMN (Cols 1-4)
              ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Header & Title */}
            <div className="border-b border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-mono">
                  PROVINCIAL LEAGUES HUB
                </h1>
                <p className="text-neutral-400 mt-1 text-xs sm:text-sm font-mono">
                  {isAll
                    ? 'Pan-Canadian Pro-Am Command Center // League1 Ecosystem Telemetry'
                    : `${currentProvData.name} Pro-Am Intelligence Terminal`}
                </p>
              </div>

              {/* Global Gender Toggle */}
              <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-sm">
                {(['MEN', 'WOMEN'] as GenderCode[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-sm transition-colors ${
                      gender === g
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    [ {g} ]
                  </button>
                ))}
              </div>
            </div>

            {/* ===================================================
                SECTION 1: MASTER CONTROL BAR (Jurisdiction Pill-Row)
                =================================================== */}
            <div className="border border-neutral-800 bg-[#171717] p-2 rounded-sm space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 px-1">
                <span>SELECT JURISDICTION // PRO-AM SYSTEM</span>
                <span className="text-red-500 font-bold">
                  LIVE TELEMETRY ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap flex-nowrap pb-1">
                {/* All Provinces Summary Pill */}
                <button
                  onClick={() => handleJurisdictionChange('ALL')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-sm border transition-colors shrink-0 ${
                    isAll
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-transparent text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-600'
                  }`}
                >
                  [ ALL PROVINCES ]
                </button>

                {/* Individual Province Pills */}
                {PROVINCE_ORDER.map((pCode) => {
                  const isActive = selectedJurisdiction === pCode;
                  return (
                    <button
                      key={pCode}
                      onClick={() => handleJurisdictionChange(pCode)}
                      className={`px-3 py-1.5 text-xs font-mono font-bold rounded-sm border transition-colors shrink-0 ${
                        isActive
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-transparent text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-600'
                      }`}
                    >
                      {PROVINCE_LABELS[pCode]}
                    </button>
                  );
                })}
              </div>

              {/* Tier Selector Bar (Only visible when a specific province is active) */}
              {!isAll &&
                currentProvData.tiers &&
                currentProvData.tiers.length > 0 && (
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      TIER:
                    </span>
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {currentProvData.tiers.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTier(t)}
                          className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-sm border transition-colors uppercase ${
                            tier === t
                              ? 'bg-neutral-800 text-white border-neutral-600'
                              : 'bg-transparent text-neutral-500 border-neutral-800 hover:text-neutral-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* ===================================================
                SECTION 2: PROVINCIAL HERO & DISPATCHES FOLD
                =================================================== */}
            <ProvincialHeroFold
              leagueName={currentProvData.name}
              hero={activeHero}
              dispatches={currentProvData.dispatches}
            />

            {/* ===================================================
                SECTION 3: STANDINGS & SCOUTING STAT LEADERBOARDS
                =================================================== */}
            {isAll ? (
              /* Pan-Canadian Multi-Province Summary Grid */
              <div className="space-y-6">
                {/* 1. Active Regional Scouting Traffic Ticker */}
                <div className="bg-neutral-900 border border-neutral-800 p-2 flex items-center gap-3 overflow-hidden rounded-sm">
                  <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap shrink-0">
                    [ LIVE SCOUTING HOTSPOTS ]
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap truncate tracking-wide">
                    🔥 L1O WEST: Simcoe County vs Scrosoppi FC • ⚡ L1QC: CS Saint-Laurent U21 showcasing 3 Pro Prospects • 🛡️ L1BC: Coastal Derby drawing MLS Academy scouts...
                  </span>
                </div>

                {/* 2 & 3. Corridors & Conversion Index Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Regional Corridor Breakdown */}
                  <div className="border border-neutral-800 bg-[#171717] p-4 rounded-sm">
                     <h3 className="font-mono font-bold text-sm text-white uppercase mb-4 border-b border-neutral-800 pb-2">
                        THE 5 REGIONAL CORRIDORS
                     </h3>
                     <ul className="space-y-3">
                        {[
                           { name: 'GTA & Central ON', focus: 'Vaughan, Simcoe, Scrosoppi' },
                           { name: 'Southwestern Ontario', focus: 'Guelph United, FC London' },
                           { name: 'Greater Montreal & QC', focus: 'CS Saint-Laurent, FC Laval' },
                           { name: 'Lower Mainland & Island', focus: 'TSS Rovers, Altitude FC' },
                           { name: 'Prairie & Mountain', focus: 'Calgary Foothills, St. Albert' }
                        ].map((c, i) => (
                           <li key={i} className="flex flex-col sm:flex-row justify-between sm:items-center text-[10px] font-mono border-b border-neutral-800/40 pb-2 last:border-0 last:pb-0 gap-1">
                              <span className="text-neutral-300 font-bold">{c.name}</span>
                              <span className="text-neutral-500 sm:text-right">{c.focus}</span>
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Academy-to-Pro Conversion Index */}
                  <div className="border border-neutral-800 bg-[#171717] p-4 rounded-sm">
                     <h3 className="font-mono font-bold text-sm text-white uppercase mb-4 border-b border-neutral-800 pb-2 flex justify-between items-center">
                        <span>ACADEMY CONVERSION INDEX</span>
                        <span className="text-red-500 text-[10px]">LIVE RATING</span>
                     </h3>
                     <div className="space-y-2">
                        {[
                           { rank: 1, club: 'Vaughan Azzurri', prov: 'ON', pros: 14, rating: '9.8', tier: 'ELITE' },
                           { rank: 2, club: 'Whitecaps Acad. / Elite', prov: 'BC', pros: 19, rating: '9.6', tier: 'ELITE' },
                           { rank: 3, club: 'Scrosoppi FC', prov: 'ON', pros: 9, rating: '9.2', tier: 'HIGH' },
                           { rank: 4, club: 'CS Saint-Laurent', prov: 'QC', pros: 8, rating: '8.9', tier: 'HIGH' },
                           { rank: 5, club: 'Simcoe County Rovers', prov: 'ON', pros: 7, rating: '8.7', tier: 'STABLE' }
                        ].map((row, i) => (
                           <div key={i} className="flex items-center justify-between text-[10px] font-mono border-b border-neutral-800/40 pb-2 last:border-0 last:pb-0">
                              <div className="flex items-center gap-2">
                                 <span className="text-neutral-600 w-3">{row.rank}.</span>
                                 <span className="text-white font-bold">{row.club}</span>
                                 <span className="text-neutral-500 hidden sm:inline">({row.prov})</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className="text-neutral-400">{row.pros} PROS</span>
                                 <span className="text-white font-bold">{row.rating}</span>
                                 <span className={`w-12 text-center rounded-sm py-0.5 ${
                                   row.tier === 'ELITE' ? 'bg-red-600/20 text-red-500' :
                                    row.tier === 'HIGH' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-900 text-neutral-500'
                                 }`}>
                                    [{row.tier}]
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Original Pan-Canadian Multi-Province Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {PROVINCE_ORDER.map((provKey) => {
                    const pData = PROVINCIAL_DATA[provKey];
                    const topTier = pData.tiers[0];
                    const provStandings =
                      pData.standings[topTier]?.[gender] || [];
                    return (
                      <div
                        key={provKey}
                        className="border border-neutral-800 bg-[#171717] p-4 rounded-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                              <h3 className="font-mono font-bold text-sm text-white uppercase">
                                {pData.name}
                              </h3>
                              {pData.tiers.length > 1 && (
                                <span className="text-[9px] font-mono font-bold text-neutral-400 border border-neutral-700 rounded-sm px-1.5 py-0.5">
                                  {pData.tiers.length} TIERS
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleJurisdictionChange(provKey)}
                              className="text-[10px] font-mono text-red-500 hover:text-red-400 font-bold"
                            >
                              [ VIEW FULL DOSSIER ➔ ]
                            </button>
                          </div>
                          <ProvincialStandingsTable
                            leagueName={pData.name}
                            standings={provStandings.slice(0, 5)}
                            gender={gender}
                            tier={topTier}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Grassroots Pathway Funnel Indicator — moved just above Talent Origin & Feeder Hubs */}
                <div className="border border-neutral-800 bg-[#171717] p-4 rounded-sm">
                  <h3 className="font-mono font-bold text-sm text-white uppercase mb-4 border-b border-neutral-800 pb-2">
                     GRASSROOTS-TO-PRO PIPELINE FUNNEL
                  </h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                     <div className="flex-1 w-full bg-neutral-900 border border-neutral-800 p-4 text-center rounded-sm">
                        <div className="text-3xl font-extrabold text-white">350+</div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-1">GRASSROOTS CLUBS</div>
                     </div>
                     <div className="text-red-600 hidden md:block">➔</div>
                     <div className="flex-1 w-full bg-neutral-900 border border-neutral-800 p-4 text-center rounded-sm">
                        <div className="text-3xl font-extrabold text-white">1,200+</div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-1">LEAGUE1 PRO-AM PLAYERS</div>
                     </div>
                     <div className="text-red-600 hidden md:block">➔</div>
                     <div className="flex-1 w-full bg-neutral-900 border border-neutral-800 p-4 text-center rounded-sm border-l-2 border-l-red-600 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1.5">
                           <span className="flex h-2 w-2 relative">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                           </span>
                        </div>
                        <div className="text-3xl font-extrabold text-white">42</div>
                        <div className="text-[10px] text-red-500 font-mono font-bold mt-1">ACTIVE CPL/NSL PROSPECTS</div>
                     </div>
                  </div>
                </div>

                {/* Pan-Canadian Talent Origin Map — aggregated across every province's
                  feeder hubs, so the top-level hub view surfaces where national talent
                  is actually coming from instead of only showing it once you drill in. */}
                <TalentOriginCard
                  originPins={PROVINCE_ORDER
                    .flatMap((provKey) => PROVINCIAL_DATA[provKey].originPins)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6)}
                />
              </div>
            ) : (
              /* Single Province Deep-Dive Grid */
              <div className="space-y-6">
                <div className="border border-neutral-800 bg-[#171717] p-4 rounded-sm">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2 mb-4">
                    <h3 className="font-mono font-bold text-sm text-white uppercase">
                      {currentProvData.name} {'// '}
                      {tier.toUpperCase()} STANDINGS ({gender})
                    </h3>
                    <span className="text-xs font-mono text-neutral-400">
                      ACTIVE REGISTRY
                    </span>
                  </div>
                  <ProvincialStandingsTable
                    leagueName={currentProvData.name}
                    standings={activeStandings}
                    gender={gender}
                    tier={tier}
                    promotionSpots={
                      currentProvData.tiers.indexOf(tier) > 0 ? 2 : 0
                    }
                    relegationSpots={
                      currentProvData.tiers.indexOf(tier) <
                      currentProvData.tiers.length - 1
                        ? 2
                        : 0
                    }
                  />
                </div>

                {/* 4-Column Scouting Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatLeaderboardCard
                    title={`GOLDEN BOOT // TOP SCORERS (${gender})`}
                    players={activeGoldenBoot}
                    valueLabel={(v) => `${v} GOALS`}
                  />
                  <StatLeaderboardCard
                    title={`AVG GOALS / MATCH (${gender})`}
                    players={activeAvgGoals}
                    valueLabel={(v) => `${v} G/M`}
                    valueColorClass="text-neutral-100"
                    showWhiteBar
                    rightNote="[RED] RATIO • [WHITE] GAMES"
                  />
                  <StatLeaderboardCard
                    title={`ASSIST LEADERS // CREATIVE ENGINE (${gender})`}
                    players={activeAssists}
                    valueLabel={(v) => `${v} AST`}
                  />
                  <StatLeaderboardCard
                    title={`CLEAN SHEETS // DEFENSIVE SOLIDITY (${gender})`}
                    players={activeCleanSheets}
                    valueLabel={(v) => `${v} CS`}
                    valueColorClass="text-neutral-100"
                  />
                </div>

                {/* Team of the Week & Talent Origin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TeamOfTheWeekCard totw={activeTOTW} />
                  <TalentOriginCard originPins={currentProvData.originPins} />
                </div>

                {/* Fixtures & Discipline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FixturesCard fixtures={currentProvData.fixtures} />
                  <DisciplineLogCard logs={currentProvData.disciplineLogs} />
                </div>

                {/* Video Vault */}
                <ProvincialVideoVault
                  leagueName={currentProvData.name}
                  gender={gender}
                  videos={activeVideos}
                />
              </div>
            )}
          </div>

          {/* =========================================================
            SIDEBAR COLUMN (Col 5)
            ========================================================= */}
          <div className="lg:col-span-1">
            <SidebarStack />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProvincialLeaguesPage() {
  return (
    <Suspense fallback={null}>
      <ProvincialLeaguesContent />
    </Suspense>
  );
}
