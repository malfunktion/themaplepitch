// scripts/check-api-quotas.mjs
import fetch from 'node-fetch';

const APIFOOTBALL_KEY = process.env.APIFOOTBALL_KEY || process.env.RAPIDAPI_KEY || '123';
const THESPORTSDB_KEY = process.env.THESPORTSDB_KEY || '5c5b3e3c9a98dd5a09969018da39aa37';

async function checkApiQuotas() {
  console.log('\n🔍 Checking API Quotas & Status...\n');
  console.log('========================================');

  // 1. API-Football (API-Sports)
  try {
    const res = await fetch('https://v3.football.api-sports.io/status', {
      headers: { 'x-apisports-key': APIFOOTBALL_KEY }
    });
    
    const remaining = res.headers.get('x-ratelimit-requests-remaining');
    const limit = res.headers.get('x-ratelimit-requests-limit');
    const minuteRem = res.headers.get('x-ratelimit-remaining');

    if (res.ok) {
      const data = await res.json();
      console.log(`[API-FOOTBALL]`);
      console.log(`- Daily Requests Left: ${remaining !== null ? remaining : 'N/A'} / ${limit !== null ? limit : 'N/A'}`);
      console.log(`- Per-Minute Left: ${minuteRem !== null ? minuteRem : 'N/A'}`);
      if (data.response && data.response.subscription) {
        console.log(`- Subscription Plan: ${data.response.subscription.plan} (${data.response.subscription.active ? 'Active' : 'Inactive'})`);
      }
    } else {
      console.log(`[API-FOOTBALL]`);
      console.log(`- Status: Error ${res.status} (Check your API Key)`);
    }
  } catch (err) {
    console.log(`[API-FOOTBALL]\n- Error: ${err.message}`);
  }

  console.log('----------------------------------------');

  // 2. TheSportsDB
  try {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}/all_leagues.php`);
    if (res.ok) {
      console.log(`[THESPORTSDB]`);
      console.log(`- Status: Connected / Key Active`);
      console.log(`- Daily / Monthly Quota: Managed via Tier (Enforced max ~100 requests/minute)`);
    } else {
      console.log(`[THESPORTSDB]`);
      console.log(`- Status: Error ${res.status} (Invalid Key or Restricted)`);
    }
  } catch (err) {
    console.log(`[THESPORTSDB]\n- Error: ${err.message}`);
  }

  console.log('----------------------------------------');

  // 3. Canada Soccer API
  try {
    const res = await fetch('https://canadasoccerapi.com/api/teams');
    if (res.ok) {
      console.log(`[CANADA SOCCER API]`);
      console.log(`- Status: Online / Public Open Access`);
      console.log(`- Quota Left: Unlimited (No Key Required)`);
    } else {
      console.log(`[CANADA SOCCER API]`);
      console.log(`- Status: Error ${res.status}`);
    }
  } catch (err) {
    console.log(`[CANADA SOCCER API]\n- Error: ${err.message}`);
  }

  console.log('========================================\n');
}

checkApiQuotas();
