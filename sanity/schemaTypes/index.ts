import type { SchemaTypeDefinition } from 'sanity'
import { siteSettings } from './siteSettings'
import { substackSettings } from './substackSettings'
import { speakingSettings } from './speakingSettings'
import { category } from './category'
import { project } from './project'
import { poem } from './poem'
import { ommEntry } from './ommEntry'
import { socialLink } from './socialLink'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  substackSettings,
  speakingSettings,
  // Collections
  category,
  project,
  poem,
  ommEntry,
  socialLink,
]
