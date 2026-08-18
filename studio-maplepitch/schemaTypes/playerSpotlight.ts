import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'playerSpotlight',
  title: 'Player Spotlight',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Player Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Player Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gender',
      title: 'Program Gender',
      type: 'string',
      options: {
        list: [
          { title: "Men's Program", value: 'men' },
          { title: "Women's Program", value: 'women' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      placeholder: 'e.g. ST / RW',
    }),
    defineField({
      name: 'club',
      title: 'Current Club',
      type: 'string',
      placeholder: 'e.g. Forge FC',
    }),
    defineField({
      name: 'vitals',
      title: 'Vitals / Badge Text',
      type: 'string',
      placeholder: 'e.g. 25 YRS // 55 CAPS or CPL // GOLDEN BOOT',
    }),
    defineField({
      name: 'tag',
      title: 'Category Tag',
      type: 'string',
      placeholder: 'e.g. CanMNT, CanWNT, CPL, NSL',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Active in Weekly Spotlight',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Priority Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
});
