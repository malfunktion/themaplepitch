export default function DataStatus({ demo = true }: { demo?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono uppercase tracking-wider text-charcoal-soft">
      <span className="inline-flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${demo ? 'bg-amber-500' : 'bg-emerald-500 animate-live-pulse'}`} />
        DATA {demo ? 'DEMO' : 'LIVE'}
      </span>
      <span>REFRESH // ON SOURCE UPDATE</span>
      <span>SOURCE // THE MAPLE PITCH</span>
    </div>
  );
}
