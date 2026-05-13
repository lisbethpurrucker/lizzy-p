'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Footer.module.css'

const links = [
  { href: '/universe', label: 'Universe' },
  { href: '/words',    label: 'Words' },
  { href: '/omm',      label: 'OMM' },
  { href: '/us',       label: 'Open For' },
]

export default function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/studio')) return null

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div className={styles.top}>
          <div className={styles.message}>
            <p className={styles.line}>i&rsquo;m curious what you have to say.</p>
            <a href="mailto:sayhi@lisbethpurrucker.com" className={styles.cta}>
              hit me up →
            </a>
          </div>

          <nav className={styles.nav} aria-label="Footer navigation">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <Link href="/" className={styles.logo}>lizzyp_</Link>
          <span className={styles.copy}>© {new Date().getFullYear()} Lisbeth Purrucker</span>
        </div>

      </div>
    </footer>
  )
}
