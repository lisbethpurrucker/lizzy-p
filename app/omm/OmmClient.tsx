'use client'

import { useState } from 'react'
import OmmEntryRenderer from '@/components/OmmEntryRenderer/OmmEntryRenderer'
import { fetchOmmEntries } from './actions'
import styles from './page.module.css'

const PAGE_SIZE = 12

interface OmmEntry {
  _id: string
  publishedAt: string
  entryType: 'image' | 'quote' | 'sketch' | 'link' | 'video' | 'audio'
  [key: string]: unknown
}

interface Props {
  initialEntries: OmmEntry[]
  totalCount: number
}

export default function OmmClient({ initialEntries, totalCount }: Props) {
  const [entries, setEntries] = useState<OmmEntry[]>(initialEntries)
  const [loading, setLoading] = useState(false)

  const hasMore = entries.length < totalCount

  async function loadMore() {
    setLoading(true)
    try {
      const start = entries.length
      const end = start + PAGE_SIZE
      const more = await fetchOmmEntries(start, end)
      setEntries((prev) => [...prev, ...more])
    } finally {
      setLoading(false)
    }
  }

  if (entries.length === 0) {
    return (
      <p className={styles.empty}>Nothing yet. Check back soon.</p>
    )
  }

  return (
    <>
      <div className={styles.grid}>
        {entries.map((entry) => (
          <OmmEntryRenderer key={entry._id} entry={entry as Parameters<typeof OmmEntryRenderer>[0]['entry']} />
        ))}
      </div>

      {hasMore && (
        <button
          className={styles.loadMore}
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Load more'}
        </button>
      )}
    </>
  )
}
