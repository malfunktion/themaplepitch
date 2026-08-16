// src/app/the-wire/page.tsx
import { getWireFeed } from '@/lib/data/newsWire';
import WireDashboard from '@/components/wire/WireDashboard';
import type { StandingsRow } from '@/lib/types';

// Server component: fetches once per request (isApproved-filtered, live
// from Sanity) and hands the result to WireDashboard, which owns all the
// filtering/pagination/expand-collapse interactivity client-side.
export const dynamic = 'force-dynamic';

const standings: StandingsRow[] = [
  { position: 1, clubName: 'Forge FC', played: 0, points: 0, goalDifference: 0 },
  { position: 2, clubName: 'Pacific FC', played: 0, points: 0, goalDifference: 0 },
  { position: 3, clubName: 'Cavalry FC', played: 0, points: 0, goalDifference: 0 },
  { position: 4, clubName: 'Atlético Ottawa', played: 0, points: 0, goalDifference: 0 },
];

const nslStandings: StandingsRow[] = [
  { position: 1, clubName: 'AFC Toronto', played: 0, points: 0, goalDifference: 0 },
  { position: 2, clubName: 'Calgary Wild FC', played: 0, points: 0, goalDifference: 0 },
  { position: 3, clubName: 'Halifax Tides FC', played: 0, points: 0, goalDifference: 0 },
  { position: 4, clubName: 'Montreal Roses FC', played: 0, points: 0, goalDifference: 0 },
];

export default async function WirePage() {
  const stories = await getWireFeed({ limit: 200 });
  return <WireDashboard initialStories={stories} standings={standings} nslStandings={nslStandings} />;
}
