import DataStatus from '@/components/layout/DataStatus';

export default function HubHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="mb-6 border-b border-border pb-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-crimson">{eyebrow}</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-charcoal-soft">{description}</p></div><DataStatus /></div></section>;
}
