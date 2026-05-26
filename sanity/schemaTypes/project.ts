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
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full write-up (building, creating)', value: 'full' },
          { title: 'Gallery — film shots, photos', value: 'gallery' },
          { title: 'Video — animation, motion work', value: 'video' },
          { title: 'Studio — collaboration partner', value: 'studio' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
      validation: (Rule) => Rule.required(),
    }),

    // ── Shared: short note for gallery + video types ──────────────
    defineField({
      name: 'shortDescription',
      title: 'Short description (optional)',
      type: 'text',
      rows: 3,
      description: 'A sentence or two. Shown below the title.',
      hidden: ({ document }) => document?.projectType === 'full',
    }),

    // ── Full type only ─────────────────────────────────────────────
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line description in your voice, shown below the title.',
      hidden: ({ document }) => document?.projectType !== 'full',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. founder / builder / collaborator',
      hidden: ({ document }) => document?.projectType !== 'full',
    }),
    defineField({
      name: 'yearStart',
      title: 'Year Start',
      type: 'string',
      description: 'e.g. 2022',
      hidden: ({ document }) => document?.projectType !== 'full',
    }),
    defineField({
      name: 'yearEnd',
      title: 'Year End',
      type: 'string',
      description: 'e.g. 2024 or "present" — leave blank for ongoing',
      hidden: ({ document }) => document?.projectType !== 'full',
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
      hidden: ({ document }) => document?.projectType !== 'full',
    }),

    // ── Cover image (all types) ────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover Image / Thumbnail',
      type: 'image',
      options: { hotspot: true },
    }),

    // ── Single video (video type only) ────────────────────────────
    defineField({
      name: 'videoFile',
      title: 'Video File (MP4)',
      type: 'file',
      options: { accept: 'video/mp4,video/*' },
      hidden: ({ document }) => document?.projectType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube / Vimeo)',
      type: 'url',
      description: 'Alternative to uploading — paste a YouTube or Vimeo link.',
      hidden: ({ document }) => document?.projectType !== 'video',
    }),

    // ── Multiple videos (all types except studio) ──────────────────
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      description: 'Add as many videos as you like. Each entry can be an uploaded file, a YouTube / Vimeo link, or both.',
      hidden: ({ document }) => document?.projectType === 'studio',
      of: [
        {
          type: 'object',
          name: 'videoEntry',
          title: 'Video',
          fields: [
            defineField({
              name: 'title',
              title: 'Title / Caption',
              type: 'string',
              description: 'Optional — shown as a label beneath the video.',
            }),
            defineField({
              name: 'videoFile',
              title: 'Upload file (MP4)',
              type: 'file',
              options: { accept: 'video/mp4,video/*' },
            }),
            defineField({
              name: 'videoUrl',
              title: 'Or paste a URL (YouTube / Vimeo)',
              type: 'url',
            }),
          ],
          preview: {
            select: { title: 'title', url: 'videoUrl' },
            prepare: ({ title, url }: { title?: string; url?: string }) => ({
              title: title || url || 'Video',
              subtitle: url ?? undefined,
            }),
          },
        },
      ],
    }),

    // ── Gallery (gallery + video types — sketches, stills) ────────
    defineField({
      name: 'gallery',
      title: 'Photos / Stills',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Film shots for gallery type. Sketches / process stills for video type.',
      hidden: ({ document }) => document?.projectType === 'full',
    }),

    // ── Studio type only ──────────────────────────────────────────────────────
    defineField({
      name: 'studioMission',
      title: 'Mission',
      type: 'text',
      rows: 4,
      description: 'What this studio stands for. Written in your voice.',
      hidden: ({ document }) => document?.projectType !== 'studio',
    }),
    defineField({
      name: 'studioOffer',
      title: 'What we offer',
      type: 'text',
      rows: 4,
      description: 'What clients / collaborators can hire or engage you for.',
      hidden: ({ document }) => document?.projectType !== 'studio',
    }),
    defineField({
      name: 'studioPartner',
      title: 'Co-founder / Partner name',
      type: 'string',
      description: 'e.g. "with Jana Pilz" — shown on the studio page.',
      hidden: ({ document }) => document?.projectType !== 'studio',
    }),

    // ── Full type write-up fields ──────────────────────────────────
    defineField({
      name: 'theWhy',
      title: 'The Why',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Why this exists, in your voice. Specific. Honest.',
      hidden: ({ document }) => document?.projectType !== 'full',
    }),
    defineField({
      name: 'theHow',
      title: 'The How',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'What you actually built. What was hard. What surprised you.',
      hidden: ({ document }) => document?.projectType !== 'full',
    }),
    defineField({
      name: 'whatILearned',
      title: 'What I Learned',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Three bullet-able lessons, written as sentences.',
      hidden: ({ document }) => document?.projectType !== 'full',
    }),
    defineField({
      name: 'description',
      title: 'Description (legacy)',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ document }) => document?.projectType !== 'full',
    }),

    // ── Shared ─────────────────────────────────────────────────────
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
      hidden: ({ document }) => document?.projectType !== 'full' && document?.projectType !== 'studio',
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
