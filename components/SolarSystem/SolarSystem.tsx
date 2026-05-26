'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './SolarSystem.module.css'

type PlanetKind = 'saturn' | 'venus' | 'jupiter' | 'mars' | 'moon'


interface Category {
  _id: string
  name: string
  introLine?: string
  slug: string
  order?: number
}

interface GalleryItem { url: string; w?: number; h?: number }

interface Project {
  _id: string
  title: string
  slug?: string
  categorySlug: string
  projectType?: string
  shortDescription?: string
  coverImage?: { asset: { _ref: string } }
  coverImageUrl?: string
  gallery?: GalleryItem[]
  videoFile?: { url: string }
  videoUrl?: string
  tags?: string[]
  externalLink?: string
}

const GALLERY_CATEGORIES = ['documenting', 'animating']

interface Props {
  categories: Category[]
  projects: Project[]
  initialCategorySlug?: string
}

// Canvas dimensions for the orrery SVG
const W = 1200, H = 720
const CX = W / 2, CY = H / 2
const ORBITS = [255, 310, 370, 430, 480]

// Planet assignment by category slug
const PLANET_MAP: Record<string, { kind: PlanetKind; orbitIdx: number; angle: number; size: number }> = {
  building:      { kind: 'saturn',  orbitIdx: 0, angle: 25,  size: 84 },
  creating:      { kind: 'venus',   orbitIdx: 1, angle: 145, size: 60 },
  animating:     { kind: 'jupiter', orbitIdx: 2, angle: 230, size: 72 },
  collaborating: { kind: 'mars',    orbitIdx: 3, angle: 315, size: 56 },
  documenting:   { kind: 'moon',    orbitIdx: 4, angle: 30,  size: 52 },
}

const FALLBACK: { kind: PlanetKind; orbitIdx: number; angle: number; size: number }[] = [
  { kind: 'saturn',  orbitIdx: 0, angle: 25,  size: 80 },
  { kind: 'venus',   orbitIdx: 1, angle: 145, size: 60 },
  { kind: 'jupiter', orbitIdx: 2, angle: 230, size: 70 },
  { kind: 'mars',    orbitIdx: 3, angle: 315, size: 55 },
  { kind: 'moon',    orbitIdx: 4, angle: 30,  size: 50 },
]

// ── Mobile (portrait) layout ───────────────────────────────────────────────
// Angles chosen so no planet clips the header or bottom edge on ~390px wide screens.
const MOBILE_ORBITS = [230, 295, 350, 390, 445]

const MOBILE_PLANET_MAP: Record<string, { kind: PlanetKind; orbitIdx: number; angle: number; size: number }> = {
  building:      { kind: 'saturn',  orbitIdx: 0, angle: 42,  size: 76 },
  creating:      { kind: 'venus',   orbitIdx: 1, angle: 152, size: 54 },
  animating:     { kind: 'jupiter', orbitIdx: 2, angle: 205, size: 64 },
  collaborating: { kind: 'mars',    orbitIdx: 3, angle: 322, size: 50 },
  documenting:   { kind: 'moon',    orbitIdx: 4, angle: 42,  size: 46 },
}

const MOBILE_FALLBACK: { kind: PlanetKind; orbitIdx: number; angle: number; size: number }[] = [
  { kind: 'saturn',  orbitIdx: 0, angle: 42,  size: 76 },
  { kind: 'venus',   orbitIdx: 1, angle: 152, size: 54 },
  { kind: 'jupiter', orbitIdx: 2, angle: 205, size: 64 },
  { kind: 'mars',    orbitIdx: 3, angle: 322, size: 50 },
  { kind: 'moon',    orbitIdx: 4, angle: 42,  size: 46 },
]

// Deterministic star field
const STARS = Array.from({ length: 90 }, (_, i) => ({
  cx: (i * 137.5 + 23) % W,
  cy: (i * 211.3 + 51) % H,
  r:  i % 5 === 0 ? 1.5 : 0.65,
}))

function toRad(deg: number) { return (deg * Math.PI) / 180 }

