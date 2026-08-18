// src/components/home/ProLeaguesTracker.tsx
'use client';

import Link from 'next/link';

function slugify(name: string) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProLeaguesTracker({ league = 'CPL' }: { league?: 'CPL' | 'NSL' }) {
  // --- FULL LEAGUE STANDINGS DATA ---
  const cplStandings = [
    { rank: 1, name: "Forge FC", played: 14, points: 28, form: ['W', 'W', 'D', 'L', 'W'] },
    { rank: 2, name: "Atlético Ottawa", played: 14, points: 26, form: ['W', 'D', 'W', 'D', 'W'] },
    { rank: 3, name: "Cavalry FC", played: 14, points: 24, form: ['D', 'W', 'W', 'L', 'D'] },
    { rank: 4, name: "York United", played: 14, points: 23, form: ['W', 'W', 'L', 'W', 'D'] },
    { rank: 5, name: "Pacific FC", played: 14, points: 19, form: ['L', 'L', 'D', 'W', 'L'] },
    { rank: 6, name: "Halifax Wanderers", played: 14, points: 16, form: ['W', 'D', 'L', 'L', 'W'] },
    { rank: 7, name: "Vancouver FC", played: 14, points: 15, form: ['L', 'L', 'W', 'L', 'D'] },
    { rank: 8, name: "Valour FC", played: 14, points: 10, form: ['L', 'D', 'L', 'L', 'L'] }
  ];
  
  const nslStandings = [
    { rank: 1, name: "Vancouver Rise", played: 10, points: 24, form: ['W', 'W', 'W', 'D', 'W'] },
    { rank: 2, name: "Montreal Roses", played: 10, points: 21, form: ['W', 'D', 'W', 'W', 'L'] },
    { rank: 3, name: "AFC Toronto", played: 10, points: 18, form: ['D', 'W', 'L', 'W', 'D'] },
    { rank: 4, name: "Calgary Wild", played: 10, points: 15, form: ['L', 'W', 'D', 'D', 'W'] },
    { rank: 5, name: "Halifax Tides", played: 10, points: 11, form: ['W', 'L', 'L', 'D', 'L'] },
    { rank: 6, name: "Ottawa Rapid", played: 10, points: 8, form: ['L', 'L', 'D', 'L', 'W'] }
  ];

  // --- STATS DATA ---
  const cplGoldenBoot = [
    { rank: 1, name: "Brian Wright", club: "York United", goals: 9, width: "100%" },
    { rank: 2, name: "Alejandro Díaz", club: "Vancouver FC", goals: 7, width: "77%" },
    { rank: 3, name: "Ollie Bassett", club: "Atlético Ottawa", goals: 6, width: "66%" },
    { rank: 4, name: "Terran Campbell", club: "Forge FC", goals: 6, width: "66%" },
    { rank: 5, name: "David Choinière", club: "Forge FC", goals: 5, width: "55%" },
  ];
  
  const nslGoldenBoot = [
    { rank: 1, name: "Evelyne Viens", club: "Montreal Roses", goals: 8, width: "100%" },
    { rank: 2, name: "Cyle Larin", club: "AFC Toronto", goals: 6, width: "75%" },
    { rank: 3, name: "Olivia Smith", club: "Vancouver Rise", goals: 5, width: "62%" },
    { rank: 4, name: "Jordyn Huitema", club: "Vancouver Rise", goals: 4, width: "50%" },
    { rank: 5, name: "Neve Collins", club: "Calgary Wild", goals: 3, width: "37%" },
  ];

  const cplAvgGoals = [
    { rank: 1, name: "Brian Wright", club: "York United", stat: "0.8", redWidth: "80%", whiteWidth: "20%" },
    { rank: 2, name: "Alejandro Díaz", club: "Vancouver FC", stat: "0.6", redWidth: "60%", whiteWidth: "40%" },
    { rank: 3, name: "Terran Campbell", club: "Forge FC", stat: "0.5", redWidth: "50%", whiteWidth: "50%" },
    { rank: 4, name: "Ollie Bassett", club: "Atlético Ottawa", stat: "0.4", redWidth: "40%", whiteWidth: "60%" },
    { rank: 5, name: "Malcolm Shaw", club: "Cavalry FC", stat: "0.4", redWidth: "40%", whiteWidth: "60%" },
  ];
  
  const nslAvgGoals = [
    { rank: 1, name: "Evelyne Viens", club: "Montreal Roses", stat: "1.1", redWidth: "100%", whiteWidth: "0%" },
    { rank: 2, name: "Olivia Smith", club: "Vancouver Rise", stat: "0.9", redWidth: "81%", whiteWidth: "19%" },
    { rank: 3, name: "Cyle Larin", club: "AFC Toronto", stat: "0.7", redWidth: "63%", whiteWidth: "37%" },
    { rank: 4, name: "Jordyn Huitema", club: "Vancouver Rise", stat: "0.6", redWidth: "54%", whiteWidth: "46%" },
    { rank: 5, name: "Neve Collins", club: "Calgary Wild", stat: "0.5", redWidth: "45%", whiteWidth: "55%" },
  ];

  const cplAssists = [
    { rank: 1, name: "Manny Aparicio", club: "Atlético Ottawa", stat: 5, width: "100%" },
    { rank: 2, name: "Tristan Borges", club: "Forge FC", stat: 4, width: "80%" },
    { rank: 3, name: "Oussama Ercan", club: "York United", stat: 3, width: "60%" },
    { rank: 4, name: "Sean Daniels", club: "Halifax Wanderers", stat: 3, width: "60%" },
    { rank: 5, name: "Alessandro Hojabrpour", club: "Forge FC", stat: 2, width: "40%" },
  ];
  
  const nslAssists = [
    { rank: 1, name: "Jessie Fleming", club: "AFC Toronto", stat: 6, width: "100%" },
    { rank: 2, name: "Adriana Leon", club: "Montreal Roses", stat: 4, width: "66%" },
    { rank: 3, name: "Quinn", club: "Vancouver Rise", stat: 3, width: "50%" },
    { rank: 4, name: "Deanne Rose", club: "Calgary Wild", stat: 3, width: "50%" },
    { rank: 5, name: "Shelina Zadorsky", club: "Halifax Tides", stat: 2, width: "33%" },
  ];

  const cplCleanSheets = [
    { rank: 1, name: "Nathan Ingham", club: "Atlético Ottawa", stat: 6, width: "100%" },
    { rank: 2, name: "Marco Carducci", club: "Cavalry FC", stat: 5, width: "83%" },
    { rank: 3, name: "Thomas Vincensini", club: "York United", stat: 4, width: "66%" },
    { rank: 4, name: "Christopher Kalongo", club: "Forge FC", stat: 4, width: "66%" },
    { rank: 5, name: "Emil Gazdov", club: "Pacific FC", stat: 3, width: "50%" },
  ];
  
  const nslCleanSheets = [
    { rank: 1, name: "Kailen Sheridan", club: "Vancouver Rise", stat: 5, width: "100%" },
    { rank: 2, name: "Sabrina D'Angelo", club: "AFC Toronto", stat: 4, width: "80%" },
    { rank: 3, name: "Lysianne Proulx", club: "Montreal Roses", stat: 3, width: "60%" },
    { rank: 4, name: "Rylee Foster", club: "Halifax Tides", stat: 2, width: "40%" },
    { rank: 5, name: "Evelyn Burns", club: "Calgary Wild", stat: 2, width: "40%" },
  ];

  const currentStandings = league === 'CPL' ? cplStandings : nslStandings;
  const currentGoldenBoot = league === 'CPL' ? cplGoldenBoot : nslGoldenBoot;
  const currentAvgGoals = league === 'CPL' ? cplAvgGoals : nslAvgGoals;
  const currentAssists = league === 'CPL' ? cplAssists : nslAssists;
  const currentCleanSheets = league === 'CPL' ? cplCleanSheets : nslCleanSheets;
  
  const halfIndex = Math.ceil(currentStandings.length / 2);
  const leftStandings = currentStandings.slice(0, halfIndex);
  const rightStandings = currentStandings.slice(halfIndex);

  const PLAYOFF_LINE = 4;
  const renderStandingsRow = (team: typeof leftStandings[number]) => (
    <div key={team.rank}>
      <div className={`grid grid-cols-[20px_1fr_20px_20px_80px] items-center text-xs p-1 pl-1.5 border-l-2 ${team.rank <= PLAYOFF_LINE ? 'border-crimson' : 'border-transparent'} hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors`}>
        <span className="text-charcoal-soft">{team.rank}</span>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-sm shrink-0"></div>
          <Link
            href={`/teams/${slugify(team.name)}`}
            className="text-charcoal dark:text-white font-bold truncate hover:text-crimson hover:underline"
          >
            {team.name}
          </Link>
        </div>
        <span className="text-neutral-500 dark:text-neutral-400 text-center">{team.played}</span>
        <span className="text-charcoal dark:text-white font-bold text-center">{team.points}</span>
        <div className="flex gap-[2px] justify-end">
          {team.form.map((res, idx) => (
            <span key={idx} className={`w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold ${res === 'W' ? 'bg-crimson text-white' : res === 'D' ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300' : 'bg-neutral-200 dark:bg-neutral-900 text-neutral-500 border border-neutral-300 dark:border-neutral-700'}`}>
              {res}
            </span>
          ))}
        </div>
      </div>
      {team.rank === PLAYOFF_LINE && (
        <div className="flex items-center gap-1.5 py-1 pl-1.5">
          <div className="flex-1 border-t border-dashed border-crimson/40"></div>
          <span className="text-[7px] font-mono text-crimson/70 tracking-wider whitespace-nowrap">PLAYOFF LINE</span>
          <div className="flex-1 border-t border-dashed border-crimson/40"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="col-span-4 row-span-6 bg-card border border-border p-4 flex flex-col gap-4 text-charcoal dark:text-white shadow-sm">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h2 className="text-charcoal dark:text-white font-black text-sm tracking-widest uppercase">
          {league} LEAGUES TRACKER
        </h2>
      </div>

      <div className="grid grid-cols-2 grid-rows-[auto_1fr_1fr] gap-4 h-full">
        {/* ROW 1: LEAGUE STANDINGS */}
        <div className="col-span-2 overflow-x-auto border-b border-border pb-4">
          <div className="grid grid-cols-2 gap-4 min-w-[460px]">
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-[20px_1fr_20px_20px_80px] text-[10px] text-charcoal-soft font-bold tracking-wider mb-1 px-1">
                <span>#</span><span>CLUB</span><span className="text-center">P</span><span className="text-center">PTS</span><span className="text-right">FORM</span>
              </div>
              {leftStandings.map(renderStandingsRow)}
            </div>

            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-[20px_1fr_20px_20px_80px] text-[10px] text-charcoal-soft font-bold tracking-wider mb-1 px-1">
                <span>#</span><span>CLUB</span><span className="text-center">P</span><span className="text-center">PTS</span><span className="text-right">FORM</span>
              </div>
              {rightStandings.map(renderStandingsRow)}
            </div>
          </div>
        </div>

        {/* ROW 2: GOLDEN BOOT & AVG GOALS */}
        <div className="flex flex-col gap-2 border-r border-border pr-4">
          <h3 className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-widest border-b border-border pb-1">Golden Boot Race</h3>
          {currentGoldenBoot.map((player) => (
            <div key={player.rank} className="flex items-center justify-between text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800/50 p-1 transition-colors">
              <div className="flex items-center gap-2 w-1/2 min-w-0">
                <span className="text-charcoal-soft w-3 shrink-0">{player.rank}</span>
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-600 dark:text-neutral-500 shrink-0">{player.name.charAt(0)}</div>
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/players/${slugify(player.name)}`}
                    className="text-charcoal dark:text-white font-bold truncate hover:text-crimson hover:underline"
                  >
                    {player.name}
                  </Link>
                  <Link
                    href={`/teams/${slugify(player.club)}`}
                    className="text-charcoal-soft text-[9px] truncate hover:text-crimson hover:underline"
                  >
                    {player.club}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/2 justify-end shrink-0">
                <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden flex justify-end">
                  <div className="bg-crimson h-full" style={{ width: player.width }}></div>
                </div>
                <span className="text-charcoal dark:text-white font-bold w-4 text-right">{player.goals}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pl-4">
          <div className="flex justify-between items-center border-b border-border pb-1">
            <h3 className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Avg Goals / Match</h3>
            <span className="text-[9px] text-charcoal-soft">[Red] Avg [White/Dark] Games</span>
          </div>
          {currentAvgGoals.map((player) => (
            <div key={player.rank} className="flex items-center justify-between text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800/50 p-1 transition-colors">
              <div className="flex items-center gap-2 w-1/2 min-w-0">
                <span className="text-charcoal-soft w-3 shrink-0">{player.rank}</span>
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-600 dark:text-neutral-500 shrink-0">{player.name.charAt(0)}</div>
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/players/${slugify(player.name)}`}
                    className="text-charcoal dark:text-white font-bold truncate hover:text-crimson hover:underline"
                  >
                    {player.name}
                  </Link>
                  <Link
                    href={`/teams/${slugify(player.club)}`}
                    className="text-charcoal-soft text-[9px] truncate hover:text-crimson hover:underline"
                  >
                    {player.club}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/2 justify-end shrink-0">
                <div className="w-full h-1.5 rounded-full overflow-hidden flex gap-0.5 justify-end bg-neutral-200 dark:bg-neutral-900">
                  <div className="bg-neutral-400 dark:bg-white h-full" style={{ width: player.whiteWidth }}></div>
                  <div className="bg-crimson h-full" style={{ width: player.redWidth }}></div>
                </div>
                <span className="text-charcoal dark:text-white font-bold w-6 text-right">{player.stat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 3: ASSISTS & CLEAN SHEETS */}
        <div className="flex flex-col gap-2 border-r border-border pr-4 pt-4 border-t">
          <h3 className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-widest border-b border-border pb-1">Assist Leaders</h3>
          {currentAssists.map((player) => (
            <div key={player.rank} className="flex items-center justify-between text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800/50 p-1 transition-colors">
              <div className="flex items-center gap-2 w-1/2 min-w-0">
                <span className="text-charcoal-soft w-3 shrink-0">{player.rank}</span>
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-600 dark:text-neutral-500 shrink-0">{player.name.charAt(0)}</div>
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/players/${slugify(player.name)}`}
                    className="text-charcoal dark:text-white font-bold truncate hover:text-crimson hover:underline"
                  >
                    {player.name}
                  </Link>
                  <Link
                    href={`/teams/${slugify(player.club)}`}
                    className="text-charcoal-soft text-[9px] truncate hover:text-crimson hover:underline"
                  >
                    {player.club}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/2 justify-end shrink-0">
                <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden flex justify-end">
                  <div className="bg-crimson h-full" style={{ width: player.width }}></div>
                </div>
                <span className="text-charcoal dark:text-white font-bold w-4 text-right">{player.stat}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pl-4 pt-4 border-t border-border">
          <h3 className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-widest border-b border-border pb-1">Clean Sheets</h3>
          {currentCleanSheets.map((player) => (
            <div key={player.rank} className="flex items-center justify-between text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800/50 p-1 transition-colors">
              <div className="flex items-center gap-2 w-1/2 min-w-0">
                <span className="text-charcoal-soft w-3 shrink-0">{player.rank}</span>
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-600 dark:text-neutral-500 shrink-0">{player.name.charAt(0)}</div>
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/players/${slugify(player.name)}`}
                    className="text-charcoal dark:text-white font-bold truncate hover:text-crimson hover:underline"
                  >
                    {player.name}
                  </Link>
                  <Link
                    href={`/teams/${slugify(player.club)}`}
                    className="text-charcoal-soft text-[9px] truncate hover:text-crimson hover:underline"
                  >
                    {player.club}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/2 justify-end shrink-0">
                <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden flex justify-end">
                  <div className="bg-crimson h-full" style={{ width: player.width }}></div>
                </div>
                <span className="text-charcoal dark:text-white font-bold w-4 text-right">{player.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
