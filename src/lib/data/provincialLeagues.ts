// Shared data for the Provincial Leagues hub and per-province dynamic pages.
// Single source of truth used by both /provincial-leagues and /provincial-leagues/[province].

// --- Types ---
export type ProvinceCode = 'ON' | 'PRAIRIES' | 'AB' | 'BC' | 'QC';
export type GenderCode = 'MEN' | 'WOMEN';

export const PROVINCE_SLUGS: Record<string, ProvinceCode> = {
  ontario: 'ON',
  prairies: 'PRAIRIES',
  alberta: 'AB',
  bc: 'BC',
  quebec: 'QC',
};

export const PROVINCE_CODE_TO_SLUG: Record<ProvinceCode, string> = {
  ON: 'ontario',
  PRAIRIES: 'prairies',
  AB: 'alberta',
  BC: 'bc',
  QC: 'quebec',
};

export interface StandingsRow {
  pos: number;
  club: string;
  pld: number;
  wins: number;
  pts: number;
  gd: string;
  form: ('W' | 'D' | 'L')[];
}

export interface StatPlayer {
  rank: number;
  name: string;
  club: string;
  value: number;
  subText: string;
  redWidth: string;
  whiteWidth?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  airDate: string;
  duration: string;
  thumbnailUrl: string;
  matchup?: string;
  alt?: string;
}

export interface FixtureItem {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  venue: string;
  matchday: string;
}

export interface DisciplineLog {
  id: string;
  match: string;
  infraction: string;
  ruling: string;
  severity: 'WARNING' | 'FINE' | 'SUSPENSION';
  timestamp: string;
}

