import { client, isConfigured } from '@/sanity/lib/client'
import { getCategoriesQuery, getAllProjectsQuery } from '@/sanity/lib/queries'
import SolarSystem from '@/components/SolarSystem/SolarSystem'
import styles from './page.module.css'

export const revalidate = 60

export default async function Universe({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  let categories: unknown[] = []
  let projects: unknown[] = []

  if (isConfigured) {
    try {
      ;[categories, projects] = await Promise.all([
        client.fetch(getCategoriesQuery),
        client.fetch(getAllProjectsQuery),
      ])
    } catch { /* render with empty data */ }
  }

  const { category: initialCategorySlug } = await searchParams

  return (
    <main className={styles.page}>
      <SolarSystem
        categories={categories as Parameters<typeof SolarSystem>[0]['categories']}
        projects={projects as Parameters<typeof SolarSystem>[0]['projects']}
        initialCategorySlug={initialCategorySlug}
      />
    </main>
  )
}
