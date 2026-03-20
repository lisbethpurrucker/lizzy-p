import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { client, isConfigured } from '@/sanity/lib/client'
import { getSiteSettingsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

const DEFAULT_HERO =
  'she is trying to find her place in this world.\nso much noise.\nshe covers her ears and listens to her heart.\nit burns.\nit burns to create meaning in existence.'

export default async function Home() {
  let settings = null
  if (isConfigured) {
    try {
      settings = await client.fetch(getSiteSettingsQuery)
    } catch { /* fall through to defaults */ }
  }

  const heroPoemText = settings?.heroPoemText || DEFAULT_HERO
  const logoText = settings?.logoPlaceholderText || 'lizzyp.'
  const coverImageUrl = settings?.coverImage
    ? urlFor(settings.coverImage).width(1400).url()
    : null

  return (
    <main className={styles.page}>

      {/* Cover image */}
      {coverImageUrl && (
        <div className={styles.imageWrap}>
          <Image
            src={coverImageUrl}
            alt="cover"
            fill
            priority
            className={styles.coverImage}
          />
          <div className={styles.overlay} aria-hidden="true" />
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.name}>{logoText}</h1>
        <p className={styles.tagline}>{heroPoemText}</p>
        <Link href="/universe" className={styles.cta}>
          see the work
        </Link>
      </div>

    </main>
  )
}
