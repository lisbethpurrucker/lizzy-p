import { defineField, defineType } from 'sanity'

export const substackSettings = defineType({
  name: 'substackSettings',
  title: 'Substack Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      initialValue: 'Critical Sidequest',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      initialValue:
        'In a world that encourages thinking less and less, I\u2019m here to dismantle internalized patterns and external systems.',
    }),
    defineField({
      name: 'rssUrl',
      title: 'RSS URL',
      type: 'string',
      initialValue: 'https://puderzuckr.substack.com/feed',
    }),
  ],
})
