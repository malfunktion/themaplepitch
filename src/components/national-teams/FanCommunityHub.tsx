import React from 'react';

const events = [
  { city: 'Toronto', venue: 'The Loose Moose', event: 'CanMNT Watch Party — World Cup Qualifier' },
  { city: 'Vancouver', venue: 'Score on Davie', event: 'CanWNT Watch Party — Gold Cup Semifinal' },
  { city: 'Montréal', venue: 'Le Vieux Dublin', event: 'Supporters march ahead of friendly kickoff' },
];

export default function FanCommunityHub() {
  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
        <span>FAN HUB</span>
        <span className="text-red-600 font-bold">SUPPORTER DISPATCH</span>
      </div>
      <p className="text-xs text-neutral-300">
        Supporter culture, watch parties, and community-driven initiatives across Canada.
      </p>
      <div className="flex flex-col divide-y divide-border dark:divide-neutral-800">
        {events.map((e, i) => (
          <div key={i} className="py-2 flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-charcoal dark:text-neutral-200">{e.event}</span>
              <p className="text-[11px] text-charcoal-soft dark:text-neutral-400 mt-0.5">{e.venue}</p>
            </div>
            <span className="text-[9px] font-mono font-bold text-crimson shrink-0 mt-0.5 uppercase">{e.city}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
