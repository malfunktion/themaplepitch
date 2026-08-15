import React from 'react';

const dispatches = [
  { club: 'Forge FC Academy', note: 'Two U-17 graduates signed to first-team preseason trial squads.', tag: 'SIGNED' },
  { club: 'Whitecaps FC Academy', note: 'Regional combine flagged five prospects for provincial pool review.', tag: 'COMBINE' },
  { club: 'CF Montréal Académie', note: 'U-19 side advances to national academy championship semifinal.', tag: 'RESULT' },
];

export default function AcademyPipelineDispatch() {
  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
        <span>ACADEMY PIPELINE DISPATCH</span>
        <span className="text-red-600 font-bold">LIVE FEED</span>
      </div>
      <p className="text-xs text-neutral-300">
        Tracking elite youth academy integration across CPL clubs and regional provincial setups.
      </p>
      <div className="flex flex-col divide-y divide-border dark:divide-neutral-800">
        {dispatches.map((d, i) => (
          <div key={i} className="py-2 flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-charcoal dark:text-neutral-200">{d.club}</span>
              <p className="text-[11px] text-charcoal-soft dark:text-neutral-400 mt-0.5">{d.note}</p>
            </div>
            <span className="text-[9px] font-mono font-bold text-crimson shrink-0 mt-0.5">{d.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
