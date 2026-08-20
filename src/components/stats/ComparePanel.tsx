'use client';

import React from 'react';
import Link from 'next/link';

type ComparePlayer = {
  playerId: string;
  name: string;
  club: string;
  league: string;
  statSummary: string;
};

interface ComparePanelProps {
  playerA?: ComparePlayer | null;
  playerB?: ComparePlayer | null;
  onClear: () => void;
}

export default function ComparePanel({ playerA, playerB, onClear }: ComparePanelProps) {
  if (!playerA && !playerB) {
    return (
      <section className="bg-card border border-border rounded-sm p-6 text-center font-mono">
        <div className="text-[9px] tracking-[0.18em] text-charcoal-soft uppercase">
          SCOUTING TELEMETRY // COMPARISON TOOL
        </div>
        <h3 className="text-sm font-bold text-charcoal mt-1">PLAYER COMPARISON MATRIX</h3>
        <p className="text-[10px] text-charcoal-soft mt-2">
          Select two players from the database entities stream above to analyze side-by-side biometric and match telemetry.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-card border border-border rounded-sm overflow-hidden font-mono">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <span className="text-[9px] tracking-[0.18em] text-charcoal-soft uppercase">
            SIDE-BY-SIDE EVALUATION
          </span>
          <h3 className="text-sm font-bold text-charcoal mt-1">ACTIVE COMPARISON MATRIX</h3>
        </div>
        <button
          onClick={onClear}
          className="text-[9px] text-crimson border border-crimson/30 px-2.5 py-1 rounded-sm hover:bg-crimson/10 transition-colors"
        >
          [ RESET MATRIX ]
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Player A */}
        <div className="p-4 space-y-3">
          <div className="text-[9px] text-charcoal-soft uppercase">PROSPECT ALPHA // [01]</div>
          {playerA ? (
            <div className="space-y-1">
              <Link href={`/players/${playerA.playerId}`} className="text-xs font-bold text-charcoal hover:text-crimson">
                {playerA.name}
              </Link>
              <div className="text-[10px] text-charcoal-soft">{playerA.club} // {playerA.league}</div>
              <div className="text-xs font-bold text-crimson pt-1">{playerA.statSummary}</div>
            </div>
          ) : (
            <div className="py-8 text-center text-[10px] text-charcoal-soft">
              SELECT FIRST PLAYER FROM STREAM
            </div>
          )}
        </div>

        {/* Player B */}
        <div className="p-4 space-y-3">
          <div className="text-[9px] text-charcoal-soft uppercase">PROSPECT BETA // [02]</div>
          {playerB ? (
            <div className="space-y-1">
              <Link href={`/players/${playerB.playerId}`} className="text-xs font-bold text-charcoal hover:text-crimson">
                {playerB.name}
              </Link>
              <div className="text-[10px] text-charcoal-soft">{playerB.club} // {playerB.league}</div>
              <div className="text-xs font-bold text-crimson pt-1">{playerB.statSummary}</div>
            </div>
          ) : (
            <div className="py-8 text-center text-[10px] text-charcoal-soft">
              SELECT SECOND PLAYER FROM STREAM
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
