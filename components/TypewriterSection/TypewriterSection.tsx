'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import styles from './TypewriterSection.module.css'

const SPEED_STEPS = [
  { ms: 55, label: '×2' },
  { ms: 27, label: '×4' },
  { ms: 13, label: '⏭'  },
]

const REWIND_MS = 16 // fast rewind — removes one char every 16ms

export default function TypewriterSection({ text }: { text: string }) {
  const ref         = useRef<HTMLElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const posRef      = useRef(0)

  const [displayed, setDisplayed] = useState('')
  const [done,      setDone]      = useState(false)
  const [started,   setStarted]   = useState(false)
  const [paused,    setPaused]    = useState(false)
  const [rewinding, setRewinding] = useState(false)
  const [speedStep, setSpeedStep] = useState(0)
  const startedRef = useRef(false)

  const clearTick = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const startForward = useCallback((ms: number) => {
    clearTick()
    setRewinding(false)
    if (ms === 0) {
      posRef.current = text.length
      setDisplayed(text)
      setDone(true)
      return
    }
    intervalRef.current = setInterval(() => {
      posRef.current++
      setDisplayed(text.slice(0, posRef.current))
      if (posRef.current >= text.length) {
        setDone(true)
        clearTick()
      }
    }, ms)
  }, [text, clearTick])

  // Rewind: erase characters backwards, then auto-play forward when done
  const startRewind = useCallback(() => {
    clearTick()
    setDone(false)
    setPaused(false)
    setRewinding(true)
    setSpeedStep(0)

    intervalRef.current = setInterval(() => {
      if (posRef.current <= 0) {
        clearTick()
        setRewinding(false)
        // auto-play forward once we've rewound to the start
        startForward(SPEED_STEPS[0].ms)
        return
      }
      posRef.current--
      setDisplayed(text.slice(0, posRef.current))
    }, REWIND_MS)
  }, [text, clearTick, startForward])

  const handlePausePlay = useCallback(() => {
    if (rewinding) {
      // stop rewind and pause at current position
      clearTick()
      setRewinding(false)
      setPaused(true)
      return
    }
    if (done) { startRewind(); return }
    if (paused) {
      setPaused(false)
      startForward(SPEED_STEPS[speedStep].ms)
    } else {
      setPaused(true)
      clearTick()
    }
  }, [rewinding, done, paused, speedStep, startForward, clearTick, startRewind])

  const handleSpeedUp = useCallback(() => {
    if (done || rewinding) return
    const next = speedStep + 1
    if (next >= SPEED_STEPS.length) {
      startForward(0) // instant end
      return
    }
    setSpeedStep(next)
    setPaused(false)
    startForward(SPEED_STEPS[next].ms)
  }, [done, rewinding, speedStep, startForward])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          setStarted(true)
          startForward(SPEED_STEPS[0].ms)
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearTick() }
  }, [startForward, clearTick])

  const playIcon = done ? '↺' : paused ? '▶' : '⏸'

  return (
    <section ref={ref} className={styles.section}>
      <p className={styles.eyebrow}>↳ on the record</p>

      {started && (
        <div className={styles.controls} role="group" aria-label="Playback controls">
          <button
            className={`${styles.controlBtn} ${rewinding ? styles.controlBtnActive : ''}`}
            onClick={startRewind}
            aria-label="Rewind"
          >⏮</button>

          <button
            className={styles.controlBtn}
            onClick={handlePausePlay}
            aria-label={playIcon}
          >{playIcon}</button>

          <button
            className={`${styles.controlBtn} ${styles.speedBtn} ${(done || rewinding) ? styles.controlBtnDone : ''}`}
            onClick={handleSpeedUp}
            disabled={done || rewinding}
            aria-label="Speed up"
          >
            {SPEED_STEPS[Math.min(speedStep, SPEED_STEPS.length - 1)].label}
          </button>
        </div>
      )}

      <div className={styles.textWrap}>
        <span className={styles.ghost} aria-hidden="true">{text}</span>
        <span className={styles.live}>
          {displayed}
          {!done && !paused && <span className={styles.cursor}       aria-hidden="true">▌</span>}
          {!done &&  paused && <span className={styles.cursorPaused} aria-hidden="true">▌</span>}
        </span>
      </div>
    </section>
  )
}
