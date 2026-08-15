export default function DepthChart() {
  // 11. DEPTH CHART // TACTICAL PILLARS MATRIX
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
          DEPTH CHART // TACTICAL PILLARS MATRIX
        </span>
        <span className="text-[10px] font-mono text-crimson">[ MARSCH-BALL FORMATION MAPPING ]</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] text-charcoal-soft uppercase">
              <th className="py-2 px-3">Position</th>
              <th className="py-2 px-3">Starting XI Preference</th>
              <th className="py-2 px-3">Primary Deputy</th>
              <th className="py-2 px-3 text-right">Emergency Reserve</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-charcoal">
            {[
              { pos: 'Left-Back', starter: 'Alphonso Davies', deputy: 'Liam Millar', reserve: 'Youth Pool Asset' },
              { pos: 'Center-Back', starter: 'Moïse Bombito', deputy: 'Luc de Fougerolles', reserve: 'L1 Canada Standout' },
              { pos: 'Central Mid', starter: 'Stephen Eustáquio', deputy: 'Ismaël Koné', reserve: 'Mathieu Choinière' },
              { pos: 'Striker', starter: 'Jonathan David', deputy: 'Cyle Larin', reserve: 'U-23 Domestic Pool' },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-card/50 transition-colors">
                <td className="py-3 px-3 font-bold text-crimson">{row.pos}</td>
                <td className="py-3 px-3 text-charcoal font-bold">{row.starter}</td>
                <td className="py-3 px-3 text-charcoal">{row.deputy}</td>
                <td className="py-3 px-3 text-right text-charcoal-soft">{row.reserve}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}