// ── Planet texture components ──────────────────────────────────────────────

function JupiterFill({ r, id }: { r: number; id: string }) {
  return (
    <g clipPath={`url(#clip-${id})`}>
      <rect width={r * 2} height={r * 2} fill="#d2a577" />
      <rect width={r * 2} y={r * 0.20} height={r * 0.18} fill="#a87148" />
      <rect width={r * 2} y={r * 0.55} height={r * 0.22} fill="#8c5a32" />
      <rect width={r * 2} y={r * 0.90} height={r * 0.15} fill="#c89360" />
      <rect width={r * 2} y={r * 1.30} height={r * 0.20} fill="#7a4928" />
      <rect width={r * 2} y={r * 1.65} height={r * 0.18} fill="#a8784a" />
      <ellipse cx={r * 1.3} cy={r * 1.1} rx={r * 0.18} ry={r * 0.10} fill="#9b2418" />
    </g>
  )
}

function MarsFill({ r, id }: { r: number; id: string }) {
  return (
    <g clipPath={`url(#clip-${id})`}>
      <rect width={r * 2} height={r * 2} fill="#c1402a" />
      <ellipse cx={r * 0.7} cy={r * 0.8} rx={r * 0.7}  ry={r * 0.4}  fill="#8a2818" opacity="0.55" />
      <ellipse cx={r * 1.3} cy={r * 1.4} rx={r * 0.6}  ry={r * 0.35} fill="#e35e3a" opacity="0.50" />
      <ellipse cx={r}       cy={r * 0.05} rx={r * 0.55} ry={r * 0.18} fill="#f8e8d8" opacity="0.85" />
      <circle  cx={r * 0.8} cy={r * 1.2} r={r * 0.10} fill="#5e1808" opacity="0.6" />
      <circle  cx={r * 1.4} cy={r * 0.6} r={r * 0.06} fill="#5e1808" opacity="0.7" />
    </g>
  )
}

function VenusFill({ r, id }: { r: number; id: string }) {
  return (
    <g clipPath={`url(#clip-${id})`}>
      <rect width={r * 2} height={r * 2} fill="#ead8a8" />
      <path d={`M 0 ${r * 0.4} Q ${r} ${r * 0.7} ${r * 2} ${r * 0.3} L ${r * 2} ${r * 0.6} Q ${r} ${r} 0 ${r * 0.7} Z`}
        fill="#c9a560" opacity="0.7" />
      <path d={`M 0 ${r * 1.1} Q ${r * 0.8} ${r * 1.3} ${r * 2} ${r} L ${r * 2} ${r * 1.3} Q ${r * 0.8} ${r * 1.6} 0 ${r * 1.4} Z`}
        fill="#a17b3a" opacity="0.6" />
      <path d={`M 0 ${r * 1.6} Q ${r * 1.2} ${r * 1.8} ${r * 2} ${r * 1.5} L ${r * 2} ${r * 1.8} Q ${r} ${r * 2} 0 ${r * 1.9} Z`}
        fill="#7e5a25" opacity="0.5" />
    </g>
  )
}

function MoonFill({ r, id }: { r: number; id: string }) {
  return (
    <g clipPath={`url(#clip-${id})`}>
      <rect width={r * 2} height={r * 2} fill="#dcd0b8" />
      <ellipse cx={r * 0.6} cy={r * 0.6} rx={r * 0.35} ry={r * 0.25} fill="#8a8068" opacity="0.7" />
      <ellipse cx={r * 1.3} cy={r * 1.0} rx={r * 0.45} ry={r * 0.30} fill="#6e6650" opacity="0.5" />
      <ellipse cx={r * 0.8} cy={r * 1.4} rx={r * 0.25} ry={r * 0.18} fill="#7e7560" opacity="0.6" />
      <circle  cx={r * 1.4} cy={r * 0.5} r={r * 0.06} fill="#5a5240" opacity="0.6" />
      <circle  cx={r * 0.4} cy={r * 1.3} r={r * 0.04} fill="#5a5240" opacity="0.6" />
    </g>
  )
}

