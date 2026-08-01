import React from 'react';

export default function ScoutDash() {
  return (
    <section className="border border-neutral-200 bg-white p-6 rounded-none">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
        <h2 className="text-xs font-mono tracking-widest uppercase text-neutral-500">
          // SCOUT DASHBOARD & ANALYTICS
        </h2>
        <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-neutral-50">
          <span className="text-sm font-semibold text-neutral-900">Active Pipeline</span>
          <span className="text-xs font-mono bg-neutral-100 px-2 py-1 text-neutral-700">LIVE FEED</span>
        </div>
        <p className="text-xs text-neutral-500 font-mono">
          Monitoring Canadian talent pools across CPL, MLS, and European pathways.
        </p>
      </div>
    </section>
  );
}
