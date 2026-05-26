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
      title: 'RSS URL (primary publication)',
      type: 'string',
      initialValue: 'https://puderzuckr.substack.com/feed',
    }),
    defineField({
      name: 'additionalRssUrls',
      title: 'Additional RSS URLs',
      description: 'Add RSS feeds for other publications (e.g. The Forward Current). Posts from all feeds will be merged and sorted by date.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'filterAuthor',
      title: 'Filter by author name',
      type: 'string',
      description: 'If set, only posts whose author field matches this name will be shown (useful for shared publications). E.g. "Lisbeth Purrucker".',
    }),
  ],
})
