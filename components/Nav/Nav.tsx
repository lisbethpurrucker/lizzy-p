'use client'

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
  if (pathname.startsWith('/studio')) return null

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>lizzyp.</Link>
        <nav className={styles.nav} aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
