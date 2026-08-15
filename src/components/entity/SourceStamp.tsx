import { DATASET, formatUpdatedAt } from '@/lib/dataStatus';
import type { SourceAttribution } from '@/lib/models';

export default function SourceStamp({ source }: { source?: SourceAttribution }) {
  const active = source ?? { name: DATASET.source, accessedAt: DATASET.updatedAt };
  return <div className="border-t border-border pt-2 text-[9px] font-mono uppercase tracking-wider text-charcoal-soft">SOURCE // {active.name} · UPDATED // {formatUpdatedAt(active.accessedAt)} · STATUS // {DATASET.mode}</div>;
}
