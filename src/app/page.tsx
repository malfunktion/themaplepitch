// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import StatsDashboard from '@/components/home/StatsDashboard';
import HeroDossier from '@/components/home/HeroDossier';
import WireFeedList from '@/components/home/WireFeedList';
import ScoutDash from '@/components/home/ScoutDash';
import PlayerDatabaseSpotlights from '@/components/home/PlayerDatabaseSpotlights';
import ProLeaguesTracker from '@/components/home/ProLeaguesTracker';
import YouthToProPipeline from '@/components/home/YouthToProPipeline';
import FanHubSection from '@/components/home/FanHubSection';
import PlayerAndProvincialSection from '@/components/home/PlayerAndProvincialSection';
import LegendsGallery from '@/components/home/LegendsGallery';
import ConversionSection from '@/components/home/ConversionSection';
import LocalClubSpotlight from '@/components/home/LocalClubSpotlight';
import ProvincialPyramidTracker from '@/components/home/ProvincialPyramidTracker';
import ContractRadarWidget from '@/components/home/ContractRadarWidget';
import DualNationalRadar from '@/components/home/DualNationalRadar';
import SidebarRumourMill from '@/components/home/SidebarRumourMill';
import SidebarAdWidget from '@/components/home/SidebarAdWidget';
import SidebarAdWidget4 from '@/components/home/SidebarAdWidget4';
import { homeLayout } from '@/lib/homeLayout.config';
import type { WireStory, StandingsRow } from '@/lib/types';

export default function HomePage() {
  const [mobileTab, setMobileTab] = useState<'standings' | 'provincial' | 'radars'>('standings');

  const featured: WireStory = {
    id: 'fallback-1',
    league: 'CPL',
    headline: 'Canadian Premier League Season Preview: What to Expect',
    summary: 'A look at tactical setups and roster changes across the country as the new campaign kicks off.',
    sourceName: 'The Maple Pitch',
    sourceUrl: '#',
    thumbnailUrl: null,
    publishedAt: new Date().toISOString(),
    isEditorPick: true,
  };

  const wireStories: WireStory[] = [];

  const standings: StandingsRow[] = [
    { position: 1, clubName: "Forge FC", played: 0, points: 0, goalDifference: 0 },
    { position: 2, clubName: "Pacific FC", played: 0, points: 0, goalDifference: 0 },
    { position: 3, clubName: "Cavalry FC", played: 0, points: 0, goalDifference: 0 },
    { position: 4, clubName: "Atlético Ottawa", played: 0, points: 0, goalDifference: 0 },
    { position: 5, clubName: "York United FC", played: 0, points: 0, goalDifference: 0 },
    { position: 6, clubName: "Valour FC", played: 0, points: 0, goalDifference: 0 },
    { position: 7, clubName: "Halifax Wanderers FC", played: 0, points: 0, goalDifference: 0 },
    { position: 8, clubName: "Vancouver FC", played: 0, points: 0, goalDifference: 0 },
  ];

  const nslStandings: StandingsRow[] = [
    { position: 1, clubName: "Vancouver Rise", played: 0, points: 0, goalDifference: 0 },
    { position: 2, clubName: "Calgary Wild", played: 0, points: 0, goalDifference: 0 },
    { position: 3, clubName: "AFC Toronto", played: 0, points: 0, goalDifference: 0 },
    { position: 4, clubName: "Halifax Tides", played: 0, points: 0, goalDifference: 0 },
  ];

  const sections: Record<string, ReactNode> = {
    hero: <HeroDossier story={featured} />,
    wire: <WireFeedList stories={wireStories} />,
    'player-database': <PlayerDatabaseSpotlights />,
    'pro-leagues-tracker': <ProLeaguesTracker />,
    'youth-pipeline': <YouthToProPipeline />,
    'fan-hub': <FanHubSection />,
    'player-provincial': <PlayerAndProvincialSection />,
    'stats-dashboard': <StatsDashboard />,
    'legends-gallery': <LegendsGallery />,
    'conversion-section': <ConversionSection />,
    'local-club-spotlight': <LocalClubSpotlight />,
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Main 4-Column Bento Grid */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(140px,auto)] gap-4">
          {homeLayout.map(({ id, span }) => (
            <div key={id} className={`${span} w-full overflow-hidden`}>
              {sections[id] || null}
            </div>
          ))}
        </div>

        {/* 5th Column: Signature Sidebar Stack */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Mobile Tab Switcher */}
          <div className="flex lg:hidden bg-card border border-border p-1 rounded-sm">
            <button
              onClick={() => setMobileTab('standings')}
              className={`flex-1 py-1.5 text-[10px] font-mono uppercase font-bold rounded-sm transition-colors ${
                mobileTab === 'standings' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-foreground'
              }`}
            >
              [ STANDINGS ]
            </button>
            <button
              onClick={() => setMobileTab('provincial')}
              className={`flex-1 py-1.5 text-[10px] font-mono uppercase font-bold rounded-sm transition-colors ${
                mobileTab === 'provincial' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-foreground'
              }`}
            >
              [ PROVINCIAL ]
            </button>
            <button
              onClick={() => setMobileTab('radars')}
              className={`flex-1 py-1.5 text-[10px] font-mono uppercase font-bold rounded-sm transition-colors ${
                mobileTab === 'radars' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-foreground'
              }`}
            >
              [ RADARS ]
            </button>
          </div>

          {/* Sidebar Modules */}
          <div className={`flex flex-col gap-4 ${mobileTab === 'standings' ? 'flex' : 'hidden lg:flex'}`}>
            <ScoutDash standings={standings} nslStandings={nslStandings} />
            <SidebarAdWidget />
          </div>

          <div className={`flex flex-col gap-4 ${mobileTab === 'provincial' ? 'flex' : 'hidden lg:flex'}`}>
            <ProvincialPyramidTracker />
          </div>

          <div className={`flex flex-col gap-4 ${mobileTab === 'radars' ? 'flex' : 'hidden lg:flex'}`}>
            <ContractRadarWidget />
            <DualNationalRadar />
            <SidebarRumourMill />
            <SidebarAdWidget4 />
          </div>
        </div>
      </div>
    </div>
  );
}
