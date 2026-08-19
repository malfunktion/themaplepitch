'use client';

import React, { useState } from 'react';

interface TeamRow {
  pos: number;
  club: string;
  pts: number;
  gd: string;
}

interface InjuredPlayer {
  name: string;
  club: string;
  return: string;
}

interface ProvincialFixture {
  homeTeam: string;
  homeCity: string;
  awayTeam: string;
  awayCity: string;
  time: string;
  streamUrl: string;
}

const pyramidData = {
  men: {
    ON: {
      tiers: ['Premier', 'Championship', 'League2'],
      data: {
        Premier: [
          { pos: 1, club: 'Vaughan Azzurri', pts: 42, gd: '+21' },
          { pos: 2, club: 'Scrosoppi FC', pts: 39, gd: '+18' },
          { pos: 3, club: 'Simcoe County Rovers', pts: 38, gd: '+15' },
          { pos: 4, club: 'Woodbridge Strikers', pts: 35, gd: '+10' },
          { pos: 5, club: 'North Toronto Nitros', pts: 33, gd: '+8' },
          { pos: 6, club: 'Alliance United', pts: 30, gd: '+5' },
          { pos: 7, club: 'Sigma FC', pts: 28, gd: '+3' },
          { pos: 8, club: 'ProStars FC', pts: 26, gd: '0' },
          { pos: 9, club: 'Guelph United', pts: 22, gd: '-4' },
          { pos: 10, club: 'Blue Devils FC', pts: 18, gd: '-9' },
          { pos: 11, club: 'Hamilton United', pts: 15, gd: '-14' },
          { pos: 12, club: 'BVB IA Waterloo', pts: 10, gd: '-20' },
        ],
        Championship: [
          { pos: 1, club: 'TFC Academy', pts: 31, gd: '+28' },
          { pos: 2, club: 'FC London', pts: 28, gd: '+21' },
          { pos: 3, club: 'Unionville Milliken', pts: 24, gd: '+9' },
          { pos: 4, club: 'Master\'s FA', pts: 21, gd: '+9' },
          { pos: 5, club: 'North Mississauga', pts: 18, gd: '+5' },
          { pos: 6, club: 'Darby FC', pts: 16, gd: '+2' },
          { pos: 7, club: 'Pickering FC', pts: 13, gd: '+7' },
          { pos: 8, club: 'Rush Canada', pts: 9, gd: '-21' },
          { pos: 9, club: 'Windsor City FC', pts: 5, gd: '-33' },
          { pos: 10, club: 'Sudbury Cyclones', pts: 4, gd: '-27' },
        ],
        League2: [
          { pos: 1, club: 'Vaughan Azzurri B', pts: 39, gd: '+28' },
          { pos: 2, club: 'Scrosoppi FC B', pts: 34, gd: '+37' },
          { pos: 3, club: 'Simcoe Rovers B', pts: 28, gd: '+24' },
          { pos: 4, club: 'Rush Academy', pts: 24, gd: '+14' },
          { pos: 5, club: 'Darby FC B', pts: 20, gd: '+8' },
          { pos: 6, club: 'Guelph United B', pts: 16, gd: '+5' },
          { pos: 7, club: 'Master\'s FA B', pts: 14, gd: '0' },
          { pos: 8, club: 'Blue Devils FC B', pts: 11, gd: '-5' },
          { pos: 9, club: 'BVB IA Waterloo B', pts: 8, gd: '-12' },
          { pos: 10, club: 'FC London B', pts: 4, gd: '-20' },
        ],
      },
      medical: [
        { name: 'M. STEFANIK', club: 'VAUGHAN AZZURRI', return: 'RTN: NEXT WEEK' },
        { name: 'J. BROWNE', club: 'SCROSOPPI FC', return: 'RTN: OCT 20' },
      ],
      fixture: {
        homeTeam: 'Vaughan Azzurri',
        homeCity: 'Vaughan, ON',
        awayTeam: 'Scrosoppi FC',
        awayCity: 'Milton, ON',
        time: 'SAT, 7:00 PM EST',
        streamUrl: 'https://onesoccer.ca',
      },
    },
    QC: {
      tiers: ['Ligue 1', 'Ligue 2', 'Ligue 3'],
      data: {
        'Ligue 1': [
          { pos: 1, club: 'FC Laval', pts: 40, gd: '+18' },
          { pos: 2, club: 'CS Saint-Laurent', pts: 38, gd: '+15' },
          { pos: 3, club: 'AS Blainville', pts: 36, gd: '+12' },
          { pos: 4, club: 'CS St-Hubert', pts: 33, gd: '+10' },
          { pos: 5, club: 'CS Longueuil', pts: 30, gd: '+5' },
          { pos: 6, club: 'CS MRO', pts: 27, gd: '+2' },
          { pos: 7, club: 'Ottawa South United', pts: 24, gd: '-1' },
          { pos: 8, club: 'AS Laval', pts: 21, gd: '-5' },
          { pos: 9, club: 'Celtix du Haut-Richelieu', pts: 18, gd: '-8' },
          { pos: 10, club: 'Royal-Sélect', pts: 12, gd: '-14' },
        ],
        'Ligue 2': [
          { pos: 1, club: 'CS Repentigny', pts: 35, gd: '+16' },
          { pos: 2, club: 'CS Beauport', pts: 32, gd: '+14' },
          { pos: 3, club: 'AS Pierrefonds', pts: 29, gd: '+8' },
          { pos: 4, club: 'CS Trois-Rivières', pts: 25, gd: '+5' },
          { pos: 5, club: 'AS Brossard', pts: 22, gd: '+2' },
          { pos: 6, club: 'CS Victoriaville', pts: 19, gd: '-1' },
          { pos: 7, club: 'CS Aylmer', pts: 15, gd: '-5' },
          { pos: 8, club: 'Mistral Sherbrooke', pts: 12, gd: '-8' },
          { pos: 9, club: 'CS Ste-Julie', pts: 9, gd: '-15' },
          { pos: 10, club: 'CS Lanaudière-Nord', pts: 4, gd: '-20' },
        ],
        'Ligue 3': [
          { pos: 1, club: 'FC Laval Reserve', pts: 38, gd: '+22' },
          { pos: 2, club: 'CS Saint-Laurent Res', pts: 34, gd: '+18' },
          { pos: 3, club: 'AS Blainville Res', pts: 30, gd: '+12' },
          { pos: 4, club: 'CS Longueuil Res', pts: 26, gd: '+6' },
          { pos: 5, club: 'AS Laval Reserve', pts: 22, gd: '+1' },
          { pos: 6, club: 'CS MRO Reserve', pts: 19, gd: '-3' },
          { pos: 7, club: 'CS St-Hubert Res', pts: 15, gd: '-8' },
          { pos: 8, club: 'Celtix Reserve', pts: 11, gd: '-12' },
          { pos: 9, club: 'OSU Reserve', pts: 8, gd: '-15' },
          { pos: 10, club: 'Royal-Sélect Res', pts: 5, gd: '-21' },
        ],
      },
      medical: [
        { name: 'A. GAUTHIER', club: 'FC LAVAL', return: 'RTN: DAY-TO-DAY' },
      ],
      fixture: {
        homeTeam: 'FC Laval',
        homeCity: 'Laval, QC',
        awayTeam: 'CS Saint-Laurent',
        awayCity: 'Montreal, QC',
        time: 'SUN, 4:00 PM EST',
        streamUrl: 'https://onesoccer.ca',
      },
    },
    BC: {
      tiers: ['Premier'],
      data: {
        Premier: [
          { pos: 1, club: 'Langley United', pts: 33, gd: '+17' },
          { pos: 2, club: 'TSS FC Rovers', pts: 32, gd: '+21' },
          { pos: 3, club: 'Altitude FC', pts: 27, gd: '+13' },
          { pos: 4, club: 'Burnaby FC', pts: 26, gd: '0' },
          { pos: 5, club: 'Kamloops United FC', pts: 23, gd: '0' },
          { pos: 6, club: 'Evolution FC', pts: 18, gd: '-4' },
          { pos: 7, club: 'Unity FC', pts: 16, gd: '-12' },
          { pos: 8, club: 'Whitecaps FC Academy', pts: 14, gd: '-15' },
          { pos: 9, club: 'Nanaimo United FC', pts: 9, gd: '-20' },
        ],
      },
      medical: [
        { name: 'C. MCNEIL', club: 'TSS ROVERS', return: 'RTN: NOV 2026' },
      ],
      fixture: {
        homeTeam: 'Langley United',
        homeCity: 'Langley, BC',
        awayTeam: 'TSS FC Rovers',
        awayCity: 'Burnaby, BC',
        time: 'FRI, 8:00 PM PST',
        streamUrl: 'https://onesoccer.ca',
      },
    },
    AB: {
      tiers: ['Premier'],
      data: {
        Premier: [
          { pos: 1, club: 'Calgary Blizzard SC', pts: 36, gd: '+20' },
          { pos: 2, club: 'Calgary Foothills FC', pts: 33, gd: '+15' },
          { pos: 3, club: 'Cavalry FC II', pts: 29, gd: '+12' },
          { pos: 4, club: 'Edmonton BTB SC', pts: 25, gd: '+8' },
          { pos: 5, club: 'Callies United', pts: 21, gd: '+3' },
          { pos: 6, club: 'St. Albert Impact', pts: 16, gd: '-5' },
          { pos: 7, club: 'Calgary Villains FC', pts: 11, gd: '-18' },
          { pos: 8, club: 'Calgary Rangers SC', pts: 6, gd: '-28' },
        ],
      },
      medical: [
        { name: 'T. VANCRETVEL', club: 'CALGARY FOOTHILLS', return: 'RTN: TBD' },
      ],
      fixture: {
        homeTeam: 'Calgary Blizzard SC',
        homeCity: 'Calgary, AB',
        awayTeam: 'Calgary Foothills FC',
        awayCity: 'Calgary, AB',
        time: 'SAT, 2:00 PM MST',
        streamUrl: 'https://onesoccer.ca',
      },
    },
  },
  women: {
    ON: {
      tiers: ['Premier', 'Championship', 'League2'],
      data: {
        Premier: [
          { pos: 1, club: 'NDC Ontario', pts: 48, gd: '+41' },
          { pos: 2, club: 'Simcoe County Rovers', pts: 45, gd: '+38' },
          { pos: 3, club: 'Vaughan Azzurri', pts: 38, gd: '+22' },
          { pos: 4, club: 'North Toronto Nitros', pts: 35, gd: '+16' },
          { pos: 5, club: 'FC London', pts: 31, gd: '+10' },
          { pos: 6, club: 'Alliance United', pts: 26, gd: '-1' },
          { pos: 7, club: 'Woodbridge Strikers', pts: 21, gd: '-5' },
          { pos: 8, club: 'Guelph United', pts: 18, gd: '-12' },
          { pos: 9, club: 'Blue Devils FC', pts: 14, gd: '-20' },
          { pos: 10, club: 'BVB IA Waterloo', pts: 6, gd: '-35' },
        ],
        Championship: [
          { pos: 1, club: 'Hamilton United', pts: 36, gd: '+28' },
          { pos: 2, club: 'ProStars FC', pts: 32, gd: '+21' },
          { pos: 3, club: 'Darby FC', pts: 28, gd: '+15' },
          { pos: 4, club: 'Rush Canada', pts: 24, gd: '+9' },
          { pos: 5, club: 'Pickering FC', pts: 20, gd: '+5' },
          { pos: 6, club: 'North Mississauga', pts: 18, gd: '0' },
          { pos: 7, club: 'Scrosoppi FC', pts: 15, gd: '-6' },
          { pos: 8, club: 'Unionville Milliken', pts: 11, gd: '-14' },
          { pos: 9, club: 'Master\'s FA', pts: 7, gd: '-22' },
          { pos: 10, club: 'Sudbury Cyclones', pts: 4, gd: '-32' },
        ],
        League2: [
          { pos: 1, club: 'Simcoe Rovers B', pts: 39, gd: '+28' },
          { pos: 2, club: 'Pickering B', pts: 34, gd: '+37' },
          { pos: 3, club: 'NDC Ontario B', pts: 30, gd: '+21' },
          { pos: 4, club: 'Vaughan Azzurri B', pts: 25, gd: '+15' },
          { pos: 5, club: 'FC London B', pts: 21, gd: '+8' },
          { pos: 6, club: 'Alliance United B', pts: 17, gd: '+1' },
          { pos: 7, club: 'Guelph United B', pts: 14, gd: '-5' },
          { pos: 8, club: 'Rush Canada B', pts: 10, gd: '-12' },
          { pos: 9, club: 'Darby FC B', pts: 6, gd: '-18' },
          { pos: 10, club: 'North Toronto B', pts: 3, gd: '-25' },
        ],
      },
      medical: [
        { name: 'E. DUBOIS', club: 'SIMCOE ROVERS', return: 'RTN: DAY-TO-DAY' },
      ],
      fixture: {
        homeTeam: 'Simcoe County',
        homeCity: 'Barrie, ON',
        awayTeam: 'NDC Ontario',
        awayCity: 'Vaughan, ON',
        time: 'SUN, 2:00 PM EST',
        streamUrl: 'https://onesoccer.ca',
      },
    },
    QC: {
      tiers: ['Ligue 1', 'Ligue 2', 'Ligue 3'],
      data: {
        'Ligue 1': [
          { pos: 1, club: 'CS Saint-Laurent W', pts: 36, gd: '+15' },
          { pos: 2, club: 'FC Laval W', pts: 34, gd: '+14' },
          { pos: 3, club: 'AS Blainville W', pts: 31, gd: '+10' },
          { pos: 4, club: 'CS Longueuil W', pts: 28, gd: '+7' },
          { pos: 5, club: 'Royal-Sélect W', pts: 25, gd: '+3' },
          { pos: 6, club: 'AS Laval W', pts: 21, gd: '0' },
          { pos: 7, club: 'Celtix du Haut-Richelieu W', pts: 18, gd: '-5' },
          { pos: 8, club: 'CS MRO W', pts: 14, gd: '-10' },
          { pos: 9, club: 'Ottawa South United W', pts: 9, gd: '-15' },
          { pos: 10, club: 'AS Pierrefonds W', pts: 5, gd: '-22' },
        ],
        'Ligue 2': [
          { pos: 1, club: 'CS St-Hubert W', pts: 35, gd: '+18' },
          { pos: 2, club: 'Dynamo de Québec W', pts: 31, gd: '+12' },
          { pos: 3, club: 'CS Beauport W', pts: 28, gd: '+9' },
          { pos: 4, club: 'CS Repentigny W', pts: 24, gd: '+5' },
          { pos: 5, club: 'CS Trois-Rivières W', pts: 20, gd: '0' },
          { pos: 6, club: 'AS Brossard W', pts: 17, gd: '-4' },
          { pos: 7, club: 'CS Victoriaville W', pts: 14, gd: '-8' },
          { pos: 8, club: 'CS Ste-Julie W', pts: 10, gd: '-12' },
          { pos: 9, club: 'Mistral Sherbrooke W', pts: 7, gd: '-18' },
          { pos: 10, club: 'CS Lanaudière-Nord W', pts: 3, gd: '-25' },
        ],
        'Ligue 3': [
          { pos: 1, club: 'FC Laval Reserve W', pts: 37, gd: '+21' },
          { pos: 2, club: 'Saint-Laurent Res W', pts: 33, gd: '+15' },
          { pos: 3, club: 'AS Blainville Res W', pts: 29, gd: '+11' },
          { pos: 4, club: 'CS Longueuil Res W', pts: 25, gd: '+6' },
          { pos: 5, club: 'AS Laval Reserve W', pts: 20, gd: '+2' },
          { pos: 6, club: 'Royal-Sélect Res W', pts: 18, gd: '-3' },
          { pos: 7, club: 'CS St-Hubert Res W', pts: 15, gd: '-8' },
          { pos: 8, club: 'Celtix Reserve W', pts: 10, gd: '-14' },
          { pos: 9, club: 'OSU Reserve W', pts: 7, gd: '-20' },
          { pos: 10, club: 'CS MRO Reserve W', pts: 2, gd: '-28' },
        ],
      },
      medical: [
        { name: 'S. ROY', club: 'CS SAINT-LAURENT', return: 'RTN: OCT 25' },
      ],
      fixture: {
        homeTeam: 'Saint-Laurent W',
        homeCity: 'Montreal, QC',
        awayTeam: 'FC Laval W',
        awayCity: 'Laval, QC',
        time: 'SAT, 5:00 PM EST',
        streamUrl: 'https://onesoccer.ca',
      },
    },
    BC: {
      tiers: ['Premier'],
      data: {
        Premier: [
          { pos: 1, club: 'Altitude FC W', pts: 43, gd: '+38' },
          { pos: 2, club: 'Vancouver Rise FC Academy', pts: 37, gd: '+33' },
          { pos: 3, club: 'Unity FC W', pts: 31, gd: '+17' },
          { pos: 4, club: 'TSS Rovers FC W', pts: 25, gd: '+7' },
          { pos: 5, club: 'Langley United W', pts: 18, gd: '-10' },
          { pos: 6, club: 'Evolution FC W', pts: 17, gd: '-19' },
          { pos: 7, club: 'Nanaimo United FC W', pts: 15, gd: '-18' },
          { pos: 8, club: 'Burnaby FC W', pts: 12, gd: '-13' },
          { pos: 9, club: 'Kamloops United FC W', pts: 6, gd: '-35' },
        ],
      },
      medical: [
        { name: 'M. WONG', club: 'ALTITUDE FC', return: 'RTN: TBD' },
      ],
      fixture: {
        homeTeam: 'Altitude FC W',
        homeCity: 'North Vancouver, BC',
        awayTeam: 'Vancouver Rise Acad.',
        awayCity: 'Vancouver, BC',
        time: 'SUN, 1:00 PM PST',
        streamUrl: 'https://onesoccer.ca',
      },
    },
    AB: {
      tiers: ['Premier'],
      data: {
        Premier: [
          { pos: 1, club: 'Calgary Blizzard SC', pts: 38, gd: '+22' },
          { pos: 2, club: 'Calgary Foothills FC', pts: 34, gd: '+16' },
          { pos: 3, club: 'Calgary Wild FC U23', pts: 30, gd: '+12' },
          { pos: 4, club: 'Edmonton BTB SC', pts: 26, gd: '+8' },
          { pos: 5, club: 'Callies United', pts: 22, gd: '+4' },
          { pos: 6, club: 'St. Albert Impact', pts: 17, gd: '-6' },
          { pos: 7, club: 'Calgary Villains FC', pts: 11, gd: '-15' },
          { pos: 8, club: 'Calgary Rangers SC', pts: 5, gd: '-28' },
        ],
      },
      medical: [
        { name: 'H. OLIVER', club: 'CALGARY FOOTHILLS', return: 'RTN: NOV 1' },
      ],
      fixture: {
        homeTeam: 'Calgary Blizzard SC',
        homeCity: 'Calgary, AB',
        awayTeam: 'Calgary Foothills FC',
        awayCity: 'Calgary, AB',
        time: 'SAT, 4:00 PM MST',
        streamUrl: 'https://onesoccer.ca',
      },
    },
  },
};

