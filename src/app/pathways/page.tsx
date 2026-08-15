// src/app/pathways/page.tsx

import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { pathwayEdges, pathwayNodes } from '@/lib/data/demo';

export default function Pathways() {
  return (
    <>
      <HubHeader
        eyebrow="Development intelligence"
        title="CANADIAN SOCCER PATHWAYS"
        description="Follow the movement between youth football, provincial leagues, universities, professional clubs and international destinations."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {pathwayNodes.map((n) => (
          <div key={n.id} className="border border-border p-5">
            <div className="text-[9px] font-mono uppercase text-crimson">
              {n.type} {'// '}
              {n.province}
            </div>
            <h2 className="mt-1 font-black">{n.label}</h2>
            <div className="mt-4 space-y-2 text-xs">
              {pathwayEdges
                .filter((e) => e.from === n.id || e.to === n.id)
                .map((e) => (
                  <div
                    key={`${e.from}-${e.to}`}
                    className="flex justify-between border-t border-border pt-2"
                  >
                    <span>
                      {e.from === n.id ? '→' : '←'}{' '}
                      {e.from === n.id ? e.to : e.from}
                    </span>
                    <b>{e.count}</b>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/canadian-soccer-map"
          className="border border-border p-4 font-black hover:border-crimson"
        >
          OPEN NATIONAL MAP →
        </Link>
        <Link
          href="/player-index"
          className="border border-border p-4 font-black hover:border-crimson"
        >
          OPEN PLAYER INDEX →
        </Link>
      </div>
      <div className="mt-6">
        <SourceStamp />
      </div>
    </>
  );
}
