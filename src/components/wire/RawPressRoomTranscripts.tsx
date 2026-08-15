import React from 'react';

const quotes = [
  { speaker: 'Bobby Smyrniotis', role: 'Head Coach, Forge FC', quote: "We controlled the tempo in the second half — that's the version of this team we want to see every week." },
  { speaker: 'Diana Matheson', role: 'GM, AFC Toronto', quote: "The depth we've built is starting to show. Every substitution today changed the game for us." },
];

export default function RawPressRoomTranscripts() {
  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
        <span>RAW PRESS ROOM TRANSCRIPTS</span>
        <span className="text-red-600 font-bold">DIRECT FEED</span>
      </div>
      <p className="text-xs text-neutral-300">
        Unfiltered coach and player quotes from post-match media availability. No spin, just what&apos;s said.
      </p>
      <div className="flex flex-col gap-3">
        {quotes.map((q, i) => (
          <div key={i} className="border-l-2 border-crimson pl-3">
            <p className="text-[11px] text-charcoal dark:text-neutral-300 italic">&ldquo;{q.quote}&rdquo;</p>
            <span className="text-[9px] font-mono text-charcoal-soft dark:text-neutral-500 mt-1 block">
              {q.speaker} &middot; {q.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
