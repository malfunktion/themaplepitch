import type { Metadata } from 'next';
import {notFound} from 'next/navigation'; import Link from 'next/link'; import HubHeader from '@/components/entity/HubHeader'; import SourceStamp from '@/components/entity/SourceStamp'; import {getPlayer,players} from '@/lib/data/demo';
export function generateStaticParams(){return players.map(p=>({player:p.slug}))}

export async function generateMetadata({ params }: { params: Promise<{ player: string }> }): Promise<Metadata> {
  const { player } = await params;
  const p = getPlayer(player);
  if (!p) return { title: 'Player Not Found' };

  const title = `${p.name} — Scout Terminal`;
  const description = `${p.name} scout terminal — role telemetry index and demonstration performance metrics on The Maple Pitch.`;

  return {
    title,
    description,
    alternates: { canonical: `/scout-terminal/${p.slug}` },
    openGraph: { type: 'profile', title, description, url: `/scout-terminal/${p.slug}` },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ScoutProfile({params}:{params:Promise<{player:string}>}){const {player}=await params;const p=getPlayer(player);if(!p)notFound();return <><HubHeader eyebrow="Scout terminal // Demo" title={p.name.toUpperCase()} description="A player/prospect interface built around transparent metrics. Demonstration telemetry is not biometric data and must not be presented as verified scouting information."/><div className="grid gap-6 lg:grid-cols-3"><section className="lg:col-span-2 space-y-4"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['INDEX',p.rating],['MIN',p.minutes],['xG',p.xG.toFixed(2)],['xA',p.xA.toFixed(2)]].map(([k,v])=><div key={String(k)} className="border border-border bg-card p-4"><div className="text-[9px] font-mono text-charcoal-soft">{k}</div><div className="mt-2 text-2xl font-black">{v}</div></div>)}</div><div className="border border-border p-5"><div className="text-[10px] font-mono uppercase text-crimson">Role telemetry // demonstration</div><div className="mt-4 grid gap-3 sm:grid-cols-3">{[['Progression','82'],['Chance creation','76'],['Pressing','79'],['Box entries','71'],['Ball retention','84'],['Aerials','63']].map(([k,v])=><div key={k} className="border border-border p-3"><div className="flex justify-between text-[9px] font-mono"><span>{k}</span><b>{v}</b></div><div className="mt-2 h-1 bg-border"><div className="h-1 bg-crimson" style={{width:`${v}%`}}/></div></div>)}</div></div></section><aside className="border border-border p-5"><div className="text-[10px] font-mono uppercase text-crimson">Scout actions</div><div className="mt-4 space-y-2"><Link href={`/players/${p.slug}`} className="block border border-border p-3 text-xs font-black hover:border-crimson">OPEN PLAYER ENTITY →</Link><button className="w-full border border-border p-3 text-left text-xs font-black hover:border-crimson">EXPORT DEMO REPORT</button></div><p className="mt-5 text-[10px] leading-5 text-charcoal-soft">Production reports require authenticated access, source attribution, audit logging and role-based permissions.</p></aside></div><div className="mt-6"><SourceStamp source={p.source}/></div></>}
