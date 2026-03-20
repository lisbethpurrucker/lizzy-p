import styles from './page.module.css'
import { client, isConfigured } from '@/sanity/lib/client'
import { getSiteSettingsQuery, getSocialLinksQuery } from '@/sanity/lib/queries'

export const revalidate = 60

const FALLBACK_EMAIL = 'hello@lisbethpurrucker.com'
const FALLBACK_SOCIALS = [
  { _id: '1', label: 'Substack',    url: 'https://puderzuckr.substack.com' },
  { _id: '2', label: 'Instagram',   url: 'https://instagram.com' },
  { _id: '3', label: 'LinkedIn',    url: 'https://linkedin.com' },
  { _id: '4', label: 'Studio Pilz', url: '#' },
]

export default async function Us() {
  let settings = null
  let socialLinks: { _id: string; label: string; url: string }[] = []

  if (isConfigured) {
    try {
      ;[settings, socialLinks] = await Promise.all([
        client.fetch(getSiteSettingsQuery),
        client.fetch(getSocialLinksQuery),
      ])
    } catch { /* fall through to defaults */ }
  }

  const email = settings?.email || FALLBACK_EMAIL
  const socials = socialLinks?.length ? socialLinks : FALLBACK_SOCIALS

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <p className={styles.label}>get in touch</p>
        <h1 className={styles.title}>Us</h1>
      </div>

      {settings?.contactIntroCopy ? (
        <p className={styles.copy}>{settings.contactIntroCopy}</p>
      ) : (
        <p className={styles.copy}>
          I am not trying to recreate someone else&apos;s path. If something here moved you, if you want to build something, if you just want to say hello —
        </p>
      )}

      <a href={`mailto:${email}`} className={styles.email}>
        {email}
      </a>

      <div className={styles.links}>
        {socials.map((s) => (
          <a
            key={s._id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span className={styles.linkLabel}>{s.label}</span>
            <span className={styles.linkArrow}>↗</span>
          </a>
        ))}
      </div>
    </main>
  )
}
