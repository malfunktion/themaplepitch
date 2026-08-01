import type { StandingsRow } from "@/lib/types";

export default function StandingsWidget({ rows }: { rows: StandingsRow[] }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-charcoal-soft">
        CPL Standings
      </h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-charcoal-soft">
            <th className="pb-1 font-medium">#</th>
            <th className="pb-1 font-medium">Club</th>
            <th className="pb-1 text-right font-medium">P</th>
            <th className="pb-1 text-right font-medium">GD</th>
            <th className="pb-1 text-right font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.position} className="border-t border-border">
              <td className="py-1.5">{row.position}</td>
              <td className="py-1.5 font-medium">{row.clubName}</td>
              <td className="py-1.5 text-right">{row.played}</td>
              <td className="py-1.5 text-right">{row.goalDifference}</td>
              <td className="py-1.5 text-right font-bold">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
