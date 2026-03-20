import styles from './page.module.css'
import { client, isConfigured } from '@/sanity/lib/client'
import {
  getAllPoemsQuery,
  getSubstackSettingsQuery,
  getSpeakingSettingsQuery,
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

  if (isConfigured) {
    try {
      ;[poems, substackSettings, speakingSettings] = await Promise.all([
        client.fetch(getAllPoemsQuery),
        client.fetch(getSubstackSettingsQuery),
        client.fetch(getSpeakingSettingsQuery),
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
      <div className={styles.header}>
        <p className={styles.label}>
          {substackSettings?.name || 'critical sidequest'}
        </p>
        <h1 className={styles.title}>Words</h1>
        {substackSettings?.tagline && (
          <p className={styles.tagline}>{substackSettings.tagline}</p>
        )}
      </div>

      {/* ─── Poems ──────────────────────────────────────── */}
      {(poems as { _id: string }[]).length > 0 && (
        <section className={styles.section}>
          <p className={styles.sectionLabel}>poems</p>
          {(poems as { _id: string; title: string; body: string; publishedAt?: string }[]).map((poem) => (
            <PoemBlock key={poem._id} poem={poem} />
          ))}
        </section>
      )}

      {/* ─── Substack ───────────────────────────────────── */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>dispatches</p>
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
                  <span className={styles.postTag}>dispatch</span>
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
              <h2 className={styles.postTitle}>Read all dispatches on Substack →</h2>
            </a>
          </div>
        )}
        <a
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.readAll}
        >
          Read all dispatches →
        </a>
      </section>

      {/* ─── Speaking ───────────────────────────────────── */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>speaking</p>
        {speakingSettings?.intro && (
          <p className={styles.speakingIntro}>{speakingSettings.intro}</p>
        )}
        <ul className={styles.topicsList}>
          {topics.map((topic: string) => (
            <li key={topic} className={styles.topic}>{topic}</li>
          ))}
        </ul>
        {speakingSettings?.ctaEmail && (
          <a
            href={`mailto:${speakingSettings.ctaEmail}`}
            className={styles.speakingCta}
          >
            {speakingSettings.ctaText || 'Get in touch'} →
          </a>
        )}
      </section>
    </main>
  )
}
