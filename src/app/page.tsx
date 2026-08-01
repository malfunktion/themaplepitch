import React from 'react';

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      
      {/* LEFT COLUMN: The Hero & Dossier (lg:col-span-3) */}
      <section className="flex flex-col gap-6 lg:col-span-3">
        <div className="group cursor-pointer border-b border-border pb-6">
          <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal mb-4 relative">
             {/* Placeholder for high-contrast hero image */}
             <div className="absolute inset-0 flex items-center justify-center text-charcoal-soft text-xs tracking-widest uppercase">
               [ Hero Image: 16:9 Desaturated ]
             </div>
          </div>
          <span className="text-xs font-bold text-crimson tracking-widest uppercase mb-2 block">CanMNT</span>
          <h2 className="text-2xl font-black leading-tight tracking-tight text-charcoal mb-3 group-hover:text-crimson transition-colors">
            DAVID’S BRACE FUELS LILLE VICTORY; TRANSFER RUMOURS HEAT UP
          </h2>
          <p className="text-sm text-charcoal-soft mb-4 leading-relaxed">
            The Canadian striker continues his blistering run of form in Ligue 1, drawing heavy interest from Premier League scouts ahead of the January window.
          </p>
          <span className="text-xs font-bold text-crimson tracking-widest hover:underline">
            [ READ MORE (TSN) ]
          </span>
        </div>
      </section>

      {/* CENTER COLUMN: The Wire (lg:col-span-5) */}
      <section className="flex flex-col gap-0 lg:col-span-5 border-x border-border px-0 lg:px-6">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h3 className="text-sm font-bold tracking-widest text-charcoal uppercase">The Wire</h3>
          <span className="text-xs text-charcoal-soft uppercase">Live Feed</span>
        </div>

        {/* Wire Item 1 */}
        <div className="group flex gap-4 border-b border-border py-4 cursor-pointer">
          <div className="h-16 w-16 shrink-0 bg-surface border border-border flex items-center justify-center text-[10px] text-charcoal-soft">IMG</div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-crimson tracking-widest uppercase mb-1">CPL</span>
            <h4 className="text-sm font-bold text-charcoal leading-snug group-hover:text-crimson transition-colors">
              Cavalry FC secure home-field advantage with gritty 1-0 win over Pacific.
            </h4>
          </div>
        </div>

        {/* Wire Item 2 */}
        <div className="group flex gap-4 border-b border-border py-4 cursor-pointer">
          <div className="h-16 w-16 shrink-0 bg-surface border border-border flex items-center justify-center text-[10px] text-charcoal-soft">IMG</div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-crimson tracking-widest uppercase mb-1">NSL</span>
            <h4 className="text-sm font-bold text-charcoal leading-snug group-hover:text-crimson transition-colors">
              Vancouver Rise announce highly anticipated inaugural home kit design.
            </h4>
          </div>
        </div>

        {/* Native Sponsor Block */}
        <div className="flex items-center gap-4 border-b border-border py-4 bg-surface px-4 my-2">
           <div className="flex flex-col w-full text-center">
              <span className="text-[10px] font-bold text-charcoal-soft tracking-widest uppercase mb-1">Sponsored</span>
              <span className="text-sm font-bold text-charcoal">Canadian Tire: Official Partner of Canada Soccer</span>
           </div>
        </div>

        {/* Wire Item 3 */}
        <div className="group flex gap-4 border-b border-border py-4 cursor-pointer">
          <div className="h-16 w-16 shrink-0 bg-surface border border-border flex items-center justify-center text-[10px] text-charcoal-soft">IMG</div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-crimson tracking-widest uppercase mb-1">CanWNT</span>
            <h4 className="text-sm font-bold text-charcoal leading-snug group-hover:text-crimson transition-colors">
              Tactical Analysis: How the midfield adapted in the second half vs. USA.
            </h4>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: Scout Dashboard (lg:col-span-4) */}
      <section className="flex flex-col gap-6 lg:col-span-4">
        
        {/* Next Match Widget */}
        <div className="border border-border bg-surface p-5">
          <h3 className="text-xs font-bold tracking-widest text-charcoal uppercase border-b border-border pb-3 mb-4">Upcoming Fixture</h3>
          <div className="flex justify-between items-center mb-4">
             <div className="flex flex-col">
               <span className="text-lg font-black text-charcoal">FORGE FC</span>
               <span className="text-xs text-charcoal-soft">Hamilton, ON</span>
             </div>
             <span className="text-sm font-bold text-charcoal-soft">vs</span>
             <div className="flex flex-col text-right">
               <span className="text-lg font-black text-charcoal">YORK UTD</span>
               <span className="text-xs text-charcoal-soft">Toronto, ON</span>
             </div>
          </div>
          <button className="w-full bg-crimson text-white text-xs font-bold tracking-widest py-3 uppercase hover:bg-crimson-dim transition-colors">
            [ TICKETS ]
          </button>
        </div>

        {/* Minimalist Standings Table */}
        <div className="border border-border bg-surface p-5">
          <div className="flex justify-between items-center border-b border-border pb-3 mb-3">
             <h3 className="text-xs font-bold tracking-widest text-charcoal uppercase">CPL Table</h3>
             <span className="text-[10px] text-charcoal-soft uppercase cursor-pointer hover:text-crimson">Full List</span>
          </div>
          <div className="flex flex-col text-sm">
             <div className="flex justify-between py-2 border-b border-border/50">
               <span className="font-bold text-charcoal"><span className="text-charcoal-soft mr-2">1</span> Cavalry FC</span>
               <span className="font-bold">48</span>
             </div>
             <div className="flex justify-between py-2 border-b border-border/50">
               <span className="font-bold text-charcoal"><span className="text-charcoal-soft mr-2">2</span> Forge FC</span>
               <span className="font-bold">42</span>
             </div>
             <div className="flex justify-between py-2 border-b border-border/50">
               <span className="font-bold text-charcoal"><span className="text-charcoal-soft mr-2">3</span> Pacific FC</span>
               <span className="font-bold">40</span>
             </div>
             <div className="flex justify-between py-2">
               <span className="font-bold text-charcoal"><span className="text-charcoal-soft mr-2">4</span> Halifax W.</span>
               <span className="font-bold">39</span>
             </div>
          </div>
        </div>

        {/* Supporter Upsell */}
        <div className="bg-charcoal p-5 text-white">
          <h3 className="text-xs font-bold tracking-widest text-crimson uppercase mb-2">The Scout Protocol</h3>
          <p className="text-sm text-charcoal-soft mb-4 leading-relaxed">
            Unlock advanced player radars, contract trackers, and ad-free tactical dossiers for $1.99/mo.
          </p>
          <button className="w-full border border-charcoal-soft text-white text-xs font-bold tracking-widest py-3 uppercase hover:bg-white hover:text-charcoal transition-colors">
            Gain Access
          </button>
        </div>

      </section>

    </div>
  );
}
