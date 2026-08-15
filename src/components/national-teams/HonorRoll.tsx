export default function HonorRoll() {
  // 9. HONOR ROLL // CAPTAIN'S LOG & MILESTONES
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
          HONOR ROLL // CAPTAIN&apos;S LOG & MILESTONES
        </span>
        <span className="text-[10px] font-mono text-charcoal-soft">[ HISTORICAL FEDERATION TRACKER ]</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] text-charcoal-soft uppercase">
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-3">Player Name</th>
              <th className="py-2 px-3">Milestone Type</th>
              <th className="py-2 px-3">Target Metric</th>
              <th className="py-2 px-3 text-right">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-charcoal">
            {[
              { num: 19, name: 'Alphonso Davies', type: 'Caps Milestone', target: '50 Caps', status: '[ ACHIEVED: 54 ]', statusColor: 'text-crimson' },
              { num: 10, name: 'Jonathan David', type: 'All-Time Goals', target: 'Record Chase', status: '[ 31 / 31 GOALS ]', statusColor: 'text-charcoal' },
              { num: 8, name: 'Ismaël Koné', type: 'Caps Milestone', target: '30 Caps', status: '[ TRACKING: 28 ]', statusColor: 'text-amber-600 dark:text-amber-400' },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-card/50 transition-colors">
                <td className="py-2.5 px-2 text-charcoal-soft font-bold">{row.num}</td>
                <td className="py-2.5 px-3 font-bold">{row.name}</td>
                <td className="py-2.5 px-3 text-charcoal">{row.type}</td>
                <td className="py-2.5 px-3 text-charcoal-soft">{row.target}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className={`text-[9px] font-mono font-bold ${row.statusColor}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}