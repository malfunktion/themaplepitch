import type { StandingsRow } from "@/lib/types";

export default function StandingsWidget({ rows }: { rows: StandingsRow[] }) {
  return (
    <div className="border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal">
          CPL Table
        </h3>
        <span className="cursor-pointer text-[10px] uppercase text-charcoal-soft hover:text-crimson">
          Full List
        </span>
      </div>
      <div className="flex flex-col text-sm">
        {rows.map((row, index) => (
          <div
            key={row.position}
            className={`flex justify-between py-2 ${
              index !== rows.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            <span className="font-bold text-charcoal">
              <span className="mr-2 text-charcoal-soft">{row.position}</span>
              {row.clubName}
            </span>
            <span className="font-bold">{row.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
