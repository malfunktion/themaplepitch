export default function SponsoredSlot({
  sponsorName,
  tagline,
}: {
  sponsorName: string;
  tagline: string;
}) {
  return (
    <div className="my-2 flex items-center gap-4 border-b border-border bg-surface px-4 py-4">
      <div className="flex w-full flex-col text-center">
        <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-charcoal-soft">
          Sponsored
        </span>
        <span className="text-sm font-bold text-charcoal">
          {sponsorName}: {tagline}
        </span>
      </div>
    </div>
  );
}
