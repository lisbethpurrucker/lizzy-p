'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import styles from './ProjectModal.module.css'

interface Project {
  _id: string
  title: string
  coverImage?: { asset: { _ref: string } }
  description?: unknown[]
  tags?: string[]
  externalLink?: string
  gallery?: Array<{ asset: { _ref: string } }>
}

interface Props {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, lightboxIndex])

  // Trap focus inside modal
  useEffect(() => {
    const el = modalRef.current
    if (!el) return
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    el.addEventListener('keydown', trap)
    return () => el.removeEventListener('keydown', trap)
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className={styles.modal}
        ref={modalRef}
      >
        <div className={styles.inner}>
          {/* Header */}
          <div className={styles.modalHeader}>
            <h2 className={styles.title}>{project.title}</h2>
            <button
              className={styles.close}
              onClick={onClose}
              aria-label="Close"
              ref={closeRef}
            >
              ✕
            </button>
          </div>

          {/* Cover image */}
          {project.coverImage && (
            <div className={styles.coverWrap}>
              <Image
                src={urlFor(project.coverImage).width(800).url()}
                alt={project.title}
                width={800}
                height={500}
                className={styles.cover}
              />
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}

          {/* Description */}
          {project.description && project.description.length > 0 && (
            <div className={styles.description}>
              <PortableText value={project.description as Parameters<typeof PortableText>[0]['value']} />
            </div>
          )}

          {/* External link */}
          {project.externalLink && (
            <a
              href={project.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              View project ↗
            </a>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className={styles.galleryWrap}>
              <div className={styles.gallery}>
                {project.gallery.map((img, i) => (
                  <button
                    key={i}
                    className={styles.galleryThumb}
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={urlFor(img).width(300).height(220).url()}
                      alt=""
                      width={300}
                      height={220}
                      className={styles.galleryImg}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && project.gallery && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image enlarged"
        >
          <Image
            src={urlFor(project.gallery[lightboxIndex]).width(1200).url()}
            alt=""
            width={1200}
            height={900}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={styles.lightboxClose}
            onClick={() => setLightboxIndex(null)}
            aria-label="Close image"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
