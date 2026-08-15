import type { Competition, Match, PathwayEdge, PathwayNode, Player, Team, WireItem } from '@/lib/models';
import { DATASET } from '@/lib/dataStatus';

// TODO: replace with real ingest timestamp once the RSS/Supabase pipeline is live.
const source = (name = 'The Maple Pitch demonstration dataset') => ({
  name,
  accessedAt: DATASET.updatedAt,
  note: 'Demonstration data. Replace with verified provider data before publication.',
});

export const competitions: Competition[] = [
  { id: 'cpl-2026', slug: 'cpl', name: 'Canadian Premier League', shortName: 'CPL', level: 'professional', gender: 'men', country: 'Canada', status: 'demo', season: '2026', source: source() },
  { id: 'nsl-2026', slug: 'nsl', name: 'Northern Super League', shortName: 'NSL', level: 'professional', gender: 'women', country: 'Canada', status: 'demo', season: '2026', source: source() },
  { id: 'l1o-2026', slug: 'league1-ontario', name: 'League1 Ontario', shortName: 'L1O', level: 'provincial', gender: 'mixed', country: 'Canada', status: 'demo', season: '2026', source: source() },
  { id: 'l1bc-2026', slug: 'league1-bc', name: 'League1 BC', shortName: 'L1BC', level: 'provincial', gender: 'mixed', country: 'Canada', status: 'demo', season: '2026', source: source() },
];

export const teams: Team[] = [
  { id:'forge', slug:'forge-fc', name:'Forge FC', shortName:'Forge', competitionId:'cpl-2026', competitionName:'Canadian Premier League', city:'Hamilton', province:'ON', gender:'men', founded:2017, status:'demo', form:['W','W','D','W','L'], played:5, wins:3, draws:1, losses:1, goalsFor:9, goalsAgainst:5, points:10, source:source() },
  { id:'pacific', slug:'pacific-fc', name:'Pacific FC', shortName:'Pacific', competitionId:'cpl-2026', competitionName:'Canadian Premier League', city:'Langford', province:'BC', gender:'men', founded:2018, status:'demo', form:['W','D','W','L','W'], played:5, wins:3, draws:1, losses:1, goalsFor:8, goalsAgainst:5, points:10, source:source() },
  { id:'cavalry', slug:'cavalry-fc', name:'Cavalry FC', shortName:'Cavalry', competitionId:'cpl-2026', competitionName:'Canadian Premier League', city:'Calgary', province:'AB', gender:'men', founded:2018, status:'demo', form:['D','W','W','D','W'], played:5, wins:3, draws:2, losses:0, goalsFor:10, goalsAgainst:4, points:11, source:source() },
  { id:'ottawa', slug:'atletico-ottawa', name:'Atlético Ottawa', shortName:'Atlético Ottawa', competitionId:'cpl-2026', competitionName:'Canadian Premier League', city:'Ottawa', province:'ON', gender:'men', founded:2020, status:'demo', form:['W','L','D','W','D'], played:5, wins:2, draws:2, losses:1, goalsFor:7, goalsAgainst:6, points:8, source:source() },
  { id:'york', slug:'york-united', name:'York United FC', shortName:'York United', competitionId:'cpl-2026', competitionName:'Canadian Premier League', city:'Toronto', province:'ON', gender:'men', founded:2018, status:'demo', form:['L','W','D','L','W'], played:5, wins:2, draws:1, losses:2, goalsFor:6, goalsAgainst:7, points:7, source:source() },
  { id:'vancouver-rise', slug:'vancouver-rise-fc', name:'Vancouver Rise FC', shortName:'Vancouver Rise', competitionId:'nsl-2026', competitionName:'Northern Super League', city:'Vancouver', province:'BC', gender:'women', status:'demo', form:['W','W','D','W','W'], played:5, wins:4, draws:1, losses:0, goalsFor:12, goalsAgainst:4, points:13, source:source() },
  { id:'calgary-wild', slug:'calgary-wild-fc', name:'Calgary Wild FC', shortName:'Calgary Wild', competitionId:'nsl-2026', competitionName:'Northern Super League', city:'Calgary', province:'AB', gender:'women', status:'demo', form:['W','D','W','L','W'], played:5, wins:3, draws:1, losses:1, goalsFor:9, goalsAgainst:6, points:10, source:source() },
];

