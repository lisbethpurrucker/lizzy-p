import styles from './page.module.css'
import { client, isConfigured } from '@/sanity/lib/client'
import { getSiteSettingsQuery } from '@/sanity/lib/queries'

export const revalidate = 60

const FALLBACK_EMAIL = 'hello@lisbethpurrucker.com'

const SHAPES = [
  {
    num: '01',
    name: 'a kickoff',
    desc: 'You have a vague feeling and a deadline. I show up, ask annoying questions, and we leave with a plan and a working prototype.',
  },
  {
    num: '02',
    name: 'a from-blank',
    desc: 'Brand, site, or product — started from zero. No template, no agency middle. You and me, building from the first line. This is my favourite shape.',
  },
  {
    num: '03',
    name: 'an embed',
    desc: '8–12 weeks inside your team. Founder-mode, hands-on, design + build + ship.',
  },
  {
    num: '04',
    name: 'a talk or workshop',
    desc: "Conferences, women-in-tech rooms, founding & building, creative tech. I bring slides that aren't slop.",
  },
  {
    num: '05',
    name: 'a friend who codes',
    desc: "Monthly, for the side-project you can't stop thinking about. We meet, I unblock you, you ship.",
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
          <div className={styles.stamp}>creative technologist · open for work</div>

          <h1 className={styles.heading}>
            open<br />
            <span className={styles.headingRed}>for_</span>
          </h1>

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
        {SHAPES.map(({ num, name, desc }) => (
          <div key={num} className={styles.shapeRow}>
            <div className={styles.shapeNum}>№ {num}</div>
            <div>
              <div className={styles.shapeName}>{name}</div>
              <div className={styles.shapeDesc}>{desc}</div>
            </div>
            <div className={styles.shapeArrow}>→</div>
          </div>
        ))}
      </div>

    </main>
  )
}
