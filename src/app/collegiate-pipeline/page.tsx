'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// --- Mock Data ---
const ALUMNI_DATA = {
  MEN: {
    name: "Tajon Buchanan",
    path: "Syracuse Univ. ➔ MLS Draft ➔ Inter Milan",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop",
    stats: "CanMNT Regular • Serie A Champion"
  },
  WOMEN: {
    name: "Evelyne Viens",
    path: "South Florida ➔ NWSL Draft ➔ AS Roma",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop",
    stats: "CanWNT Olympic Gold Medalist"
  }
};

const SQUAWK_BOX_LOGS = [
  { time: "14M AGO", type: "COMMIT", text: "L1O Standout L. Martins signs Letter of Intent with Penn State.", tag: "NCAA D1" },
  { time: "2H AGO", type: "PORTAL", text: "M. Davies (Sophomore) enters Transfer Portal after 12-goal season.", tag: "U SPORTS" },
  { time: "5H AGO", type: "DRAFT", text: "Two CanMNT U-20 prospects declare for upcoming MLS SuperDraft.", tag: "NCAA D1" },
  { time: "1D AGO", type: "RUMOUR", text: "Top L1BC goalkeeper linked with multiple ACC D1 offers.", tag: "NCAA D1" },
  { time: "1D AGO", type: "COMMIT", text: "NDC Ontario midfielder commits to Florida State program.", tag: "NCAA D1" },
];

const LEADERBOARDS = {
  MEN: [
    { rank: 1, name: "J. Smith", school: "Syracuse", goals: 11, gpm: "0.85" },
    { rank: 2, name: "T. Wright", school: "Cape Breton", goals: 9, gpm: "0.78" },
    { rank: 3, name: "M. Rossi", school: "Wake Forest", goals: 7, gpm: "0.62" },
    { rank: 4, name: "A. Kone", school: "Montreal", goals: 6, gpm: "0.55" },
    { rank: 5, name: "D. Osorio", school: "UBC", goals: 5, gpm: "0.50" },
  ],
  WOMEN: [
    { rank: 1, name: "S. Alarie", school: "Penn State", goals: 14, gpm: "0.92" },
    { rank: 2, name: "C. Briand", school: "Laval", goals: 12, gpm: "0.88" },
    { rank: 3, name: "M. Leon", school: "Florida State", goals: 10, gpm: "0.75" },
    { rank: 4, name: "K. Grewal", school: "UBC", goals: 8, gpm: "0.60" },
    { rank: 5, name: "L. Awujo", school: "USC", goals: 7, gpm: "0.55" },
  ]
};

