// src/app/national-teams/[gender]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import DepthChart from '@/components/national-teams/DepthChart';
import TacticalBlueprint from '@/components/national-teams/TacticalBlueprint';
import CoachingStaff from '@/components/national-teams/CoachingStaff';
import HistoricalRecords from '@/components/national-teams/HistoricalRecords';
import { supabase } from '@/lib/supabase/client';
import type { Player } from '@/lib/types';

// Extended type interface to satisfy TypeScript checks for squad assets
interface SquadPlayer extends Player {
  number?: number;
  caps?: number;
  clubName?: string;
  club?: string;
}

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
  const title = `${label} — National Team Dossier`;
  const description = `${label} command centre — roster depth, tactical blueprint and historical records for Canada's ${gender}'s national team on The Maple Pitch.`;
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

function slugify(text: string) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default async function NationalGenderPage({
  params,
}: {
  params: Promise<{ gender: string }>;
}) {
  const { gender } = await params;
  if (!genders.includes(gender)) notFound();

  const isWomen = gender === 'women';
  const label = isWomen ? 'CANWNT' : 'CANMNT';
  const activeGenderUpper = isWomen ? 'WOMEN' : 'MEN';

  const { data: nationalTeam } = await supabase
    .from('teams')
    .select('id')
    .eq('external_id', isWomen ? 'nat-canwnt' : 'nat-canmnt')
    .maybeSingle();

  const { data: rosterData } = nationalTeam
    ? await supabase
        .from('players')
        .select('id, external_id, slug, name, position, goals, assists, current_team_id')
        .eq('current_team_id', nationalTeam.id)
        .order('name')
    : { data: [] };

  const roster: SquadPlayer[] = (rosterData || []) as SquadPlayer[];

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 flex flex-col gap-6 text-charcoal dark:text-white">
      {/* HUB HEADER */}
      <HubHeader
        eyebrow={`NATIONAL TEAM DOSSIER // ${activeGenderUpper}`}
        title={`${label} COMMAND CENTRE`}
        description={`Dedicated national squad hub for Canada's ${gender}'s program. Complete roster depth, tactical blueprints, EXCEL pathways, and historical records.`}
      />

      {/* QUICK NAV MODULE TABS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        {[
          ['Roster Pool', '#roster'],
          ['Depth Chart', '#depth'],
          ['Tactical Blueprint', '#tactical'],
          ['Historical Records', '#history'],
        ].map(([x, h]) => (
          <a
            key={x}
            href={h}
            className="bg-card border border-border p-4 font-bold flex justify-between items-center rounded-sm hover:border-crimson transition-colors group"
          >
            <span>{x}</span>
            <span className="text-crimson group-hover:translate-x-1 transition-transform">➔</span>
          </a>
        ))}
      </div>

      {/* ROSTER TABLE MODULE */}
      <section id="roster" className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal dark:text-white">
            {label} // SQUAD ROSTER POOL
          </span>
          <span className="text-[10px] font-mono text-crimson font-bold">
            [ SQUAD SIZE: {roster.length} PLAYERS ]
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] text-charcoal-soft dark:text-neutral-400 uppercase">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-3">Player Asset</th>
                <th className="py-2.5 px-3">Pos</th>
                <th className="py-2.5 px-3">Club</th>
                <th className="py-2.5 px-3 text-right">Caps</th>
                <th className="py-2.5 px-3 text-right">G / A</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {roster.map((p: SquadPlayer, idx: number) => {
                const playerSlug = p.slug || slugify(p.name);
                const tabType = label; // CANMNT or CANWNT

                return (
                  <tr
                    key={p.id || idx}
                    className="hover:bg-surface/50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-2 font-mono text-xs text-charcoal-soft dark:text-neutral-500">
                      {p.number ?? idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-charcoal dark:text-white hover:text-crimson transition-colors">
                      <Link href={`/players/${playerSlug}?tab=${tabType}`} className="flex items-center gap-1">
                        <span>{p.name}</span>
                        <span className="text-crimson text-[10px]">➔</span>
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 text-xs font-mono text-crimson font-bold">{p.position}</td>
                    <td className="py-2.5 px-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      {p.clubName || p.club || 'Unattached'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-xs font-mono text-neutral-600 dark:text-neutral-300">
                      {p.caps ?? 0}
                    </td>
                    <td className="py-2.5 px-3 text-right text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      {p.goals ?? 0} / {p.assists ?? 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* DEPTH CHART */}
      <section id="depth" className="scroll-mt-4">
        <DepthChart activeGender={activeGenderUpper} />
      </section>

      {/* TACTICAL BLUEPRINT */}
      <section id="tactical" className="scroll-mt-4">
        <TacticalBlueprint />
      </section>

      {/* COACHING STAFF */}
      <section id="coaching" className="scroll-mt-4">
        <CoachingStaff activeGender={activeGenderUpper} />
      </section>

      {/* HISTORICAL RECORDS */}
      <section id="history" className="scroll-mt-4">
        <HistoricalRecords activeGender={activeGenderUpper} />
      </section>
    </div>
  );
}
