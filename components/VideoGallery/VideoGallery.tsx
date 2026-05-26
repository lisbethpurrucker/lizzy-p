'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './VideoGallery.module.css'

type VideoEntry = {
  title?: string
  videoFile?: { url: string }
  videoUrl?: string
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null
}

function isVimeo(url: string): boolean {
  return url.includes('vimeo.com/')
}

function embedSrc(url: string): string {
  if (url.includes('youtu'))
    return url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
  if (url.includes('vimeo.com/'))
    return url.replace('vimeo.com/', 'player.vimeo.com/video/')
  return url
}

export default function VideoGallery({ videos, projectTitle }: { videos: VideoEntry[]; projectTitle: string }) {
  const [activeIdx, setActiveIdx]           = useState<number | null>(null)
  const [showScrollHint, setShowScrollHint] = useState(videos.length > 1)
  // vimeoThumbs[i] holds the fetched thumbnail URL for Vimeo entries
  const [vimeoThumbs, setVimeoThumbs]       = useState<Record<number, string>>({})
  const stripRef = useRef<HTMLDivElement>(null)

  // Fetch Vimeo thumbnails via oEmbed (client-side, no API key needed)
  useEffect(() => {
    videos.forEach((v, i) => {
      if (v.videoUrl && isVimeo(v.videoUrl)) {
        const oembed = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(v.videoUrl)}`
        fetch(oembed)
          .then(r => r.json())
          .then(data => {
            if (data.thumbnail_url) {
              setVimeoThumbs(prev => ({ ...prev, [i]: data.thumbnail_url }))
            }
          })
          .catch(() => { /* silently skip */ })
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activeIdx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIdx(null)
      if (e.key === 'ArrowRight') setActiveIdx(i => (i !== null && i < videos.length - 1 ? i + 1 : i))
      if (e.key === 'ArrowLeft')  setActiveIdx(i => (i !== null && i > 0 ? i - 1 : i))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIdx, videos.length])

  const active = activeIdx !== null ? videos[activeIdx] : null

  return (
    <>
      {/* ── Film strip ──────────────────────────────────────────── */}
      <div className={styles.stripWrap}>
        <div
          className={styles.strip}
          ref={stripRef}
          onScroll={() => {
            if (stripRef.current && stripRef.current.scrollLeft > 30)
              setShowScrollHint(false)
          }}
        >
          {videos.map((v, i) => {
            const ytThumb    = v.videoUrl ? getYouTubeThumbnail(v.videoUrl) : null
            const vimThumb   = vimeoThumbs[i] ?? null
            const hasThumb   = !!(ytThumb || vimThumb)

            return (
              <button
                key={i}
                className={styles.frame}
                onClick={() => setActiveIdx(i)}
                aria-label={v.title || `Video ${i + 1}`}
              >
                <div className={styles.imgWrap}>
                  {/* Uploaded video file — browser renders first frame */}
                  {v.videoFile?.url && !hasThumb ? (
                    <video
                      src={`${v.videoFile.url}#t=0.5`}
                      className={styles.thumb}
                      preload="metadata"
                      muted
                      playsInline
                    />
                  ) : ytThumb ? (
                    <img src={ytThumb} alt={v.title ?? ''} className={styles.thumb} />
                  ) : vimThumb ? (
                    <img src={vimThumb} alt={v.title ?? ''} className={styles.thumb} />
                  ) : (
                    <div className={styles.placeholder} />
                  )}
                  <span className={styles.playIcon}>▶</span>
                </div>
                <div className={styles.meta}>
                  <span className={styles.num}>{String(i + 1).padStart(3, '0')}</span>
                  {v.title && <span className={styles.frameTitle}>{v.title}</span>}
                </div>
              </button>
            )
          })}
        </div>

        {showScrollHint && (
          <div className={styles.scrollHint} aria-hidden="true">
            <span className={styles.scrollHintArrow}>→</span>
          </div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      {active && (
        <div className={styles.lightbox} onClick={() => setActiveIdx(null)}>
          <button className={styles.lightboxClose} onClick={() => setActiveIdx(null)}>×</button>

          {activeIdx! > 0 && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={e => { e.stopPropagation(); setActiveIdx(i => i! - 1) }}
            >←</button>
          )}
          {activeIdx! < videos.length - 1 && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={e => { e.stopPropagation(); setActiveIdx(i => i! + 1) }}
            >→</button>
          )}

          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            {active.videoFile?.url ? (
              <video
                src={active.videoFile.url}
                controls
                autoPlay
                playsInline
                className={styles.lightboxMedia}
              />
            ) : active.videoUrl ? (
              <iframe
                src={`${embedSrc(active.videoUrl)}?autoplay=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className={styles.lightboxMedia}
                title={active.title ?? projectTitle}
              />
            ) : null}

            <div className={styles.lightboxMeta}>
              {active.title && (
                <span className={styles.lightboxTitle}>{active.title}</span>
              )}
              <span className={styles.lightboxCount}>{activeIdx! + 1} / {videos.length}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
