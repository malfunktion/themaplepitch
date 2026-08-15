import type { StatPlayer } from '@/lib/data/provincialLeagues';

interface StatLeaderboardCardProps {
  title: string;
  players: StatPlayer[];
  valueLabel: (value: number) => string;
  valueColorClass?: string;
  showWhiteBar?: boolean;
  rightNote?: string;
}

export default function StatLeaderboardCard({
  title,
  players,
  valueLabel,
  valueColorClass = 'text-crimson',
  showWhiteBar = false,
  rightNote,
}: StatLeaderboardCardProps) {
  return (
    <div className="bg-card border border-border rounded-sm p-4">
      <div className="font-mono text-xs font-bold text-charcoal-soft mb-3 tracking-widest uppercase border-b border-border pb-2 flex justify-between items-center">
        <span>{title}</span>
        {rightNote && <span className="text-[9px] text-charcoal-soft">{rightNote}</span>}
      </div>
      <div className="flex flex-col gap-3">
        {players.map((player) => (
          <div key={player.rank} className="flex flex-col gap-1 border-b border-border/50 pb-2.5 last:border-0 last:pb-0">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-charcoal dark:text-neutral-200">
                {player.rank}. {player.name} <span className="text-[10px] text-charcoal-soft font-normal">({player.club})</span>
              </span>
              <span className={`font-extrabold ${valueColorClass}`}>{valueLabel(player.value)}</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-sm overflow-hidden flex gap-0.5">
              <div className="bg-crimson h-full" style={{ width: player.redWidth }} />
              {showWhiteBar && <div className="bg-white/80 h-full" style={{ width: player.whiteWidth || '50%' }} />}
            </div>
            <div className="text-[9px] font-mono text-charcoal-soft">
              <span>{player.subText}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}