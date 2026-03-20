'use client'

import { useState } from 'react'
import ProjectModal from '@/components/ProjectModal/ProjectModal'
import styles from './CategoryAccordion.module.css'

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

const RADIUS = 68

export default function CategoryAccordion({ categories, projects }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <div className={styles.list}>
        {categories.map((cat, i) => {
          const catProjects = projects.filter((p) => p.categorySlug === cat.slug)
          const isRight = i % 2 === 1
          const letters = cat.name.toUpperCase().split('')
          const n = letters.length

          return (
            <div
              key={cat._id}
              className={`${styles.category} ${isRight ? styles.right : ''}`}
            >
              {/* ── Circle text header ── */}
              <div className={styles.header}>
                <span className={styles.num}>0{i + 1}</span>

                <div className={styles.circleWrap}>
                  {letters.map((letter, li) => {
                    const angleDeg = (li / n) * 360 - 90
                    return (
                      <span
                        key={li}
                        className={styles.letter}
                        style={{
                          '--angle': `${angleDeg}deg`,
                          '--i': li,
                          '--n': n,
                          '--r': `${RADIUS}px`,
                        } as React.CSSProperties}
                      >
                        {letter === ' ' ? '\u00a0' : letter}
                      </span>
                    )
                  })}
                </div>

                {cat.introLine && (
                  <p className={styles.introLine}>{cat.introLine}</p>
                )}
              </div>

              {/* ── Expanding projects ── */}
              <div className={styles.projectsWrap}>
                <div className={styles.projectsInner}>
                  {catProjects.length > 0 ? (
                    <div className={styles.tagRow}>
                      {catProjects.map((project) => (
                        <button
                          key={project._id}
                          className={styles.projectTag}
                          onClick={() => setSelectedProject(project)}
                        >
                          {project.title}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.empty}>coming soon.</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
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
