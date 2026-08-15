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

  // Sync state if URL search param changes
  useEffect(() => {
    if (urlGender === 'WOMEN' || urlGender === 'MEN') {
      setActiveGender(urlGender);
    }
  }, [urlGender]);

  // --- Sample Data for Squad Pool ---
  const squadPool: SquadPlayer[] =
    activeGender === 'MEN'
      ? [
          {
            number: 10,
            name: 'Jonathan David',
            club: 'Lille OSC',
            position: 'FWD',
            age: 26,
            caps: 58,
            ga: '31 G / 6 A',
            status: 'LOCKED',
          },
          {
            number: 19,
            name: 'Alphonso Davies',
            club: 'Bayern Munich',
            position: 'LB / W',
            age: 25,
            caps: 54,
            ga: '15 G / 18 A',
            status: 'LOCKED',
          },
          {
            number: 7,
            name: 'Tajon Buchanan',
            club: 'Villarreal',
            position: 'RW',
            age: 27,
            caps: 42,
            ga: '8 G / 5 A',
            status: 'INJURED',
          },
          {
            number: 8,
            name: 'Ismaël Koné',
            club: 'Marseille',
            position: 'CM',
            age: 23,
            caps: 28,
            ga: '3 G / 4 A',
            status: 'LOCKED',
          },
          {
            number: 2,
            name: 'Alistair Johnston',
            club: 'Celtic FC',
            position: 'RB',
            age: 27,
            caps: 47,
            ga: '2 G / 6 A',
            status: 'LOCKED',
          },
          {
            number: 21,
            name: 'Luc de Fougerolles',
            club: 'Fulham U21',
            position: 'CB',
            age: 20,
            caps: 3,
            ga: '0 G / 0 A',
            status: 'UNTIED / DUAL-NAT',
          },
        ]
      : [
          {
            number: 11,
            name: 'Evelyne Viens',
            club: 'AS Roma',
            position: 'ST',
            age: 29,
            caps: 32,
            ga: '14 G / 3 A',
            status: 'LOCKED',
          },
          {
            number: 6,
            name: 'Jessie Fleming',
            club: 'Portland Thorns',
            position: 'CM',
            age: 28,
            caps: 135,
            ga: '19 G / 22 A',
            status: 'LOCKED',
          },
          {
            number: 14,
            name: 'Vanessa Gilles',
            club: 'Lyon',
            position: 'CB',
            age: 30,
            caps: 45,
            ga: '4 G / 0 A',
            status: 'LOCKED',
          },
          {
            number: 9,
            name: 'Jordyn Huitema',
            club: 'Seattle Reign',
            position: 'FWD',
            age: 25,
            caps: 82,
            ga: '18 G / 9 A',
            status: 'LOCKED',
          },
          {
            number: 3,
            name: 'Jade Rose',
            club: 'Harvard / National Pool',
            position: 'CB',
            age: 23,
            caps: 22,
            ga: '1 G / 2 A',
            status: 'LOCKED',
          },
          {
            number: 18,
            name: 'Olivia Smith',
            club: 'Sporting CP',
            position: 'W',
            age: 21,
            caps: 14,
            ga: '4 G / 3 A',
            status: 'UNTIED / DUAL-NAT',
          },
        ];

  // --- Federation Rankings & Telemetry Dataset ---
  const federationData = {
    MEN: {
      fifaRank: '#32',
      fifaPts: '1512.4',
      fifaDelta: '+12.4 PTS',
      peakRank: '#26',
      concacafRank: '#3',
      concacafLeader: 'BEHIND MX / US',
      nationsLeague: 'LEAGUE A // POT 1',
      tournamentSeed: 'POT 2 (WORLD CUP) // POT 1 (GOLD CUP)',
      unbeatenRate: '80%',
      xGIndex: '+1.20 xG / MATCH',
    },
    WOMEN: {
      fifaRank: '#6',
      fifaPts: '2008.2',
      fifaDelta: '+4.1 PTS',
      peakRank: '#4',
      concacafRank: '#2',
      concacafLeader: 'BEHIND US',
      nationsLeague: 'LEAGUE A // POT 1',
      tournamentSeed: 'POT 1 (GOLD CUP) // POT 1 (OLYMPICS)',
      unbeatenRate: '80%',
      xGIndex: '+1.45 xG / MATCH',
    },
  };

  const currentFed = federationData[activeGender];

  // --- National Team Tracker Datasets (Men / Women) ---
  const nationalStatsData = {
    MEN: {
      goldenBoot: [
        {
          rank: 1,
          name: 'Jonathan David',
          club: 'Lille OSC',
          value: 31,
          subText: '31 Goals • 0.53 G/M • 8.9 RTG',
          redWidth: '100%',
        },
        {
          rank: 2,
          name: 'Cyle Larin',
          club: 'Mallorca',
          value: 29,
          subText: '29 Goals • 0.48 G/M • 8.4 RTG',
          redWidth: '93%',
        },
        {
          rank: 3,
          name: 'Alphonso Davies',
          club: 'Bayern Munich',
          value: 15,
          subText: '15 Goals • 0.28 G/M • 8.7 RTG',
          redWidth: '48%',
        },
        {
          rank: 4,
          name: 'Jonathan Osorio',
          club: 'Toronto FC',
          value: 9,
          subText: '9 Goals • 0.12 G/M • 7.5 RTG',
          redWidth: '29%',
        },
        {
          rank: 5,
          name: 'Tajon Buchanan',
          club: 'Villarreal',
          value: 8,
          subText: '8 Goals • 0.19 G/M • 7.8 RTG',
          redWidth: '25%',
        },
      ],
      avgGoals: [
        {
          rank: 1,
          name: 'Jonathan David',
          club: 'Lille OSC',
          value: '0.53',
          subText: '0.53 GPM • 58 Apps',
          redWidth: '100%',
          whiteWidth: '0%',
        },
        {
          rank: 2,
          name: 'Cyle Larin',
          club: 'Mallorca',
          value: '0.48',
          subText: '0.48 GPM • 60 Apps',
          redWidth: '90%',
          whiteWidth: '10%',
        },
        {
          rank: 3,
          name: 'Alphonso Davies',
          club: 'Bayern Munich',
          value: '0.28',
          subText: '0.28 GPM • 54 Apps',
          redWidth: '53%',
          whiteWidth: '47%',
        },
        {
          rank: 4,
          name: 'Tajon Buchanan',
          club: 'Villarreal',
          value: '0.19',
          subText: '0.19 GPM • 42 Apps',
          redWidth: '35%',
          whiteWidth: '65%',
        },
        {
          rank: 5,
          name: 'Jonathan Osorio',
          club: 'Toronto FC',
          value: '0.12',
          subText: '0.12 GPM • 78 Apps',
          redWidth: '22%',
          whiteWidth: '78%',
        },
      ],
      assists: [
        {
          rank: 1,
          name: 'Alphonso Davies',
          club: 'Bayern Munich',
          value: 18,
          subText: '18 Assists • 0.33 APM • 8.7 RTG',
          redWidth: '100%',
        },
        {
          rank: 2,
          name: 'Junior Hoilett',
          club: 'Hive FC',
          value: 14,
          subText: '14 Assists • 0.22 APM • 7.9 RTG',
          redWidth: '77%',
        },
        {
          rank: 3,
          name: 'Stephen Eustáquio',
          club: 'Porto',
          value: 11,
          subText: '11 Assists • 0.20 APM • 8.1 RTG',
          redWidth: '61%',
        },
        {
          rank: 4,
          name: 'Alistair Johnston',
          club: 'Celtic FC',
          value: 6,
          subText: '6 Assists • 0.12 APM • 7.8 RTG',
          redWidth: '33%',
        },
        {
          rank: 5,
          name: 'Ismaël Koné',
          club: 'Marseille',
          value: 4,
          subText: '4 Assists • 0.14 APM • 7.6 RTG',
          redWidth: '22%',
        },
      ],
      cleanSheets: [
        {
          rank: 1,
          name: 'Milan Borjan',
          club: 'Red Star / Pool',
          value: 26,
          subText: '26 Clean Sheets • 44% Rate',
          redWidth: '100%',
        },
        {
          rank: 2,
          name: 'Maxime Crépeau',
          club: 'Portland Timbers',
          value: 14,
          subText: '14 Clean Sheets • 38% Rate',
          redWidth: '53%',
        },
        {
          rank: 3,
          name: 'Dayne St. Clair',
          club: 'Minnesota United',
          value: 9,
          subText: '9 Clean Sheets • 35% Rate',
          redWidth: '34%',
        },
      ],
    },
    WOMEN: {
      goldenBoot: [
        {
          rank: 1,
          name: 'Christine Sinclair',
          club: 'Retired Legend',
          value: 190,
          subText: '190 Goals • 0.58 G/M • 9.9 RTG',
          redWidth: '100%',
        },
        {
          rank: 2,
          name: 'Jessie Fleming',
          club: 'Portland Thorns',
          value: 19,
          subText: '19 Goals • 0.14 G/M • 8.8 RTG',
          redWidth: '10%',
        },
        {
          rank: 3,
          name: 'Jordyn Huitema',
          club: 'Seattle Reign',
          value: 18,
          subText: '18 Goals • 0.21 G/M • 8.1 RTG',
          redWidth: '9%',
        },
        {
          rank: 4,
          name: 'Evelyne Viens',
          club: 'AS Roma',
          value: 14,
          subText: '14 Goals • 0.43 G/M • 8.5 RTG',
          redWidth: '7%',
        },
        {
          rank: 5,
          name: 'Adriana Leon',
          club: 'Aston Villa',
          value: 31,
          subText: '31 Goals • 0.29 G/M • 8.2 RTG',
          redWidth: '16%',
        },
      ],
      avgGoals: [
        {
          rank: 1,
          name: 'Christine Sinclair',
          club: 'Retired Legend',
          value: '0.58',
          subText: '0.58 GPM • 331 Apps',
          redWidth: '100%',
          whiteWidth: '0%',
        },
        {
          rank: 2,
          name: 'Evelyne Viens',
          club: 'AS Roma',
          value: '0.43',
          subText: '0.43 GPM • 32 Apps',
          redWidth: '74%',
          whiteWidth: '26%',
        },
        {
          rank: 3,
          name: 'Adriana Leon',
          club: 'Aston Villa',
          value: '0.29',
          subText: '0.29 GPM • 108 Apps',
          redWidth: '50%',
          whiteWidth: '50%',
        },
        {
          rank: 4,
          name: 'Jordyn Huitema',
          club: 'Seattle Reign',
          value: '0.21',
          subText: '0.21 GPM • 82 Apps',
          redWidth: '36%',
          whiteWidth: '64%',
        },
        {
          rank: 5,
          name: 'Jessie Fleming',
          club: 'Portland Thorns',
          value: '0.14',
          subText: '0.14 GPM • 135 Apps',
          redWidth: '24%',
          whiteWidth: '76%',
        },
      ],
      assists: [
        {
          rank: 1,
          name: 'Jessie Fleming',
          club: 'Portland Thorns',
          value: 22,
          subText: '22 Assists • 0.16 APM • 8.8 RTG',
          redWidth: '100%',
        },
        {
          rank: 2,
          name: 'Janine Beckie',
          club: 'Racing Louisville',
          value: 15,
          subText: '15 Assists • 0.15 APM • 8.0 RTG',
          redWidth: '68%',
        },
        {
          rank: 3,
          name: 'Jordyn Huitema',
          club: 'Seattle Reign',
          value: 9,
          subText: '9 Assists • 0.11 APM • 7.9 RTG',
          redWidth: '40%',
        },
        {
          rank: 4,
          name: 'Kadeisha Buchanan',
          club: 'Chelsea',
          value: 5,
          subText: '5 Assists • 0.04 APM • 8.4 RTG',
          redWidth: '22%',
        },
        {
          rank: 5,
          name: 'Olivia Smith',
          club: 'Sporting CP',
          value: 3,
          subText: '3 Assists • 0.21 APM • 8.3 RTG',
          redWidth: '13%',
        },
      ],
      cleanSheets: [
        {
          rank: 1,
          name: 'Kailen Sheridan',
          club: 'San Diego Wave',
          value: 42,
          subText: '42 Clean Sheets • 52% Rate',
          redWidth: '100%',
        },
        {
          rank: 2,
          name: 'Stephanie Labbé',
          club: 'Retired Legend',
          value: 39,
          subText: '39 Clean Sheets • 48% Rate',
          redWidth: '92%',
        },
        {
          rank: 3,
          name: 'Sabrina D’Angelo',
          club: 'Aston Villa',
          value: 12,
          subText: '12 Clean Sheets • 40% Rate',
          redWidth: '28%',
        },
      ],
    },
  };

  const currentStats = nationalStatsData[activeGender];

  const standings: StandingsRow[] = [
    {
      position: 1,
      clubName: 'Forge FC',
      played: 0,
      points: 0,
      goalDifference: 0,
    },
    {
      position: 2,
      clubName: 'Pacific FC',
      played: 0,
      points: 0,
      goalDifference: 0,
    },
    {
      position: 3,
      clubName: 'Cavalry FC',
      played: 0,
      points: 0,
      goalDifference: 0,
    },
    {
      position: 4,
      clubName: 'Atlético Ottawa',
      played: 0,
      points: 0,
      goalDifference: 0,
    },
  ];

  const nslStandings: StandingsRow[] = [
    {
      position: 1,
      clubName: 'AFC Toronto',
      played: 0,
      points: 0,
      goalDifference: 0,
    },
    {
      position: 2,
      clubName: 'Calgary Wild FC',
      played: 0,
      points: 0,
      goalDifference: 0,
    },
    {
      position: 3,
      clubName: 'Halifax Tides FC',
      played: 0,
      points: 0,
      goalDifference: 0,
    },
  ];

  return (
    <div className="min-h-[100dvh] p-2 sm:p-4 md:p-6 pb-[env(safe-area-inset-bottom)] bg-surface text-charcoal">
      <div className="mb-4 border-b border-border pb-3">
        <DataStatus />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* 1. TOP CONTROL BAR: Master Gender & Age Bracket Toggles */}
          <div className="bg-card border border-border rounded-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveGender('MEN')}
                className={`flex-1 md:flex-initial px-4 py-2 text-xs font-mono font-bold tracking-wider transition-colors border rounded-sm ${
                  activeGender === 'MEN'
                    ? 'bg-crimson text-white border-crimson'
                    : 'bg-transparent text-charcoal-soft border-border hover:text-charcoal'
                }`}
              >
                [ MEN’S NATIONAL PROGRAM ]
              </button>
              <button
                onClick={() => setActiveGender('WOMEN')}
                className={`flex-1 md:flex-initial px-4 py-2 text-xs font-mono font-bold tracking-wider transition-colors border rounded-sm ${
                  activeGender === 'WOMEN'
                    ? 'bg-crimson text-white border-crimson'
                    : 'bg-transparent text-charcoal-soft border-border hover:text-charcoal'
                }`}
              >
                [ WOMEN’S NATIONAL PROGRAM ]
              </button>
            </div>

            {/* Age Bracket Filter Pills */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-end">
              {(
                ['SENIOR', 'U-23', 'U-20', 'U-17'] as const
              ).map((age) => (
                <button
                  key={age}
                  onClick={() => setActiveAge(age)}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider rounded-sm transition-colors border ${
                    activeAge === age
                      ? 'bg-crimson text-white border-crimson'
                      : 'bg-transparent text-charcoal-soft border-border hover:text-charcoal'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* 2. UPPER FOLD: Senior National Team Command Center (35% / 65% Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Hero Dossier (~35% width / 5 cols) */}
            <div className="lg:col-span-5 bg-card border border-border rounded-sm p-4 relative group flex flex-col justify-between min-h-[340px] overflow-hidden">
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    activeGender === 'MEN'
                      ? 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'
                      : 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop'
                  }
                  alt="National Team Captain"
                  className="w-full h-full object-cover grayscale contrast-125 opacity-40 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <h1 className="text-[9px] font-mono font-bold bg-crimson text-white px-2 py-0.5 rounded-sm inline-block">
                  [ {activeGender} {'//'} {activeAge} COMMAND CENTER ]
                </h1>
                <span className="text-[10px] font-mono text-charcoal bg-card/80 px-2 py-0.5 border border-border">
                  FIFA RANK: {currentFed.fifaRank}
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-2">
                <span className="text-[10px] font-mono text-crimson tracking-widest">
                  INTERNATIONAL WINDOW ACTIVE
                </span>
                <h2 className="text-xl font-bold tracking-tight text-charcoal uppercase">
                  {activeGender === 'MEN'
                    ? 'PREPARING FOR CONCACAF NATIONS LEAGUE SEMIFINALS'
                    : 'INTERNATIONAL FRIENDLY SERIES // EUROPEAN TOUR'}
                </h2>
                <p className="text-xs text-charcoal line-clamp-2">
                  Technical staff report full squad health as players arrive
                  in camp following weekend league action across Europe and MLS.
                </p>
                <div className="pt-2">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-crimson hover:text-crimson-dim"
                  >
                    VIEW MANAGER DOSSIER ➔
                  </a>
                </div>
              </div>
            </div>

            {/* Right Squad & Fixture Stream (~65% width / 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
              {/* Next Match Countdown & Broadcast Hub */}
              <div className="bg-card border border-border rounded-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-charcoal-soft">
                    NEXT FIXTURE {'//'} {activeAge}
                  </span>
                  <span className="text-sm font-bold text-charcoal uppercase">
                    CANADA vs.{' '}
                    {activeGender === 'MEN' ? 'UNITED STATES' : 'BRAZIL'}
                  </span>
                  <span className="text-xs font-mono text-crimson mt-0.5">
                    FRI, OCT 10 • 7:00 PM EDT
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
                  <span className="text-[9px] font-mono text-charcoal-soft uppercase">
                    LEGAL BROADCAST STREAM
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono font-bold bg-card text-charcoal px-2.5 py-1 border border-border rounded-sm">
                      ONE SOCCER
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-card text-charcoal px-2.5 py-1 border border-border rounded-sm">
                      TSN
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Form & Results Log */}
              <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-2.5">
                <span className="text-[10px] font-mono font-bold text-charcoal-soft uppercase">
                  RECENT FORM LOG (LAST 5 MATCHES)
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { opp: 'MEX', res: 'W', score: '2-1' },
                    { opp: 'USA', res: 'D', score: '1-1' },
                    { opp: 'PAN', res: 'W', score: '2-0' },
                    { opp: 'ARG', res: 'L', score: '0-2' },
                    { opp: 'NZL', res: 'W', score: '3-0' },
                  ].map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-card border border-border rounded-sm p-2 flex flex-col items-center justify-center"
                    >
                      <span className="text-[9px] font-mono text-charcoal-soft">
                        {m.opp}
                      </span>
                      <span
                        className={`text-xs font-bold font-mono my-0.5 ${
                          m.res === 'W'
                            ? 'text-crimson'
                            : m.res === 'D'
                            ? 'text-charcoal'
                            : 'text-charcoal-soft'
                        }`}
                      >
                        {m.res} ({m.score})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Federation Intelligence & Seeding Terminal */}
              <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-[10px] font-mono font-bold text-charcoal-soft uppercase tracking-wider">
                    FEDERATION INTELLIGENCE & SEEDING TERMINAL ({activeGender})
                  </span>
                  <span className="text-[9px] font-mono text-crimson">
                    [ LIVE RANKING TELEMETRY ]
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* FIFA World Ranking Block */}
                  <div className="bg-card border border-border rounded-sm p-3 flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-charcoal-soft uppercase">
                        FIFA WORLD RANK
                      </span>
                      <span className="text-[9px] font-mono text-crimson font-bold">
                        {currentFed.fifaDelta}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono text-charcoal">
                        {currentFed.fifaRank}
                      </span>
                      <span className="text-[10px] font-mono text-charcoal-soft">
                        ({currentFed.fifaPts} PTS)
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-charcoal-soft pt-1 border-t border-border">
                      HISTORICAL PEAK:{' '}
                      <strong className="text-charcoal">
                        {currentFed.peakRank}
                      </strong>
                    </span>
                  </div>

                  {/* CONCACAF Regional Rank & Coefficient */}
                  <div className="bg-card border border-border rounded-sm p-3 flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-charcoal-soft uppercase">
                        CONCACAF RANK
                      </span>
                      <span className="text-[9px] font-mono text-charcoal-soft">
                        {currentFed.concacafLeader}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono text-charcoal">
                        {currentFed.concacafRank}
                      </span>
                      <span className="text-[10px] font-mono text-charcoal-soft">
                        REGIONAL
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-charcoal-soft pt-1 border-t border-border">
                      NL STATUS:{' '}
                      <strong className="text-crimson">
                        {currentFed.nationsLeague}
                      </strong>
                    </span>
                  </div>

                  {/* Tournament Seeding & Efficiency */}
                  <div className="bg-card border border-border rounded-sm p-3 flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-charcoal-soft uppercase">
                        SEEDING & EFFICIENCY
                      </span>
                      <span className="text-[9px] font-mono text-charcoal font-bold">
                        {currentFed.unbeatenRate} UNBEATEN
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold font-mono text-charcoal truncate">
                        {currentFed.tournamentSeed}
                      </span>
                      <span className="text-[10px] font-mono text-crimson mt-0.5">
                        {currentFed.xGIndex}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-charcoal-soft pt-1 border-t border-border">
                      CYCLE TELEMETRY:{' '}
                      <strong className="text-charcoal">
                        OPTA OPTIMIZED
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. THE YOUTH EXCEL PATHWAY GRID (U-23, U-20, U-17) */}
          <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                YOUTH EXCEL PATHWAY {'//'} U-23, U-20 & U-17 DEVELOPMENT POOLS
              </span>
              <span className="text-[10px] font-mono text-crimson">
                CONCACAF QUALIFYING CYCLE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'U-23 OLYMPIC POOL',
                  desc: 'Tracking domestic MLS/CPL and NCAA standouts ready for senior transition.',
                  status: 'CAMP ACTIVE',
                },
                {
                  title: 'U-20 CONCACAF SQUAD',
                  desc: 'Preparing for upcoming World Cup qualification tournament rounds.',
                  status: 'SCOUTING',
                },
                {
                  title: 'U-17 ACADEMY PIPELINE',
                  desc: 'Elite grassroots regional combine evaluations across League1 academies.',
                  status: 'ACTIVE POOL',
                },
              ].map((youth, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-sm p-3.5 flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-charcoal">
                        {youth.title}
                      </span>
                      <span className="text-[9px] font-mono text-crimson bg-crimson/10 px-1.5 py-0.5 border border-crimson/30 rounded-sm">
                        {youth.status}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-soft mt-1">
                      {youth.desc}
                    </p>
                  </div>
                  <button className="text-[10px] font-mono font-bold text-charcoal hover:text-charcoal flex items-center gap-1 pt-2 border-t border-border">
                    VIEW SQUAD ROSTER ➔
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. NATIONAL TEAM SQUAD & ROSTER POOL ("SCOUT'S CALL-UP" TABLE) */}
          <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                NATIONAL TEAM SQUAD {'//'} “SCOUT’S CALL-UP” POOL DATABASE
              </span>
              <span className="text-[10px] font-mono text-charcoal-soft">
                {squadPool.length} REGISTERED ASSETS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[10px] font-mono text-charcoal-soft uppercase">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-3">Player Name</th>
                    <th className="py-2 px-2">Pos</th>
                    <th className="py-2 px-2">Age</th>
                    <th className="py-2 px-2">Caps</th>
                    <th className="py-2 px-3">G / A</th>
                    <th className="py-2 px-3 text-right">Status Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs font-mono">
                  {squadPool.map((p, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-card/50 transition-colors"
                    >
                      <td className="py-2.5 px-2 text-charcoal-soft font-bold">
                        {p.number}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-charcoal flex items-center gap-2">
                        {p.name}{' '}
                        <span className="text-[10px] font-normal text-charcoal-soft font-sans">
                          ({p.club})
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-charcoal-soft">
                        {p.position}
                      </td>
                      <td className="py-2.5 px-2 text-charcoal">{p.age}</td>
                      <td className="py-2.5 px-2 text-charcoal">{p.caps}</td>
                      <td className="py-2.5 px-3 text-charcoal">{p.ga}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-sm border ${
                            p.status === 'LOCKED'
                              ? 'bg-crimson/10 text-crimson border-crimson/30'
                              : p.status === 'INJURED'
                              ? 'bg-card text-charcoal-soft border-border'
                              : 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50'
                          }`}
                        >
                          [ {p.status} ]
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. NATIONAL TEAM TRACKER (Golden Boot, Avg Goals, Assists, Clean Sheets) */}
          <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
                NATIONAL TEAM TRACKER {'//'} PERFORMANCE & SCOUTING METRICS ({activeGender})
              </span>
              <span className="text-[10px] font-mono text-crimson">
                [ LIVE POOL STATS ]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Module A: Golden Boot / Top Scorers */}
              <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-charcoal-soft border-b border-border pb-1.5">
                  GOLDEN BOOT {'//'} TOP SCORERS ({activeGender})
                </span>
                <div className="flex flex-col gap-2.5">
                  {currentStats.goldenBoot.map((player) => (
                    <div key={player.rank} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-charcoal-soft font-bold w-4">
                            {player.rank}.
                          </span>
                          <div className="w-5 h-5 bg-border border border-border rounded-full flex items-center justify-center text-[9px] font-bold text-charcoal">
                            {player.name.charAt(0)}
                          </div>
                          <span className="font-bold text-charcoal">
                            {player.name}
                          </span>
                          <span className="text-[10px] text-charcoal-soft">
                            ({player.club})
                          </span>
                        </div>
                        <span className="font-bold text-crimson">
                          {player.value} ⚽
                        </span>
                      </div>
                      <div className="w-full bg-border h-1.5 rounded-sm overflow-hidden flex">
                        <div
                          className="bg-crimson h-full transition-all duration-500"
                          style={{ width: player.redWidth }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-charcoal-soft">
                        {player.subText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module B: Average Goals / Match */}
              <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-border pb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-charcoal-soft">
                    AVG GOALS / MATCH ({activeGender})
                  </span>
                  <span className="text-[9px] font-mono text-charcoal-soft">
                    [RED] RATIO • [WHITE] CAPS
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {currentStats.avgGoals.map((player) => (
                    <div key={player.rank} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-charcoal-soft font-bold w-4">
                            {player.rank}.
                          </span>
                          <div className="w-5 h-5 bg-border border border-border rounded-full flex items-center justify-center text-[9px] font-bold text-charcoal">
                            {player.name.charAt(0)}
                          </div>
                          <span className="font-bold text-charcoal">
                            {player.name}
                          </span>
                          <span className="text-[10px] text-charcoal-soft">
                            ({player.club})
                          </span>
                        </div>
                        <span className="font-bold text-charcoal">
                          {player.value} GPM
                        </span>
                      </div>
                      <div className="w-full bg-border h-1.5 rounded-sm overflow-hidden flex gap-0.5">
                        <div
                          className="bg-crimson h-full transition-all duration-500"
                          style={{ width: player.redWidth }}
                        />
                        <div
                          className="bg-card h-full transition-all duration-500"
                          style={{ width: player.whiteWidth }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-charcoal-soft">
                        {player.subText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module C: Assist Leaders */}
              <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-charcoal-soft border-b border-border pb-1.5">
                  ASSIST LEADERS {'//'} CREATIVE ENGINE ({activeGender})
                </span>
                <div className="flex flex-col gap-2.5">
                  {currentStats.assists.map((player) => (
                    <div key={player.rank} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-charcoal-soft font-bold w-4">
                            {player.rank}.
                          </span>
                          <div className="w-5 h-5 bg-border border border-border rounded-full flex items-center justify-center text-[9px] font-bold text-charcoal">
                            {player.name.charAt(0)}
                          </div>
                          <span className="font-bold text-charcoal">
                            {player.name}
                          </span>
                          <span className="text-[10px] text-charcoal-soft">
                            ({player.club})
                          </span>
                        </div>
                        <span className="font-bold text-crimson">
                          {player.value} AST
                        </span>
                      </div>
                      <div className="w-full bg-border h-1.5 rounded-sm overflow-hidden flex">
                        <div
                          className="bg-crimson h-full transition-all duration-500"
                          style={{ width: player.redWidth }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-charcoal-soft">
                        {player.subText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module D: Clean Sheets */}
              <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-charcoal-soft border-b border-border pb-1.5">
                  CLEAN SHEETS {'//'} DEFENSIVE SOLIDITY ({activeGender})
                </span>
                <div className="flex flex-col gap-2.5">
                  {currentStats.cleanSheets.map((player) => (
                    <div key={player.rank} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-charcoal-soft font-bold w-4">
                            {player.rank}.
                          </span>
                          <div className="w-5 h-5 bg-border border border-border rounded-full flex items-center justify-center text-[9px] font-bold text-charcoal">
                            {player.name.charAt(0)}
                          </div>
                          <span className="font-bold text-charcoal">
                            {player.name}
                          </span>
                          <span className="text-[10px] text-charcoal-soft">
                            ({player.club})
                          </span>
                        </div>
                        <span className="font-bold text-crimson">
                          {player.value} CS
                        </span>
                      </div>
                      <div className="w-full bg-border h-1.5 rounded-sm overflow-hidden flex">
                        <div
                          className="bg-crimson h-full transition-all duration-500"
                          style={{ width: player.redWidth }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-charcoal-soft">
                        {player.subText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Expansion Modules */}
          <TacticalBlueprint />
          <TicketPortal />
          <TourCampsCalendar />
          <HonorRoll />
          <RosterRevolution />
          <DepthChart />
          <CoachingStaff activeGender={activeGender} />
          <HistoricalRecords activeGender={activeGender} />
          <RegionalGrassroots />
          <FanCommunityHub />
          <PressRoomTranscripts />
        </div>

        {/* 7. THE SIGNATURE 5TH-COLUMN SIDEBAR (Embedded on the Right) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <SidebarStack standings={standings} nslStandings={nslStandings} />
        </div>
      </div>
    </div>
  );
}

export default function NationalTeamsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#171717] flex items-center justify-center font-mono text-neutral-500 text-xs tracking-widest uppercase">
          LOADING NATIONAL DOSSIER...
        </div>
      }
    >
      <NationalTeamsContent />
    </Suspense>
  );
}
