'use client'

import { useState } from 'react'
import ProjectModal from '@/components/ProjectModal/ProjectModal'
import styles from './UniverseLayout.module.css'

interface Category {
  _id: string
  name: string
  introLine?: string
  slug: string
  order?: number
}

interface Project {
  _id: string
  title: string
  categorySlug: string
  coverImage?: { asset: { _ref: string } }
  description?: unknown[]
  tags?: string[]
  externalLink?: string
  gallery?: Array<{ asset: { _ref: string } }>
}

interface Props {
  categories: Category[]
  projects: Project[]
}

// Deterministic scatter positions for collage feel
const SCATTER = [
  { x:  8, y: 10, r:  -8 },
  { x: 52, y:  6, r:   5 },
  { x: 25, y: 44, r:  -5 },
  { x: 63, y: 48, r:  10 },
  { x: 10, y: 66, r:   7 },
  { x: 50, y: 70, r:  -9 },
  { x: 74, y: 22, r:   3 },
  { x: 70, y: 68, r:  -6 },
]

export default function UniverseLayout({ categories, projects }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <div className={styles.layout}>

        {/* ── Left sidebar: category list ── */}
        <aside className={styles.sidebar}>
          {categories.map((cat, i) => (
            <button
              key={cat._id}
              className={`${styles.catItem} ${activeSlug === cat.slug ? styles.catActive : ''}`}
              onClick={() => setActiveSlug(s => s === cat.slug ? null : cat.slug)}
            >
              <span className={styles.catNum}>0{i + 1}</span>
              <span className={styles.catName}>{cat.name}</span>
            </button>
          ))}
        </aside>

        {/* ── Right: collage area ── */}
        <div className={styles.collage}>

          {/* Planets */}
          <div className={styles.planetLarge} />
          <div className={styles.planetSmall} />
          <div className={styles.planetTiny} />

          {/* Decorative stars */}
          <span className={styles.star} style={{ top: '12%', left: '18%' }}>+</span>
          <span className={styles.star} style={{ top: '38%', left: '72%' }}>+</span>
          <span className={styles.star} style={{ top: '62%', left: '28%' }}>+</span>
          <span className={styles.star} style={{ top: '80%', left: '78%' }}>+</span>
          <span className={styles.starDiamond} style={{ top: '25%', left: '55%' }}>◆</span>

          {/* Decorative bracket elements */}
          <span className={styles.bracket} style={{ top: '8%', right: '8%' }} />
          <span className={styles.bracketBl} style={{ bottom: '12%', left: '8%' }} />

          {/* Project cards per category */}
          {categories.map((cat) => {
            const catProjects = projects.filter((p) => p.categorySlug === cat.slug)
            const isActive = activeSlug === cat.slug

            return catProjects.map((project, pi) => {
              const pos = SCATTER[pi % SCATTER.length]
              return (
                <button
                  key={project._id}
                  className={`${styles.card} ${isActive ? styles.cardVisible : ''}`}
                  style={{
                    left: `${pos.x}%`,
                    top:  `${pos.y}%`,
                    '--r': `${pos.r}deg`,
                    transitionDelay: isActive ? `${pi * 55}ms` : '0ms',
                  } as React.CSSProperties}
                  onClick={() => setSelectedProject(project)}
                >
                  <span className={styles.cardTitle}>{project.title}</span>
                </button>
              )
            })
          })}

          {/* Idle hint */}
          {!activeSlug && (
            <p className={styles.hint}>select a category</p>
          )}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}
