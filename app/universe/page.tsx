import { client, isConfigured } from '@/sanity/lib/client'
import { getCategoriesQuery, getAllProjectsQuery } from '@/sanity/lib/queries'
import UniverseLayout from '@/components/UniverseLayout/UniverseLayout'
import styles from './page.module.css'

export const revalidate = 60

export default async function Universe() {
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

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <p className={styles.label}>my work</p>
        <h1 className={styles.title}>Universe</h1>
      </div>

      <UniverseLayout
        categories={categories as Parameters<typeof UniverseLayout>[0]['categories']}
        projects={projects as Parameters<typeof UniverseLayout>[0]['projects']}
      />
    </main>
  )
}
