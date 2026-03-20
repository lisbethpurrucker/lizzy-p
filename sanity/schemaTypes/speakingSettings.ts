import { defineField, defineType } from 'sanity'

export const speakingSettings = defineType({
  name: 'speakingSettings',
  title: 'Speaking Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      description: 'Optional intro paragraph above the topics list. Leave empty to hide.',
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'Women in tech',
        'Founding and building',
        'Creative technology',
        'Full immersion \u2014 on learning anything',
      ],
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'ctaEmail',
      title: 'CTA Email',
      type: 'string',
    }),
  ],
})