// --- Multi-Jurisdiction Mock Data with Full Scouting Metrics & Expanded 12-Video Library ---
export const PROVINCIAL_DATA: Record<ProvinceCode, {
  name: string;
  tiers: string[];
  standings: Record<string, Record<GenderCode, StandingsRow[]>>;
  goldenBoot: Record<GenderCode, StatPlayer[]>;
  avgGoals: Record<GenderCode, StatPlayer[]>;
  assists: Record<GenderCode, StatPlayer[]>;
  cleanSheets: Record<GenderCode, StatPlayer[]>;
  totw: Record<GenderCode, { week: string; manager: string; note: string; formation: string; players: { pos: string; name: string; club: string }[] }>;
  hero: Record<GenderCode, { headline: string; summary: string; time: string; image: string }>;
  dispatches: { id: string; timestamp: string; league: string; headline: string; url: string }[];
  originPins: { name: string; count: number; province: string; topProspects: string[] }[];
  fixtures: FixtureItem[];
  disciplineLogs: DisciplineLog[];
  videos: Record<GenderCode, { upcoming: VideoItem[]; lastWeek: VideoItem[]; popular: VideoItem[] }>;
}> = {
  ON: {
    name: 'Ontario (League1 Ontario)',
    tiers: ['PREMIER', 'CHAMPIONSHIP', 'LEAGUE2'],
    standings: {
      PREMIER: {
        MEN: [
          { pos: 1, club: 'Vaughan Azzurri', pld: 20, wins: 13, pts: 42, gd: '+21', form: ['W', 'W', 'D', 'W', 'W'] },
          { pos: 2, club: 'Scrosoppi FC', pld: 20, wins: 12, pts: 39, gd: '+18', form: ['W', 'D', 'W', 'W', 'L'] },
          { pos: 3, club: 'Simcoe County Rovers', pld: 20, wins: 11, pts: 38, gd: '+15', form: ['D', 'W', 'W', 'L', 'W'] },
          { pos: 4, club: 'Woodbridge Strikers', pld: 20, wins: 10, pts: 35, gd: '+10', form: ['W', 'L', 'W', 'D', 'W'] },
          { pos: 5, club: 'North Toronto Nitros', pld: 20, wins: 9, pts: 33, gd: '+8', form: ['L', 'W', 'D', 'W', 'W'] },
          { pos: 6, club: 'Alliance United', pld: 20, wins: 8, pts: 30, gd: '+5', form: ['W', 'D', 'L', 'W', 'D'] },
          { pos: 7, club: 'Sigma FC', pld: 20, wins: 7, pts: 28, gd: '+3', form: ['D', 'L', 'W', 'D', 'W'] },
          { pos: 8, club: 'ProStars FC', pld: 20, wins: 5, pts: 20, gd: '-6', form: ['L', 'L', 'D', 'L', 'W'] },
        ],
        WOMEN: [
          { pos: 1, club: 'NDC Ontario', pld: 18, wins: 15, pts: 46, gd: '+35', form: ['W', 'W', 'W', 'W', 'W'] },
          { pos: 2, club: 'Vaughan Azzurri', pld: 18, wins: 13, pts: 41, gd: '+22', form: ['W', 'W', 'D', 'W', 'L'] },
          { pos: 3, club: 'Simcoe County Rovers', pld: 18, wins: 11, pts: 36, gd: '+14', form: ['D', 'W', 'L', 'W', 'W'] },
          { pos: 4, club: 'Bryst FA', pld: 18, wins: 9, pts: 30, gd: '+5', form: ['W', 'L', 'W', 'D', 'L'] },
        ]
      },
      CHAMPIONSHIP: {
        MEN: [
          { pos: 1, club: 'Guelph United', pld: 18, wins: 12, pts: 39, gd: '+16', form: ['W', 'W', 'W', 'D', 'W'] },
          { pos: 2, club: 'Hamilton United', pld: 18, wins: 11, pts: 35, gd: '+12', form: ['W', 'D', 'W', 'L', 'W'] },
          { pos: 3, club: 'FC London', pld: 18, wins: 9, pts: 30, gd: '+4', form: ['D', 'W', 'L', 'W', 'D'] },
        ],
        WOMEN: []
      },
      LEAGUE2: { MEN: [], WOMEN: [] }
    },
    goldenBoot: {
      MEN: [
        { rank: 1, name: 'Emil Nielsen', club: 'Simcoe County Rovers', value: 16, subText: '16 Goals • 7.8 GPM • 8.4 RTG', redWidth: '100%' },
        { rank: 2, name: 'Liam Fraser', club: 'Scrosoppi FC', value: 14, subText: '14 Goals • 0.78 GPM • 8.1 RTG', redWidth: '87%' },
        { rank: 3, name: 'Kobe Da Silva', club: 'Vaughan Azzurri', value: 12, subText: '12 Goals • 0.71 GPM • 8.0 RTG', redWidth: '75%' },
        { rank: 4, name: 'Jordan Perruzza', club: 'Woodbridge Strikers', value: 10, subText: '10 Goals • 0.65 GPM • 7.7 RTG', redWidth: '62%' },
        { rank: 5, name: 'Jevontae Layne', club: 'North Toronto', value: 9, subText: '9 Goals • 0.58 GPM • 7.5 RTG', redWidth: '56%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Olivia Smith', club: 'NDC Ontario', value: 18, subText: '18 Goals • 1.05 GPM • 8.7 RTG', redWidth: '100%' },
        { rank: 2, name: 'Amanda Allen', club: 'Vaughan Azzurri', value: 15, subText: '15 Goals • 0.92 GPM • 8.3 RTG', redWidth: '83%' },
        { rank: 3, name: 'Cloé Briand', club: 'Simcoe County Rovers', value: 12, subText: '12 Goals • 0.75 GPM • 8.0 RTG', redWidth: '66%' },
        { rank: 4, name: 'Nyah Coleman', club: 'Bryst FA', value: 10, subText: '10 Goals • 0.62 GPM • 7.6 RTG', redWidth: '55%' },
        { rank: 5, name: 'Maya D\'Souza', club: 'NDC Ontario', value: 8, subText: '8 Goals • 0.50 GPM • 7.4 RTG', redWidth: '44%' },
      ]
    },
    avgGoals: {
      MEN: [
        { rank: 1, name: 'Emil Nielsen', club: 'Simcoe Rovers', value: 0.84, subText: '0.84 G/M (16 in 19)', redWidth: '84%', whiteWidth: '100%' },
        { rank: 2, name: 'Liam Fraser', club: 'Scrosoppi FC', value: 0.78, subText: '0.78 G/M (14 in 18)', redWidth: '78%', whiteWidth: '90%' },
        { rank: 3, name: 'Kobe Da Silva', club: 'Vaughan Azzurri', value: 0.71, subText: '0.71 G/M (12 in 17)', redWidth: '71%', whiteWidth: '85%' },
        { rank: 4, name: 'Jordan Perruzza', club: 'Woodbridge', value: 0.65, subText: '0.65 G/M (10 in 15)', redWidth: '65%', whiteWidth: '75%' },
        { rank: 5, name: 'Jevontae Layne', club: 'North Toronto', value: 0.58, subText: '0.58 G/M (9 in 16)', redWidth: '58%', whiteWidth: '80%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Olivia Smith', club: 'NDC Ontario', value: 1.05, subText: '1.05 G/M (18 in 17)', redWidth: '100%', whiteWidth: '95%' },
        { rank: 2, name: 'Amanda Allen', club: 'Vaughan Azzurri', value: 0.92, subText: '0.92 G/M (15 in 16)', redWidth: '92%', whiteWidth: '90%' },
        { rank: 3, name: 'Cloé Briand', club: 'Simcoe Rovers', value: 0.75, subText: '0.75 G/M (12 in 16)', redWidth: '75%', whiteWidth: '90%' },
        { rank: 4, name: 'Nyah Coleman', club: 'Bryst FA', value: 0.62, subText: '0.62 G/M (10 in 16)', redWidth: '62%', whiteWidth: '90%' },
        { rank: 5, name: 'Maya D\'Souza', club: 'NDC Ontario', value: 0.50, subText: '0.50 G/M (8 in 16)', redWidth: '50%', whiteWidth: '90%' },
      ]
    },
    assists: {
      MEN: [
        { rank: 1, name: 'Kobe Da Silva', club: 'Vaughan Azzurri', value: 8, subText: '8 Assists • 19 Matches', redWidth: '100%' },
        { rank: 2, name: 'Emil Nielsen', club: 'Simcoe Rovers', value: 7, subText: '7 Assists • 19 Matches', redWidth: '87%' },
        { rank: 3, name: 'Liam Fraser', club: 'Scrosoppi FC', value: 5, subText: '5 Assists • 18 Matches', redWidth: '62%' },
        { rank: 4, name: 'Marcus Clarke', club: 'Alliance United', value: 4, subText: '4 Assists • 17 Matches', redWidth: '50%' },
        { rank: 5, name: 'Dante Rossi', club: 'Sigma FC', value: 4, subText: '4 Assists • 18 Matches', redWidth: '50%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Olivia Smith', club: 'NDC Ontario', value: 9, subText: '9 Assists • 17 Matches', redWidth: '100%' },
        { rank: 2, name: 'Amanda Allen', club: 'Vaughan Azzurri', value: 6, subText: '6 Assists • 16 Matches', redWidth: '66%' },
        { rank: 3, name: 'Zoe L Kind', club: 'Simcoe Rovers', value: 5, subText: '5 Assists • 16 Matches', redWidth: '55%' },
        { rank: 4, name: 'Mia Pagnucco', club: 'Bryst FA', value: 4, subText: '4 Assists • 15 Matches', redWidth: '44%' },
        { rank: 5, name: 'Hanna Sahloul', club: 'NDC Ontario', value: 4, subText: '4 Assists • 17 Matches', redWidth: '44%' },
      ]
    },
    cleanSheets: {
      MEN: [
        { rank: 1, name: 'S. Stefanovic', club: 'Vaughan Azzurri', value: 9, subText: '9 Clean Sheets (19 Apps)', redWidth: '100%' },
        { rank: 2, name: 'J. D’Agostino', club: 'Scrosoppi FC', value: 8, subText: '8 Clean Sheets (18 Apps)', redWidth: '88%' },
        { rank: 3, name: 'B. Henderson', club: 'Simcoe Rovers', value: 7, subText: '7 Clean Sheets (18 Apps)', redWidth: '77%' },
        { rank: 4, name: 'L. Mckenzie', club: 'Woodbridge', value: 6, subText: '6 Clean Sheets (17 Apps)', redWidth: '66%' },
        { rank: 5, name: 'K. Patel', club: 'North Toronto', value: 5, subText: '5 Clean Sheets (16 Apps)', redWidth: '55%' },
      ],
      WOMEN: [
        { rank: 1, name: 'A. Loehr', club: 'NDC Ontario', value: 10, subText: '10 Clean Sheets (17 Apps)', redWidth: '100%' },
        { rank: 2, name: 'S. Gidwani', club: 'Vaughan Azzurri', value: 8, subText: '8 Clean Sheets (16 Apps)', redWidth: '80%' },
        { rank: 3, name: 'E. Tremblay', club: 'Simcoe Rovers', value: 6, subText: '6 Clean Sheets (16 Apps)', redWidth: '60%' },
        { rank: 4, name: 'K. Vlahos', club: 'Bryst FA', value: 5, subText: '5 Clean Sheets (15 Apps)', redWidth: '50%' },
        { rank: 5, name: 'M. Roy', club: 'NDC Ontario', value: 4, subText: '4 Clean Sheets (12 Apps)', redWidth: '40%' },
      ]
    },
    totw: {
      MEN: {
        week: 'MATCHWEEK 19',
        manager: 'Patrice Gheisar (Vaughan Consultant)',
        note: 'Exceptional tactical discipline in transition neutralizing the opposition central pivot.',
        formation: '4-3-3',
        players: [
          { pos: 'GK', name: 'S. Stefanovic', club: 'Vaughan Azzurri' },
          { pos: 'DEF', name: 'J. D’Agostino', club: 'Scrosoppi FC' },
          { pos: 'MID', name: 'E. Nielsen', club: 'Simcoe Rovers' },
          { pos: 'FWD', name: 'K. Da Silva', club: 'Vaughan Azzurri' },
        ]
      },
      WOMEN: {
        week: 'MATCHWEEK 17',
        manager: 'Jolanda Pratschner (NDC)',
        note: 'High-tempo gegenpress overwhelmed defensive blocks across the flank.',
        formation: '4-2-3-1',
        players: [
          { pos: 'GK', name: 'A. Loehr', club: 'NDC Ontario' },
          { pos: 'MID', name: 'O. Smith', club: 'NDC Ontario' },
          { pos: 'FWD', name: 'A. Allen', club: 'Vaughan Azzurri' },
        ]
      }
    },
    hero: {
      MEN: {
        headline: 'L1O TITLE CLASH: VAUGHAN AZZURRI HOSTS SCRO SOPPI IN SIX-POINTER',
        summary: 'Top spot in the Premier Division hangs in the balance as regional heavyweights lock horns at North Park.',
        time: '2H AGO',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
      },
      WOMEN: {
        headline: 'NDC ONTARIO EXTENDS UNBEATEN RUN WITH CLINICAL MASTERCLASS',
        summary: 'Academy prospects showcase elite technical output as scouts from across North America pack the touchline.',
        time: '3H AGO',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop'
      }
    },
    dispatches: [
      { id: 'd1', timestamp: '1H AGO', league: 'L1O', headline: 'Scouts Flock to League1 Ontario Title Race as Young Prospects Shine', url: '#' },
      { id: 'd2', timestamp: '4H AGO', league: 'L1O', headline: 'Vaughan Academy Product Signs Professional Developmental Deal with CPL Side', url: '#' },
      { id: 'd3', timestamp: '7H AGO', league: 'L1O', headline: 'Referee Assigns & Discipline Tracker: Matchweek 19 Preview', url: '#' },
    ],
    originPins: [
      { name: 'Toronto Metro', count: 84, province: 'Ontario', topProspects: ['Emil Nielsen', 'Liam Fraser'] },
      { name: 'Ottawa Hub', count: 42, province: 'Ontario', topProspects: ['Brian Wright', 'H. Oliver'] }
    ],
    fixtures: [
      { id: 'on-f1', homeTeam: 'Vaughan Azzurri', awayTeam: 'Scrosoppi FC', kickoff: 'AUG 10 • 7:00 PM EST', venue: 'North Park Stadium', matchday: 'MATCHWEEK 21' },
      { id: 'on-f2', homeTeam: 'Simcoe County Rovers', awayTeam: 'Woodbridge Strikers', kickoff: 'AUG 11 • 8:30 PM EST', venue: 'Barrie Turf Complex', matchday: 'MATCHWEEK 21' }
    ],
    disciplineLogs: [
      { id: 'on-dl1', match: 'Vaughan vs North Toronto', infraction: 'Professional foul denying obvious goalscoring opportunity', ruling: '1-match suspension upheld', severity: 'SUSPENSION', timestamp: 'AUG 6' },
      { id: 'on-dl2', match: 'Scrosoppi vs Sigma FC', infraction: 'Accumulation of 5 yellow cards', ruling: 'Club fined $250', severity: 'FINE', timestamp: 'AUG 5' }
    ],
    videos: {
      MEN: {
        upcoming: [
          { id: 'on-u1', title: 'L1O Premier Preview: Vaughan Azzurri vs Scrosoppi FC', airDate: 'AUG 10, 2026 • 7:00 PM EST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-u2', title: 'Simcoe County Rovers vs Woodbridge Strikers Tactical Breakdown', airDate: 'AUG 12, 2026 • 8:30 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-u3', title: 'North Toronto Nitros vs ProStars FC Match Preview', airDate: 'AUG 14, 2026 • 6:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-u4', title: 'Sigma FC vs Alliance United Clash Preview', airDate: 'AUG 15, 2026 • 7:30 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'on-l1', title: 'North Toronto Nitros 2-1 Alliance United | Match Highlights', airDate: 'AUG 4, 2026', duration: '6:42', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-l2', title: 'Sigma FC vs ProStars FC | Full Match Replay', airDate: 'AUG 2, 2026', duration: '1:52:10', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-l3', title: 'Vaughan Azzurri 3-0 Simcoe County | Replay', airDate: 'JUL 30, 2026', duration: '1:48:00', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-l4', title: 'Scrosoppi FC 2-2 Woodbridge Strikers | Highlights', airDate: 'JUL 28, 2026', duration: '7:15', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'on-p1', title: 'League1 Ontario 2025 Championship Final Highlights', airDate: 'SEP 28, 2025', duration: '12:15', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-p2', title: 'Top 10 Breathtaking Goals of the L1O Season', airDate: 'OCT 12, 2025', duration: '8:40', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-p3', title: 'Inside the Vaughan Azzurri Pro-Am Academy Engine', airDate: 'JUN 15, 2026', duration: '15:20', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-p4', title: 'L1O All-Star Game Tactical Breakdown & Masterclass', airDate: 'JUL 04, 2026', duration: '18:05', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ]
      },
      WOMEN: {
        upcoming: [
          { id: 'on-uw1', title: 'NDC Ontario vs Vaughan Azzurri Premier Showdown', airDate: 'AUG 11, 2026 • 6:00 PM EST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-uw2', title: 'Simcoe Rovers vs Bryst FA Women Match Preview', airDate: 'AUG 13, 2026 • 5:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-uw3', title: 'North Toronto Nitros Women vs Vaughan Preview', airDate: 'AUG 15, 2026 • 4:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-uw4', title: 'Alliance United Women vs ProStars FC Preview', airDate: 'AUG 17, 2026 • 6:30 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'on-lw1', title: 'Simcoe Rovers Women 3-0 Bryst FA | Highlights', airDate: 'AUG 3, 2026', duration: '5:18', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-lw2', title: 'NDC Ontario 4-1 Vaughan Azzurri | Full Replay', airDate: 'AUG 1, 2026', duration: '1:45:20', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-lw3', title: 'North Toronto 2-0 Alliance United Highlights', airDate: 'JUL 29, 2026', duration: '4:50', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-lw4', title: 'Bryst FA 1-1 Sigma FC Women Replay', airDate: 'JUL 26, 2026', duration: '1:32:00', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'on-pw1', title: 'League1 Ontario Women\'s Championship Classic Final', airDate: 'OCT 1, 2025', duration: '14:30', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-pw2', title: 'CanWNT Pathway: L1O Female Stars Rising to the NSL', airDate: 'JUL 10, 2026', duration: '11:05', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-pw3', title: 'Top 10 Female Academy Goals of the Season', airDate: 'SEP 12, 2025', duration: '7:40', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'on-pw4', title: 'Inside NDC Ontario Elite Training Complex', airDate: 'JUN 20, 2026', duration: '16:50', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' }
        ]
      }
    }
  },
  PRAIRIES: {
    name: 'Prairies Premier League (PPL)',
    tiers: ['PREMIER'],
    standings: {
      PREMIER: {
        MEN: [
          { pos: 1, club: 'Winnipeg Valour Academy', pld: 12, wins: 9, pts: 28, gd: '+14', form: ['W', 'W', 'W', 'D', 'W'] },
          { pos: 2, club: 'Saskatoon Olympians', pld: 12, wins: 8, pts: 25, gd: '+10', form: ['W', 'D', 'W', 'W', 'L'] },
          { pos: 3, club: 'Regina City FC', pld: 12, wins: 7, pts: 22, gd: '+5', form: ['D', 'W', 'L', 'W', 'W'] },
          { pos: 4, club: 'Thunder Bay Chill Pro', pld: 12, wins: 6, pts: 19, gd: '+1', form: ['L', 'W', 'D', 'W', 'L'] },
          { pos: 5, club: 'Manitoba Selects', pld: 12, wins: 4, pts: 14, gd: '-4', form: ['L', 'L', 'W', 'D', 'L'] },
          { pos: 6, club: 'Saskatchewan Blitz', pld: 12, wins: 3, pts: 11, gd: '-9', form: ['D', 'L', 'L', 'W', 'L'] },
          { pos: 7, club: 'Northern Ontario United', pld: 12, wins: 2, pts: 8, gd: '-17', form: ['L', 'L', 'L', 'D', 'W'] },
        ],
        WOMEN: [
          { pos: 1, club: 'Winnipeg Prairie Roses', pld: 12, wins: 10, pts: 31, gd: '+20', form: ['W', 'W', 'W', 'W', 'W'] },
          { pos: 2, club: 'Saskatoon Aurora', pld: 12, wins: 8, pts: 26, gd: '+12', form: ['W', 'D', 'W', 'W', 'L'] },
          { pos: 3, club: 'Thunder Bay Women Pro', pld: 12, wins: 6, pts: 20, gd: '+4', form: ['D', 'W', 'L', 'W', 'W'] },
          { pos: 4, club: 'Regina Revel', pld: 12, wins: 5, pts: 17, gd: '-2', form: ['L', 'W', 'D', 'L', 'W'] },
        ]
      },
      CHAMPIONSHIP: { MEN: [], WOMEN: [] },
      LEAGUE2: { MEN: [], WOMEN: [] }
    },
    goldenBoot: {
      MEN: [
        { rank: 1, name: 'Nikita Petrov', club: 'Winnipeg Valour Academy', value: 11, subText: '11 Goals • 0.85 GPM • 8.2 RTG', redWidth: '100%' },
        { rank: 2, name: 'Lucas Cardinal', club: 'Saskatoon Olympians', value: 9, subText: '9 Goals • 0.72 GPM • 7.9 RTG', redWidth: '81%' },
        { rank: 3, name: 'Matthew Giesbrecht', club: 'Thunder Bay Chill', value: 8, subText: '8 Goals • 0.65 GPM • 7.6 RTG', redWidth: '72%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Sophie Deschamps', club: 'Winnipeg Prairie Roses', value: 12, subText: '12 Goals • 0.95 GPM • 8.5 RTG', redWidth: '100%' },
        { rank: 2, name: 'Kylie Fehr', club: 'Saskatoon Aurora', value: 10, subText: '10 Goals • 0.80 GPM • 8.1 RTG', redWidth: '83%' },
      ]
    },
    avgGoals: {
      MEN: [
        { rank: 1, name: 'Nikita Petrov', club: 'Winnipeg Valour', value: 0.85, subText: '0.85 G/M (11 in 13)', redWidth: '85%', whiteWidth: '90%' },
        { rank: 2, name: 'Lucas Cardinal', club: 'Saskatoon', value: 0.72, subText: '0.72 G/M (9 in 12)', redWidth: '72%', whiteWidth: '85%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Sophie Deschamps', club: 'Prairie Roses', value: 0.95, subText: '0.95 G/M (12 in 13)', redWidth: '95%', whiteWidth: '90%' },
        { rank: 2, name: 'Kylie Fehr', club: 'Saskatoon Aurora', value: 0.80, subText: '0.80 G/M (10 in 12)', redWidth: '80%', whiteWidth: '85%' },
      ]
    },
    assists: {
      MEN: [
        { rank: 1, name: 'Devin Katchur', club: 'Winnipeg Valour Academy', value: 6, subText: '6 Assists • 12 Matches', redWidth: '100%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Amara Nnaji', club: 'Winnipeg Prairie Roses', value: 7, subText: '7 Assists • 12 Matches', redWidth: '100%' },
      ]
    },
    cleanSheets: {
      MEN: [
        { rank: 1, name: 'O. Lindqvist', club: 'Winnipeg Valour Academy', value: 6, subText: '6 Clean Sheets (12 Apps)', redWidth: '100%' },
      ],
      WOMEN: [
        { rank: 1, name: 'M. Dubois', club: 'Winnipeg Prairie Roses', value: 7, subText: '7 Clean Sheets (12 Apps)', redWidth: '100%' },
      ]
    },
    totw: {
      MEN: {
        week: 'MATCHWEEK 12',
        manager: 'Dwayne De Rosario (Prairies Technical)',
        note: 'Exceptional tactical discipline across Manitoba and Saskatchewan corridor matches.',
        formation: '4-3-3',
        players: [{ pos: 'GK', name: 'O. Lindqvist', club: 'Winnipeg Valour' }, { pos: 'FWD', name: 'N. Petrov', club: 'Winnipeg Valour' }]
      },
      WOMEN: {
        week: 'MATCHWEEK 12',
        manager: 'Sylvia Martin (Prairie Roses)',
        note: 'High pressing and vertical ball movement secured top spot.',
        formation: '4-2-3-1',
        players: [{ pos: 'GK', name: 'M. Dubois', club: 'Prairie Roses' }, { pos: 'FWD', name: 'S. Deschamps', club: 'Prairie Roses' }]
      }
    },
    hero: {
      MEN: {
        headline: 'PRAIRIES PREMIER LEAGUE LAUNCHES WITH SEVEN INAUGURAL CLUBS',
        summary: 'CSB licensing agreement brings elite pro-am competition across Manitoba, Saskatchewan, and Northern Ontario.',
        time: '1H AGO',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
      },
      WOMEN: {
        headline: 'WINNIPEG PRAIRIES ROSES DOMINATE INAUGURAL SEASON OPENER',
        summary: 'Electrifying atmosphere at Valley Gardens as seven inaugural clubs vie for regional supremacy.',
        time: '4H AGO',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop'
      }
    },
    dispatches: [
      { id: 'pr1', timestamp: '30M AGO', league: 'PPL', headline: 'Prairies Premier League Expansion Marks Milestone for Canadian Soccer', url: '#' },
      { id: 'pr2', timestamp: '3H AGO', league: 'PPL', headline: 'Thunder Bay Chill Secures Vital Away Victory in Northern Ontario Derby', url: '#' }
    ],
    originPins: [
      { name: 'Winnipeg Metro', count: 38, province: 'Manitoba', topProspects: ['Nikita Petrov', 'Sophie Deschamps'] },
      { name: 'Saskatoon Hub', count: 29, province: 'Saskatchewan', topProspects: ['Lucas Cardinal', 'Kylie Fehr'] }
    ],
    fixtures: [
      { id: 'pr-f1', homeTeam: 'Winnipeg Valour Academy', awayTeam: 'Saskatoon Olympians', kickoff: 'AUG 10 • 7:00 PM CST', venue: 'Valley Gardens Complex', matchday: 'MATCHWEEK 13' },
      { id: 'pr-f2', homeTeam: 'Regina City FC', awayTeam: 'Thunder Bay Chill Pro', kickoff: 'AUG 11 • 6:30 PM CST', venue: 'Mosaic Stadium Turf', matchday: 'MATCHWEEK 13' }
    ],
    disciplineLogs: [
      { id: 'pr-dl1', match: 'Winnipeg Valour vs Regina City', infraction: 'Serious foul play in midfield challenge', ruling: '2-match suspension issued', severity: 'SUSPENSION', timestamp: 'AUG 6' },
      { id: 'pr-dl2', match: 'Saskatoon Olympians vs Manitoba Selects', infraction: 'Accumulation of 5 yellow cards', ruling: 'Club fined $200', severity: 'FINE', timestamp: 'AUG 4' }
    ],
    videos: {
      MEN: {
        upcoming: [
          { id: 'pr-u1', title: 'Winnipeg Valour Academy vs Saskatoon Olympians', airDate: 'AUG 10, 2026 • 7:00 PM CST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'pr-u2', title: 'Thunder Bay Chill Pro vs Regina City Preview', airDate: 'AUG 12, 2026 • 6:30 PM CST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'pr-l1', title: 'Winnipeg 3-1 Thunder Bay Chill | Match Highlights', airDate: 'AUG 4, 2026', duration: '5:20', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'pr-l2', title: 'Saskatoon Olympians 2-0 Regina City | Replay', airDate: 'AUG 2, 2026', duration: '1:35:00', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'pr-p1', title: 'Prairies Premier League Inaugural Launch Documentary', airDate: 'MAY 15, 2026', duration: '18:40', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'pr-p2', title: 'Top Goals of the Prairies Inaugural Spring Campaign', airDate: 'JUL 20, 2026', duration: '7:15', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' }
        ]
      },
      WOMEN: {
        upcoming: [
          { id: 'pr-uw1', title: 'Winnipeg Prairie Roses vs Saskatoon Aurora', airDate: 'AUG 11, 2026 • 6:00 PM CST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'pr-lw1', title: 'Winnipeg Prairie Roses 4-1 Regina Revel Highlights', airDate: 'AUG 3, 2026', duration: '4:50', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'pr-pw1', title: 'Prairies Women Pro-Am Showcase Final', airDate: 'JUN 30, 2026', duration: '11:20', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' }
        ]
      }
    }
  },
  QC: {
    // Real-world structure: LS Pro (Ligues senior provinciales), sanctioned by Soccer Québec.
    // Three tiers since the 2025 expansion — Ligue1 Québec (12 clubs), Ligue2 Québec (12 clubs),
    // Ligue3 Québec (25 clubs). Club names below reflect confirmed 2026-season rosters;
    // standings/points/player stats remain simulated editorial data like the other provinces.
    name: 'Québec (LS Pro)',
    tiers: ['LIGUE 1', 'LIGUE 2', 'LIGUE 3'],
    standings: {
      'LIGUE 1': {
        MEN: [
          { pos: 1, club: 'CS Saint-Laurent', pld: 20, wins: 14, pts: 45, gd: '+22', form: ['W', 'W', 'D', 'W', 'W'] },
          { pos: 2, club: 'FC Laval', pld: 20, wins: 12, pts: 40, gd: '+16', form: ['W', 'D', 'W', 'W', 'L'] },
          { pos: 3, club: 'AS Blainville', pld: 20, wins: 11, pts: 37, gd: '+14', form: ['D', 'W', 'L', 'W', 'W'] },
          { pos: 4, club: 'CS Mont-Royal Outremont', pld: 20, wins: 10, pts: 34, gd: '+9', form: ['W', 'W', 'D', 'L', 'W'] },
          { pos: 5, club: 'AS Gatineau', pld: 20, wins: 9, pts: 31, gd: '+5', form: ['L', 'W', 'W', 'D', 'W'] },
          { pos: 6, club: 'Royal-Sélect de Beauport', pld: 20, wins: 8, pts: 29, gd: '+2', form: ['W', 'D', 'L', 'W', 'D'] },
          { pos: 7, club: 'CS LaSalle', pld: 20, wins: 7, pts: 26, gd: '-3', form: ['D', 'L', 'W', 'D', 'L'] },
          { pos: 8, club: 'Celtix du Haut-Richelieu', pld: 20, wins: 7, pts: 25, gd: '-4', form: ['L', 'W', 'L', 'D', 'W'] },
          { pos: 9, club: 'AS Laval', pld: 20, wins: 6, pts: 23, gd: '-6', form: ['D', 'L', 'W', 'L', 'D'] },
          { pos: 10, club: 'CS St-Hubert', pld: 20, wins: 6, pts: 22, gd: '-8', form: ['L', 'D', 'L', 'W', 'L'] },
          { pos: 11, club: 'CS Longueuil', pld: 20, wins: 5, pts: 19, gd: '-11', form: ['L', 'L', 'D', 'L', 'W'] },
          { pos: 12, club: 'Ottawa South United', pld: 20, wins: 4, pts: 16, gd: '-15', form: ['L', 'L', 'L', 'D', 'L'] },
        ],
        WOMEN: [
          { pos: 1, club: 'AS Blainville', pld: 11, wins: 9, pts: 28, gd: '+19', form: ['W', 'W', 'W', 'D', 'W'] },
          { pos: 2, club: 'CS Saint-Laurent', pld: 11, wins: 8, pts: 25, gd: '+14', form: ['W', 'D', 'W', 'W', 'L'] },
          { pos: 3, club: 'Lakeshore SC', pld: 11, wins: 7, pts: 22, gd: '+9', form: ['W', 'W', 'L', 'D', 'W'] },
          { pos: 4, club: 'CS Mont-Royal Outremont', pld: 11, wins: 6, pts: 19, gd: '+4', form: ['D', 'W', 'L', 'W', 'D'] },
          { pos: 5, club: 'FC Laval', pld: 11, wins: 5, pts: 16, gd: '-2', form: ['L', 'D', 'W', 'L', 'W'] },
          { pos: 6, club: 'Dynamo de Québec', pld: 11, wins: 4, pts: 13, gd: '-6', form: ['L', 'L', 'D', 'W', 'L'] },
        ]
      },
      'LIGUE 2': {
        MEN: [
          { pos: 1, club: "CF L'International de Québec", pld: 16, wins: 11, pts: 35, gd: '+18', form: ['W', 'W', 'D', 'W', 'W'] },
          { pos: 2, club: 'CS Union Lanaudière Sud', pld: 16, wins: 10, pts: 32, gd: '+14', form: ['W', 'D', 'W', 'L', 'W'] },
          { pos: 3, club: 'Revolution FC', pld: 16, wins: 9, pts: 29, gd: '+9', form: ['D', 'W', 'W', 'D', 'L'] },
          { pos: 4, club: 'CS Rivière-des-Prairies', pld: 16, wins: 8, pts: 26, gd: '+5', form: ['W', 'L', 'D', 'W', 'W'] },
          { pos: 5, club: 'AS Chaudière-Ouest', pld: 16, wins: 7, pts: 23, gd: '0', form: ['L', 'W', 'D', 'L', 'W'] },
          { pos: 6, club: 'CS Trident', pld: 16, wins: 6, pts: 20, gd: '-4', form: ['D', 'L', 'W', 'L', 'D'] },
          { pos: 7, club: 'CS Montréal Centre', pld: 16, wins: 5, pts: 17, gd: '-8', form: ['L', 'D', 'L', 'W', 'L'] },
          { pos: 8, club: 'CS Mistral de Sherbrooke', pld: 16, wins: 4, pts: 13, gd: '-12', form: ['L', 'L', 'L', 'D', 'L'] },
        ],
        WOMEN: [
          { pos: 1, club: 'CS St-Hubert', pld: 14, wins: 10, pts: 31, gd: '+16', form: ['W', 'W', 'D', 'W', 'W'] },
          { pos: 2, club: 'Royal-Sélect de Beauport', pld: 14, wins: 8, pts: 25, gd: '+10', form: ['W', 'D', 'W', 'L', 'W'] },
          { pos: 3, club: 'CS Longueuil', pld: 14, wins: 7, pts: 22, gd: '+3', form: ['D', 'W', 'L', 'W', 'D'] },
          { pos: 4, club: 'AS Laval', pld: 14, wins: 5, pts: 17, gd: '-5', form: ['L', 'D', 'W', 'L', 'L'] },
          { pos: 5, club: 'Ottawa South United', pld: 14, wins: 3, pts: 11, gd: '-11', form: ['L', 'L', 'D', 'L', 'L'] },
        ]
      },
      'LIGUE 3': {
        MEN: [
          { pos: 1, club: "CS Vallée de l'Or (Blizz'Or)", pld: 14, wins: 10, pts: 31, gd: '+15', form: ['W', 'W', 'D', 'W', 'W'] },
          { pos: 2, club: 'Granby Cosmos', pld: 14, wins: 9, pts: 28, gd: '+11', form: ['W', 'D', 'W', 'W', 'L'] },
          { pos: 3, club: 'CS Fury de Rimouski', pld: 14, wins: 8, pts: 25, gd: '+6', form: ['D', 'W', 'L', 'W', 'D'] },
          { pos: 4, club: 'West Ottawa SC', pld: 14, wins: 7, pts: 22, gd: '+2', form: ['W', 'L', 'D', 'W', 'W'] },
          { pos: 5, club: 'Dollard SC', pld: 14, wins: 6, pts: 19, gd: '-3', form: ['L', 'D', 'W', 'L', 'D'] },
          { pos: 6, club: 'AS Brossard', pld: 14, wins: 5, pts: 16, gd: '-7', form: ['D', 'L', 'L', 'W', 'L'] },
          { pos: 7, club: 'CS Trois-Rivières', pld: 14, wins: 4, pts: 13, gd: '-10', form: ['L', 'L', 'D', 'L', 'W'] },
          { pos: 8, club: "CS Boréal d'Alma", pld: 14, wins: 3, pts: 10, gd: '-14', form: ['L', 'L', 'L', 'D', 'L'] },
        ],
        WOMEN: [
          { pos: 1, club: 'Granby Cosmos', pld: 12, wins: 9, pts: 27, gd: '+13', form: ['W', 'W', 'D', 'W', 'W'] },
          { pos: 2, club: 'West Ottawa SC', pld: 12, wins: 7, pts: 22, gd: '+7', form: ['W', 'D', 'W', 'L', 'W'] },
          { pos: 3, club: 'CS Optimum de Victoriaville', pld: 12, wins: 5, pts: 16, gd: '-1', form: ['D', 'W', 'L', 'D', 'L'] },
          { pos: 4, club: 'AS Saint-Lambert', pld: 12, wins: 3, pts: 11, gd: '-7', form: ['L', 'L', 'D', 'W', 'L'] },
          { pos: 5, club: 'Soccer Pointe-Claire', pld: 12, wins: 2, pts: 8, gd: '-12', form: ['L', 'L', 'L', 'D', 'L'] },
        ]
      }
    },
    goldenBoot: {
      MEN: [
        { rank: 1, name: 'Adama Koné', club: 'CS Saint-Laurent', value: 15, subText: '15 Goals • 0.75 GPM • 8.3 RTG', redWidth: '100%' },
        { rank: 2, name: 'Marc-Antoine Fortin', club: 'FC Laval', value: 13, subText: '13 Goals • 0.65 GPM • 8.0 RTG', redWidth: '87%' },
        { rank: 3, name: 'Guillaume Da Silva', club: 'AS Blainville', value: 11, subText: '11 Goals • 0.55 GPM • 7.8 RTG', redWidth: '73%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Maika Hamel', club: 'AS Blainville', value: 12, subText: '12 Goals • 1.09 GPM • 8.4 RTG', redWidth: '100%' },
        { rank: 2, name: 'Béatrice Roy', club: 'CS Saint-Laurent', value: 10, subText: '10 Goals • 0.91 GPM • 8.1 RTG', redWidth: '83%' },
      ]
    },
    avgGoals: {
      MEN: [
        { rank: 1, name: 'Adama Koné', club: 'CS Saint-Laurent', value: 0.75, subText: '0.75 G/M (15 in 20)', redWidth: '75%', whiteWidth: '95%' },
        { rank: 2, name: 'Marc-Antoine Fortin', club: 'FC Laval', value: 0.65, subText: '0.65 G/M (13 in 20)', redWidth: '65%', whiteWidth: '90%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Maika Hamel', club: 'AS Blainville', value: 1.09, subText: '1.09 G/M (12 in 11)', redWidth: '100%', whiteWidth: '85%' },
        { rank: 2, name: 'Béatrice Roy', club: 'CS Saint-Laurent', value: 0.91, subText: '0.91 G/M (10 in 11)', redWidth: '91%', whiteWidth: '85%' },
      ]
    },
    assists: {
      MEN: [
        { rank: 1, name: 'Yacine Ait', club: 'CS Saint-Laurent', value: 7, subText: '7 Assists • 20 Matches', redWidth: '100%' },
        { rank: 2, name: 'Marc Leblanc', club: 'AS Blainville', value: 6, subText: '6 Assists • 20 Matches', redWidth: '86%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Audrey Gagnon', club: 'AS Blainville', value: 8, subText: '8 Assists • 11 Matches', redWidth: '100%' },
      ]
    },
    cleanSheets: {
      MEN: [
        { rank: 1, name: 'J. Echaavarria', club: 'CS Saint-Laurent', value: 9, subText: '9 Clean Sheets (20 Apps)', redWidth: '100%' },
      ],
      WOMEN: [
        { rank: 1, name: 'C. Gauthier', club: 'AS Blainville', value: 7, subText: '7 Clean Sheets (11 Apps)', redWidth: '100%' },
      ]
    },
    totw: {
      MEN: {
        week: 'MATCHWEEK 20',
        manager: 'Nicholas Rizi (CS Saint-Laurent)',
        note: 'Defensive block held firm under intense pressure as the Ligue1 Québec summit gap grew.',
        formation: '4-4-2',
        players: [{ pos: 'GK', name: 'J. Echaavarria', club: 'CS Saint-Laurent' }, { pos: 'FWD', name: 'A. Koné', club: 'CS Saint-Laurent' }]
      },
      WOMEN: {
        week: 'MATCHWEEK 11',
        manager: 'Roxanne Leblanc (AS Blainville)',
        note: 'Dominant midfield control and clinical finishing sealed a statement derby win.',
        formation: '4-3-3',
        players: [{ pos: 'GK', name: 'C. Gauthier', club: 'AS Blainville' }, { pos: 'FWD', name: 'M. Hamel', club: 'AS Blainville' }]
      }
    },
    hero: {
      MEN: {
        headline: 'CS SAINT-LAURENT OPENS GAP ATOP LIGUE1 QUÉBEC',
        summary: 'The reigning champions push their unbeaten run to eight as FC Laval and AS Blainville fight to close the distance.',
        time: '3H AGO',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop'
      },
      WOMEN: {
        headline: 'PROMOTED LAKESHORE SC STUN AS BLAINVILLE IN LIGUE1 FÉMININ',
        summary: 'One year removed from the Ligue2 title, Lakeshore SC hand the league\u2019s most successful club its first home defeat of the season.',
        time: '5H AGO',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop'
      }
    },
    dispatches: [
      { id: 'qc1', timestamp: '2H AGO', league: 'L1QC', headline: 'CS Saint-Laurent Eyes Ligue1 Québec Summit and 2027 Canadian Championship Berth', url: '#' },
      { id: 'qc2', timestamp: '6H AGO', league: 'LS PRO', headline: 'Inside LS Pro\u2019s Expansion to 49 Men\u2019s Clubs Across Three Tiers for 2026', url: '#' },
      { id: 'qc3', timestamp: '1D AGO', league: 'L1QC', headline: 'Promotion-Relegation Race Heats Up Between Ligue2 and Ligue3 Québec', url: '#' },
    ],
    originPins: [
      { name: 'Greater Montreal', count: 65, province: 'Québec', topProspects: ['Adama Koné', 'Maika Hamel'] },
      { name: 'Quebec City Hub', count: 28, province: 'Québec', topProspects: ['Guillaume Da Silva'] },
      { name: 'Outaouais Corridor', count: 14, province: 'Québec', topProspects: ['Marc-Antoine Fortin'] }
    ],
    fixtures: [
      { id: 'qc-f1', homeTeam: 'CS Saint-Laurent', awayTeam: 'FC Laval', kickoff: 'AUG 10 • 8:00 PM EST', venue: 'Stade Claude-Robillard', matchday: 'LIGUE1 • MATCHWEEK 21' },
      { id: 'qc-f2', homeTeam: 'AS Blainville', awayTeam: 'CS Mont-Royal Outremont', kickoff: 'AUG 11 • 7:00 PM EST', venue: 'Parc Blainville', matchday: 'LIGUE1 • MATCHWEEK 21' }
    ],
    disciplineLogs: [
      { id: 'qc-dl1', match: 'CS Saint-Laurent vs CS Mont-Royal Outremont', infraction: 'Serious foul play in midfield challenge', ruling: '2-match suspension issued', severity: 'SUSPENSION', timestamp: 'AUG 6' },
      { id: 'qc-dl2', match: 'AS Blainville vs FC Laval', infraction: 'Dissent towards match officials', ruling: 'Club fined $200', severity: 'FINE', timestamp: 'AUG 4' }
    ],
    videos: {
      MEN: {
        upcoming: [
          { id: 'qc-u1', title: 'CS Saint-Laurent vs FC Laval — Ligue1 Summit Clash', airDate: 'AUG 10, 2026 • 8:00 PM EST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-u2', title: 'AS Blainville vs CS Mont-Royal Outremont Preview', airDate: 'AUG 11, 2026 • 7:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-u3', title: "CF L'International de Québec vs Revolution FC (Ligue2) Preview", airDate: 'AUG 14, 2026 • 6:30 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-u4', title: 'AS Laval vs Ottawa South United Match Preview', airDate: 'AUG 16, 2026 • 8:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'qc-l1', title: 'CS Mont-Royal Outremont 1-2 AS Gatineau | Highlights', airDate: 'AUG 4, 2026', duration: '5:30', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-l2', title: 'CS Saint-Laurent 3-1 AS Blainville | Replay', airDate: 'AUG 2, 2026', duration: '1:42:10', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-l3', title: 'Royal-Sélect de Beauport 2-0 CS Longueuil Highlights', airDate: 'JUL 30, 2026', duration: '4:55', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-l4', title: "CS Vallée de l'Or 1-1 Granby Cosmos (Ligue3) Replay", airDate: 'JUL 27, 2026', duration: '1:38:00', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'qc-p1', title: 'Ligue1 Québec Championship Final 2025', airDate: 'OCT 4, 2025', duration: '11:45', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-p2', title: 'Top 5 Technical Skills in LS Pro Action', airDate: 'AUG 20, 2025', duration: '6:12', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-p3', title: 'Derby Day Drama in the Montreal Pro-Am Circuit', airDate: 'JUN 18, 2026', duration: '13:20', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-p4', title: 'Inside the New Ligue2 / Ligue3 Pyramid Expansion', airDate: 'JUL 15, 2026', duration: '15:10', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ]
      },
      WOMEN: {
        upcoming: [
          { id: 'qc-uw1', title: 'AS Blainville vs CS Saint-Laurent — Ligue1 Féminin Derby', airDate: 'AUG 11, 2026 • 7:00 PM EST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-uw2', title: 'Dynamo de Québec vs FC Laval Preview', airDate: 'AUG 13, 2026 • 6:30 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-uw3', title: 'CS Mont-Royal Outremont vs Lakeshore SC Preview', airDate: 'AUG 15, 2026 • 7:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-uw4', title: 'CS St-Hubert vs Royal-Sélect de Beauport (Ligue2) Preview', airDate: 'AUG 18, 2026 • 5:30 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'qc-lw1', title: 'Ligue1 Féminin Round 11 Highlights', airDate: 'AUG 3, 2026', duration: '4:50', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-lw2', title: 'AS Blainville 2-0 Dynamo de Québec Replay', airDate: 'AUG 1, 2026', duration: '1:35:00', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-lw3', title: 'FC Laval 3-2 CS Mont-Royal Outremont Highlights', airDate: 'JUL 29, 2026', duration: '6:10', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-lw4', title: 'Lakeshore SC 1-0 CS Saint-Laurent Replay', airDate: 'JUL 25, 2026', duration: '1:40:00', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'qc-pw1', title: 'Ligue1 Féminin All-Star Showcase 2025', airDate: 'SEP 15, 2025', duration: '9:30', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-pw2', title: 'Quebec\u2019s Female Pathway to the Northern Super League', airDate: 'JUN 28, 2026', duration: '12:40', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-pw3', title: 'Top 10 Goals of Ligue1 Féminin 2025', airDate: 'OCT 10, 2025', duration: '8:15', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'qc-pw4', title: 'Inside AS Blainville\u2019s High-Performance Academy', airDate: 'MAY 22, 2026', duration: '14:20', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' }
        ]
      }
    }
  },
  BC: {
    name: 'British Columbia (League1 BC)',
    tiers: ['PREMIER'],
    standings: {
      PREMIER: {
        MEN: [
          { pos: 1, club: 'TSS Rovers', pld: 16, wins: 11, pts: 36, gd: '+17', form: ['W', 'W', 'D', 'W', 'W'] },
          { pos: 2, club: 'Victoria Highlanders', pld: 16, wins: 9, pts: 30, gd: '+10', form: ['W', 'D', 'W', 'L', 'W'] },
          { pos: 3, club: 'Altitude FC', pld: 16, wins: 8, pts: 27, gd: '+4', form: ['D', 'W', 'L', 'W', 'D'] },
        ],
        WOMEN: [
          { pos: 1, club: 'Whitecaps FC Girls Elite', pld: 16, wins: 14, pts: 44, gd: '+32', form: ['W', 'W', 'W', 'W', 'W'] },
          { pos: 2, club: 'Burnaby FC', pld: 16, wins: 10, pts: 33, gd: '+12', form: ['W', 'D', 'W', 'L', 'W'] },
        ]
      },
      CHAMPIONSHIP: { MEN: [], WOMEN: [] },
      LEAGUE2: { MEN: [], WOMEN: [] }
    },
    goldenBoot: {
      MEN: [
        { rank: 1, name: 'Ivan Mejia', club: 'TSS Rovers', value: 12, subText: '12 Goals • 0.75 GPM • 8.1 RTG', redWidth: '100%' },
        { rank: 2, name: 'Caleb Clarke', club: 'Victoria Highlanders', value: 10, subText: '10 Goals • 0.65 GPM • 7.8 RTG', redWidth: '83%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Annabelle Chukwu', club: 'Whitecaps FC Elite', value: 15, subText: '15 Goals • 0.95 GPM • 8.6 RTG', redWidth: '100%' },
      ]
    },
    avgGoals: {
      MEN: [
        { rank: 1, name: 'Ivan Mejia', club: 'TSS Rovers', value: 0.75, subText: '0.75 G/M (12 in 16)', redWidth: '75%', whiteWidth: '90%' },
        { rank: 2, name: 'Caleb Clarke', club: 'Victoria High', value: 0.65, subText: '0.65 G/M (10 in 15)', redWidth: '65%', whiteWidth: '85%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Annabelle Chukwu', club: 'Whitecaps Elite', value: 0.95, subText: '0.95 G/M (15 in 16)', redWidth: '95%', whiteWidth: '90%' },
      ]
    },
    assists: {
      MEN: [
        { rank: 1, name: 'Erikson Boya', club: 'TSS Rovers', value: 6, subText: '6 Assists • 16 Matches', redWidth: '100%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Jordyn Huitema-W', club: 'Whitecaps Elite', value: 8, subText: '8 Assists • 16 Matches', redWidth: '100%' },
      ]
    },
    cleanSheets: {
      MEN: [
        { rank: 1, name: 'M. Shakes', club: 'TSS Rovers', value: 7, subText: '7 Clean Sheets (16 Apps)', redWidth: '100%' },
      ],
      WOMEN: [
        { rank: 1, name: 'D. Mckechnie', club: 'Whitecaps Elite', value: 9, subText: '9 Clean Sheets (16 Apps)', redWidth: '100%' },
      ]
    },
    totw: {
      MEN: {
        week: 'MATCHWEEK 16',
        manager: 'Will Cromack (TSS Rovers)',
        note: 'High-energy press on the artificial turf dismantled visiting backline.',
        formation: '4-3-3',
        players: [{ pos: 'GK', name: 'M. Shakes', club: 'TSS Rovers' }, { pos: 'FWD', name: 'I. Mejia', club: 'TSS Rovers' }]
      },
      WOMEN: {
        week: 'MATCHWEEK 16',
        manager: 'Katie Collar (Whitecaps Elite)',
        note: 'Clinical transition play secured coastal derby dominance.',
        formation: '4-2-3-1',
        players: [{ pos: 'GK', name: 'D. Mckechnie', club: 'Whitecaps Elite' }, { pos: 'FWD', name: 'A. Chukwu', club: 'Whitecaps Elite' }]
      }
    },
    hero: {
      MEN: {
        headline: 'SURREY SURGE INTO SEMIFINALS WITH LATE STOPPAGE WINNER',
        summary: 'Dominant defensive display anchors a crucial provincial tournament victory on the road.',
        time: '4H AGO',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop'
      },
      WOMEN: {
        headline: 'WHITECAPS ELITE CONTINUE UNSTOPPABLE PRO-AM RUN',
        summary: 'Young academy stars put on a passing clinic at Swangard Stadium.',
        time: '6H AGO',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
      }
    },
    dispatches: [
      { id: 'bc1', timestamp: '3H AGO', league: 'L1BC', headline: 'BC’s Grassroots Academies Producing Next Wave of National Talent', url: '#' },
    ],
    originPins: [
      { name: 'Lower Mainland', count: 58, province: 'British Columbia', topProspects: ['Ivan Mejia', 'Annabelle Chukwu'] },
      { name: 'Vancouver Island', count: 31, province: 'British Columbia', topProspects: ['Caleb Clarke'] }
    ],
    fixtures: [
      { id: 'bc-f1', homeTeam: 'TSS Rovers', awayTeam: 'Altitude FC', kickoff: 'AUG 10 • 9:00 PM EST', venue: 'Swangard Stadium', matchday: 'MATCHWEEK 17' },
      { id: 'bc-f2', homeTeam: 'Victoria Highlanders', awayTeam: 'Whitecaps FC Girls Elite', kickoff: 'AUG 11 • 8:00 PM EST', venue: 'Royal Athletic Park', matchday: 'MATCHWEEK 17' }
    ],
    disciplineLogs: [
      { id: 'bc-dl1', match: 'TSS Rovers vs Victoria Highlanders', infraction: 'Reckless tackle from behind', ruling: '1-match suspension upheld', severity: 'SUSPENSION', timestamp: 'AUG 6' },
      { id: 'bc-dl2', match: 'Altitude FC vs Burnaby FC', infraction: 'Accumulation of 5 yellow cards', ruling: 'Club fined $200', severity: 'FINE', timestamp: 'AUG 5' }
    ],
    videos: {
      MEN: {
        upcoming: [
          { id: 'bc-u1', title: 'TSS Rovers vs Altitude FC Coastal Derby', airDate: 'AUG 10, 2026 • 9:00 PM EST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-u2', title: 'Victoria Highlanders vs Langley United Preview', airDate: 'AUG 12, 2026 • 8:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-u3', title: 'Rivers FC vs Unity FC Match Preview', airDate: 'AUG 14, 2026 • 7:30 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-u4', title: 'Burnaby FC vs Whitecaps Sub Match Preview', airDate: 'AUG 16, 2026 • 6:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'bc-l1', title: 'Victoria Highlanders 2-0 Rivers FC | Match Highlights', airDate: 'AUG 4, 2026', duration: '5:10', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-l2', title: 'TSS Rovers 3-1 Altitude FC | Full Replay', airDate: 'AUG 2, 2026', duration: '1:45:00', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-l3', title: 'Langley United 2-1 Unity FC Highlights', airDate: 'JUL 30, 2026', duration: '6:00', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-l4', title: 'Burnaby FC 0-0 Whitecaps Sub Replay', airDate: 'JUL 26, 2026', duration: '1:36:00', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'bc-p1', title: 'League1 BC Fans-Owned Culture: TSS Rovers Story', airDate: 'AUG 18, 2025', duration: '13:50', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-p2', title: 'Swangard Stadium Atmosphere & L1BC Final', airDate: 'OCT 2, 2025', duration: '10:20', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-p3', title: 'Top 10 Coastal Derby Goals in L1BC History', airDate: 'SEP 10, 2025', duration: '8:30', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-p4', title: 'Vancouver Island Grassroots Talent Pipeline', airDate: 'JUL 12, 2026', duration: '16:00', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ]
      },
      WOMEN: {
        upcoming: [
          { id: 'bc-uw1', title: 'Whitecaps Elite vs Burnaby FC Pro-Am', airDate: 'AUG 11, 2026 • 8:00 PM EST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-uw2', title: 'Langley United Women vs Altitude Preview', airDate: 'AUG 13, 2026 • 7:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-uw3', title: 'TSS Rovers Women vs Victoria Highlanders Preview', airDate: 'AUG 15, 2026 • 6:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-uw4', title: 'Unity FC Women vs Rivers FC Preview', airDate: 'AUG 17, 2026 • 8:30 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'bc-lw1', title: 'Langley United 1-3 Whitecaps Elite Highlights', airDate: 'AUG 3, 2026', duration: '6:15', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-lw2', title: 'Whitecaps Elite 4-0 TSS Rovers | Replay', airDate: 'AUG 1, 2026', duration: '1:40:00', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-lw3', title: 'Altitude FC 2-1 Victoria Highlanders Highlights', airDate: 'JUL 29, 2026', duration: '5:40', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-lw4', title: 'Unity FC 1-1 Burnaby FC Women Replay', airDate: 'JUL 25, 2026', duration: '1:32:00', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'bc-pw1', title: 'League1 BC Women\'s Championship Final Classic', airDate: 'SEP 20, 2025', duration: '12:00', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-pw2', title: 'Whitecaps Girls Elite Pathway into CanWNT', airDate: 'JUL 05, 2026', duration: '11:15', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-pw3', title: 'Top 10 L1BC Women Goals & Assists 2025', airDate: 'OCT 05, 2025', duration: '8:50', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'bc-pw4', title: 'West Coast Pro-Am Women Development Summit', airDate: 'JUN 10, 2026', duration: '15:40', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' }
        ]
      }
    }
  },
  AB: {
    name: 'Alberta (League1 Alberta)',
    tiers: ['PREMIER'],
    standings: {
      PREMIER: {
        MEN: [
          { pos: 1, club: 'Calgary Foothills', pld: 14, wins: 10, pts: 32, gd: '+16', form: ['W', 'W', 'D', 'W', 'W'] },
          { pos: 2, club: 'Cavalry FC U21', pld: 14, wins: 9, pts: 28, gd: '+11', form: ['W', 'D', 'W', 'L', 'W'] },
          { pos: 3, club: 'Edmonton Scottish', pld: 14, wins: 8, pts: 25, gd: '+6', form: ['D', 'W', 'L', 'W', 'D'] },
        ],
        WOMEN: [
          { pos: 1, club: 'Calgary Wild Pro-Am', pld: 14, wins: 11, pts: 35, gd: '+20', form: ['W', 'W', 'W', 'D', 'W'] },
          { pos: 2, club: 'Edmonton Northwest', pld: 14, wins: 8, pts: 26, gd: '+8', form: ['W', 'D', 'L', 'W', 'W'] },
        ]
      },
      CHAMPIONSHIP: { MEN: [], WOMEN: [] },
      LEAGUE2: { MEN: [], WOMEN: [] }
    },
    goldenBoot: {
      MEN: [
        { rank: 1, name: 'Mason Trafford Jr.', club: 'Calgary Foothills', value: 11, subText: '11 Goals • 0.78 GPM • 8.0 RTG', redWidth: '100%' },
        { rank: 2, name: 'Liam O’Brien', club: 'Edmonton Scottish', value: 9, subText: '9 Goals • 0.64 GPM • 7.8 RTG', redWidth: '81%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Chloe Watson', club: 'Calgary Wild Pro-Am', value: 13, subText: '13 Goals • 0.92 GPM • 8.3 RTG', redWidth: '100%' },
      ]
    },
    avgGoals: {
      MEN: [
        { rank: 1, name: 'Mason Trafford Jr.', club: 'Calgary Foothills', value: 0.78, subText: '0.78 G/M (11 in 14)', redWidth: '78%', whiteWidth: '90%' },
        { rank: 2, name: 'Liam O’Brien', club: 'Edmonton Scottish', value: 0.64, subText: '0.64 G/M (9 in 14)', redWidth: '64%', whiteWidth: '85%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Chloe Watson', club: 'Calgary Wild Pro-Am', value: 0.92, subText: '0.92 G/M (13 in 14)', redWidth: '92%', whiteWidth: '90%' },
      ]
    },
    assists: {
      MEN: [
        { rank: 1, name: 'Nikki Sharma', club: 'Calgary Foothills', value: 5, subText: '5 Assists • 14 Matches', redWidth: '100%' },
      ],
      WOMEN: [
        { rank: 1, name: 'Megan Smith', club: 'Calgary Wild Pro-Am', value: 6, subText: '6 Assists • 14 Matches', redWidth: '100%' },
      ]
    },
    cleanSheets: {
      MEN: [
        { rank: 1, name: 'J. Hill', club: 'Calgary Foothills', value: 6, subText: '6 Clean Sheets (14 Apps)', redWidth: '100%' },
      ],
      WOMEN: [
        { rank: 1, name: 'S. Macleod', club: 'Calgary Wild', value: 7, subText: '7 Clean Sheets (14 Apps)', redWidth: '100%' },
      ]
    },
    totw: {
      MEN: {
        week: 'MATCHWEEK 14',
        manager: 'Tommy Wheeldon Sr. (Foothills)',
        note: 'Tactical discipline and counter-pressing choked out opponent build-up.',
        formation: '4-3-3',
        players: [{ pos: 'GK', name: 'J. Hill', club: 'Calgary Foothills' }, { pos: 'FWD', name: 'M. Trafford', club: 'Calgary Foothills' }]
      },
      WOMEN: {
        week: 'MATCHWEEK 14',
        manager: 'Jorrit Dykstra (Calgary Wild)',
        note: 'Relentless offensive pressure secured the provincial shield lead.',
        formation: '4-2-3-1',
        players: [{ pos: 'GK', name: 'S. Macleod', club: 'Calgary Wild' }, { pos: 'FWD', name: 'C. Watson', club: 'Calgary Wild' }]
      }
    },
    hero: {
      MEN: {
        headline: 'CALGARY CLASH LIGHTS UP FOOTHILLS IN FIVE-GOAL THRILLER',
        summary: 'Late surge seals all three points in front of a roaring provincial crowd.',
        time: '5H AGO',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
      },
      WOMEN: {
        headline: 'EDMONTON STRIKER SETS NEW PROVINCIAL SCORING MARK',
        summary: 'Clinical finishing highlights an unforgettable afternoon at Clarke Stadium.',
        time: '7H AGO',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop'
      }
    },
    dispatches: [
      { id: 'ab1', timestamp: '4H AGO', league: 'L1AB', headline: 'Calgary Foothills Academy Highlights Pathway into CPL', url: '#' },
    ],
    originPins: [
      { name: 'Calgary Corridor', count: 45, province: 'Alberta', topProspects: ['Mason Trafford Jr.', 'Chloe Watson'] },
      { name: 'Edmonton Region', count: 34, province: 'Alberta', topProspects: ['Liam O’Brien'] }
    ],
    fixtures: [
      { id: 'ab-f1', homeTeam: 'Calgary Foothills', awayTeam: 'Cavalry FC U21', kickoff: 'AUG 10 • 7:30 PM MST', venue: 'Foothills Athletic Park', matchday: 'MATCHWEEK 15' },
      { id: 'ab-f2', homeTeam: 'Edmonton Scottish', awayTeam: 'Calgary Wild Pro-Am', kickoff: 'AUG 11 • 6:30 PM MST', venue: 'Clarke Stadium', matchday: 'MATCHWEEK 15' }
    ],
    disciplineLogs: [
      { id: 'ab-dl1', match: 'Calgary Foothills vs Edmonton Scottish', infraction: 'Violent conduct off the ball', ruling: '3-match suspension upheld', severity: 'SUSPENSION', timestamp: 'AUG 6' },
      { id: 'ab-dl2', match: 'Cavalry FC U21 vs Calgary Wild Pro-Am', infraction: 'Persistent time-wasting', ruling: 'Formal warning issued', severity: 'WARNING', timestamp: 'AUG 5' }
    ],
    videos: {
      MEN: {
        upcoming: [
          { id: 'ab-u1', title: 'Calgary Foothills vs Cavalry FC U21 Alberta Derby', airDate: 'AUG 10, 2026 • 7:30 PM EST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-u2', title: 'Edmonton Scottish vs BTB Academy Preview', airDate: 'AUG 12, 2026 • 6:30 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-u3', title: 'Calgary Rangers SC vs Foothills U21 Preview', airDate: 'AUG 14, 2026 • 7:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-u4', title: 'St. Albert Impact vs Cavalry U21 Match Preview', airDate: 'AUG 16, 2026 • 8:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'ab-l1', title: 'Edmonton Scottish 3-1 BTB Academy | Highlights', airDate: 'AUG 4, 2026', duration: '4:45', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-l2', title: 'Calgary Foothills 2-2 Cavalry FC U21 | Replay', airDate: 'AUG 2, 2026', duration: '1:39:00', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-l3', title: 'St. Albert Impact 1-0 Calgary Rangers Replay', airDate: 'JUL 30, 2026', duration: '1:30:00', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-l4', title: 'Edmonton Scottish 4-2 Foothills Highlights', airDate: 'JUL 26, 2026', duration: '6:20', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'ab-p1', title: 'League1 Alberta Inaugural Championship Season Review', airDate: 'OCT 10, 2025', duration: '10:15', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-p2', title: 'Prairie Pro-Am Talent Pipeline into CPL Clubs', alt: 'Prairie Soccer', airDate: 'JUL 22, 2025', duration: '9:10', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-p3', title: 'Top 10 Alberta Pro-Am Goals 2025 Season', airDate: 'SEP 25, 2025', duration: '7:50', thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-p4', title: 'Calgary Foothills Academy Development History', airDate: 'JUN 05, 2026', duration: '14:10', thumbnailUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop' }
        ]
      },
      WOMEN: {
        upcoming: [
          { id: 'ab-uw1', title: 'Calgary Wild Pro-Am vs Edmonton Northwest', airDate: 'AUG 11, 2026 • 6:30 PM EST', duration: 'LIVE STREAM', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-uw2', title: 'St. Albert Impact Women vs Calgary Foothills Preview', airDate: 'AUG 13, 2026 • 6:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-uw3', title: 'Edmonton Scottish Women vs Wild Pro-Am Preview', airDate: 'AUG 15, 2026 • 7:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-uw4', title: 'Cavalry Women vs Edmonton Northwest Preview', airDate: 'AUG 18, 2026 • 5:00 PM EST', duration: 'PREVIEW', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' }
        ],
        lastWeek: [
          { id: 'ab-lw1', title: 'Calgary Wild 2-0 St. Albert Impact Highlights', airDate: 'AUG 3, 2026', duration: '5:00', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-lw2', title: 'Calgary Wild Pro-Am 3-1 Edmonton Northwest | Replay', airDate: 'AUG 1, 2026', duration: '1:38:00', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-lw3', title: 'St. Albert Impact 2-2 Edmonton Scottish Highlights', airDate: 'JUL 28, 2026', duration: '6:10', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-lw4', title: 'Calgary Foothills Women 1-0 Wild Pro-Am Replay', airDate: 'JUL 24, 2026', duration: '1:34:00', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' }
        ],
        popular: [
          { id: 'ab-pw1', title: 'League1 Alberta Women Championship Final', airDate: 'SEP 28, 2025', duration: '11:20', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-pw2', title: 'Calgary Wild Pro-Am Inaugural Season Retrospective', airDate: 'JUL 02, 2026', duration: '10:45', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-pw3', title: 'Top 10 L1AB Women Goals 2025 Season', airDate: 'OCT 08, 2025', duration: '7:20', thumbnailUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
          { id: 'ab-pw4', title: 'Prairie Women Pro-Am Talent Showcase', airDate: 'JUN 15, 2026', duration: '13:10', thumbnailUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' }
        ]
      }
    }
  }
};