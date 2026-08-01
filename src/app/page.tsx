import { getWireStories } from "@/lib/data/news";
import { getCplStandings } from "@/lib/data/standings";
import EditorialAnchor from "@/components/home/EditorialAnchor";
import WireFeed from "@/components/home/WireFeed";
import ScoutDash from "@/components/home/ScoutDash";

export default async function HomePage() {
  const [stories, standings] = await Promise.all([
    getWireStories(),
    getCplStandings(),
  ]);

  const [featured, ...rest] = stories;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr_minmax(0,280px)]">
      {/* Left column — editorial anchor */}
      <div>{featured && <EditorialAnchor story={featured} />}</div>

      {/* Center column — The Wire */}
      <div>
        <WireFeed stories={rest} />
      </div>

      {/* Right column — Scout's Dash */}
      <ScoutDash standings={standings} />
    </div>
  );
}
