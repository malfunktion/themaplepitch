import type { WireStory } from "@/lib/types";

export default function HeroDossier({ story }: { story: WireStory }) {
  return (
    // Removed the hardcoded lg:col-span-3 so it obeys your layout config
    <section className="flex flex-col gap-6">
      <div className="group cursor-pointer border-b border-border pb-6">
        {/* Changed to aspect-video (16:9) and clamped maximum height */}
        <div className="relative mb-4 aspect-video w-full max-h-[50vh] md:max-h-[450px] overflow-hidden bg-charcoal">
          <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-charcoal-soft">
            [ Hero Image: 16:9 Desaturated ]
          </div>
        </div>
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-crimson">
          {story.league}
        </span>
        <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-charcoal transition-colors group-hover:text-crimson">
          {story.headline}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-charcoal-soft">
          {story.summary}
        </p>
        <a
          href={story.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold tracking-widest text-crimson hover:underline"
        >
          [ READ MORE ({story.sourceName.toUpperCase()}) ]
        </a>
      </div>
    </section>
  );
}
