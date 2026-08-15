import React from 'react';

const notes = [
  { prospect: 'L. Fraser', club: 'Scrosoppi FC', note: 'Strong ball progression under pressure; trial requested by two CPL clubs.', grade: 'A-' },
  { prospect: 'E. Nielsen', club: 'Simcoe County Rovers', note: 'Leading provincial scoring charts; needs work off the ball defensively.', grade: 'B+' },
  { prospect: 'C. Douglas', club: 'TSS Rovers', note: 'Highest sprint speed recorded at regional combine this cycle.', grade: 'A' },
];

export default function ScoutingNotebook() {
  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
        <span>SCOUTING NOTEBOOK</span>
        <span className="text-red-600 font-bold">ANALYTICS</span>
      </div>
      <p className="text-xs text-neutral-300">
        Internal scouting notes, metric benchmarks, and prospect evaluations.
      </p>
      <div className="flex flex-col divide-y divide-border dark:divide-neutral-800">
        {notes.map((n, i) => (
          <div key={i} className="py-2 flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-charcoal dark:text-neutral-200">{n.prospect}</span>
              <span className="text-[10px] text-charcoal-soft dark:text-neutral-500"> &middot; {n.club}</span>
              <p className="text-[11px] text-charcoal-soft dark:text-neutral-400 mt-0.5">{n.note}</p>
            </div>
            <span className="text-xs font-mono font-bold text-crimson shrink-0">{n.grade}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
