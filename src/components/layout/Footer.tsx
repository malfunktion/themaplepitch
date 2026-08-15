'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Github, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#171717] border-t border-neutral-800 text-neutral-400 font-sans text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Grid: Sitemap Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Pro & National Leagues */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-mono font-bold uppercase tracking-widest text-[11px] pb-2 border-b border-neutral-800">
              Professional & National
            </h4>
            <Link href="/pro-leagues?league=CPL" className="hover:text-white transition-colors">
              Canadian Premier League (CPL)
            </Link>
            <Link href="/pro-leagues?league=NSL" className="hover:text-white transition-colors">
              Northern Super League (NSL)
            </Link>
            <Link href="/national-teams?gender=men" className="hover:text-white transition-colors">
              CANMNT Command Center
            </Link>
            <Link href="/national-teams?gender=women" className="hover:text-white transition-colors">
              CANWNT Command Center
            </Link>
            <Link href="/the-wire" className="hover:text-white transition-colors">
              The Wire // News Stream
            </Link>
            <Link href="/transfer-wire" className="hover:text-white transition-colors">
              Transfer Wire
            </Link>
            <Link href="/competitions" className="hover:text-white transition-colors">
              Competitions & Tournaments
            </Link>
          </div>

          {/* Column 2: Provincial Pyramid */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-mono font-bold uppercase tracking-widest text-[11px] pb-2 border-b border-neutral-800">
              Canadian Pyramid (Pro-Am)
            </h4>
            <Link href="/provincial-leagues" className="hover:text-white transition-colors">
              Provincial Hub (Overview)
            </Link>
            <Link href="/provincial-leagues?province=ON" className="hover:text-white transition-colors">
              League1 Ontario (ON)
            </Link>
            <Link href="/provincial-leagues?province=QC" className="hover:text-white transition-colors">
              Ligue1 Québec (QC)
            </Link>
            <Link href="/provincial-leagues?province=BC" className="hover:text-white transition-colors">
              League1 BC (BC)
            </Link>
            <Link href="/provincial-leagues?province=AB" className="hover:text-white transition-colors">
              League1 Alberta (AB)
            </Link>
          </div>

          {/* Column 3: Scouting & Intelligence */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-mono font-bold uppercase tracking-widest text-[11px] pb-2 border-b border-neutral-800">
              Scouting & Intelligence
            </h4>
            <Link href="/stats" className="hover:text-white transition-colors">
              Scout Hub & Global Form
            </Link>
            <Link href="/" className="hover:text-white transition-colors flex items-center justify-between">
              <span>Contract Radar</span>
              <span className="text-[9px] font-mono bg-neutral-800 text-neutral-400 px-1 py-0.5 rounded">ACTIVE</span>
            </Link>
            <Link href="/" className="hover:text-white transition-colors flex items-center justify-between">
              <span>Dual-National Watch</span>
              <span className="text-[9px] font-mono bg-neutral-800 text-neutral-400 px-1 py-0.5 rounded">ACTIVE</span>
            </Link>
            <Link href="/players" className="hover:text-white transition-colors">
              Player Database & Ratings
            </Link>
            <Link href="/player-index" className="hover:text-white transition-colors">
              Canadian Player Index
            </Link>
            <Link href="/canadian-soccer-map" className="hover:text-white transition-colors">
              Canadian Soccer Map
            </Link>
            <Link href="/scout-terminal" className="hover:text-white transition-colors">
              Scout Terminal
            </Link>
            <Link href="/match-center" className="hover:text-white transition-colors">
              Match Center
            </Link>
          </div>

          {/* Column 4: Platform & Support */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-mono font-bold uppercase tracking-widest text-[11px] pb-2 border-b border-neutral-800">
              The Maple Pitch
            </h4>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Independent Canadian soccer coverage, statistics, scouting tools, and pathway tracking. Demonstration data is clearly labelled while live data infrastructure is developed.
            </p>
            <Link href="/fan-hub" className="hover:text-white transition-colors">
              Fan Hub & Community
            </Link>
            <Link href="/state-of-canadian-soccer" className="hover:text-white transition-colors">
              State of Canadian Soccer
            </Link>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
          <div className="text-neutral-400">
            © 2026 THE MAPLE PITCH // CANADIAN SOCCER INTELLIGENCE PLATFORM
          </div>
          <div className="flex items-center gap-6">
            <Link href="/search" className="text-neutral-400 hover:text-white transition-colors">SEARCH</Link>
            <Link href="/methodology" className="text-neutral-400 hover:text-white transition-colors">METHODOLOGY</Link>
            <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">ABOUT</Link>
            <Link href="/players" className="text-neutral-400 hover:text-white transition-colors">PLAYERS</Link>
            <Link href="/teams" className="text-neutral-400 hover:text-white transition-colors">TEAMS</Link>
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}