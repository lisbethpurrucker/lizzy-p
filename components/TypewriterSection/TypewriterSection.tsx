'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './TypewriterSection.module.css'

export default function TypewriterSection({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true

          let i = 0
          const tick = setInterval(() => {
            i++
            setDisplayed(text.slice(0, i))
            if (i >= text.length) {
              setDone(true)
              clearInterval(tick)
            }
          }, 22)
        }
      },
      { threshold: 0.15 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [text])

  return (
    <div ref={ref} className={styles.section}>
      <div className={styles.window}>
        <div className={styles.titleBar}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.body}>
          <span className={styles.arrow}>&gt;&gt;</span>
          <div className={styles.textWrap}>
            {/* ghost: invisible full text locks the container height */}
            <span className={styles.ghost} aria-hidden="true">{text}</span>
            {/* live: typed text sits on top */}
            <span className={styles.text}>
              {displayed}
              {!done && <span className={styles.cursor} aria-hidden="true">▌</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
