/**
 * Placeholder for the Supporter Tier upsell. Deliberately visible but
 * inert right now — there's no live payment flow behind it yet. Wire
 * this up to Helcim and the Supabase `is_paid_supporter` flag once
 * that phase starts; until then it's just laying claim to its spot
 * in the layout so the page doesn't visually shift later.
 */
export default function SupporterCTA() {
  return (
    <div className="rounded-lg border border-crimson/30 bg-crimson/5 p-4 text-center">
      <h3 className="text-sm font-bold text-crimson">Go Ad-Free</h3>
      <p className="mt-1 text-xs text-charcoal-soft">
        Unlock the full Scout Hub stats suite and remove ads for $1.99/mo.
      </p>
      <button
        disabled
        className="mt-3 w-full cursor-not-allowed rounded-md bg-crimson/40 px-3 py-2 text-xs font-semibold text-white"
      >
        Coming Soon
      </button>
    </div>
  );
}
