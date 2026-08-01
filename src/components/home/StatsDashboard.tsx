export default function StatsDashboard() {
  const topScorers = [
    { rank: 1, name: "Jonathan David", team: "Lille", goals: 15, width: "100%" },
    { rank: 2, name: "Cyle Larin", team: "Mallorca", goals: 11, width: "75%" },
    { rank: 3, name: "Iké Ugbo", team: "Troyes", goals: 9, width: "60%" },
  ];

  const topAssists = [
    { rank: 1, name: "Alphonso Davies", team: "Bayern", assists: 8, width: "100%" },
    { rank: 2, name: "Stephen Eustáquio", team: "Porto", assists: 6, width: "75%" },
    { rank: 3, name: "Tajon Buchanan", team: "Inter", assists: 4, width: "50%" },
  ];

  return (
    <section className="flex flex-col gap-6 lg:col-span-4">
      <div className="border-b border-neutral-200 pb-2">
        <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900">
          Global Form Tracker
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Golden Boot Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Golden Boot Race
          </h3>
          <div className="flex flex-col gap-3">
            {topScorers.map((player) => (
              <div key={player.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm font-bold text-neutral-900">
                  <span>{player.rank}. {player.name}</span>
                  <span>{player.goals}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500">
                  {player.team}
                </div>
                {/* The Progress Bar */}
                <div className="h-1.5 w-full bg-neutral-100">
                  <div className="h-full bg-red-600" style={{ width: player.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playmaker Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Top Playmakers
          </h3>
          <div className="flex flex-col gap-3">
            {topAssists.map((player) => (
              <div key={player.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm font-bold text-neutral-900">
                  <span>{player.rank}. {player.name}</span>
                  <span>{player.assists}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500">
                  {player.team}
                </div>
                {/* The Progress Bar */}
                <div className="h-1.5 w-full bg-neutral-100">
                  <div className="h-full bg-neutral-800" style={{ width: player.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
