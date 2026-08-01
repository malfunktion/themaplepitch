import React from 'react';
import ScoutDash from '@/components/home/ScoutDash';
import { WireFeedList } from '@/components/home/WireFeedList';
import { HeroDossier } from '@/components/home/HeroDossier';
import type { WireStory, StandingsRow, UpcomingFixture } from '@/lib/types';

export default function Home() {
  // Mock data satisfying all type definitions
  const featured: WireStory = {
    id: '1',
    headline: "DAVID’S BRACE FUELS LILLE VICTORY; TRANSFER RUMOURS HEAT UP",
    summary: " Canadian striker Jonathan David delivered another clinical performance in Europe.",
    league: "Abroad",
    sourceName: "TSN",
    sourceUrl: "https://tsn.ca",
    thumbnailUrl: null,
    publishedAt: new Date().toISOString(),
    isEditorPick: true,
  };

  const rest: WireStory[] = [];

  const standings: StandingsRow[] = [
    { position: 1, clubName: "Forge FC", played: 0, points: 0, goalDifference: 0 },
  ];

  const fixture: UpcomingFixture = {
    id: 'f1',
    homeTeam: 'Pacific FC',
    awayTeam: 'Forge FC',
    league: 'CPL',
    date: '2026-06-06',
    time: '15:00',
    venue: 'Westhills Stadium',
  };

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-8">
      {featured && <HeroDossier story={featured} />}
      <WireFeedList stories={rest} />
      <ScoutDash standings={standings} fixture={fixture} />
    </main>
  );
}