export default function ProvincialPyramidTracker() {
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [province, setProvince] = useState<'ON' | 'QC' | 'BC' | 'AB'>('ON');
  
  const currentProvData = pyramidData[gender][province];
  const [tier, setTier] = useState<string>(currentProvData.tiers[0]);

  const handleGenderChange = (g: 'men' | 'women') => {
    setGender(g);
    const newProvData = pyramidData[g][province];
    setTier(newProvData.tiers[0]);
  };

  const handleProvinceChange = (p: 'ON' | 'QC' | 'BC' | 'AB') => {
    setProvince(p);
    const newProvData = pyramidData[gender][p];
    setTier(newProvData.tiers[0]);
  };

  const dataRecord = currentProvData.data as Record<string, TeamRow[]>;
  const activeTable: TeamRow[] = dataRecord[tier] || dataRecord[currentProvData.tiers[0]] || [];
  const provincialInjuries = currentProvData.medical || [];
  const provincialFixture = currentProvData.fixture;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. MAIN PYRAMID SECTION */}
      <section className="bg-card border border-border p-4 flex flex-col gap-4 text-charcoal dark:text-white shadow-sm">
        {/* HEADER & STACKED GENDER TOGGLE */}
        <div className="flex flex-col gap-3 border-b border-border pb-3">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xs font-mono tracking-widest text-charcoal dark:text-white uppercase font-bold">
                PROVINCIAL PYRAMID
              </h2>
              <span className="text-[10px] text-charcoal-soft font-mono">
                LEAGUE1 CANADA SYSTEM
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-1 bg-neutral-200 dark:bg-card p-1 border border-border">
            <button
              onClick={() => handleGenderChange('men')}
              className={`py-1 text-center font-mono text-xs transition-colors ${
                gender === 'men'
                  ? 'bg-crimson text-white font-bold shadow-sm'
                  : 'text-neutral-600 dark:text-charcoal-soft hover:text-charcoal dark:hover:text-white'
              }`}
            >
              MEN
            </button>
            <button
              onClick={() => handleGenderChange('women')}
              className={`py-1 text-center font-mono text-xs transition-colors ${
                gender === 'women'
                  ? 'bg-crimson text-white font-bold shadow-sm'
                  : 'text-neutral-600 dark:text-charcoal-soft hover:text-charcoal dark:hover:text-white'
              }`}
            >
              WOMEN
            </button>
          </div>
        </div>

        {/* PROVINCE SELECTOR */}
        <div className="grid grid-cols-4 gap-1 bg-neutral-200 dark:bg-card p-1 border border-border font-mono text-xs">
          {(['ON', 'QC', 'BC', 'AB'] as const).map((prov) => (
            <button
              key={prov}
              onClick={() => handleProvinceChange(prov)}
              className={`py-1 text-center transition-colors ${
                province === prov
                  ? 'bg-white dark:bg-neutral-800 text-charcoal dark:text-white font-bold border border-border dark:border-neutral-700 shadow-sm'
                  : 'text-neutral-600 dark:text-charcoal-soft hover:text-charcoal dark:hover:text-white'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>

        {/* TIER TABS */}
        {currentProvData.tiers.length > 1 && (
          <div className="flex gap-4 border-b border-border pb-2 overflow-x-auto hide-scrollbar shrink-0">
            {currentProvData.tiers.map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`font-mono text-[10px] uppercase tracking-wider whitespace-nowrap px-1 py-1 transition-colors ${
                  tier === t
                    ? 'text-crimson dark:text-crimson font-bold border-b-2 border-crimson'
                    : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border text-charcoal-soft text-[10px]">
                <th className="py-1.5 w-6">#</th>
                <th className="py-1.5">CLUB</th>
                <th className="py-1.5 text-right">PTS</th>
                <th className="py-1.5 text-right">GD</th>
              </tr>
            </thead>
            <tbody>
              {activeTable.length > 0 ? (
                activeTable.map((row) => (
                  <tr key={row.club} className="border-b border-border dark:border-border/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className={`py-1.5 font-bold ${row.pos === 1 ? 'text-crimson' : 'text-charcoal-soft'}`}>
                      {row.pos}
                    </td>
                    <td className="py-1.5 font-medium text-charcoal dark:text-white truncate max-w-[130px]">{row.club}</td>
                    <td className="py-1.5 text-right font-bold text-charcoal dark:text-white">{row.pts}</td>
                    <td className="py-1.5 text-right text-charcoal-soft">{row.gd}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-2 text-center text-charcoal-soft text-[10px]">
                    Data syncing...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER STATUS */}
        <div className="flex justify-between items-center text-[9px] font-mono text-charcoal-soft pt-1 border-t border-border">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            L1 {province} {tier.toUpperCase()} ACTIVE
          </span>
          <span>UPDATED HOURLY</span>
        </div>
      </section>

      {/* 2. PROVINCIAL MEDICAL WARD */}
      <section className="bg-card border border-border p-4 flex flex-col gap-3 text-charcoal dark:text-white font-mono shadow-sm">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <h2 className="text-xs tracking-widest text-charcoal dark:text-white uppercase font-bold">
            MEDICAL WARD <span className="text-[10px] text-charcoal-soft font-normal ml-2">L1 {province} SIDELINED</span>
          </h2>
          <span className="text-xs font-bold text-crimson">+</span>
        </div>
        <div className="flex flex-col gap-2">
          {provincialInjuries.length > 0 ? (
            provincialInjuries.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-border dark:border-border/50 pb-2">
                <div>
                  <span className="text-charcoal dark:text-white font-bold block">{p.name}</span>
                  <span className="text-charcoal-soft text-[10px]">[{p.club}]</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-crimson font-bold">+</span>
                  <span className="text-[10px] text-neutral-600 dark:text-charcoal-soft">{p.return}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-charcoal-soft">No active regional injuries reported.</p>
          )}
        </div>
      </section>

      {/* 3. PROVINCIAL MATCHDAY FIXTURE */}
      <section className="bg-card border border-border p-4 flex flex-col gap-3 text-charcoal dark:text-white font-mono shadow-sm">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-charcoal-soft shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xs tracking-widest text-charcoal dark:text-white uppercase font-bold">
              NEXT FIXTURE // MATCHDAY
            </h2>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse"></span>
        </div>
        {provincialFixture ? (
          <div className="bg-surface border border-border p-3.5 flex flex-col gap-3">
            <div className="flex justify-between items-center text-[10px] text-charcoal-soft border-b border-border dark:border-border/60 pb-1.5">
              <span className="font-bold text-charcoal dark:text-neutral-300">L1 {province} SHOWCASE</span>
              <span className="text-crimson dark:text-crimson font-bold">{provincialFixture.time}</span>
            </div>
            <div className="flex items-center justify-between bg-neutral-100 dark:bg-card/60 p-2 border border-border dark:border-border/80">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-charcoal dark:text-white truncate">{provincialFixture.homeTeam}</div>
                <div className="text-[9px] text-charcoal-soft truncate">{provincialFixture.homeCity}</div>
              </div>
              <div className="px-2 text-[10px] font-bold text-charcoal-soft shrink-0">VS</div>
              <div className="flex-1 min-w-0 text-right">
                <div className="text-xs font-bold text-charcoal dark:text-white truncate">{provincialFixture.awayTeam}</div>
                <div className="text-[9px] text-charcoal-soft truncate">{provincialFixture.awayCity}</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-1 text-[10px] border-t border-border dark:border-border/60">
              <span className="text-charcoal-soft">TICKETS AT GATE</span>
              <a href={provincialFixture.streamUrl} target="_blank" rel="noopener noreferrer" className="text-crimson hover:text-crimson-dim font-bold whitespace-nowrap transition-colors">
                [ STREAM LIVE ]
              </a>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-charcoal-soft">No upcoming provincial fixtures.</p>
        )}
      </section>
    </div>
  );
          }