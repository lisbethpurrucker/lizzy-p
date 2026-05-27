'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './MediaGrid.module.css'

type VideoEntry = { title?: string; videoFile?: { url: string }; videoUrl?: string }
type ImageEntry = { url: string; alt: string }

type MediaItem =
  | { kind: 'image'; url: string; alt: string }
  | { kind: 'video'; entry: VideoEntry; thumbUrl: string | null }

function embedSrc(url: string): string {
  if (url.includes('youtu'))
    return url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
  if (url.includes('vimeo.com/'))
    return url.replace('vimeo.com/', 'player.vimeo.com/video/')
  return url
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null
}

// Uploaded video cell — lazy-loads (src only set when in viewport) and
// hides the play icon once the video actually starts playing.
function VideoCell({ url, onOpen, label }: { url: string; onOpen: () => void; label: string }) {
  const [playing, setPlaying]   = useState(false)
  const [activeSrc, setActiveSrc] = useState<string | undefined>(undefined)
  const wrapRef  = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Only assign src (and start downloading) once the cell enters the viewport
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSrc(url)
          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [url])

  // Play as soon as the src is set and metadata is ready
  useEffect(() => {
    if (activeSrc && videoRef.current) {
      videoRef.current.play().catch(() => {/* autoplay blocked — leave paused */})
    }
  }, [activeSrc])

  return (
    <button ref={wrapRef} className={styles.cell} onClick={onOpen} aria-label={label}>
      <video
        ref={videoRef}
        src={activeSrc}
        className={styles.thumb}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && <span className={styles.playIcon}>▶</span>}
    </button>
  )
}

interface Props {
  videos: VideoEntry[]
  images: ImageEntry[]
}

export default function MediaGrid({ videos, images }: Props) {
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null)
  const [vimeoThumbs, setVimeoThumbs] = useState<Record<number, string>>({})

  useEffect(() => {
    videos.forEach((v, i) => {
      if (v.videoUrl && v.videoUrl.includes('vimeo.com/')) {
        fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(v.videoUrl)}`)
          .then(r => r.json())
          .then(data => {
            if (data.thumbnail_url)
              setVimeoThumbs(prev => ({ ...prev, [i]: data.thumbnail_url }))
          })
          .catch(() => {})
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const items: MediaItem[] = [
    ...videos.map((entry, i) => ({
      kind: 'video' as const,
      entry,
      thumbUrl: entry.videoUrl
        ? (getYouTubeThumbnail(entry.videoUrl) ?? vimeoThumbs[i] ?? null)
        : null,
    })),
    ...images.map(img => ({ kind: 'image' as const, url: img.url, alt: img.alt })),
  ]

  if (items.length === 0) return null

  return (
    <>
      <div className={styles.grid}>
        {items.map((item, i) => {
          // Uploaded video files get their own component so the play icon
          // can disappear once the video actually starts playing
          if (item.kind === 'video' && item.entry.videoFile?.url) {
            return (
              <VideoCell
                key={i}
                url={item.entry.videoFile.url}
                onOpen={() => setActiveItem(item)}
                label={item.entry.title ?? `Video ${i + 1}`}
              />
            )
          }

          return (
          <button
            key={i}
            className={styles.cell}
            onClick={() => setActiveItem(item)}
            aria-label={item.kind === 'video' ? (item.entry.title ?? `Video ${i + 1}`) : item.alt}
          >
            {item.kind === 'image' ? (
              <Image
                src={item.url}
                alt={item.alt}
                fill
                className={styles.thumb}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ) : item.thumbUrl ? (
              <>
                <img src={item.thumbUrl} alt={item.entry.title ?? ''} className={styles.thumb} />
                <span className={styles.playIcon}>▶</span>
              </>
            ) : (
              <>
                <div className={styles.placeholder} />
                <span className={styles.playIcon}>▶</span>
              </>
            )}
          </button>
          )
        })}
      </div>

      {/* Lightbox */}
      {activeItem && (
        <div className={styles.lightbox} onClick={() => setActiveItem(null)}>
          <button className={styles.lightboxClose} onClick={() => setActiveItem(null)} aria-label="Close">×</button>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            {activeItem.kind === 'image' ? (
              <img src={activeItem.url} alt={activeItem.alt} className={styles.lightboxMedia} />
            ) : activeItem.entry.videoFile?.url ? (
              <video
                src={activeItem.entry.videoFile.url}
                controls
                autoPlay
                playsInline
                className={styles.lightboxMedia}
              />
            ) : activeItem.entry.videoUrl ? (
              <iframe
                src={`${embedSrc(activeItem.entry.videoUrl)}?autoplay=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className={styles.lightboxMedia}
                title={activeItem.entry.title ?? ''}
              />
            ) : null}
            {activeItem.kind === 'video' && activeItem.entry.title && (
              <p className={styles.lightboxTitle}>{activeItem.entry.title}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
