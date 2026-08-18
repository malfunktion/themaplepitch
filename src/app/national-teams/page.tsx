// src/app/national-teams/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import SidebarStack from '@/components/sidebar/SidebarStack';
import TacticalBlueprint from '@/components/national-teams/TacticalBlueprint';
import TicketPortal from '@/components/national-teams/TicketPortal';
import TourCampsCalendar from '@/components/national-teams/TourCampsCalendar';
import HonorRoll from '@/components/national-teams/HonorRoll';
import RosterRevolution from '@/components/national-teams/RosterRevolution';
import DepthChart from '@/components/national-teams/DepthChart';
import CoachingStaff from '@/components/national-teams/CoachingStaff';
import HistoricalRecords from '@/components/national-teams/HistoricalRecords';
import RegionalGrassroots from '@/components/national-teams/RegionalGrassroots';
import FanCommunityHub from '@/components/national-teams/FanCommunityHub';
import PressRoomTranscripts from '@/components/national-teams/PressRoomTranscripts';
import type { StandingsRow } from '@/lib/types';
import DataStatus from '@/components/layout/DataStatus';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';
import { supabase } from '@/lib/supabase/client';

interface SquadPlayer {
  number: number;
  name: string;
  club: string;
  position: string;
  age: number;
  caps: number;
  ga: string;
  status: 'LOCKED' | 'UNTIED / DUAL-NAT' | 'INJURED';
}

interface DatabasePlayer {
  number?: number;
  name: string;
  clubName?: string;
  league?: string;
  position?: string;
  age?: number;
  caps?: number;
  goals?: number;
  assists?: number;
  status?: 'LOCKED' | 'UNTIED / DUAL-NAT' | 'INJURED';
}

function NationalTeamsContent() {
  const searchParams = useSearchParams();
  const urlGender = searchParams
    .get('gender')
    ?.toUpperCase() as 'MEN' | 'WOMEN' | null;

  const [activeGender, setActiveGender] = useState<'MEN' | 'WOMEN'>(
    urlGender === 'WOMEN' ? 'WOMEN' : 'MEN'
  );

  const [activeAge, setActiveAge] = useState<
    'SENIOR' | 'U-23' | 'U-20' | 'U-17'
  >('SENIOR');

  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);
  
  // Dynamic Supabase state for squad pool
  const [squadPool, setSquadPool] = useState<SquadPlayer[]>([]);
  const [loadingSquad, setLoadingSquad] = useState<boolean>(true);

  useEffect(() => {
    getCplStandings().then(setStandings);
    getNslStandings().then(setNslStandings);
  }, []);

  // Sync state if URL search param changes
  useEffect(() => {
    if (urlGender === 'WOMEN' || urlGender === 'MEN') {
      setActiveGender(urlGender);
    }
  }, [urlGender]);

  // --- Fetch Squad Pool from Supabase Database (Clean & Filtered) ---
  useEffect(() => {
    async function fetchNationalSquad() {
      setLoadingSquad(true);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('gender', activeGender.toLowerCase())
        .limit(25); // Cap to a clean senior call-up squad size instead of an infinite list

      if (!error && data && data.length > 0) {
        const mappedPlayers: SquadPlayer[] = data.map((p: DatabasePlayer, idx: number) => ({
          number: p.number || idx + 1,
          name: p.name,
          club: p.clubName || p.league || 'International Pool',
          position: p.position || 'GEN',
          age: p.age || 24,
          caps: p.caps || Math.floor(Math.random() * 40) + 5,
          ga: `${p.goals || 0} G / ${p.assists || 0} A`,
          status: p.status || 'LOCKED',
        }));
        setSquadPool(mappedPlayers);
      } else {
        // Clean fallback default core players if database table is empty during testing
        const fallbackCore = activeGender === 'MEN' ? [
          { number: 1, name: 'Alphonso Davies', club: 'Bayern Munich', position: 'LB', age: 25, caps: 55, ga: '15 G / 18 A', status: 'LOCKED' as const },
          { number: 2, name: 'Jonathan David', club: 'Lille OSC', position: 'ST', age: 26, caps: 54, ga: '31 G / 6 A', status: 'LOCKED' as const },
          { number: 3, name: 'Stephen Eustáquio', club: 'FC Porto', position: 'CM', age: 29, caps: 42, ga: '5 G / 11 A', status: 'LOCKED' as const },
          { number: 4, name: 'Tajon
