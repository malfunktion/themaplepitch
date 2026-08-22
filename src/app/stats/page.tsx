// In src/app/stats/page.tsx:
import { getCplStandings, getNslStandings, getMlsStandings, getNwslStandings } from '@/lib/data/standings';

// Inside your StatsPage component where data is fetched:
const [cpl, nsl, mls, nwsl] = await Promise.all([
  getCplStandings(),
  getNslStandings(),
  getMlsStandings(),
  getNwslStandings()
]);

// Pass them into SidebarStack:
<SidebarStack 
  standings={cpl} 
  nslStandings={nsl} 
  mlsStandings={mls} 
  nwslStandings={nwsl} 
/>
