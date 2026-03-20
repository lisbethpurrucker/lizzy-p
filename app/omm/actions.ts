'use server'

import { client } from '@/sanity/lib/client'
import { getOmmEntriesQuery, getOmmEntryCountQuery } from '@/sanity/lib/queries'

export async function fetchOmmEntries(start: number, end: number) {
  return client.fetch(getOmmEntriesQuery, { start, end })
}

export async function fetchOmmEntryCount(): Promise<number> {
  return client.fetch(getOmmEntryCountQuery)
}
