// src/app/the-wire/page.tsx
import { getWireFeed } from '@/lib/data/newsWire';
import WireDashboard from '@/components/wire/WireDashboard';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';

// Server component: fetches once per request (isApproved-filtered, live
// from Sanity) and hands the result to WireDashboard, which owns all the
// filtering/pagination/expand-collapse interactivity client-side.
export const dynamic = 'force-dynamic';

export default async function WirePage() {
  const [stories, standings, nslStandings] = await Promise.all([
    getWireFeed({ limit: 200 }),
    getCplStandings(),
    getNslStandings(),
  ]);
  return <WireDashboard initialStories={stories} standings={standings} nslStandings={nslStandings} />;
}