function SaturnFill({ r, id }: { r: number; id: string }) {
  const cx = r, cy = r
  return (
    <g>
      {/* back rings */}
      <ellipse cx={cx} cy={cy} rx={r * 1.65} ry={r * 0.35} fill="none"
        stroke="#c8b070" strokeWidth={r * 0.10} opacity="0.7" />
      <ellipse cx={cx} cy={cy} rx={r * 1.95} ry={r * 0.46} fill="none"
        stroke="#a08a52" strokeWidth={r * 0.06} opacity="0.55" />
      {/* body */}
      <g clipPath={`url(#clip-${id})`}>
        <rect width={r * 2} height={r * 2} fill="#e8c98a" />
        <rect width={r * 2} y={r * 0.5}  height={r * 0.20} fill="#c8a458" opacity="0.6" />
        <rect width={r * 2} y={r * 1.0}  height={r * 0.18} fill="#a78332" opacity="0.55" />
        <rect width={r * 2} y={r * 1.4}  height={r * 0.22} fill="#d4ae6a" opacity="0.5" />
      </g>
      {/* front rings rendered in PlanetSVG after shadow overlay */}
    </g>
  )
}

function SaturnFrontRings({ r }: { r: number }) {
  const cx = r, cy = r
  return (
    <>
      <path d={`M ${cx - r * 1.65} ${cy} A ${r * 1.65} ${r * 0.35} 0 0 0 ${cx + r * 1.65} ${cy}`}
        fill="none" stroke="#e8d090" strokeWidth={r * 0.10} opacity="0.85" />
      <path d={`M ${cx - r * 1.95} ${cy + r * 0.05} A ${r * 1.95} ${r * 0.46} 0 0 0 ${cx + r * 1.95} ${cy + r * 0.05}`}
        fill="none" stroke="#bfa56c" strokeWidth={r * 0.06} opacity="0.7" />
    </>
  )
}

