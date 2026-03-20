import { client, isConfigured } from '@/sanity/lib/client'
import { getOmmEntriesQuery, getOmmEntryCountQuery } from '@/sanity/lib/queries'
import OmmClient from './OmmClient'
import styles from './page.module.css'

export const revalidate = 60

const PAGE_SIZE = 12

export default async function Omm() {
  let initialEntries: unknown[] = []
  let totalCount = 0

  if (isConfigured) {
    try {
      ;[initialEntries, totalCount] = await Promise.all([
        client.fetch(getOmmEntriesQuery, { start: 0, end: PAGE_SIZE }),
        client.fetch(getOmmEntryCountQuery),
      ])
    } catch { /* render with empty data */ }
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
      <div className={styles.header}>
        <p className={styles.label}>on my mind</p>
        <h1 className={styles.title}>OMM</h1>
      </div>
      <p className={styles.description}>
        make space to think out loud. louder. deeper. there you go.
      </p>

      <OmmClient
        initialEntries={initialEntries as Parameters<typeof OmmClient>[0]['initialEntries']}
        totalCount={totalCount}
      />
      </div>
    </main>
  )
}
