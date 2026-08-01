import HeroDossier from '@/components/home/HeroDossier';
import WireFeedList from '@/components/home/WireFeedList';
import ScoutDash from '@/components/home/ScoutDash';
import { homeLayout } from '@/lib/homeLayout.config';
import type { WireStory, StandingsRow, UpcomingFixture } from '@/lib/types';

export default function Home() {
  const featured: WireStory = {
    id: '1',
    headline: "DAVID'S BRACE FUELS LILLE VICTORY; TRANSFER RUMOURS HEAT UP",
    summary: "Canadian striker Jonathan David delivered another clinical performance in Europe.",
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
    { position: 2, clubName: "Pacific FC", played: 0, points: 0, goalDifference: 0 },
    { position: 3, clubName: "Cavalry FC", played: 0, points: 0, goalDifference: 0 },
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

  const sections: Record<string, React.ReactNode> = {
    hero: featured ? <HeroDossier story={featured} /> : null,
    wire: <WireFeedList stories={rest} />,
    scout: <ScoutDash standings={standings} fixture={fixture} />,
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-red-600 selection:text-white">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
        {homeLayout.map(({ id, span }) => (
          <div key={id} className={span}>{sections[id]}</div>
        ))}
      </div>
    </main>
  );
}
