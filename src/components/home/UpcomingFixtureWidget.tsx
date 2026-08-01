import type { UpcomingFixture } from "@/lib/types"; // Adjusted to match ScoutDash

export default function UpcomingFixtureWidget({
  fixture,
}: {
  fixture: UpcomingFixture;
}) {
  return (
    <div className="border border-border bg-surface p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-charcoal-soft">
        Next Matchday
      </h3>

      <div className="flex flex-col gap-1">
        <div className="text-sm font-black uppercase tracking-tight text-charcoal">
          {fixture.homeTeam}{" "}
          <span className="font-normal text-charcoal-soft">vs</span>{" "}
          {fixture.awayTeam}
        </div>
       <div className="text-xs text-charcoal-soft">{fixture.venue}</div>

      </div>

      {fixture.ticketUrl ? (
        <a
          href={fixture.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-crimson px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-crimson/90"
        >
          [ Tickets ]
        </a>
      ) : (
        <span className="mt-4 inline-block text-xs uppercase tracking-widest text-charcoal-soft">
          Tickets Coming Soon
        </span>
      )}
    </div>
  );
}
