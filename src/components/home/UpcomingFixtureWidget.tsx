import React from 'react';

// Define the shape of your fixture data
export interface UpcomingFixture {
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  time: string;
  venue: string;
  ticketUrl?: string;
}

interface UpcomingFixtureWidgetProps {
  fixture?: UpcomingFixture;
}

export default function UpcomingFixtureWidget({ fixture }: UpcomingFixtureWidgetProps) {
  // Fallback default if no fixture data is passed yet
  const defaultFixture: UpcomingFixture = {
    homeTeam: 'Forge FC',
    awayTeam: 'Pacific FC',
    league: 'CPL',
    date: 'AUG 03',
    time: '4:00 PM EDT',
    venue: 'Tim Hortons Field',
    ticketUrl: '#'
  };

  const data = fixture || defaultFixture;

  return (
    <div className="bg-white border border-charcoal/20 p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center text-xs font-mono text-charcoal/60">
        <span>NEXT MATCH // {data.league}</span>
        <span className="text-crimson font-bold">● LIVE SOON</span>
      </div>

      <div className="flex justify-between items-center my-2">
        <div className="font-bold text-lg text-charcoal">{data.homeTeam}</div>
        <div className="text-xs font-mono text-charcoal/40">VS</div>
        <div className="font-bold text-lg text-charcoal">{data.awayTeam}</div>
      </div>

      <div className="text-xs text-charcoal/70 border-t border-charcoal/10 pt-3 flex flex-col gap-1 font-mono">
        <div>{data.date} — {data.time}</div>
        <div>{data.venue}</div>
      </div>

      {data.ticketUrl && (
        <a
          href={data.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full bg-crimson text-white text-center py-2 text-xs font-mono tracking-wider font-bold hover:bg-charcoal transition-colors"
        >
          [ TICKETS ]
        </a>
      )}
    </div>
  );
}
