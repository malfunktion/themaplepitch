export default function DevDashboard() {
  return (
    <div className="min-h-screen bg-[#060606] text-[#f4f4f4] font-mono p-4 sm:p-8 relative flex flex-col gap-6 overflow-x-hidden">
      {/* Structural Grid Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-10 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Navigation Header */}
      <header className="relative z-20 max-w-[1500px] w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#222222] pb-4 gap-4 text-xs tracking-[0.15em] uppercase">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#e60000] rounded-full shadow-[0_0_12px_#e60000] animate-pulse"></span>
          <span className="font-extrabold text-sm tracking-wider">THE MAPLE PITCH</span>
          <span className="text-[#777777]">// SCOUTING TERMINAL v2.4</span>
        </div>

        <nav className="flex flex-wrap gap-6 text-[#777777] text-[11px]">
          <a href="#overview" className="text-[#f4f4f4] border-b border-[#e60000] pb-0.5">OVERVIEW</a>
          <a href="#cpl" className="hover:text-[#f4f4f4] transition-colors">CPL</a>
          <a href="#nsl" className="hover:text-[#f4f4f4] transition-colors">NSL</a>
          <a href="#mls" className="hover:text-[#f4f4f4] transition-colors">MLS</a>
          <a href="#national" className="hover:text-[#f4f4f4] transition-colors">CANMNT/WNT</a>
          <a href="#scouting" className="hover:text-[#f4f4f4] transition-colors">PROSPECT RADAR</a>
        </nav>

        <div className="text-[10px] text-[#777777] bg-[#0e0e0e] px-2.5 py-1 border border-[#222222]">
          ENV: <span className="text-[#e60000] font-bold">DEV_STAGING</span>
        </div>
      </header>

      {/* Live Feed Ticker Bar */}
      <section className="relative z-20 max-w-[1500px] w-full mx-auto bg-[#0e0e0e] border border-[#222222] p-3 text-xs flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#e60000] font-bold text-[10px] tracking-widest">[LIVE FEED]</span>
          <span className="text-[#777777]">MATCHDAY TRACKING:</span>
        </div>
        <div className="flex flex-wrap gap-6 text-[11px]">
          <div><span className="text-[#777777]">FORGE FC</span> <span className="text-[#e60000]">2 - 1</span> <span className="text-[#777777]">CAVALRY FC</span> <span className="text-[9px] text-[#777777]">(78')</span></div>
          <div className="border-l border-[#222222] pl-6"><span className="text-[#777777]">VANCOUVER RISE</span> <span className="text-[#e60000]">1 - 0</span> <span className="text-[#777777]">OTTAWA RAPID</span> <span className="text-[9px] text-[#777777]">(FT)</span></div>
          <div className="border-l border-[#222222] pl-6"><span className="text-[#777777]">TORONTO FC</span> <span className="text-[#e60000]">0 - 0</span> <span className="text-[#777777]">CF MONTRÉAL</span> <span className="text-[9px] text-[#777777]">(HT)</span></div>
        </div>
      </section>

      {/* Main Modular Grid Layout */}
      <main className="relative z-20 max-w-[1500px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Analytics & Tactical Feed (8 cols) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tactical Analytics Dashboard Card */}
          <div className="bg-[#0e0e0e] border border-[#222222] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-3">
              <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#e60000]"></span>
                CANADIAN DOMESTIC PATHWAY // PERFORMANCE MATRIX
              </h2>
              <span className="text-[10px] text-[#777777]">DATA SET: 2026.07</span>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
              <div className="bg-[#060606] border border-[#222222] p-3">
                <div className="text-[10px] text-[#777777] uppercase">TRACKED PLAYERS</div>
                <div className="text-xl font-bold mt-1">1,482</div>
                <div className="text-[9px] text-[#e60000] mt-0.5">+14 THIS WEEK</div>
              </div>
              <div className="bg-[#060606] border border-[#222222] p-3">
                <div className="text-[10px] text-[#777777] uppercase">U23 CANADIAN MINS</div>
                <div className="text-xl font-bold mt-1">68.4%</div>
                <div className="text-[9px] text-[#777777] mt-0.5">CPL + NSL AVG</div>
              </div>
              <div className="bg-[#060606] border border-[#222222] p-3">
                <div className="text-[10px] text-[#777777] uppercase">EXPECTED GOALS (xG)</div>
                <div className="text-xl font-bold mt-1">1.82</div>
                <div className="text-[9px] text-[#777777] mt-0.5">LEAGUE MEDIAN</div>
              </div>
              <div className="bg-[#060606] border border-[#222222] p-3">
                <div className="text-[10px] text-[#777777] uppercase">PPDA INDEX</div>
                <div className="text-xl font-bold mt-1">9.4</div>
                <div className="text-[9px] text-[#e60000] mt-0.5">HIGH PRESS DENSITY</div>
              </div>
            </div>

            <p className="text-xs text-[#777777] leading-relaxed">
              Automated telemetry feeds integrating positional tracking, high-intensity sprint vectors, and build-up sequence metrics across Canadian Premier League, Northern Super League, and Canadian MLS academy systems.
            </p>
          </div>

          {/* Scouting Wire / Match Terminal Feed */}
          <div className="bg-[#0e0e0e] border border-[#222222] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-3">
              <h3 className="text-xs font-bold tracking-wider uppercase">RECENT SCOUTING LOGS</h3>
              <span className="text-[10px] text-[#e60000]">REAL-TIME UPDATE</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              {[
                { time: "14:20", league: "CPL", text: "Forge FC defensive transition index increased by 12% in final 20 minutes." },
                { time: "12:05", league: "NSL", text: "Ottawa Rapid FC press resistance metric benchmarked top 5% in domestic play." },
                { time: "09:45", league: "MLS", text: "Vancouver Whitecaps U19 product logs 82 mins with 91% pass completion." },
                { time: "YESTERDAY", league: "CANMNT", text: "Senior squad international tracking model updated ahead of upcoming CONCACAF fixtures." },
              ].map((log, idx) => (
                <div key={idx} className="flex gap-4 p-2.5 bg-[#060606] border border-[#222222] items-center">
                  <span className="text-[10px] text-[#777777] w-16 shrink-0">{log.time}</span>
                  <span className="text-[10px] text-[#e60000] font-bold border border-[#e60000]/30 px-1.5 py-0.5">{log.league}</span>
                  <span className="text-[#f4f4f4] text-[11px] truncate">{log.text}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Right Column: Prospect Radar & Target Monitoring (4 cols) */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* U23 Prospect Radar Panel */}
          <div className="bg-[#0e0e0e] border border-[#222222] p-5 flex flex-col gap-4">
            <div className="border-b border-[#222222] pb-3 flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-wider uppercase">U23 PROSPECT RADAR</h3>
              <span className="text-[10px] text-[#777777]">TOP MATCH RATING</span>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { name: "M. CHOINIÈRE (U23)", pos: "CM // CAN", team: "CPL PROSPECT", index: "88.4" },
                { name: "K. REID (U21)", pos: "CB // CAN", team: "NSL PROSPECT", index: "85.1" },
                { name: "E. ADEKUGBE (U20)", pos: "LB // CAN", team: "MLS ACADEMY", index: "83.9" },
                { name: "L. SWINKELS (U22)", pos: "ST // CAN", team: "PROVINCIAL HIGH-PERF", index: "81.2" }
              ].map((prospect, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-[#060606] border border-[#222222]">
                  <div>
                    <div className="text-xs font-bold">{prospect.name}</div>
                    <div className="text-[10px] text-[#777777] mt-0.5">{prospect.pos} — <span className="text-[#f4f4f4]">{prospect.team}</span></div>
                  </div>
                  <div className="text-sm font-extrabold text-[#e60000] bg-[#e60000]/10 px-2 py-1 border border-[#e60000]/30">
                    {prospect.index}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure & Query Terminal Card */}
          <div className="bg-[#0e0e0e] border border-[#222222] p-5 flex flex-col gap-3 text-xs">
            <div className="text-[10px] text-[#e60000] tracking-widest uppercase">DATABASE QUERY STATUS</div>
            <div className="text-xs text-[#777777]">PostgreSQL / Schema Validation: <span className="text-[#f4f4f4]">PASSED</span></div>
            <div className="text-xs text-[#777777]">OpenNext Worker Runtime: <span className="text-[#f4f4f4]">ACTIVE (ORD)</span></div>
            <div className="text-xs text-[#777777]">Cloudflare Edge Routing: <span className="text-[#f4f4f4]">HTTP/2 200</span></div>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-20 max-w-[1500px] w-full mx-auto flex flex-col sm:flex-row justify-between items-center border-t border-[#222222] pt-5 text-xs tracking-[0.1em] text-[#777777] gap-3">
        <div>THE MAPLE PITCH // CANADIAN SOCCER ANALYTICS & SCOUTING TERMINAL</div>
        <div>&copy; 2026 THE MAPLE PITCH</div>
      </footer>
    </div>
  );
}
