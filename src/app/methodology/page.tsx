import Link from "next/link";
import DataStatus from "@/components/layout/DataStatus";

export default function Page() {
  return (
    <div className="min-h-[70vh]">
      <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-crimson">HOW THE MAPLE PITCH WORKS</p>
          <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">DATA, SOURCES & METHODOLOGY</h1>
        </div>
        <DataStatus />
      </div>
      <div className="grid gap-10 py-8 lg:grid-cols-12">
        <article className="space-y-5 lg:col-span-7"><p className="text-sm leading-7 text-charcoal-soft">The Maple Pitch is designed to make Canadian soccer easier to understand through structured reporting, statistics, scouting tools, and visual analysis.</p>
<p className="text-sm leading-7 text-charcoal-soft">Where data is still being prototyped, the interface labels it as demonstration data. Production statistics should only be presented as live after a documented source, refresh cadence, and validation process are in place.</p></article>
        <aside className="space-y-5 lg:col-span-5"><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">SOURCE DISCLOSURE</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">Every live metric should identify its source and the date/time it was refreshed.</p></div><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">STAT DEFINITIONS</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">Advanced metrics should have plain-language definitions and explain what the number does — and does not — measure.</p></div><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">CORRECTIONS</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">Material errors should be corrected visibly rather than silently overwritten.</p></div><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">SPONSORED CONTENT</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">Commercial placements should be clearly labelled and visually distinct from editorial coverage.</p></div><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">PLAYER DATA</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">Sensitive scouting or youth information should not be publicly exposed without an appropriate legal and privacy basis.</p></div></aside>
      </div>
      <div className="border-t border-border pt-5">
        <Link href="/" className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal-soft hover:text-crimson">← Return to The Maple Pitch</Link>
      </div>
    </div>
  );
}
