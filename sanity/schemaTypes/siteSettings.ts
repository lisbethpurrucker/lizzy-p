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
      name: 'homeCopy',
      title: 'Home Intro Copy',
      type: 'text',
      description: 'A paragraph about you shown in the scrollable section below the hero.',
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
    defineField({
      name: 'aboutTagline',
      title: 'About Tagline',
      type: 'string',
      description: 'Short line shown above the photo grid on the home page (e.g. "the human behind the work").',
    }),
    defineField({
      name: 'cv',
      title: 'CV / Résumé (PDF)',
      type: 'file',
      description: 'Upload a PDF — shown as a preview on the Open For page with a download link.',
      options: { accept: '.pdf,application/pdf' },
    }),
    defineField({
      name: 'aboutPhotos',
      title: 'About Photos',
      type: 'array',
      description: 'A few photographs that give visitors a sense of who you are.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'caption', title: 'Caption (optional)', type: 'string' }),
          ],
          preview: {
            select: { media: 'image', title: 'caption' },
            prepare(value: Record<string, any>) {
              return { media: value.media, title: (value.title as string) || 'Photo' }
            },
          },
        },
      ],
    }),
  ],
})
