import React from 'react';

const clubs = [
  { club: 'Forge FC', u21Minutes: '31%', capSpace: '$48,200', slots: '2 open' },
  { club: 'Cavalry FC', u21Minutes: '27%', capSpace: '$12,900', slots: 'Full' },
  { club: 'Pacific FC', u21Minutes: '34%', capSpace: '$61,500', slots: '3 open' },
];

export default function RosterCompliance() {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-charcoal-soft">
        <span>ROSTER COMPLIANCE</span>
        <span className="text-red-600 font-bold">SALARY CAP</span>
      </div>
      <p className="text-xs text-neutral-300">
        Squad building metrics, U-21 domestic minute tracking, and roster slot status across clubs.
      </p>
      <table className="w-full text-left font-mono text-[11px]">
        <thead>
          <tr className="text-charcoal-soft border-b border-border uppercase text-[9px]">
            <th className="py-1.5 font-normal">Club</th>
            <th className="py-1.5 font-normal text-right">U-21 Mins</th>
            <th className="py-1.5 font-normal text-right">Cap Space</th>
            <th className="py-1.5 font-normal text-right">Slots</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 dark:divide-neutral-800/60">
          {clubs.map((c, i) => (
            <tr key={i}>
              <td className="py-1.5 text-charcoal dark:text-neutral-200 font-bold">{c.club}</td>
              <td className="py-1.5 text-right text-charcoal-soft">{c.u21Minutes}</td>
              <td className="py-1.5 text-right text-charcoal-soft">{c.capSpace}</td>
              <td className="py-1.5 text-right text-crimson font-bold">{c.slots}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
