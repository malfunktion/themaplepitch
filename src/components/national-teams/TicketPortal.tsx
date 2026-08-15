export default function TicketPortal() {
  // 7. TICKET PORTAL // MATCHDAY CENTRAL & HOSPITALITY
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
          TICKET PORTAL // MATCHDAY CENTRAL & HOSPITALITY
        </span>
        <span className="text-[10px] font-mono text-crimson">[ OFFICIAL VENUE BOOKINGS ]</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] text-charcoal-soft uppercase">
              <th className="py-2 px-3">Opponent</th>
              <th className="py-2 px-3">Venue</th>
              <th className="py-2 px-3">Kick-Off</th>
              <th className="py-2 px-3">Sale Status</th>
              <th className="py-2 px-3 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-charcoal">
            {[
              { opp: 'Chile', venue: 'BMO Field (Toronto)', kickoff: 'Sep 26, 19:00', status: '[ GENERAL SALE ]' },
              { opp: 'Peru', venue: 'Stade Saputo (MTL)', kickoff: 'Oct 03, 14:00', status: '[ PUBLIC SALE ]' },
              { opp: 'United States', venue: 'Allianz Field (MN)', kickoff: 'Nov 12, 20:00', status: '[ PRIORITY TIER ]' },
            ].map((t, idx) => (
              <tr key={idx} className="hover:bg-card/50 transition-colors">
                <td className="py-3 px-3 font-bold">{t.opp}</td>
                <td className="py-3 px-3 text-charcoal">{t.venue}</td>
                <td className="py-3 px-3 text-charcoal-soft">{t.kickoff}</td>
                <td className="py-3 px-3">
                  <span className="text-[9px] font-mono bg-card text-charcoal px-2 py-0.5 border border-border rounded-sm">
                    {t.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button className="text-[10px] font-mono font-bold bg-crimson hover:bg-crimson text-white px-3 py-1 rounded-sm transition-colors">
                    [ BUY TICKETS ]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}