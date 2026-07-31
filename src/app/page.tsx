export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-16 flex flex-col justify-between max-w-7xl mx-auto border-x border-neutral-900">
      <header className="flex justify-between items-center border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-red-600 font-mono font-semibold">Terminal v0.1</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-100">THE MAPLE PITCH</h1>
        </div>
        <div className="text-right font-mono text-xs text-neutral-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          SYSTEM ONLINE
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-neutral-500">01 / DOMESTIC</span>
            <h2 className="text-lg font-semibold mt-2 text-neutral-200">CPL & NSL Leagues</h2>
            <p className="text-sm text-neutral-400 mt-2">Live fixtures, standings, and data telemetry for Canadian professional leagues.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-800/60 text-xs text-red-500 font-mono">STATUS: ACTIVE</div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-neutral-500">02 / GLOBAL</span>
            <h2 className="text-lg font-semibold mt-2 text-neutral-200">MLS & Diaspora</h2>
            <p className="text-sm text-neutral-400 mt-2">Tracking Canadian talent competing across Major League Soccer and international circuits.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-800/60 text-xs text-red-500 font-mono">STATUS: SYNCING</div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-neutral-500">03 / NATIONAL</span>
            <h2 className="text-lg font-semibold mt-2 text-neutral-200">National Squads</h2>
            <p className="text-sm text-neutral-400 mt-2">Comprehensive roster analytics and match pipelines for Men's and Women's national programs.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-800/60 text-xs text-red-500 font-mono">STATUS: STANDBY</div>
        </div>
      </section>

      <footer className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row justify-between text-xs text-neutral-400 font-mono">
        <p>© 2026 THE MAPLE PITCH. ALL RIGHTS RESERVED.</p>
        <p className="mt-2 md:mt-0 text-neutral-300">SCANDINAVIAN MINIMALIST TELEMETRY</p>
      </footer>
    </main>
  );
}
