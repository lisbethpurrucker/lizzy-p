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

  const heroPoemText   = settings?.heroPoemText || DEFAULT_HERO
  const logoText       = settings?.logoPlaceholderText || 'lizzyp.'
  const homeCopy       = settings?.contactIntroCopy || DEFAULT_COPY
  const coverImageUrl  = settings?.coverImage
    ? urlFor(settings.coverImage).width(1400).url()
    : null
  const aboutTagline   = settings?.aboutTagline as string | undefined
  const aboutPhotos    = (settings?.aboutPhotos ?? []) as Array<{
    image: { asset: { _ref: string } }
    caption?: string
  }>

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

      {/* ─── About / photos ───────────────────────────── */}
      {aboutPhotos.length > 0 && (
        <section id="about" className={styles.about}>
          <div className={styles.aboutHead}>
            <p className={styles.aboutEyebrow}>in frame</p>
            <h2 className={styles.aboutTitle}>the human.</h2>
            {aboutTagline && <p className={styles.aboutTagline}>{aboutTagline}</p>}
          </div>
          <div className={styles.photoGrid}>
            {aboutPhotos.map((p, i) => (
              <div key={i} className={styles.photoWrap}>
                <Image
                  src={urlFor(p.image).width(800).url()}
                  alt={p.caption || ''}
                  width={800}
                  height={1000}
                  className={styles.photo}
                />
                {p.caption && <p className={styles.photoCaption}>{p.caption}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Other things ─────────────────────────────── */}
      <section className={styles.otherThings}>
        <div className={styles.otherHead}>
          <p className={styles.aboutEyebrow}>other things</p>
          <h2 className={styles.otherTitle}>about me.</h2>
        </div>
        <ul className={styles.otherList}>
          <li>certified yoga teacher</li>
          <li>ex athlete &amp; sports science student</li>
          <li>number 1 life goal: to speak 5 languages fluently</li>
          <li>number 2 life goal: own ducklings</li>
        </ul>
        <p className={styles.otherCaption}>
          what this reveals about me is up to you to decide.
        </p>
      </section>

    </main>
  )
}
