import React from 'react';

const regions = [
  { league: 'League1 Ontario', headline: 'Vaughan Azzurri clinch top spot with two matches to spare' },
  { league: 'League1 BC', headline: 'TSS Rovers and Altitude FC play to a scoreless derby draw' },
  { league: 'League1 Alberta', headline: 'Calgary Foothills extend unbeaten run to eight matches' },
  { league: 'PLSQ', headline: 'CS Saint-Laurent secures playoff berth with midweek win' },
];

export default function RegionalAggregator() {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-charcoal-soft">
        <span>REGIONAL AGGREGATOR</span>
        <span className="text-red-600 font-bold">PROVINCIAL</span>
      </div>
      <p className="text-xs text-neutral-300">
        Aggregated local dispatches covering League1 Ontario, League1 BC, League1 Alberta, and PLSQ.
      </p>
      <div className="flex flex-col divide-y divide-border dark:divide-neutral-800">
        {regions.map((r, i) => (
          <div key={i} className="py-2">
            <span className="text-[9px] font-mono font-bold text-crimson uppercase">{r.league}</span>
            <p className="text-[11px] text-charcoal dark:text-neutral-300 mt-0.5">{r.headline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
