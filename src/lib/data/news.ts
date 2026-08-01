import type { WireStory } from "@/lib/types";

/**
 * Placeholder data until The Wire's RSS-ingestion pipeline and the
 * Supabase `news_wire` table exist. `getWireStories()` is written as
 * an async function on purpose — swapping the body for a real
 * Supabase `.select()` call later won't require touching any of the
 * components that call it.
 */
export async function getWireStories(): Promise<WireStory[]> {
  return [
    {
      id: "1",
      headline: "Koné Targets Move to Europe; Leeds United Interested",
      summary:
        "Reporting links the CPL Golden Boot leader with a January move, pending work-permit clearance.",
      league: "Abroad",
      sourceName: "TSN",
      sourceUrl: "https://example.com/source-article",
      thumbnailUrl: null,
      publishedAt: new Date().toISOString(),
      isEditorPick: true,
    },
    {
      id: "2",
      headline: "AFC Toronto Clinch Home Playoff Spot with Late Winner",
      summary:
        "A stoppage-time header secures top spot in the NSL table heading into the final matchday.",
      league: "NSL",
      sourceName: "The Northern Kick",
      sourceUrl: "https://example.com/source-article",
      thumbnailUrl: null,
      publishedAt: new Date().toISOString(),
      isEditorPick: false,
    },
    {
      id: "3",
      headline: "Canada Confirms September Friendly Double-Header",
      summary:
        "CanMNT will play two September dates as part of continued World Cup preparation.",
      league: "CanMNT",
      sourceName: "Canada Soccer",
      sourceUrl: "https://example.com/source-article",
      thumbnailUrl: null,
      publishedAt: new Date().toISOString(),
      isEditorPick: false,
    },
  ];
}
