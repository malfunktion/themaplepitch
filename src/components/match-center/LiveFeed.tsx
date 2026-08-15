export default function LiveFeed() {
  const events = [
    { minute: "66'", text: 'Goal' },
    { minute: "59'", text: 'Yellow card' },
    { minute: "53'", text: 'Substitution' },
  ];
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">MATCH FEED</h2>
        <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-crimson">
          <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse"></span>
          LIVE
        </span>
      </div>
      <div className="divide-y divide-border">
        {events.map((e) => (
          <div key={`${e.minute}-${e.text}`} className="flex gap-3 py-2.5 text-xs font-mono">
            <span className="shrink-0 font-bold text-crimson">[ {e.minute} ]</span>
            <span className="text-charcoal-soft">{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
