import React from 'react';
import DataStatus from '@/components/layout/DataStatus';

interface WireContextualStatsProps {
  activeFilter: string;
}

/**
 * Sidebar stat block that swaps content based on the Wire's active filter
 * tab. Case values match the League vocabulary (see lib/types.ts) that
 * getWireFeed()/WireDashboard actually use — previously keyed to the old
 * wire-style vocabulary (TRANSFERS, CPL INTEL, PROVINCIAL, NSL INTEL),
 * which meant every filter tab silently fell through to the generic
 * default block instead of showing filter-specific stats.
 */
export default function WireContextualStats({ activeFilter }: WireContextualStatsProps) {
  switch (activeFilter) {
    case 'Transfers':
      return (
        <>
          <div className="mb-4 border-b border-border pb-3"><DataStatus /></div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">WINDOW STATUS</span>
            <span className="text-[10px] font-bold text-crimson">OPEN</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">MARKET HEAT</span>
            <span className="text-[10px] font-bold text-charcoal">HIGH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-charcoal-soft">EXPIRING DEALS</span>
            <span className="text-[10px] font-bold text-charcoal">124 TRACKED</span>
          </div>
        </>
      );
    case 'CPL':
      return (
        <>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">CURRENT LEADERS</span>
            <span className="text-[10px] font-bold text-charcoal">FORGE FC</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">U-21 MINUTES</span>
            <span className="text-[10px] font-bold text-crimson">ON PACE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-charcoal-soft">NEXT FIXTURE</span>
            <span className="text-[10px] font-bold text-charcoal">FRI 7:00PM</span>
          </div>
        </>
      );
    case 'Provincial':
      return (
        <>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">ACTIVE ZONES</span>
            <span className="text-[10px] font-bold text-charcoal">4 REGIONS</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">SCOUT PRESENCE</span>
            <span className="text-[10px] font-bold text-crimson">ELEVATED</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-charcoal-soft">GAMES THIS WKND</span>
            <span className="text-[10px] font-bold text-charcoal">32 TIES</span>
          </div>
        </>
      );
    case 'NSL':
      return (
        <>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">FRANCHISES</span>
            <span className="text-[10px] font-bold text-charcoal">6 CONFIRMED</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">KICKOFF TARGET</span>
            <span className="text-[10px] font-bold text-crimson">APR 2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-charcoal-soft">ROSTER FILL</span>
            <span className="text-[10px] font-bold text-charcoal">45% COMPLETE</span>
          </div>
        </>
      );
    default:
      return (
        <>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">DATABASE STATUS</span>
            <span className="text-[10px] font-bold text-crimson">SECURE</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-charcoal-soft">ALERTS TODAY</span>
            <span className="text-[10px] font-bold text-charcoal">14 HIGH-PRIORITY</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-charcoal-soft">SYSTEM PING</span>
            <span className="text-[10px] font-bold text-charcoal">12ms</span>
          </div>
        </>
      );
  }
}
