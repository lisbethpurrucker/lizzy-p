import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { client, isConfigured } from '@/sanity/lib/client'
import { getSiteSettingsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import TypewriterSection from '@/components/TypewriterSection/TypewriterSection'

export const revalidate = 60

const DEFAULT_HERO =
  'she is trying to find her place in this world.\nso much noise.\nshe covers her ears and listens to her heart.\nit burns.\nit burns to create meaning in existence.'

const DEFAULT_COPY =
  'add your home page copy in sanity → site settings → home copy.'

export default async function Home() {
  let settings = null
  if (isConfigured) {
    try {
      settings = await client.fetch(getSiteSettingsQuery)
    } catch { /* fall through to defaults */ }
  }

  const heroPoemText = settings?.heroPoemText || DEFAULT_HERO
  const logoText = settings?.logoPlaceholderText || 'lizzyp.'
  const homeCopy = settings?.contactIntroCopy || DEFAULT_COPY
  const coverImageUrl = settings?.coverImage
    ? urlFor(settings.coverImage).width(1400).url()
    : null

  return (
    <main className={styles.page}>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
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
        <div className={styles.content}>
          <h1 className={styles.name}>{logoText}</h1>
          <p className={styles.tagline}>{heroPoemText}</p>
          <Link href="/universe" className={styles.cta}>
            witch in the matrix
          </Link>
        </div>
        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span className={styles.scrollLabel}>scroll</span>
        </div>
      </section>

      {/* ─── Intro copy — scroll-triggered typewriter ─── */}
      <TypewriterSection text={homeCopy} />

    </main>
  )
}
