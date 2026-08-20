import type { FixtureItem, DisciplineLog } from '@/lib/data/provincialLeagues';

export function FixturesCard({ fixtures }: { fixtures: FixtureItem[] }) {
  return (
    <div className="bg-card border border-border rounded-sm p-4">
      <div className="font-mono text-xs font-bold text-charcoal-soft mb-3 tracking-widest uppercase border-b border-border pb-2 flex justify-between items-center">
        <span>UPCOMING FIXTURES</span>
        <span className="text-crimson text-[10px]">SCHEDULE ACTIVE</span>
      </div>
      <div className="space-y-3 font-mono text-xs">
        {fixtures && fixtures.length > 0 ? (
          fixtures.map((fix) => (
            <div key={fix.id} className="p-3 bg-surface dark:bg-card border border-border rounded-sm flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-charcoal-soft">
                <span>{fix.matchday}</span>
                <span className="text-crimson font-bold">{fix.kickoff}</span>
              </div>
              <div className="font-extrabold text-charcoal dark:text-white">{fix.homeTeam} vs {fix.awayTeam}</div>
              <div className="text-[10px] text-charcoal-soft">VENUE: {fix.venue}</div>
            </div>
          ))
        ) : (
          <div className="text-[10px] text-charcoal-soft py-2">No upcoming fixtures scheduled for this tier.</div>
        )}
      </div>
    </div>
  );
}

export function DisciplineLogCard({ logs }: { logs: DisciplineLog[] }) {
  return (
    <div className="bg-card border border-border rounded-sm p-4">
      <div className="font-mono text-xs font-bold text-charcoal-soft mb-3 tracking-widest uppercase border-b border-border pb-2 flex justify-between items-center">
        <span>DISCIPLINE & RULINGS LOG</span>
        <span className="text-crimson text-[10px]">AUDIT</span>
      </div>
      <div className="space-y-3 font-mono text-xs">
        {logs && logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="p-3 bg-surface dark:bg-card border border-border rounded-sm flex flex-col gap-1">
              <div className="flex justify-between text-[10px]">
                <span className="font-bold text-charcoal dark:text-neutral-300">{log.match}</span>
                <span className="text-charcoal-soft">{log.timestamp}</span>
              </div>
              <div className="text-charcoal-soft text-[11px]">{log.infraction}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[9px] font-bold bg-crimson/10 text-crimson px-1.5 py-0.5 rounded-sm border border-crimson/30 uppercase">{log.severity}</span>
                <span className="text-[10px] text-charcoal dark:text-white font-bold">{log.ruling}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[10px] text-charcoal-soft py-2">No disciplinary records reported.</div>
        )}
      </div>
    </div>
  );
}