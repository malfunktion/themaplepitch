// TODO: replace with real highlight video IDs once the YouTube ingestion
// pipeline exists (see chat: mediaSources / YOUTUBE_SOURCES plan).
const PLACEHOLDER_IDS = ['jfKfPfyJRdk', 'jfKfPfyJRdk', 'jfKfPfyJRdk'];

export default function HighlightsGrid() {
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <h2 className="mb-4 text-[10px] font-mono font-bold tracking-wider text-charcoal-soft uppercase">
        LATEST HIGHLIGHTS
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {PLACEHOLDER_IDS.map((id, i) => (
          <iframe
            key={i}
            className="aspect-video w-full rounded-sm border border-border"
            src={`https://www.youtube.com/embed/${id}`}
            allowFullScreen
          />
        ))}
      </div>
    </div>
  );
}
