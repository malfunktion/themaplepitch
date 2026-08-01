export default function LegendsGallery() {
  const legends = [
    { id: 1, name: "Craig Forrest", era: "1988-2002", accolade: "2000 Gold Cup MVP" },
    { id: 2, name: "Christine Sinclair", era: "2000-2023", accolade: "190 Int'l Goals" },
    { id: 3, name: "Atiba Hutchinson", era: "2003-2023", accolade: "104 Caps (Record)" },
    { id: 4, name: "Dwayne De Rosario", era: "1998-2015", accolade: "4x MLS Cup Champ" },
  ];

  return (
    <section className="flex flex-col gap-6 bg-neutral-900 p-6 text-white">
      {/* Dark Header */}
      <div className="flex items-end justify-between border-b border-neutral-700 pb-2">
        <h2 className="text-xl font-black uppercase tracking-tight">
          Canadian Legends Archive
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
          Heritage Collection
        </span>
      </div>

      {/* 4-Up Grid for the Dark Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {legends.map((legend) => (
          <div key={legend.id} className="group flex cursor-pointer flex-col gap-2">
            {/* Dark Image Placeholder */}
            <div className="aspect-square w-full bg-neutral-800 transition-colors group-hover:bg-neutral-700 flex items-center justify-center text-xs text-neutral-500 group-hover:text-white">
              [ ARCHIVE IMG ]
            </div>
            
            <div className="mt-2 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                {legend.era}
              </span>
              <h3 className="text-sm font-black uppercase leading-tight text-white group-hover:text-red-500 transition-colors">
                {legend.name}
              </h3>
              <span className="mt-1 text-xs font-medium text-neutral-300">
                {legend.accolade}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
