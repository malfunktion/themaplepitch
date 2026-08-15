// src/app/teams/[slug]/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { getTeam, teams, players, matches } from '@/lib/data/demo';

export function generateStaticParams() {
  return teams.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTeam(slug);
  if (!t) return { title: 'Team Not Found' };
  const title = t.name;
  const description = `${t.name} — ${t.city}, ${t.province} · ${t.competitionName}. Standings, roster, form and match centre on The Maple Pitch.`;
  return {
    title,
    description,
    alternates: { canonical: `/teams/${t.slug}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/teams/${t.slug}`,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function TeamProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getTeam(slug);
  if (!t) notFound();
  const roster = players.filter((p) => p.clubId === t.id);
  const games = matches.filter(
    (m) => m.homeTeamId === t.id || m.awayTeamId === t.id
  );
  return (
    <>
      <HubHeader
        eyebrow={`Team dossier // ${t.competitionName}`}
        title={t.name.toUpperCase()}
        description={`${t.city}, ${t.province} · ${t.gender} · ${t.competitionName}. One team entity feeds standings, match centre, player and tactical views.`}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['PTS', t.points],
              ['W', t.wins],
              ['GF', t.goalsFor],
              ['GA', t.goalsAgainst],
            ].map(([k, v]) => (
              <div key={String(k)} className="border border-border bg-card p-4">
                <div className="text-[9px] font-mono text-charcoal-soft">{k}</div>
                <div className="mt-2 text-3xl font-black">{v}</div>
              </div>
            ))}
          </div>
          <div className="border border-border p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">
              Recent & upcoming
            </div>
            <div className="mt-3 divide-y divide-border">
              {games.map((m) => (
                <Link
                  key={m.id}
                  href={`/matches/${m.id}`}
                  className="flex items-center justify-between py-3 text-xs hover:text-crimson"
                >
                  <span>{m.date}</span>
                  <span>
                    {m.homeTeamName} {m.status === 'final' ? m.homeScore : '—'}–
                    {m.status === 'final' ? m.awayScore : '—'} {m.awayTeamName}
                  </span>
                  <span className="font-mono uppercase">{m.status}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="border border-border p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">
              Roster entities
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {roster.map((p) => (
                <Link
                  key={p.id}
                  href={`/players/${p.slug}`}
                  className="border border-border p-3 hover:border-crimson"
                >
                  <div className="text-xs font-black">{p.name}</div>
                  <div className="text-[9px] font-mono text-charcoal-soft">
                    {p.position} {'// INDEX '}
                    {p.rating}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <aside>
          <div className="border border-border bg-card p-5">
            <div className="text-[10px] font-mono uppercase text-crimson">
              Form
            </div>
            <div className="mt-4 flex gap-1">
              {t.form.map((f, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center border border-border text-xs font-black"
                >
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-6 text-xs text-charcoal-soft">
              Founded {t.founded ?? '—'} · {t.city}, {t.province}
            </div>
          </div>
        </aside>
      </div>
      <div className="mt-6">
        <SourceStamp source={t.source} />
      </div>
    </>
  );
                    }
