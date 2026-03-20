import { defineField, defineType } from 'sanity'

export const poem = defineType({
  name: 'poem',
  title: 'Poem',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The poem\u2019s filename (without extension). Displayed as e.g. "burning.txt".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      description: 'Plain text. Line breaks are preserved exactly as written.',
      rows: 12,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first.',
    }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
