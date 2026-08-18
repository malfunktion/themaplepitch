import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { wireItems } from '@/lib/data/demo';

function safeFormatDate(dateVal: any): string {
  if (!dateVal) return 'TBD';
  try {
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return 'TBD';
    return parsed.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'TBD';
  }
}

export default function TacticalLibrary() {
  const items = (wireItems || []).filter((x: any) => x?.category === 'tactical');

  return (
    <>
      <HubHeader
        eyebrow="Analysis // Tactics"
        title="TACTICAL LIBRARY"
        description="A durable archive for tactical explanations, match models and visual analysis. Every article should eventually cite its match and data sources."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((x: any) => (
          <article key={x.id} className="border border-border p-5 bg-card">
            <div className="text-[9px] font-mono uppercase text-crimson">
              TACTICAL NOTE // {safeFormatDate(x.timestamp)}
            </div>
            <h2 className="mt-2 text-xl font-black">{x.headline}</h2>
            <p className="mt-2 text-sm leading-6 text-charcoal-soft">{x.dek}</p>
            <div className="mt-5 text-[9px] font-mono uppercase text-charcoal-soft">
              Source // {x.source?.name || 'The Maple Pitch Vault'}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6">
        <SourceStamp />
      </div>
    </>
  );
}
