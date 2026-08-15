import React from 'react';

const quotes = [
  { speaker: 'Jesse Marsch', role: 'Head Coach, CanMNT', quote: 'This group has grown up together on the biggest stages, and it shows in how calm we are in these moments.' },
  { speaker: 'Casey Stoney', role: 'Head Coach, CanWNT', quote: 'We asked for control in midfield and got exactly that — a really mature performance from the group.' },
];

export default function PressRoomTranscripts() {
  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
        <span>PRESS ROOM TRANSCRIPTS</span>
        <span className="text-red-600 font-bold">AUDIO &amp; QUOTES</span>
      </div>
      <p className="text-xs text-neutral-300">
        Unfiltered post-match transcripts and audio drops from national team managers and players.
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
