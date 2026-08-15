// src/app/page.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import StatsDashboard from '@/components/home/StatsDashboard';
import HeroDossier from '@/components/home/HeroDossier';
import WireFeedList from '@/components/home/WireFeedList';
import PlayerDatabaseSpotlights from '@/components/home/PlayerDatabaseSpotlights';
import ProLeaguesTracker from '@/components/home/ProLeaguesTracker';
import YouthToProPipeline from '@/components/home/YouthToProPipeline';
import FanHubSection from '@/components/home/FanHubSection';
import PlayerAndProvincialSection from '@/components/home/PlayerAndProvincialSection';
import LegendsGallery from '@/components/home/LegendsGallery';
import ConversionSection from '@/components/home/ConversionSection';
import LocalClubSpotlight from '@/components/home/LocalClubSpotlight';
import SidebarStack from '@/components/sidebar/SidebarStack';
import { homeLayout } from '@/lib/homeLayout.config';
import type { WireStory, StandingsRow } from '@/lib/types';
import { client } from '@/lib/sanity';
import { getWireFeed } from '@/lib/data/newsWire';

export const dynamic = 'force-dynamic';

async function getSiteSettings() {
  const groq = `*[_type == "siteSettings"][0]{ tournamentBannerActive, tournamentBannerText, tournamentBannerUrl }`;
  try {
    return await client.fetch(groq, {}, { cache: 'no-store' });
  } catch (error) {
    console.error('getSiteSettings fetch failed:', error);
    return null;
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const fallbackFeatured: WireStory = {
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

  const wireFeed = await getWireFeed({ limit: 6 });
  const featured: WireStory = wireFeed[0]
    ? { ...wireFeed[0], isEditorPick: true }
    : fallbackFeatured;
  const wireStories = wireFeed.slice(1, 6);

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
      {settings?.tournamentBannerActive && settings?.tournamentBannerText && (
        <Link
          href={settings.tournamentBannerUrl || '#'}
          className="block bg-crimson text-white text-center text-xs font-mono uppercase tracking-widest py-2 mb-4 hover:bg-crimson-dim transition-colors"
        >
          {settings.tournamentBannerText}
        </Link>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(140px,auto)] gap-4">
          {homeLayout.map(({ id, span }) => (
            <div key={id} className={`${span} w-full overflow-hidden`}>
              {sections[id] || null}
            </div>
          ))}
        </div>
        
        {/* THE FAMOUS 5TH COLUMN */}
        <div className="lg:col-span-1 flex flex-col gap-4 sticky top-6">
          <SidebarStack standings={standings} nslStandings={nslStandings} defaultTab="standings" />
        </div>
      </div>
    </div>
  );
}
