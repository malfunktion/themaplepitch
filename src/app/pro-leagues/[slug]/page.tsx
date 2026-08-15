import type { Metadata } from 'next';
import {notFound} from 'next/navigation'; import Link from 'next/link'; import HubHeader from '@/components/entity/HubHeader'; import {getCompetition,competitions,teams,matches} from '@/lib/data/demo';
export function generateStaticParams(){return competitions.filter(c=>c.level==='professional').map(c=>({slug:c.slug}))}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompetition(slug);
  if (!c || c.level !== 'professional') return { title: 'League Not Found' };

  const title = c.name;
  const description = `${c.name} — professional league coverage: standings, clubs and match centre on The Maple Pitch.`;

  return {
    title,
    description,
    alternates: { canonical: `/pro-leagues/${c.slug}` },
    openGraph: { type: 'website', title, description, url: `/pro-leagues/${c.slug}` },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ProLeaguePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=getCompetition(slug);if(!c||c.level!=='professional')notFound();const ts=teams.filter(t=>t.competitionId===c.id);const ms=matches.filter(m=>m.competitionId===c.id);return <><HubHeader eyebrow="Professional league command" title={c.name.toUpperCase()} description="Competition-first presentation: standings, clubs and match centre are separate entities but connected through canonical links."/><div className="grid gap-6 lg:grid-cols-3"><section className="lg:col-span-2 border border-border p-5"><div className="text-[10px] font-mono uppercase text-crimson">Competition table</div><div className="mt-4 divide-y divide-border">{[...ts].sort((a,b)=>b.points-a.points).map((t,i)=><Link key={t.id} href={`/teams/${t.slug}`} className="grid grid-cols-[32px_1fr_repeat(2,60px)] gap-2 py-3 text-xs hover:text-crimson"><span>{i+1}</span><b>{t.name}</b><span>{t.played} P</span><span>{t.points} PTS</span></Link>)}</div></section><aside className="border border-border p-5"><div className="text-[10px] font-mono uppercase text-crimson">Upcoming</div><div className="mt-4 space-y-2">{ms.map(m=><Link key={m.id} href={`/matches/${m.id}`} className="block border border-border p-3 text-xs hover:border-crimson">{m.homeTeamName} vs {m.awayTeamName}<div className="mt-1 font-mono text-[9px] text-charcoal-soft">{m.date}</div></Link>)}</div></aside></div></>}
