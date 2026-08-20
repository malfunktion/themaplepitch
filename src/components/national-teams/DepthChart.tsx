// src/components/national-teams/DepthChart.tsx
'use client';

import React from 'react';

interface DepthChartProps {
  activeGender?: 'MEN' | 'WOMEN' | 'men' | 'women';
}

export default function DepthChart({ activeGender = 'MEN' }: DepthChartProps) {
  const isWomen = String(activeGender).toUpperCase() === 'WOMEN';

  const menDepthData = [
    { pos: 'Left-Back', starter: 'Alphonso Davies', deputy: 'Liam Millar', reserve: 'Luc de Fougerolles' },
    { pos: 'Center-Back', starter: 'Moïse Bombito', deputy: 'Derek Cornelius', reserve: 'Joel Waterman' },
    { pos: 'Central Mid', starter: 'Stephen Eustáquio', deputy: 'Ismaël Koné', reserve: 'Mathieu Choinière' },
    { pos: 'Attacking Mid / Wing', starter: 'Tajon Buchanan', deputy: 'Jacob Shaffelburg', reserve: 'Ali Ahmed' },
    { pos: 'Striker', starter: 'Jonathan David', deputy: 'Cyle Larin', reserve: 'Tani Oluwaseyi' },
  ];

  const womenDepthData = [
    { pos: 'Goalkeeper', starter: 'Kailen Sheridan', deputy: 'Lysianne Proulx', reserve: "Sabrina D'Angelo" },
    { pos: 'Center-Back', starter: 'Vanessa Gilles', deputy: 'Kadeisha Buchanan', reserve: 'Jade Rose' },
    { pos: 'Left-Back / Wing-Back', starter: 'Ashley Lawrence', deputy: 'Gabrielle Carle', reserve: 'Bianca St-Georges' },
    { pos: 'Central Mid', starter: 'Jessie Fleming', deputy: 'Julia Grosso', reserve: 'Quinn' },
    { pos: 'Striker / Forward', starter: 'Evelyne Viens', deputy: 'Cloé Lacasse', reserve: 'Adriana Leon' },
  ];

  const rows = isWomen ? womenDepthData : menDepthData;

  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4 text-charcoal dark:text-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-border pb-2 gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal dark:text-white">
            DEPTH CHART // TACTICAL PILLARS MATRIX
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-crimson/10 text-crimson border border-crimson/30 font-bold uppercase">
            {isWomen ? 'CANWNT' : 'CANMNT'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-crimson font-bold">
          [ {isWomen ? 'EXCEL SYSTEM MAPPING' : 'MARSCH-BALL FORMATION MAPPING'} ]
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] text-charcoal-soft uppercase">
              <th className="py-2 px-3">Position</th>
              <th className="py-2 px-3">Starting XI Preference</th>
              <th className="py-2 px-3">Primary Deputy</th>
              <th className="py-2 px-3 text-right">Emergency Reserve</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-surface/50 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-crimson">{row.pos}</td>
                <td className="py-3 px-3 font-bold text-charcoal dark:text-white">{row.starter}</td>
                <td className="py-3 px-3 text-charcoal dark:text-neutral-200">{row.deputy}</td>
                <td className="py-3 px-3 text-right text-charcoal-soft">{row.reserve}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
