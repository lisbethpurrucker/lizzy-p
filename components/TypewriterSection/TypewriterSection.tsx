'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './TypewriterSection.module.css'

export default function TypewriterSection({ text }: { text: string }) {
  const ref    = useRef<HTMLElement>(null)
  const [displayed, setDisplayed] = useState('')
  const [done, setDone]           = useState(false)
  const startedRef                = useRef(false)

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
            if (i >= text.length) { setDone(true); clearInterval(tick) }
          }, 18)
        }
      },
      { threshold: 0.1 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [text])

  return (
    <section ref={ref} className={styles.section}>
      <p className={styles.eyebrow}>↳ on the record</p>

      <div className={styles.textWrap}>
        {/* ghost reserves the full height while text types in */}
        <span className={styles.ghost} aria-hidden="true">{text}</span>
        <span className={styles.live}>
          {displayed}
          {!done && <span className={styles.cursor} aria-hidden="true">▌</span>}
        </span>
      </div>
    </section>
  )
}
