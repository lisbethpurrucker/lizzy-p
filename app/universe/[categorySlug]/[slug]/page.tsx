import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { client, isConfigured } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { getProjectBySlugQuery, getProjectSlugsByCategoryQuery } from '@/sanity/lib/queries'
import styles from './page.module.css'

export const revalidate = 60

interface Params {
  categorySlug: string
  slug: string
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { categorySlug, slug } = await Promise.resolve(params)

  let project: Record<string, unknown> | null = null
  let siblings: Array<{ slug: string; title: string }> = []

  if (isConfigured) {
    try {
      ;[project, siblings] = await Promise.all([
        client.fetch(getProjectBySlugQuery, { slug }),
        client.fetch(getProjectSlugsByCategoryQuery, { categorySlug }),
      ])
    } catch { /* fall through */ }
  }

  if (!project) notFound()

  const siblingIndex = siblings.findIndex(s => s.slug === slug)
  const position     = siblingIndex + 1
  const total        = siblings.length
  const prevProject  = siblingIndex > 0 ? siblings[siblingIndex - 1] : null
  const nextProject  = siblingIndex < siblings.length - 1 ? siblings[siblingIndex + 1] : null

  const title       = project.title as string
  const categoryName = project.categoryName as string
  const tagline     = project.tagline as string | undefined
  const role        = project.role as string | undefined
  const yearStart   = project.yearStart as string | undefined
  const yearEnd     = project.yearEnd as string | undefined
  const status      = project.status as string | undefined
  const tags        = project.tags as string[] | undefined
  const externalLink = project.externalLink as string | undefined
  const coverImage  = project.coverImage as { asset: { _ref: string } } | undefined
  const theWhy      = project.theWhy as unknown[] | undefined
  const theHow      = project.theHow as unknown[] | undefined
  const whatILearned = project.whatILearned as unknown[] | undefined
  const description = project.description as unknown[] | undefined

  const period = yearStart
    ? `${yearStart} — ${yearEnd ?? 'present'}`
    : undefined

  return (
    <main className={styles.page}>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className={styles.topBar}>
        <Link href="/universe" className={styles.backLink}>
          ← back to {categoryName?.toLowerCase() ?? 'universe'}
        </Link>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbDot} />
          <span>{categoryName?.toUpperCase()} / {title}</span>
        </div>
        {total > 0 && (
          <div className={styles.pagination}>
            {prevProject && (
              <Link href={`/universe/${categorySlug}/${prevProject.slug}`} className={styles.pageNav}>←</Link>
            )}
            <span>
              {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            {nextProject && (
              <Link href={`/universe/${categorySlug}/${nextProject.slug}`} className={styles.pageNav}>→</Link>
            )}
          </div>
        )}
      </div>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>
            {categoryName?.toUpperCase()}
            {tags && tags.length > 0 && (
              <> · <span className={styles.eyebrowSub}>{tags.slice(0, 3).join(' & ').toUpperCase()}</span></>
            )}
          </p>
          <h1 className={styles.title}>[ {title} ]_</h1>
          {tagline && <p className={styles.tagline}>[ {tagline} ]</p>}
        </div>

        <dl className={styles.meta}>
          {role && (
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>role</dt>
              <dd className={styles.metaVal}>[ {role} ]</dd>
            </div>
          )}
          {period && (
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>when</dt>
              <dd className={styles.metaVal}>[ {period} ]</dd>
            </div>
          )}
          {tags && tags.length > 0 && (
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>stack</dt>
              <dd className={styles.metaVal}>[ {tags.join(', ')} ]</dd>
            </div>
          )}
          {status && (
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>status</dt>
              <dd className={`${styles.metaVal} ${styles.metaStatus}`}>[ {status} ]</dd>
            </div>
          )}
          {externalLink && (
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>link</dt>
              <dd className={styles.metaVal}>
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.metaLink}
                >
                  [ {(() => { try { return new URL(externalLink).hostname.replace('www.', '') } catch { return externalLink } })()} →]
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* ── Screenshot ───────────────────────────────────────────────────── */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>the screenshot</p>
        <div className={styles.screenshotWrap}>
          {coverImage ? (
            <Image
              src={urlFor(coverImage).width(1200).height(750).url()}
              alt={title}
              width={1200}
              height={750}
              className={styles.screenshot}
            />
          ) : (
            <div className={styles.screenshotPlaceholder}>
              [ real screenshot · 16:10 ]
            </div>
          )}
        </div>
      </div>

      {/* ── The Why ──────────────────────────────────────────────────────── */}
      {(theWhy && theWhy.length > 0) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>the why</p>
          <div className={styles.sectionBody}>
            <PortableText value={theWhy as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </div>
      )}

      {/* ── The How ──────────────────────────────────────────────────────── */}
      {(theHow && theHow.length > 0) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>the how</p>
          <div className={styles.sectionBody}>
            <PortableText value={theHow as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </div>
      )}

      {/* ── What I Learned ───────────────────────────────────────────────── */}
      {(whatILearned && whatILearned.length > 0) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>what i learned</p>
          <div className={styles.sectionBody}>
            <PortableText value={whatILearned as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </div>
      )}

      {/* ── Fallback: legacy description ─────────────────────────────────── */}
      {(!theWhy && !theHow && !whatILearned && description && description.length > 0) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>about</p>
          <div className={styles.sectionBody}>
            <PortableText value={description as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </div>
      )}

      {/* ── Footer nav ───────────────────────────────────────────────────── */}
      <div className={styles.footNav}>
        {prevProject ? (
          <Link href={`/universe/${categorySlug}/${prevProject.slug}`} className={styles.footNavLink}>
            ← {prevProject.title}
          </Link>
        ) : <span />}
        {nextProject && (
          <Link href={`/universe/${categorySlug}/${nextProject.slug}`} className={styles.footNavLink}>
            {nextProject.title} →
          </Link>
        )}
      </div>

    </main>
  )
}
