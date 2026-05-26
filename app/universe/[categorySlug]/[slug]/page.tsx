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

type GalleryImage = { asset: { url: string }; hotspot?: unknown; crop?: unknown }

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

  const siblingIndex      = siblings.findIndex(s => s.slug === slug)
  const position          = siblingIndex + 1
  const total             = siblings.length
  const prevProject       = siblingIndex > 0 ? siblings[siblingIndex - 1] : null
  const nextProject       = siblingIndex < siblings.length - 1 ? siblings[siblingIndex + 1] : null

  const projectType       = (project.projectType as string) || 'full'
  const title             = project.title as string
  const categoryName      = project.categoryName as string
  const shortDescription  = project.shortDescription as string | undefined
  const tags              = project.tags as string[] | undefined
  const coverImage        = project.coverImage as { asset: { _ref: string } } | undefined
  const videoFile         = project.videoFile as { asset: { url: string } } | undefined
  const videoUrl          = project.videoUrl as string | undefined
  const gallery           = project.gallery as GalleryImage[] | undefined

  // studio-type only
  const studioMission     = project.studioMission as string | undefined
  const studioOffer       = project.studioOffer as string | undefined
  const studioPartner     = project.studioPartner as string | undefined

  // full-type only
  const tagline           = project.tagline as string | undefined
  const role              = project.role as string | undefined
  const yearStart         = project.yearStart as string | undefined
  const yearEnd           = project.yearEnd as string | undefined
  const status            = project.status as string | undefined
  const externalLink      = project.externalLink as string | undefined
  const theWhy            = project.theWhy as unknown[] | undefined
  const theHow            = project.theHow as unknown[] | undefined
  const whatILearned      = project.whatILearned as unknown[] | undefined
  const description       = project.description as unknown[] | undefined

  const period = yearStart ? `${yearStart} — ${yearEnd ?? 'present'}` : undefined

  // ── Shared top bar ─────────────────────────────────────────────────────────
  const topBar = (
    <div className={styles.topBar}>
      <Link href={`/universe?category=${categorySlug}`} className={styles.backLink}>
        ← {categoryName?.toLowerCase() ?? 'universe'}
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
          <span>{String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          {nextProject && (
            <Link href={`/universe/${categorySlug}/${nextProject.slug}`} className={styles.pageNav}>→</Link>
          )}
        </div>
      )}
    </div>
  )

  const footNav = (prevProject || nextProject) && (
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
  )

  // ── Gallery template ───────────────────────────────────────────────────────
  if (projectType === 'gallery') {
    return (
      <main className={styles.page}>
        {topBar}
        <div className={styles.lightHeader}>
          <h1 className={styles.lightTitle}>{title}</h1>
          {shortDescription && <p className={styles.lightDesc}>{shortDescription}</p>}
        </div>
        {gallery && gallery.length > 0 ? (
          <div className={gallery.length === 1 ? styles.photoSingle : styles.photoGrid}>
            {gallery.map((img, i) => (
              <div key={i} className={styles.photoWrap}>
                <Image
                  src={img.asset.url}
                  alt={`${title} ${i + 1}`}
                  fill
                  className={styles.photo}
                  sizes={gallery.length === 1 ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                />
              </div>
            ))}
          </div>
        ) : coverImage ? (
          <div className={styles.photoSingle}>
            <div className={styles.photoWrap}>
              <Image
                src={urlFor(coverImage).width(1200).url()}
                alt={title}
                fill
                className={styles.photo}
                sizes="100vw"
              />
            </div>
          </div>
        ) : null}
        {footNav}
      </main>
    )
  }

  // ── Video template ─────────────────────────────────────────────────────────
  if (projectType === 'video') {
    return (
      <main className={styles.page}>
        {topBar}
        <div className={styles.lightHeader}>
          <h1 className={styles.lightTitle}>{title}</h1>
          {shortDescription && <p className={styles.lightDesc}>{shortDescription}</p>}
        </div>
        <div className={styles.videoSection}>
          {videoFile?.asset?.url ? (
            <video src={videoFile.asset.url} controls playsInline className={styles.videoPlayer} />
          ) : videoUrl ? (
            <iframe
              src={
                videoUrl.includes('youtu')
                  ? videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
                  : videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')
              }
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className={styles.videoPlayer}
              title={title}
            />
          ) : coverImage ? (
            <Image
              src={urlFor(coverImage).width(1200).height(750).url()}
              alt={title}
              width={1200}
              height={750}
              className={styles.videoPlayer}
            />
          ) : null}
        </div>
        {gallery && gallery.length > 0 && (
          <div className={styles.sketchGrid}>
            {gallery.map((img, i) => (
              <div key={i} className={styles.sketchWrap}>
                <Image
                  src={img.asset.url}
                  alt={`${title} sketch ${i + 1}`}
                  fill
                  className={styles.photo}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
        {footNav}
      </main>
    )
  }

  // ── Studio template ────────────────────────────────────────────────────────
  if (projectType === 'studio') {
    const hostname = externalLink ? (() => { try { return new URL(externalLink).hostname.replace('www.', '') } catch { return externalLink } })() : null
    return (
      <main className={styles.page}>
        {topBar}

        {coverImage && (
          <div className={styles.studioCover}>
            <Image
              src={urlFor(coverImage).width(1600).height(700).url()}
              alt={title}
              fill
              priority
              className={styles.studioCoverImg}
            />
          </div>
        )}

        <div className={styles.studioHero}>
          <h1 className={styles.studioName}>{title}</h1>
          {externalLink && (
            <a href={externalLink} target="_blank" rel="noopener noreferrer" className={styles.studioLink}>
              {hostname} →
            </a>
          )}
          {studioPartner && <p className={styles.studioPartner}>w/ {studioPartner}</p>}
        </div>

        <div className={styles.studioBody}>
          {studioMission && (
            <div className={styles.studioCol}>
              <p className={styles.studioColLabel}>mission</p>
              <p className={styles.studioColText}>{studioMission}</p>
            </div>
          )}
          {studioOffer && (
            <div className={styles.studioCol}>
              <p className={styles.studioColLabel}>what we offer</p>
              <p className={styles.studioColText}>{studioOffer}</p>
            </div>
          )}
        </div>

        {footNav}
      </main>
    )
  }

  // ── Full template (default) ────────────────────────────────────────────────
  return (
    <main className={styles.page}>
      {topBar}

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
                <a href={externalLink} target="_blank" rel="noopener noreferrer" className={styles.metaLink}>
                  [ {(() => { try { return new URL(externalLink).hostname.replace('www.', '') } catch { return externalLink } })()} →]
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>
          {(videoFile || videoUrl) ? 'the video' : 'the screenshot'}
        </p>
        <div className={styles.screenshotWrap}>
          {videoFile?.asset?.url ? (
            <video src={videoFile.asset.url} controls playsInline className={styles.screenshot} />
          ) : videoUrl ? (
            <iframe
              src={
                videoUrl.includes('youtu')
                  ? videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
                  : videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')
              }
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className={styles.screenshot}
              title={title}
            />
          ) : coverImage ? (
            <Image src={urlFor(coverImage).width(1200).height(750).url()} alt={title} width={1200} height={750} className={styles.screenshot} />
          ) : (
            <div className={styles.screenshotPlaceholder}>[ screenshot / video ]</div>
          )}
        </div>
      </div>

      {(theWhy && theWhy.length > 0) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>the why</p>
          <div className={styles.sectionBody}>
            <PortableText value={theWhy as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </div>
      )}
      {(theHow && theHow.length > 0) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>the how</p>
          <div className={styles.sectionBody}>
            <PortableText value={theHow as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </div>
      )}
      {(whatILearned && whatILearned.length > 0) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>what i learned</p>
          <div className={styles.sectionBody}>
            <PortableText value={whatILearned as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </div>
      )}
      {(!theWhy?.length && !theHow?.length && !whatILearned?.length && !!description?.length) && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>about</p>
          <div className={styles.sectionBody}>
            <PortableText value={description as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </div>
      )}

      {footNav}
    </main>
  )
}