export const players: Player[] = [
  { id:'p-david', slug:'jonathan-david', name:'Jonathan David', shortName:'J. David', position:'ST', clubId:'forge', clubName:'Forge FC', nationality:['Canada'], birthYear:2000, province:'ON', status:'demo', rating:93, appearances:5, goals:5, assists:2, xG:4.2, xA:1.6, minutes:421, pathway:['Ottawa youth','Gent','Lille','Canada'], source:source() },
  { id:'p-kone', slug:'ismail-kone', name:'Ismaël Koné', shortName:'I. Koné', position:'CM', clubId:'cavalry', clubName:'Cavalry FC', nationality:['Canada'], birthYear:2002, province:'QC', status:'demo', rating:88, appearances:5, goals:2, assists:3, xG:1.4, xA:2.7, minutes:438, pathway:['Montreal academy','CF Montréal','Watford','Canada'], source:source() },
  { id:'p-simon', slug:'jordan-perry', name:'Jordan Perry', shortName:'J. Perry', position:'GK', clubId:'pacific', clubName:'Pacific FC', nationality:['Canada'], birthYear:2001, province:'BC', status:'demo', rating:84, appearances:5, goals:0, assists:0, xG:0, xA:0, minutes:450, pathway:['BC academy','Pacific FC'], source:source() },
  { id:'p-morgan', slug:'charlotte-morgan', name:'Charlotte Morgan', shortName:'C. Morgan', position:'AM', clubId:'vancouver-rise', clubName:'Vancouver Rise FC', nationality:['Canada'], birthYear:2003, province:'BC', status:'demo', rating:89, appearances:5, goals:4, assists:4, xG:3.1, xA:3.8, minutes:404, pathway:['BC Soccer','UBC','Vancouver Rise','Canada'], source:source() },
  { id:'p-demers', slug:'alex-demers', name:'Alex Demers', shortName:'A. Demers', position:'CB', clubId:'ottawa', clubName:'Atlético Ottawa', nationality:['Canada'], birthYear:1999, province:'ON', status:'demo', rating:81, appearances:5, goals:1, assists:0, xG:0.6, xA:0.2, minutes:450, pathway:['Ontario academy','University','Atlético Ottawa'], source:source() },
  { id:'p-bouchard', slug:'amelie-bouchard', name:'Amélie Bouchard', shortName:'A. Bouchard', position:'FW', clubId:'calgary-wild', clubName:'Calgary Wild FC', nationality:['Canada'], birthYear:2004, province:'AB', status:'demo', rating:86, appearances:5, goals:3, assists:2, xG:2.7, xA:1.9, minutes:367, pathway:['Alberta academy','University','Calgary Wild'], source:source() },
];

