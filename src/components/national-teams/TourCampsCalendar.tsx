export default function TourCampsCalendar() {
  // 8. TOUR CAMPS & CALENDAR // INTERNATIONAL MATCH WINDOWS
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
          TOUR CAMPS & CALENDAR // INTERNATIONAL MATCH WINDOWS
        </span>
        <span className="text-[10px] font-mono text-crimson">[ MACRO PLANNING UTILITY ]</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-crimson font-bold">SEPTEMBER WINDOW</span>
          <span className="text-xs font-bold text-charcoal">European Base • Marbella Camp</span>
          <p className="text-xs text-charcoal-soft">Tactical integration camp focusing on defensive block stability and pressing triggers.</p>
        </div>
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-crimson font-bold">OCTOBER WINDOW</span>
          <span className="text-xs font-bold text-charcoal">Domestic & CONCACAF Series</span>
          <p className="text-xs text-charcoal-soft">Home-and-away international friendlies against South American confederation opposition.</p>
        </div>
        <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-crimson font-bold">NOVEMBER WINDOW</span>
          <span className="text-xs font-bold text-charcoal">Nations League Quarterfinals</span>
          <p className="text-xs text-charcoal-soft">High-stakes competitive matches securing direct qualification tournament seeding.</p>
        </div>
      </div>
    </div>
  );
}