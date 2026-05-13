import styles from './page.module.css'
import { client, isConfigured } from '@/sanity/lib/client'
import {
  getAllPoemsQuery,
  getSubstackSettingsQuery,
  getSpeakingSettingsQuery,
  getSiteSettingsQuery,
} from '@/sanity/lib/queries'
import PoemBlock from '@/components/PoemBlock/PoemBlock'

export const revalidate = 3600

const DEFAULT_RSS = 'https://puderzuckr.substack.com/feed'
const SUBSTACK_URL = 'https://puderzuckr.substack.com'
const DEFAULT_TOPICS = [
  'Women in tech',
  'Founding and building',
  'Creative technology',
  'Full immersion \u2014 on learning anything',
]

const DEFAULT_SPEAKING_INTRO = [
  'For most of my life, public speaking terrified me. Then I stepped into a co-founder role \u2014 and suddenly I was being called onto stages. That first time I stood up there, something shifted. Not just for me, but in the room. Sharing my experience as a female founder, navigating fear and uncertainty in public, turned out to resonate with people in ways I hadn\'t expected.',
  'I\'m now open to speaking engagements, panels, and conversations where that perspective is useful.',
]

interface SubstackPost {
  guid: string
  title: string
  link: string
  pubDate: string
  description: string
}

async function fetchSubstackPosts(rssUrl: string): Promise<SubstackPost[]> {
  try {
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.items || []).slice(0, 3)
  } catch {
    return []
  }
}

function formatPostDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function excerptFrom(html: string, maxLen = 220): string {
  const plain = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return plain.length > maxLen ? plain.slice(0, maxLen).trimEnd() + '\u2026' : plain
}

export default async function Words() {
  let poems: unknown[] = []
  let substackSettings = null
  let speakingSettings = null
  let siteSettings = null

  if (isConfigured) {
    try {
      ;[poems, substackSettings, speakingSettings, siteSettings] = await Promise.all([
        client.fetch(getAllPoemsQuery),
        client.fetch(getSubstackSettingsQuery),
        client.fetch(getSpeakingSettingsQuery),
        client.fetch(getSiteSettingsQuery),
      ])
    } catch { /* fall through to defaults */ }
  }

  const rssUrl: string = substackSettings?.rssUrl || DEFAULT_RSS
  const substackPosts = await fetchSubstackPosts(rssUrl)
  const topics: string[] = speakingSettings?.topics?.length
    ? speakingSettings.topics
    : DEFAULT_TOPICS

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
      <div className={styles.header}>
        <p className={styles.label}>
          {substackSettings?.name || 'critical sidequest'}
        </p>
        <h1 className={styles.title}>Words.</h1>
        <p className={styles.intro}>
          I use words to express myself — written and spoken. For play, for processing, for connection.
        </p>
        {substackSettings?.tagline && (
          <p className={styles.tagline}>{substackSettings.tagline}</p>
        )}
        <nav className={styles.anchorNav} aria-label="Jump to section">
          <a href="#writing" className={styles.anchorLink}>Writing</a>
          <a href="#speaking" className={styles.anchorLink}>Speaking</a>
          {(poems as { _id: string }[]).length > 0 && (
            <a href="#poetry" className={styles.anchorLink}>Poetry</a>
          )}
        </nav>
      </div>

      {/* ─── Substack ───────────────────────────────────── */}
      <section id="writing" className={styles.section}>
        <p className={styles.sectionLabel}>writing</p>
        <div>
          {substackPosts.length > 0 ? (
            <div className={styles.posts}>
              {substackPosts.map((post) => (
                <a
                  key={post.guid}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.post}
                >
                  <div className={styles.postMeta}>
                    <span className={styles.postDate}>{formatPostDate(post.pubDate)}</span>
                    <span className={styles.postTag}>essay</span>
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>{excerptFrom(post.description)}</p>
                </a>
              ))}
            </div>
          ) : (
            <div className={styles.posts}>
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.post}
              >
                <h2 className={styles.postTitle}>Read all essays on Substack →</h2>
              </a>
            </div>
          )}
          <a
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.readAll}
          >
            Read all essays on Substack →
          </a>
        </div>
      </section>

      {/* ─── Speaking ───────────────────────────────────── */}
      <section id="speaking" className={styles.section}>
        <p className={styles.sectionLabel}>speaking</p>
        <div>
          {speakingSettings?.intro ? (
            <p className={styles.speakingIntro}>{speakingSettings.intro}</p>
          ) : (
            DEFAULT_SPEAKING_INTRO.map((para, i) => (
              <p key={i} className={styles.speakingIntro}>{para}</p>
            ))
          )}
          <ul className={styles.topicsList}>
            {topics.map((topic: string) => (
              <li key={topic} className={styles.topic}>{topic}</li>
            ))}
          </ul>
          <a
            href={`mailto:${speakingSettings?.ctaEmail || siteSettings?.email || 'lisbethpurrucker@gmail.com'}`}
            className={styles.speakingCta}
          >
            {speakingSettings?.ctaText || 'Invite me to speak'} →
          </a>
        </div>
      </section>

      {/* ─── Poetry ─────────────────────────────────────── */}
      {(poems as { _id: string }[]).length > 0 && (
        <section id="poetry" className={styles.section}>
          <p className={styles.sectionLabel}>poetry</p>
          <div>
            {(poems as { _id: string; title: string; body: string; publishedAt?: string }[]).map((poem) => (
              <PoemBlock key={poem._id} poem={poem} />
            ))}
          </div>
        </section>
      )}

      </div>
    </main>
  )
}