export const matches: Match[] = [
  { id:'m-001', competitionId:'cpl-2026', competitionName:'Canadian Premier League', season:'2026', date:'2026-08-12', status:'scheduled', homeTeamId:'forge', awayTeamId:'pacific', homeTeamName:'Forge FC', awayTeamName:'Pacific FC', homeScore:0, awayScore:0, venue:'Tim Hortons Field', city:'Hamilton', source:source() },
  { id:'m-002', competitionId:'cpl-2026', competitionName:'Canadian Premier League', season:'2026', date:'2026-08-13', status:'scheduled', homeTeamId:'cavalry', awayTeamId:'ottawa', homeTeamName:'Cavalry FC', awayTeamName:'Atlético Ottawa', homeScore:0, awayScore:0, venue:'ATCO Field', city:'Calgary', source:source() },
  { id:'m-003', competitionId:'nsl-2026', competitionName:'Northern Super League', season:'2026', date:'2026-08-14', status:'scheduled', homeTeamId:'vancouver-rise', awayTeamId:'calgary-wild', homeTeamName:'Vancouver Rise FC', awayTeamName:'Calgary Wild FC', homeScore:0, awayScore:0, venue:'Swangard Stadium', city:'Burnaby', source:source() },
  { id:'m-004', competitionId:'cpl-2026', competitionName:'Canadian Premier League', season:'2026', date:'2026-08-09', status:'final', homeTeamId:'forge', awayTeamId:'ottawa', homeTeamName:'Forge FC', awayTeamName:'Atlético Ottawa', homeScore:2, awayScore:1, venue:'Tim Hortons Field', city:'Hamilton', source:source() },
];

export const wireItems: WireItem[] = [
  { id:'w1', category:'news', timestamp:'2026-08-11T12:40:00-04:00', headline:'The Canadian game enters its busiest stretch of the summer', dek:'A dense calendar across professional and provincial competitions creates a useful snapshot of the domestic pathway.', source:source('The Maple Pitch editorial desk') },
  { id:'w2', category:'scouting', timestamp:'2026-08-11T11:55:00-04:00', headline:'Scout signal: Morgan combines final-third volume with repeat pressing actions', dek:'Demonstration scouting signal showing how player profiles can combine production and role context.', source:source(), relatedPlayerId:'p-morgan' },
  { id:'w3', category:'pathway', timestamp:'2026-08-11T10:45:00-04:00', headline:'Pathway watch: Alberta remains a key development corridor', dek:'The pathway model links local development, university football and professional destinations.', source:source() },
  { id:'w4', category:'tactical', timestamp:'2026-08-11T09:30:00-04:00', headline:'Tactical notebook: what a higher press changes in transition', dek:'A compact tactical explainer for reading pressure intensity without reducing the game to one number.', source:source() },
  { id:'w5', category:'transfer', timestamp:'2026-08-10T18:20:00-04:00', headline:'Movement wire: Canadian players abroad remain a central watchlist', dek:'The movement database is designed to connect domestic development with international destinations.', source:source() },
];

export const pathwayNodes: PathwayNode[] = [
  { id:'on-youth', label:'Ontario Youth', province:'ON', level:'Youth', type:'academy' },
  { id:'on-l1', label:'League1 Ontario', province:'ON', level:'Provincial', type:'league' },
  { id:'on-uni', label:'Ontario University', province:'ON', level:'University', type:'university' },
  { id:'cpl', label:'CPL', province:'CAN', level:'Professional', type:'professional' },
  { id:'nsl', label:'NSL', province:'CAN', level:'Professional', type:'professional' },
  { id:'europe', label:'Europe', province:'INT', level:'International', type:'international' },
  { id:'ab-youth', label:'Alberta Youth', province:'AB', level:'Youth', type:'academy' },
  { id:'ab-l1', label:'League1 Alberta', province:'AB', level:'Provincial', type:'league' },
];
export const pathwayEdges: PathwayEdge[] = [
  { from:'on-youth', to:'on-l1', count:124 }, { from:'on-l1', to:'on-uni', count:71 }, { from:'on-l1', to:'cpl', count:38 }, { from:'on-uni', to:'cpl', count:24 }, { from:'cpl', to:'europe', count:12 }, { from:'ab-youth', to:'ab-l1', count:66 }, { from:'ab-l1', to:'cpl', count:17 },
];

export const getPlayer = (slug: string) => players.find(p => p.slug === slug);
export const getTeam = (slug: string) => teams.find(t => t.slug === slug);
export const getMatch = (id: string) => matches.find(m => m.id === id);
export const getCompetition = (slug: string) => competitions.find(c => c.slug === slug);
