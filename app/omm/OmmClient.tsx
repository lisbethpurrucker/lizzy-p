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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  }).toUpperCase()
}

export default function OmmClient({ initialEntries, totalCount }: Props) {
  const [entries, setEntries] = useState<OmmEntry[]>(initialEntries)
  const [loading, setLoading]  = useState(false)

  const hasMore = entries.length < totalCount

  async function loadMore() {
    setLoading(true)
    try {
      const more = await fetchOmmEntries(entries.length, entries.length + PAGE_SIZE)
      setEntries(prev => [...prev, ...more])
    } finally {
      setLoading(false)
    }
  }

  if (entries.length === 0) {
    return (
      <div className={styles.entries}>
        <div className={styles.entry}>
          <p className={styles.entryContent}>Nothing yet. Check back soon.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.entries}>
        {entries.map(entry => (
          <div key={entry._id} className={styles.entry}>
            <div className={styles.entryMeta}>
              <span className={styles.timestamp}>{formatDate(entry.publishedAt)}</span>
              <span className={styles.entryType}>{entry.entryType}</span>
            </div>
            <div className={styles.entryBody}>
              <OmmEntryRenderer entry={entry as Parameters<typeof OmmEntryRenderer>[0]['entry']} />
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          className={styles.loadMore}
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? '…' : '▼  load more'}
        </button>
      )}

      <div className={styles.windowFoot}>— end of tape —</div>
    </>
  )
}
