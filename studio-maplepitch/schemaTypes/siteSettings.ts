export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'tournamentBannerActive',
      title: 'Show Tournament Banner',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'tournamentBannerText',
      title: 'Tournament Banner Text',
      description: 'e.g. "NSL KICKOFF WEEK — CLICK HERE"',
      type: 'string',
      hidden: ({ document }: any) => !document?.tournamentBannerActive,
    },
    {
      name: 'tournamentBannerUrl',
      title: 'Tournament Banner Link (optional)',
      type: 'url',
      hidden: ({ document }: any) => !document?.tournamentBannerActive,
    },
  ],
  preview: {
    select: {
      active: 'tournamentBannerActive',
      text: 'tournamentBannerText',
    },
    prepare({ active, text }: any) {
      return {
        title: 'Site Settings',
        subtitle: active ? `🟢 Banner live: ${text || '(no text set)'}` : '⚪ Banner off',
      };
    },
  },
};
