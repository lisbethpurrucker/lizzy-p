'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
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

export default function CategoryAccordion({ categories, projects }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  function toggle(slug: string) {
    setOpenSlug((prev) => (prev === slug ? null : slug))
  }

  return (
    <>
      <div className={styles.accordion}>
        {categories.map((cat) => {
          const isOpen = openSlug === cat.slug
          const catProjects = projects.filter((p) => p.categorySlug === cat.slug)

          return (
            <div key={cat._id} className={styles.category}>
              <button
                className={`${styles.categoryHeader} ${isOpen ? styles.open : ''}`}
                onClick={() => toggle(cat.slug)}
                aria-expanded={isOpen}
              >
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.chevron} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
                <div className={styles.panelInner}>
                  {cat.introLine && (
                    <p className={styles.introLine}>{cat.introLine}</p>
                  )}
                  {catProjects.length > 0 ? (
                    <div className={styles.grid}>
                      {catProjects.map((project) => (
                        <button
                          key={project._id}
                          className={styles.projectCard}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className={styles.cardImage}>
                            {project.coverImage ? (
                              <Image
                                src={urlFor(project.coverImage).width(400).height(300).url()}
                                alt={project.title}
                                fill
                                className={styles.cardImg}
                              />
                            ) : (
                              <div className={styles.cardPlaceholder} />
                            )}
                          </div>
                          <p className={styles.cardTitle}>{project.title}</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.empty}>No projects yet.</p>
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
