import type { WireStory } from "@/lib/types";
import WireCard from "./WireCard";

export default function WireFeed({ stories }: { stories: WireStory[] }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-charcoal-soft">
        The Wire
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stories.map((story) => (
          <WireCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}
