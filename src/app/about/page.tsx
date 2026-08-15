import Link from "next/link";
import DataStatus from "@/components/layout/DataStatus";

export default function Page() {
  return (
    <div className="min-h-[70vh]">
      <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-crimson">THE PROJECT</p>
          <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">CANADIAN SOCCER, MADE VISIBLE</h1>
        </div>
        <DataStatus />
      </div>
      <div className="grid gap-10 py-8 lg:grid-cols-12">
        <article className="space-y-5 lg:col-span-7"><p className="text-sm leading-7 text-charcoal-soft">The Maple Pitch is an independent Canadian soccer intelligence project covering the professional game, provincial pyramid, national teams, players, pathways, and the people building the sport.</p>
<p className="text-sm leading-7 text-charcoal-soft">The aim is simple: connect the stories, numbers, geography, tactics, and player movement that are usually scattered across Canadian soccer.</p></article>
        <aside className="space-y-5 lg:col-span-5"><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">THE WIRE</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">The live editorial and intelligence stream.</p></div><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">THE STATS CENTRE</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">A structured view of performance, players, teams, and competitions.</p></div><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">THE SCOUT TERMINAL</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">A prototype scouting workspace for Canadian player pathways.</p></div><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">THE PYRAMID</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">Provincial and semi-professional football from coast to coast.</p></div><div className="border-t border-border pt-4"><h2 className="text-sm font-black uppercase tracking-wide">THE PATHWAY</h2><p className="mt-2 text-sm leading-6 text-charcoal-soft">The long-term goal: map how Canadian players move from local football to the highest levels.</p></div></aside>
      </div>
      <div className="border-t border-border pt-5">
        <Link href="/" className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal-soft hover:text-crimson">← Return to The Maple Pitch</Link>
      </div>
    </div>
  );
}
