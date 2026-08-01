export default function Home() {
  return (
    <div className="min-h-screen bg-[#060606] text-[#f4f4f4] font-mono p-8 relative flex flex-col justify-between gap-10 overflow-x-hidden">
      {/* Technical Grid Background Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Header */}
      <header className="relative z-20 max-w-[1400px] w-full mx-auto flex justify-between items-center border-b border-[#222222] pb-5 text-xs tracking-[0.15em] uppercase text-[#777777]">
        <div className="text-[#f4f4f4] font-bold flex items-center gap-3">
          <span className="w-[7px] h-[7px] bg-[#e60000] rounded-full shadow-[0_0_10px_#e60000]"></span>
          THE MAPLE PITCH // LIVE WIRE
        </div>
        <div>CANADIAN SOCCER ANALYTICS</div>
      </header>

      {/* Main Content Grid */}
      <main className="relative z-20 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        <div className="w-full border border-[#222222] bg-[#0e0e0e] p-2">
          <img 
            src="/index.jpg" 
            alt="The Maple Pitch Live Wire Graphic" 
            className="w-full h-auto block contrast-[1.05]"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="text-xs text-[#e60000] tracking-[0.25em] uppercase">SYSTEM ACTIVE // DATA FEED 2937</div>
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-none tracking-tight uppercase">
            Visualising The <span className="text-[#e60000]">Game</span>
          </h1>
          <p className="text-[#777777] text-sm leading-relaxed max-w-[480px]">
            Advanced tactical tracking, performance feeds, and structural analytics covering professional, provincial, and national Canadian soccer pathways.
          </p>
          <div className="mt-2">
            <a 
              href="mailto:info@themaplepitch.ca" 
              className="text-[#f4f4f4] no-underline text-sm tracking-wide border-b border-[#e60000] pb-1 hover:text-[#e60000] transition-colors"
            >
              info@themaplepitch.ca
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row justify-between items-center border-t border-[#222222] pt-6 text-xs tracking-[0.1em] text-[#777777] gap-4">
        <div>TRACKING // ANALYSING // OPTIMISING</div>
        <div>&copy; 2026 THE MAPLE PITCH</div>
      </footer>
    </div>
  );
}
