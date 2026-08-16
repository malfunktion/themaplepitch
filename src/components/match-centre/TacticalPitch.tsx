export default function TacticalPitch() {
  // Formation rows, back-to-front. Placeholder shirt numbers/cards.
  const rows = [['9⚽'], ['11🟨', '7'], ['10'], ['8', '6🟥'], ['3', '4', '2'], ['1']];
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <h2 className="mb-4 text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">
        TACTICAL VIEW // FORMATION
      </h2>
      <div className="rounded-sm border border-crimson/30 bg-green-950/20 p-6">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-center gap-10 py-3">
            {r.map((p, j) => (
              <div key={`${p}-${j}`} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-mono font-bold text-charcoal">
                {p}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
