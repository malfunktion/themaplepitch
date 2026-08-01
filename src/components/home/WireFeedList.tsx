import type { WireStory } from "@/lib/types";
import WireListItem from "./WireListItem";
import SponsoredSlot from "./SponsoredSlot";

const SPONSOR_EVERY_N_ITEMS = 2;

export default function WireFeedList({ stories }: { stories: WireStory[] }) {
  return (
    <section className="flex flex-col gap-0 border-x border-border px-0 lg:col-span-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal">
          The Wire
        </h3>
        <span className="text-xs uppercase text-charcoal-soft">Live Feed</span>
      </div>

      {stories.map((story, index) => (
        <div key={story.id}>
          <WireListItem story={story} />
          {/* Placeholder sponsor — swap for a real rotation once sponsors are signed */}
          {(index + 1) % SPONSOR_EVERY_N_ITEMS === 0 &&
            index !== stories.length - 1 && (
              <SponsoredSlot
                sponsorName="Canadian Tire"
                tagline="Official Partner of Canada Soccer"
              />
            )}
        </div>
      ))}
    </section>
  );
}
