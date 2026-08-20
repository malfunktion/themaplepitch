interface TOTWData {
  week: string;
  manager: string;
  note: string;
  players: { pos: string; name: string; club: string }[];
}

interface OriginPin {
  name: string;
  count: number;
  province: string;
  topProspects: string[];
}

export function TeamOfTheWeekCard({ totw }: { totw: TOTWData }) {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-border pb-2 mb-3">
          <span className="font-mono text-xs font-bold text-charcoal-soft tracking-widest uppercase">TEAM OF THE WEEK // BEST XI</span>
          <span className="text-[10px] font-mono text-crimson-dim">{totw.week}</span>
        </div>
        <div className="mb-3 bg-neutral-100 dark:bg-card/40 p-2.5 rounded-sm border border-border">
          <div className="text-[9px] font-mono font-bold text-crimson uppercase">MANAGER OF THE WEEK</div>
          <div className="text-sm font-bold text-charcoal dark:text-white">{totw.manager}</div>
          <p className="text-[11px] text-charcoal-soft mt-1">{totw.note}</p>
        </div>
        <div className="flex flex-col gap-1">
          {totw.players.map((p, idx) => (
            <div key={idx} className="flex justify-between items-center py-1 text-xs font-mono border-b border-border/40 last:border-0">
              <span className="text-[9px] font-bold bg-border text-charcoal px-1.5 py-0.5 rounded-sm">{p.pos}</span>
              <span className="font-bold text-charcoal">{p.name}</span>
              <span className="text-[10px] text-charcoal-soft">{p.club}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TalentOriginCard({ originPins }: { originPins: OriginPin[] }) {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col justify-between">
      <div className="font-mono text-xs font-bold text-charcoal-soft mb-3 tracking-widest uppercase border-b border-border pb-2 flex justify-between items-center">
        <span>TALENT ORIGIN & FEEDER HUBS</span>
        <span className="bg-crimson/10 text-crimson px-2 py-0.5 rounded-sm text-[10px]">PATHWAY ACTIVE</span>
      </div>
      <div className="flex flex-col gap-3">
        {originPins.map((hub, idx) => (
          <div key={idx} className="bg-neutral-100 dark:bg-card/50 p-3 rounded-sm border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-charcoal dark:text-white font-mono">{hub.name}</span>
              <span className="text-[10px] font-mono font-bold bg-crimson text-white px-1.5 py-0.5 rounded-sm">{hub.count} PROSPECTS</span>
            </div>
            <div className="text-[11px] text-charcoal-soft font-mono">
              Key Feeder Academy Graduates: <span className="text-charcoal font-bold">{hub.topProspects.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}