export default function CollegiatePipelinePage() {
  const [gender, setGender] = useState<'MEN' | 'WOMEN'>('MEN');
  const [league, setLeague] = useState<'ALL' | 'NCAA D1' | 'U SPORTS'>('ALL');

  const activeAlumni = ALUMNI_DATA[gender];
  const activeLeaderboard = LEADERBOARDS[gender];

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto p-4 lg:p-6 bg-background min-h-screen text-foreground">
      
      {/* 1. MASTER CONTROL BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">Collegiate Pipeline</h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">NCAA & U SPORTS // SCOUTING & DEVELOPMENT TRACKER</p>
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-auto">
          {/* Gender Toggle */}
          <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-sm w-full md:w-auto">
            {(['MEN', 'WOMEN'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 md:flex-none px-6 py-1.5 text-[11px] font-mono font-bold tracking-widest transition-colors rounded-sm ${
                  gender === g ? 'bg-red-600 text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                [ {g} ]
              </button>
            ))}
          </div>
          {/* League Toggle */}
          <div className="flex gap-4 text-[10px] font-mono font-bold text-neutral-500 w-full justify-between md:justify-start">
             {(['ALL', 'NCAA D1', 'U SPORTS'] as const).map((l) => (
                <button 
                  key={l} 
                  onClick={() => setLeague(l)}
                  className={`hover:text-white transition-colors ${league === l ? 'text-white border-b border-red-600 pb-0.5' : ''}`}
                >
                  {l}
                </button>
             ))}
          </div>
        </div>
      </div>

      {/* 2. THE UPPER FOLD: CASUAL HOOK & MEDIA HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left: The Alumni Hook (Casual Fan Bridge) */}
        <div className="lg:col-span-1 bg-[#171717] border border-neutral-800 relative overflow-hidden group flex flex-col justify-end min-h-[300px] cursor-pointer">
          <img 
            src={activeAlumni.image} 
            alt={activeAlumni.name}
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="relative z-10 p-4 border-l-4 border-red-600 bg-black/40 backdrop-blur-sm m-4">
            <p className="text-[10px] font-mono font-bold text-red-500 mb-1">PIPELINE PROVEN // ALUMNI</p>
            <h3 className="text-sm font-black text-white uppercase leading-tight mb-2">{activeAlumni.path}</h3>
            <p className="text-xl font-bold text-white tracking-tight">{activeAlumni.name}</p>
            <p className="text-xs text-neutral-300 font-mono mt-1">{activeAlumni.stats}</p>
          </div>
        </div>

        {/* Right: College Media Hub (Live Action) */}
        <div className="lg:col-span-2 bg-[#171717] border border-neutral-800 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest">[ LIVE BROADCAST // MEDIA HUB ]</h2>
            <span className="flex items-center gap-2 text-[10px] font-mono text-red-600 font-bold animate-pulse">
              <div className="w-2 h-2 rounded-full bg-red-600"></div> LIVE YOUTUBE FEED
            </span>
          </div>
          
          {/* 16:9 Video Player Placeholder */}
          <div className="flex-1 bg-black relative flex items-center justify-center group cursor-pointer border border-neutral-900 overflow-hidden min-h-[250px]">
            <img 
               src="https://images.unsplash.com/photo-1518605368461-1ee7e53f1910?q=80&w=1000&auto=format&fit=crop" 
               alt="Pitch"
               className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
            />
            {/* Play Button */}
            <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform shadow-lg shadow-red-900/50">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
              <div>
                <p className="bg-red-600 text-white px-2 py-0.5 text-[9px] font-mono font-bold inline-block mb-1">NCAA D1 MENS</p>
                <p className="text-white font-bold uppercase text-sm drop-shadow-md">Syracuse Orange vs. Wake Forest Demon Deacons</p>
              </div>
              <p className="text-[10px] font-mono text-white/70 hidden sm:block">WATCH ON YOUTUBE ➔</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE MID-PAGE: HARDCORE SCOUTING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left: Transfer Portal Squawk Box */}
        <div className="lg:col-span-1 bg-[#171717] border border-neutral-800 flex flex-col">
          <div className="p-3 border-b border-neutral-800 bg-neutral-900/50">
            <h2 className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest">[ TRANSFER PORTAL & COMMITMENTS ]</h2>
          </div>
          <div className="flex flex-col overflow-y-auto max-h-[350px]">
            {SQUAWK_BOX_LOGS.map((log, idx) => (
              <div key={idx} className="p-3 border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${log.type === 'COMMIT' ? 'bg-green-900/50 text-green-400' : log.type === 'PORTAL' ? 'bg-red-900/50 text-red-400' : 'bg-neutral-800 text-neutral-300'}`}>
                    {log.type}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500">{log.time}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed mb-1">{log.text}</p>
                <p className="text-[9px] font-mono text-red-500 font-bold">{log.tag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Collegiate Leaderboards (Data Terminal) */}
        <div className="lg:col-span-2 bg-[#171717] border border-neutral-800 flex flex-col">
          <div className="p-3 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
            <h2 className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest">[ COLLEGIATE SCOUTING RADAR // {gender} ]</h2>
            <Link href="/stats" className="text-[9px] font-mono text-red-600 hover:text-white transition-colors">[ VIEW IN STATS EXPLORER ➔ ]</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-800 flex-1">
            
            {/* Goals Column */}
            <div className="bg-[#171717] p-4">
              <h3 className="text-[10px] font-mono font-bold text-white mb-3 tracking-widest">GOLDEN BOOT // GOALS</h3>
              <div className="flex flex-col gap-3">
                {activeLeaderboard.map((player) => (
                  <div key={player.rank} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-500 w-4 text-right">{player.rank}.</span>
                      <div>
                        <p className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors">{player.name}</p>
                        <p className="text-[9px] font-mono text-neutral-500 uppercase">{player.school}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-500">{player.goals}</p>
                      <p className="text-[9px] font-mono text-neutral-600">{player.gpm} GPM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assists / Playmaking Column (Using same mock data structure to populate for now) */}
            <div className="bg-[#171717] p-4">
              <h3 className="text-[10px] font-mono font-bold text-white mb-3 tracking-widest">CREATIVE ENGINE // ASSISTS</h3>
              <div className="flex flex-col gap-3">
                {[...activeLeaderboard].reverse().map((player, idx) => (
                  <div key={player.rank} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-500 w-4 text-right">{idx + 1}.</span>
                      <div>
                        <p className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors">{player.name}</p>
                        <p className="text-[9px] font-mono text-neutral-500 uppercase">{player.school}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-neutral-300">{player.goals - 2}</p>
                      <p className="text-[9px] font-mono text-neutral-600">AST</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
