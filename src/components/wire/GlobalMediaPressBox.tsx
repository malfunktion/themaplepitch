import React from 'react';

const releases = [
  { org: 'Canada Soccer', headline: 'Roster announcement for upcoming international window', time: '2H AGO' },
  { org: 'Canadian Premier League', headline: 'Broadcast schedule confirmed for playoff round', time: '5H AGO' },
  { org: 'Northern Super League', headline: 'League office statement on expansion timeline', time: '1D AGO' },
];

export default function GlobalMediaPressBox() {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-charcoal-soft">
        <span>GLOBAL MEDIA PRESS BOX</span>
        <span className="text-red-600 font-bold">SECURE</span>
      </div>
      <p className="text-xs text-neutral-300">
        Official press releases and media kits from Canadian soccer governing bodies.
      </p>
      <div className="flex flex-col divide-y divide-border dark:divide-neutral-800">
        {releases.map((r, i) => (
          <div key={i} className="py-2 flex items-start justify-between gap-3">
            <div>
              <span className="text-[9px] font-mono font-bold text-charcoal-soft uppercase">{r.org}</span>
              <p className="text-[11px] text-charcoal dark:text-neutral-300 mt-0.5">{r.headline}</p>
            </div>
            <span className="text-[9px] font-mono text-charcoal-soft shrink-0 mt-0.5">{r.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
