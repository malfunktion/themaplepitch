import type { Metadata } from 'next';
import Link from 'next/link'; import {notFound} from 'next/navigation'; import HubHeader from '@/components/entity/HubHeader'; import SourceStamp from '@/components/entity/SourceStamp'; import {getMatch, matches} from '@/lib/data/demo';
export function generateStaticParams(){return matches.map(m=>({id:m.id}))}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const m = getMatch(id);
  if (!m) return { title: 'Match Not Found' };

  const title = `${m.homeTeamName} vs ${m.awayTeamName}`;
  const description = `${m.homeTeamName} vs ${m.awayTeamName} — ${m.competitionName}, ${m.date} at ${m.venue}, ${m.city}.`;

  return {
    title,
    description,
    alternates: { canonical: `/matches/${m.id}` },
    openGraph: { type: 'website', title, description, url: `/matches/${m.id}` },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function MatchPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const m=getMatch(id);if(!m)notFound();return <><HubHeader eyebrow={`Match dossier // ${m.competitionName}`} title={`${m.homeTeamName} VS ${m.awayTeamName}`} description={`${m.date} · ${m.venue}, ${m.city}. The match entity is the future home for event data, lineups, tactical maps, xG, shot maps and post-match analysis.`}/><div className="grid gap-6 lg:grid-cols-3"><section className="lg:col-span-2 border border-border bg-card p-6 text-center"><div className="text-[10px] font-mono uppercase text-crimson">{m.status}</div><div className="mt-6 grid grid-cols-3 items-center"><Link href={`/teams/${m.homeTeamId}`} className="text-lg font-black hover:text-crimson">{m.homeTeamName}</Link><div className="text-4xl font-black">{m.status==='final'?`${m.homeScore}—${m.awayScore}`:'— —'}</div><Link href={`/teams/${m.awayTeamId}`} className="text-lg font-black hover:text-crimson">{m.awayTeamName}</Link></div><div className="mt-8 border-t border-border pt-5 text-xs text-charcoal-soft">EVENT FEED // READY FOR VERIFIED MATCH DATA</div></section><aside className="border border-border p-5"><div className="text-[10px] font-mono uppercase text-crimson">Match modules</div><ul className="mt-4 space-y-2 text-xs">{['Lineups','Shot map','xG timeline','Pass network','Pressing map','Tactical notes'].map(x=><li key={x} className="border border-border p-3">{x}<span className="float-right text-[9px] font-mono text-charcoal-soft">PENDING</span></li>)}</ul></aside></div><div className="mt-6"><SourceStamp source={m.source}/></div></>}
