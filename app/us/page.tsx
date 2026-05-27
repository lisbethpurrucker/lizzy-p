import styles from './page.module.css'
import { client, isConfigured } from '@/sanity/lib/client'
import { getSiteSettingsQuery } from '@/sanity/lib/queries'
import dynamic from 'next/dynamic'

const CvViewer = dynamic(() => import('@/components/CvViewer/CvViewer'), { ssr: false })

export const revalidate = 60

const FALLBACK_EMAIL = 'lisbethpurrucker@gmail.com'

const SHAPES = [
  {
    num: '01',
    name: 'a technical co-founder, briefly',
    desc: "You're founding something with impact and need someone to own the tech. Architecture, stack decisions, first lines of code. I step in properly — not advisory, but builder-mode. I've done it before.",
    subject: 'technical co-founder enquiry',
  },
  {
    num: '02',
    name: 'an MVP before the round',
    desc: "You need something working before the investor meeting. Full-stack, production-ready, fast. I've shipped apps with real users.",
    subject: 'MVP development',
  },
  {
    num: '03',
    name: 'something that moves',
    desc: "Generative art, interactive installations, live visuals, browser-based experiences. For galleries, events, brands that want a room to remember. This is Studio Pilz work.",
    subject: 'creative tech / installation project',
  },
  {
    num: '04',
    name: 'a site that stays alive',
    desc: "For studios, founders, cultural spaces. Content-heavy, editorially considered, with a CMS you'll actually use. I design the structure and hand you the keys.",
    subject: 'website / CMS project',
  },
  {
    num: '05',
    name: 'a workshop or a room',
    desc: "Team onboarding, founder sprints, teaching code from scratch. I've run full-stack curricula for Le Wagon across Berlin and Cape Town ofr 5+ years.",
    subject: 'workshop / education enquiry',
  },
  {
    num: '06',
    name: 'a talk',
    desc: "Conferences, women-in-tech rooms, creative technology, founding & building. I share from experience — a female founder who shipped a real product and kept going.",
    subject: 'speaking enquiry',
  },
]

export default async function Us() {
  let settings = null

  if (isConfigured) {
    try {
      settings = await client.fetch(getSiteSettingsQuery)
    } catch { /* fall through to defaults */ }
  }

  const email = settings?.email || FALLBACK_EMAIL
  const cvUrl = settings?.cvUrl as string | undefined

  return (
    <main className={styles.page}>

      {/* ── Top: lede + CTA ──────────────────────────────────────────────── */}
      <div className={styles.top}>
        <div className={styles.lede}>
          <p className={styles.label}>creative technologist</p>
          <h1 className={styles.heading}>Open For.</h1>

          <p className={styles.copy}>
            Web development — considered architecture, clean code, built to last.
            For startups, brands, and projects whose values I believe in.
            I own the architecture, write the code, and ship it.
          </p>

          <p className={styles.copy}>
            Creative technology — installations in{' '}
            <strong>TouchDesigner</strong>, web frontends in{' '}
            <strong>p5.js</strong> and <strong>three.js</strong>.
            Things that move, react, surprise.
          </p>

          <p className={styles.copy}>
            Technical co-founder conversations — if you&rsquo;re building
            something that matters and need someone who owns the stack
            end to end.
          </p>
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaLabel}>let&rsquo;s make something</p>
          <p className={styles.ctaHead}>start a thing.</p>
          <p className={styles.ctaBody}>
            Send me one paragraph. Tell me what you&rsquo;re
            hoping for.
          </p>
          <a href={`mailto:${email}`} className={styles.ctaEmail}>
            {email} →
          </a>
        </div>
      </div>

      {/* ── Work shapes ──────────────────────────────────────────────────── */}
      <div className={styles.shapesSection}>
        <p className={styles.shapesLabel}>— ways we can work together —</p>
        {SHAPES.map(({ num, name, desc, subject }) => (
          <div key={num} className={styles.shapeRow}>
            <div className={styles.shapeNum}>№ {num}</div>
            <div>
              <div className={styles.shapeName}>{name}</div>
              <div className={styles.shapeDesc}>{desc}</div>
            </div>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
              className={styles.shapeArrow}
              aria-label={`Get in touch about ${name}`}
            >→</a>
          </div>
        ))}
      </div>

      {/* ── CV ───────────────────────────────────────────────────────────── */}
      {cvUrl && (
        <div className={styles.cvSection}>
          <p className={styles.shapesLabel}>— on paper —</p>
          <CvViewer url={cvUrl} downloadUrl={cvUrl} />
        </div>
      )}

    </main>
  )
}
