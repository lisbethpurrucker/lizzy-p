'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

const links = [
  { href: '/universe',  label: 'Universe' },
  { href: '/words',     label: 'Words' },
  { href: '/omm',       label: 'OMM' },
  { href: '/us',        label: 'Open For' },
]

// ── Live moon phase + zodiac ─────────────────────────────────────────────────
const MOON_REF    = Date.UTC(2000, 0, 6, 18, 14, 0)
const MOON_PERIOD = 29.530588853
const ZODIAC_SIGNS = ['aries','taurus','gemini','cancer','leo','virgo',
                      'libra','scorpio','sagittarius','capricorn','aquarius','pisces']
const ZODIAC_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

function getMoonPhase() {
  const days  = ((Date.now() - MOON_REF) / 86400000 % MOON_PERIOD + MOON_PERIOD) % MOON_PERIOD
  const phase = days / MOON_PERIOD
  const cosP  = Math.cos(phase * 2 * Math.PI)
  const r = 11, cx = 11, cy = 11
  const ex = Math.abs(r * cosP)

  let path: string
  if (phase < 0.5) {
    const sweep = cosP > 0 ? 0 : 1
    path = `M ${cx},${cy - r} A ${r},${r} 0 0 1 ${cx},${cy + r} A ${ex},${r} 0 0 ${sweep} ${cx},${cy - r} Z`
  } else {
    const sweep = cosP > 0 ? 1 : 0
    path = `M ${cx},${cy - r} A ${r},${r} 0 0 0 ${cx},${cy + r} A ${ex},${r} 0 0 ${sweep} ${cx},${cy - r} Z`
  }

  let name: string
  if      (phase < 0.03 || phase > 0.97) name = 'new moon'
  else if (phase < 0.22) name = 'waxing crescent'
  else if (phase < 0.28) name = 'first quarter'
  else if (phase < 0.47) name = 'waxing gibbous'
  else if (phase < 0.53) name = 'full moon'
  else if (phase < 0.72) name = 'waning gibbous'
  else if (phase < 0.78) name = 'last quarter'
  else                   name = 'waning crescent'

  // Zodiac: moon moves ~13.18°/day, ref lon 280° at MOON_REF new moon
  const d = (Date.now() - MOON_REF) / 86400000
  const lon = ((280 + d * (360 / 27.32158)) % 360 + 360) % 360
  const signIdx = Math.floor(lon / 30)

  return { path, name, glyph: ZODIAC_GLYPHS[signIdx], sign: ZODIAC_SIGNS[signIdx] }
}

function MoonIcon() {
  const { path } = getMoonPhase()
  const cx = 11, cy = 11, r = 11
  return (
    <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="var(--text)" />
      <clipPath id="moon-clip"><circle cx={cx} cy={cy} r={r - 0.5} /></clipPath>
      <g clipPath="url(#moon-clip)"><path d={path} fill="#ebd9b0" /></g>
      <circle cx={cx} cy={cy} r={r - 0.5} fill="none" stroke="rgba(0,0,0,0.25)" />
    </svg>
  )
}

export default function Nav() {
  const pathname   = usePathname()
  const [open, setOpen]         = useState(false)
  const [light, setLight]       = useState(true)
  const [moonHover, setMoonHover] = useState(false)
  const moon = getMoonPhase()

  useEffect(() => {
    const stored  = localStorage.getItem('theme') ?? 'light'
    const isLight = stored !== 'dark'
    setLight(isLight)
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  function toggleTheme() {
    const next  = !light
    setLight(next)
    const theme = next ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  useEffect(() => { setOpen(false) }, [pathname])

  if (pathname.startsWith('/studio')) return null

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>lizzyp.</Link>
          <div className={styles.controls}>
            <div
              className={styles.moonWrap}
              onMouseEnter={() => setMoonHover(true)}
              onMouseLeave={() => setMoonHover(false)}
            >
              <div
                className={`${styles.moonAnnotationNav} ${moonHover ? styles.moonAnnotationNavVisible : ''}`}
                aria-hidden="true"
              >
                <div className={styles.moonAnnotationText}>
                  <span className={styles.moonAnnotationPhase}>{moon.name}</span>
                  <span className={styles.moonAnnotationSign}>in {moon.sign}</span>
                  <span className={styles.moonAnnotationMode}>{light ? 'switch to dark mode' : 'switch to light mode'}</span>
                </div>
              </div>
              <button
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                <MoonIcon />
              </button>
            </div>
            <button
              className={styles.toggle}
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? '[close]' : '[menu]'}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        aria-hidden={!open}
      >
        <nav aria-label="Main navigation">
          {links.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className={styles.bracket}>[{i}]</span>
              <span>{label.toUpperCase()}</span>
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
