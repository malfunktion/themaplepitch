export default {
  name: 'newsWire',
  title: 'News Wire Dispatches',
  type: 'document',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'summary',
      title: 'AI / Editorial Summary (1-2 sentences)',
      type: 'text',
      rows: 2,
    },
    {
      name: 'sourceName',
      title: 'Source Name (e.g. TSN, OneSoccer, Athletic)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'sourceUrl',
      title: 'Original Article URL (Outbound Link)',
      type: 'url',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category Tag',
      type: 'string',
      description: 'Vocabulary matches the League type in src/lib/types.ts, used across the homepage hero and The Wire.',
      options: {
        list: [
          { title: 'CPL', value: 'CPL' },
          { title: 'NSL', value: 'NSL' },
          { title: 'MLS', value: 'MLS' },
          { title: 'CanMNT', value: 'CanMNT' },
          { title: 'CanWNT', value: 'CanWNT' },
          { title: 'Provincial', value: 'Provincial' },
          { title: 'Transfers', value: 'Transfers' },
          { title: 'Abroad', value: 'Abroad' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subCategory',
      title: 'Sub-Category (e.g. L1O, L1BC, L1QC)',
      type: 'string',
      hidden: ({ document }: any) => document?.category !== 'Provincial',
    },
    {
      name: 'thumbnailUrl',
      title: 'Thumbnail Image URL',
      type: 'url',
    },
    {
      name: 'gender',
      title: 'Gender (if applicable)',
      type: 'string',
      description: 'Leave unset for general/transfer news that isn\'t gender-specific.',
      options: {
        list: [
          { title: 'Men', value: 'Men' },
          { title: 'Women', value: 'Women' },
          { title: 'Not applicable', value: 'Not applicable' },
        ],
      },
    },
    {
      name: 'storyType',
      title: 'Story Type',
      type: 'string',
      options: {
        list: [
          { title: 'Transfer', value: 'transfer' },
          { title: 'Result', value: 'result' },
          { title: 'Milestone', value: 'milestone' },
          { title: 'General', value: 'general' },
          { title: 'Scouting', value: 'scouting' },
        ],
      },
      initialValue: 'general',
    },
    {
      name: 'relatedPlayers',
      title: 'Related Players (names)',
      description: 'Plain player names for tagging/search — not a reference, since players aren\'t modelled in Sanity yet.',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'sourceId',
      title: 'Source ID (for de-dup)',
      description: 'Used by the ingestion pipeline to avoid creating duplicate drafts of the same article. Not shown/needed for manual entries.',
      type: 'string',
    },
    {
      name: 'ingestConfidence',
      title: 'Ingestion Confidence',
      description: 'How confident the ingestion pipeline was that this is a relevant, well-classified story. Blank for manually-entered stories.',
      type: 'string',
      options: {
        list: [
          { title: 'High', value: 'high' },
          { title: 'Medium', value: 'medium' },
          { title: 'Low', value: 'low' },
        ],
      },
    },
    {
      name: 'publishedAt',
      title: 'Publication / Ingest Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'isHero',
      title: '★ Pin as Main Hero Story of the Day',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isApproved',
      title: 'Approved for Live Site',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'sourceName',
      isHero: 'isHero',
      isApproved: 'isApproved',
      confidence: 'ingestConfidence',
    },
    prepare({ title, subtitle, isHero, isApproved, confidence }: any) {
      const heroTag = isHero ? '🔥 [HERO] ' : '';
      const statusTag = isApproved ? '✅' : '⏳ [PENDING]';
      const confidenceTag = confidence ? ` · conf: ${confidence}` : '';
      return {
        title: `${heroTag}${title}`,
        subtitle: `${statusTag} ${subtitle}${confidenceTag}`,
      };
    },
  },
};
