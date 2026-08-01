import type { StandingsRow } from "@/lib/types";
import type { UpcomingFixture } from "@/lib/data/matches";
import UpcomingFixtureWidget from "./UpcomingFixtureWidget";
import StandingsWidget from "./StandingsWidget";
import SupporterCTA from "./SupporterCTA";

export default function ScoutDash({
  standings,
  fixture,
}: {
  standings: StandingsRow[];
  fixture: UpcomingFixture;
}) {
  return (
    <section className="flex flex-col gap-6 lg:col-span-4">
      <UpcomingFixtureWidget fixture={fixture} />
      <StandingsWidget rows={standings} />
      <SupporterCTA />
    </section>
  );
}
