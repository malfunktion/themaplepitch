import HeroDossier from '@/components/home/HeroDossier';
import WireFeedList from '@/components/home/WireFeedList';
import ScoutDash from '@/components/home/ScoutDash';
import { homeLayout } from '@/lib/homeLayout.config';
import type { WireStory, StandingsRow } from '@/lib/types';
import type { UpcomingFixture } from '@/lib/data/matches';
...
const fixture: UpcomingFixture = {
  homeTeam: 'Pacific FC',
  homeCity: 'Vancouver, BC',
  awayTeam: 'Forge FC',
  awayCity: 'Hamilton, ON',
  ticketUrl: null,
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {homeLayout.map(({ id, span }) => (
          <div key={id} className={span}>{sections[id]}</div>
        ))}
      </div>
    </main>
  );
}
