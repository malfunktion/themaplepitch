export default function PlayerDatabaseSpotlights() {
  // Mock data to scaffold the layout
  const players = [
    { id: 1, name: "Alphonso Davies", tag: "Transfers", summary: "Bayern Munich left-back continues to draw interest from Premier League clubs ahead of the summer window." },
    { id: 2, name: "Jonathan David", tag: "Rumours", summary: "David's brace fuels Lille victory; transfer rumours ignite as scouts circle the Canadian striker." },
    { id: 3, name: "Christine Sinclair", tag: "Legends", summary: "Canada's all-time leading scorer reflects on her career ahead of induction into the Hall of Fame." },
    { id: 4, name: "Tajon Buchanan", tag: "Sponsored", summary: "Buchanan targets a move to Europe's top five leagues after a standout international window." },
  ];

  return (
    <section className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="border-b border-border pb-2">
        <h2 className="text-xl font-black uppercase tracking-tight text-charcoal">
          Player Database Spotlights
        </h2>
      </div>

      {/* 4-Up Grid for the Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {players.map((player) => (
          <div key={player.id} className="group flex cursor-pointer flex-col gap-2">
            {/* Image Placeholder */}
            <div className="aspect-[4/5] w-full bg-border transition-colors group-hover:bg-charcoal-soft flex items-center justify-center text-xs text-charcoal-soft group-hover:text-white">
              [ IMG ]
            </div>

            {/* Tag */}
            <div className="mt-1 flex items-center justify-between">
              <span className="bg-crimson px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                {player.tag}
              </span>
            </div>

            {/* Name */}
            <h3 className="text-sm font-black uppercase leading-tight text-charcoal">
              {player.name}
            </h3>

            {/* Summary */}
            <p className="text-xs leading-relaxed text-charcoal-soft line-clamp-2">
              {player.summary}
            </p>

            <span className="mt-auto pt-2 text-[10px] font-bold tracking-widest text-charcoal underline decoration-border underline-offset-4 group-hover:decoration-crimson">
              VIEW ODDS
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
