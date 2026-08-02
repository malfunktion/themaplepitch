import StatsDashboard from '@/components/home/StatsDashboard';
import HeroDossier from '@/components/home/HeroDossier';
import WireFeedList from '@/components/home/WireFeedList';
import ScoutDash from '@/components/home/ScoutDash';
import PlayerDatabaseSpotlights from '@/components/home/PlayerDatabaseSpotlights';
import { homeLayout } from '@/lib/homeLayout.config';
import type { WireStory, StandingsRow } from '@/lib/types';
import type { UpcomingFixture } from '@/lib/data/matches';
import LegendsGallery from '@/components/home/LegendsGallery';

export default function HomePage() {
  // Mock data definitions inside the component
  const fixture: UpcomingFixture = {
    homeTeam: 'Pacific FC',
    homeCity: 'Vancouver, BC',
    awayTeam: 'Forge FC',
    awayCity: 'Hamilton, ON',
    ticketUrl: null,
  };

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
  
  const rest: WireStory[] = [];
  const standings: StandingsRow[] = [
    { position: 1, clubName: "Forge FC", played: 0, points: 0, goalDifference: 0 },
    { position: 2, clubName: "Pacific FC", played: 0, points: 0, goalDifference: 0 },
    { position: 3, clubName: "Cavalry FC", played: 0, points: 0, goalDifference: 0 },
  ];

  // Map section IDs to components
  const sections: Record<string, React.ReactNode> = {
    hero: featured ? <HeroDossier story={featured} /> : null,
    wire: <WireFeedList stories={rest} />,
    scout: <ScoutDash standings={standings} fixture={fixture} />,
    'player-database': <PlayerDatabaseSpotlights />,
    'stats-dashboard': <StatsDashboard />,
    'legends-gallery': <LegendsGallery />,
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-red-600 selection:text-white">
      {/* Enforces a strict 4-column grid layout across all views, bypassing mobile browser scaling traps */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {homeLayout.map(({ id, span }) => (
          <div key={id} className={span}>
            {sections[id]}
          </div>
        ))}
      </div>
    </main>
  );
}
