import React from 'react';

export default function SidebarAdWidget5() {
  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
        <span>PARTNER SLOT</span>
        <span className="text-red-600 font-bold">SPONSORED</span>
      </div>
      <p className="text-xs text-neutral-300">
        Official partner dispatches and featured industry promotions.
      </p>
      <div className="border border-dashed border-border dark:border-neutral-800 rounded-sm p-4 flex items-center justify-center">
        <span className="text-[10px] font-mono text-charcoal-soft dark:text-neutral-500 uppercase tracking-wider">
          Ad slot available — reach out to advertise@themaplepitch.ca
        </span>
      </div>
    </div>
  );
}
