// src/lib/data/newsWire.ts
import { client } from '@/lib/sanity';
import { mapNewsWireCategoryToLeague } from '@/lib/types';
import type { WireStory } from '@/lib/types';

type GetWireFeedOptions = {
  limit?: number;
  category?: string;
  gender?: string;
};

type RawNewsWireDoc = {
  _id: string;
  headline: string;
  summary?: string;
  category?: string;
  subCategory?: string;
  sourceName: string;
  sourceUrl: string;
  thumbnailUrl?: string | null;
  publishedAt?: string;
  gender?: WireStory['gender'];
  storyType?: string;
  relatedPlayers?: string[];
  isHero?: boolean;
};

// "2H AGO" / "35M AGO" style, matching the wire page's visual language —
// this keeps getting reverted back to toLocaleTimeString() (a wall-clock
// time like "3:45:12 PM") in later edits, so re-fixing it again.
function formatRelativeTimestamp(iso: string | undefined): string {
  if (!iso) return 'RECENT';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'JUST NOW';
  if (minutes < 60) return `${minutes}M AGO`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.round(hours / 24);
  return `${days}D AGO`;
}

export async function getWireFeed(options: GetWireFeedOptions = {}): Promise<WireStory[]> {
  const { limit, category, gender } = options;
  const filters = ['_type == "newsWire"', 'isApproved == true'];
  if (category) filters.push(`category == $category`);
  if (gender) filters.push(`gender == $gender`);

  const groq = `*[${filters.join(' && ')}] | order(isHero desc, publishedAt desc)${limit ? `[0...${limit}]` : ''} {
    _id,
    headline,
    summary,
    category,
    subCategory,
    sourceName,
    sourceUrl,
    thumbnailUrl,
    publishedAt,
    gender,
    storyType,
    relatedPlayers,
    isHero
  }`;

  try {
    const docs: RawNewsWireDoc[] = await client.fetch(
      groq,
      { category, gender },
      { cache: 'no-store' }
    );
    return docs.map((doc) => ({
      id: doc._id,
      headline: doc.headline,
      summary: doc.summary || '',
      league: mapNewsWireCategoryToLeague(doc.category),
      sourceName: doc.sourceName,
      sourceUrl: doc.sourceUrl,
      thumbnailUrl: doc.thumbnailUrl || null,
      publishedAt: doc.publishedAt || new Date().toISOString(),
      isEditorPick: false,
      gender: doc.gender,
      storyType: doc.storyType,
      relatedPlayers: doc.relatedPlayers,
      isApproved: true,
      isHero: doc.isHero || false,
      // "Data drop" is the wire page's visual treatment for milestone
      // stories (stat thresholds, cap counts, etc.) — was hardcoded to
      // false again in a later edit, ignoring storyType entirely.
      isDataDrop: doc.storyType === 'milestone',
      category: doc.category || 'CPL',
      subCategory: doc.subCategory,
      timestamp: formatRelativeTimestamp(doc.publishedAt),
    }));
  } catch (error) {
    console.error('getWireFeed fetch failed:', error);
    return [];
  }
}
