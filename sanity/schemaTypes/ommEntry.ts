import { defineField, defineType } from 'sanity'

export const ommEntry = defineType({
  name: 'ommEntry',
  title: 'OMM Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'entryType',
      title: 'Entry Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Quote', value: 'quote' },
          { title: 'Sketch', value: 'sketch' },
          { title: 'Link', value: 'link' },
          { title: 'Video', value: 'video' },
          { title: 'Audio', value: 'audio' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── image + sketch ──────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ document }) =>
        !['image', 'sketch'].includes(document?.entryType as string),
    }),

    // ─── shared caption (image, sketch, video, audio) ────────────
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional.',
      hidden: ({ document }) =>
        !['image', 'sketch', 'video', 'audio'].includes(document?.entryType as string),
    }),

    // ─── quote ───────────────────────────────────────────────────
    defineField({
      name: 'quoteText',
      title: 'Quote',
      type: 'text',
      hidden: ({ document }) => document?.entryType !== 'quote',
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Optional.',
      hidden: ({ document }) => document?.entryType !== 'quote',
    }),

    // ─── link ────────────────────────────────────────────────────
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      hidden: ({ document }) => document?.entryType !== 'link',
    }),
    defineField({
      name: 'linkTitle',
      title: 'Link Title',
      type: 'string',
      hidden: ({ document }) => document?.entryType !== 'link',
    }),
    defineField({
      name: 'linkDescription',
      title: 'Link Description',
      type: 'string',
      description: 'Optional.',
      hidden: ({ document }) => document?.entryType !== 'link',
    }),
    defineField({
      name: 'linkImage',
      title: 'Link Preview Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional manual preview image.',
      hidden: ({ document }) => document?.entryType !== 'link',
    }),

    // ─── video ───────────────────────────────────────────────────
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ document }) => document?.entryType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube / Vimeo)',
      type: 'url',
      description: 'Alternative to uploading a file.',
      hidden: ({ document }) => document?.entryType !== 'video',
    }),

    // ─── audio ───────────────────────────────────────────────────
    defineField({
      name: 'audioFile',
      title: 'Audio File',
      type: 'file',
      options: { accept: 'audio/*' },
      hidden: ({ document }) => document?.entryType !== 'audio',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
