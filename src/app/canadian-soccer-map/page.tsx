// src/app/canadian-soccer-map/page.tsx

import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import Image from 'next/image';
import { pathwayNodes, pathwayEdges } from '@/lib/data/demo';

export default function MapPage() {
  return (
    <>
      <HubHeader
        eyebrow="Geography // Pathway"
        title="CANADIAN SOCCER MAP"
        description="A national view of development corridors. The production version should become an interactive map; this first pass makes the underlying geography and pathway model explicit."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 border border-border bg-card p-5">
          <div className="relative mx-auto h-[520px] w-full">
            <Image
              src="/CanadaMap.svg"
              alt="Canada map used as the geographic base for The Maple Pitch pathway model"
              fill
              unoptimized
              className="object-contain opacity-80"
            />
          </div>
          <div className="mt-4 text-center text-[9px] font-mono uppercase tracking-wider text-charcoal-soft">
            {'MAP LAYER // DEMONSTRATION // PROVINCE-LEVEL DATA MODEL READY'}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="border border-border p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">
              Development nodes
            </div>
            <div className="mt-3 space-y-2">
              {pathwayNodes.map((n) => (
                <div key={n.id} className="border border-border p-3">
                  <div className="text-xs font-bold">{n.label}</div>
                  <div className="text-[9px] font-mono text-charcoal-soft">
                    {n.province} {'// '}
                    {n.level}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">
              Movement edges
            </div>
            <div className="mt-3 space-y-2">
              {pathwayEdges.map((e) => (
                <div key={`${e.from}-${e.to}`} className="flex justify-between text-xs">
                  <span>
                    {e.from} → {e.to}
                  </span>
                  <b>{e.count}</b>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <div className="mt-6">
        <SourceStamp />
      </div>
    </>
  );
}
