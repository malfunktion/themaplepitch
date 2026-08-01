import { getWireStories } from "@/lib/data/news";
import { getCplStandings } from "@/lib/data/standings";
import { getNextFixture } from "@/lib/data/matches";
import HeroDossier from "@/components/home/HeroDossier";
import WireFeedList from "@/components/home/WireFeedList";
import ScoutDash from "@/components/home/ScoutDash";

export default async function HomePage() {
  const [stories, standings, fixture] = await Promise.all([
    getWireStories(),
    getCplStandings(),
    getNextFixture(),
  ]);

  const [featured, ...rest] = stories;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {featured && <HeroDossier story={featured} />}
      <WireFeedList stories={rest} />
      <ScoutDash standings={standings} fixture={fixture} />
    </div>
  );
}
