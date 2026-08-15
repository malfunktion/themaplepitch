export default function CoachingStaff({ activeGender }: { activeGender: 'MEN' | 'WOMEN' }) {
  // 6. COACHING & STAFF INFRASTRUCTURE
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider">
          COACHING & STAFF INFRASTRUCTURE // TECHNICAL DIRECTOR DESK
        </span>
        <span className="text-[10px] font-mono text-crimson">[ FEDERATION DIRECTIVE ]</span>
      </div>
            
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-charcoal-soft">TECHNICAL DIRECTOR</span>
            <span className="text-sm font-bold text-charcoal uppercase">EXCELLENCE VISION 2026</span>
            <p className="text-xs text-charcoal-soft mt-1">
              Harmonizing tactical frameworks across all national age groups to mirror senior competitive intensity.
            </p>
          </div>
          <span className="text-[9px] font-mono text-crimson pt-2 border-t border-border">READ DIRECTIVE ➔</span>
        </div>
              
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-charcoal-soft">STAFF DIRECTORY</span>
            <span className="text-sm font-bold text-charcoal uppercase">HEAD & ASSISTANT TACTICIANS</span>
            <p className="text-xs text-charcoal-soft mt-1">
              {activeGender === 'MEN' ? 'Jesse Marsch (Head Coach) • Assistant Tacticians • GK Leads' : 'Core National Technical Staff • Medical & Recovery Leads'}
            </p>
          </div>
          <span className="text-[9px] font-mono text-crimson pt-2 border-t border-border">VIEW DIRECTORY ➔</span>
        </div>

        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-charcoal-soft">MATCH ANALYST ZONE</span>
            <span className="text-sm font-bold text-charcoal uppercase">FORMATIONS & HEATMAPS</span>
            <p className="text-xs text-charcoal-soft mt-1">
              Post-match performance reviews and data-driven tactical shape breakdowns from international windows.
            </p>
          </div>
          <span className="text-[9px] font-mono text-crimson pt-2 border-t border-border">EXPLORE DATA ➔</span>
        </div>
      </div>
    </div>
  );
}