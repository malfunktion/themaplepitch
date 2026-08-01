import type { StandingsRow } from "@/lib/types";
import StandingsWidget from "./StandingsWidget";
import SupporterCTA from "./SupporterCTA";

export default function ScoutDash({ standings }: { standings: StandingsRow[] }) {
  return (
    <aside className="space-y-4">
      <StandingsWidget rows={standings} />
      <SupporterCTA />
    </aside>
  );
}
