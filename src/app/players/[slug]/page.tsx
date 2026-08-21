// Inside src/app/players/[slug]/page.tsx

const playerPhoto =
  player.avatar_url ||
  player.photo_url ||
  player.headshot_url ||
  player.image_url ||
  null;

// ... inside rendering layout:

<aside className="space-y-6">
  <div className="border border-border bg-card p-5">
    {playerPhoto ? (
      <div className="mb-4 h-32 w-32 overflow-hidden border border-border/60 bg-neutral-900/5 rounded-sm">
        <Image
          src={playerPhoto}
          alt={`${player.name || 'Player'} headshot`}
          width={128}
          height={128}
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>
    ) : (
      <div className="mb-4 flex h-32 w-32 items-center justify-center border border-border/60 bg-neutral-900/10 text-xs font-mono font-bold text-crimson">
        [{player.name ? player.name.substring(0, 3).toUpperCase() : 'FC'}]
      </div>
    )}
    <div className="text-[10px] font-mono uppercase text-crimson">Player Profile Vitals</div>
    {/* ... remaining sidebar details ... */}
  </div>
</aside>
