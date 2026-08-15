import type { Metadata } from 'next';
import {notFound} from 'next/navigation'; import HubHeader from '@/components/entity/HubHeader'; import Link from 'next/link'; import {competitions,teams} from '@/lib/data/demo';
const allowed=['ON','QC','BC','AB']; export function generateStaticParams(){return allowed.map(province=>({province}))}
const provinceNames: {[k:string]:string} = {ON:'Ontario',QC:'Québec',BC:'British Columbia',AB:'Alberta'};

export async function generateMetadata({ params }: { params: Promise<{ province: string }> }): Promise<Metadata> {
  const { province } = await params;
  if (!allowed.includes(province)) return { title: 'Province Not Found' };

  const name = provinceNames[province];
  const title = `${name} Soccer`;
  const description = `${name} soccer — provincial competitions, clubs, and the pathway from grassroots to the professional pyramid, on The Maple Pitch.`;

  return {
    title,
    description,
    alternates: { canonical: `/provincial-leagues/${province}` },
    openGraph: { type: 'website', title, description, url: `/provincial-leagues/${province}` },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ProvincePage({params}:{params:Promise<{province:string}>}){const {province}=await params;if(!allowed.includes(province))notFound();const names:{[k:string]:string}={ON:'Ontario',QC:'Québec',BC:'British Columbia',AB:'Alberta'};const comps=competitions.filter(c=>c.level==='provincial'&&(province==='ON'?c.slug==='league1-ontario':province==='BC'?c.slug==='league1-bc':false));const clubs=teams.filter(t=>t.province===province);return <><HubHeader eyebrow={`Provincial pyramid // ${province}`} title={`${names[province].toUpperCase()} SOCCER`} description="Province-level navigation separates competitions from clubs so the pyramid can grow without redesigning the information architecture."/><div className="grid gap-4 md:grid-cols-2">{comps.map(c=><Link key={c.id} href={`/competitions/${c.slug}`} className="border border-border p-5 hover:border-crimson"><div className="text-[9px] font-mono uppercase text-crimson">Competition</div><h2 className="mt-1 text-xl font-black">{c.name}</h2></Link>)}{clubs.map(t=><Link key={t.id} href={`/teams/${t.slug}`} className="border border-border p-5 hover:border-crimson"><div className="text-[9px] font-mono uppercase text-crimson">Club // {t.city}</div><h2 className="mt-1 text-xl font-black">{t.name}</h2></Link>)}</div></>}
