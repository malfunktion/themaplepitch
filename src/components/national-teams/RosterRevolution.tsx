export default function RosterRevolution() {
  // 10. ROSTER REVOLUTION // SELECTION TRANSITION LOG
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
          ROSTER REVOLUTION // SELECTION TRANSITION LOG
        </span>
        <span className="text-[10px] font-mono text-crimson">[ SQUAD DELTA ANALYSIS ]</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-crimson font-bold uppercase">INCOMING RECRUITS (CAMP ARRIVALS)</span>
          <ul className="text-xs font-mono text-charcoal space-y-1.5 pt-1">
            <li>+ Luc de Fougerolles <span className="text-charcoal-soft">(Fulham U21)</span></li>
            <li>+ Junior Hoilett <span className="text-charcoal-soft">(Pool Asset)</span></li>
            <li>+ Dayne St. Clair <span className="text-charcoal-soft">(Minnesota United)</span></li>
          </ul>
        </div>
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-charcoal-soft font-bold uppercase">DEPARTING TRANSITIONS (DROPPED / RESTED)</span>
          <ul className="text-xs font-mono text-charcoal-soft space-y-1.5 pt-1">
            <li>- Tajon Buchanan <span className="text-charcoal-soft">(Villarreal / Injury Rehab)</span></li>
            <li>- Milan Borjan <span className="text-charcoal-soft">(Rested / Veteran Pool Rotation)</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}