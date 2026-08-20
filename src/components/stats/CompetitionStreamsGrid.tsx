interface StreamPlayer {
  rank: number;
  name: string;
  club: string;
  ga: string;
  rtg?: string;
  mins?: string;
}

interface StreamCardProps {
  title: string;
  players: StreamPlayer[];
  lastColLabel: string;
  lastColKey: 'rtg' | 'mins';
  nameColLabel: string;
}

function StreamCard({ title, players, lastColLabel, lastColKey, nameColLabel }: StreamCardProps) {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
          <span className="text-xs font-mono font-bold tracking-wider text-charcoal">[ {title} ]</span>
          <span className="text-[10px] font-mono text-charcoal-soft dark:text-neutral-600 cursor-not-allowed" title="Explorer page coming soon">
            [ COMING SOON ]
          </span>
        </div>
        <div className="space-y-1.5 font-mono">
          <div className="grid grid-cols-12 text-[9px] text-charcoal-soft px-2 py-1 uppercase border-b border-border/50">
            <span className="col-span-1">#</span>
            <span className="col-span-7">{nameColLabel}</span>
            <span className="col-span-2 text-center">G / A</span>
            <span className="col-span-2 text-right">{lastColLabel}</span>
          </div>
          {players.map((row) => (
            <div key={row.rank} className="grid grid-cols-12 items-center text-xs px-2 py-1.5 bg-surface/50 dark:bg-black/20 rounded-sm border border-border/40">
              <span className="col-span-1 font-bold text-charcoal-soft">{row.rank}</span>
              <span className="col-span-7 truncate font-medium text-charcoal">{row.name} <span className="text-[10px] text-charcoal-soft">({row.club})</span></span>
              <span className="col-span-2 text-center text-crimson font-bold text-[11px]">{row.ga}</span>
              <span className="col-span-2 text-right text-charcoal">{lastColKey === 'mins' ? row.mins : row.rtg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface CompetitionStreamsGridProps {
  cplStreamPlayers: StreamPlayer[];
  nslStreamPlayers: StreamPlayer[];
  mlsStreamPlayers: StreamPlayer[];
  abroadStreamPlayers: StreamPlayer[];
}

export default function CompetitionStreamsGrid({ cplStreamPlayers, nslStreamPlayers, mlsStreamPlayers, abroadStreamPlayers }: CompetitionStreamsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StreamCard title="CANADIAN PREMIER LEAGUE // CPL" players={cplStreamPlayers} lastColLabel="RTG" lastColKey="rtg" nameColLabel="PLAYER NAME // CLUB" />
      <StreamCard title="NORTHERN SUPER LEAGUE // NSL" players={nslStreamPlayers} lastColLabel="RTG" lastColKey="rtg" nameColLabel="PLAYER NAME // CLUB" />
      <StreamCard title="MLS // CANADIANS STREAM" players={mlsStreamPlayers} lastColLabel="MINS" lastColKey="mins" nameColLabel="PLAYER NAME // CLUB" />
      <StreamCard title="EUROPE & ABROAD // CANADIAN EXPAT" players={abroadStreamPlayers} lastColLabel="RTG" lastColKey="rtg" nameColLabel="PLAYER NAME // LEAGUE" />
    </div>
  );
}