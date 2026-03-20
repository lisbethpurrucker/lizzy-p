import { client, isConfigured } from '@/sanity/lib/client'
import { getCategoriesQuery, getAllProjectsQuery } from '@/sanity/lib/queries'
import CategoryAccordion from '@/components/CategoryAccordion/CategoryAccordion'
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
      <div className={styles.header}>
        <p className={styles.label}>my universe</p>
        <h1 className={styles.title}>Universe</h1>
      </div>

      <CategoryAccordion
        categories={categories as Parameters<typeof CategoryAccordion>[0]['categories']}
        projects={projects as Parameters<typeof CategoryAccordion>[0]['projects']}
      />
    </main>
  )
}