function PlanetSVG({ kind, size, id, glowing }: { kind: PlanetKind; size: number; id: string; glowing: boolean }) {
  const r = size / 2
  const cx = r, cy = r
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}
      style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <clipPath id={`clip-${id}`}><circle cx={cx} cy={cy} r={r} /></clipPath>
        <radialGradient id={`shadow-${id}`} cx="65%" cy="65%">
          <stop offset="40%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
      </defs>

      {kind === 'jupiter' && <JupiterFill r={r} id={id} />}
      {kind === 'mars'    && <MarsFill    r={r} id={id} />}
      {kind === 'venus'   && <VenusFill   r={r} id={id} />}
      {kind === 'moon'    && <MoonFill    r={r} id={id} />}
      {kind === 'saturn'  && <SaturnFill  r={r} id={id} />}

      <circle cx={cx} cy={cy} r={r}       fill={`url(#shadow-${id})`} clipPath={`url(#clip-${id})`} />
      <circle cx={cx} cy={cy} r={r - 0.5} fill="none" stroke="rgba(0,0,0,0.3)" />

      {kind === 'saturn' && <SaturnFrontRings r={r} />}

      {glowing && (
        <circle cx={cx} cy={cy} r={r + 7} fill="none"
          stroke="#d8232a" strokeWidth="2" opacity="0.8" />
      )}
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function SolarSystem({ categories, projects, initialCategorySlug }: Props) {
  const router = useRouter()
  const [hoverId, setHoverId]               = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [isMobile, setIsMobile]             = useState(false)
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null)
  const [showScrollHint, setShowScrollHint]   = useState(true)
  const filmStripRef = useRef<HTMLDivElement>(null)

  // Sync active category into the URL so a page refresh lands in the right place
  const selectCategory = useCallback((cat: Category | null) => {
    setActiveCategory(cat)
    if (cat) {
      router.replace(`/universe?category=${cat.slug}`, { scroll: false })
    } else {
      router.replace('/universe', { scroll: false })
    }
  }, [router])

  // Open the correct category on first load (back-link or refresh)
  useEffect(() => {
    if (initialCategorySlug && categories.length > 0) {
      const match = categories.find(c => c.slug === initialCategorySlug)
      if (match) setActiveCategory(match)
    }
  }, [initialCategorySlug, categories])

  const closeLightbox = useCallback(() => setLightboxProject(null), [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!lightboxProject) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const catProjects = projects.filter(p => p.categorySlug === activeCategory?.slug)
        const idx = catProjects.findIndex(p => p._id === lightboxProject._id)
        const next = e.key === 'ArrowRight' ? catProjects[idx + 1] : catProjects[idx - 1]
        if (next) setLightboxProject(next)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxProject, activeCategory, projects, closeLightbox])

  // Reset scroll hint (and strip position) each time a gallery category is opened
  useEffect(() => {
    if (activeCategory && GALLERY_CATEGORIES.includes(activeCategory.slug)) {
      setShowScrollHint(true)
      if (filmStripRef.current) filmStripRef.current.scrollLeft = 0
    }
  }, [activeCategory])

  const activePlanetMap = isMobile ? MOBILE_PLANET_MAP : PLANET_MAP
  const activeFallback  = isMobile ? MOBILE_FALLBACK  : FALLBACK
  const activeOrbits    = isMobile ? MOBILE_ORBITS    : ORBITS

  // Map categories to planets
  const planets = categories.map((cat, i) => {
    const cfg = activePlanetMap[cat.slug] ?? activeFallback[i % activeFallback.length]
    const orbitR = activeOrbits[cfg.orbitIdx]
    const a  = toRad(cfg.angle)
    const px = CX + Math.cos(a) * orbitR
    const py = CY + Math.sin(a) * orbitR
    return { ...cat, ...cfg, px, py, count: projects.filter(p => p.categorySlug === cat.slug).length }
  })

  // ── Category index view ─────────────────────────────────────────────────
  if (activeCategory) {
    const catProjects = projects.filter(p => p.categorySlug === activeCategory.slug)
    const planet = planets.find(p => p._id === activeCategory._id)
    const isGallery = GALLERY_CATEGORIES.includes(activeCategory.slug)

    const catHead = (
      <div className={styles.catHead}>
        <button className={styles.backBtn} onClick={() => selectCategory(null)}>
          ← back to universe
        </button>
        <div className={styles.catHero}>
          <div>
            <p className={styles.catEyebrow}>universe / {activeCategory.slug}</p>
            <h1 className={styles.catTitle}>
              {activeCategory.name}<span className={styles.accent}>.</span>
            </h1>
            {activeCategory.introLine && (
              <p className={styles.catIntro}>{activeCategory.introLine}</p>
            )}
          </div>
          {planet && (
            <div className={styles.catPlanetThumb}>
              <PlanetSVG kind={planet.kind} size={120} id={`cat-thumb-${planet.slug}`} glowing={false} />
            </div>
          )}
        </div>
      </div>
    )

    const otherWorlds = (
      <div className={styles.otherWorlds}>
        <p className={styles.otherLabel}>other worlds</p>
        <div className={styles.otherGrid}>
          {planets.filter(pl => pl._id !== activeCategory._id).map(pl => (
            <button
              key={pl._id}
              className={styles.otherItem}
              onClick={() => selectCategory(pl)}
            >
              <span className={styles.otherIcon}>
                <PlanetSVG kind={pl.kind} size={32} id={`other-${pl.slug}`} glowing={false} />
              </span>
              <div>
                <div className={styles.otherName}>{pl.name}</div>
                <div className={styles.otherCount}>{pl.count} projects →</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )

    // ── Gallery view (documenting / animating) ───────────────────────────────
    if (isGallery) {
      const lbIdx = lightboxProject ? catProjects.findIndex(p => p._id === lightboxProject._id) : -1
      const lbPrev = lbIdx > 0 ? catProjects[lbIdx - 1] : null
      const lbNext = lbIdx < catProjects.length - 1 ? catProjects[lbIdx + 1] : null

      const thumbUrl = (p: Project) =>
        p.coverImageUrl ||
        p.gallery?.[0]?.url ||
        null

      const mediaUrl = (p: Project): { type: 'image' | 'video' | 'embed'; src: string } | null => {
        if (p.videoFile?.url) return { type: 'video', src: p.videoFile.url }
        if (p.videoUrl) return { type: 'embed', src: p.videoUrl }
        const img = p.coverImageUrl || p.gallery?.[0]?.url
        if (img) return { type: 'image', src: img }
        return null
      }

      return (
        <>
          <div className={styles.catView}>
            {catHead}

            {catProjects.length === 0 ? (
              <p className={styles.emptyNote} style={{ padding: '40px 32px' }}>Nothing here yet.</p>
            ) : (
              <div className={styles.filmStripWrap}>
                <div
                  className={styles.filmStrip}
                  ref={filmStripRef}
                  onScroll={() => {
                    if (filmStripRef.current && filmStripRef.current.scrollLeft > 30) {
                      setShowScrollHint(false)
                    }
                  }}
                >
                  {catProjects.map((p, i) => {
                    const thumb = thumbUrl(p)
                    const isVideo = p.projectType === 'video' || !!p.videoFile?.url || !!p.videoUrl
                    return (
                      <button
                        key={p._id}
                        className={styles.filmFrame}
                        onClick={() => setLightboxProject(p)}
                        aria-label={p.title}
                      >
                        <div className={styles.filmImgWrap}>
                          {thumb ? (
                            <img src={`${thumb}?w=1200&q=90`} alt={p.title} className={styles.filmImg} />
                          ) : (
                            <div className={styles.filmPlaceholder} />
                          )}
                          {isVideo && <span className={styles.filmPlay}>▶</span>}
                        </div>
                        <div className={styles.filmMeta}>
                          <span className={styles.filmNum}>{String(i + 1).padStart(3, '0')}</span>
                          <span className={styles.filmTitle}>{p.title}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {showScrollHint && (
                  <div className={styles.scrollHint} aria-hidden="true">
                    <span className={styles.scrollHintArrow}>→</span>
                  </div>
                )}
              </div>
            )}

            {otherWorlds}
          </div>

          {/* Lightbox */}
          {lightboxProject && (() => {
            const media = mediaUrl(lightboxProject)
            return (
              <div className={styles.lightbox} onClick={closeLightbox}>
                <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close">×</button>

                {lbPrev && (
                  <button
                    className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                    onClick={(e) => { e.stopPropagation(); setLightboxProject(lbPrev) }}
                    aria-label="Previous"
                  >←</button>
                )}
                {lbNext && (
                  <button
                    className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                    onClick={(e) => { e.stopPropagation(); setLightboxProject(lbNext) }}
                    aria-label="Next"
                  >→</button>
                )}

                <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                  {media?.type === 'image' && (
                    <img src={media.src} alt={lightboxProject.title} className={styles.lightboxMedia} />
                  )}
                  {media?.type === 'video' && (
                    <video src={media.src} controls autoPlay className={styles.lightboxMedia} />
                  )}
                  {media?.type === 'embed' && (
                    <iframe
                      src={media.src.includes('youtu')
                        ? media.src.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
                        : media.src.replace('vimeo.com/', 'player.vimeo.com/video/')}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      className={styles.lightboxMedia}
                      title={lightboxProject.title}
                    />
                  )}
                  <div className={styles.lightboxMeta}>
                    <span className={styles.lightboxTitle}>{lightboxProject.title}</span>
                    {lightboxProject.shortDescription && (
                      <span className={styles.lightboxDesc}>{lightboxProject.shortDescription}</span>
                    )}
                    <span className={styles.lightboxCount}>{lbIdx + 1} / {catProjects.length}</span>
                    {lightboxProject.slug && activeCategory && (
                      <Link
                        href={`/universe/${activeCategory.slug}/${lightboxProject.slug}`}
                        className={styles.lightboxLink}
                        onClick={e => e.stopPropagation()}
                      >view project →</Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}
        </>
      )
    }

    // ── Creating card grid ───────────────────────────────────────────────────
    if (activeCategory.slug === 'creating') {
      return (
        <>
          <div className={styles.catView}>
            {catHead}
            <div className={styles.creatingGrid}>
              {catProjects.length === 0 ? (
                <p className={styles.emptyNote}>No projects yet in this world.</p>
              ) : catProjects.map(p => {
                const href = p.slug ? `/universe/creating/${p.slug}` : undefined
                const inner = (
                  <>
                    <div className={styles.creatingImgWrap}>
                      {p.coverImageUrl ? (
                        <img
                          src={`${p.coverImageUrl}?w=800&h=450&fit=crop&q=85`}
                          alt={p.title}
                          className={styles.collabImg}
                        />
                      ) : (
                        <div className={styles.collabImgPlaceholder} />
                      )}
                    </div>
                    <div className={styles.collabName}>{p.title}</div>
                    {p.tags && p.tags.length > 0 && (
                      <div className={styles.collabStack}>{p.tags.join(' · ')}</div>
                    )}
                  </>
                )
                return href ? (
                  <Link key={p._id} href={href} className={styles.collabCard}>
                    {inner}
                  </Link>
                ) : (
                  <div key={p._id} className={styles.collabCard}>
                    {inner}
                  </div>
                )
              })}
            </div>
            {otherWorlds}
          </div>
        </>
      )
    }

    // ── Collaborating card grid ──────────────────────────────────────────────
    if (activeCategory.slug === 'collaborating') {
      return (
        <>
          <div className={styles.catView}>
            {catHead}
            <div className={styles.collabGrid}>
              {catProjects.length === 0 ? (
                <p className={styles.emptyNote}>No collaborations yet.</p>
              ) : catProjects.map(p => {
                const href = p.slug ? `/universe/collaborating/${p.slug}` : undefined
                const inner = (
                  <>
                    <div className={styles.collabImgWrap}>
                      {p.coverImageUrl ? (
                        <img
                          src={`${p.coverImageUrl}?w=600&h=600&fit=crop&q=85`}
                          alt={p.title}
                          className={styles.collabImg}
                        />
                      ) : (
                        <div className={styles.collabImgPlaceholder} />
                      )}
                    </div>
                    <div className={styles.collabName}>{p.title}</div>
                    {p.tags && p.tags.length > 0 && (
                      <div className={styles.collabStack}>{p.tags.join(' · ')}</div>
                    )}
                  </>
                )
                return href ? (
                  <Link key={p._id} href={href} className={styles.collabCard}>
                    {inner}
                  </Link>
                ) : (
                  <div key={p._id} className={styles.collabCard}>
                    {inner}
                  </div>
                )
              })}
            </div>
            {otherWorlds}
          </div>
        </>
      )
    }

    // ── Project list view (building / creating) ──────────────────────────────
    return (
      <>
        <div className={styles.catView}>
          {catHead}

          <div className={styles.colHead}>
            <span>№</span>
            <span>project</span>
            <span>status</span>
            <span />
          </div>

          <div className={styles.projectList}>
            {catProjects.length === 0 ? (
              <p className={styles.emptyNote}>No projects yet in this world.</p>
            ) : catProjects.map((p, i) => {
              const href = p.slug
                ? `/universe/${activeCategory.slug}/${p.slug}`
                : undefined
              const inner = (
                <>
                  <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.rowBody}>
                    <div className={styles.rowTitle}>{p.title}</div>
                    {p.tags && p.tags.length > 0 && (
                      <div className={styles.rowTags}>{p.tags.join(' · ')}</div>
                    )}
                  </div>
                  <span className={styles.rowStatus}>{p.externalLink ? 'live' : 'project'}</span>
                  <span className={styles.rowArrow}>→</span>
                </>
              )
              return href ? (
                <Link key={p._id} href={href} className={styles.projectRow}>
                  {inner}
                </Link>
              ) : (
                <div key={p._id} className={styles.projectRow}>
                  {inner}
                </div>
              )
            })}
          </div>

          {otherWorlds}
        </div>
      </>
    )
  }

  // ── Orrery view ─────────────────────────────────────────────────────────
  return (
    <>
      <div className={styles.orrery}>
        {/* Background SVG: stars, orbits, sun */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          className={styles.bg}
        >
          <defs>
            <radialGradient id="sunGrad">
              <stop offset="0%"   stopColor="#fff5d0" />
              <stop offset="40%"  stopColor="#ffd54a" />
              <stop offset="80%"  stopColor="#d8232a" />
              <stop offset="100%" stopColor="#5e0710" />
            </radialGradient>
            <radialGradient id="sunGlow">
              <stop offset="0%"   stopColor="rgba(255,213,74,0.45)" />
              <stop offset="100%" stopColor="rgba(255,213,74,0)" />
            </radialGradient>
          </defs>

          {/* Stars */}
          {STARS.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="rgba(242,236,226,0.6)" />
          ))}

          {/* Orbit rings */}
          {activeOrbits.map((r, i) => (
            <circle key={i} cx={CX} cy={CY} r={r}
              fill="none" stroke="rgba(242,236,226,0.08)" strokeDasharray="2 6" />
          ))}

          {/* Sun glow + body */}
          <circle cx={CX} cy={CY} r={130} fill="url(#sunGlow)" />
          <circle cx={CX} cy={CY} r={58}  fill="url(#sunGrad)" />

          {/* Sun flame tongues */}
          <g fill="#ffd54a" opacity="0.85">
            <path d={`M ${CX} ${CY - 58} q -4 -18 0 -30 q 4 12 0 30 z`} />
            <path d={`M ${CX + 58} ${CY} q 18 -4 30 0 q -12 4 -30 0 z`} />
            <path d={`M ${CX} ${CY + 58} q -4 18 0 30 q 4 -12 0 -30 z`} />
            <path d={`M ${CX - 58} ${CY} q -18 -4 -30 0 q 12 4 30 0 z`} />
          </g>

          {/* Sun label */}
          <text x={CX} y={CY + 105} textAnchor="middle" fontSize="11"
            letterSpacing="6" fill="rgba(255,245,208,0.65)"
            fontFamily="'JetBrains Mono', monospace">★ LIZZYP ★</text>
        </svg>

        {/* Sun click target — navigates to about section on home page */}
        <Link
          href="/#about"
          className={styles.sunBtn}
          aria-label="About me"
        />

        {/* Planets */}
        {planets.map((planet) => {
          const isHover = hoverId === planet._id
          return (
            <div
              key={planet._id}
              className={`${styles.planet} ${isHover ? styles.planetHover : ''}`}
              style={{
                left:       `${(planet.px / W) * 100}%`,
                top:        `${(planet.py / H) * 100}%`,
                width:      planet.size,
                height:     planet.size,
                marginLeft: -planet.size / 2,
                marginTop:  -planet.size / 2,
              }}
              onMouseEnter={() => setHoverId(planet._id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => selectCategory(planet)}
            >
              <PlanetSVG
                kind={planet.kind}
                size={planet.size}
                id={planet.slug}
                glowing={isHover}
              />
            </div>
          )
        })}


        {/* Planet labels */}
        {planets.map((planet) => {
          const isHover = hoverId === planet._id
          return (
            <div
              key={`lbl-${planet._id}`}
              className={`${styles.label} ${isHover ? styles.labelHover : ''}`}
              style={{
                left: `${(planet.px / W) * 100}%`,
                top:  `calc(${(planet.py / H) * 100}% + ${planet.size / 2 + 16}px)`,
              }}
              onMouseEnter={() => setHoverId(planet._id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => selectCategory(planet)}
            >
              <span className={styles.labelName}>{planet.name}</span>
              <span className={styles.labelMeta}>
                {isHover
                  ? `${planet.introLine || planet.slug} →`
                  : `${planet.count} project${planet.count !== 1 ? 's' : ''}`}
              </span>
            </div>
          )
        })}

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>my work</p>
          <h1 className={styles.title}>universe.</h1>
          <p className={styles.subtitle}>five worlds. click any to explore.</p>
        </div>

        <p className={styles.hint}>↳ click a planet to enter</p>
      </div>
    </>
  )
}
