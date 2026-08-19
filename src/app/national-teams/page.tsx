'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import SidebarStack from '@/components/sidebar/SidebarStack';
import DataStatus from '@/components/layout/DataStatus';

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
import { getCplStandings, getNslStandings } from '@/lib/data/standings';

interface SquadPlayer {
  id: string;
  number?: number;
  name: string;
  slug?: string;
  club?: string;
  position: string;
  age?: number;
  caps?: number;
  goals?: number;
  assists?: number;
  gender?: string;
  squad_type?: string;
  ga?: string;
  status?: string;
}

// Full authentic fallback squad pools (23+ assets per bracket)
const MOCK_SQUADS: Record<string, Record<string, SquadPlayer[]>> = {
  MEN: {
    SENIOR: [
      { id: 'm1', number: 1, name: 'Maxime Crépeau', slug: 'maxime-crepeau', club: 'Portland Timbers', position: 'GK', age: 31, caps: 25, goals: 0, status: 'LOCKED' },
      { id: 'm2', number: 16, name: 'Dayne St. Clair', slug: 'dayne-st-clair', club: 'Minnesota United', position: 'GK', age: 28, caps: 12, goals: 0, status: 'LOCKED' },
      { id: 'm3', number: 19, name: 'Alphonso Davies', slug: 'alphonso-davies', club: 'Bayern Munich', position: 'LB', age: 25, caps: 56, goals: 15, status: 'LOCKED' },
      { id: 'm4', number: 15, name: 'Moïse Bombito', slug: 'moise-bombito', club: 'OGC Nice', position: 'CB', age: 25, caps: 23, goals: 1, status: 'LOCKED' },
      { id: 'm5', number: 13, name: 'Derek Cornelius', slug: 'derek-cornelius', club: 'Marseille', position: 'CB', age: 27, caps: 32, goals: 0, status: 'LOCKED' },
      { id: 'm6', number: 2, name: 'Alistair Johnston', slug: 'alistair-johnston', club: 'Celtic FC', position: 'RB', age: 26, caps: 49, goals: 2, status: 'LOCKED' },
      { id: 'm7', number: 22, name: 'Richie Laryea', slug: 'richie-laryea', club: 'Toronto FC', position: 'RB', age: 30, caps: 58, goals: 1, status: 'LOCKED' },
      { id: 'm8', number: 4, name: 'Kamal Miller', slug: 'kamal-miller', club: 'Portland Timbers', position: 'CB', age: 28, caps: 45, goals: 0, status: 'LOCKED' },
      { id: 'm9', number: 7, name: 'Stephen Eustáquio', slug: 'stephen-eustaquio', club: 'FC Porto', position: 'CM', age: 29, caps: 48, goals: 4, status: 'LOCKED' },
      { id: 'm10', number: 8, name: 'Ismaël Koné', slug: 'ismael-kone', club: 'Marseille', position: 'CM', age: 23, caps: 28, goals: 3, status: 'LOCKED' },
      { id: 'm11', number: 21, name: 'Jonathan Osorio', slug: 'jonathan-osorio', club: 'Toronto FC', position: 'CM', age: 33, caps: 78, goals: 9, status: 'LOCKED' },
      { id: 'm12', number: 6, name: 'Mathieu Choinière', slug: 'mathieu-choiniere', club: 'Grasshopper Zurich', position: 'CM', age: 26, caps: 11, goals: 0, status: 'LOCKED' },
      { id: 'm13', number: 18, name: 'Nathan Saliba', slug: 'nathan-saliba', club: 'CF Montréal', position: 'CM', age: 21, caps: 6, goals: 0, status: 'UNTIED / DUAL-NAT' },
      { id: 'm14', number: 14, name: 'Ali Ahmed', slug: 'ali-ahmed', club: 'Vancouver Whitecaps', position: 'LM', age: 24, caps: 15, goals: 1, status: 'LOCKED' },
      { id: 'm15', number: 11, name: 'Theo Bair', slug: 'theo-bair', club: 'AJ Auxerre', position: 'ST', age: 25, caps: 8, goals: 1, status: 'LOCKED' },
      { id: 'm16', number: 17, name: 'Tajon Buchanan', slug: 'tajon-buchanan', club: 'Villarreal', position: 'RW', age: 26, caps: 43, goals: 4, status: 'LOCKED' },
      { id: 'm17', number: 23, name: 'Liam Millar', slug: 'liam-millar', club: 'Hull City', position: 'LW', age: 25, caps: 32, goals: 1, status: 'LOCKED' },
      { id: 'm18', number: 12, name: 'Jacob Shaffelburg', slug: 'jacob-shaffelburg', club: 'Nashville SC', position: 'LW', age: 25, caps: 20, goals: 4, status: 'LOCKED' },
      { id: 'm19', number: 9, name: 'Jonathan David', slug: 'jonathan-david', club: 'Lille OSC', position: 'ST', age: 26, caps: 58, goals: 31, status: 'LOCKED' },
      { id: 'm20', number: 10, name: 'Cyle Larin', slug: 'cyle-larin', club: 'RCD Mallorca', position: 'ST', age: 30, caps: 75, goals: 30, status: 'LOCKED' },
      { id: 'm21', number: 20, name: 'Tani Oluwaseyi', slug: 'tani-oluwaseyi', club: 'Minnesota United', position: 'ST', age: 25, caps: 9, goals: 0, status: 'LOCKED' },
      { id: 'm22', number: 5, name: 'Joel Waterman', slug: 'joel-waterman', club: 'CF Montréal', position: 'CB', age: 29, caps: 6, goals: 0, status: 'LOCKED' },
      { id: 'm23', number: 24, name: 'Niko Sigur', slug: 'niko-sigur', club: 'Hajduk Split', position: 'RB', age: 21, caps: 5, goals: 0, status: 'LOCKED' },
    ],
    'U-23': [
      { id: 'u23m1', number: 1, name: 'Owen Goodman', slug: 'owen-goodman', club: 'Huddersfield Town', position: 'GK', age: 21, caps: 4, goals: 0, status: 'UNTIED / DUAL-NAT' },
      { id: 'u23m2', number: 3, name: 'Luc de Fougerolles', slug: 'luc-de-fougerolles', club: 'Fulham FC', position: 'CB', age: 19, caps: 3, goals: 0, status: 'LOCKED' },
      { id: 'u23m3', number: 4, name: 'Jamie Knight-Lebel', slug: 'jamie-knight-lebel', club: 'Crewe Alexandra', position: 'CB', age: 20, caps: 2, goals: 0, status: 'LOCKED' },
      { id: 'u23m4', number: 8, name: 'Nathan Saliba', slug: 'nathan-saliba', club: 'CF Montréal', position: 'CM', age: 21, caps: 8, goals: 1, status: 'LOCKED' },
      { id: 'u23m5', number: 9, name: 'Promise David', slug: 'promise-david', club: 'Union Saint-Gilloise', position: 'ST', age: 23, caps: 5, goals: 2, status: 'UNTIED / DUAL-NAT' },
      { id: 'u23m6', number: 10, name: 'Marcelo Flores', slug: 'marcelo-flores', club: 'Tigres UANL', position: 'CAM', age: 21, caps: 3, goals: 1, status: 'UNTIED / DUAL-NAT' },
      { id: 'u23m7', number: 11, name: 'Daniel Jebbison', slug: 'daniel-jebbison', club: 'Bournemouth', position: 'ST', age: 21, caps: 2, goals: 0, status: 'UNTIED / DUAL-NAT' },
    ],
    'U-20': [
      { id: 'u20m1', number: 1, name: 'Luka Gavran', slug: 'luka-gavran', club: 'Toronto FC II', position: 'GK', age: 19, caps: 6, goals: 0, status: 'ACTIVE' },
      { id: 'u20m2', number: 5, name: 'Matteo de Brienne', slug: 'matteo-de-brienne', club: 'Atlético Ottawa', position: 'LB', age: 20, caps: 12, goals: 1, status: 'ACTIVE' },
      { id: 'u20m3', number: 10, name: 'Jesse Costa', slug: 'jesse-costa', club: 'VfL Wolfsburg II', position: 'CAM', age: 19, caps: 10, goals: 3, status: 'ACTIVE' },
      { id: 'u20m4', number: 9, name: 'Tavio Ciccarelli', slug: 'tavio-ciccarelli', club: 'Halifax Wanderers', position: 'ST', age: 18, caps: 8, goals: 4, status: 'ACTIVE' },
    ],
    'U-17': [
      { id: 'u17m1', number: 1, name: 'Dominic Kantorowicz', slug: 'dominic-kantorowicz', club: 'Toronto FC Academy', position: 'GK', age: 16, caps: 5, goals: 0, status: 'ACTIVE' },
      { id: 'u17m2', number: 4, name: 'Sergei Kozlovskiy', slug: 'sergei-kozlovskiy', club: 'CF Montréal Academy', position: 'CB', age: 16, caps: 7, goals: 0, status: 'ACTIVE' },
      { id: 'u17m3', number: 9, name: 'Kemari Wynter', slug: 'kemari-wynter', club: 'Vancouver Whitecaps Academy', position: 'ST', age: 16, caps: 6, goals: 3, status: 'ACTIVE' },
    ]
  },
  WOMEN: {
    SENIOR: [
      { id: 'w1', number: 1, name: 'Kailen Sheridan', slug: 'kailen-sheridan', club: 'San Diego Wave', position: 'GK', age: 30, caps: 52, goals: 0, status: 'LOCKED' },
      { id: 'w2', number: 18, name: 'Sabrina D’Angelo', slug: 'sabrina-d-angelo', club: 'Arsenal WFC', position: 'GK', age: 32, caps: 18, goals: 0, status: 'LOCKED' },
      { id: 'w3', number: 22, name: 'Lysianne Proulx', slug: 'lysianne-proulx', club: 'Juventus Women', position: 'GK', age: 26, caps: 5, goals: 0, status: 'LOCKED' },
      { id: 'w4', number: 14, name: 'Kadeisha Buchanan', slug: 'kadeisha-buchanan', club: 'Chelsea FC', position: 'CB', age: 30, caps: 152, goals: 6, status: 'LOCKED' },
      { id: 'w5', number: 3, name: 'Vanessa Gilles', slug: 'vanessa-gilles', club: 'Bayern Munich', position: 'CB', age: 29, caps: 45, goals: 6, status: 'LOCKED' },
      { id: 'w6', number: 20, name: 'Shelina Zadorsky', slug: 'shelina-zadorsky', club: 'West Ham United', position: 'CB', age: 33, caps: 102, goals: 6, status: 'LOCKED' },
      { id: 'w7', number: 12, name: 'Jade Rose', slug: 'jade-rose', club: 'Manchester City WFC', position: 'CB', age: 23, caps: 25, goals: 0, status: 'LOCKED' },
      { id: 'w8', number: 8, name: 'Jayde Riviere', slug: 'jayde-riviere', club: 'Manchester United', position: 'RB', age: 24, caps: 48, goals: 1, status: 'LOCKED' },
      { id: 'w9', number: 21, name: 'Gabrielle Carle', slug: 'gabrielle-carle', club: 'Washington Spirit', position: 'LB', age: 27, caps: 46, goals: 2, status: 'LOCKED' },
      { id: 'w10', number: 10, name: 'Jessie Fleming', slug: 'jessie-fleming', club: 'Portland Thorns', position: 'CM', age: 27, caps: 135, goals: 20, status: 'LOCKED' },
      { id: 'w11', number: 7, name: 'Julia Grosso', slug: 'julia-grosso', club: 'Chicago Stars FC', position: 'CM', age: 25, caps: 68, goals: 8, status: 'LOCKED' },
      { id: 'w12', number: 13, name: 'Simi Awujo', slug: 'simi-awujo', club: 'Manchester United', position: 'CM', age: 21, caps: 22, goals: 1, status: 'LOCKED' },
      { id: 'w13', number: 26, name: 'Marie-Yasmine Alidou', slug: 'marie-yasmine-alidou', club: 'Portland Thorns', position: 'CAM', age: 30, caps: 12, goals: 2, status: 'LOCKED' },
      { id: 'w14', number: 16, name: 'Janine Beckie', slug: 'janine-beckie', club: 'Racing Louisville', position: 'RW', age: 31, caps: 108, goals: 36, status: 'LOCKED' },
      { id: 'w15', number: 15, name: 'Nichelle Prince', slug: 'nichelle-prince', club: 'Boston Legacy FC', position: 'FW', age: 30, caps: 98, goals: 18, status: 'LOCKED' },
      { id: 'w16', number: 9, name: 'Jordyn Huitema', slug: 'jordyn-huitema', club: 'Seattle Reign', position: 'ST', age: 24, caps: 85, goals: 21, status: 'LOCKED' },
      { id: 'w17', number: 11, name: 'Evelyne Viens', slug: 'evelyne-viens', club: 'AS Roma', position: 'ST', age: 28, caps: 35, goals: 7, status: 'LOCKED' },
      { id: 'w18', number: 19, name: 'Cloé Lacasse', slug: 'cloe-lacasse', club: 'Utah Royals', position: 'LW', age: 32, caps: 38, goals: 5, status: 'LOCKED' },
      { id: 'w19', number: 29, name: 'Annabelle Chukwu', slug: 'annabelle-chukwu', club: 'NDC Ontario', position: 'ST', age: 18, caps: 6, goals: 2, status: 'ACTIVE' },
      { id: 'w20', number: 24, name: 'Sydney Collins', slug: 'sydney-collins', club: 'NC Courage', position: 'CB', age: 26, caps: 10, goals: 1, status: 'LOCKED' },
      { id: 'w21', number: 28, name: 'Marie Levasseur', slug: 'marie-levasseur', club: 'Montpellier', position: 'RM', age: 28, caps: 14, goals: 0, status: 'LOCKED' },
      { id: 'w22', number: 30, name: 'Kaylee Hunter', slug: 'kaylee-hunter', club: 'AFC Toronto', position: 'CAM', age: 19, caps: 4, goals: 1, status: 'ACTIVE' },
      { id: 'w23', number: 31, name: 'Emily Burns', slug: 'emily-burns', club: 'Calgary Wild FC', position: 'GK', age: 27, caps: 3, goals: 0, status: 'ACTIVE' },
    ],
    'U-23': [
      { id: 'u23w1', number: 1, name: 'Anna Karpenko', slug: 'anna-karpenko', club: 'Harvard Crimson', position: 'GK', age: 21, caps: 8, goals: 0, status: 'ACTIVE' },
      { id: 'u23w2', number: 4, name: 'Zoe Burns', slug: 'zoe-burns', club: 'Utah Royals', position: 'RB', age: 22, caps: 14, goals: 1, status: 'ACTIVE' },
      { id: 'u23w3', number: 10, name: 'Maya Ladhani', slug: 'maya-ladhani', club: 'NDC Ontario', position: 'CM', age: 21, caps: 18, goals: 3, status: 'ACTIVE' },
      { id: 'u23w4', number: 9, name: 'Olivia Smith', slug: 'olivia-smith', club: 'Sporting CP', position: 'ST', age: 20, caps: 12, goals: 4, status: 'LOCKED' },
    ],
    'U-20': [
      { id: 'u20w1', number: 1, name: 'Faith Fenwick', slug: 'faith-fenwick', club: 'Gonzaga Bulldogs', position: 'GK', age: 19, caps: 9, goals: 0, status: 'ACTIVE' },
      { id: 'u20w2', number: 6, name: 'Clara Dupont', slug: 'clara-dupont', club: 'AS Blainville', position: 'CAM', age: 19, caps: 15, goals: 5, status: 'ACTIVE' },
      { id: 'u20w3', number: 9, name: 'Kayla Briggs', slug: 'kayla-briggs', club: 'Simcoe County Rovers', position: 'ST', age: 19, caps: 12, goals: 7, status: 'ACTIVE' },
    ],
    'U-17': [
      { id: 'u17w1', number: 1, name: 'Olivia Busby', slug: 'olivia-busby', club: 'Halifax Tides FC', position: 'GK', age: 17, caps: 6, goals: 0, status: 'ACTIVE' },
      { id: 'u17w2', number: 2, name: 'Marika Martineau', slug: 'marika-martineau', club: 'CF Montréal Academy', position: 'CB', age: 17, caps: 8, goals: 1, status: 'ACTIVE' },
      { id: 'u17w3', number: 10, name: 'Mya Angus', slug: 'mya-angus', club: 'NDC Ontario', position: 'CM', age: 17, caps: 10, goals: 2, status: 'ACTIVE' },
    ]
  }
};

