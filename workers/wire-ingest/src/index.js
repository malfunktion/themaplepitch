/**
 * The Maple Pitch — Wire Ingest Worker
 *
 * Runs on a schedule (see wrangler.toml [triggers]). For each RSS source
 * below: fetches the feed, keeps items from the last LOOKBACK_DAYS days,
 * skips anything already ingested (by sourceId = article URL), and writes
 * the rest into Sanity's `newsWire` as unapproved drafts (isApproved: false).
 *
 * Nothing here ever sets isApproved: true. Every item still has to be
 * opened and approved by hand in Sanity Studio — this only saves the
 * typing, not the review.
 *
 * No LLM/classification step (deliberately deferred — see
 * news-wire-aggregation-plan.md Part C). `category` is left unset on
 * purpose: the newsWire schema requires it before a document can be
 * Published, so leaving it blank forces a category choice at approval
 * time instead of guessing one here.
 */

const SOURCES = [
  { name: 'Northern Tribune', url: 'https://northerntribune.ca/feed/' },
  { name: 'TFC Republic', url: 'https://www.tfcrepublic.ca/rss/' },
];

// 1. Assign the worker object to a named variable to satisfy ESLint
const wireIngestWorker = {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runIngest(env));
  },

  // Manual trigger for testing without waiting for the cron:
  //   https://<worker-url>/?key=<MANUAL_TRIGGER_KEY>
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!env.MANUAL_TRIGGER_KEY || key !== env.MANUAL_TRIGGER_KEY) {
      return new Response('Not found', { status: 404 });
    }
    const result = await runIngest(env);
    return new Response(JSON.stringify(result, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

// 2. Export the named variable
export default wireIngestWorker;

async function runIngest(env) {
  const lookbackDays = parseInt(env.LOOKBACK_DAYS || '30', 10);
  const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;

  const summary = { checked: 0, withinLookback: 0, alreadyIngested: 0, created: 0, errors: [] };
  const candidates = [];

  for (const source of SOURCES) {
    try {
      const items = await fetchAndParseFeed(source.url);
      summary.checked += items.length;
      for (const item of items) {
        const publishedAt = parseRssDate(item.pubDate);
        if (new Date(publishedAt).getTime() < cutoff) continue;
        if (!item.link) continue;
        summary.withinLookback += 1;
        candidates.push({
          sourceId: item.link.trim(),
          headline: decodeEntities(item.title || '(untitled)'),
          summary: truncate(stripHtml(decodeEntities(item.description || '')), 400),
          sourceName: source.name,
          sourceUrl: item.link.trim(),
          publishedAt,
        });
      }
    } catch (err) {
      summary.errors.push(`${source.name}: ${err.message}`);
    }
  }

  if (candidates.length === 0) return summary;

  const existingIds = await getExistingSourceIds(
    env,
    candidates.map((c) => c.sourceId)
  );
  const toCreate = candidates.filter((c) => !existingIds.has(c.sourceId));
  summary.alreadyIngested = candidates.length - toCreate.length;

  if (toCreate.length > 0) {
    await createDrafts(env, toCreate);
    summary.created = toCreate.length;
  }

  return summary;
}

async function fetchAndParseFeed(feedUrl) {
  const res = await fetch(feedUrl, {
    headers: { 'User-Agent': 'TheMaplePitch-WireIngest/1.0 (+https://themaplepitch.ca)' },
  });
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const xml = await res.text();
  return parseRssItems(xml);
}

function parseRssItems(xml) {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  return blocks.map((block) => ({
    title: extractTag(block, 'title'),
    link: extractTag(block, 'link'),
    description: extractTag(block, 'description'),
    pubDate: extractTag(block, 'pubDate'),
  }));
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!match) return '';
  let value = match[1].trim();
  const cdata = value.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  if (cdata) value = cdata[1].trim();
  return value;
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1).trim() + '…';
}

function parseRssDate(pubDate) {
  const parsed = new Date(pubDate);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

async function sanityQuery(env, groq, params = {}) {
  const url = new URL(
    `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v${env.SANITY_API_VERSION}/data/query/${env.SANITY_DATASET}`
  );
  url.searchParams.set('query', groq);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.result;
}

async function getExistingSourceIds(env, sourceIds) {
  if (sourceIds.length === 0) return new Set();
  const result = await sanityQuery(
    env,
    `*[_type == "newsWire" && sourceId in $ids].sourceId`,
    { ids: sourceIds }
  );
  return new Set(result || []);
}

async function createDrafts(env, items) {
  if (!env.SANITY_WRITE_TOKEN) {
    throw new Error('SANITY_WRITE_TOKEN is not set — see workers/wire-ingest/README.md');
  }
  const mutations = items.map((item) => ({
    create: {
      _type: 'newsWire',
      headline: item.headline,
      summary: item.summary,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      sourceId: item.sourceId,
      publishedAt: item.publishedAt,
      isApproved: false,
      isHero: false,
      storyType: 'general',
    },
  }));

  const res = await fetch(
    `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v${env.SANITY_API_VERSION}/data/mutate/${env.SANITY_DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
  if (!res.ok) throw new Error(`Sanity mutate failed: ${res.status} ${await res.text()}`);
}
