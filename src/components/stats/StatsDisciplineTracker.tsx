import React from 'react';

const discipline = [
  { player: 'M. Anunga', club: 'Cavalry FC', yellows: 6, reds: 0 },
  { player: 'T. Shaw', club: 'York United FC', yellows: 5, reds: 1 },
  { player: 'K. Rennie', club: 'Atlético Ottawa', yellows: 4, reds: 0 },
];

export default function StatsDisciplineTracker() {
  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
        <span>DISCIPLINE TRACKER</span>
        <span className="text-red-600 font-bold">CARDS &amp; FOULS</span>
      </div>
      <p className="text-xs text-neutral-300">
        Tracking yellow and red cards, suspensions, and disciplinary logs across competitions.
      </p>
      <table className="w-full text-left font-mono text-[11px]">
        <thead>
          <tr className="text-charcoal-soft dark:text-neutral-500 border-b border-border dark:border-neutral-800 uppercase text-[9px]">
            <th className="py-1.5 font-normal">Player</th>
            <th className="py-1.5 font-normal">Club</th>
            <th className="py-1.5 font-normal text-right">Yellow</th>
            <th className="py-1.5 font-normal text-right">Red</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 dark:divide-neutral-800/60">
          {discipline.map((d, i) => (
            <tr key={i}>
              <td className="py-1.5 text-charcoal dark:text-neutral-200 font-bold">{d.player}</td>
              <td className="py-1.5 text-charcoal-soft dark:text-neutral-400">{d.club}</td>
              <td className="py-1.5 text-right text-charcoal dark:text-neutral-300">{d.yellows}</td>
              <td className="py-1.5 text-right text-crimson font-bold">{d.reds}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
