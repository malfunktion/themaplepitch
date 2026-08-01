import type { WireStory } from "@/lib/types";

export default function EditorialAnchor({ story }: { story: WireStory }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-5">
      <span className="inline-block rounded bg-crimson px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
        Editor&apos;s Pick
      </span>
      <h1 className="mt-3 text-2xl font-bold leading-tight">
        {story.headline}
      </h1>
      <p className="mt-2 text-sm text-charcoal-soft">{story.summary}</p>
      <a
        href={story.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm font-semibold text-crimson hover:underline"
      >
        Read more ({story.sourceName}) →
      </a>
    </article>
  );
}
