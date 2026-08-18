// src/components/home/StatsDashboard.tsx
'use client';

import React from 'react';
import type { StandingsRow } from '@/lib/types';
import StandingsWidget from '@/components/common/StandingsWidget';

interface StatsDashboardProps {
  standings?: StandingsRow[];
  nslStandings?: StandingsRow[];
}

export default function StatsDashboard({ standings = [], nslStandings = [] }: StatsDashboardProps) {
  return (
    <StandingsWidget 
      cplStandings={standings} 
      nslStandings={nslStandings} 
      compact={false} 
      footerAction={{ label: 'VIEW FULL STATS HUB', href: '/stats' }}
    />
  );
}

