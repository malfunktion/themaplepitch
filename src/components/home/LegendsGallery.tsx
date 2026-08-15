export default function LegendsGallery() {
  const legends = [
    { id: 1, name: "Craig Forrest", era: "1988-2002", accolade: "2000 Gold Cup MVP" },
    { id: 2, name: "Christine Sinclair", era: "2000-2023", accolade: "190 Int'l Goals" },
    { id: 3, name: "Atiba Hutchinson", era: "2003-2023", accolade: "104 Caps (Record)" },
    { id: 4, name: "Dwayne De Rosario", era: "1998-2015", accolade: "4x MLS Cup Champ" },
  ];

  return (
    <section className="flex flex-col gap-6 bg-card p-6 text-charcoal dark:text-white border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border pb-3">
        <h2 className="text-xl font-black uppercase tracking-tight text-charcoal dark:text-white">
          Canadian Legends Archive
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-crimson dark:text-crimson font-mono">
          Heritage Collection
        </span>
      </div>

      {/* 4-Up Grid for the Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {legends.map((legend) => (
          <div key={legend.id} className="group flex cursor-pointer flex-col gap-2">
            {/* Image Placeholder */}
            <div className="aspect-square w-full bg-surface dark:bg-neutral-900 transition-colors group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800 flex items-center justify-center text-xs text-neutral-500 dark:text-neutral-500 group-hover:text-charcoal dark:group-hover:text-white border border-border font-mono">
              [ ARCHIVE IMG ]
            </div>
            
            <div className="mt-1 flex flex-col font-mono">
              <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-soft">
                {legend.era}
              </span>
              <h3 className="text-sm font-black uppercase leading-tight text-charcoal dark:text-white group-hover:text-crimson dark:group-hover:text-crimson transition-colors">
                {legend.name}
              </h3>
              <span className="mt-0.5 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {legend.accolade}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}