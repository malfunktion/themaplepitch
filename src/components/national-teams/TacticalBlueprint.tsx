export default function TacticalBlueprint() {
  // 6. TACTICAL BLUEPRINT // MARSCH-BALL INTENSITY METRICS
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
          TACTICAL BLUEPRINT // MARSCH-BALL INTENSITY METRICS
        </span>
        <span className="text-[10px] font-mono text-crimson">[ SYSTEM PRESS & COMPACTNESS ]</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-charcoal-soft">PPDA (PRESSING INTENSITY)</span>
          <span className="text-lg font-bold text-charcoal font-mono">8.4 <span className="text-xs text-crimson font-normal">(-1.2 vs 2025)</span></span>
          <p className="text-xs text-charcoal-soft">Average opponent passes allowed per defensive action in middle third.</p>
        </div>
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-charcoal-soft">VERTICAL TRANSITION SPEED</span>
          <span className="text-lg font-bold text-charcoal font-mono">2.1s <span className="text-xs text-crimson font-normal">[ELITE TIER]</span></span>
          <p className="text-xs text-charcoal-soft">Average time elapsed from defensive ball recovery to final-third entry pass.</p>
        </div>
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-charcoal-soft">BLOCK COMPACTNESS</span>
          <span className="text-lg font-bold text-charcoal font-mono">24.5M <span className="text-xs text-charcoal-soft font-normal">(Vertical Length)</span></span>
          <p className="text-xs text-charcoal-soft">Distance between defensive line and central forward during defensive phase.</p>
        </div>
      </div>
    </div>
  );
}