'use client'

import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import styles from './CvViewer.module.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  url: string
  downloadUrl: string
}

export default function CvViewer({ url, downloadUrl }: Props) {
  const [numPages, setNumPages] = useState<number>(0)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setContainerWidth(node.clientWidth)
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.pageCount}>
          {numPages > 0 ? `${numPages} page${numPages > 1 ? 's' : ''}` : ''}
        </span>
        <a href={downloadUrl} download className={styles.download}>
          download PDF ↓
        </a>
      </div>

      <div ref={containerRef} className={styles.pages}>
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className={styles.loading}>loading…</div>}
          error={<div className={styles.error}>could not load PDF.</div>}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={containerWidth || undefined}
              className={styles.page}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  )
}
