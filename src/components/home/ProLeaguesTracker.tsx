'use client';

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
    { rank: 1, name: "B. Wright", club: "York United", goals: 9, width: "100%" },
    { rank: 2, name: "A. Díaz", club: "Vancouver FC", goals: 7, width: "77%" },
    { rank: 3, name: "R. Bassett", club: "Atlético Ottawa", goals: 6, width: "66%" },
    { rank: 4, name: "T. Campbell", club: "Forge FC", goals: 6, width: "66%" },
    { rank: 5, name: "D. Choinière", club: "Forge FC", goals: 5, width: "55%" },
  ];
  
  const nslGoldenBoot = [
    { rank: 1, name: "E. Viens", club: "Montreal", goals: 8, width: "100%" },
    { rank: 2, name: "C. Larin", club: "Toronto", goals: 6, width: "75%" },
    { rank: 3, name: "O. Smith", club: "Vancouver", goals: 5, width: "62%" },
    { rank: 4, name: "J. Huitema", club: "Vancouver", goals: 4, width: "50%" },
    { rank: 5, name: "N. Collins", club: "Calgary", goals: 3, width: "37%" },
  ];

  const cplAvgGoals = [
    { rank: 1, name: "B. Wright", club: "York United", stat: "0.8", redWidth: "80%", whiteWidth: "20%" },
    { rank: 2, name: "A. Díaz", club: "Vancouver FC", stat: "0.6", redWidth: "60%", whiteWidth: "40%" },
    { rank: 3, name: "T. Campbell", club: "Forge FC", stat: "0.5", redWidth: "50%", whiteWidth: "50%" },
    { rank: 4, name: "R. Bassett", club: "Atlético", stat: "0.4", redWidth: "40%", whiteWidth: "60%" },
    { rank: 5, name: "M. Shaw", club: "Cavalry FC", stat: "0.4", redWidth: "40%", whiteWidth: "60%" },
  ];
  
  const nslAvgGoals = [
    { rank: 1, name: "E. Viens", club: "Montreal", stat: "1.1", redWidth: "100%", whiteWidth: "0%" },
    { rank: 2, name: "O. Smith", club: "Vancouver", stat: "0.9", redWidth: "81%", whiteWidth: "19%" },
    { rank: 3, name: "C. Larin", club: "Toronto", stat: "0.7", redWidth: "63%", whiteWidth: "37%" },
    { rank: 4, name: "J. Huitema", club: "Vancouver", stat: "0.6", redWidth: "54%", whiteWidth: "46%" },
    { rank: 5, name: "N. Collins", club: "Calgary", stat: "0.5", redWidth: "45%", whiteWidth: "55%" },
  ];

  const cplAssists = [
    { rank: 1, name: "M. Aparicio", club: "Atlético", stat: 5, width: "100%" },
    { rank: 2, name: "K. Borges", club: "Forge FC", stat: 4, width: "80%" },
    { rank: 3, name: "O. Ercan", club: "York United", stat: 3, width: "60%" },
    { rank: 4, name: "S. Daniels", club: "Halifax", stat: 3, width: "60%" },
    { rank: 5, name: "A. Hojabrpour", club: "Forge FC", stat: 2, width: "40%" },
  ];
  
  const nslAssists = [
    { rank: 1, name: "J. Fleming", club: "Toronto", stat: 6, width: "100%" },
    { rank: 2, name: "A. Leon", club: "Montreal", stat: 4, width: "66%" },
    { rank: 3, name: "Q. Quinn", club: "Vancouver", stat: 3, width: "50%" },
    { rank: 4, name: "D. Rose", club: "Calgary", stat: 3, width: "50%" },
    { rank: 5, name: "S. Zadorsky", club: "Halifax", stat: 2, width: "33%" },
  ];

  const cplCleanSheets = [
    { rank: 1, name: "M. Ingham", club: "Atlético", stat: 6, width: "100%" },
    { rank: 2, name: "T. Carducci", club: "Cavalry", stat: 5, width: "83%" },
    { rank: 3, name: "T. Vincensini", club: "York", stat: 4, width: "66%" },
    { rank: 4, name: "C. Kalongo", club: "Forge", stat: 4, width: "66%" },
    { rank: 5, name: "E. Gazdov", club: "Pacific", stat: 3, width: "50%" },
  ];
  
  const nslCleanSheets = [
    { rank: 1, name: "K. Sheridan", club: "Vancouver", stat: 5, width: "100%" },
    { rank: 2, name: "S. D'Angelo", club: "Toronto", stat: 4, width: "80%" },
    { rank: 3, name: "L. Proulx", club: "Montreal", stat: 3, width: "60%" },
    { rank: 4, name: "R. Foster", club: "Halifax", stat: 2, width: "40%" },
    { rank: 5, name: "E. Burns", club: "Calgary", stat: 2, width: "40%" },
  ];

  // Derive active lists directly from the prop
  const currentStandings = league === 'CPL' ? cplStandings : nslStandings;
  const currentGoldenBoot = league === 'CPL' ? cplGoldenBoot : nslGoldenBoot;
  const currentAvgGoals = league === 'CPL' ? cplAvgGoals : nslAvgGoals;
  const currentAssists = league === 'CPL' ? cplAssists : nslAssists;
  const currentCleanSheets = league === 'CPL' ? cplCleanSheets : nslCleanSheets;
  
  const halfIndex = Math.ceil(currentStandings.length / 2);
  const leftStandings = currentStandings.slice(0, halfIndex);
  const rightStandings = currentStandings.slice(halfIndex);

  // Playoff-line accent: a thin border on qualifying rows plus a single divider
  // at the cutoff, rather than a new color or badge — a quiet, standard sports-
  // table convention (TSN/ESPN use the same left-edge accent) that reads as
  // "professional" without adding a new visual element to scan.
  const PLAYOFF_LINE = 4;
  const renderStandingsRow = (team: typeof leftStandings[number]) => (
    <div key={team.rank}>
      <div className={`grid grid-cols-[20px_1fr_20px_20px_80px] items-center text-xs p-1 pl-1.5 border-l-2 ${team.rank <= PLAYOFF_LINE ? 'border-crimson' : 'border-transparent'} hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors`}>
        <span className="text-charcoal-soft">{team.rank}</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
          <span className="text-charcoal dark:text-white font-bold">{team.name}</span>
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
      
      {/* HEADER: Cleaned up to remove redundant toggle buttons */}
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h2 className="text-charcoal dark:text-white font-black text-sm tracking-widest uppercase">
          {league} LEAGUES TRACKER
        </h2>
      </div>

      {/* 3-ROW GRID */}
      <div className="grid grid-cols-2 grid-rows-[auto_1fr_1fr] gap-4 h-full">
        {/* ROW 1: LEAGUE STANDINGS (Spans both columns). The two-half grid below
            uses fixed-width columns that won't shrink past their content's natural
            size — wrapped in overflow-x-auto so THIS block scrolls internally on
            narrow viewports instead of dragging the entire page wider than the
            screen (which was squeezing every other column, including the sidebar). */}
        <div className="col-span-2 overflow-x-auto border-b border-border pb-4">
          <div className="grid grid-cols-2 gap-4 min-w-[460px]">

          {/* Top Half of Standings */}
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-[20px_1fr_20px_20px_80px] text-[10px] text-charcoal-soft font-bold tracking-wider mb-1 px-1">
              <span>#</span><span>CLUB</span><span className="text-center">P</span><span className="text-center">PTS</span><span className="text-right">FORM</span>
            </div>
            {leftStandings.map(renderStandingsRow)}
          </div>

          {/* Bottom Half of Standings */}
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
              <div className="flex items-center gap-2 w-1/2">
                <span className="text-charcoal-soft w-3">{player.rank}</span>
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-600 dark:text-neutral-500">{player.name.charAt(0)}</div>
                <div className="flex flex-col">
                  <span className="text-charcoal dark:text-white font-bold truncate">{player.name}</span>
                  <span className="text-charcoal-soft text-[9px]">{player.club}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/2 justify-end">
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
              <div className="flex items-center gap-2 w-1/2">
                <span className="text-charcoal-soft w-3">{player.rank}</span>
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-600 dark:text-neutral-500">{player.name.charAt(0)}</div>
                <div className="flex flex-col">
                  <span className="text-charcoal dark:text-white font-bold truncate">{player.name}</span>
                  <span className="text-charcoal-soft text-[9px]">{player.club}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/2 justify-end">
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
              <div className="flex items-center gap-2 w-1/2">
                <span className="text-charcoal-soft w-3">{player.rank}</span>
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-600 dark:text-neutral-500">{player.name.charAt(0)}</div>
                <div className="flex flex-col">
                  <span className="text-charcoal dark:text-white font-bold truncate">{player.name}</span>
                  <span className="text-charcoal-soft text-[9px]">{player.club}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/2 justify-end">
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
              <div className="flex items-center gap-2 w-1/2">
                <span className="text-charcoal-soft w-3">{player.rank}</span>
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-600 dark:text-neutral-500">{player.name.charAt(0)}</div>
                <div className="flex flex-col">
                  <span className="text-charcoal dark:text-white font-bold truncate">{player.name}</span>
                  <span className="text-charcoal-soft text-[9px]">{player.club}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/2 justify-end">
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