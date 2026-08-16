export default function MediaArchive() {
  const leagues = ['CPL', 'NSL', 'League1 ON', 'Canada'];
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <h2 className="text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">MEDIA ARCHIVE</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {leagues.map((x) => (
          <div
            key={x}
            className="rounded-sm border border-border p-4 text-center text-[10px] font-mono font-bold text-charcoal-soft hover:border-crimson/60 hover:text-charcoal transition-colors"
          >
            {x}
          </div>
        ))}
      </div>
    </div>
  );
}
