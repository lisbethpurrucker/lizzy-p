import styles from './page.module.css'
import { client, isConfigured } from '@/sanity/lib/client'
import { getSiteSettingsQuery } from '@/sanity/lib/queries'

export const revalidate = 60

const FALLBACK_EMAIL = 'sayhi@lisbethpurrucker.com'

const SHAPES = [
  {
    num: '01',
    name: 'a technical co-founder, briefly',
    desc: "You're founding something and need someone to own the tech. Architecture, stack decisions, first lines of code. I step in properly — not advisory, but builder-mode. I've done it before.",
    subject: 'technical co-founder enquiry',
  },
  {
    num: '02',
    name: 'an MVP before the round',
    desc: "You need something working before the investor meeting. Full-stack, production-ready, fast. I've shipped apps with real users. I write the code and the copy.",
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
    name: 'AI, built in',
    desc: "You know your product needs AI but don't know where to start. I build the integration — agents, workflows, Anthropic/Claude APIs — and I speak both the product language and the technical one.",
    subject: 'AI integration project',
  },
  {
    num: '05',
    name: 'a site that stays alive',
    desc: "For studios, founders, cultural spaces. Content-heavy, editorially considered, with a CMS you'll actually use. I design the structure, write the first words, and hand you the keys.",
    subject: 'website / CMS project',
  },
  {
    num: '06',
    name: 'a workshop or a room',
    desc: "Team onboarding, founder sprints, teaching code from scratch. I've run full-stack curricula for Le Wagon across Berlin and Cape Town. I design the material, I don't recycle slides.",
    subject: 'workshop / education enquiry',
  },
  {
    num: '07',
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

  return (
    <main className={styles.page}>

      {/* ── Top: lede + CTA ──────────────────────────────────────────────── */}
      <div className={styles.top}>
        <div className={styles.lede}>
          <p className={styles.label}>creative technologist · open for work</p>

          <h1 className={styles.heading}>Open For_</h1>

          <p className={styles.copy}>
            I&rsquo;m a <strong>creative technologist</strong> and an{' '}
            <strong>initiator</strong> — I love the blank page, the empty repo,
            the &ldquo;what if we just…&rdquo; conversation. The part where there&rsquo;s
            nothing yet and everything is still possible.{' '}
            <strong>I dive in first. I bring the kindling.</strong>
          </p>
          <p className={styles.copy}>
            I&rsquo;m on a learning journey deep into <strong>creative coding</strong> — installations
            in <strong>TouchDesigner</strong>, web frontends in{' '}
            <strong>p5.js, three.js, shaders</strong>. Things that move, react, surprise.
          </p>
          <p className={styles.copy}>
            I build small, weird, well-made things on the web — landing pages, prototypes,
            interactive essays, the occasional whole product. I write the code{' '}
            <strong>and</strong> the copy.
          </p>
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaLabel}>get in touch</p>
          <p className={styles.ctaHead}>start a thing.</p>
          <p className={styles.ctaBody}>
            Send me one paragraph. Tell me what&rsquo;s broken, what you&rsquo;re
            hoping for, and when. I read everything and reply within two days.
          </p>
          <a href={`mailto:${email}`} className={styles.ctaEmail}>
            {email} →
          </a>
          <div className={styles.ctaPs}>
            ps. the question I always ask:<br />
            <span className={styles.ctaQuestion}>&ldquo;what would make this feel <u>alive</u>?&rdquo;</span>
          </div>
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

    </main>
  )
}
