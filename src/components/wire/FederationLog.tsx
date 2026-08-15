export default function FederationLog() {
  return (
    <>
      {/* THE OFFICIAL FEDERATION & DISCIPLINARY LOG */}
      <div className="bg-card border border-border rounded-sm p-3 shadow-inner">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
          <span className="text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">
            FEDERATION LOG
          </span>
          <span className="text-[8px] font-mono font-bold bg-crimson text-white px-1.5 py-0.5 rounded-sm">
            [ OFFICIAL NOTICES ]
          </span>
        </div>
        <div className="space-y-2.5 text-[10px] font-mono text-charcoal-soft">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-crimson font-bold shrink-0">[CSA]</span>
              <span className="text-charcoal font-bold">RULING</span>
            </div>
            <span className="leading-snug">3-match ban upheld for violent conduct (CanChamp).</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-crimson font-bold shrink-0">[CPL]</span>
              <span className="text-charcoal font-bold">REVIEW</span>
            </div>
            <span className="leading-snug">Supplemental discipline: undisclosed fine for bench actions.</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-crimson font-bold shrink-0">[L1O]</span>
              <span className="text-charcoal font-bold">ADMIN</span>
            </div>
            <span className="leading-snug">Roster registration window officially closes Friday 17:00 EST.</span>
          </div>
        </div>
      </div>
    </>
  );
}