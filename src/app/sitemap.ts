import type { MetadataRoute } from 'next';
import { listCompetitions, listMatches, listPlayers, listTeams } from '@/lib/services/entities';

// Sourced from the services layer (src/lib/services/entities.ts), not the
// demo dataset directly. When that layer starts reading from Supabase
// instead of src/lib/data/demo.ts, this file needs no changes — new
// players, teams, matches and competitions will be discoverable
// automatically. Do not import @/lib/data/demo here.

const BASE_URL = 'https://themaplepitch.ca';

const FIXED_PATHS = [
  '',
  '/the-wire',
  '/pro-leagues',
  '/provincial-leagues',
  '/national-teams',
  '/stats',
  '/scout-terminal',
  '/about',
  '/methodology',
  '/players',
  '/teams',
  '/matches',
  '/competitions',
  '/search',
  '/player-index',
  '/canadian-soccer-map',
  '/pathways',
  '/players-abroad',
  '/tactical-library',
  '/transfer-wire',
  '/state-of-canadian-soccer',
  '/match-centre',
  '/fan-hub',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [players, teams, matches, competitions] = await Promise.all([
    listPlayers(),
    listTeams(),
    listMatches(),
    listCompetitions(),
  ]);

  const fixed: MetadataRoute.Sitemap = FIXED_PATHS.map((path) => ({
    url: BASE_URL + path,
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const playerRoutes: MetadataRoute.Sitemap = players.map((p) => ({
    url: `${BASE_URL}/players/${p.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const teamRoutes: MetadataRoute.Sitemap = teams.map((t) => ({
    url: `${BASE_URL}/teams/${t.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const matchRoutes: MetadataRoute.Sitemap = matches.map((m) => ({
    url: `${BASE_URL}/matches/${m.id}`,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const competitionRoutes: MetadataRoute.Sitemap = competitions.map((c) => ({
    url: `${BASE_URL}/competitions/${c.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...fixed, ...playerRoutes, ...teamRoutes, ...matchRoutes, ...competitionRoutes];
}
