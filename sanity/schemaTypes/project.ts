import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line description in your voice, shown below the title.',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. founder / builder / collaborator',
    }),
    defineField({
      name: 'yearStart',
      title: 'Year Start',
      type: 'string',
      description: 'e.g. 2022',
    }),
    defineField({
      name: 'yearEnd',
      title: 'Year End',
      type: 'string',
      description: 'e.g. 2024 or "present" — leave blank for ongoing',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Live', value: 'live' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Archived', value: 'archived' },
          { title: 'In Progress', value: 'in-progress' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image / Screenshot',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File (MP4)',
      type: 'file',
      options: { accept: 'video/mp4,video/*' },
      description: 'Upload an MP4 to show instead of (or alongside) the screenshot.',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube / Vimeo)',
      type: 'url',
      description: 'Alternative to uploading — paste a YouTube or Vimeo link.',
    }),
    defineField({
      name: 'theWhy',
      title: 'The Why',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Why this exists, in your voice. Specific. Honest.',
    }),
    defineField({
      name: 'theHow',
      title: 'The How',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'What you actually built. What was hard. What surprised you.',
    }),
    defineField({
      name: 'whatILearned',
      title: 'What I Learned',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Three bullet-able lessons, written as sentences.',
    }),
    defineField({
      name: 'description',
      title: 'Description (legacy)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'tags',
      title: 'Stack / Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'externalLink',
      title: 'External Link',
      type: 'url',
      description: 'Optional. Opens in a new tab.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first within the category.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
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
