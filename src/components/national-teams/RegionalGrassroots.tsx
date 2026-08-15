export default function RegionalGrassroots() {
  // 8. REGIONAL & GRASSROOTS INTEGRATION
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider">
          REGIONAL & GRASSROOTS INTEGRATION // RDC & EXCEL PIPELINE
        </span>
        <span className="text-[10px] font-mono text-crimson">PROVINCIAL FEEDER NETWORKS</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-charcoal-soft">RDC & EXCEL CENTERS</span>
          <p className="text-xs text-charcoal">Regional Excel center progress reports developing elite youth talent across all provinces.</p>
          <span className="text-[9px] font-mono text-crimson pt-2 border-t border-border">TRACK CENTERS ➔</span>
        </div>
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-charcoal-soft">ID CAMP TRACKER</span>
          <p className="text-xs text-charcoal">Schedules, evaluation criteria, and standout player reports from national talent ID camps.</p>
          <span className="text-[9px] font-mono text-crimson pt-2 border-t border-border">VIEW SCHEDULES ➔</span>
        </div>
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-charcoal-soft">LEAGUE1 SCOUTING FEED</span>
          <p className="text-xs text-charcoal">Live performance tracking of standouts in League1 Ontario, L1Q, and L1BC making the national jump.</p>
          <span className="text-[9px] font-mono text-crimson pt-2 border-t border-border">OPEN SCOUT FEED ➔</span>
        </div>
      </div>
    </div>
  );
}