// src/app/competitions/[slug]/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { competitions, getCompetition, teams, matches } from '@/lib/data/demo';

export function generateStaticParams() {
  return competitions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompetition(slug);
  if (!c) return { title: 'Competition Not Found' };
  const title = c.name;
  const description = `${c.name} — ${c.season} season, ${c.gender}. Standings, fixtures and team pages on The Maple Pitch.`;
  return {
    title,
    description,
    alternates: { canonical: `/competitions/${c.slug}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/competitions/${c.slug}`,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CompetitionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCompetition(slug);
  if (!c) notFound();
  const ts = teams.filter((t) => t.competitionId === c.id),
    ms = matches.filter((m) => m.competitionId === c.id);
  return (
    <>
      <HubHeader
        eyebrow={`Competition dossier // ${c.level}`}
        title={c.name.toUpperCase()}
        description={`${c.season} · ${c.gender}. Competition pages are the connective tissue between standings, teams, fixtures, player production and Wire coverage.`}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-border p-5">
          <div className="text-[10px] font-mono uppercase text-crimson">Teams</div>
          <div className="mt-4 space-y-2">
            {ts.map((t) => (
              <Link
                key={t.id}
                href={`/teams/${t.slug}`}
                className="flex justify-between border border-border p-3 text-sm hover:border-crimson"
              >
                <span className="font-bold">{t.name}</span>
                <span className="font-mono">{t.points} PTS</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="border border-border p-5">
          <div className="text-[10px] font-mono uppercase text-crimson">
            Fixtures
          </div>
          <div className="mt-4 space-y-2">
            {ms.map((m) => (
              <Link
                key={m.id}
                href={`/matches/${m.id}`}
                className="block border border-border p-3 text-xs hover:border-crimson"
              >
                <div>
                  {m.homeTeamName} — {m.awayTeamName}
                </div>
                <div className="mt-1 font-mono text-charcoal-soft">
                  {m.date} {'// '}
                  {m.status}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-6">
        <SourceStamp source={c.source} />
      </div>
    </>
  );
}
