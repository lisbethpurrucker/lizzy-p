import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroPoemText',
      title: 'Hero Poem Text',
      type: 'text',
      description: 'The poem displayed on the home page. Line breaks are preserved.',
      initialValue:
        'she is trying to find her place in this world.\nso much noise.\nshe covers her ears and listens to her heart.\nit burns.\nit burns to create meaning in existence.',
    }),
    defineField({
      name: 'logoPlaceholderText',
      title: 'Logo Placeholder Text',
      type: 'string',
      initialValue: 'lizzyp.',
    }),
    defineField({
      name: 'contactIntroCopy',
      title: 'Contact Intro Copy',
      type: 'text',
      description: 'Optional intro text on the Us page. Leave empty to hide.',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'coverImage',
      title: 'Home Cover Image',
      type: 'image',
      description: 'Full-screen cover image displayed on the home page.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
    }),
  ],
})
