import type { WireStory } from "@/lib/types";

export default function WireListItem({ story }: { story: WireStory }) {
  return (
    <a
      href={story.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex cursor-pointer gap-4 border-b border-border py-4"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-border bg-surface text-[10px] text-charcoal-soft">
        IMG
      </div>
      <div className="flex flex-col justify-center">
        <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-crimson">
          {story.league}
        </span>
        <h4 className="text-sm font-bold leading-snug text-charcoal transition-colors group-hover:text-crimson">
          {story.headline}
        </h4>
      </div>
    </a>
  );
}
