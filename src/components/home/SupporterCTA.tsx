/**
 * Placeholder for the Supporter Tier upsell. Deliberately visible but
 * inert right now — there's no live payment flow behind it yet. Wire
 * this up to Helcim and the Supabase `is_paid_supporter` flag once
 * that phase starts.
 */
export default function SupporterCTA() {
  return (
    <div className="bg-charcoal p-5 text-white">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-crimson">
        The Scout Protocol
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-charcoal-soft">
        Unlock advanced player radars, contract trackers, and ad-free tactical
        dossiers for $1.99/mo.
      </p>
      <button
        disabled
        className="w-full cursor-not-allowed border border-charcoal-soft py-3 text-xs font-bold uppercase tracking-widest text-white opacity-60"
      >
        Coming Soon
      </button>
    </div>
  );
}
