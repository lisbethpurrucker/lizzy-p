'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

const links = [
  { href: '/universe', label: 'Universe' },
  { href: '/words',    label: 'Words' },
  { href: '/omm',      label: 'OMM' },
  { href: '/us',       label: 'Us' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme') ?? 'light'
    const isLight = stored === 'light'
    setLight(isLight)
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  function toggleTheme() {
    const next = !light
    setLight(next)
    const theme = next ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  // Close on navigation
  useEffect(() => { setOpen(false) }, [pathname])

  if (pathname.startsWith('/studio')) return null

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>lizzyp_</Link>
          <div className={styles.controls}>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              title={light ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              ☯
            </button>
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
