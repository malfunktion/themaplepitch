export default function UpcomingFixtureWidget() {
  return (
    <div className="border border-neutral-800 bg-white p-4">
      <div className="flex justify-between items-center mb-4 border-b border-neutral-200 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-black">Next Match</h3>
        <span className="text-[10px] font-bold text-red-600 tracking-wider">CPL</span>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 text-center">
          <span className="block font-bold text-sm text-black">FORGE FC</span>
        </div>
        <div className="px-2">
          <span className="text-[10px] font-mono text-neutral-400">VS</span>
        </div>
        <div className="flex-1 text-center">
          <span className="block font-bold text-sm text-black">PACIFIC FC</span>
        </div>
      </div>
      
      <div className="text-center text-[10px] text-neutral-500 font-mono mb-4">
        SAT, AUG 15 // 7:00 PM EST
      </div>
      
      <a 
        href="#" 
        className="block w-full text-center bg-transparent border border-red-600 text-red-600 py-2 text-[10px] font-bold tracking-widest hover:bg-red-600 hover:text-white transition-colors"
      >
        [ TICKETS ]
      </a>
    </div>
  );
}
