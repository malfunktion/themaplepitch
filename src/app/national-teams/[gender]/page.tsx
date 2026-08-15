// src/app/national-teams/[gender]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import { players } from '@/lib/data/demo';

const genders = ['men', 'women'];
export function generateStaticParams() {
  return genders.map((gender) => ({ gender }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gender: string }>;
}): Promise<Metadata> {
  const { gender } = await params;
  if (!genders.includes(gender)) return { title: 'National Team Not Found' };
  const label = gender === 'men' ? 'CanMNT' : 'CanWNT';
  const title = `${label} — National Team`;
  const description = `${label} command centre — roster depth, tactical blueprint and historical record for Canada's ${gender}'s national team on The Maple Pitch.`;
  return {
    title,
    description,
    alternates: { canonical: `/national-teams/${gender}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/national-teams/${gender}`,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function NationalGenderPage({
  params,
}: {
  params: Promise<{ gender: string }>;
}) {
  const { gender } = await params;
  if (!genders.includes(gender)) notFound();
  const label = gender === 'men' ? 'CANMNT' : 'CANWNT';
  const roster = players.filter((p) =>
    gender === 'women'
      ? p.clubId === 'vancouver-rise' || p.clubId === 'calgary-wild'
      : p.clubId !== 'vancouver-rise' && p.clubId !== 'calgary-wild'
  );
  return (
    <>
      <HubHeader
        eyebrow={`National team intelligence // ${gender}`}
        title={`${label} COMMAND CENTRE`}
        description="A focused national-team route. Age groups, roster depth, tactical blueprints, camps and historical records can now live as modules without forcing everything onto one page."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Roster', '/stats'],
          ['Depth chart', '#depth'],
          ['Tactical blueprint', '#tactical'],
          ['Historical record', '#history'],
        ].map(([x, h]) => (
          <Link
            key={x}
            href={h}
            className="border border-border p-5 font-black hover:border-crimson"
          >
            {x}
            <span className="float-right text-crimson">→</span>
          </Link>
        ))}
      </div>
      <section className="mt-6 border border-border p-5" id="depth">
        <div className="text-[10px] font-mono uppercase text-crimson">
          Illustrative roster pool
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {roster.map((p) => (
            <Link
              key={p.id}
              href={`/players/${p.slug}`}
              className="border border-border p-3 hover:border-crimson"
            >
              <b className="text-sm">{p.name}</b>
              <div className="text-[9px] font-mono text-charcoal-soft">
                {p.position} {'// '}
                {p.clubName}
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section id="tactical" className="mt-6 border border-border bg-card p-6">
        <div className="text-[10px] font-mono uppercase text-crimson">
          Tactical blueprint
        </div>
        <p className="mt-2 text-sm leading-7 text-charcoal-soft">
          The production module should connect formation, pressing intensity, field
          tilt, possession value and match-event evidence to individual match pages.
        </p>
      </section>
      <section id="history" className="mt-6 border border-border p-6">
        <div className="text-[10px] font-mono uppercase text-crimson">
          Historical record
        </div>
        <p className="mt-2 text-sm leading-7 text-charcoal-soft">
          Historical snapshots belong in versioned datasets so changes to player
          pools, coaches and tactical identities remain auditable.
        </p>
      </section>
    </>
  );
}
