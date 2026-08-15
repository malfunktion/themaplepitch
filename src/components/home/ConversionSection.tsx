'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function ConversionSection() {
  return (
    <div className="col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Side: Affiliate Match Tickets */}
      <div className="bg-card border border-border rounded-sm p-5 flex flex-col justify-between relative group hover:border-border transition-colors">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crimson uppercase flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-crimson" />
              MATCHDAY // TICKETS
            </span>
            <span className="text-[9px] font-mono text-charcoal-soft uppercase tracking-wider">
              AFFILIATE PARTNER
            </span>
          </div>
          <h3 className="text-sm font-bold text-charcoal uppercase tracking-wide mb-1">
            SECURE CPL & NSL MATCH TICKETS
          </h3>
          <p className="text-xs text-charcoal-soft font-sans leading-relaxed mb-4">
            Access official primary matchday tickets, rivalry fixtures, and season seats across Canadian professional leagues.
          </p>
        </div>
        
        <div className="pt-3 border-t border-border/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-charcoal">NEXT: PACIFIC FC vs FORGE FC</span>
          <Link
            href="https://onesoccer.ca" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-crimson hover:bg-crimson-dim text-white font-mono text-xs font-bold tracking-wider rounded-sm transition-colors flex items-center gap-1"
          >
            [ TICKETS ] <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Right Side: $1.99 Supporter Tier Upsell */}
      <div className="bg-card border border-border rounded-sm p-5 flex flex-col justify-between relative group hover:border-border transition-colors">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crimson uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-crimson" />
              PRO TERMINAL // SUPPORTER TIER
            </span>
            <span className="text-[9px] font-mono text-charcoal-soft uppercase tracking-wider">
              AD-FREE + ALL DATA
            </span>
          </div>
          <h3 className="text-sm font-bold text-charcoal uppercase tracking-wide mb-1">
            GO AD-FREE & UNLOCK ALL SCOUT DATA
          </h3>
          <p className="text-xs text-charcoal-soft font-sans leading-relaxed mb-4">
            Support independent Canadian soccer journalism. Get pure white-space reading, deep data histories, and advanced scouting sheets.
          </p>
        </div>

        <div className="pt-3 border-t border-border/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-charcoal">$1.99/MO <span className="text-charcoal-soft">(OR $17.99/YR)</span></span>
          <Link
            href="/supporter"
            className="px-3 py-1.5 bg-crimson hover:bg-crimson-dim text-white font-mono text-xs font-bold tracking-wider rounded-sm transition-colors flex items-center gap-1"
          >
            [ UPGRADE ] <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}