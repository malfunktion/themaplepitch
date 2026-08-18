// src/components/home/ScoutDash.tsx
'use client';

import React from 'react';
import type { StandingsRow } from '@/lib/types';
import StandingsWidget from '@/components/common/StandingsWidget';

interface ScoutDashProps {
    standings?: StandingsRow[];
    nslStandings?: StandingsRow[];
}

export default function ScoutDash({ standings = [], nslStandings = [] }: ScoutDashProps) {
  return (
    <StandingsWidget 
      cplStandings={standings} 
      nslStandings={nslStandings} 
      compact={true} 
      footerAction={{ label: 'VIEW FULL STATS HUB', href: '/stats' }}
    />
  );
}
