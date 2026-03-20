import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import styles from './OmmEntryRenderer.module.css'

interface OmmEntry {
  _id: string
  publishedAt: string
  entryType: 'image' | 'quote' | 'sketch' | 'link' | 'video' | 'audio'
  image?: { asset: { _ref: string } }
  caption?: string
  quoteText?: string
  attribution?: string
  url?: string
  linkTitle?: string
  linkDescription?: string
  linkImage?: { asset: { _ref: string } }
  videoFile?: { asset: { url: string } }
  videoUrl?: string
  audioFile?: { asset: { url: string } }
}

function Timestamp({ iso }: { iso: string }) {
  const d = new Date(iso)
  const formatted = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return <p className={styles.timestamp}>{formatted}</p>
}

export default function OmmEntryRenderer({ entry }: { entry: OmmEntry }) {
  return (
    <div className={styles.entry}>
      <EntryContent entry={entry} />
      <Timestamp iso={entry.publishedAt} />
    </div>
  )
}

function EntryContent({ entry }: { entry: OmmEntry }) {
  switch (entry.entryType) {
    case 'image':
    case 'sketch':
      return (
        <div className={styles.imageWrap}>
          {entry.image && (
            <Image
              src={urlFor(entry.image).width(800).url()}
              alt={entry.caption || ''}
              width={800}
              height={600}
              className={styles.image}
            />
          )}
          {entry.caption && <p className={styles.caption}>{entry.caption}</p>}
        </div>
      )

    case 'quote':
      return (
        <blockquote className={styles.quote}>
          <p className={styles.quoteText}>&ldquo;{entry.quoteText}&rdquo;</p>
          {entry.attribution && (
            <footer className={styles.attribution}>— {entry.attribution}</footer>
          )}
        </blockquote>
      )

    case 'link':
      return (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkCard}
        >
          {entry.linkImage && (
            <div className={styles.linkImageWrap}>
              <Image
                src={urlFor(entry.linkImage).width(400).url()}
                alt={entry.linkTitle || ''}
                fill
                className={styles.linkImage}
              />
            </div>
          )}
          <div className={styles.linkBody}>
            {entry.linkTitle && <p className={styles.linkTitle}>{entry.linkTitle}</p>}
            {entry.linkDescription && (
              <p className={styles.linkDescription}>{entry.linkDescription}</p>
            )}
            <span className={styles.linkUrl}>{entry.url}</span>
          </div>
        </a>
      )

    case 'video':
      if (entry.videoUrl) {
        const isYouTube = entry.videoUrl.includes('youtube.com') || entry.videoUrl.includes('youtu.be')
        const isVimeo = entry.videoUrl.includes('vimeo.com')

        if (isYouTube || isVimeo) {
          const src = isYouTube
            ? entry.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
            : entry.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')
          return (
            <div className={styles.videoWrap}>
              <iframe
                src={src}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className={styles.iframe}
                title={entry.caption || 'video'}
              />
              {entry.caption && <p className={styles.caption}>{entry.caption}</p>}
            </div>
          )
        }
      }
      if (entry.videoFile?.asset?.url) {
        return (
          <div className={styles.videoWrap}>
            <video src={entry.videoFile.asset.url} controls className={styles.video} />
            {entry.caption && <p className={styles.caption}>{entry.caption}</p>}
          </div>
        )
      }
      return null

    case 'audio':
      if (entry.audioFile?.asset?.url) {
        return (
          <div className={styles.audioWrap}>
            <audio src={entry.audioFile.asset.url} controls className={styles.audio} />
            {entry.caption && <p className={styles.caption}>{entry.caption}</p>}
          </div>
        )
      }
      return null

    default:
      return null
  }
}
