import { competitions, getCompetition, getMatch, getPlayer, getTeam, matches, players, teams, wireItems, pathwayEdges, pathwayNodes } from '@/lib/data/demo';
import type { Competition, Match, Player, Team, WireItem } from '@/lib/models';

export const entityStore = {
  players,
  teams,
  competitions,
  matches,
  wireItems,
  pathwayNodes,
  pathwayEdges,
  getPlayer,
  getTeam,
  getMatch,
  getCompetition,
};

export async function listPlayers(filters?: { competitionId?: string; position?: string; province?: string }) : Promise<Player[]> {
  return players.filter(p => (!filters?.competitionId || teams.find(t => t.id === p.clubId)?.competitionId === filters.competitionId) && (!filters?.position || p.position === filters.position) && (!filters?.province || p.province === filters.province));
}
export async function listTeams(competitionId?: string): Promise<Team[]> { return teams.filter(t => !competitionId || t.competitionId === competitionId); }
export async function listMatches(competitionId?: string): Promise<Match[]> { return matches.filter(m => !competitionId || m.competitionId === competitionId); }
export async function listWire(): Promise<WireItem[]> { return [...wireItems].sort((a,b) => b.timestamp.localeCompare(a.timestamp)); }
export async function listCompetitions(): Promise<Competition[]> { return competitions; }
