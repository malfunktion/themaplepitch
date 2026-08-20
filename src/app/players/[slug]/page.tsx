// src/app/players/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data: players } = await supabase.from('players').select('id, external_id, slug');
  const params: { slug: string }[] = [];
  
  (players || []).forEach((p) => {
    if (p.slug) params.push({ slug: String(p.slug) });
    if (p.external_id && p.external_id !== p.slug) params.push({ slug: String(p.external_id) });
    if (p.id) params.push({ slug: String(p.id) });
  });

  return params;
}

function safeFormatDate(dateVal: any): string {
  if (!dateVal) return 'TBD';
  try {
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return 'TBD';
    return parsed.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'TBD';
  }
}

// Cached data fetcher to share execution between generateMetadata and PlayerProfilePage
const getPlayer = cache(async (slug: string) => {
  // Try looking up by slug first
  let { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!player) {
    // Try external_id
    const { data: extPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('external_id', slug)
      .single();
    player = extPlayer;
  }

  if (!player && !isNaN(Number(slug))) {
    // Try numeric id
    const { data: idPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('id', slug)
      .single();
    player = idPlayer;
  }

  return player;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayer(slug);

  if (!player) {
    return { title: 'Player Not Found — The Maple Pitch' };
  }

  const title = `${player.name} (${player.position || 'Player'}) — Player Dossier`;
  const description = `Comprehensive career statistics, club performance, and international squad records for ${player.name} on The Maple Pitch.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
    },
  };
}

export default async function PlayerProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const rawTab = resolvedSearchParams.tab?.toUpperCase();

  const player = await getPlayer(slug);

  if (!player) {
    notFound();
  }

  const isNationalDefault = rawTab === 'NATIONAL' || rawTab === 'CANMNT' || rawTab === 'CANWNT';
  const activeTab = isNationalDefault ? 'national' : 'club';
  const playerSlug = player.slug || player.external_id || player.id;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HubHeader 
          title={player.name} 
          subtitle={`PLAYER DOSSIER // ${player.position || 'ATHLETE'}`} 
          tag={player.nationality || 'Canada'} 
        />

        {/* Interactive Context Switcher Bar */}
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
          <Link
            href={`/players/${playerSlug}`}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === 'club'
                ? 'bg-crimson text-white font-bold'
                : 'bg-card text-neutral-400 hover:text-white border border-border'
            }`}
          >
            [ CLUB DOSSIER ]
          </Link>
          <Link
            href={`/players/${playerSlug}?tab=national`}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === 'national'
                ? 'bg-crimson text-white font-bold'
                : 'bg-card text-neutral-400 hover:text-white border border-border'
            }`}
          >
            [ INTERNATIONAL / SQUAD STATS ]
          </Link>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 flex flex-col gap-6">
            <div className="border border-border bg-card p-6 rounded-sm">
              <h2 className="text-sm font-mono font-bold text-crimson uppercase mb-4">
                {activeTab === 'national' ? 'INTERNATIONAL PERFORMANCE & CAPS' : 'DOMESTIC CLUB PERFORMANCE'}
              </h2>
              <p className="text-sm font-mono text-neutral-300">
                {activeTab === 'national'
                  ? `Viewing senior international squad metrics and tournament appearances for ${player.name}.`
                  : `Viewing current club fixtures, season stats, and performance ratings for ${player.name} at ${player.club || 'Unattached'}.`}
              </p>
            </div>
          </main>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="border border-border bg-card p-6 rounded-sm">
              <h3 className="text-xs font-mono font-bold uppercase text-neutral-400 mb-4">
                ATHLETE METRICS
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span>Database ID</span>
                  <span className="font-mono text-charcoal dark:text-neutral-200">{player.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Slug Target</span>
                  <span className="font-mono text-charcoal dark:text-neutral-200">{playerSlug}</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary Position</span>
                  <span className="font-mono uppercase text-charcoal dark:text-neutral-200">{player.position || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Context</span>
                  <span className="font-mono uppercase text-crimson font-bold">{activeTab}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6">
          <SourceStamp source={{ name: 'The Maple Pitch Unified Player Vault', accessedAt: new Date().toISOString() }} />
        </div>
      </div>
    </>
  );
}