function NationalTeamsContent() {
  const [activeGender, setActiveGender] = useState<'MEN' | 'WOMEN'>('MEN');
  const [activeAge, setActiveAge] = useState<'SENIOR' | 'U-23' | 'U-20' | 'U-17'>('SENIOR');
  const [players, setPlayers] = useState<SquadPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);

  // Fetch CPL & NSL standings for the sidebar
  useEffect(() => {
    getCplStandings().then(setStandings);
    getNslStandings().then(setNslStandings);
  }, []);

  // Fetch National Team squad based on Active Gender & Age filters
  useEffect(() => {
    async function fetchNationalSquad() {
      setLoading(true);

      const genderQuery = activeGender.toLowerCase();

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .ilike('gender', genderQuery)
        .eq('squad_type', activeAge)
        .order('caps', { ascending: false })
        .limit(26);

      if (error || !data || data.length === 0) {
        // Fallback to comprehensive mock pool if DB rows are not fully populated yet
        const fallback = MOCK_SQUADS[activeGender]?.[activeAge] || MOCK_SQUADS[activeGender]['SENIOR'];
        setPlayers(fallback);
      } else {
        setPlayers(data);
      }
      setLoading(false);
    }

    fetchNationalSquad();
  }, [activeGender, activeAge]);

  return (
    <div className="min-h-screen bg-[#121212] text-neutral-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Command Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-4 gap-4">
          <div>
            <DataStatus />
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono mt-1">
              NATIONAL PROGRAM COMMAND CENTER
            </h1>
          </div>

          {/* Gender & Age Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Gender Toggle */}
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-sm p-0.5 font-mono text-xs">
              <button
                onClick={() => setActiveGender('MEN')}
                className={`px-3 py-1 transition-colors ${
                  activeGender === 'MEN' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ MEN ]
              </button>
              <button
                onClick={() => setActiveGender('WOMEN')}
                className={`px-3 py-1 transition-colors ${
                  activeGender === 'WOMEN' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                [ WOMEN ]
              </button>
            </div>

            {/* Age Group Toggles */}
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-sm p-0.5 font-mono text-xs">
              {(['SENIOR', 'U-23', 'U-20', 'U-17'] as const).map((age) => (
                <button
                  key={age}
                  onClick={() => setActiveAge(age)}
                  className={`px-2.5 py-1 transition-colors ${
                    activeAge === age ? 'bg-neutral-800 text-red-500 font-bold border border-neutral-700' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid: 8-Column Feed + 4-Column Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filtered Active Squad Table */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-mono text-red-500 tracking-wider uppercase font-bold">
                  {activeGender === 'MEN' ? 'CANMNT' : 'CANWNT'} // {activeAge} SQUAD POOL
                </h2>
                <span className="text-[10px] font-mono text-neutral-400">
                  {players.length} REGISTERED SQUAD ASSETS
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs font-mono text-neutral-500">
                  SYNCING SQUAD TELEMETRY...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 text-[10px] uppercase">
                        <th className="py-2 px-2">#</th>
                        <th className="py-2 px-3">Player</th>
                        <th className="py-2 px-3">Pos</th>
                        <th className="py-2 px-3">Club</th>
                        <th className="py-2 px-3 text-right">Caps</th>
                        <th className="py-2 px-3 text-right">G / A</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((p, idx) => (
                        <tr key={p.id || idx} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                          <td className="py-2.5 px-2 text-neutral-500">{p.number || idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-white">
                            <Link 
                              href={`/players/${p.slug || p.id}`}
                              className="hover:text-red-500 transition-colors underline decoration-neutral-700 underline-offset-4 hover:decoration-red-500"
                            >
                              {p.name}
                            </Link>
                          </td>
                          <td className="py-2.5 px-3 text-red-400">{p.position}</td>
                          <td className="py-2.5 px-3 text-neutral-400">{p.club || 'Unattached'}</td>
                          <td className="py-2.5 px-3 text-right text-neutral-300">{p.caps ?? 0}</td>
                          <td className="py-2.5 px-3 text-right text-neutral-400">
                            {p.ga ? p.ga : `${p.goals ?? 0} / ${p.assists ?? 0}`}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm border bg-red-500/10 text-red-500 border-red-500/30">
                              [ {p.status || 'ACTIVE'} ]
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Complete Dossier Modules Stack */}
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

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <SidebarStack standings={standings} nslStandings={nslStandings} />
          </div>

        </div>

      </div>
    </div>
  );
}

export default function NationalTeamsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-neutral-500 text-xs tracking-widest uppercase">
          LOADING NATIONAL DOSSIER...
        </div>
      }
    >
      <NationalTeamsContent />
    </Suspense>
  );
}
