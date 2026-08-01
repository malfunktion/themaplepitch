import type { WireStory } from "@/lib/types";

export default function WireCard({ story }: { story: WireStory }) {
  return (
    <a
      href={story.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-crimson">
        <span>{story.league}</span>
        <span className="text-charcoal-soft">· {story.sourceName}</span>
      </div>
      <h3 className="mt-1.5 text-sm font-bold leading-snug">
        {story.headline}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs text-charcoal-soft">
        {story.summary}
      </p>
    </a>
  );
}
