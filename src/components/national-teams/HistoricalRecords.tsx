export default function HistoricalRecords({ activeGender }: { activeGender: 'MEN' | 'WOMEN' }) {
  // 7. HISTORICAL RECORDS & ARCHIVES
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider">
          HISTORICAL RECORDS & ARCHIVES // LEGACY & TOURNAMENTS
        </span>
        <span className="text-[10px] font-mono text-charcoal-soft">ALL-TIME LEADERBOARDS</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-crimson font-bold">ALL-TIME CAPS & GOALS</span>
          <p className="text-xs text-charcoal">
            {activeGender === 'MEN' ? 'Atiba Hutchinson (104 Caps) • C. Sinclair / S. Sinclair milestones.' : 'Christine Sinclair (331 Caps, 190 Goals) • All-time record holders.'}
          </p>
          <span className="text-[9px] font-mono text-charcoal-soft mt-auto pt-2 border-t border-border">VIEW LEADERBOARDS ➔</span>
        </div>
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-crimson font-bold">TOURNAMENT HISTORY</span>
          <p className="text-xs text-charcoal">
            Historical squad lists and results from World Cups, Olympic Games, and CONCACAF Gold Cups.
          </p>
          <span className="text-[9px] font-mono text-charcoal-soft mt-auto pt-2 border-t border-border">EXPLORE ARCHIVES ➔</span>
        </div>
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-crimson font-bold">HALL OF FAME</span>
          <p className="text-xs text-charcoal">
            Biographies, career retrospectives, and iconic moments of legendary Canadian football icons.
          </p>
          <span className="text-[9px] font-mono text-charcoal-soft mt-auto pt-2 border-t border-border">VIEW INDUCTEES ➔</span>
        </div>
      </div>
    </div>
  );
}