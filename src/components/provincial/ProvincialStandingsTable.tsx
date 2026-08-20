import React from 'react';

interface StandingsRow {
  pos: number;
  club: string;
  pld: number;
  wins: number;
  pts: number;
  gd: string;
  form: ('W' | 'D' | 'L')[];
}

interface ProvincialStandingsTableProps {
  leagueName: string;
  standings: StandingsRow[];
  gender: string;
  tier: string;
  /** Number of top rows to highlight as a promotion zone. Omit if this is the top tier. */
  promotionSpots?: number;
  /** Number of bottom rows to highlight as a relegation zone. Omit if this is the bottom tier. */
  relegationSpots?: number;
}

export default function ProvincialStandingsTable({
  leagueName,
  standings,
  gender,
  tier,
  promotionSpots = 0,
  relegationSpots = 0,
}: ProvincialStandingsTableProps) {
  const zoneFor = (rowPos: number) => {
    if (promotionSpots > 0 && rowPos <= promotionSpots) return 'promotion';
    if (relegationSpots > 0 && rowPos > standings.length - relegationSpots) return 'relegation';
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-charcoal-soft">
        <span>{leagueName}</span>
        <span className="text-red-600 font-bold">{gender} &middot; {tier}</span>
      </div>
      <table className="w-full text-left font-mono text-[11px]">
        <thead>
          <tr className="text-charcoal-soft border-b border-border uppercase text-[9px]">
            <th className="py-1.5 font-normal">#</th>
            <th className="py-1.5 font-normal">Club</th>
            <th className="py-1.5 font-normal text-right">P</th>
            <th className="py-1.5 font-normal text-right">W</th>
            <th className="py-1.5 font-normal text-right">GD</th>
            <th className="py-1.5 font-normal text-right">Pts</th>
            <th className="py-1.5 font-normal text-right">Form</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 dark:divide-neutral-800/60">
          {standings.length > 0 ? standings.map((row) => {
            const zone = zoneFor(row.pos);
            return (
            <tr
              key={row.pos}
              className={
                zone === 'promotion'
                  ? 'border-l-2 border-l-crimson'
                  : zone === 'relegation'
                  ? 'border-l-2 border-l-amber-600/70 dark:border-l-amber-500/70'
                  : ''
              }
            >
              <td className="py-1.5 pl-1.5 text-charcoal-soft">{row.pos}</td>
              <td className="py-1.5 text-charcoal dark:text-neutral-200 font-bold">{row.club}</td>
              <td className="py-1.5 text-right text-charcoal-soft">{row.pld}</td>
              <td className="py-1.5 text-right text-charcoal-soft">{row.wins}</td>
              <td className="py-1.5 text-right text-charcoal-soft">{row.gd}</td>
              <td className="py-1.5 text-right text-crimson font-bold">{row.pts}</td>
              <td className="py-1.5 text-right">
                <div className="flex justify-end gap-0.5">
                  {row.form.map((f, i) => (
                    <span
                      key={i}
                      className={`w-3.5 h-3.5 flex items-center justify-center rounded-[2px] text-[8px] font-bold ${
                        f === 'W' ? 'bg-crimson text-white' : f === 'D' ? 'bg-border dark:bg-neutral-700 text-charcoal dark:text-neutral-200' : 'bg-transparent border border-border dark:border-neutral-700 text-charcoal-soft'
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
            );
          }) : (
            <tr><td colSpan={7} className="py-4 text-center text-charcoal-soft">No standings available for this tier yet.</td></tr>
          )}
        </tbody>
      </table>
      {(promotionSpots > 0 || relegationSpots > 0) && standings.length > 0 && (
        <div className="flex gap-4 text-[9px] font-mono text-charcoal-soft pt-1 border-t border-border/60/60">
          {promotionSpots > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-crimson rounded-[1px]" /> Promotion
            </span>
          )}
          {relegationSpots > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-amber-600/70 dark:bg-amber-500/70 rounded-[1px]" /> Relegation
            </span>
          )}
        </div>
      )}
    </div>
  );
}
