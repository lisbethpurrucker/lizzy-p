import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introLine',
      title: 'Intro Line',
      type: 'string',
      description: 'Short description shown when the category is expanded.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
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
